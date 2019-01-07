import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { OrdersService } from './../../../services/orders.service';
import { ProductionService } from './../../../services/production.service';

@Component({
  selector: 'app-production-request',
  templateUrl: './production-request.component.html',
  styleUrls: ['./production-request.component.css']
})
export class ProductionRequestComponent implements OnInit {
  constructor(
    private ordersService: OrdersService,
    private productionService: ProductionService
  ) {}
  public requestForm: FormGroup;
  orderchecked = false;
  orderItemDes = null;
  orderItemQuantity = null;

  ngOnInit() {
    this.requestForm = new FormGroup({
      prodRequestNumber: new FormControl('', [Validators.required]),
      itemNumber: new FormControl('', [Validators.required]),
      itemTotalQuantity: new FormControl('', [Validators.required]),
      orderNumber: new FormControl('', [Validators.required]),
      orderDes: new FormControl(this.orderItemDes, [Validators.required]),
      orderQuantity: new FormControl(this.orderItemQuantity, [Validators.required]),
      makatNumber: new FormControl('', [Validators.required]),
      itemBarkod: new FormControl('', [Validators.required])
    });
  }

  findOrderBynumber() {
    const orderNumber = this.requestForm.value.orderNumber;
    console.log(orderNumber);
    this.ordersService.getOrderItemsByNumber(orderNumber).subscribe(data => {
      data.map(orderItem => {
        console.log(orderItem);
        console.log(orderItem.discription);
        console.log(orderItem.quantity);

        this.orderItemDes = orderItem.discription;
        this.orderItemQuantity = orderItem.quantity;
      });
    });
  }

  onSubmit(): void {
    console.log(this.requestForm.value);
    debugger;
    this.productionService
      .addProductionSchedule(this.requestForm.value)
      .subscribe(data => console.log('added ' + data));
  }
}
