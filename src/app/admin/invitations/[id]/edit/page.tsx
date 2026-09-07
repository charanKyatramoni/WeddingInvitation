import Link from "next/link";
import { notFound } from "next/navigation";
import { EditInvitationForm, type EditableInvitation } from "./edit-invitation-form";
import { EventManager } from "./event-manager";
import { MediaManager } from "./media-manager";
import { createClient } from "@/lib/supabase/server";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: invitation } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle();
  if (!invitation) notFound();
  const { data: events } = await supabase.from("events").select("id, title, starts_at, venue_name, map_url").eq("invitation_id", id).order("position");
  const { data: gallery } = await supabase.from("gallery_images").select("id, storage_path").eq("invitation_id", id).order("position");
  const editableInvitation: EditableInvitation = { ...invitation, video_url: invitation.video_url ?? null, rsvp_email: invitation.rsvp_email ?? null, whatsapp_number: invitation.whatsapp_number ?? null, bride_occupation: invitation.bride_occupation ?? null, groom_occupation: invitation.groom_occupation ?? null, bride_parents: invitation.bride_parents ?? null, groom_parents: invitation.groom_parents ?? null, bride_bio: invitation.bride_bio ?? null, groom_bio: invitation.groom_bio ?? null, family_invitation_message: invitation.family_invitation_message ?? null };
  return <main className="min-h-screen bg-[#fbf8f5] px-6 py-12"><div className="mx-auto max-w-2xl"><Link className="text-sm font-semibold text-rose-700" href="/admin">← Dashboard</Link><p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">Invitation editor</p><h1 className="mt-3 text-4xl font-semibold">{invitation.bride_name} &amp; {invitation.groom_name}</h1><p className="mt-3 text-stone-600">Update the essential information for this invitation.</p><EditInvitationForm invitation={editableInvitation} /><MediaManager assets={{ cover_image_path: invitation.cover_image_path, bride_image_path: invitation.bride_image_path, groom_image_path: invitation.groom_image_path, music_path: invitation.music_path }} gallery={gallery ?? []} invitationId={id} /><EventManager events={events ?? []} invitationId={id} /><button className="mt-12 w-full rounded-xl bg-stone-900 px-5 py-4 font-semibold text-white" form="invitation-details-form" type="submit">Save all changes</button></div></main>;
}
