import { RouteInfo } from "./sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    // title: 'menu.Orders', // for translation in he.json file
    title: "menu.ORDERS",
    icon: "fas fa-chart-line",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/allorders/orders",
        title: "Open Orders",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/allorders/neworder",
        title: "New Order",
        icon: "far fa-newspaper",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/allorders/orders/allorders",
        title: "All Orders",
        icon: "mdi mdi-adjust",
        class: "",
        extralink: false,
        submenu: [],
      },

      {
        path: "/peerpharm/allorders/open-orderitems",
        title: "Open OrderItems",
        icon: "mdi mdi-adjust",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: "",
    title: "menu.SCHEDULE",
    icon: " far fa-calendar-alt",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/schedule/fillschedule",
        title: "Filling",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/schedule/printschedule",
        title: "Printing",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/schedule/makeupschedule",
        title: "MakeUp",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/schedule/projects",
        title: "Projects",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/schedule/barcode-print",
        title: "Barcode Print",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "menu.PRODUCTS",
    icon: " fas fa-sitemap",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/items/itemslist",
        title: "All Products",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/items/itemDetails",
        title: "Product Tree",
        icon: "fas fa-tree",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/items/itemreports",
        title: "Product Reports",
        icon: "fas fa-tree",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/items/itemsuppliers",
        title: "Potential Suppliers",
        icon: "fas fa-tree",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: "",
    title: "menu.FORMULAS",
    icon: "  fab fa-hubspot",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/new-formule/new-formule",
        title: "Add formula",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/formule/all-formules",
        title: "All Formules",
        icon: " fab fa-page4",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/formules/weight-production",
        title: "Weight Production",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "menu.BATCHES",
    icon: "  fas fa-vial",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/batches/batchesList",
        title: "Batches List",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/batches/mkpBatchesList",
        title: "MakeUp List",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/batches/newBatch",
        title: "New Batch",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/batches/bulksInventory",
        title: "Bulks Inventory",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "menu.PURCHASE",
    icon: " icon-plane",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/procurement/procurementOrders",
        title: "Purchase Orders",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "menu.PLATES",
    icon: " fas fa-inbox",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/plates/plates",
        title: "Plates List",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
  { 
    path: "",
    title: "menu.INVENTORY",
    icon: " fas fa-dolly",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/inventory/stock",
        title: "inventory",
        icon: "fas fa-address-book",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/inventory/wharehouse",
        title: "Warehouse Actions",
        icon: "fas fa-tree",
        class: "",
        extralink: false,
        submenu: [],
      },
      // {
      //   path: "/peerpharm/inventory/inventoryRequest",
      //   title: "New Request",
      //   icon: "fas fa-tree",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
      {
        path: "/peerpharm/inventory/materialArrival",
        title: "Material Arrivals",
        icon: "fas fa-tree",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/inventory/reports",
        title: "Inventory Reports",
        icon: "fas fa-tree",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/inventory/updates",
        title: "Inventory Updates",
        icon: "fas fa-tree",
        class: "",
        extralink: false,
        submenu: [],
      },
      // {
      //   path: "/peerpharm/inventory/creamBarrels",
      //   title: "cream Barrels",
      //   icon: "fas fa-tree",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: "/peerpharm/inventory/shelf-list",
      //   title: "ספירת מלאי",
      //   icon: "fas fa-address-book",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
    ],
  },

  {
    path: "",
    title: "menu.QA",
    icon: " fab fa-wpforms",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/forms/forms_list",
        title: "Forms",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/forms/checkingforms",
        title: "טפסי בדיקת איכות",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/forms/cleaning-forms",
        title: "טפסי ניקיון",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/forms/first-aid",
        title: "טופס עזרה ראשונה",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/qa/packing-list",
        title: "Packing Lists",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/qa/qaLogs",
        title: "QA Logs",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/qa/temperaturesLogs",
        title: "Temperatures Logs",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/forms/qa-pallets",
        title: "תיעוד מוצרים לפני משלוח",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "menu.REPORTS",
    icon: "fab fa-gitter",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/historylogs",
        title: "History Action Logs",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/activeusers",
        title: "Active Users",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/item-movement-reports",
        title: "Movements Reports",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/orders-reports-grouped-by-clients",
        title: "Orders Grouped By Clients",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/purchase-orders-grouped-by-supplier",
        title: "Purchase Orders Grouped By Supplier",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "menu.PRODUCTION",
    icon: " fas fa-diagnoses",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/production/all-items",
        title: "Open Items",
        icon: "fas fa-i-cursor",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/production/planning",
        title: "Planning",
        icon: "fas fa-i-cursor",
        class: "",
        extralink: false,
        submenu: [],
      },
      // {
      //   path: "/peerpharm/production/lines",
      //   title: "Lines",
      //   icon: "fas fa-i-cursor",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
      {
        path: "/peerpharm/production/printBarcode",
        title: "Print Barcode",
        icon: "fas fa-i-cursor",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/production/yields",
        title: "Yield",
        icon: "fas fa-i-cursor",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "menu.FINANCE",
    icon: "fas fa-dollar-sign",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/pricing/new",
        title: "New Bidding",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/pricing/existing",
        title: "Product Cost",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/pricing/index",
        title: "Bidding Index",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/pricing/reports",
        title: "Financial Reports",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/pricing/billUpload",
        title: "Bill Upload",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: "",
    title: "menu.INDEX",
    icon: "fas fa-book",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/comax-items-index",
        title: "Comax Items Index",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/itemindex",
        title: "Items",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/costumers/costumers_list",
        title: "Customers-",
        icon: "fas fa-address-book",
        class: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/peerpharm/suppliers/suppliers",
        title: "Suppliers",
        icon: "fas fa-address-book",
        class: "",
        extralink: false,
        submenu: [],
      },
      // {
      //   path: "/peerpharm/itemIndexNew",
      //   title: "Item Index New",
      //   icon: "fas fa-address-book",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
    ],
  },
  {
    path: "",
    title: "menu.CUSTOMERS",
    icon: "fas fa-address-book",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/customers",
        title: "Customers",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: "",
    title: "menu.MRP-TOOLS",
    icon: "fas fa-dollar-sign",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/mrp-tools",
        title: "MRP Tools",
        icon: "mdi mdi-adjust",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },

  {
    path: "",
    title: "",
    icon: "fas fa-bug",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/peerpharm/newticket",
        title: "Open BUG",
        icon: "fas fa-list-ol",
        class: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
];
