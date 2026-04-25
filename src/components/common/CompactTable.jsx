import React, { useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import '../../styles/CompactTable.css'
import { Button } from 'primereact/button';

const CompactTable = React.forwardRef((props, ref) => {
  const getEmptyMessage = () => {
    if (props.loading) return <ProgressSpinner style={{ width: '30px', height: '30px' }} />;
    return props.emptyMessage || "No se encontraron resultados.";
  };

  const tableHeader = useMemo(() => {
    if (!props.globalFilterValue && !props.setGlobalFilterValue) {
      return props.header || null;
    }

    return (
      <div className="flex flex-column md:flex-row justify-content-between gap-2 w-full">
        <span className="p-input-icon-left w-full md:w-auto">
          <i className="pi pi-search" />
          <InputText
            value={props.globalFilterValue}
            onChange={(e) => props.setGlobalFilterValue(e.target.value)}
            placeholder="Buscar..."
            className="p-inputtext-sm w-full"
          />
        </span>
        {props.headerButtons && (
          <div className="flex gap-2 justify-content-end">
            {props.headerButtons}
          </div>
        )}
      </div>
    )
  }, [props.globalFilterValue, props.headerButtons]);

  const responsiveLayout = useMemo(() => ({
    breakpoint: props.breakpoint || '960px',
    layout: 'stack',
    headerColumnGroup: null,
    footerColumnGroup: null
  }), [props.breakpoint]);

  const paginatorLeft = props.onRefresh ? (
    <Button
      type="button"
      icon="pi pi-refresh"
      className="p-button-text p-button-sm"
      tooltip="Actualizar lista"
      tooltipOptions={{ position: 'top' }}
      onClick={props.onRefresh}
      disabled={props.loading}
    />
  ) : props.paginatorLeft;

  return (
    <div className={`${props.containerClassName || ''}`}
      style={{ width: `${props.widthPercentage || 100}%` }}>
      <DataTable
        ref={ref}
        value={props.value}
        loading={props.loading}
        emptyMessage={getEmptyMessage()}
        dataKey={props.dataKey || "id"}

        paginator={props.paginator !== false}
        rows={props.rows || 10}
        rowsPerPageOptions={props.rowsPerPageOptions || [10, 25, 50]}
        paginatorTemplate={props.paginatorTemplate || "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"}
        paginatorLeft={paginatorLeft}

        rowClassName={props.rowClassName}
        expandedRows={props.expandedRows}
        onRowToggle={props.onRowToggle}
        rowExpansionTemplate={props.rowExpansionTemplate}
        tableStyle={{ width: '100%', ...(props.tableStyle || {}) }}
        footerColumnGroup={props.footerColumnGroup}

        className={`compact-table ${props.className || ''}`}

        filters={props.filters}
        filterDisplay={props.filterDisplay || "menu"}
        globalFilter={props.globalFilterValue}
        globalFilterFields={props.globalFilterFields}

        selection={props.selection}
        selectionMode={props.selectionMode}
        onSelectionChange={props.onSelectionChange}
        metaKeySelection={props.metaKeySelection !== false}
        onRowSelect={props.onRowSelect}
        onRowUnselect={props.onRowUnselect}

        scrollable={props.scrollable !== false}
        scrollHeight={props.scrollHeight}
        resizableColumns={props.resizableColumns}
        columnResizeMode={props.columnResizeMode || "fit"}
        reorderableColumns={props.reorderableColumns}
        stripedRows

        size={props.size || "small"}
        showGridlines={props.showGridlines}
        responsiveLayout={props.responsiveLayout || responsiveLayout}

        header={props.header || tableHeader}
        footer={props.footer}
        stateStorage={props.stateStorage}
        stateKey={props.stateKey}
        exportFunction={props.exportFunction}
        virtualScrollerOptions={props.virtualScrollerOptions}
        paginatorRight={props.paginatorRight}

        {...props.tableProps}
      >
        {props.children}
      </DataTable>
    </div>
  );
});

export default CompactTable;