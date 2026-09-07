import { z } from "zod";

export const invitationSchema = z.object({
  brideName: z.string().trim().min(2, "Enter the bride's name.").max(80),
  groomName: z.string().trim().min(2, "Enter the groom's name.").max(80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.").max(100),
  weddingAt: z.string().min(1, "Choose the wedding date and time."),
  venueName: z.string().trim().max(160).optional(),
  mapUrl: z.union([z.string().trim().url(), z.literal("")]).optional(),
  invitationMessage: z.string().trim().max(1_000).optional(),
  story: z.string().trim().max(2_000).optional(),
  brideOccupation: z.string().trim().max(120).optional(),
  groomOccupation: z.string().trim().max(120).optional(),
  brideParents: z.string().trim().max(300).optional(),
  groomParents: z.string().trim().max(300).optional(),
  brideBio: z.string().trim().max(1_000).optional(),
  groomBio: z.string().trim().max(1_000).optional(),
  familyInvitationMessage: z.string().trim().max(1_000).optional(),
  rsvpEmail: z.union([z.string().trim().email(), z.literal("")]).optional(),
  whatsappNumber: z.string().trim().max(30).optional(),
  videoUrl: z.union([z.string().trim().url(), z.literal("")]).optional(),
  themeKey: z.enum(["classic", "cinematic", "heritage", "royal"]),
});

export type InvitationInput = z.infer<typeof invitationSchema>;
