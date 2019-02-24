import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProductionOrders } from './../../models/production-orders';

@Component({
  selector: 'app-schedule-orders',
  templateUrl: './schedule-orders.component.html',
  styleUrls: ['./schedule-orders.component.css']
})
export class ScheduleOrdersComponent implements OnInit {
  public scheduleOrdersForm: FormGroup;
  scheduleOrders: ProductionOrders[] = [];


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
