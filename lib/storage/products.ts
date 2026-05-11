import { randomUUID } from "crypto";

import { createClient } from "@/lib/supabase/server";

import { PRODUCTS_BUCKET } from "@/constants/products";

export async function uploadProductImage(file: File, category: string) {
  const supabase = await createClient();

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";

  const path = `${category}/${randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(PRODUCTS_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);

  return {
    path,

    publicUrl: data.publicUrl,
  };
}

export async function deleteProductImage(path: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(PRODUCTS_BUCKET).remove([path]);

  if (error) {
    throw error;
  }
}

export function extractStoragePath(url: string) {
  const marker = `/object/public/${PRODUCTS_BUCKET}/`;

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.slice(index + marker.length);
}
