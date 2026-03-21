# Puntico — Memoria Latinoamericana

Juego de memoria digital con ediciones coleccionables de Panamá y Venezuela. Incluye tienda física con carrito, checkout y notificaciones automáticas.

🌐 **Producción:** [punticomemoria.netlify.app](https://punticomemoria.netlify.app)

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Estilos | Tailwind CSS (CDN) |
| Iconos | Lucide Icons |
| Base de datos & Auth | Supabase (PostgreSQL + RLS) |
| Serverless Functions | Supabase Edge Functions (Deno) |
| Hosting | Netlify |
| Repositorio | GitHub (auto-deploy a Netlify) |
| Dominio | Namecheap |
| Emails transaccionales | Resend |

---

## Proveedores y Servicios Conectados

### 🗄️ Supabase
- **Uso:** Base de datos PostgreSQL, autenticación de usuarios, políticas RLS y Edge Functions
- **Dashboard:** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Project ID:** `ikpnbvicuaiexrqvuvux`
- **Tablas principales:** `profiles`, `game_sessions`, `products`, `orders`, `order_items`
- **Edge Functions:** `send-order-email`
- **Variables de entorno requeridas en Edge Functions:**
  ```
  RESEND_KEY      → API key de Resend
  ADMIN_EMAIL     → Email que recibe notificaciones de nuevas órdenes
  ```

---

### 🚀 Netlify
- **Uso:** Hosting del sitio web con deploy automático desde GitHub
- **Dashboard:** [app.netlify.com](https://app.netlify.com)
- **URL de producción:** `punticomemoria.netlify.app`
- **Deploy:** Automático en cada `git push` a rama `main`
- **Configuración:** Sin archivo `netlify.toml` — configuración por defecto

---

### 📧 Resend
- **Uso:** Envío de emails transaccionales automáticos al confirmar una orden
- **Dashboard:** [resend.com](https://resend.com)
- **Emails que envía:**
  - ✅ Confirmación de pedido al cliente
  - 🛒 Notificación de nueva orden al admin
- **Remitente actual:** `onboarding@resend.dev` (temporal, desarrollo)
- **Remitente producción:** pendiente verificar dominio `tipovisual.com`
- **Plan:** Free (3,000 emails/mes)
- **⚠️ Limitación actual:** En plan gratuito sin dominio verificado, los emails a clientes pueden ir a spam. Se resuelve al conectar el dominio.

---

### 🌐 Namecheap
- **Uso:** Registro y gestión del dominio
- **Dashboard:** [namecheap.com](https://namecheap.com)
- **Dominio:** `tipovisual.com` (pendiente conectar a Netlify)
- **Estado:** En desarrollo — dominio aún no apuntado a Netlify

---

### 💬 WhatsApp (wa.me)
- **Uso:** Notificación manual al confirmar una orden — abre WhatsApp con mensaje pre-armado
- **Implementación:** Links `wa.me` nativos, sin API externa
- **Configuración:** Variable `ADMIN_WHATSAPP` en `checkout.html`
- **Formato del número:** Sin `+`, ej: `50761234567`

---

## Variables de Configuración

Estos valores deben actualizarse antes de salir a producción:

### `checkout.html`
```javascript
const ADMIN_WHATSAPP = '50763068799'; // ← Número real de WhatsApp
```

### `supabase-config.js`
```javascript
const SUPABASE_URL  = 'https://[project-id].supabase.co';
const SUPABASE_ANON = '[anon-key]';
```

### Supabase → Authentication → URL Configuration
```
Site URL:      https://punticomemoria.netlify.app
Redirect URLs: https://punticomemoria.netlify.app/**
```
> ⚠️ Actualizar cuando se conecte el dominio de Namecheap.

---

## Estructura del Proyecto

```
Landing/
├── assets/
│   ├── cartas/          # Imágenes de las cartas del juego
│   ├── mockups/         # Imágenes de productos para la tienda
│   └── brand-puntico.svg
├── supabase/
│   └── functions/
│       └── send-order-email/
│           └── index.ts  # Edge Function — emails con Resend
├── index.html            # Página principal + sección tienda
├── game.html             # Juego de memoria
├── store.html            # Tienda con carrito
├── checkout.html         # Checkout + WhatsApp
├── login.html            # Login y registro
├── profile.html          # Perfil de usuario
├── dashboard.html        # Panel de administración
└── supabase-config.js    # Configuración Supabase (cliente)
```

---

## Base de Datos

El esquema completo está en `fase2-ecommerce.sql`. Para replicar el entorno ejecutar en Supabase SQL Editor:

1. SQL de Fase 1 (auth, profiles, game_sessions)
2. `fase2-ecommerce.sql` (products, orders, order_items, RLS policies)
3. Función anti-recursión RLS:
```sql
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

---

## Roles de Usuario

| Rol | Acceso |
|-----|--------|
| `user` | Juego, tienda, perfil personal |
| `admin` | Todo lo anterior + dashboard de administración |

Para asignar rol admin:
```sql
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'email@ejemplo.com');
```

---

## Pendientes antes de Producción

- [ ] Conectar dominio Namecheap → Netlify
- [ ] Verificar dominio en Resend para emails sin restricciones
- [ ] Actualizar Site URL en Supabase al dominio final
- [ ] Integrar pasarela de pago (Stripe recomendado)
- [ ] Auditoría de seguridad (RLS, API keys, headers, rate limiting)
- [ ] Meta tags y SEO básico
- [ ] Google Analytics 4 + Meta Pixel

---

## Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/tipovisual/tipo-visual.git
cd tipo-visual

# Abrir con Live Server en VS Code
# Extensión recomendada: ritwickdey.LiveServer

# Deploy de Edge Functions
supabase link --project-ref ikpnbvicuaiexrqvuvux
supabase functions deploy send-order-email
```

---

*© 2026 TipoVisual · Raíces que conectan*
