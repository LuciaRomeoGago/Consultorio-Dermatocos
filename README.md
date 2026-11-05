# Jazmín Sarasti Dermocosmética · sitio y panel

Sitio del consultorio de dermocosmética de Jazmín Sarasti (Tandil) y su panel de administración. Es la versión para usar en el consultorio, publicada en Cloudflare Pages. La demo del portfolio sigue en su propio repo (`Web_Consultorio_Dermatocosmiatra`) y en Vercel.

- Diseño: [Figma](https://www.figma.com/design/jOONiVqNAMVfCLfyk5uzUo/Dermatocosmetica) (sitio y sección "Panel de Admin")
- Datos: Supabase (base Postgres, login de la profesional y fotos de productos)

## Qué hace

**Sitio público**
- Reserva de turnos con agenda propia: solo ofrece horarios libres donde entra el tratamiento completo.
- Seña del 25% por transferencia: el turno web guarda el horario 30 minutos; si la seña no se marca como recibida en el panel, el horario se libera solo. La seña se descuenta del total y se devuelve si se cancela con 24 hs de anticipación (o si cancela la profesional).
- Contra turnos falsos: hasta 2 turnos activos por número de WhatsApp y 15 reservas web por día en total.
- Los datos para transferir están en `site.transfer` (`src/data/site.ts`). **Son de ejemplo: reemplazarlos.**
- Tienda con pedidos para retirar en el consultorio. El pedido se guarda con precios y stock tomados de la base; si falta stock, queda "esperando stock".
- El catálogo toma precio, stock, fotos y productos nuevos de la base. Las fichas largas (detalles, rutinas, sugerencias) siguen en `src/data`.
- Si la base no responde, el sitio sigue funcionando con el catálogo del código y los turnos y pedidos salen por WhatsApp, como en la demo.

**Panel** (`/admin`, solo para los mails cargados en la tabla `admins`)
- **Agenda:** día y semana, dar turno, "Seña recibida", reprogramar y cancelar (avisa si corresponde devolver la seña). Cada acción abre WhatsApp con el mensaje escrito; la profesional toca enviar.
- **Reservas:** estados (nueva, esperando stock, lista para retirar, retirada), transferencia recibida, aviso por WhatsApp. "Marcar retirada" descuenta del stock.
- **Productos:** alta y edición con dos fotos (producto y estética), rutinas con una foto y los productos que trae, ocultar o eliminar.
- **Stock:** poco stock y sin stock, ingreso de mercadería. Las reservas que esperaban ese producto pasan a "lista para retirar".

En escritorio el menú ocupa el alto de la pantalla y queda fijo; en celular pasa a una barra fija abajo y los paneles suben desde abajo.

## Puesta en marcha

### 1. Supabase (una vez)

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan gratis). Conviene la región más cercana (São Paulo).
2. **SQL Editor:** pegar y correr `supabase/schema.sql`, y después `supabase/seed.sql`. El seed carga los productos que ya tenía el sitio con stock 5 (0 si figuraban sin stock); se ajusta desde el panel.
3. **Authentication → Users → Add user:** crear el usuario de Jazmín con mail y contraseña, marcado como confirmado.
4. **SQL Editor:** darle acceso al panel con su mail:
   ```sql
   insert into public.admins (email) values ('mail-de-jazmin@ejemplo.com');
   ```
5. **Authentication → configuración de registro:** desactivar que se registren usuarios nuevos. Aunque alguien se registrara, sin estar en `admins` no ve ni modifica nada.
6. **Project Settings → API:** copiar la URL del proyecto y la clave pública (`anon` / publishable). La `service_role` no va nunca en el sitio.

En el plan gratis, Supabase pausa el proyecto si pasa una semana sin uso. Los datos no se pierden y se reactiva desde el panel de Supabase.

### 2. Correrlo en la compu

```bash
npm install
cp .env.example .env.local   # y completar las dos variables
npm run dev                  # http://localhost:5173 y http://localhost:5173/admin
npm run check                # prueba la lógica de horarios y WhatsApp
npm run build                # chequeo de tipos + build en dist/
```

### 3. Cloudflare Pages

1. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elegir este repo.
2. Framework preset: React (Vite) o ninguno. Build command: `npm run build`. Output: `dist`.
3. **Variables de entorno** (Production y Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `NODE_VERSION` = `22`.
4. Cada push a `main` publica solo. Como no hay `404.html`, Pages sirve `index.html` en cualquier ruta, así que `/admin` y `/tienda/...` funcionan al recargar.

## Estructura

```text
supabase/
├── schema.sql          tablas, seguridad (RLS), funciones y bucket de fotos
└── seed.sql            productos actuales del sitio
src/
├── main.tsx            carga el catálogo de la base y monta la app
├── App.tsx             rutas (el panel se descarga aparte)
├── data/               contenido tipado (tratamientos, productos, textos)
├── lib/
│   ├── api.ts          llamadas públicas a Supabase (sin librería)
│   ├── catalog.ts      pisa el catálogo del código con el de la base
│   ├── agenda.ts       horarios libres, huecos del día y números de WhatsApp
│   └── …               pedido, turnos, validación, mensajes
├── admin/              panel: Agenda, Reservas, Productos, Stock y su CSS
├── components/ pages/ styles/
scripts/selfcheck.ts    asserts de src/lib/agenda.ts
```

## Seguridad

- Todas las tablas tienen RLS: solo leen y escriben los mails de `admins`.
- La web pública entra solo por cuatro funciones: `catalogo`, `horarios_ocupados` (devuelve hora y duración, nunca nombres), `reservar_turno` y `crear_reserva`. Las dos últimas validan horario, superposición, precios y stock en la base, no en el navegador.
- Dos turnos no se pueden pisar: lo controla un trigger, los cargue la web o el panel.
- Las fotos se ven públicas; solo el panel las sube, cambia o borra.
