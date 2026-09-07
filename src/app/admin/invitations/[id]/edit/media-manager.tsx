"use client";

import Image from "next/image";
import { ImagePlus, Music2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Slot = "cover_image_path" | "bride_image_path" | "groom_image_path" | "music_path";
interface GalleryImage { id: string; storage_path: string; }
interface Props { invitationId: string; assets: Record<Slot, string | null>; gallery: GalleryImage[]; }

const imageSlots: Array<{ key: Exclude<Slot, "music_path">; label: string }> = [
  { key: "cover_image_path", label: "Cover / Classic background" }, { key: "bride_image_path", label: "Bride portrait" }, { key: "groom_image_path", label: "Groom portrait" },
];

export function MediaManager({ invitationId, assets: initialAssets, gallery: initialGallery }: Props) {
  const [assets, setAssets] = useState(initialAssets);
  const [gallery, setGallery] = useState(initialGallery);
  const [busy, setBusy] = useState<string | null>(null);

  async function upload(file: File, slot: Slot | "gallery") {
    const music = slot === "music_path";
    if ((music && !file.type.startsWith("audio/")) || (!music && !file.type.startsWith("image/"))) return alert(music ? "Choose an audio file." : "Choose an image file.");
    if (file.size > 15 * 1024 * 1024) return alert("Files must be 15 MB or smaller.");
    setBusy(slot);
    const supabase = createClient();
    const name = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    const path = `${invitationId}/${crypto.randomUUID()}-${name}`;
    const { error: uploadError } = await supabase.storage.from("invitation-assets").upload(path, file, { contentType: file.type });
    if (uploadError) { setBusy(null); return alert(`Upload failed: ${uploadError.message}`); }
    const { data: url } = supabase.storage.from("invitation-assets").getPublicUrl(path);
    if (slot === "gallery") {
      const { data, error } = await supabase.from("gallery_images").insert({ invitation_id: invitationId, storage_path: url.publicUrl, position: gallery.length }).select("id, storage_path").single();
      if (error) alert(`Could not save gallery image: ${error.message}`); else if (data) setGallery((items) => [...items, data]);
    } else {
      const { error } = await supabase.from("invitations").update({ [slot]: url.publicUrl }).eq("id", invitationId);
      if (error) alert(`Could not save asset: ${error.message}`); else setAssets((current) => ({ ...current, [slot]: url.publicUrl }));
    }
    setBusy(null);
  }

  async function removeGallery(item: GalleryImage) {
    if (!confirm("Remove this image from the gallery?")) return;
    const { error } = await createClient().from("gallery_images").delete().eq("id", item.id);
    if (error) return alert(`Could not remove image: ${error.message}`);
    setGallery((items) => items.filter(({ id }) => id !== item.id));
  }

  return <section className="mt-14 border-t border-stone-200 pt-10"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Photos & music</p><h2 className="mt-3 text-2xl font-semibold">Make it personal</h2><p className="mt-2 text-sm text-stone-600">Optional images and music. Images: JPG, PNG, WebP. Music: MP3, WAV, OGG. Maximum file size: 15 MB.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-3">{imageSlots.map(({ key, label }) => <AssetSlot asset={assets[key]} busy={busy === key} key={key} label={label} onChoose={(file) => upload(file, key)} />)}</div>
    <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-700"><Music2 size={19} /></div><div><p className="font-semibold">Background music</p><p className="text-sm text-stone-500">{assets.music_path ? "Uploaded and ready for guests to play." : "Optional MP3, WAV or OGG."}</p></div></div><UploadButton accept="audio/mpeg,audio/wav,audio/ogg" busy={busy === "music_path"} label={assets.music_path ? "Replace music" : "Upload music"} onChoose={(file) => upload(file, "music_path")} /></div>
    <div className="mt-8"><p className="font-semibold">Captured moments</p><p className="mt-1 text-sm text-stone-500">Optional pre-wedding or couple photos for the gallery.</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{gallery.map((image) => <div className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100" key={image.id}><Image alt="Gallery image" className="object-cover" fill sizes="(max-width: 640px) 50vw, 33vw" src={image.storage_path} /><button aria-label="Remove gallery image" className="absolute right-2 top-2 rounded-lg bg-black/60 p-2 text-white sm:opacity-0 sm:group-hover:opacity-100" onClick={() => removeGallery(image)}><Trash2 size={15} /></button></div>)}</div><UploadButton accept="image/jpeg,image/png,image/webp" busy={busy === "gallery"} label="Add gallery photos" multiple onChoose={(file) => upload(file, "gallery")} /></div>
  </section>;
}

function UploadButton({ accept, busy, label, multiple, onChoose }: { accept: string; busy: boolean; label: string; multiple?: boolean; onChoose: (file: File) => void }) { return <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold"><Upload size={16} />{busy ? "Uploading…" : label}<input accept={accept} className="hidden" disabled={busy} multiple={multiple} onChange={(event) => Array.from(event.target.files ?? []).forEach(onChoose)} type="file" /></label>; }
function AssetSlot({ asset, label, busy, onChoose }: { asset: string | null; label: string; busy: boolean; onChoose: (file: File) => void }) { return <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white"><div className="relative aspect-[4/3] bg-stone-100">{asset ? <Image alt={label} className="object-cover" fill sizes="33vw" src={asset} /> : <div className="grid h-full place-items-center text-stone-400"><ImagePlus size={25} /></div>}</div><div className="p-4"><p className="font-semibold">{label}</p><UploadButton accept="image/jpeg,image/png,image/webp" busy={busy} label={asset ? "Replace" : "Upload"} onChoose={onChoose} /></div></div>; }
