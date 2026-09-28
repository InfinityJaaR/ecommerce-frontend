# Frontend e-commerce

Frontend de e-commerce independiente construido con **Next.js 16 App Router, React 19 y TypeScript**. Consume la API Laravel 12 como servidor backend, guarda el JWT en una cookie `httpOnly` y usa Stripe Payment Element para confirmar pagos.

## Requisitos

- Node.js 20.9 o posterior y npm.
- API Laravel disponible (por defecto, `http://localhost:8000`). Instrucciones de instalación: [`../ecommerce-api/README.md`](https://github.com/InfinityJaaR/ecommerce-api/blob/main/README.md).
- Claves de Stripe en modo de prueba configuradas en Laravel. Para el estado final del pedido, la API debe recibir el webhook de Stripe.

## Configuración

Desde esta carpeta:

```bash
cp .env.example .env.local
```

Configura las variables:

| Variable | Descripción |
| --- | --- |
| `API_BASE_URL` | URL server-side de la API, incluyendo `/api`. Ejemplo: `http://localhost:8000/api`. No lleva prefijo `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave publicable `pk_test_...` de Stripe para Payment Element. Nunca usar aquí `sk_...`. |
| `NEXT_PUBLIC_SITE_URL` | Origen del frontend para generar enlaces de retorno; localmente `http://localhost:3000`. |

La clave secreta de Stripe, el webhook secret y el secreto JWT pertenecen únicamente al `.env` de Laravel. El token del usuario se conserva en una cookie `httpOnly` y no se envía al código del navegador.

## Ejecutar localmente

Terminal 1 — API, en `../ecommerce-api`:

```bash
php artisan serve
```

Para completar el pago localmente, configura Stripe CLI y reenvía los eventos a la API:

```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

Para habilitar el formulario de Stripe configura `STRIPE_KEY`, `STRIPE_SECRET` y `STRIPE_WEBHOOK_SECRET` en `ecommerce-api/.env`, y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` en `ecommerce-frontend/.env.local`. Reinicia `next dev` después de cambiar la clave publicable; con producción, vuelve a ejecutar `npm run build` y luego `npm run start`. Las claves de Stripe no se incluyen en el repositorio.

Terminal 2 — frontend, en este proyecto:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La API y su Swagger están disponibles normalmente en [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation).

Con el seeder de Laravel, puedes iniciar sesión con `cliente@ecommerce.test` / `password`. Para Stripe en modo de prueba, usa la tarjeta `4242 4242 4242 4242`, una fecha futura y cualquier CVC de tres dígitos.

## Flujo implementado

1. Navegar por el catálogo público y el detalle (`GET /api/products`, `GET /api/products/{id}`). Las lecturas se realizan en Server Components y se revalidan cada 60 segundos.
2. Crear una cuenta o iniciar sesión (`POST /api/auth/register`, `POST /api/auth/login`). El JWT se guarda en una cookie `httpOnly`, `SameSite=Lax` y `Secure` en producción.
3. Añadir, quitar y cambiar cantidades desde la bolsa local. Los precios e inventario se validan de nuevo en Laravel al crear el pedido.
4. Crear una orden (`POST /api/orders`), iniciar el PaymentIntent (`POST /api/orders/{id}/checkout`) y confirmar el pago con Stripe Payment Element.
5. La API confirma la orden mediante webhook; la página de confirmación consulta el estado hasta recibir el resultado.
6. Consultar historial (`GET /api/orders`) y detalle (`GET /api/orders/{id}`), siempre con el token reenviado desde el servidor.

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Catálogo paginado público y sección destacada |
| `/products/[id]` | Detalle público de producto |
| `/login` | Inicio de sesión |
| `/register` | Registro de cliente |
| `/cart` | Carrito local |
| `/checkout` | Checkout protegido y Stripe Payment Element |
| `/checkout/confirmation/[id]` | Estado y resumen del pedido |
| `/orders` | Historial protegido de compras |

## Rendimiento y resiliencia

- Lecturas públicas desde Server Components con `revalidate: 60` y etiquetas de producto.
- Sesión y lecturas personales sin caché; las mutaciones usan Server Actions y las actualizaciones invalidan rutas cuando corresponde.
- `Suspense` para catálogo e historial, además de `loading.tsx` y `error.tsx` en segmentos principales.
- El cliente registra CLS, INP, LCP, FCP y TTFB por `/api/vitals`; en desarrollo quedan visibles en la terminal.
- Tras un pago, la UI espera al webhook para presentar el estado definitivo como pagado.

## Validación

```bash
npm run lint
npm run typecheck
npm run build
```

## Evidencias de la actividad

Los artefactos ya generados están en [`docs/evidence/`](./docs/evidence/): `catalogo.png`, `swagger-endpoints.png`, `lighthouse-desktop.html` y `lighthouse-mobile.html`. La descripción y los resultados medidos están en [docs/evidence/README.md](./docs/evidence/README.md).


Para capturar Lighthouse con el servidor de producción:

```bash
npm run build
npm run start
```

En otra terminal ejecuta `npm run lighthouse` para escritorio y `npm run lighthouse:mobile` para móvil si quieres regenerar los reportes.

En el entorno preparado para esta actividad, el API local usa SQLite con el seeder de productos y el usuario de prueba (`cliente@ecommerce.test` / `password`). La base, el `.env` y `vendor/` son locales e ignorados por Git.
