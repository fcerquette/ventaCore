# Base Template

Monorepo base para arrancar proyectos nuevos. Replica el stack de `eternumpro`
(Vue 3 + NestJS + Firebase) y agrega la particularidad de **3 grandes áreas en el
router, cada una con su propio login**:

| Área          | Ruta base      | Login              | Rol requerido |
| ------------- | -------------- | ------------------ | ------------- |
| Super Admin   | `/superadmin`  | `/superadmin/login`| `superadmin`  |
| Administración| `/admin`       | `/admin/login`     | `admin`       |
| Aplicación    | `/app`         | `/app/login`       | `user`        |

Las 3 comparten un **único backend de autenticación (Firebase)**; cada login
valida que el usuario tenga el rol del área y, si no, lo manda a la suya.

## Stack

- **Monorepo:** Turbo + npm workspaces (Node 24)
- **Frontend** (`packages/frontend`): Vue 3 (Options API), Vite, PrimeVue 4, Tailwind 4,
  Pinia (+ persistedstate), vue-router, vue-i18n, Zod, Firebase Web SDK, PWA
- **API** (`packages/api`): NestJS 11, TypeORM (Postgres), Swagger, Firebase Admin,
  guards de auth y autorización por rol
- **Shared** (`packages/shared`): tipos compartidos (roles, áreas, usuario)
- **SDK** (`packages/sdk`): autogenerado desde el Swagger (`typescript-axios`)

## Estructura

```
packages/
  frontend/
    src/
      modules/
        auth/        ← store de usuario + LoginForm + AreaLayout (reutilizables)
        superadmin/  ← área /superadmin (routes + views)
        admin/       ← área /admin
        app/         ← área /app
      router/        ← router + guard único por rol (basado en shared/AREAS)
      shared/        ← providers (firebase), services (api/axios), views
      i18n/          ← es / en
  api/
    src/
      common/
        firebase/    ← FirebaseService (Firebase Admin)
        auth/        ← FirebaseAuthGuard, RolesGuard, @Roles, @CurrentUser
      modules/
        auth/        ← GET /auth/me (perfil + rol)
        users/       ← CRUD de usuarios (alta crea el usuario en Firebase Auth)
  shared/            ← Role, AREAS, UserProfile, ...
  sdk/               ← autogenerado (no editar)
```

## Cómo extender

- **Nueva área / sección:** agregá la entrada en `packages/shared/src/types/area.ts`
  (`AREAS`) y creá un módulo en `frontend/src/modules/<area>/` con su `routes.ts`
  (replicá `app/`). El guard funciona automáticamente leyendo `meta.area`.
- **Nuevo módulo de negocio en un área:** agregá vistas como `children` de la ruta
  del área.
- **Proteger un endpoint por rol:** `@UseGuards(FirebaseAuthGuard, RolesGuard)` +
  `@Roles(Role.ADMIN)`.

## Puesta en marcha

1. **Variables de entorno:** completá `.env.development` (Firebase web + admin, Postgres).
2. **Postgres** corriendo y la base creada (`DB_NAME`). Con `DB_SYNCHRONIZE=true` TypeORM
   crea las tablas solo.
3. **Firebase:** proyecto con Authentication (Email/Password) habilitado y un
   service account JSON (`GOOGLE_APPLICATION_CREDENTIALS`).
4. Instalar dependencias:
   ```bash
   npm install
   ```
5. **Crear el primer superadmin** (necesario porque el alta de usuarios requiere uno):
   ```bash
   cd packages/api
   dotenvx run -f ../../.env.development -- ts-node -r tsconfig-paths/register src/seed.ts admin@tudominio.com unaClave123
   ```
6. **Levantar todo** (frontend + api en paralelo) desde la raíz:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api — Swagger en `/api/docs`
7. **Generar el SDK** (con el API corriendo):
   ```bash
   npm run generate:sdk
   ```

## Flujo de auth (resumen)

1. El usuario entra a `/superadmin/login` (o `/admin/login`, `/app/login`).
2. `LoginForm` hace `signInWithEmailAndPassword` (Firebase) y luego pide `GET /auth/me`.
3. El API verifica el ID token (Firebase Admin), busca el perfil + rol en Postgres y lo devuelve.
4. Si el rol coincide con el área → entra; si no → se cierra sesión y se muestra "sin permiso".
5. El guard del router (`router/index.ts`) protege cada área según `meta.area` + rol.
