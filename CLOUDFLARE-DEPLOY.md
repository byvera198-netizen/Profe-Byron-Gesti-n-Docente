# Despliegue en Cloudflare Workers

La aplicación se despliega como un Worker con D1 y archivos estáticos.

1. En Cloudflare crea una base D1 llamada `profe-byron-docente-db`.
2. Copia su identificador y reemplaza `REEMPLAZAR_CON_ID_DE_D1` en `wrangler.jsonc`.
3. Ejecuta `npm run build`.
4. Aplica las migraciones, en orden:
   `npx wrangler d1 execute profe-byron-docente-db --remote --file=drizzle/0000_dazzling_hawkeye.sql`
   y los archivos restantes de `drizzle/` hasta `0003_absent_amazoness.sql`.
5. Configura los secretos `TOKEN_ENCRYPTION_KEY`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` con `npx wrangler secret put`.
6. Publica con `npx wrangler deploy`.

El enlace gratuito de producción será `https://profe-byron-docente.byvera198.workers.dev`.


