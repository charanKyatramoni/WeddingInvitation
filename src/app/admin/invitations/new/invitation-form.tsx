"use client";

import { useActionState, useState } from "react";
import { createInvitation, type InvitationFormState } from "@/app/admin/actions";

const initialState: InvitationFormState = {};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function InvitationForm() {
  const [state, action, isPending] = useActionState(createInvitation, initialState);
  const [slug, setSlug] = useState("");

  return (
    <form action={action} className="mt-8 space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">Bride&apos;s name<input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="brideName" onChange={(event) => !slug && setSlug(slugify(`${event.target.value}-and`))} required /></label>
        <label className="block text-sm font-medium">Groom&apos;s name<input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="groomName" onChange={(event) => slug.includes("-and") && setSlug(slugify(`${slug.replace(/-and.*$/, "")}-and-${event.target.value}`))} required /></label>
      </div>
      <label className="block text-sm font-medium">Wedding date and time<input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="weddingAt" required type="datetime-local" /></label>
      <label className="block text-sm font-medium">Website address (slug)<span className="ml-1 text-stone-400">— /invitation/{slug || "your-celebration"}</span><input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="slug" onChange={(event) => setSlug(slugify(event.target.value))} required value={slug} /></label>
      <label className="block text-sm font-medium">Venue <span className="text-stone-400">(optional)</span><input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="venueName" /></label>
      <label className="block text-sm font-medium">Google Maps link <span className="text-stone-400">(optional)</span><input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="mapUrl" placeholder="https://maps.google.com/..." type="url" /></label>
      <label className="block text-sm font-medium">Welcome message <span className="text-stone-400">(optional)</span><textarea className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3" name="invitationMessage" /></label>
      <label className="block text-sm font-medium">Their story or favourite quote <span className="text-stone-400">(optional)</span><textarea className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3" name="story" placeholder="A short note about their journey, or a meaningful quote." /></label>
      <label className="block text-sm font-medium">Wedding film or live-stream link <span className="text-stone-400">(optional)</span><input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="videoUrl" placeholder="https://youtube.com/..." type="url" /></label>
      <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium">Client RSVP email <span className="text-stone-400">(optional)</span><input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="rsvpEmail" placeholder="client@example.com" type="email" /></label><label className="block text-sm font-medium">Client WhatsApp number <span className="text-stone-400">(optional)</span><input className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" name="whatsappNumber" placeholder="919876543210" type="tel" /></label></div>
      <label className="block text-sm font-medium">Theme<select className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" defaultValue="classic" name="themeKey"><option value="classic">Classic — warm and elegant</option><option value="cinematic">Cinematic Luxe — editorial and immersive</option><option value="heritage">Heritage Celebration — festive and traditional</option><option value="royal">Royal Premium — plum and gold luxury</option></select></label>
      <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"><p className="font-semibold">Next step: add photos and music</p><p className="mt-1 leading-6">Create this draft first. On its Edit page you will see the Photos &amp; music section to upload cover image, bride and groom portraits, couple gallery, and background music.</p></aside>
      {state.error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{state.error}</p>}
      <button className="rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "Creating…" : "Create draft invitation"}</button>
    </form>
  );
}
