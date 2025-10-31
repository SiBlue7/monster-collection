import imageCompression from "browser-image-compression";
import { supabase } from "../lib/supabase";

export async function createCan(input: {
  groupId: string;
  name: string;
  barcode?: string | null;
  imageFile?: File | null;
  notes?: string | null;
}) {
  let imagePath: string | null = null;

  if (input.imageFile) {
    const compressed = await imageCompression(input.imageFile, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });
    const fileName = `${input.groupId}/${crypto.randomUUID()}.jpg`;
    const { error: upErr } = await supabase.storage
      .from("cans")
      .upload(fileName, compressed, { contentType: "image/jpeg" });
    if (upErr) throw upErr;
    imagePath = fileName;
  }

  const { error: insErr } = await supabase.from("cans").insert({
    group_id: input.groupId,
    name: input.name,
    barcode: input.barcode ?? null,
    image_url: imagePath,
    notes: input.notes ?? null,
  });
  if (insErr) throw insErr;
}

export async function listCans(groupId: string) {
  const { data, error } = await supabase
    .from("cans")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
