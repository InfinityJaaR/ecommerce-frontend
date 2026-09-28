# Evidencias de ejecución

Evidencias capturadas contra el frontend en build de producción y una API Laravel 12 local con SQLite y 15 productos de prueba:

- `catalogo.png`: catálogo renderizado desde los productos reales de la API local.
- `swagger-endpoints.png`: Swagger UI expandido, con rutas de Auth, Products y Orders.
- `lighthouse-desktop.html`: medición de escritorio del catálogo con Lighthouse.
- `lighthouse-mobile.html`: medición móvil del catálogo con Lighthouse.

Los reportes registran la URL local `http://localhost:3000/` y se generaron el 27 de septiembre de 2026 contra la build de producción, API Laravel local y catálogo sembrado. En la corrida guardada: Lighthouse Desktop reportó Performance 95, Accessibility 95, Best Practices 96 y SEO 100; FCP 0.7 s, LCP 1.4 s, TBT 10 ms y CLS 0. Lighthouse Mobile reportó Performance 95. El informe móvil incluye una nota de calibración de CPU del dispositivo de medición. Al repetirlos, anota la fecha, versión de Lighthouse y si se midió local o desplegado.
