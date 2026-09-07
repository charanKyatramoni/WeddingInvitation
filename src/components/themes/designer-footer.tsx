import { Mail, MessageCircle } from "lucide-react";

export function DesignerFooter({ dark = false }: { dark?: boolean }) {
  return <footer className={dark ? "designer-footer designer-footer-dark" : "designer-footer"}>
    <p>Designed with care by Vowcraft Studio</p>
    <div><a href="https://wa.me/919121949924" rel="noreferrer" target="_blank"><MessageCircle size={14} /> 9121949924</a><a href="mailto:rakesh.rk1306@gmail.com"><Mail size={14} /> rakesh.rk1306@gmail.com</a></div>
  </footer>;
}
