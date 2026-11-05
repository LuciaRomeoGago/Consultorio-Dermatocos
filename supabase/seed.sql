-- Productos que ya tenía el sitio. Correr una vez, después de schema.sql.
-- Stock inicial: 5 si figuraba disponible, 0 si no. Ajustalo desde el panel → Stock.

insert into public.productos (slug, word, name, subtitle, price, category, img, hover_img, es_rutina, stock, stock_min, visible) values
  ('emulsion-limpieza-suave', 'suave', 'Emulsión de Limpieza Suave', 'Higiene facial profunda', 28899, 'Limpieza', 'd47b083c84', 'de7595987e', false, 5, 2, true),
  ('acqua-di-jojoba', 'fresco', 'Acqua di Jojoba', 'El tónico que descongestiona', 26820, 'Tónicos', 'c36ba4104d', '711ce5c7a3', false, 5, 2, true),
  ('asthera-day', 'escudo', 'Asthera Day', 'Antioxidante de día', 70595, 'Hidratantes', '1cae1e22bb', '04973e6c86', false, 5, 2, true),
  ('bio-top-skin-support', 'defensa', 'Bio Top Skin Support', 'Protección urbana', 72530, 'Hidratantes', 'da0e56918b', 'c59df66be7', false, 5, 2, true),
  ('suero-glamour', 'lifting', 'Suero Glamour', 'Efecto tensor', null, 'Sérums', 'e5dc17ca52', '216e9ba793', false, 5, 2, true),
  ('rutina-luz', 'luz', 'Rutina luz', 'Antioxidantes de día y de noche', 154300, 'Rutinas', '2a7c99c00d', '5d155ad4a5', true, 0, 2, true),
  ('emulfresh', 'calma', 'Emulfresh', 'Para piel enrojecida', null, 'Hidratantes', '7de1bea3ac', 'd48c0cd73e', false, 5, 2, true),
  ('suero-rediles', 'alivio', 'Suero Rediles', 'Sérum para piel sensible', null, 'Sérums', 'a97ff9d9a0', '5821f9a65b', false, 5, 2, true),
  ('asthera-night', 'noche', 'Asthera Night', 'Renovación de noche', null, 'Hidratantes', 'asthera-night', 'asthera-night', false, 5, 2, false),
  ('chromaluxe-bright-serum', 'brillo', 'Chromaluxe Bright Serum', 'Corrector de manchas', 62200, 'Sérums', '1b3c6b5357', '1b3c6b5357', false, 5, 2, false),
  ('mascara-acido-hialuronico', 'agua', 'Máscara con ácido hialurónico', 'Hidratación de manchas', 33190, 'Máscaras', 'c36ba4104d', 'c36ba4104d', false, 5, 2, false),
  ('dcs-serum', 'mirada', 'DCS Serum', 'Sérum para ojeras', 99900, 'Sérums', 'da0e56918b', 'da0e56918b', false, 0, 2, false);

-- Qué trae cada rutina.
insert into public.rutina_items (rutina_id, producto_id)
select r.id, p.id from public.productos r, public.productos p where r.slug = 'rutina-luz' and p.slug = 'emulsion-limpieza-suave'
union all
select r.id, p.id from public.productos r, public.productos p where r.slug = 'rutina-luz' and p.slug = 'asthera-day'
union all
select r.id, p.id from public.productos r, public.productos p where r.slug = 'rutina-luz' and p.slug = 'asthera-night';
