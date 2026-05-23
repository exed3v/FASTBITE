export type Estado =
  | "pendiente"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

export type Pedido = {
  id: string;
  cliente_nombre: string;
  telefono: string;
  direccion: string;
  notas: string | null;
  subtotal: number;
  delivery_fee: number;
  delivery_type: "delivery" | "pickup";
  total: number;
  estado: Estado;
  payment_method: string;
  payment_id: string | null;
  payment_status: string | null;
  created_at: string;
};

export type PedidoItem = {
  id: string;
  pedido_id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
};

export const ESTADOS: {
  value: Estado | "todos";
  label: string;
  color: string;
}[] = [
  {
    value: "todos",
    label: "Todos",
    color: "",
  },
  {
    value: "pendiente",
    label: "Pendiente",
    color: "border-yellow-500/20 bg-yellow-500/15 text-yellow-500",
  },
  {
    value: "en_preparacion",
    label: "En preparación",
    color: "border-blue-500/20 bg-blue-500/15 text-blue-500",
  },
  {
    value: "en_camino",
    label: "En camino",
    color: "border-violet-500/20 bg-violet-500/15 text-violet-500",
  },

  {
    value: "entregado",
    label: "Entregado",
    color: "border-green-500/20 bg-green-500/15 text-green-500",
  },
  {
    value: "cancelado",
    label: "Cancelado",
    color: "border-red-500/20 bg-red-500/15 text-red-500",
  },
];
