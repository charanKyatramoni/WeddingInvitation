import type { Invitation } from "@/types/invitation";

export interface InvitationThemeProps {
  invitation: Invitation;
}

export interface InvitationTheme {
  key: string;
  name: string;
  render: (props: InvitationThemeProps) => React.ReactNode;
}
