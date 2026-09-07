"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { invitationSchema } from "@/lib/validations/invitation";

export type LoginState = { error?: string };

export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  if (!email || !password) return { error: "Enter your email address and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("email not confirmed")) {
      return { error: "This account has not been confirmed. Confirm it in Supabase Authentication → Users, then try again." };
    }

    if (message.includes("invalid login credentials")) {
      return { error: "That email and password do not match a user in this Supabase project. Create or reset the user in Authentication → Users." };
    }

    console.error("Supabase admin sign-in failed:", error.message);

    if (message.includes("invalid format") || message.includes("valid email")) {
      return { error: "Enter a valid email address, then try again." };
    }

    if (message.includes("signup") || message.includes("signups")) {
      return { error: "This Supabase project does not currently allow this account to sign in. Create the admin user in Supabase Authentication → Users, then try again." };
    }

    if (message.includes("rate limit") || message.includes("too many requests")) {
      return { error: "Too many sign-in attempts were made. Wait a few minutes, then try again." };
    }

    return { error: `Supabase sign-in error: ${error.message}` };
  }

  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type InvitationFormState = { error?: string };

export async function createInvitation(_: InvitationFormState, formData: FormData): Promise<InvitationFormState> {
  const parsed = invitationSchema.safeParse({
    brideName: formData.get("brideName"),
    groomName: formData.get("groomName"),
    slug: formData.get("slug"),
    weddingAt: formData.get("weddingAt"),
    venueName: formData.get("venueName") || undefined,
    mapUrl: formData.get("mapUrl") || undefined,
    invitationMessage: formData.get("invitationMessage") || undefined,
    story: formData.get("story") || undefined,
    brideOccupation: formData.get("brideOccupation") || undefined, groomOccupation: formData.get("groomOccupation") || undefined,
    brideParents: formData.get("brideParents") || undefined, groomParents: formData.get("groomParents") || undefined,
    brideBio: formData.get("brideBio") || undefined, groomBio: formData.get("groomBio") || undefined,
    familyInvitationMessage: formData.get("familyInvitationMessage") || undefined,
    videoUrl: formData.get("videoUrl") || undefined,
    rsvpEmail: formData.get("rsvpEmail") || undefined, whatsappNumber: formData.get("whatsappNumber") || undefined,
    themeKey: formData.get("themeKey"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the invitation details." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has ended. Sign in again." };

  const { error } = await supabase.from("invitations").insert({
    owner_id: user.id,
    bride_name: parsed.data.brideName,
    groom_name: parsed.data.groomName,
    slug: parsed.data.slug,
    wedding_at: new Date(parsed.data.weddingAt).toISOString(),
    venue_name: parsed.data.venueName || null,
    map_url: parsed.data.mapUrl || null,
    invitation_message: parsed.data.invitationMessage || null,
    story: parsed.data.story || null,
    bride_occupation: parsed.data.brideOccupation || null, groom_occupation: parsed.data.groomOccupation || null,
    bride_parents: parsed.data.brideParents || null, groom_parents: parsed.data.groomParents || null,
    bride_bio: parsed.data.brideBio || null, groom_bio: parsed.data.groomBio || null,
    family_invitation_message: parsed.data.familyInvitationMessage || null,
    video_url: parsed.data.videoUrl || null,
    rsvp_email: parsed.data.rsvpEmail || null, whatsapp_number: parsed.data.whatsappNumber || null,
    theme_key: parsed.data.themeKey,
  });

  if (error?.code === "23505") return { error: "That web address is already in use. Choose another slug." };
  if (error) {
    console.error("Invitation creation failed:", error.message);
    return { error: "We could not save the invitation. Please try again." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateInvitation(_: InvitationFormState, formData: FormData): Promise<InvitationFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Invitation not found." };

  const parsed = invitationSchema.safeParse({
    brideName: formData.get("brideName"), groomName: formData.get("groomName"), slug: formData.get("slug"), weddingAt: formData.get("weddingAt"),
    venueName: formData.get("venueName") || undefined, mapUrl: formData.get("mapUrl") || undefined, invitationMessage: formData.get("invitationMessage") || undefined, story: formData.get("story") || undefined, brideOccupation: formData.get("brideOccupation") || undefined, groomOccupation: formData.get("groomOccupation") || undefined, brideParents: formData.get("brideParents") || undefined, groomParents: formData.get("groomParents") || undefined, brideBio: formData.get("brideBio") || undefined, groomBio: formData.get("groomBio") || undefined, familyInvitationMessage: formData.get("familyInvitationMessage") || undefined, videoUrl: formData.get("videoUrl") || undefined, rsvpEmail: formData.get("rsvpEmail") || undefined, whatsappNumber: formData.get("whatsappNumber") || undefined, themeKey: formData.get("themeKey"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the invitation details." };

  const supabase = await createClient();
  const { error } = await supabase.from("invitations").update({
    bride_name: parsed.data.brideName, groom_name: parsed.data.groomName, slug: parsed.data.slug,
    wedding_at: new Date(parsed.data.weddingAt).toISOString(), venue_name: parsed.data.venueName || null, map_url: parsed.data.mapUrl || null,
    invitation_message: parsed.data.invitationMessage || null, story: parsed.data.story || null, bride_occupation: parsed.data.brideOccupation || null, groom_occupation: parsed.data.groomOccupation || null, bride_parents: parsed.data.brideParents || null, groom_parents: parsed.data.groomParents || null, bride_bio: parsed.data.brideBio || null, groom_bio: parsed.data.groomBio || null, family_invitation_message: parsed.data.familyInvitationMessage || null, video_url: parsed.data.videoUrl || null, rsvp_email: parsed.data.rsvpEmail || null, whatsapp_number: parsed.data.whatsappNumber || null, theme_key: parsed.data.themeKey,
  }).eq("id", id);

  if (error?.code === "23505") return { error: "That web address is already in use. Choose another slug." };
  if (error) return { error: "We could not save the invitation. Please try again." };
  revalidatePath("/admin");
  revalidatePath(`/invitation/${parsed.data.slug}`);
  redirect("/admin");
}

export async function publishInvitation(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("invitations").update({ status: "published", published_at: new Date().toISOString() }).eq("id", id);
  if (error) console.error("Invitation publishing failed:", error.message);
  revalidatePath("/admin");
}

export async function createEvent(formData: FormData) {
  const invitationId = String(formData.get("invitationId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "");
  const venueName = String(formData.get("venueName") ?? "").trim();
  const mapUrl = String(formData.get("mapUrl") ?? "").trim();
  if (!invitationId || !title || !startsAt) return;
  const supabase = await createClient();
  const { count } = await supabase.from("events").select("id", { count: "exact", head: true }).eq("invitation_id", invitationId);
  await supabase.from("events").insert({ invitation_id: invitationId, title, starts_at: new Date(startsAt).toISOString(), venue_name: venueName || null, map_url: mapUrl || null, position: count ?? 0 });
  revalidatePath(`/admin/invitations/${invitationId}/edit`);
}

export async function deleteEvent(formData: FormData) {
  const invitationId = String(formData.get("invitationId") ?? "");
  const eventId = String(formData.get("eventId") ?? "");
  if (!invitationId || !eventId) return;
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath(`/admin/invitations/${invitationId}/edit`);
}

export async function deleteInvitation(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("invitations").delete().eq("id", id);
  if (error) console.error("Invitation deletion failed:", error.message);
  revalidatePath("/admin");
}
