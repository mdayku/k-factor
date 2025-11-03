import type { AnyEvent } from "event-schema";
export async function emit(event: AnyEvent) {
  await fetch(process.env.NEXT_PUBLIC_EVENTS_URL ?? "http://localhost:4000/events", {
    method: "POST",
    headers: {"content-type":"application/json"},
    body: JSON.stringify(event)
  });
}
