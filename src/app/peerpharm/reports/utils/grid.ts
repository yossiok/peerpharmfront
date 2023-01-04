import { ColDef } from "ag-grid-community";
import * as moment from "moment";
import { RouterLinkRendererComponent } from "src/app/shared/grid/router-link-renderer/router-link-renderer.component";

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


export const getCustomerSearchColumns = ():ColDef[] => {
  return [
    { 
      field: "costumerId",
      cellRenderer: () => "Wwwww"
    },
    { field: "costumerName" },
    { field: "fax"},
    { field: "invoice"},
    { field: "delivery"},
    { field: "country"},
    { field: "pallet"},
    { field: "marks"},
    { field: "impRemark"},
    { field: "brand"},
    { field: "area"},
  ]
}

export const getItemSearchColumns = () => {
  return [
    { field: "itemNumber" },
    { field: "name" },
    { field: "subName"},
    { field: "discriptionK"},
    { field: "proRemarks"},
    { field: "impRemarks"},
  ]
}

export const getOrderItemSearchColumns = () => {
  return [
    { field: "itemNumber" },
    { field: "discription" },
    { field: "itemRemarks"},
    { field: "batch"},
    { field: "orderId"},
    { field: "orderNumber"},
  ]
}

export const getOrderSearchColumns = () => {
  return [
    { field: "orderNumber" },
    { field: "costumer" },
    { field: "costumerInternalId"},
    { field: "orderDate"},
    { field: "customerOrderNum"},
    { field: "deliveryDate"},
    { field: "orderRemarks" },
    { field: "status" },
    { field: "type"},
    { field: "poNumber"},
    { field: "stage"},
    { field: "salesOrder"},
  ]
}

export const getPurchaseOrderSearchColumns = () => {
  return [
    { field: "supplierName" },
    { field: "supplierNumber" },
    { field: "itemName"},
    { field: "itemNumber"},
    { field: "outDate"},
    { field: "validDate"},
    { field: "measurement" },
    { field: "coin" },
    { field: "color"},
    { field: "supplierPrice"},
    { field: "supplierAmount"},
    { field: "orderNumber"},
  ]
}