"use client";
import { useEffect, useState } from "react";

export default function Presence() {
  const [count, setCount] = useState(28);
  useEffect(()=> {
    const id = setInterval(()=> setCount((c)=> c + (Math.random()>0.5?1:-1)), 1200);
    return ()=> clearInterval(id);
  },[]);
  return <main style={{padding:24}}>
    <h2>{count} peers practicing Algebra now</h2>
    <p>Mini-leaderboard: You’re #5 today · Cohort room: Algebra II</p>
  </main>
}
