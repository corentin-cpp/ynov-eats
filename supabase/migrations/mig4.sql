/*
  # Add restaurant view

  1. New View
    - Creates a view `restaurant_details` that combines user and menu item information
    - Shows restaurant profile information and their menu items
    - Only includes users who are restaurants (is_restaurant = true)

  2. Security
    - RLS policy to control access to the view
    - Public can read restaurant information
*/

-- Create the restaurant_details view
CREATE VIEW restaurant_details AS
SELECT 
  u.id as restaurant_id,
  u.name as restaurant_name,
  u.email as restaurant_email,
  u.created_at as restaurant_since,
  COUNT(m.id) as total_menu_items,
  json_agg(json_build_object(
    'id', m.id,
    'name', m.name,
    'category', m.category,
    'price', m.price
  )) FILTER (WHERE m.id IS NOT NULL) as menu_items
FROM users u
LEFT JOIN menu_items m ON u.id = m.restaurant_id
WHERE u.is_restaurant = true
GROUP BY u.id, u.name, u.email, u.created_at;

-- Enable RLS on the view
ALTER VIEW restaurant_details SECURITY INVOKER;

-- Create policy for public read access
CREATE POLICY "Allow public read access on restaurant details"
  ON restaurant_details
  FOR SELECT
  TO public
  USING (true);