import assert from "node:assert/strict";
import test from "node:test";

import {
  addMembershipPaymentSchema,
  membershipPaymentCollection,
} from "../scripts/add-membership-payment-schema.js";

const STAFF = '@request.auth.id != ""';
const MEGA_STAFF = "@request.auth.verified = true";

function sourceSchema() {
  return [
    { id: "_pb_users_auth_", name: "users", type: "auth", schema: [] },
    { id: "5r730r7vsiilgv0", name: "members", type: "base", schema: [] },
    {
      id: "10yv9mmef5frnko",
      name: "memberships",
      type: "base",
      schema: [],
    },
    {
      id: "mdhlk8k1bjda3xg",
      name: "redemptions",
      type: "base",
      schema: [{ id: "amount01", name: "amount", type: "number" }],
      indexes: [],
    },
  ];
}

test("adds payment requests without replacing existing schema", () => {
  const source = sourceSchema();
  const output = addMembershipPaymentSchema(source);

  assert.equal(output.length, source.length + 1);
  assert.equal(source[3].schema.length, 1);
  assert.equal(output[0], source[0]);
  assert.ok(
    output.some(
      (collection) => collection.name === "membership_payment_requests",
    ),
  );
});

test("accepts constrained public submissions and limits review to staff", () => {
  const collection = membershipPaymentCollection();

  assert.equal(collection.listRule, STAFF);
  assert.equal(collection.viewRule, STAFF);
  assert.equal(collection.updateRule, STAFF);
  assert.equal(collection.deleteRule, MEGA_STAFF);
  assert.match(collection.createRule, /status = "submitted"/);
  assert.match(collection.createRule, /offer_code = "meal-pack-5"/);
  assert.match(collection.createRule, /payment_method = "transfer"/);
  assert.match(collection.createRule, /payment_proof != ""/);
  assert.match(collection.createRule, /payment_method = "in_store"/);
  assert.match(collection.createRule, /approved_credits = 0/);
});

test("stores payment proof as a protected image", () => {
  const proof = membershipPaymentCollection().schema.find(
    (field) => field.name === "payment_proof",
  );

  assert.equal(proof?.type, "file");
  assert.equal(proof?.options.protected, true);
  assert.equal(proof?.options.maxSelect, 1);
  assert.equal(proof?.options.maxSize, 5 * 1024 * 1024);
  assert.deepEqual(proof?.options.mimeTypes, [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);
});

test("links one redemption ledger record to each approved request", () => {
  const output = addMembershipPaymentSchema(sourceSchema());
  const redemptions = output.find(
    (collection) => collection.name === "redemptions",
  );
  const field = redemptions?.schema.find(
    (candidate) => candidate.name === "payment_request",
  );

  assert.equal(field?.type, "relation");
  assert.equal(field?.options.collectionId, "brzmemberpay01");
  assert.match(
    redemptions?.indexes.at(-1) ?? "",
    /UNIQUE INDEX `idx_redemption_payment_request`/,
  );
});

test("rejects missing dependencies and duplicate additions", () => {
  assert.throws(
    () => addMembershipPaymentSchema(sourceSchema().slice(0, -1)),
    /Required collection not found: redemptions/,
  );
  assert.throws(
    () =>
      addMembershipPaymentSchema([
        ...sourceSchema(),
        {
          id: "existing",
          name: "membership_payment_requests",
          type: "base",
          schema: [],
        },
      ]),
    /Target collections already exist/,
  );
});
