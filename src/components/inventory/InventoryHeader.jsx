import React from "react";
import ActionButton from "../common/ActionButton";
import Header from "../layout/Header";
import SearchInput from "../common/SearchInput";

export default function InventoryHeader({ onAddClick, onAddCategory, searchValue, onSearchChange, onGenerateReport }) {
  return (
    <div className="flex flex-col gap-4">
      <Header
        title="Gestión de Inventario"
        subtitle="Gestiona y organiza tus productos, categorías y unidades de medida."
      />

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Buscar producto..."
          />
        </div>

        <div className="flex flex-row gap-3 flex-wrap sm:flex-nowrap">
          <ActionButton
            label="Categorías"
            icon="pi pi-folder-plus"
            color="success"
            onClick={onAddCategory}
          />

          <ActionButton
            label="Agregar producto"
            icon="pi pi-plus"
            onClick={onAddClick}
          />

          <ActionButton
            label="Reporte de stock"
            icon="pi pi-file-excel"
            color="secondary"
            onClick={onGenerateReport}
          />
        </div>
      </div>
    </div>
  );
}