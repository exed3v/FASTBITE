-- =========================================
-- EXTENSIONS
-- =========================================

create extension if not exists "pgcrypto";


-- =========================================
-- ENUMS
-- =========================================

create type app_role as enum (
  'admin'
);

create type order_status as enum (
  'pendiente',
  'en_preparacion',
  'en_camino',
  'entregado',
  'cancelado'
);

create type payment_method as enum (
  'mercadopago',
  'efectivo'
);

create type payment_status as enum (
  'pendiente',
  'aprobado',
  'rechazado'
);

-- =========================================
-- PROFILES
-- =========================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================
-- USER ROLES
-- =========================================

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'admin',
  created_at timestamptz not null default now(),

  unique(user_id, role)
);


-- =========================================
-- STORE SETTINGS
-- =========================================

create table store_settings (
  id uuid primary key default gen_random_uuid(),

  store_name text not null,
  whatsapp_number text not null,

  delivery_enabled boolean not null default true,
  delivery_fee numeric(10,2) not null default 0,
  estimated_delivery_time integer not null default 30,

  minimum_order_amount numeric(10,2) not null default 0,

  logo_url text,
  banner_url text,

  instagram_url text,
  facebook_url text,

  primary_color text,

  is_store_open boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================
-- CATEGORIAS
-- =========================================

create table categorias (
  id uuid primary key default gen_random_uuid(),

  nombre text not null unique,
  slug text not null unique,

  created_at timestamptz not null default now()
);


-- =========================================
-- PRODUCTOS
-- =========================================

create table productos (
  id uuid primary key default gen_random_uuid(),

  categoria_id uuid not null
    references categorias(id)
    on delete restrict,

  nombre text not null,
  slug text not null unique,

  descripcion text,

  precio numeric(10,2) not null check (precio >= 0),

  imagen_url text,

  disponible boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================
-- PEDIDOS
-- =========================================

create table pedidos (
  id uuid primary key default gen_random_uuid(),

  cliente_nombre text not null,
  telefono text not null,
  direccion text not null,
  notas text,

  estado order_status not null default 'pendiente',

  payment_method payment_method not null,
  payment_status payment_status not null default 'pendiente',

  payment_id text,
  preference_id text,

  subtotal numeric(10,2) not null check (subtotal >= 0),
  delivery_fee numeric(10,2) not null default 0 check (delivery_fee >= 0),
  total numeric(10,2) not null check (total >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================
-- PEDIDO ITEMS
-- =========================================

create table pedido_items (
  id uuid primary key default gen_random_uuid(),

  pedido_id uuid not null
    references pedidos(id)
    on delete cascade,

  producto_id uuid
    references productos(id)
    on delete set null,

  producto_nombre text not null,

  cantidad integer not null check (cantidad > 0),

  precio_unitario numeric(10,2) not null
    check (precio_unitario >= 0),

  created_at timestamptz not null default now()
);


-- =========================================
-- ORDER STATUS HISTORY
-- =========================================

create table order_status_history (
  id uuid primary key default gen_random_uuid(),

  pedido_id uuid not null
    references pedidos(id)
    on delete cascade,

  estado order_status not null,

  changed_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now()
);

-- =========================================
-- UPDATED_AT TRIGGER FUNCTION
-- =========================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =========================================
-- UPDATED_AT TRIGGERS
-- =========================================

create trigger set_profiles_updated_at
before update on profiles
for each row
execute function set_updated_at();


create trigger set_store_settings_updated_at
before update on store_settings
for each row
execute function set_updated_at();


create trigger set_productos_updated_at
before update on productos
for each row
execute function set_updated_at();


create trigger set_pedidos_updated_at
before update on pedidos
for each row
execute function set_updated_at();


-- =========================================
-- CREATE PROFILE FUNCTION
-- =========================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

  insert into public.profiles (
    id,
    full_name
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  );

  return new;

end;
$$;


-- =========================================
-- CREATE PROFILE TRIGGER
-- =========================================

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function handle_new_user();


-- =========================================
-- INDEXES
-- =========================================

create index idx_user_roles_user_id
on user_roles(user_id);


create index idx_categorias_slug
on categorias(slug);


create index idx_productos_categoria_id
on productos(categoria_id);


create index idx_productos_slug
on productos(slug);


create index idx_productos_disponible
on productos(disponible);


create index idx_pedidos_estado
on pedidos(estado);


create index idx_pedidos_payment_status
on pedidos(payment_status);


create index idx_pedidos_created_at
on pedidos(created_at desc);


create index idx_pedido_items_pedido_id
on pedido_items(pedido_id);


create index idx_order_status_history_pedido_id
on order_status_history(pedido_id);