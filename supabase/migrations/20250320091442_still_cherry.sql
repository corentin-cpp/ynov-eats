/*
  # Ajout de la politique d'insertion pour les utilisateurs

  1. Changements
    - Ajout d'une politique permettant aux utilisateurs authentifiés de créer leur profil
    - La politique vérifie que l'ID de l'utilisateur correspond à celui de l'auth

  2. Sécurité
    - Seuls les utilisateurs authentifiés peuvent créer leur profil
    - L'ID du profil doit correspondre à l'ID d'authentification
*/

CREATE POLICY "Les utilisateurs peuvent créer leur propre profil"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);