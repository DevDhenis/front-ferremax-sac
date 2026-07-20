import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import ActionButton from "@/components/common/ActionButton";
import { useDashboard } from "@/hooks/useDashboard";
import RangeSelector from "@/components/dashboard/RangeSelector";
import RevenueRibbon from "@/components/dashboard/RevenueRibbon";
import Panel from "@/components/dashboard/Panel";
import CategorySalesChart from "@/components/dashboard/CategorySalesChart";
import OrdersStatusChart from "@/components/dashboard/OrdersStatusChart";
import TopProductsList from "@/components/dashboard/TopProductsList";
import InventoryMovementsChart from "@/components/dashboard/InventoryMovementsChart";
import PaymentsPanel from "@/components/dashboard/PaymentsPanel";
import RecentSalesTable from "@/components/dashboard/RecentSalesTable";
import LowStockList from "@/components/dashboard/LowStockList";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function Dashboard() {
  const { data, loading, range, setRange, refresh } = useDashboard();

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Header
          title="Panel"
          subtitle="Resumen ejecutivo de ventas, pedidos e inventario"
        />
        <div className="flex items-center gap-3 self-end sm:self-center">
          <RangeSelector value={range} onChange={setRange} disabled={loading} />
          <ActionButton
            icon="pi pi-refresh"
            color="primary"
            tooltip="Actualizar panel"
            onClick={refresh}
            loading={loading}
          />
        </div>
      </div>

      {loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-5">
          <RevenueRibbon kpis={data.kpis} trend={data.revenue_trend} />

          <div className="grid grid-cols-12 gap-5">
            <Panel
              eyebrow="Ingresos"
              title="Ventas por categoría"
              className="col-span-12 lg:col-span-7"
            >
              <CategorySalesChart data={data.sales_by_category} />
            </Panel>

            <Panel
              eyebrow="Pedidos"
              title="Distribución por estado"
              className="col-span-12 lg:col-span-5"
            >
              <OrdersStatusChart data={data.orders_by_status} />
            </Panel>

            <Panel
              eyebrow="Ranking"
              title="Top productos"
              className="col-span-12 lg:col-span-4"
            >
              <TopProductsList data={data.top_products} />
            </Panel>

            <Panel
              eyebrow="Almacén"
              title="Movimientos de inventario"
              className="col-span-12 lg:col-span-4"
            >
              <InventoryMovementsChart data={data.inventory_movements} />
            </Panel>

            <Panel
              eyebrow="Cobros"
              title="Estado de pagos"
              className="col-span-12 lg:col-span-4"
            >
              <PaymentsPanel data={data.payments_by_status} />
            </Panel>

            <Panel
              eyebrow="Actividad"
              title="Ventas recientes"
              className="col-span-12 lg:col-span-8"
            >
              <RecentSalesTable data={data.recent_sales} />
            </Panel>

            <Panel
              eyebrow="Alertas"
              title="Stock bajo"
              className="col-span-12 lg:col-span-4"
            >
              <LowStockList data={data.low_stock} />
            </Panel>
          </div>
        </div>
      )}
    </Container>
  );
}
