"use client";
import { useState } from "react";

export default function Results() {
  const [code, setCode] = useState<string| null>(null);

  async function shareBuddy() {
    const payload = { persona:"student", context:"results", loop:"buddy_challenge", referrerId:"u1" };
    const r = await fetch("http://localhost:4100/sign",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body: JSON.stringify(payload)
    });
    const { shortCode } = await r.json();
    setCode(shortCode);

    await fetch(process.env.NEXT_PUBLIC_EVENTS_URL ?? "http://localhost:4000/events", {
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify({ type:"invite.sent", ts:new Date().toISOString(), userId:"u1", sessionId:"s1", surface:"web", loop:"buddy_challenge", signedLinkId:shortCode })
    });
  }

  return (
    <main style={{padding:24, maxWidth:800}}>
      <h1>Algebra Skill Check</h1>
      <p>Your score: <b>7/10</b>. Biggest gap: <b>factoring quadratics</b>.</p>
      <div style={{border:"1px solid #ddd", padding:12, borderRadius:12}}>
        <strong>Share card:</strong> Challenge a friend to beat 7/10 and both get a streak shield.
        <button onClick={shareBuddy} style={{marginLeft:12}}>Copy Invite</button>
        {code && <p>Smart link: <a href={`http://localhost:4100/r/${code}`}>http://localhost:4100/r/{code}</a></p>}
      </div>
      <p style={{marginTop:16}}><a href="/presence">Presence View</a></p>
    </main>
  );
}
