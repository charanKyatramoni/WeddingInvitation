import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassicInvitation } from "@/components/themes/classic-invitation";
import { CinematicInvitation } from "@/components/themes/cinematic-invitation";
import { HeritageInvitation } from "@/components/themes/heritage-invitation";
import { RoyalInvitation } from "@/components/themes/royal-invitation";
import { createClient } from "@/lib/supabase/server";

interface InvitationPageProps {
  params: Promise<{ slug: string }>;
}

async function getInvitation(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!data) return null;
  const { data: events } = await supabase.from("events").select("id, title, starts_at, venue_name, map_url").eq("invitation_id", data.id).order("position");
  const { data: gallery } = await supabase.from("gallery_images").select("id, storage_path").eq("invitation_id", data.id).order("position");
  return { ...data, events: events ?? [], gallery: gallery ?? [] };
}

export async function generateMetadata({ params }: InvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  if (!invitation) return {};
  return {
    title: invitation.seo_title || `${invitation.bride_name} & ${invitation.groom_name} | Wedding Invitation`,
    description: invitation.seo_description || `Join ${invitation.bride_name} and ${invitation.groom_name} as they celebrate their wedding.`,
  };
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  if (!invitation) notFound();

  const invitationProps = { brideName: invitation.bride_name, groomName: invitation.groom_name, invitationMessage: invitation.invitation_message, venueName: invitation.venue_name, weddingAt: invitation.wedding_at, story: invitation.story, events: invitation.events };
  if (invitation.theme_key === "cinematic") return <CinematicInvitation {...invitationProps} id={invitation.id} brideBio={invitation.bride_bio ?? null} brideImage={invitation.bride_image_path} brideOccupation={invitation.bride_occupation ?? null} brideParents={invitation.bride_parents ?? null} coverImage={invitation.cover_image_path} familyInvitationMessage={invitation.family_invitation_message ?? null} gallery={invitation.gallery} groomBio={invitation.groom_bio ?? null} groomImage={invitation.groom_image_path} groomOccupation={invitation.groom_occupation ?? null} groomParents={invitation.groom_parents ?? null} mapUrl={invitation.map_url} musicUrl={invitation.music_path} rsvpEmail={invitation.rsvp_email ?? null} videoUrl={invitation.video_url ?? null} whatsappNumber={invitation.whatsapp_number ?? null} />;
  if (invitation.theme_key === "heritage") return <HeritageInvitation {...invitationProps} brideBio={invitation.bride_bio ?? null} brideImage={invitation.bride_image_path} brideOccupation={invitation.bride_occupation ?? null} brideParents={invitation.bride_parents ?? null} coverImage={invitation.cover_image_path} familyInvitationMessage={invitation.family_invitation_message ?? null} gallery={invitation.gallery} groomBio={invitation.groom_bio ?? null} groomImage={invitation.groom_image_path} groomOccupation={invitation.groom_occupation ?? null} groomParents={invitation.groom_parents ?? null} mapUrl={invitation.map_url} musicUrl={invitation.music_path} />;
  if (invitation.theme_key === "royal") return <RoyalInvitation {...invitationProps} id={invitation.id} brideBio={invitation.bride_bio ?? null} brideImage={invitation.bride_image_path} brideOccupation={invitation.bride_occupation ?? null} brideParents={invitation.bride_parents ?? null} coverImage={invitation.cover_image_path} familyInvitationMessage={invitation.family_invitation_message ?? null} gallery={invitation.gallery} groomBio={invitation.groom_bio ?? null} groomImage={invitation.groom_image_path} groomOccupation={invitation.groom_occupation ?? null} groomParents={invitation.groom_parents ?? null} mapUrl={invitation.map_url} musicUrl={invitation.music_path} rsvpEmail={invitation.rsvp_email ?? null} videoUrl={invitation.video_url ?? null} whatsappNumber={invitation.whatsapp_number ?? null} />;
  return <ClassicInvitation {...invitationProps} id={invitation.id} brideBio={invitation.bride_bio ?? null} brideImage={invitation.bride_image_path} brideOccupation={invitation.bride_occupation ?? null} brideParents={invitation.bride_parents ?? null} coverImage={invitation.cover_image_path} familyInvitationMessage={invitation.family_invitation_message ?? null} gallery={invitation.gallery} groomBio={invitation.groom_bio ?? null} groomImage={invitation.groom_image_path} groomOccupation={invitation.groom_occupation ?? null} groomParents={invitation.groom_parents ?? null} mapUrl={invitation.map_url} musicUrl={invitation.music_path} rsvpEmail={invitation.rsvp_email ?? null} videoUrl={invitation.video_url ?? null} whatsappNumber={invitation.whatsapp_number ?? null} />;
}
