import Link from "next/link";
import { InvitationForm } from "./invitation-form";

export default function NewInvitationPage() {
  return <main className="mx-auto min-h-screen max-w-2xl px-6 py-16"><Link className="text-sm font-semibold text-rose-700" href="/admin">← All invitations</Link><p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">New invitation</p><h1 className="mt-3 text-4xl font-semibold">Start with the essentials</h1><p className="mt-3 text-stone-600">Save a draft now; you will add the story, images, schedule, and family next.</p><InvitationForm /></main>;
}
