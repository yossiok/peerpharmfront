import { HttpClientModule, HttpClient } from "@angular/common/http";
import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JsonpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxBarcodeModule } from "ngx-barcode";
import { NgxPaginationModule } from "ngx-pagination";
import { FormuleComponent } from "./formules/formule.component";
import { AddFormuleComponent } from "./formules/add-formule/add-formule.component";
import { AddFormuleItemComponent } from "./formules/add-formule-item/add-formule-item.component";
import { FormuleFormTableComponent } from "./formules/formule-form-table/formule-form-table.component";
import { PeerPharmRputs } from "./peerpharm.routing";
import { OrdersComponent } from "./allorders/orders/orders.component";
import { AllordersComponent } from "./allorders/allorders/allorders.component";

import {
  TranslateModule,
  TranslateLoader,
  TranslateCompiler,
  TranslateParser,
  MissingTranslationHandler,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { OrderdetailsComponent } from "./allorders/orderdetails/orderdetails.component";
import { ScheduleComponent } from "./schedule/filling/schedule.component";
import { BarcodePrintComponent } from "./schedule/barcode-print/barcode-print.component";
import { ItemslistComponent } from "./items/itemslist/itemslist.component";

import { PlateComponent } from "./plate/plate.component";
import { StockComponent } from "./inventory/stock/stock.component";
import { NeworderComponent } from "./allorders/neworder/neworder.component";
import { LinesComponent } from "./production/lines/lines.component";
import { ProductionComponent } from "./production/production/production.component";
import { ProductionRequestComponent } from "./production/production-request/production-request.component";
import { ProductionOrdersComponent } from "./production/production-request/production-orders/production-orders.component";
import { ProductionScheduleComponent } from "./production/production-schedule/production-schedule.component";
import { ScheduleOrdersComponent } from "./production/production-schedule/schedule-orders/schedule-orders.component";
import { ContentComponent } from "./taskboard/core/content/content.component";
import { BatchesComponent } from "./batches/batches.component";
import { BatchesMkpComponent } from "./batches/batches-mkp/batches-mkp.component";
import { CostumersListComponent } from "./costumers/costumers-list/costumers-list.component";
import { PrintingComponent } from "./schedule/printing/printing.component";
import { MakeupComponent } from "./schedule/makeup/makeup.component";
import { CheckingformsComponent } from "./forms/checkingforms/checkingforms.component";
import { CleaningFormsComponent } from "./forms/cleaning-forms/cleaning-forms.component";
import { FirstAidComponent } from "./forms/first-aid/first-aid.component";
import { FormslistComponent } from "./forms/formslist/formslist.component";
import { FormdetailsComponent } from "./forms/formdetails/formdetails.component";
import { ItemDetailsTabComponent } from "./items/item-details-tab/item-details-tab.component";
import { OutServicesComponent } from "./out-services/out-services.component";
import { PricesComponent } from "./prices/Existing/prices.component";
import { AllPricingComponent } from "./prices/all-pricing/all-pricing.component";

import { WharehouseComponent } from "./inventory/wharehouse/wharehouse.component";
import { InventoryRequestsComponent } from "./inventory/wharehouse/inventory-requests/inventory-requests.component";
import { HistMovementsComponent } from "./inventory/wharehouse/hist-movements/hist-movements.component";
import { ItemDocumentsComponent } from "./items/item-documents/item-documents.component";
import { NotificationComponent } from "./notification/notification.component";
import { ProcurementOrderItemBalanceComponent } from "./procurement/procurementOrderItemBalance/procurementOrderItemBalance.component";
import { ProcurementOrdersComponent } from "./procurement/procumentOrders/procurementOrders.component";
import { ProcurementOrderItemComponent } from "./procurement/procumentOrderItem/procurementOrderItem.component";
import { NewProcurementComponent } from "./procurement/new-procurement/new-procurement.component";
import { FinanceReportComponent } from "./finance-reports/financereport.component";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";

import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

//import {MatSelectModule} from '@angular/material/select';

import { MatCheckboxModule } from "@angular/material/checkbox";
import { ChatComponent } from "./../shared/chat/chat.component";

/*import {
  MatDialogModule,
  MatTableModule,
  MatGridListModule,
  MatMenuModule,
  MatButtonModule,
  MatTooltipModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatTabsModule,
  MatInputModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatOptionModule,
  MatNativeDateModule,
} from '@angular/material';
*/
import { NavComponent } from "./taskboard/core/nav/nav.component";
import { BoardComponent } from "./taskboard/board/board.component";
import { TaskCardComponent } from "./taskboard/board/shared/task-card/task-card.component";
import { CreateBoardComponent } from "./taskboard/board/create-board/create-board.component";
import { SubtaskComponent } from "./taskboard/subtask/subtask.component";
import { SubTaskCardComponent } from "./taskboard/board/shared/sub-task-card/sub-task-card.component";

import { DndModule } from "ng2-dnd";
import { DatepickerModule } from "angular2-material-datepicker";
import { Ng2FilterPipeModule } from "ng2-filter-pipe";
import { AuthService } from "../services/auth.service";
import { InventoryNewRequestComponent } from "./inventory/wharehouse/inventory-requests/inventory-new-request/inventory-new-request.component";
import { SpinnerComponent } from "../shared/spinner.component";
import { HeadingsWHPipe } from "../pipes/headings-wh.pipe";
import { OrderStagePipe } from "../pipes/order-stage.pipe";
import { MatMenuModule } from "@angular/material/menu";
import { NgxPrintModule } from "ngx-print";
import { PackingComponent } from "./schedule/packing/packing.component";
import { AddFormulePhaseComponent } from "./formules/add-formule-phase/add-formule-phase.component";
import { ExpectedArrivalsComponent } from "./procurement/expected-arrivals/expected-arrivals.component";
import { MaterialArrivalComponent } from "./inventory/material-arrival/material-arrival.component";
import { MaterialArrivalTableComponent } from "./inventory/material-arrival/material-arrival-table/material-arrival-table.component";
import { MaterialScanViewComponent } from "./inventory/material-scan-view/material-scan-view.component";
import { WizardComponent } from "./production/wizard/wizard.component";
import { ScanProductComponent } from "./production/scan-product/scan-product.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { ItemreportsComponent } from "./items/itemreports/itemreports.component";
import { DateExpiredDirective } from "../directives/date-expired.directive";
import { ActiveusersComponent } from "./reports/activeusers/activeusers.component";

import { HistorylogsComponent } from "./reports/historylogs/historylogs.component";
import { AllFormulesComponent } from "./formules/all-formules/all-formules.component";
import { ItemScanViewComponent } from "./inventory/item-scan-view/item-scan-view.component";
import { AddProcurementItemDialog } from "./procurement/add-procurement-item-dialog/add-procurement-item-dialog";
import { AllocatedOrdersComponent } from "./inventory/allocated-orders/allocated-orders.component";
import { PackingListComponent } from "./qa/packing-list/packing-list.component";
import { QaPalletsComponent } from "./forms/qa-pallets/qa-pallets.component";
import { ItemdetaisComponent } from "./items/itemdetais/itemdetais.component";
import { NewFormuleComponent } from "./new-formule/new-formule.component";
import { FormuleProductionComponent } from "./production/formule-production/formule-production.component";
import { WeightProductionComponent } from "./production/weight-production/weight-production.component";
import { StoragesComponent } from "./inventory/storages/storages.component";
import { ShelfListComponent } from "./inventory/shelf-list/shelf-list.component";
import { RandomcolorModule } from "angular-randomcolor";
import { AdminpanelComponent } from "./adminpanel/adminpanel.component";
import { MaterialsComponent } from "./production/materials/materials.component";
import { NewBatchComponent } from "./batches/new-batch/new-batch.component";
import { BulksInventoryComponent } from "./batches/bulks-inventory/bulks-inventory.component";
import { ProjectsComponent } from "./schedule/projects/projects.component";
import { ReportBuilderComponent } from "./reports/report-builder/report-builder.component";
import { UserSettingsComponent } from "./user/user-settings/user-settings.component";
import { MatTabsModule } from "@angular/material/tabs";
import { AgGridModule } from "ag-grid-angular";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { CalendarComponent } from "./calendar/calendar.component";
import { FlatpickrModule } from "angularx-flatpickr";
import { ItemMovementReportsComponent } from "./reports/item-movement-reports/item-movement-reports.component";
import { UnfinishedProductsComponent } from "./reports/unfinished-products/unfinished-products.component";

import { PrintBarcodeComponent } from "./production/print-barcode/print-barcode.component";
import { NewOutServiceComponent } from "./out-services/new-out-service/new-out-service.component";
import { TicketFormComponent } from "./ticket-form/ticket-form.component";
import { EditServiceComponent } from "./out-services/edit-service/edit-out-service.component";
import { NewPricingComponent } from "./prices/new-pricing/new-pricing.component";
import { ItemIndexComponent } from "./item-index/item-index.component";
import { ItemSuppliersComponent } from "./items/item-suppliers/item-suppliers.component";
import { InvArrivalsComponent } from "./inventory/wharehouse/inv-arrivals/inv-arrivals.component";
import { InventoryReportsComponent } from "./inventory/inventory-reports/inventory-reports.component";
import { ShelfChangeComponent } from "./inventory/wharehouse/shelf-change/shelf-change.component";
import { CheckoutComponent } from "./inventory/wharehouse/checkout/checkout.component";
import { YieldDetailsComponent } from "./production/yield/yield-details/yield-details.component";
import { YieldsComponent } from "./production/yield/yields/yields.component";
import { YieldHistoryComponent } from "./production/yield/yield-history/yield-history.component";
import { BetweenWHComponent } from "./inventory/wharehouse/between-wh/between-wh.component";
import { CurrencySymbolPipe } from "../pipes/currency-symbol.pipe";
import { InventoryStickerComponent } from "./inventory/wharehouse/stickers/inventory-sticker";
import { FormulesTypesPipe } from "../pipes/formules-types.pipe";
import { WarehousesNamesPipe } from "../pipes/warehouses-names.pipe";
import { WorkPlanStatusPipe } from "../pipes/work-plan-status.pipe";
import { AllPlanningComponent } from "./production/planning/all-planning/all-planning.component";
import { AllItemsComponent } from "./production/planning/all-items/all-items.component";
import { PlanningDetailsComponent } from "./production/planning/planning-details/planning-details.component";
import { OrderItemBatchStatusPipe } from "../pipes/order-item-batch-status.pipe";
import { OrderItemBatchStatusColorPipe } from "../pipes/order-item-batch-status-color.pipe";
import { OiStatusColorPipe } from "../pipes/oi-status-color.pipe";
import { FreeBatchesComponent } from "./allorders/free-batches/free-batches.component";
import { WhareHouseUpdatesComponent } from "./inventory/wharehouse/wharehouse-updates/wharehouse-updates.component";
import { ProblematicOrderItemsComponent } from "./allorders/problematics/problematic-order-items.component";
import { ProblematicItemsComponent } from "./procurement/procumentOrders/problematic-items/problematic-items.component";
import { MatrialArrivalsCetificatesComponent } from "./inventory/material-arrival/material-arrival-certificates/material-arrival-certificates.component";
import { BulksArrivalComponent } from "./batches/bulks-inventory/bulks-arrival/bulks-arrival.component";
import { QaLogsComponent } from "./qa/qalogs/qaLogs.component";
import { BulksCheckoutComponent } from "./batches/bulks-inventory/bulks-checkout/bulks-checkout.component";
import { CustomersComponent } from "./customers/customers.component";
import { ProposalsComponent } from "./customers/proposals/proposals.component";
import { ProposalsListComponent } from "./customers/proposals-list/proposals-list.component";
import { CreamBarrelComponent } from "./inventory/creamBarrel/creamBarrel.component";
import { BulksReportComponent } from "./batches/bulks-inventory/bulks-report/bulks-report.component";

@NgModule({
  exports: [
    // MatInputModule,
    AddProcurementItemDialog,
  ],
  imports: [
    NgxBarcodeModule,
    MatAutocompleteModule,
    MatMenuModule,
    CommonModule,
    RandomcolorModule,
    RouterModule.forChild(PeerPharmRputs),
    AgGridModule.withComponents([]),
    TranslateModule.forChild({}),
    JsonpModule,
    HttpClientModule,
    MatCheckboxModule,
    NgbModule,
    NgxPaginationModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    DndModule.forRoot(),
    DatepickerModule,
    Ng2FilterPipeModule,
    NgxPrintModule,
    HttpClientModule,
    //   MatOptionModule,
  ],
  declarations: [
    CheckingformsComponent,
    AdminpanelComponent,
    AllFormulesComponent,
    ItemMovementReportsComponent,
    FormuleProductionComponent,
    FormuleComponent,
    CalendarComponent,
    AddFormuleComponent,
    MaterialsComponent,
    StoragesComponent,
    ShelfListComponent,
    OrdersComponent,
    CreamBarrelComponent,
    AllordersComponent,
    OrderdetailsComponent,
    NewFormuleComponent,
    NeworderComponent,
    NeworderComponent,
    BulksInventoryComponent,
    BatchesMkpComponent,
    LinesComponent,
    UserSettingsComponent,
    ProductionComponent,
    ProductionRequestComponent,
    ProductionScheduleComponent,
    ScheduleOrdersComponent,
    ProductionOrdersComponent,
    WeightProductionComponent,
    AddFormuleItemComponent,
    CleaningFormsComponent,
    FirstAidComponent,
    ScheduleComponent,
    BarcodePrintComponent,
    ItemslistComponent,
    QaPalletsComponent,
    PlateComponent,
    StockComponent,
    ContentComponent,
    NavComponent,
    BoardComponent,
    TaskCardComponent,
    CreateBoardComponent,
    SubtaskComponent,
    AddProcurementItemDialog,
    PackingListComponent,
    SubTaskCardComponent,
    ContentComponent,
    BoardComponent,
    TaskCardComponent,
    QaLogsComponent,
    SubTaskCardComponent,
    CreateBoardComponent,
    BatchesComponent,
    CostumersListComponent,
    PrintingComponent,
    MakeupComponent,
    FormslistComponent,
    FormdetailsComponent,
    ItemdetaisComponent,
    ItemDetailsTabComponent,
    ItemDocumentsComponent,
    NotificationComponent,
    ProcurementOrderItemBalanceComponent,
    ProcurementOrdersComponent,
    ProcurementOrderItemComponent,
    NewProcurementComponent,
    WharehouseComponent,
    HistMovementsComponent,
    ProjectsComponent,
    InventoryRequestsComponent,
    InventoryNewRequestComponent,
    MaterialArrivalComponent,
    NewBatchComponent,
    MaterialArrivalTableComponent,
    MaterialScanViewComponent,
    ItemScanViewComponent,
    ChatComponent,
    HeadingsWHPipe,
    PackingComponent,
    OrderStagePipe,
    AddFormulePhaseComponent,
    ExpectedArrivalsComponent,
    FormuleFormTableComponent,
    WizardComponent,
    ScanProductComponent,
    SuppliersComponent,
    ItemreportsComponent,
    DateExpiredDirective,
    HistorylogsComponent,
    ActiveusersComponent,
    AllocatedOrdersComponent,
    ReportBuilderComponent,
    UnfinishedProductsComponent,
    TicketFormComponent,
    PrintBarcodeComponent,
    OutServicesComponent,
    NewOutServiceComponent,
    EditServiceComponent,
    PricesComponent,
    AllPricingComponent,
    NewPricingComponent,
    ItemIndexComponent,
    ItemSuppliersComponent,
    InvArrivalsComponent,
    BetweenWHComponent,
    InventoryReportsComponent,
    ShelfChangeComponent,
    CheckoutComponent,
    YieldDetailsComponent,
    YieldsComponent,
    YieldHistoryComponent,
    CurrencySymbolPipe,
    InventoryStickerComponent,
    FormulesTypesPipe,
    WarehousesNamesPipe,
    WorkPlanStatusPipe,
    OrderItemBatchStatusPipe,
    OrderItemBatchStatusColorPipe,
    OiStatusColorPipe,
    AllPlanningComponent,
    AllItemsComponent,
    PlanningDetailsComponent,
    FinanceReportComponent,
    FreeBatchesComponent,
    WhareHouseUpdatesComponent,
    ProblematicOrderItemsComponent,
    ProblematicItemsComponent,
    MatrialArrivalsCetificatesComponent,
    BulksArrivalComponent,
    BulksCheckoutComponent,
    CustomersComponent,
    ProposalsComponent,
    ProposalsListComponent,
    BulksReportComponent,
  ],
  entryComponents: [AddProcurementItemDialog],
  providers: [
    HttpClientModule,
    WorkPlanStatusPipe,
    //MatAutocompleteModule,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PeerPharmModule {}
