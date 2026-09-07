import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Heart, Plus, Sparkles } from "lucide-react";
import { signOut, publishInvitation } from "./actions";
import { InvitationActions } from "./invitation-actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return <main className="grid min-h-screen place-items-center px-6"><p className="max-w-md text-center text-stone-600">This account does not have administrator access.</p></main>;

  const { data: invitations } = await supabase.from("invitations").select("id, bride_name, groom_name, slug, status, wedding_at, theme_key").order("created_at", { ascending: false });
  const invitationList = invitations ?? [];
  const publishedCount = invitationList.filter(({ status }) => status === "published").length;

  return <main className="min-h-screen bg-[#fbf8f5] px-4 py-5 sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl">
    <header className="flex flex-col gap-6 rounded-3xl bg-[#2b1c17] px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-9">
      <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-200"><Heart size={14} fill="currentColor" /> Vowcraft Studio</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Welcome back</h1><p className="mt-2 text-sm text-stone-300">Manage beautiful celebrations from one place.</p></div>
      <div className="flex flex-wrap gap-3"><Link className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-stone-900 hover:bg-rose-50" href="/admin/invitations/new"><Plus size={17} /> New invitation</Link><form action={signOut}><button className="rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">Sign out</button></form></div>
    </header>

    <section className="mt-7 grid gap-4 sm:grid-cols-3"><StatCard icon={<Sparkles size={19} />} label="Total invitations" value={invitationList.length} /><StatCard icon={<CalendarDays size={19} />} label="Published" value={publishedCount} /><StatCard icon={<Heart size={19} />} label="Drafts in progress" value={invitationList.length - publishedCount} /></section>

    <section className="mt-8"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Your collection</p><h2 className="mt-2 text-2xl font-semibold">Wedding invitations</h2></div>{invitationList.length > 0 && <Link className="text-sm font-semibold text-rose-700" href="/admin/invitations/new">Create another →</Link>}</div>
    {invitationList.length ? <div className="mt-5 grid gap-4">{invitationList.map((invitation) => <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex sm:items-center sm:justify-between sm:p-6" key={invitation.id}><div><div className="flex items-center gap-3"><p className="text-xl font-semibold">{invitation.bride_name} <span className="font-serif text-rose-700">&amp;</span> {invitation.groom_name}</p><span className={invitation.status === "published" ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700" : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700"}>{invitation.status === "published" ? "Live" : "Draft"}</span></div><p className="mt-2 text-sm text-stone-500">/{invitation.slug} · {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(invitation.wedding_at))} · {invitation.theme_key}</p></div><div className="mt-5 flex flex-col items-start gap-3 sm:mt-0 sm:items-end"><InvitationActions id={invitation.id} slug={invitation.slug} />{invitation.status === "draft" && <form action={publishInvitation}><input name="id" type="hidden" value={invitation.id} /><button className="text-sm font-semibold text-rose-700 hover:text-rose-900">Publish invitation →</button></form>}</div></article>)}</div> : <section className="mt-5 rounded-3xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-700"><Heart size={22} /></div><h3 className="mt-5 text-xl font-semibold">Your first celebration starts here</h3><p className="mx-auto mt-2 max-w-sm text-stone-600">Create a draft, add the couple&apos;s details, then share a beautiful live invitation.</p><Link className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white" href="/admin/invitations/new"><Plus size={17} /> Create invitation</Link></section>}</section>
  </div></main>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-700">{icon}</div><p className="mt-4 text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-stone-500">{label}</p></div>;
}
