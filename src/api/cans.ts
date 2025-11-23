import { supabase } from "../lib/supabase";

const SIGNED_URL_EXPIRES_IN = 60 * 60 * 24;

export type CreateCanInput = {
  groupId: string;
  name: string;
  barcode?: string | null;
  imageFile?: File | null;
  notes?: string | null;
};

export async function createCan(input: CreateCanInput) {
  let imagePath: string | null = null;

  if (input.imageFile instanceof File) {
    if (input.imageFile.size > 10 * 1024 * 1024) {
      throw new Error("L'image dépasse la taille maximale autorisée de 10 Mo.");
    }

    const ext = input.imageFile.type?.split("/")[1]?.toLowerCase() || "jpg";
    const contentType = input.imageFile.type || "image/jpeg";

    const fileName = `${input.groupId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("cans")
      .upload(fileName, input.imageFile, {
        contentType,
        upsert: false,
      });

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

  const withUrls = await Promise.all(
    (data ?? []).map(async (can: any) => {
      if (!can.image_url) return can;

      const { data: urlData } = await supabase.storage
        .from("cans")
        .createSignedUrl(can.image_url, SIGNED_URL_EXPIRES_IN);

      return { ...can, signed_url: urlData?.signedUrl ?? null };
    })
  );

  return withUrls;
}

export async function getSignedUrl(path: string | null | undefined) {
  if (!path) return null;
  const { data } = await supabase.storage
    .from("cans")
    .createSignedUrl(path, SIGNED_URL_EXPIRES_IN);
  return data?.signedUrl ?? null;
}

export async function updateCan(input: {
  id: string;
  groupId: string;
  name?: string | null;
  barcode?: string | null;
  notes?: string | null;
  newImageFile?: File | null;
}) {
  let newImagePath: string | null | undefined = undefined;

  if (input.newImageFile instanceof File) {
    if (input.newImageFile.size > 10 * 1024 * 1024) {
      throw new Error("L'image dépasse 10 Mo.");
    }
    const ext = input.newImageFile.type?.split("/")[1]?.toLowerCase() || "jpg";
    const fileName = `${input.groupId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("cans")
      .upload(fileName, input.newImageFile, {
        contentType: input.newImageFile.type || "image/jpeg",
      });
    if (upErr) throw upErr;

    newImagePath = fileName;
  }

  const { data: before, error: getErr } = await supabase
    .from("cans")
    .select("image_url")
    .eq("id", input.id)
    .single();
  if (getErr) throw getErr;

  const patch: any = {};
  if (typeof input.name !== "undefined")
    patch.name = input.name?.trim() || null;
  if (typeof input.barcode !== "undefined")
    patch.barcode = input.barcode?.trim() || null;
  if (typeof input.notes !== "undefined")
    patch.notes = input.notes?.trim() || null;
  if (typeof newImagePath !== "undefined") patch.image_url = newImagePath;

  const { error: updErr } = await supabase
    .from("cans")
    .update(patch)
    .eq("id", input.id);
  if (updErr) throw updErr;

  if (newImagePath && before?.image_url) {
    await supabase.storage
      .from("cans")
      .remove([before.image_url])
      .catch(() => {});
  }
}

export async function deleteCan(input: { id: string }) {
  const { data: row, error: getErr } = await supabase
    .from("cans")
    .select("image_url")
    .eq("id", input.id)
    .single();
  if (getErr) throw getErr;

  const { error: delErr } = await supabase
    .from("cans")
    .delete()
    .eq("id", input.id);
  if (delErr) throw delErr;

  if (row?.image_url) {
    await supabase.storage
      .from("cans")
      .remove([row.image_url])
      .catch(() => {});
  }
}
