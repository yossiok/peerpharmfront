import { OrdersComponent } from './allorders/orders/orders.component';
import { AllordersComponent } from './allorders/allorders/allorders.component';
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
import {FormuleComponent} from './formules/formule.component'
import {LinesComponent} from './production/lines/lines.component'
import {ProductionComponent} from './production/production/production.component';
import {ProductionRequestComponent} from './production/production-request/production-request.component';
import {ProductionScheduleComponent} from './production/production-schedule/production-schedule.component';
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
import { PackingComponent } from './schedule/packing/packing.component';
import { BarcodePrintComponent } from './schedule/barcode-print/barcode-print.component';
import { NotificationComponent } from './notification/notification.component';
import { ProcurementOrderItemBalanceComponent} from './procurement/procurementOrderItemBalance/procurementOrderItemBalance.component';
import { TwoFactor } from '../guards/twofactor.guard';

import { ProcurementOrdersComponent} from './procurement/procumentOrders/procurementOrders.component';
import { ProcurementOrderItemComponent} from './procurement/procumentOrderItem/procurementOrderItem.component';
import { BatchesMkpComponent } from './batches/batches-mkp/batches-mkp.component';
import { MaterialArrivalComponent } from './inventory/material-arrival/material-arrival.component';
import { MaterialScanViewComponent } from './inventory/material-scan-view/material-scan-view.component';
import { WizardComponent } from './production/wizard/wizard.component';
import { ScanProductComponent } from './production/scan-product/scan-product.component';

export const PeerPharmRputs: Routes =[
  {
    path: 'allorders/orders',
    data: {
      title: 'Open Orders'
    },
    component: OrdersComponent
  },
  {
    path: 'allorders/orders/allorders',
    data: {
      title: 'All Orders'
    },
    component: AllordersComponent
  },
  {
    path: 'allorders/orderitems/:id',
    data: {
      title: 'Order'
    },
    component: OrderdetailsComponent
  },
  {
    path: 'allorders/neworder',
    data: {
      title: 'New Order'
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
    path: 'schedule/packingschedule',
    data: {
      title: 'Packing Schedule'
    },
    component: PackingComponent
  },
  {
    path: 'schedule/barcode-print',
    data: {
      title: 'Print Barcode'
    },
    component: BarcodePrintComponent
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
    path: 'inventory/stock',
    data: {
      title: 'Inventory'
    },
    component: StockComponent
  },
  {
    path: 'inventory/wharehouse',
    data: {
      title: 'Warehouse'
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
    path: 'inventory/materialArrival',
    data: {
      title: 'Material Arrival'
    },
    component: MaterialArrivalComponent
  },
  {
    path: 'inventory/scanMaterialView',
    data: {
      title: 'Material Scan'
    },
    component: MaterialScanViewComponent,
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
      title: 'add-formule'
    },
    component: FormuleComponent,
    canActivate:[TwoFactor]
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
    path : 'production/productionRequest',
    data : {
      title : 'Production Request'
    },
    component: ProductionRequestComponent
  },
  {
    path : 'production/productionSchedule',
    data : {
      title : 'Production Schedule'
    },
    component: ProductionScheduleComponent
  },
  {
    path : 'production/wizard',
    data : {
      title : 'Wizard'
    },
    component: WizardComponent
  },
  {
    path: 'production/scanMaterial',
    data: {
      title: 'Material Barcode'
    },
    component: ScanProductComponent,
  },
  {
    path :'batches/batchesList',
    data :{
      title : 'Batches List'
    },
    component:BatchesComponent
  },
  {
    path :'batches/mkpBatchesList',
    data :{
      title : 'Make-Up Batches List'
    },
    component:BatchesMkpComponent
  },
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
  ,
  {
    path :'notification',
    data :{
      title : 'Notification'
    },
    component: NotificationComponent
  }
  ,
  {
    path :'procurement/procurementOrderItemBalance',
    data :{
      title : 'Procurement Order Item Balance'
    },
    component: ProcurementOrderItemBalanceComponent
  },
  {
    path :'procurement/procurementOrders',
    data :{
      title : 'Procurement Orders'
    },
    component: ProcurementOrdersComponent
  },
  {
    path : 'procurement/procurementOrderItems/:orderNumber',
    data : {
      title : 'Procurement Order Items'
    },
    component: ProcurementOrderItemComponent
  },
  {
    path : 'procurement/procurementOrderItems',
    data : {
      title : 'Procurement Order Items'
    },
    component: ProcurementOrderItemComponent
  }

];

