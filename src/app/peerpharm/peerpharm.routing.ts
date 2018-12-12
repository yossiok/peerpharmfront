import { OrdersComponent } from './allorders/orders/orders.component';
import {OrderdetailsComponent} from './allorders/orderdetails/orderdetails.component'
//import { PeerPharmModule } from './peerpharmmodule';
import { Routes } from '@angular/router';
import {ScheduleComponent} from './schedule/filling/schedule.component'
import {PrintingComponent} from './schedule/printing/printing.component'
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
import {CostumersListComponent} from './costumers/costumers-list/costumers-list.component'
import { FormslistComponent } from './forms/formslist/formslist.component';
import { FormdetailsComponent } from './forms/formdetails/formdetails.component';
import { ItemDetailsTabComponent } from './items/item-details-tab/item-details-tab.component';
import { MakeupComponent } from './schedule/makeup/makeup.component';
import {  WharehouseComponent } from './inventory/wharehouse/wharehouse.component';
import { ItemDocumentsComponent } from './items/item-documents/item-documents.component';
import { InventoryNewRequestComponent } from './inventory/inventory-new-request/inventory-new-request.component';

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
    path: 'schedule/printschedule',
    data: {
      title: 'Print Schedule' 
    },
    component: PrintingComponent
  },
  {
    path: 'schedule/makeupschedule',
    data: {
      title: 'Make Up Schedule' 
    },
    component: MakeupComponent
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
    component: ItemDetailsTabComponent
  },
  {
    path: 'items/itemDetails/:itemNumber',
    data: {
      title: 'Item Tree' 
    },
   // component: ItemdetaisComponent
    component: ItemDetailsTabComponent
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
      title: 'Inventory' 
    },
    component: StockComponent
  },
  {
    path: 'inventory/wharehouse',
    data: {
      title: 'WhareHouse' 
    },
    component: WharehouseComponent
  },
  {
    path: 'inventory/inventoryRequest',
    data: {
      title: 'Inventory Request' 
    },
    component: InventoryNewRequestComponent
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
  ,
  {
    path :'costumers/costumers_list',
    data :{
      title : 'Costumers'
    },
    component:CostumersListComponent
  }
  
  ,
  {
    path :'forms/forms_list',
    data :{
      title : 'Forms'
    },
    component:FormslistComponent
  }
  
  ,
  {
    path :'forms/formDetails/:id',
    data :{
      title : 'Forms'
    },
    component:FormdetailsComponent
  }
  
];

