"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PartyPopper, RotateCcw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

export function ScratchDateCard({ date }: { date: string }) {
  const [marks, setMarks] = useState<Array<{ x: number; y: number }>>([]);
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  function scratch(event: React.PointerEvent<SVGSVGElement>) {
    if (revealed || !cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const mark = { x: ((event.clientX - box.left) / box.width) * 100, y: ((event.clientY - box.top) / box.height) * 100 };
    setMarks((current) => {
      const next = [...current, mark];
      if (next.length > 18) setRevealed(true);
      return next;
    });
  }

  return <motion.div initial={reduced ? false : { opacity: 0, y: 42, scale: .96 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, amount: .4 }} whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }} className="mx-auto mt-10 max-w-sm text-center"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a53022]">A little surprise</p><h2 className="mt-2 font-serif text-3xl text-[#7b201b]">Scratch to reveal our date</h2><div className="relative mx-auto mt-6 aspect-[1.6] max-w-sm overflow-hidden rounded-3xl border-2 border-[#d39a2d] bg-[#fff7e8] shadow-[0_12px_35px_rgba(119,49,24,.16)]"><div className="grid h-full place-items-center p-5"><Sparkles className="text-[#d39a2d]" size={22} /><p className="mt-2 font-serif text-2xl font-semibold text-[#8e211b]">{date}</p><p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#806451]">Save the celebration</p></div>{!revealed && <svg aria-label="Scratch the card to reveal the wedding date" className="absolute inset-0 h-full w-full touch-none" onPointerDown={scratch} onPointerMove={(event) => event.buttons === 1 && scratch(event)} preserveAspectRatio="none" ref={cardRef} viewBox="0 0 100 100"><defs><mask id="scratch-mask"><rect fill="white" height="100" width="100" />{marks.map((mark, index) => <circle cx={mark.x} cy={mark.y} fill="black" key={index} r="12" />)}</mask><linearGradient id="scratch-gold" x1="0" x2="1"><stop stopColor="#cb942e" /><stop offset=".5" stopColor="#f6d46e" /><stop offset="1" stopColor="#a76c1f" /></linearGradient></defs><rect fill="url(#scratch-gold)" height="100" mask="url(#scratch-mask)" width="100" /><text fill="#fff9e9" fontSize="7" fontWeight="700" letterSpacing="1.4" textAnchor="middle" x="50" y="48">SCRATCH HERE</text><text fill="#fff9e9" fontSize="4" letterSpacing=".7" textAnchor="middle" x="50" y="56">TO REVEAL THE DATE</text></svg>} {revealed && <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: .6 }} className="pointer-events-none absolute inset-0"><PartyPopper className="absolute left-6 top-5 text-[#d39a2d]" /><PartyPopper className="absolute bottom-5 right-6 rotate-90 text-[#c9472f]" />{Array.from({ length: 12 }, (_, index) => <motion.i animate={{ opacity: [0, 1, 0], x: (index % 4 - 1.5) * 65, y: -45 - (index % 3) * 40, rotate: index * 45 }} className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#d39a2d]" initial={{ opacity: 0 }} key={index} transition={{ duration: .9, delay: index * .03 }} />)}</motion.div>}<motion.button animate={{ opacity: revealed ? 1 : 0 }} className="absolute bottom-3 right-3 rounded-full bg-[#8e211b] p-2 text-white" onClick={() => { setMarks([]); setRevealed(false); }} type="button"><RotateCcw size={14} /></motion.button></div><button className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#a53022] underline underline-offset-4" onClick={() => setRevealed(true)} type="button">Reveal instantly</button></motion.div>;
}
