"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function FVMContent() {
  const sp = useSearchParams();
  const code = sp.get("code") ?? "na";
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_EVENTS_URL ?? "http://localhost:4000/events", {
      method: "POST", headers: {"content-type":"application/json"},
      body: JSON.stringify({ type:"invite.opened", ts:new Date().toISOString(), userId:null, sessionId:"new", surface:"web", signedLinkId:code })
    });
    setTimeout(()=> fetch(process.env.NEXT_PUBLIC_EVENTS_URL ?? "http://localhost:4000/events", {
      method: "POST", headers: {"content-type":"application/json"},
      body: JSON.stringify({ type:"account.created", ts:new Date().toISOString(), userId:"u2", sessionId:"s2", surface:"web", referrerSignedLinkId:code })
    }), 500);
    setTimeout(()=> fetch(process.env.NEXT_PUBLIC_EVENTS_URL ?? "http://localhost:4000/events", {
      method: "POST", headers: {"content-type":"application/json"},
      body: JSON.stringify({ type:"fvm.reached", ts:new Date().toISOString(), userId:"u2", sessionId:"s2", surface:"web", context:"micro_deck" })
    }), 1500);
  }, [code]);
  return <main style={{padding:24}}><h1>5-Question Micro-Deck</h1><p>Let's go!</p></main>
}

export default function FVM() {
  return (
    <Suspense fallback={<main style={{padding:24}}><h1>Loading...</h1></main>}>
      <FVMContent />
    </Suspense>
  );
}
