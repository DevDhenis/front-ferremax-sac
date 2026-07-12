# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Frontend de FERREMAX S.A.C. Este archivo es la fuente de verdad del stack, arquitectura y convenciones. Ver **Estándares de código y comunicación** para la regla de idiomas.

## Comandos de construcción y desarrollo

- `pnpm run dev` — servidor de desarrollo (Vite)
- `pnpm run build` — build de producción
- `pnpm run lint` — ESLint
- `pnpm run preview` — previsualizar el build de producción
- **Pruebas**: ninguna configurada.

Gestor de paquetes: **pnpm** (hay `pnpm-workspace.yaml`). Requiere `.env` con `VITE_BASE_URL` (base de la API, p. ej. `http://localhost:8000/api/`).

## Pipeline de CI/CD

- **Configuración**: `.github/workflows/ci.yml` (GitHub Actions).
- **Triggers**: automático en `push` y `pull_request` a las ramas `main` y `develop`.
- **Pasos**: checkout → Node.js v22 → instalar pnpm → `pnpm install --frozen-lockfile` → `pnpm run build`.
- **Merge**: el status check del job `build` debe pasar obligatoriamente antes de fusionar cualquier PR a `main` o `develop`.
- **Deploy (Vercel)**: merge/push a `main` → despliegue a producción; los PRs generan preview deployments automáticos.

## Stack

React 19 + Vite 7, JavaScript/JSX (no TypeScript). React Router DOM v7, Axios. Alias `@/` → `src/` (en `vite.config.js` y `jsconfig.json`); `@/components/ui` reservado para primitivos shadcn.

## Arquitectura y estructura

**Enrutamiento en dos niveles.** `src/App.jsx` monta los providers globales (`ToastProvider` → `AuthProvider` → `<Toaster/>`) y separa rutas públicas (`/login`, `/register`, `/verification`, `/reset-password`) de las privadas bajo `/*`, protegidas por `PrivateRoute` → `PrivateLayout`. `src/components/routes/PrivateLayout.jsx` define el layout autenticado (`SidebarProvider` + `AppSidebar` con pie de cuenta/cerrar sesión + `Navbar`) y sus rutas anidadas: `/catalogo`, `/roles`, `/trabajadores`, `/inventario`, `/acerca`, `/historial`, `/ventas`. `src/services/auth/privateRoute.jsx` muestra un loader de pantalla completa branded (logo + `Loader2`) mientras valida la sesión; una vez autenticado cada página carga dentro del layout.

**Auth + cliente HTTP (`src/services/auth/`).** `authProvider.jsx` crea el `AuthContext` con `user`, `accesses` (permisos de rutas; el primer acceso dirige el redirect post-login) y una instancia Axios `http` con `baseURL: import.meta.env.VITE_BASE_URL`. Token/user/accesses se persisten en `localStorage`; al montar valida contra `/auth/me`. Consumir siempre con `useAuth()` (desde `authContext.js`), que lanza error fuera del provider; nunca importar el provider directo.

**Interceptor de toasts (Axios).** El interceptor de respuesta en `authProvider` dispara automáticamente un toast de éxito en `POST`/`PUT`/`DELETE` exitosos (cuando la respuesta trae `success` + `message`) y un toast de error ante cualquier fallo. Para que un componente maneje su **propio** toast sin duplicar, pasar `{ skipToast: true }` en la config de la petición (ver `addItemToCart` en `src/services/shopping-cart/index.js`).

**Patrón de consumo de API (importante).**
- Endpoints por feature en `src/services/<feature>/index.js` como funciones `async` que reciben `http` como **primer argumento**: `getSales(http)`, `addItemToCart(http, productId)`.
- Las páginas usan hooks en `src/hooks/` (p. ej. `useSales`, `useShoppingCart`, `useInventoryReport`) que obtienen `http` de `useAuth()`, llaman a las funciones del servicio y exponen `loading` + handlers.
- La API responde envuelta como `{ success, message, data }`. La lista/objeto real suele estar en **`data.data`** (los servicios devuelven `response.data`; los hooks devuelven `result.data`).

**Carrito (`src/context/CartContext.jsx`).** Estado compartido del carrito (conteo para el badge). Se monta **solo en la ruta `/catalogo`** (no global) para no consultar `/shopping-cart` en los demás módulos.

## Stack de UI (shadcn-only, sin PrimeReact)

> **PrimeReact, PrimeFlex y PrimeIcons fueron ELIMINADOS por completo (issue #5).** El proyecto es **100% Tailwind v4 + shadcn/ui**. No reintroducir PrimeReact ni ninguna de sus dependencias.

- **Tailwind CSS v4**: única fuente de utilidades/layout, vía el plugin `@tailwindcss/vite` (configuración CSS-first, **sin `tailwind.config.js`**). Se importa en `src/index.css`. Usar siempre utilidades idiomáticas de Tailwind (`flex`, `grid grid-cols-12` + `col-span-*`, `size-*`/`w-N h-N`, `rounded-xl`, `shadow-sm`, `hidden`…). Ya **no** hacen falta workarounds `!important` (eran por el conflicto con PrimeFlex, que ya no existe).
- **shadcn/ui sobre `@base-ui/react` (NO Radix)**: los primitivos viven en `src/components/ui/`. Componentes copiados del CLI de shadcn vienen en Radix — adaptarlos al estilo `@base-ui/react` existente. Componer clases con `cn` de `src/lib/utils.js`. Primitivos disponibles: `button`, `input`, `textarea`, `select`, `checkbox`, `badge`, `avatar`, `dialog`, `alert-dialog`, `dropdown-menu`, `tooltip`, `table`, `data-table`, `data-table-column-header`, `carousel`, `sonner`, `sidebar`, `sheet`, `separator`, `skeleton`, `input-otp`.
- **Iconos: `lucide-react`** (SVG). No usar `<i className="pi ...">`. Iconos nuevos: `<LucideIcon className="size-4" />` (tamaño con `size-*`, color con `text-*`). El `ActionButton` compartido aún acepta strings heredados `icon="pi pi-xxx"` y los mapea a lucide vía `src/lib/icons.jsx` (`resolveIcon`); en código nuevo pasar el componente lucide directo (`icon={Pencil}`).
- **Tablas: TanStack Table** (`@tanstack/react-table`) vía `src/components/ui/data-table.jsx` (ordenamiento, búsqueda global y paginación). Cabeceras ordenables con `DataTableColumnHeader`.
- **Carrusel: embla** (`embla-carousel-react` + `embla-carousel-autoplay`) vía `src/components/ui/carousel.jsx`.

## Theming y lenguaje visual (paleta "Quiet")

- **Tokens semánticos** definidos en `@theme` en `src/index.css` (paleta *Quiet — grafito cálido*, **solo light**; no hay toggle de tema). Usar **siempre** los tokens, nunca colores hardcodeados (`bg-blue-500`, `text-white`…):
  - Superficies: `bg-background`, `bg-card`, `bg-popover`, `bg-secondary`, `bg-muted`.
  - Texto: `text-foreground`, `text-muted-foreground`.
  - Bordes/anillos: `border-border`, `border-input`, `ring-ring`, `ring-primary`.
  - Acción: `bg-primary`/`text-primary-foreground`.
  - Estados: `text-destructive`/`bg-destructive-bg`, `text-success`/`bg-success-bg`, `text-warning`/`bg-warning-bg`.
- **Voz-dato monoespaciada**: la clase `.font-spec` (en `src/index.css`) se usa en **datos**: SKU, precios, stock, unidades, conteos y números de página. Poppins es la fuente global para títulos/prosa.
- **Editorial**: eyebrows en versalitas con tracking amplio (`text-[10px] uppercase tracking-[0.14em]`), divisores hairline (`border-border/40`) y `focus-visible` en todo lo interactivo.

## Componentes comunes reutilizables (`src/components/common/`)

- `ActionButton` — adaptador sobre el `Button` de shadcn (mapea `color`/`size` a variantes) + tooltip; renderiza iconos lucide.
- `CustomModal` — adaptador sobre `Dialog` (API estilo `visible`/`onHide`/`header`/`footerActions`).
- `ConfirmDialog` — diálogo de confirmación reutilizable sobre `AlertDialog`. Úsalo para TODA confirmación de borrado. Controlado: `open`, `onOpenChange`, `title`, `description`, `confirmLabel`, `onConfirm`, `tone`.
- `CustomSearch` — buscador con debounce (500 ms). `SearchInput` — variante usada en inventario.
- `Pagination` — paginación standalone (para listas fuera del DataTable).
- `StatusBadge` — píldora de estado con tonos de la paleta (`success`/`danger`/`warning`/`primary`/`muted`).

## Toasts (sonner)

- Librería: **sonner**. El `<Toaster>` (estilizado con la paleta, `richColors`, posición `top-right`) se monta en `src/App.jsx` desde `src/components/ui/sonner.jsx`.
- `src/context/ToastContext.jsx`: `useToast()` → `showToast(severity, summary, detail)` mapea a `sonner`.
- Ver el interceptor de Axios (arriba) para el comportamiento automático y el escape `{ skipToast: true }`.

## Commits

- **No agregar coautoría de Claude/IA** en los commits: nunca incluir líneas `Co-Authored-By: Claude ...` ni menciones de "Generated with Claude Code" en el mensaje. En los commits (el usuario figura como único autor).

## Estándares de código y comunicación

**Idiomas — regla estricta:**

| Qué | Idioma |
|---|---|
| Nombres de variables, funciones, clases, archivos | **Inglés** |
| Textos de UI (labels, placeholders, mensajes, toasts) | **Español** |
| Comentarios en código (solo si explican un *porqué*) | **Inglés técnico** |

Escribir comentarios solo cuando aclaren una decisión no obvia (el *porqué*), no para describir lo que el código ya dice.

## Estilos de código y linting

ESLint plano (`eslint.config.js`). Regla notable: `no-unused-vars` ignora variables que empiezan con mayúscula o guion bajo (`varsIgnorePattern: '^[A-Z_]'`). Pueden existir advertencias preexistentes (variables no usadas, deps de hooks, Fast Refresh).
