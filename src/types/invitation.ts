export type InvitationStatus = "draft" | "published" | "archived";

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  headingFont: string;
  bodyFont: string;
}

export interface Invitation {
  id: string;
  slug: string;
  status: InvitationStatus;
  brideName: string;
  groomName: string;
  weddingAt: string;
  venueName: string | null;
  themeKey: string;
  themeSettings: ThemeSettings;
  coverImageUrl: string | null;
  invitationMessage: string | null;
}
