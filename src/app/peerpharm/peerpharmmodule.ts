 

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBarcodeModule } from 'ngx-barcode';
import { FormuleComponent } from './formules/formule.component';
import { AddFormuleComponent } from './formules/add-formule/add-formule.component';
import { AddFormuleItemComponent } from './formules/add-formule-item/add-formule-item.component';
import { FormuleFormTableComponent } from './formules/formule-form-table/formule-form-table.component';
import { PeerPharmRputs } from './peerpharm.routing';
import { OrdersComponent } from './allorders/orders/orders.component';
import { AllordersComponent } from './allorders/allorders/allorders.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {OrderdetailsComponent} from './allorders/orderdetails/orderdetails.component'
import {MakeupdetailsComponent} from './allorders/makeupdetails/makeupdetails.component'
import {ScheduleComponent} from './schedule/filling/schedule.component';
import {BarcodePrintComponent} from './schedule/barcode-print/barcode-print.component';
import {ItemslistComponent} from './items/itemslist/itemslist.component'
import {ItemdetaisComponent} from './items/itemdetais/itemdetais.component'
import {PlateComponent} from './plate/plate.component'
import {StockComponent} from './inventory/stock/stock.component'
import {NeworderComponent} from './allorders/neworder/neworder.component'
import {LinesComponent} from './production/lines/lines.component'
import {ProductionComponent} from './production/production/production.component';
import {ProductionRequestComponent} from './production/production-request/production-request.component';
import {ProductionOrdersComponent} from './production/production-request/production-orders/production-orders.component';
import {ProductionScheduleComponent} from './production/production-schedule/production-schedule.component';
import {ScheduleOrdersComponent} from './production/production-schedule/schedule-orders/schedule-orders.component';
import {ContentComponent} from './taskboard/core/content/content.component'
import {BatchesComponent} from './batches/batches.component'
import {BatchesMkpComponent} from './batches/batches-mkp/batches-mkp.component'
import { CostumersListComponent } from './costumers/costumers-list/costumers-list.component';
import {PrintingComponent} from './schedule/printing/printing.component';
import { MakeupComponent } from './schedule/makeup/makeup.component';
import { CheckingformsComponent } from './forms/checkingforms/checkingforms.component';
import { CleaningFormsComponent } from './forms/cleaning-forms/cleaning-forms.component';
import { FirstAidComponent } from './forms/first-aid/first-aid.component';
import { FormslistComponent } from './forms/formslist/formslist.component';
import { FormdetailsComponent } from './forms/formdetails/formdetails.component';
import { ItemDetailsTabComponent } from './items/item-details-tab/item-details-tab.component';
import { WharehouseComponent } from './inventory/wharehouse/wharehouse.component';
import { InventoryRequestsComponent } from './inventory/inventory-requests/inventory-requests.component';
import { ItemDocumentsComponent } from './items/item-documents/item-documents.component';
import { NotificationComponent } from './notification/notification.component';
import { ProcurementOrderItemBalanceComponent } from './procurement/procurementOrderItemBalance/procurementOrderItemBalance.component';
import { ProcurementOrdersComponent } from './procurement/procumentOrders/procurementOrders.component';
import { ProcurementOrderItemComponent } from './procurement/procumentOrderItem/procurementOrderItem.component';
import { NewProcurementComponent } from './procurement/new-procurement/new-procurement.component';
import { NewProcurementOrderComponent } from './procurement/new-procurement-order/new-procurement-order.component';
import { MatAutocomplete, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

import {MatSelectModule} from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChatComponent } from './../shared/chat/chat.component';
import {
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
import { NavComponent } from './taskboard/core/nav/nav.component';
import { BoardComponent } from './taskboard/board/board.component';
import { TaskCardComponent } from './taskboard/board/shared/task-card/task-card.component';
import { CreateBoardComponent } from './taskboard/board/create-board/create-board.component';
import { SubtaskComponent } from './taskboard/subtask/subtask.component';
import { SubTaskCardComponent } from './taskboard/board/shared/sub-task-card/sub-task-card.component';


import { DndModule } from 'ng2-dnd';
import { DatepickerModule } from 'angular2-material-datepicker';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { AuthService } from '../services/auth.service';
import { InventoryNewRequestComponent } from './inventory/inventory-new-request/inventory-new-request.component';
import { SpinnerComponent } from '../shared/spinner.component';
import { HeadingsWHPipe } from '../pipes/headings-wh.pipe';
import { OrderStagePipe } from '../pipes/order-stage.pipe';
import {NgxPrintModule} from 'ngx-print';
import { PackingComponent } from './schedule/packing/packing.component';
import { AddFormulePhaseComponent } from './formules/add-formule-phase/add-formule-phase.component';
import { ExpectedArrivalsComponent } from './procurement/expected-arrivals/expected-arrivals.component';
import { MaterialArrivalComponent } from './inventory/material-arrival/material-arrival.component';
import { MaterialArrivalTableComponent } from './inventory/material-arrival-table/material-arrival-table.component';
import { MaterialScanViewComponent } from './inventory/material-scan-view/material-scan-view.component';
import { WizardComponent } from './production/wizard/wizard.component';
import { ScanProductComponent } from './production/scan-product/scan-product.component';
import { SuppliersComponent } from './inventory/suppliers/suppliers.component';
import { ItemreportsComponent } from './items/itemreports/itemreports.component';
import { DateExpiredDirective } from '../directives/date-expired.directive';
import { ActiveusersComponent } from './reports/activeusers/activeusers.component';
import { HistorylogsComponent } from './reports/historylogs/historylogs.component';
import { AllFormulesComponent } from './formules/all-formules/all-formules.component';
import { OrdersService } from '../services/orders.service';
import { ItemScanViewComponent } from './inventory/item-scan-view/item-scan-view.component';
import { AddProcurementItemDialog } from './procurement/add-procurement-item-dialog/add-procurement-item-dialog';
import { AllocatedOrdersComponent } from './inventory/allocated-orders/allocated-orders.component';
import { ChangeShelfComponent } from './inventory/change-shelf/change-shelf.component';
import { PackingListComponent } from './qa/packing-list/packing-list.component';
import { QaPalletsComponent } from './forms/qa-pallets/qa-pallets.component';
import { NewFormuleComponent } from './new-formule/new-formule.component';




@NgModule({
  exports: [
    MatInputModule,
    AddProcurementItemDialog,
  ],
  imports: [ 
    CommonModule,
    RouterModule.forChild(PeerPharmRputs),
    ReactiveFormsModule,
    JsonpModule,
    HttpClientModule,
    MatCheckboxModule,
    NgbModule,
    NgxBarcodeModule,
    FormsModule,
    MatDialogModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,MatAutocompleteModule,
    MatTableModule,
    MatToolbarModule,
    MatTabsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DndModule.forRoot(),
    DatepickerModule,
    Ng2FilterPipeModule ,
    NgxPrintModule,
    HttpClientModule,
    MatOptionModule,
 
  
  ],
  declarations: [
    CheckingformsComponent,
    AllFormulesComponent,
    ChangeShelfComponent,
    FormuleComponent,
    AddFormuleComponent,
    OrdersComponent,
    AllordersComponent,
    OrderdetailsComponent,
    NewFormuleComponent,
    MakeupdetailsComponent,
    NeworderComponent, 
    NeworderComponent,
    BatchesMkpComponent,
    LinesComponent,
    ProductionComponent,
    ProductionRequestComponent,
    ProductionScheduleComponent,
    ScheduleOrdersComponent,
    ProductionOrdersComponent,
    AddFormuleItemComponent,
    CleaningFormsComponent,
    FirstAidComponent,
    ScheduleComponent,
    BarcodePrintComponent,
    ItemslistComponent,
    ItemdetaisComponent,
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
    ContentComponent, BoardComponent,
    TaskCardComponent,
    SubTaskCardComponent,
    CreateBoardComponent,
    BatchesComponent,
    CostumersListComponent,
    PrintingComponent,
    MakeupComponent,
    FormslistComponent,
    FormdetailsComponent,
    ItemDetailsTabComponent,
    ItemDocumentsComponent,
    NotificationComponent,
    ProcurementOrderItemBalanceComponent,
    ProcurementOrdersComponent,
    ProcurementOrderItemComponent,
    NewProcurementComponent,
    NewProcurementOrderComponent,
    WharehouseComponent,
    InventoryRequestsComponent,
    InventoryNewRequestComponent,
    MaterialArrivalComponent,
    MaterialArrivalTableComponent,
    MaterialScanViewComponent,
    ItemScanViewComponent,
    ChatComponent ,
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


  ],
  entryComponents:[AddProcurementItemDialog],
  providers: [ OrdersService, HttpClientModule,   MatAutocompleteModule,  {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class PeerPharmModule {}
