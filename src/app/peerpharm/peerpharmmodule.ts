import { OrdersService } from './../services/orders.service';
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PeerPharmRputs),
    ReactiveFormsModule,
    JsonpModule, 
    HttpClientModule,
    NgbModule,
    FormsModule
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
    StockComponent
  ],
  providers:[HttpClientModule, OrdersService]
})
export class PeerPharmModule {}
