import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Personal',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '/starter',
    title: 'Starter Page',
    icon: 'mdi mdi-gauge',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'UI Components',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },

  {
    path: '',
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
        path: '/component/accordion',
        title: 'Search Order',
        icon: 'icon-magnifier',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/accordion',
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
    ]
  },
  {
    path: '',
    title: 'Task-Board',
    icon: '  fas fa-thumbtack',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/taskboard/main',
        title: 'Personal',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      }, 
      {
        path: '/peerpharm/schedule/fillschedule',
        title: 'Department',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      }
    
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
      }
    
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
        path: '/peerpharm/formule/addnewformule',
        title: 'Add formula',
        icon: ' fab fa-page4',
        class: '',
        extralink: false,
        submenu: []
      }
    ]
    },
    {
      path: '/peerpharm/costumers/costumers_list',
      title: 'Costumers',
      icon: ' fas fa-address-card',
      class: 'has-arrow',
      extralink: false,
      submenu: [
        {
          path: '/peerpharm/costumers/costumers_list',
          title: 'Costumers List',
          icon: 'fas fa-address-book',
          class: '',
          extralink: false,
          submenu: []
        }
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
        path: '/peerpharm/schedule/fillschedule',
        title: 'Item Tree',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      }
    
    ]
  },
  
  {
    path: '',
    title: 'Procurement',
    icon: ' icon-plane',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/peerpharm/schedule/fillschedule',
        title: 'Item List',
        icon: 'fas fa-list-ol',
        class: '',
        extralink: false,
        submenu: []
      },
       {
        path: '/peerpharm/schedule/fillschedule',
        title: 'Item Tree',
        icon: 'fas fa-tree',
        class: '',
        extralink: false,
        submenu: []
      }
    
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
      title: ' Inevntory',
      icon: ' fas fa-dolly',
      class: 'has-arrow',
      extralink: false,
      submenu: [
        {
          path: '/peerpharm/inventory/inventory',
          title: 'Item List',
          icon: 'fas fa-address-book',
          class: '',
          extralink: false,
          submenu: []
        },
         {
          path: '/peerpharm/inventory/wharehouse',
          title: 'Whare House',
          icon: 'fas fa-tree',
          class: '',
          extralink: false,
          submenu: []
        }
      
      ]
    },

  
    {
      path: '',
      title: 'Forms',
      icon: ' fab fa-wpforms',
      class: 'has-arrow',
      extralink: false,
      submenu: [
        {
          path: '/peerpharm/forms/forms_list',
          title: 'Item List',
          icon: 'fas fa-list-ol',
          class: '',
          extralink: false,
          submenu: []
        }
      
      ]
    },
    ,

  
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
        }
      
      ]
    },

  {
    path: '',
    title: 'Component',
    icon: 'mdi mdi-bullseye',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      {
        path: '/component/accordion',
        title: 'Accordion',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/alert',
        title: 'Alert',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/carousel',
        title: 'Carousel',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/dropdown',
        title: 'Dropdown',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/modal',
        title: 'Modal',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/pagination',
        title: 'Pagination',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/poptool',
        title: 'Popover & Tooltip',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/progressbar',
        title: 'Progressbar',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/rating',
        title: 'Ratings',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/tabs',
        title: 'Tabs',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/timepicker',
        title: 'Timepicker',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/buttons',
        title: 'Button',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/cards',
        title: 'Card',
        icon: 'mdi mdi-adjust',
        class: '',
        extralink: false,
        submenu: []
      }
    ]
  }
];
