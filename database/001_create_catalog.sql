CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL REFERENCES categories(name),
  price INTEGER NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description TEXT NOT NULL,
  tag TEXT NOT NULL,
  image_url TEXT,
  image_urls TEXT[]
);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_urls TEXT[];

INSERT INTO categories (name)
VALUES ('Controladores IoT')
ON CONFLICT (name) DO NOTHING;

DELETE FROM products
WHERE slug <> 'controlador-lorawan-exterior-solar-sdi12-rs485-4-20ma-uc501-milesight';

INSERT INTO products (
  name,
  slug,
  category,
  price,
  stock,
  description,
  tag,
  image_url,
  image_urls
)
VALUES (
  'Milesight UC501 Multi-Interface LoRaWAN Controller',
  'controlador-lorawan-exterior-solar-sdi12-rs485-4-20ma-uc501-milesight',
  'Controladores IoT',
  172990,
  1,
  'Controlador multi-interfaz LoRaWAN para conectar sensores de campo mediante GPIO, RS232/RS485, SDI-12 y entradas analógicas 4-20mA o 0-10V.',
  'Milesight',
  '/assets/controlador-lorawan-exterior-solar-sdi12-rs485-4-20ma-uc501-milesight.jpg',
  ARRAY[
    '/assets/controlador-lorawan-exterior-solar-sdi12-rs485-4-20ma-uc501-milesight.jpg',
    '/assets/controlador-lorawan-exterior-solar-sdi12-rs485-4-20ma-uc501-milesight-2.jpg'
  ]
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  image_url = EXCLUDED.image_url,
  image_urls = EXCLUDED.image_urls;
