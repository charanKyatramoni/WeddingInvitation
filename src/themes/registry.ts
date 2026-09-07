import { classicTheme } from "@/themes/classic/classic-theme";

export const invitationThemes = [classicTheme];

export function getInvitationTheme(key: string) {
  return invitationThemes.find((theme) => theme.key === key) ?? classicTheme;
}
