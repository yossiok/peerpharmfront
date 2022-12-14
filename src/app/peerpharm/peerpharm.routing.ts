import { OrdersComponent } from "./allorders/orders/orders.component";
import { AllordersComponent } from "./allorders/allorders/allorders.component";
import { OrderdetailsComponent } from "./allorders/orderdetails/orderdetails.component";

//import { PeerPharmModule } from './peerpharmmodule';
import { Routes } from "@angular/router";
import { ScheduleComponent } from "./schedule/filling/schedule.component";
import { PrintingComponent } from "./schedule/printing/printing.component";
import { ItemslistComponent } from "./items/itemslist/itemslist.component";
import { ItemdetaisComponent } from "./items/itemdetais/itemdetais.component";
import { PlateComponent } from "./plate/plate.component";
import { StockComponent } from "./inventory/stock/stock.component";
import { NeworderComponent } from "./allorders/neworder/neworder.component";
import { FormuleComponent } from "./formules/formule.component";
import { LinesComponent } from "./production/lines/lines.component";
import { ProductionComponent } from "./production/production/production.component";
import { ProductionRequestComponent } from "./production/production-request/production-request.component";
import { ProductionScheduleComponent } from "./production/production-schedule/production-schedule.component";
import { ContentComponent } from "./taskboard/core/content/content.component";
import { BatchesComponent } from "./batches/batches.component";
import { CostumersListComponent } from "./costumers/costumers-list/costumers-list.component";
import { FormslistComponent } from "./forms/formslist/formslist.component";
import { CheckingformsComponent } from "./forms/checkingforms/checkingforms.component";
import { FormdetailsComponent } from "./forms/formdetails/formdetails.component";
import { ItemDetailsTabComponent } from "./items/item-details-tab/item-details-tab.component";
import { MakeupComponent } from "./schedule/makeup/makeup.component";
import { WharehouseComponent } from "./inventory/wharehouse/wharehouse.component";
import { ItemDocumentsComponent } from "./items/item-documents/item-documents.component";
import { InventoryNewRequestComponent } from "./inventory/wharehouse/inventory-requests/inventory-new-request/inventory-new-request.component";
import { PackingComponent } from "./schedule/packing/packing.component";
import { BarcodePrintComponent } from "./schedule/barcode-print/barcode-print.component";
import { NotificationComponent } from "./notification/notification.component";
import { ProcurementOrderItemBalanceComponent } from "./procurement/procurementOrderItemBalance/procurementOrderItemBalance.component";
import { TwoFactor } from "../guards/twofactor.guard";

import { ProcurementOrdersComponent } from "./procurement/procumentOrders/procurementOrders.component";
import { ProcurementOrderItemComponent } from "./procurement/procumentOrderItem/procurementOrderItem.component";
import { BatchesMkpComponent } from "./batches/batches-mkp/batches-mkp.component";
import { MaterialArrivalComponent } from "./inventory/material-arrival/material-arrival.component";
import { MaterialScanViewComponent } from "./inventory/material-scan-view/material-scan-view.component";
import { WizardComponent } from "./production/wizard/wizard.component";
import { ScanProductComponent } from "./production/scan-product/scan-product.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { ItemreportsComponent } from "./items/itemreports/itemreports.component";
import { NewProcurementComponent } from "./procurement/new-procurement/new-procurement.component";
import { HistorylogsComponent } from "./reports/historylogs/historylogs.component";
import { AllFormulesComponent } from "./formules/all-formules/all-formules.component";
import { ItemScanViewComponent } from "./inventory/item-scan-view/item-scan-view.component";
import { AllocatedOrdersComponent } from "./inventory/allocated-orders/allocated-orders.component";
import { CleaningFormsComponent } from "./forms/cleaning-forms/cleaning-forms.component";
import { FirstAidComponent } from "./forms/first-aid/first-aid.component";
import { PackingListComponent } from "./qa/packing-list/packing-list.component";
import { QaPalletsComponent } from "./forms/qa-pallets/qa-pallets.component";
import { NewFormuleComponent } from "./new-formule/new-formule.component";
import { FormuleProductionComponent } from "./production/formule-production/formule-production.component";
import { WeightProductionComponent } from "./production/weight-production/weight-production.component";
import { StoragesComponent } from "./inventory/storages/storages.component";
import { ShelfListComponent } from "./inventory/shelf-list/shelf-list.component";
import { AdminpanelComponent } from "./adminpanel/adminpanel.component";
import { ScreenGuard } from "../guards/screen.guard";
import { MaterialsComponent } from "./production/materials/materials.component";
import { NewBatchComponent } from "./batches/new-batch/new-batch.component";
import { BulksInventoryComponent } from "./batches/bulks-inventory/bulks-inventory.component";
import { ProjectsComponent } from "./schedule/projects/projects.component";
import { ActiveusersComponent } from "./reports/activeusers/activeusers.component";
import { UnfinishedProductsComponent } from "./reports/unfinished-products/unfinished-products.component";
import { ReportBuilderComponent } from "./reports/report-builder/report-builder.component";
import { UserSettingsComponent } from "./user/user-settings/user-settings.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ItemMovementReportsComponent } from "./reports/item-movement-reports/item-movement-reports.component";
import { PrintBarcodeComponent } from "./production/print-barcode/print-barcode.component";
import { OutServicesComponent } from "./out-services/out-services.component";
import { NewOutServiceComponent } from "./out-services/new-out-service/new-out-service.component";
import { TicketFormComponent } from "./ticket-form/ticket-form.component";
import { PricesComponent } from "./prices/Existing/prices.component";
import { NewPricingComponent } from "./prices/new-pricing/new-pricing.component";
import { AllPricingComponent } from "./prices/all-pricing/all-pricing.component";
import { ItemIndexComponent } from "./item-index/item-index.component";
import { ItemSuppliersComponent } from "./items/item-suppliers/item-suppliers.component";
import { InvArrivalsComponent } from "./inventory/wharehouse/inv-arrivals/inv-arrivals.component";
import { InventoryReportsComponent } from "./inventory/inventory-reports/inventory-reports.component";
import { YieldsComponent } from "./production/yield/yields/yields.component";
import { YieldHistoryComponent } from "./production/yield/yield-history/yield-history.component";
import { AllPlanningComponent } from "./production/planning/all-planning/all-planning.component";
import { AllItemsComponent } from "./production/planning/all-items/all-items.component";
import { FinanceReportComponent } from "./finance-reports/financereport.component";
import { WhareHouseUpdatesComponent } from "./inventory/wharehouse/wharehouse-updates/wharehouse-updates.component";
import { TwoFactorSms } from "../guards/twofactorsms.guard";
import { QaLogsComponent } from "./qa/qalogs/qaLogs.component";

import { CustomersComponent } from "./customers/customers.component";
import { ProposalsComponent } from "./customers/proposals/proposals.component";
import { CreamBarrelComponent } from "./inventory/creamBarrel/creamBarrel.component";
import { OpenOrderitemsComponent } from "./allorders/open-orderitems/open-orderitems.component";
import { TemperaturesLogsComponent } from "./qa/temperaturesLogs/temperaturesLogs.component";
import { BillUploadComponent } from "./prices/billUpload/billUpload.component";
import { MkupFormComponent } from "./forms/mkupForm/mkupForm.component";
import { SearchComponent } from "./search/search.component";
import { OrdersSimulatorComponent } from "./mrp-tools/orders-simulator.component";
import { ComaxItemsIndexComponent } from "./comax-items-index/comax-items-index.component";
import { OrdersReportGroupedByClientsComponent } from "./reports/orders-report-grouped-by-clients/orders-report-grouped-by-clients.component";
import { PurchaseOrdersGroupedBySupplierComponent } from "./reports/purchase-orders-grouped-by-supplier/purchase-orders-grouped-by-supplier.component";
// import { ItemIndexNewComponent } from "./item-index-new/item-index-new.component";

export const PeerPharmRputs: Routes = [
  {
    path: "user/user-settings",
    data: {
      title: "User Settings",
    },
    component: UserSettingsComponent,
  },
  {
    path: "calendar/calendar",
    data: {
      title: "Calendar",
    },
    component: CalendarComponent,
  },

  {
    path: "allorders/orders",
    canActivate: [ScreenGuard],
    data: {
      title: "Open Orders",
    },
    component: OrdersComponent,
  },
  {
    path: "allorders/orders/allorders",
    canActivate: [ScreenGuard],
    data: {
      title: "All Orders",
    },
    component: AllordersComponent,
  },

  {
    path: "allorders/open-orderitems",
    canActivate: [ScreenGuard],
    data: {
      title: "Open OrderItems",
    },
    component: OpenOrderitemsComponent,
  },
  {
    path: "allorders/orderitems/:id",
    canActivate: [ScreenGuard],
    data: {
      title: "Order Items",
    },
    component: OrderdetailsComponent,
  },

  {
    path: "allorders/neworder",
    canActivate: [ScreenGuard],
    data: {
      title: "New Order",
    },
    component: NeworderComponent,
  },
  {
    path: "schedule/fillschedule",
    canActivate: [ScreenGuard],
    data: {
      title: "Filling Schedule",
    },
    component: ScheduleComponent,
  },
  {
    path: "schedule/projects",
    // canActivate:[ScreenGuard],
    data: {
      title: "Projects",
    },
    component: ProjectsComponent,
  },
  {
    path: "schedule/printschedule",
    canActivate: [ScreenGuard],
    data: {
      title: "Print Schedule",
    },
    component: PrintingComponent,
  },
  {
    path: "schedule/makeupschedule",
    canActivate: [ScreenGuard],
    data: {
      title: "Make Up Schedule",
    },
    component: MakeupComponent,
  },
  {
    path: "schedule/packingschedule",
    canActivate: [ScreenGuard],
    data: {
      title: "Packing Schedule",
    },
    component: PackingComponent,
  },
  {
    path: "schedule/barcode-print",
    canActivate: [ScreenGuard],
    data: {
      title: "Print Barcode",
    },
    component: BarcodePrintComponent,
  },

  {
    path: "items/itemslist",
    canActivate: [ScreenGuard],
    data: {
      title: "Products List",
    },
    component: ItemslistComponent,
  },
  {
    path: "items/itemDetails",
    canActivate: [ScreenGuard],
    data: {
      title: "Item Tree",
    },
    component: ItemDetailsTabComponent,
  },
  {
    path: "items/itemreports",
    canActivate: [ScreenGuard],
    data: {
      title: "Item Reports",
    },
    component: ItemreportsComponent,
  },
  {
    path: "items/itemsuppliers",
    canActivate: [ScreenGuard],
    data: {
      title: "Potential Suppliers",
    },
    component: ItemSuppliersComponent,
  },
  {
    path: "items/itemDetails/:itemNumber",
    canActivate: [ScreenGuard],
    data: {
      title: "Item Tree",
    },
    // component: ItemdetaisComponent
    component: ItemDetailsTabComponent,
  },
  {
    path: "plates/plates",
    canActivate: [ScreenGuard],
    data: {
      title: "Plates",
    },
    component: PlateComponent,
  },
  {
    path: "search",
    canActivate: [ScreenGuard],
    data: {
      title: "Search",
    },
    component: SearchComponent,
  },
  {
    path: "inventory/stock",
    canActivate: [ScreenGuard],
    data: {
      title: "Inventory",
    },
    component: StockComponent,
  },
  {
    path: "inventory/wharehouse",
    canActivate: [ScreenGuard],
    data: {
      title: "Warehouse",
    },
    component: WharehouseComponent,
  },
  {
    path: "inventory/inventoryRequest",
    canActivate: [ScreenGuard],
    data: {
      title: "Inventory Request",
    },
    component: InventoryNewRequestComponent,
  },
  {
    path: "inventory/materialArrival",
    canActivate: [ScreenGuard],
    data: {
      title: "Material Arrival",
    },
    component: MaterialArrivalComponent,
  },
  {
    path: "inventory/arrivals",
    canActivate: [ScreenGuard],
    data: {
      title: "Component Arrivals",
    },
    component: InvArrivalsComponent,
  },
  {
    path: "inventory/reports",
    canActivate: [ScreenGuard],
    data: {
      title: "Inventory Reports",
    },
    component: InventoryReportsComponent,
  },
  {
    path: "inventory/updates",
    canActivate: [ScreenGuard],
    data: {
      title: "updates",
    },
    component: WhareHouseUpdatesComponent,
  },
  {
    path: "inventory/storages",
    canActivate: [ScreenGuard],
    data: {
      title: "Storages",
    },
    component: StoragesComponent,
  },
  // {
  //   path: "inventory/shelf-list",
  //   canActivate: [ScreenGuard],
  //   data: {
  //     title: "Shelf List",
  //   },
  //   component: ShelfListComponent,
  // },
  // {
  //   path: "inventory/creamBarrels",
  //   canActivate: [ScreenGuard],
  //   data: {
  //     title: "cream Barrels",
  //   },
  //   component: CreamBarrelComponent,
  // },
  {
    path: "suppliers/suppliers",
    canActivate: [ScreenGuard],
    data: {
      title: "Suppliers",
    },
    component: SuppliersComponent,
  },

  {
    path: "inventory/scanMaterialView",
    canActivate: [ScreenGuard],
    data: {
      title: "Material Scan",
    },
    component: MaterialScanViewComponent,
  },
  {
    path: "inventory/allocatedOrders",
    canActivate: [ScreenGuard],
    data: {
      title: "Allocated Orders",
    },
    component: AllocatedOrdersComponent,
  },
  // {
  //   path: "inventory/stock/:itemNumber",
  //   canActivate: [ScreenGuard],
  //   data: {
  //     title: "Inventory",
  //   },
  //   component: StockComponent,
  // },
  {
    path: "taskboard/main",
    data: {
      title: "task-board",
    },
    component: ContentComponent,
  },
  {
    path: "new-formule/new-formule",
    canActivate: [ScreenGuard],
    data: {
      title: "add-formule",
    },
    component: NewFormuleComponent,
    // canActivate:[TwoFactor]
  },
  // {
  //   path: 'formule/addnewformule/:id',
  //   data: {
  //     title: 'edit-formule'
  //   },
  //   component: FormuleComponent,
  // },
  {
    path: "formule/all-formules",
    data: {
      title: "Formule Table",
    },
    component: AllFormulesComponent,
    canActivate: [TwoFactorSms],
  },
  {
    path: "production/all-items",
    canActivate: [ScreenGuard],
    data: {
      title: "Open Items",
    },
    component: AllItemsComponent,
  },
  {
    path: "production/planning",
    canActivate: [ScreenGuard],
    data: {
      title: "Planning",
    },
    component: AllPlanningComponent,
  },
  // {
  //   path: "production/lines",
  //   canActivate: [ScreenGuard],
  //   data: {
  //     title: "Production Lines",
  //   },
  //   component: LinesComponent,
  // },
  {
    path: "production/productionHall",
    canActivate: [ScreenGuard],
    data: {
      title: "Production Hall",
    },
    component: ProductionComponent,
  },
  {
    path: "production/productionRequest",
    canActivate: [ScreenGuard],
    data: {
      title: "Production Request",
    },
    component: ProductionRequestComponent,
  },
  {
    path: "production/productionSchedule",
    canActivate: [ScreenGuard],
    data: {
      title: "Production Schedule",
    },
    component: ProductionScheduleComponent,
  },
  {
    path: "production/wizard",
    canActivate: [ScreenGuard],
    data: {
      title: "Wizard",
    },
    component: WizardComponent,
  },
  {
    path: "production/formule-production/formule-production",
    canActivate: [ScreenGuard],
    data: {
      title: "Formule Production",
    },
    component: FormuleProductionComponent,
  },
  {
    path: "formules/weight-production",
    data: {
      title: "Weight Production",
    },
    component: WeightProductionComponent,
    canActivate: [TwoFactor],
  },
  {
    path: "production/scanMaterial",
    canActivate: [ScreenGuard],
    data: {
      title: "Material Barcode",
    },
    component: ScanProductComponent,
  },
  {
    path: "production/scanItem",
    canActivate: [ScreenGuard],
    data: {
      title: "Item Barcode",
    },
    component: ItemScanViewComponent,
  },
  {
    path: "production/printBarcode",
    canActivate: [ScreenGuard],
    data: {
      title: "Print Barcode",
    },
    component: PrintBarcodeComponent,
  },
  {
    path: "production/materials",
    canActivate: [ScreenGuard],
    data: {
      title: "Ready Materials",
    },
    component: MaterialsComponent,
  },
  {
    path: "production/yields",
    canActivate: [ScreenGuard],
    data: {
      title: "Yields",
    },
    component: YieldsComponent,
  },
  {
    path: "production/yieldHistory",
    canActivate: [ScreenGuard],
    data: {
      title: "Yield History",
    },
    component: YieldHistoryComponent,
  },
  {
    path: "batches/batchesList",
    canActivate: [ScreenGuard],
    data: {
      title: "Batches List",
    },
    component: BatchesComponent,
  },
  {
    path: "batches/mkpBatchesList",
    canActivate: [ScreenGuard],
    data: {
      title: "Make-Up Batches List",
    },
    component: BatchesMkpComponent,
  },

  {
    path: "batches/newBatch",
    canActivate: [ScreenGuard],
    data: {
      title: "New Batch",
    },
    component: NewBatchComponent,
  },
  {
    path: "batches/bulksInventory",
    canActivate: [ScreenGuard],
    data: {
      title: "Bulks Inventory",
    },
    component: BulksInventoryComponent,
  },
  {
    path: "costumers/costumers_list",
    canActivate: [ScreenGuard],
    data: {
      title: "All Costumers",
    },
    component: CostumersListComponent,
  },

  {
    path: "forms/forms_list",
    canActivate: [ScreenGuard],
    data: {
      title: "Forms",
    },
    component: FormslistComponent,
  },

  {
    path: "forms/formDetails/:id/:id2",
    canActivate: [ScreenGuard],
    data: {
      title: "Forms",
    },
    component: FormdetailsComponent,
  },
  {
    path: "forms/mkupForm/:id",
    canActivate: [ScreenGuard],
    data: {
      title: "MakeUp Form",
    },
    component: MkupFormComponent,
  },
  {
    path: "forms/checkingforms",
    canActivate: [ScreenGuard],
    data: {
      title: "Check Forms",
    },
    component: CheckingformsComponent,
  },
  {
    path: "forms/cleaning-forms",
    canActivate: [ScreenGuard],
    data: {
      title: "Cleaning Forms",
    },
    component: CleaningFormsComponent,
  },
  {
    path: "qa/packing-list",
    canActivate: [ScreenGuard],
    data: {
      title: "Packing Lists",
    },
    component: PackingListComponent,
  },
  {
    path: "qa/qaLogs",
    canActivate: [ScreenGuard],
    data: {
      title: "QA Logs",
    },
    component: QaLogsComponent,
  },
  {
    path: "qa/temperaturesLogs",
    canActivate: [ScreenGuard],
    data: {
      title: "Temperatures Logs",
    },
    component: TemperaturesLogsComponent,
  },
  {
    path: "forms/first-aid",
    canActivate: [ScreenGuard],
    data: {
      title: "First Aid",
    },
    component: FirstAidComponent,
  },
  {
    path: "forms/qa-pallets",
    canActivate: [ScreenGuard],
    data: {
      title: "QA Pallets",
    },
    component: QaPalletsComponent,
  },
  {
    path: "notification",
    canActivate: [ScreenGuard],
    data: {
      title: "Notification",
    },
    component: NotificationComponent,
  },

  {
    path: "activeusers",
    canActivate: [ScreenGuard],
    data: {
      title: "Active Users",
    },
    component: ActiveusersComponent,
  },
  {
    path: "unfinishedproducts",
    canActivate: [],
    data: {
      title: "Unfinished Products",
    },
    component: UnfinishedProductsComponent,
  },
  {
    path: "newticket",
    canActivate: [],
    data: {
      title: "Open Ticket",
    },
    component: TicketFormComponent,
  },

  {
    path: "builder",
    canActivate: [ScreenGuard],
    data: {
      title: "Report Builder",
    },
    component: ReportBuilderComponent,
  },

  {
    path: "historylogs",
    canActivate: [ScreenGuard],
    data: {
      title: "History Logs",
    },
    component: HistorylogsComponent,
  },
  {
    path: "item-movement-reports",
    canActivate: [ScreenGuard],
    data: {
      title: "Movements Reports",
    },
    component: ItemMovementReportsComponent,
  },

  {
    path: "procurement/procurementOrderItemBalance",
    canActivate: [ScreenGuard],
    data: {
      title: "Procurement Order Item Balance",
    },
    component: ProcurementOrderItemBalanceComponent,
  },
  {
    path: "procurement/procurementOrders",
    canActivate: [ScreenGuard],
    data: {
      title: "Purchase Orders",
    },
    component: ProcurementOrdersComponent,
  },
  {
    path: "procurement/procurementOrderItems/:orderNumber",
    canActivate: [ScreenGuard],
    data: {
      title: "Procurement Order Items",
    },
    component: ProcurementOrderItemComponent,
  },
  {
    path: "procurement/procurementOrderItems",
    canActivate: [ScreenGuard],
    data: {
      title: "Procurement Order Items",
    },
    component: ProcurementOrderItemComponent,
  },
  {
    path: "procurement/newProcurement",
    canActivate: [ScreenGuard],
    data: {
      title: "New Procurement",
    },
    component: NewProcurementComponent,
  },
  {
    path: "admin",
    canActivate: [ScreenGuard],
    data: {
      title: "Admin panel",
    },
    component: AdminpanelComponent,
  },

  {
    path: "services/ordered",
    canActivate: [ScreenGuard],
    data: {
      title: "services",
    },
    component: OutServicesComponent,
  },
  {
    path: "services/new",
    canActivate: [ScreenGuard],
    data: {
      title: "Add Service",
    },
    component: NewOutServiceComponent,
  },
  {
    path: "pricing/new",
    canActivate: [ScreenGuard],
    data: {
      title: "New Bidding",
    },
    component: NewPricingComponent,
  },
  {
    path: "pricing/existing",
    canActivate: [ScreenGuard],
    data: {
      title: "Product Pricing",
    },
    component: PricesComponent,
  },
  {
    path: "pricing/index",
    canActivate: [ScreenGuard],
    data: {
      title: "Bidding Index",
    },
    component: AllPricingComponent,
  },
  {
    path: "pricing/billUpload",
    canActivate: [ScreenGuard],
    data: {
      title: "Bill Upload",
    },
    component: BillUploadComponent,
  },
  {
    path: "itemindex",
    canActivate: [ScreenGuard],
    data: {
      title: "Item Index",
    },
    component: ItemIndexComponent,
  },
  // {
  //   path: "itemIndexNew",
  //   canActivate: [ScreenGuard],
  //   data: {
  //     title: "Item Index New",
  //   },
  //   component: ItemIndexNewComponent,
  // },
  {
    path: "pricing/reports",
    canActivate: [ScreenGuard],
    data: {
      title: "Financial Reports",
    },
    component: FinanceReportComponent,
  },
  {
    path: "customers",
    canActivate: [ScreenGuard],
    data: {
      title: "Customers",
    },
    component: CustomersComponent,
  },
  {
    path: "customers/proposals",
    canActivate: [ScreenGuard],
    data: {
      title: "Proposals",
    },
    component: ProposalsComponent,
  },
  {
    path: "mrp-tools",
    canActivate: [ScreenGuard],
    data: {
      title: "MRP Tools",
    },
    component: OrdersSimulatorComponent,
  },
  {
    path: "comax-items-index",
    canActivate: [ScreenGuard],
    data: {
      title: "Comax Items Index",
    },
    component: ComaxItemsIndexComponent,
  },
  {
    path: "orders-reports-grouped-by-clients",
    canActivate: [ScreenGuard],
    data: {
      title: "Orders Grouped By Clients",
    },
    component: OrdersReportGroupedByClientsComponent,
  },
  {
    path: "purchase-orders-grouped-by-supplier",
    canActivate: [ScreenGuard],
    data: {
      title: "Purchase Orders Grouped By Supplier",
    },
    component: PurchaseOrdersGroupedBySupplierComponent,
  },
];
