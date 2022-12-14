import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProductionOrders } from './../../models/production-orders';

@Component({
  selector: 'app-schedule-orders',
  templateUrl: './schedule-orders.component.html',
  styleUrls: ['./schedule-orders.component.scss']
})
export class ScheduleOrdersComponent implements OnInit {
  public scheduleOrdersForm: FormGroup;
  // scheduleOrders: ProductionOrders[] = [{
  //   orderNumber : 2,
  //   orderDeliveryDate: '01-01-19',
  //   orderQuantity: 3,
  //   producedQuantity: 2,
  //   produceStatus: 'finish'
  // }]; // No use


  // @Input() scheduleOrders: ProductionOrders[];
  @Output()allOrders = new EventEmitter();

  ngOnInit() {
    this.scheduleOrdersForm = new FormGroup({
      producedQuantity: new FormControl('', [Validators.required]),
      produceStatus: new FormControl('', [Validators.required])
    });
    // this.allOrders.emit(this.scheduleOrders);
  }

  onSubmit() {
    console.log(this.scheduleOrdersForm.value);
  }
}
