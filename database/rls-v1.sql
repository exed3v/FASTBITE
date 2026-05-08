-- =========================================
-- ENABLE RLS
-- =========================================

alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table store_settings enable row level security;
alter table categorias enable row level security;
alter table productos enable row level security;
alter table pedidos enable row level security;
alter table pedido_items enable row level security;
alter table order_status_history enable row level security;


-- =========================================
-- HELPER FUNCTION
-- =========================================

create or replace function has_role(_role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from user_roles
    where user_id = auth.uid()
    and role = _role
  );
$$;


-- =========================================
-- PROFILES
-- =========================================

create policy "Admins can read profiles"
on profiles
for select
using (
  has_role('admin')
);


-- =========================================
-- USER ROLES
-- =========================================

create policy "Admins can read user roles"
on user_roles
for select
using (
  has_role('admin')
);


-- =========================================
-- STORE SETTINGS
-- =========================================

create policy "Anyone can read store settings"
on store_settings
for select
using (true);


create policy "Admins can update store settings"
on store_settings
for update
using (
  has_role('admin')
);


-- =========================================
-- CATEGORIAS
-- =========================================

create policy "Anyone can read categorias"
on categorias
for select
using (true);


create policy "Admins can insert categorias"
on categorias
for insert
with check (
  has_role('admin')
);


create policy "Admins can update categorias"
on categorias
for update
using (
  has_role('admin')
);


create policy "Admins can delete categorias"
on categorias
for delete
using (
  has_role('admin')
);


-- =========================================
-- PRODUCTOS
-- =========================================

create policy "Anyone can read productos"
on productos
for select
using (true);


create policy "Admins can insert productos"
on productos
for insert
with check (
  has_role('admin')
);


create policy "Admins can update productos"
on productos
for update
using (
  has_role('admin')
);


create policy "Admins can delete productos"
on productos
for delete
using (
  has_role('admin')
);


-- =========================================
-- PEDIDOS
-- =========================================

create policy "Anyone can create pedidos"
on pedidos
for insert
with check (true);


create policy "Admins can read pedidos"
on pedidos
for select
using (
  has_role('admin')
);


create policy "Admins can update pedidos"
on pedidos
for update
using (
  has_role('admin')
);


-- =========================================
-- PEDIDO ITEMS
-- =========================================

create policy "Anyone can create pedido items"
on pedido_items
for insert
with check (true);


create policy "Admins can read pedido items"
on pedido_items
for select
using (
  has_role('admin')
);


-- =========================================
-- ORDER STATUS HISTORY
-- =========================================

create policy "Admins can read order status history"
on order_status_history
for select
using (
  has_role('admin')
);


create policy "Admins can create order status history"
on order_status_history
for insert
with check (
  has_role('admin')
);