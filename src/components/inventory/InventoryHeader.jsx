import React from "react";
import { InputText } from "primereact/inputtext";
import ActionButton from "../common/ActionButton";
import Header from "../layout/Header";

export default function InventoryHeader({ onAddClick, onAddCategory, searchValue, onSearchChange, onGenerateReport }) {
  return (
    <div className="flex flex-column">
      <Header
        title="Gestión de Inventario"
        subtitle="Gestiona y organiza tus productos, categorías y unidades de medida."
      />

      <div className="flex flex-row gap-2 align-items-center">
        <div className="flex-1">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Buscar producto..."
              className="w-full"
            />
          </span>
        </div>

        <div className="flex flex-row gap-3 flex-nowrap">
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