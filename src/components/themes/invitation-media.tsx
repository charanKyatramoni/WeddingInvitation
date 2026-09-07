"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Music2, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DesignerFooter } from "./designer-footer";

interface GalleryImage { id: string; storage_path: string; }
interface InvitationMediaProps {
  brideImage: string | null;
  groomImage: string | null;
  brideName: string;
  groomName: string;
  gallery: GalleryImage[];
  mapUrl: string | null;
  venueName: string | null;
  musicUrl: string | null;
  dark?: boolean;
}

export function InvitationMedia({ brideImage, groomImage, brideName, groomName, gallery, mapUrl, venueName, musicUrl, dark = false }: InvitationMediaProps) {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const tone = dark ? "text-[#f4e4d0]" : "text-[#7b201b]";
  const muted = dark ? "text-[#ddcbbd]" : "text-[#77584b]";
  const surface = dark ? "border-[#e5c18c33] bg-[#f8e8d50b]" : "border-[#e7cb8f] bg-[#fffaf0]";
  const title = (text: string) => <><p className={`text-xs font-bold uppercase tracking-[.28em] ${dark ? "text-[#d6af7c]" : "text-[#b67a29]"}`}>Our story</p><h2 className={`mt-4 font-serif text-4xl ${tone}`}>{text}</h2></>;
  useEffect(() => { if (musicUrl && audio.current) void audio.current.play().catch(() => setPlaying(false)); }, [musicUrl]);
  function toggleMusic() { if (!audio.current) return; if (audio.current.paused) { void audio.current.play(); setPlaying(true); } else { audio.current.pause(); setPlaying(false); } }

  return <>
    {(brideImage || groomImage) && <section className="mx-auto max-w-5xl px-6 py-24 text-center">{title("The couple")}<div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">{brideImage && <Portrait image={brideImage} label={brideName} surface={surface} tone={tone} />}{groomImage && <Portrait image={groomImage} label={groomName} surface={surface} tone={tone} />}</div></section>}
    {gallery.length > 0 && <section className={`px-6 py-24 text-center ${dark ? "bg-white/[.025]" : "bg-[#fff3dc]"}`}>{title("Captured moments")}<div className="mx-auto mt-10 max-w-5xl columns-2 gap-4 sm:columns-3">{gallery.map((image) => <motion.div whileHover={{ scale: 1.02 }} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl" key={image.id}><Image alt="Couple's captured moment" className="h-auto w-full" height={700} width={550} src={image.storage_path} /></motion.div>)}</div></section>}
    {mapUrl && <section className="mx-auto max-w-5xl px-6 py-24 text-center">{title("When & where")}<p className={`mt-3 ${muted}`}>{venueName || "Join us at our celebration"}</p><div className={`mx-auto mt-9 max-w-3xl overflow-hidden rounded-3xl border shadow-lg ${surface}`}><iframe className="h-80 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(mapUrl)}&output=embed`} title="Wedding venue map" /></div><a className={`mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[.14em] ${dark ? "bg-[#d6af7c] text-[#211613]" : "bg-[#9c251d] text-white"}`} href={mapUrl} rel="noreferrer" target="_blank"><MapPin size={15} /> Open directions</a></section>}
    {musicUrl && <><audio autoPlay loop onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} ref={audio} src={musicUrl} /><button aria-label={playing ? "Pause music" : "Play music"} className={`fixed bottom-5 right-5 z-30 grid h-11 w-11 place-items-center rounded-full shadow-lg ${dark ? "bg-[#d6af7c] text-[#211613]" : "bg-[#fff8e9] text-[#9f261d]"}`} onClick={toggleMusic}>{playing ? <Pause size={17} /> : <><Play size={17} /><span className="sr-only"><Music2 /></span></>}</button></>}
    <DesignerFooter dark={dark} />
  </>;
}

function Portrait({ image, label, surface, tone }: { image: string; label: string; surface: string; tone: string }) { return <motion.div whileHover={{ y: -6 }} className={`rounded-[2rem] border p-3 shadow-md ${surface}`}><div className="relative aspect-square overflow-hidden rounded-[1.4rem]"><Image alt={label} className="object-cover" fill sizes="(max-width: 640px) 100vw, 50vw" src={image} /></div><p className={`mt-4 pb-2 font-serif text-2xl ${tone}`}>{label}</p></motion.div>; }
