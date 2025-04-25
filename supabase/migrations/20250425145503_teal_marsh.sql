/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `order_id` (text, unique)
      - `date` (date)
      - `customer_name` (text)
      - `email` (text)
      - `phone` (text)
      - `product_name` (text)
      - `product_code` (text)
      - `size` (text)
      - `fit_type` (text)
      - `color` (text)
      - `price` (numeric)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `orders` table
    - Add policies for authenticated users to:
      - Read their own orders
      - Create new orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  date date NOT NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  product_name text,
  product_code text,
  size text,
  fit_type text,
  color text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);