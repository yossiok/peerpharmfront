import { ColDef } from "ag-grid-community";
import * as moment from "moment";

const formatDate = (params) => {
  const field = params.colDef.field;
  return typeof params.data[field] != "undefined" && params.data[field] ? moment(params.data[field]).format("DD/MM/yyyy") : null;
}

export const getPurchaseColumns = () => {
  return [
    { field: "numberOfOrders" },
    {
      field: "orderNumber",
      headerName: "Purchase Number",
    },
    { field: "origin", headerName: "Origin" },
    {
      field: "creationDate",
      headerName: "Creation Date",
      valueGetter: (params) => formatDate(params),
    },
    {
      field: "requestedDate",
      headerName: "Requested Date",
      valueGetter: (params) => formatDate(params),
    },
    {
      field: "arrivalDate",
      headerName: "Approval Date",
      valueGetter: (params) => formatDate(params),
    },
    { field: "remarks", headerName: "Remarks" },
    { field: "status", headerName: "Status" },
    {
      field: "statusChange",
      headerName: "Status Changed At",
      valueGetter: (params) => formatDate(params),
    },
    { field: "user", headerName: "User" },
  ];
}

export const getAutoGroupColumnDef = (name: string) => {
  return {
    headerName: name,
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
    },
  };
}

export const getOrdersColumns = () => {
  return [
    { field: "numberOfOrders" },
    { field: "orderNumber" },
    {
      field: "orderDate",
      valueGetter: (params) => formatDate(params),
    },
    {
      field: "deliveryDate",
      valueGetter: (params) => formatDate(params),
    },
    { field: "orderRemarks" },
    { field: "type" },
    { field: "status" },
  ]
}


export const getCustomerSearchColumns = (): ColDef[] => {
  return [
    { field: "costumerId" },
    { field: "costumerName" },
    { field: "fax" },
    { field: "invoice" },
    { field: "delivery" },
    { field: "country" },
    { field: "pallet" },
    { field: "marks" },
    { field: "impRemark" },
    { field: "brand" },
    { field: "area" },
  ]
}

export const getItemSearchColumns = (): ColDef[] => {
  return [
    { field: "itemNumber" },
    { field: "name" },
    { field: "subName" },
    { field: "discriptionK" },
    { field: "proRemarks" },
    { field: "impRemarks" },
  ]
}

export const getOrderItemSearchColumns = (): ColDef[] => {
  return [
    {
      field: "itemNumber",
      cellStyle: {
        cursor: "pointer",
      }
    },
    { field: "discription" },
    { field: "itemRemarks" },
    { field: "batch" },
    { field: "orderId" },
    {
      field: "orderNumber",
      cellStyle: {
        cursor: "pointer",
      }
    },
  ]
}

export const getOrderSearchColumns = (): ColDef[] => {
  return [
    { field: "orderNumber" },
    { field: "costumer" },
    { field: "costumerInternalId" },
    {
      field: "orderDate",
      valueGetter: (params) => formatDate(params)
    },
    { field: "customerOrderNum" },
    { field: "deliveryDate" },
    { field: "orderRemarks" },
    { field: "status" },
    { field: "type" },
    { field: "poNumber" },
    { field: "stage" },
    { field: "salesOrder" },
  ]
}

export const getPurchaseOrderSearchColumns = (): ColDef[] => {
  return [
    { field: "orderNumber" },
    { field: "supplierNumber" },
    { field: "supplierName" },
    { field: "origin" },
    {
      field: "creationDate",
      valueGetter: (params) => formatDate(params)
    },
    {
      field: "requestedDate",
      valueGetter: (params) => formatDate(params)
    },
    {
      field: "arrivalDate",
      valueGetter: (params) => formatDate(params)
    },
    { field: "remarks" },
    { field: "status" },
    {
      field: "statusChange",
      valueGetter: (params) => formatDate(params)
    },
    { field: "user" },
  ]
}

export const getWeightProductionWizardColumns = (): ColDef[] => {
  const itemLink = (params) => {
    window.open(`#/peerpharm/items/itemDetails/${params.rowData.itemNumber}`, '_blank');
  }

  return [
    {
      field: "phaseName",
      headerName: "Phase",
      valueFormatter: (params) => params.data.phaseRowIndex > 0 ? "" : params.value,
    },
    {
      field: "itemNumber",
      headerName: "Item",
      cellRenderer: "customClick", cellRendererParams: {
        onClick: itemLink.bind(this),
        field: "itemNumber"
      }
    },
    {
      field: "itemName",
      headerName: "Raw Material Name"
    },
    {
      field: "percentage",
      headerName: "Percentage"
    },
    {
      field: "kgProd",
      headerName: "KG",
      valueFormatter: (params) => parseFloat(params.value).toFixed(2)
    },
    {
      field: "action",
      headerName: "Action",
      cellRenderer: "wizardStep"
    }
  ]
}
