import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    // title: 'menu.Orders', // for translation in he.json file
    title: 'Orders',
    icon: 'fas fa-chart-line',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/allorders/orders',
        title: 'Open Orders',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/allorders/neworder',
        title: 'New Order',
        icon: 'far fa-newspaper',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/allorders//orders/allorders',
        title: 'All Orders',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      }


    ]

  },
  {
    path: '',
    title: 'Schedule',
    icon: ' far fa-calendar-alt',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/schedule/fillschedule',
        title: 'Filling',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/schedule/printschedule',
        title: 'Printing',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/schedule/makeupschedule',
        title: 'MakeUp',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/schedule/projects',
        title: 'Projects',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/schedule/barcode-print',
        title: 'Barcode Print',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },

  {
    path: '',
    title: ' Items',
    icon: ' fas fa-sitemap',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/items/itemslist',
        title: 'Item List',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/items/itemDetails',
        title: 'Item Tree',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/items/itemreports',
        title: 'Items Reports',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      },



    ]
  },
  {
    path: '',
    title: 'Formulas',
    icon: '  fab fa-hubspot',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/new-formule/new-formule',
        title: 'Add formula',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/formule/all-formules',
        title: 'All Formules',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/formules/weight-production',
        title: 'Weight Production',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },


  {
    path: '',
    title: ' Batches',
    icon: '  fas fa-vial',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/batches/batchesList',
        title: 'Batches List',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/batches/mkpBatchesList',
        title: 'MakeUp List',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/batches/newBatch',
        title: 'New Batch',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },

  {
    path: '',
    title: 'Purchase',
    icon: ' icon-plane',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/procurement/procurementOrders',
        title: 'Purchase Orders',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },


  {
    path: '',
    title: 'Plates',
    icon: ' fas fa-inbox',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/plates/plates',
        title: 'Plates List',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '',
    title: ' Inventory',
    icon: ' fas fa-dolly',
    class: 'has-arrow',
    extralink: false,
    submenu: [

      {
        path: '/peerpharm/inventory/stock',
        title: 'Index',
        icon: 'fas fa-address-book',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/inventory/shelf-list',
        title: 'Shelf List',
        icon: 'fas fa-address-book',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/inventory/wharehouse',
        title: 'Warehouse',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/inventory/inventoryRequest',
        title: 'New Request',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/inventory/materialArrival',
        title: 'Material Arrival',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      }
    ]
  },


  {
    path: '',
    title: 'QA',
    icon: ' fab fa-wpforms',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/forms/forms_list',
        title: 'Forms',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/forms/checkingforms',
        title: 'טפסי בדיקת איכות',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/forms/cleaning-forms',
        title: 'טפסי ניקיון',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/forms/first-aid',
        title: 'טופס עזרה ראשונה',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/qa/packing-list',
        title: 'Packing Lists',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/forms/qa-pallets',
        title: 'תיעוד מוצרים לפני משלוח',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },


  {
    path: '',
    title: 'Reports',
    icon: 'fab fa-gitter',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/historylogs',
        title: 'History Action Logs',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/activeusers',
        title: 'Active Users',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/item-movement-reports',
        title: 'Movements Reports',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      }

    ]
  },


  {
    path: '',
    title: 'Production',
    icon: ' fas fa-diagnoses',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/production/lines',
        title: 'Lines',
        icon: 'fas fa-i-cursor',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/production/productionHall',
        title: 'Production Hall',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/production/scanMaterial',
        title: 'Scan Barcode',
        icon: 'fas fa-i-cursor',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/production/printBarcode',
        title: 'Print Barcode',
        icon: 'fas fa-i-cursor',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/production/scanItem',
        title: 'Scan Item',
        icon: 'fas fa-i-cursor',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/production/formule-production/formule-production',
        title: 'Formule Production',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/peerpharm/production/materials',
        title: 'Ready Materials',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },

    ]
  },

  {
    path: '',
    title: ' Suppliers',
    icon: 'fas fa-address-book',
    class: 'has-arrow',
    extralink: false,
    submenu: [

      {
        path: '/peerpharm/suppliers/suppliers',
        title: 'All Suppliers',
        icon: 'fas fa-address-book',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },

  {
    path: '/peerpharm/costumers/costumers_list',
    title: 'Customers',
    icon: 'fas fa-users',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/costumers/costumers_list',
        title: 'All Customers',
        icon: 'fas fa-address-book',
        class: '',
        extralink: false,
        submenu: []
      }
    ]
  },

  {
    path: '',
    title: 'Services',
    icon: 'fas fa-vials',
    class: 'has-arrow',
    extralink: false,
    submenu:
      [
        {
          path: '/peerpharm/services/ordered',
          title: 'Ordered Services',
          icon: 'fas fa-list-ol',
          class: '',
          extralink: false,
          submenu: []
        },
        {
          path: '/peerpharm/services/new',
          title: 'Add Service',
          icon: 'fas fa-list-ol',
          class: '',
          extralink: false,
          submenu: []
        },

      ]
  },

  {
    path: '',
    title: 'Finance',
    icon: 'fas fa-dollar-sign',
    class: 'has-arrow',
    extralink: false,
    submenu:
      [
        {
          path: '/peerpharm/pricing/new',
          title: 'New Bidding',
          icon: 'fas fa-list-ol',
          class: '',
          extralink: false,
          submenu: []
        },
        {
          path: '/peerpharm/pricing/existing',
          title: 'Product Price',
          icon: 'fas fa-list-ol',
          class: '',
          extralink: false,
          submenu: []
        },
        {
          path: '/peerpharm/pricing/index',
          title: 'Bidding Index',
          icon: 'fas fa-list-ol',
          class: '',
          extralink: false,
          submenu: []
        },
      ]
  },
  {
    path: '',
    title: '',
    icon: 'fas fa-bug',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/newticket',
        title: 'Open BUG',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },

    ]
  }


];
