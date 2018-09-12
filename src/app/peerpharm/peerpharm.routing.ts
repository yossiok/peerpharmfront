import { OrdersComponent } from './allorders/orders/orders.component';
import {OrderdetailsComponent} from './allorders/orderdetails/orderdetails.component'
//import { PeerPharmModule } from './peerpharmmodule';
import { Routes } from '@angular/router';
import {ScheduleComponent} from './schedule/schedule.component'
import {ItemslistComponent} from './items/itemslist/itemslist.component'
import {ItemdetaisComponent} from './items/itemdetais/itemdetais.component'
import {PlateComponent} from './plate/plate.component'
import {StockComponent} from './inventory/stock/stock.component'
import {NeworderComponent} from './allorders/neworder/neworder.component'
import {AddFormuleComponent} from './formules/add-formule/add-formule.component'
import {LinesComponent} from './production/lines/lines.component'
import {ProductionComponent} from './production/production/production.component'
import {ContentComponent} from './taskboard/core/content/content.component'
import { BatchesComponent } from './batches/batches.component';
export const PeerPharmRputs: Routes =[
  {
    path: 'allorders/orders',
    data: {
      title: 'open orders' 
    },
    component: OrdersComponent
  },
  {
    path: 'allorders/orderitems/:id',
    data: {
      title: 'order' 
    },
    component: OrderdetailsComponent
  },
  {
    path: 'allorders/neworder',
    data: {
      title: 'new order' 
    },
    component: NeworderComponent
  },
  {
    path: 'schedule/fillschedule',
    data: {
      title: 'Fill Schedule' 
    },
    component: ScheduleComponent
  },
  {
    path: 'items/itemslist',
    data: {
      title: 'Items List' 
    },
    component: ItemslistComponent
  },
  {
    path: 'items/itemDetails',
    data: {
      title: 'Item Tree' 
    },
    component: ItemdetaisComponent
  },
  {
    path: 'items/itemDetails/:itemNumber',
    data: {
      title: 'Item Tree' 
    },
    component: ItemdetaisComponent
  },
  {
    path: 'plates/plates',
    data: {
      title: 'Plates' 
    },
    component: PlateComponent
  },
  {
    path: 'inventory/inventory',
    data: {
      title: 'inventory' 
    },
    component: StockComponent
  },
  {
    path: 'taskboard/main',
    data: {
      title: 'task-board' 
    },
    component: ContentComponent
  },
  {
    path: 'formule/addnewformule',
    data: {
      title: 'task-board' 
    },
    component: AddFormuleComponent
  },
  {
    path :'production/lines',
    data :{
      title : 'Production Lines'
    },
    component:LinesComponent
  },
  {
    path :'production/productionHall',
    data :{
      title : 'Production Hall'
    },
    component:ProductionComponent
  },
  {
    path :'batches/batchesList',
    data :{
      title : 'Batches List'
    },
    component:BatchesComponent
  }
  
];

