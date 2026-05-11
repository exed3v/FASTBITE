"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

import {
  deleteProductImage,
  extractStoragePath,
  uploadProductImage,
} from "@/lib/storage/products";

import { slugify } from "@/utils/slug";

const productSchema = z.object({
  nombre: z.string().min(2).max(120),

  descripcion: z.string().max(500).nullable(),

  precio: z.number().min(0),

  categoria_id: z.uuid(),

  disponible: z.boolean(),
});

type CreateProductInput = {
  nombre: string;

  descripcion: string | null;

  precio: number;

  categoria_id: string;

  disponible: boolean;

  imageFile?: File | null;
};

type UpdateProductInput = CreateProductInput & {
  id: string;

  currentImageUrl?: string | null;
};

export async function createProduct(input: CreateProductInput) {
  const parsed = productSchema.safeParse({
    nombre: input.nombre,

    descripcion: input.descripcion,

    precio: input.precio,

    categoria_id: input.categoria_id,

    disponible: input.disponible,
  });

  if (!parsed.success) {
    throw new Error("Datos inválidos");
  }

  const supabase = await createClient();

  let imagen_url: string | null = null;

  if (input.imageFile) {
    const uploaded = await uploadProductImage(
      input.imageFile,
      input.categoria_id,
    );

    imagen_url = uploaded.publicUrl;
  }

  const { error } = await (supabase.from("productos") as any).insert({
    nombre: parsed.data.nombre,

    slug: slugify(parsed.data.nombre),

    descripcion: parsed.data.descripcion,

    precio: parsed.data.precio,

    categoria_id: parsed.data.categoria_id,

    disponible: parsed.data.disponible,

    imagen_url,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/admin/productos");

  revalidatePath("/");
}

export async function updateProduct(input: UpdateProductInput) {
  const parsed = productSchema.safeParse({
    nombre: input.nombre,

    descripcion: input.descripcion,

    precio: input.precio,

    categoria_id: input.categoria_id,

    disponible: input.disponible,
  });

  if (!parsed.success) {
    throw new Error("Datos inválidos");
  }

  const supabase = await createClient();

  let imagen_url = input.currentImageUrl ?? null;

  let oldPath: string | null = null;

  if (input.imageFile) {
    const uploaded = await uploadProductImage(
      input.imageFile,
      input.categoria_id,
    );

    imagen_url = uploaded.publicUrl;

    if (input.currentImageUrl) {
      oldPath = extractStoragePath(input.currentImageUrl);
    }
  }

  const { error } = await (supabase.from("productos") as any)
    .update({
      nombre: parsed.data.nombre,

      slug: slugify(parsed.data.nombre),

      descripcion: parsed.data.descripcion,

      precio: parsed.data.precio,

      categoria_id: parsed.data.categoria_id,

      disponible: parsed.data.disponible,

      imagen_url,
    })
    .eq("id", input.id);

  if (error) {
    throw error;
  }

  if (oldPath) {
    await deleteProductImage(oldPath);
  }

  revalidatePath("/admin/productos");

  revalidatePath("/");
}

export async function deleteProduct(id: string, imageUrl?: string | null) {
  const supabase = await createClient();

  const { error } = await (supabase.from("productos") as any)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  if (imageUrl) {
    const path = extractStoragePath(imageUrl);

    if (path) {
      await deleteProductImage(path);
    }
  }

  revalidatePath("/admin/productos");

  revalidatePath("/");
}

export async function toggleProductAvailability(
  id: string,
  disponible: boolean,
) {
  const supabase = await createClient();

  const { error } = await (supabase.from("productos") as any)
    .update({
      disponible,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/admin/productos");

  revalidatePath("/");
}
