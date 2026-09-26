routerAdd("POST", "/api/breezy/client-portal", (e) => {
  const attempts = globalThis.__clientPortalAttempts || {};
  globalThis.__clientPortalAttempts = attempts;

  function clientPortalAllowed(ip) {
    const now = Date.now();
    const recent = (attempts[ip] || []).filter(
      (attemptedAt) => now - attemptedAt < 60 * 1000,
    );
    recent.push(now);
    attempts[ip] = recent;
    return recent.length <= 5;
  }

  function clientPortalInvalid() {
    return e.json(200, { verified: false });
  }

  function clientPortalDate(record, preferredField) {
    const preferred = record.getString(preferredField);
    return preferred || record.getString("created");
  }

  const dao = typeof $app.dao === "function" ? $app.dao() : $app;
  const requestInfo =
    typeof e.requestInfo === "function"
      ? e.requestInfo()
      : $apis.requestInfo(e);

  if (!clientPortalAllowed(e.realIP())) {
    return e.json(429, { verified: false, reason: "rate_limited" });
  }

  const body = requestInfo.body || requestInfo.data || {};
  const memberCode = String(body.memberCode || "")
    .replace(/\s+/g, "")
    .toUpperCase();
  const phoneLast4 = String(body.phoneLast4 || "").replace(/\D/g, "");
  if (!/^[A-Z]{2}\d{4}$/.test(memberCode) || !/^\d{4}$/.test(phoneLast4)) {
    return clientPortalInvalid();
  }

  let member;
  try {
    member = dao.findFirstRecordByData("members", "member_code", memberCode);
  } catch {
    return clientPortalInvalid();
  }

  if (member.getString("status") === "archived") {
    return clientPortalInvalid();
  }

  const phoneDigits = member.getString("phone").replace(/\D/g, "");
  if (phoneDigits.slice(-4) !== phoneLast4) {
    return clientPortalInvalid();
  }

  const memberships = dao.findRecordsByFilter(
    "memberships",
    "member = {:member} && status != 'cancelled'",
    "-created",
    1,
    0,
    { member: member.id },
  );
  const membership = memberships.length ? memberships[0] : null;
  const remaining = membership
    ? Math.max(
        0,
        membership.getInt("credits_total") - membership.getInt("credits_used"),
      )
    : 0;

  const redemptions = dao.findRecordsByFilter(
    "redemptions",
    "member = {:member} && voided = false",
    "-redeemed_at",
    20,
    0,
    { member: member.id },
  );
  const activity = redemptions.map((record) => {
    const kind = record.getString("kind");
    return {
      kind,
      date: clientPortalDate(record, "redeemed_at"),
      amount:
        kind === "meal"
          ? -1
          : kind === "adjustment"
            ? record.getInt("amount")
            : 0,
    };
  });

  const orders = dao.findRecordsByFilter(
    "comandas",
    "status = 'ready' && (member = {:member} || (member = '' && member_code = {:code}))",
    "-placed_at",
    12,
    0,
    { member: member.id, code: memberCode },
  );
  const orderHistory = orders.map((order) => {
    const lines = dao.findRecordsByFilter(
      "comanda_lines",
      "comanda = {:comanda}",
      "sort_order",
      50,
      0,
      { comanda: order.id },
    );
    return {
      number: order.getInt("order_number"),
      placedAt: clientPortalDate(order, "placed_at"),
      completedAt: clientPortalDate(order, "completed_at"),
      mode: order.getString("mode"),
      total: order.getFloat("total"),
      promoLabel: order.getString("promo_label"),
      items: lines.map((line) => ({
        name: line.getString("item_name"),
        quantity: line.getInt("quantity"),
      })),
    };
  });

  return e.json(200, {
    verified: true,
    balance: {
      remaining,
      period: membership ? membership.getString("period") : "",
    },
    activity,
    orders: orderHistory,
  });
});
