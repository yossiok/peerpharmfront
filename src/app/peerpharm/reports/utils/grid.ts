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
