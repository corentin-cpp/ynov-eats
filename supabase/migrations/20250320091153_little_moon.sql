/*
  # Création des tables pour YnovEat

  1. Tables
    - users
      - id (uuid, clé primaire)
      - email (text, unique)
      - name (text)
      - created_at (timestamp)
      - is_restaurant (boolean)
      - points (integer)
      - orders_count (integer)

    - menu_items
      - id (uuid, clé primaire)
      - name (text)
      - description (text)
      - price (numeric)
      - image_url (text)
      - category (text)
      - restaurant_id (uuid, clé étrangère)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès définies pour chaque table
*/

-- Table des utilisateurs
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_restaurant boolean DEFAULT false,
  points integer DEFAULT 0,
  orders_count integer DEFAULT 0
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent lire leur propre profil"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Table des plats
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  image_url text NOT NULL,
  category text NOT NULL,
  restaurant_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les plats"
  ON menu_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les restaurateurs peuvent gérer leurs plats"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = restaurant_id)
  WITH CHECK (auth.uid() = restaurant_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();