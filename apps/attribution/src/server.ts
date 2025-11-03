import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const SECRET = process.env.SIGNED_LINK_SECRET ?? "dev-secret";

// naive in-memory map: shortCode -> payload
const memory = new Map<string, any>();

app.post("/sign", (req,res) => {
  const payload = JSON.stringify(req.body); // { persona, context, loop, referrerId }
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex").slice(0,10);
  const short = Buffer.from(hmac).toString("base64url").slice(0,8);
  memory.set(short, req.body);
  res.json({ shortCode: short, signature: hmac });
});

app.get("/r/:code", (req,res) => {
  const code = req.params.code;
  const payload = memory.get(code) ?? {};
  // TODO: last-touch attribution store
  const qp = new URLSearchParams({ code, loop: payload.loop ?? "buddy_challenge" }).toString();
  res.redirect(`http://localhost:3000/deeplink?${qp}`);
});

app.listen(4100, ()=> console.log("attribution on :4100"));
