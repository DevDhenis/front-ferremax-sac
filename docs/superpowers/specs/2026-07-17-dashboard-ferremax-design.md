# Diseño — Dashboard ejecutivo FERREMAX (back + front)

**Fecha:** 2026-07-17
**Estado:** aprobado para plan de implementación
**Alcance:** módulo nuevo de Dashboard. Backend Laravel (`back-ferremax-sac`) + Frontend React/shadcn (`front-ferremax-sac`). No modifica la lógica de los módulos existentes salvo un ajuste mínimo de redirect post-login.

## 1. Objetivo

Un panel ejecutivo global para staff/admin que resuma el estado del negocio (ventas, ingresos, pedidos, inventario) con KPIs, gráficos y listas, en una sola vista. Consume un único endpoint agregado y respeta la paleta "Quiet" y los CLAUDE.md de ambos repos.

## 2. Decisiones tomadas (brainstorming)

- **Contenido:** ejecutivo global (ventas + inventario + tiles de conteo).
- **Ubicación:** ruta nueva `/dashboard` + se vuelve la home post-login.
- **Backend:** un único endpoint agregado `GET /dashboard`.
- **Gráficos:** shadcn `chart` + `recharts` (coloreado con tokens de la paleta vía CSS vars).
- **Audiencia:** staff/admin (no el cliente comprador), controlado por `access:dashboard`.

## 3. Restricciones (de ambos CLAUDE.md)

- Identificadores internos en **inglés**; textos al usuario en **español**.
- Respuestas back con envoltura `{ success, message, data }`; validación con FormRequest; serialización con API Resource; eager-load para evitar N+1.
- Front: **shadcn/ui + Tailwind v4** (sin PrimeReact), tokens semánticos de la paleta Quiet (nunca colores hardcodeados), `.font-spec` para datos numéricos, iconos `lucide-react`.
- **Commits sin coautoría de IA**; **sin push**.

## 4. Backend

### 4.1 Ruta y acceso
- `GET /dashboard` dentro del grupo `middleware('jwt')`, además protegido por **`access:panel`**.
- **Importante [VERIFICADO]:** `CheckAccess` compara el slug requerido contra el **`name`** del acceso (ambos en minúsculas): `->pluck('name')->map(strtolower)->contains(strtolower($required))`. Por eso el `name` del acceso debe ser exactamente el slug del middleware. Usamos `name = 'Panel'` ↔ `access:panel` (nombre en español para el sidebar, igual patrón que "Ventas" ↔ `access:ventas`).
- Nuevo registro de acceso en `AccessSeeder` (idempotente, `updateOrInsert` por `name`):
  `['name' => 'Panel', 'path' => '/dashboard', 'icon' => 'pi pi-chart-bar']`.
- El admin lo recibe vía `AccessRoleSeeder` (`insertOrIgnore`, ya asigna "todos los accesos" al rol Administrador General).
- **Aplicación sin resetear datos** (BD local ya poblada):
  `php artisan db:seed --class=AccessSeeder --force` y `php artisan db:seed --class=AccessRoleSeeder --force`.

### 4.2 Piezas nuevas
- `app/Http/Controllers/DashboardController.php` — método `index(DashboardRequest $request)`.
- `app/Http/Requests/Dashboard/DashboardRequest.php` — valida `range` ∈ `{7d, 30d, 90d}` (default `30d`).
- `app/Http/Resources/DashboardResource.php` — arma el `data` (o construcción inline consistente con el resto del código).

### 4.3 Forma de `data`
Todo para el periodo seleccionado, con comparativa vs. el periodo inmediatamente anterior de igual longitud. "Ventas válidas" = `status != 'cancelled'`.

```
data: {
  range: "30d",
  kpis: {
    revenue:        { value, delta_pct },   // Σ total ventas válidas
    orders:         { value, delta_pct },   // conteo de ventas válidas
    avg_ticket:     { value, delta_pct },   // revenue / orders
    low_stock_count:{ value }               // productos con stock <= minimum_quantity
  },
  revenue_trend:  [ { date, total } ],       // serie diaria (área/línea)
  orders_by_status: [ { status, count } ],   // pending_shipment..cancelled
  sales_by_category:[ { category, revenue } ],
  top_products:   [ { product, quantity, revenue } ],  // top N por cantidad
  payments_by_method:[ { method, total } ],  // cash/card/transfer
  inventory_movements:[ { movement_type, count } ],    // inbound/outbound/adjustment
  low_stock:      [ { name, stock, minimum_quantity, unit } ],  // top N
  recent_sales:   [ { id, sale_date, customer, total, status } ],
  counts:         { products, employees, clients, categories }
}
```

### 4.4 Guards (obligatorios)
- `avg_ticket = orders > 0 ? revenue / orders : 0`.
- `delta_pct = prev > 0 ? (curr - prev) / prev * 100 : (curr > 0 ? 100 : 0)` (nunca dividir por cero, nunca `Infinity`/`NaN`).
- `recent_sales`: tolerar `customer` null (venta sin cliente) → mostrar "—".

### 4.5 Datos demo (nuevo — `DashboardDemoSeeder`)
Como `DatabaseSeeder`/`DemoDataSeeder` NO siembran ventas/pagos/movimientos [VERIFICADO], sin datos el panel sale en cero. Se agrega `DashboardDemoSeeder` (local, **no destructivo**, idempotente por bandera) que, usando las factories existentes (`SaleFactory`, `SalesItemFactory`, `PaymentFactory`, `InventoryManagementFactory`) y **productos/clientes/empleados ya existentes**, genera ~40–60 ventas con ítems/pagos distribuidas en los últimos ~90 días + movimientos de inventario. Campos reales: `SalesItem(price, discount, subtotal)`, `Payment(amount, method, status, payment_date)`, `Sale(sale_date, status, subtotal, tax, total)`. Se corre con `php artisan db:seed --class=DashboardDemoSeeder --force`.

### 4.6 Test de backend (nuevo)
`tests/Feature/DashboardTest.php`: (a) 200 y forma de `data` (§4.3) para usuario con `access:panel`; (b) 403 sin el acceso; (c) 401 sin token.

### 4.7 Consultas
- Agregaciones con Query Builder (`selectRaw` + `groupBy`), filtrando por `sale_date` en el rango.
- `revenue_trend`: `groupBy(date)` sobre ventas válidas.
- `orders_by_status`: `groupBy(status)`.
- `top_products` / `sales_by_category`: join `sales_items` (+ `products`, `product_categories`).
- `payments_by_method`: sobre `payments` (status confirmado) del rango.
- `inventory_movements`: `groupBy(movement_type)` sobre `inventory_managements` con `status = active` en el rango (`movement_date`).
- `low_stock`: `products` con `stock <= minimum_quantity` y `status = 'A'`.
- `recent_sales`: últimas N con eager-load de `customer.person`.
- Sin N+1; N (top/recientes/low-stock) fijo = 5–8.

## 5. Frontend

### 5.1 Ruta y home
- Añadir `<Route path="dashboard" element={<Dashboard/>}/>` en `PrivateLayout`.
- Redirect post-login (`authProvider.jsx`): si el usuario tiene un acceso con `path === '/dashboard'`, navegar ahí; si no, mantener `accesses[0].path` (fallback sin cambios).

### 5.2 Piezas nuevas
- `src/services/dashboard/index.js` → `getDashboard(http, range)` (http como primer argumento; devuelve `response.data`).
- `src/hooks/useDashboard.js` → expone `data`, `loading`, `range`, `setRange`, `refresh`.
- `src/pages/dashboard/Dashboard.jsx` → vista principal.
- `src/components/ui/chart.jsx` → wrapper shadcn de recharts (coloreado con tokens de la paleta).
- Sub-componentes en `src/components/dashboard/`: `KpiTile`, `RevenueChart`, `OrdersStatusChart`, `CategorySalesChart`, `PaymentMethodChart`, `TopProductsList`, `LowStockList`, `RecentSalesTable`, y sus skeletons.
- `src/lib/icons.jsx`: mapear `pi-chart-bar → BarChart3` para que el sidebar renderice el ícono del acceso.

### 5.3 Layout (frontend-design, paleta Quiet)
- Header con título + selector de rango (7/30/90 días).
- Fila de KPI tiles con `.font-spec` en los números y deltas en `text-success` / `text-destructive`.
- Grilla `grid-cols-12`: gráfico de ingresos (ancho), pedidos por estado (dona/barras), ventas por categoría, pagos por método.
- Paneles inferiores: top productos (lista), alertas de stock bajo, ventas recientes (tabla).
- Skeletons durante carga; responsive; solo tokens semánticos.

### 5.4 Dependencia nueva
- `recharts` (requerido por el componente `chart` de shadcn). Instalar con `pnpm add recharts`.

## 6. Fuera de alcance (NO se toca)

Lógica de catálogo, ventas, inventario, roles, carrito y auth (salvo el redirect de ~2 líneas). Sin migraciones destructivas, sin `migrate:fresh`, sin push.

## 7. Criterios de éxito

- `GET /dashboard` responde `{success,message,data}` con la forma de §4.3 y 200 para el admin; 403 sin `access:dashboard`.
- El sidebar muestra "Panel" con su ícono; el login del admin aterriza en `/dashboard`.
- La vista carga con skeletons, pinta KPIs/gráficos/listas reales, usa solo la paleta Quiet, y es responsive.
- `pnpm run build` y `pnpm run lint` pasan; la suite de tests del back sigue verde.
