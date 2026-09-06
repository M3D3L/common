import assert from "node:assert/strict";
import test from "node:test";

import { whatsappAppLink } from "../utils/whatsapp.ts";

test("builds an installed-app WhatsApp URL without a web endpoint", () => {
  const url = whatsappAppLink("Pedido listo", "+52 (644) 123-4567");

  assert.equal(url, "whatsapp://send?phone=526441234567&text=Pedido%20listo");
  assert.equal(url.includes("http"), false);
});

test("builds an app URL without a recipient", () => {
  assert.equal(
    whatsappAppLink("Menú del día"),
    "whatsapp://send?text=Men%C3%BA%20del%20d%C3%ADa",
  );
});
