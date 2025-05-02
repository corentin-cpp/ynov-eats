create table orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references users(id) on delete cascade,
  item text not null,
  client text not null,
  status text not null check (status in ('En cours', 'En préparation', 'Prête')),
  created_at timestamp with time zone default now()
);
create table order_history (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references users(id) on delete cascade,
  item text not null,
  client text not null,
  price numeric(10, 2) not null,
  date date not null default current_date
);
-- Pour orders
alter table orders enable row level security;

-- Pour order_history
alter table order_history enable row level security;
-- Lecture : un restaurant peut lire ses commandes
create policy "Read own orders"
on orders for select
using (restaurant_id = auth.uid());

-- Insertion : un restaurant peut ajouter ses commandes
create policy "Insert own orders"
on orders for insert
with check (restaurant_id = auth.uid());

-- Mise à jour : un restaurant peut modifier ses commandes
create policy "Update own orders"
on orders for update
using (restaurant_id = auth.uid());

-- Suppression : un restaurant peut supprimer ses commandes
create policy "Delete own orders"
on orders for delete
using (restaurant_id = auth.uid());
-- Lecture : un restaurant peut lire son historique
create policy "Read own order history"
on order_history for select
using (restaurant_id = auth.uid());

-- Insertion : un restaurant peut ajouter une ligne d’historique
create policy "Insert own order history"
on order_history for insert
with check (restaurant_id = auth.uid());
