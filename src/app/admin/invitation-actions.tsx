"use client";

import Link from "next/link";
import { Check, Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteInvitation } from "./actions";

export function InvitationActions({ id, slug }: { id: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const demoUrl = `/invitation/${slug}`;

  async function copyDemoLink() {
    await navigator.clipboard.writeText(`${window.location.origin}${demoUrl}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <div className="flex flex-wrap items-center gap-2"><Link className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold hover:border-stone-400" href={`/admin/invitations/${id}/edit`}><Pencil size={15} /> Edit</Link><a className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold hover:border-stone-400" href={demoUrl} rel="noreferrer" target="_blank"><ExternalLink size={15} /> Demo</a><button className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold hover:border-stone-400" onClick={copyDemoLink} type="button">{copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}{copied ? "Copied" : "Copy link"}</button><form action={deleteInvitation} onSubmit={(event) => { if (!confirm("Delete this invitation permanently? Its events, gallery and RSVPs will also be deleted.")) event.preventDefault(); }}><input name="id" type="hidden" value={id} /><button className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"><Trash2 size={15} /> Delete</button></form></div>;
}
