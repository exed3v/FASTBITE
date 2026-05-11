"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { MAX_IMG_BYTES, MIME_OK } from "@/constants/products";
import type { Categoria, Producto } from "@/types/product";
import { createProduct, updateProduct } from "@/app/admin/productos/actions";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { Textarea } from "@/components/ui/textarea";

type ProductFormDialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  editing: Producto | null;

  categorias: Categoria[];
};

const ProductFormDialog = ({
  open,
  onOpenChange,
  editing,
  categorias,
}: ProductFormDialogProps) => {
  const [nombre, setNombre] = useState("");

  const [descripcion, setDescripcion] = useState("");

  const [precio, setPrecio] = useState("");

  const [categoriaId, setCategoriaId] = useState("");

  const [disponible, setDisponible] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editing) {
      setNombre(editing.nombre);

      setDescripcion(editing.descripcion ?? "");

      setPrecio(String(editing.precio));

      setCategoriaId(editing.categoria_id);

      setDisponible(editing.disponible);

      setPreviewUrl(editing.imagen_url);
    } else {
      setNombre("");

      setDescripcion("");

      setPrecio("");

      setCategoriaId("");

      setDisponible(true);

      setPreviewUrl(null);
    }

    setImageFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }, [open, editing]);

  const handleFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!MIME_OK.includes(file.type)) {
      toast({
        title: "Formato inválido",

        description: "Solo JPG, PNG o WEBP.",

        variant: "destructive",
      });

      return;
    }

    if (file.size > MAX_IMG_BYTES) {
      toast({
        title: "Imagen muy grande",

        description: "Máximo 3MB.",

        variant: "destructive",
      });

      return;
    }

    setImageFile(file);

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const payload = {
          nombre,

          descripcion: descripcion || null,

          precio: Number(precio),

          categoria_id: categoriaId,

          disponible,

          imageFile,
        };

        if (editing) {
          await updateProduct({
            id: editing.id,

            currentImageUrl: editing.imagen_url,

            ...payload,
          });

          toast({
            title: "Producto actualizado",
          });
        } else {
          await createProduct(payload);

          toast({
            title: "Producto creado",
          });
        }

        onOpenChange(false);
      } catch (error) {
        console.error(error);

        toast({
          title: "Error",

          description:
            error instanceof Error ? error.message : "Ocurrió un error.",

          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>

          <DialogDescription>
            Completá los datos del producto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Imagen</Label>

            <div className="flex items-center gap-3">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded border bg-muted">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <Input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    handleFile(event.target.files?.[0] ?? null)
                  }
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG o WEBP · máx 3MB
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>

            <Input
              id="nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>

            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (ARS) *</Label>

              <Input
                id="precio"
                type="number"
                min="0"
                step="1"
                value={precio}
                onChange={(event) => setPrecio(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Categoría *</Label>

              <Select value={categoriaId} onValueChange={setCategoriaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>

                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="disponible">Disponible</Label>

              <p className="text-xs text-muted-foreground">
                Visible en el menú público
              </p>
            </div>

            <Switch
              id="disponible"
              checked={disponible}
              onCheckedChange={setDisponible}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="cta" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}

              {editing ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
