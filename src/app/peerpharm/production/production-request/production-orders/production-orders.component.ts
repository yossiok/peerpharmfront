import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { OrdersService } from './../../../../services/orders.service';



@Component({
  selector: 'app-production-orders',
  templateUrl: './production-orders.component.html',
  styleUrls: ['./production-orders.component.css']
})

export class ProductionOrdersComponent implements OnInit {
  constructor(private ordersService: OrdersService) {}
  public prodOrdersForm: FormGroup;


  @Output() sumQuantityChild = new EventEmitter();

  ngOnInit() {
    this.prodOrdersForm = new FormGroup({
      orderNumber: new FormControl('', [Validators.required]),
      orderDeliveryDate: new FormControl('', [Validators.required]),
      orderQuantity: new FormControl('', [Validators.required])
    });
  }

  findOrderBynumber() {
    const orderNumber = this.prodOrdersForm.value.orderNumber;

    this.ordersService.getOrderItemsByNumber(orderNumber).subscribe(data => {
      data.map(orderItem => {
         console.log(orderItem);
        const quantityItemNumber: Number = new Number(orderItem.quantity);
         this.prodOrdersForm.controls['orderQuantity'].setValue(quantityItemNumber);
         this.sumQuantityChild.emit(quantityItemNumber);
      });
    });

    this.ordersService.getOrderByNumber(orderNumber).subscribe(data => {
      data.map(orderItem => {
        this.prodOrdersForm.controls['orderDeliveryDate'].setValue(orderItem.deliveryDate);
      });
    });


  }


}
