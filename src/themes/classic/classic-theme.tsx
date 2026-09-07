import type { InvitationTheme } from "@/themes/contract";

export const classicTheme: InvitationTheme = {
  key: "classic",
  name: "Classic",
  render: ({ invitation }) => (
    <main style={{ background: invitation.themeSettings.secondaryColor, color: invitation.themeSettings.primaryColor }}>
      <h1>{invitation.brideName} &amp; {invitation.groomName}</h1>
    </main>
  ),
};
