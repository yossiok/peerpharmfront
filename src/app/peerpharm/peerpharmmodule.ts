import { OrdersService } from '../services/orders.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddFormuleComponent } from './formules/add-formule/add-formule.component';
import { AddFormuleItemComponent } from './formules/add-formule-item/add-formule-item.component';
import { PeerPharmRputs } from './peerpharm.routing';
import { OrdersComponent } from './allorders/orders/orders.component';
import {OrderdetailsComponent} from './allorders/orderdetails/orderdetails.component'
import {ScheduleComponent} from './schedule/schedule.component'
import {ItemslistComponent} from './items/itemslist/itemslist.component'
import {ItemdetaisComponent} from './items/itemdetais/itemdetais.component'
import {PlateComponent} from './plate/plate.component'
import {StockComponent} from './inventory/stock/stock.component'
import {NeworderComponent} from './allorders/neworder/neworder.component'
import {ContentComponent} from './taskboard/core/content/content.component'




import {MatSelectModule} from '@angular/material/select';
import {
  MatDialogModule,
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
  MatFormFieldModule,
  MatNativeDateModule
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
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PeerPharmRputs),
    ReactiveFormsModule,
    JsonpModule, 
    HttpClientModule,
    NgbModule,
    FormsModule,
    MatDialogModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatSelectModule,
    DndModule.forRoot(),
    DatepickerModule,
    Ng2FilterPipeModule,
  ],
  declarations: [
    AddFormuleComponent,
    OrdersComponent,
    OrderdetailsComponent,
    NeworderComponent,
    AddFormuleItemComponent,
    ScheduleComponent,
    ItemslistComponent,
    ItemdetaisComponent,
    PlateComponent,
    StockComponent,
    ContentComponent,
    NavComponent,
    BoardComponent,
    TaskCardComponent,
    CreateBoardComponent,
    SubtaskComponent,
    SubTaskCardComponent,
    
  ],
  providers:[HttpClientModule, OrdersService]
})
export class PeerPharmModule {}
