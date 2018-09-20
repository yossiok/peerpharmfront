import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrdersService } from '../../../services/orders.service'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private ordersService: OrdersService) { }
  orders: any[];
  EditRowId: any = "";

  @ViewChild('orderRemarks') orderRemarks: ElementRef;
  //  @ViewChild('type') type:ElementRef; 
  @ViewChild('deliveryDate') deliveryDate: ElementRef;
  @ViewChild('orderDate') orderDate: ElementRef;
  @ViewChild('costumer') costumer: ElementRef;
  @ViewChild('orderNumber') orderNumber: ElementRef;
  @ViewChild('id') id: ElementRef;


  ngOnInit() {
    this.getOrders();
  }


  getOrders() {
    this.ordersService.getOrders()
      .subscribe(orders => {
        this.orders = orders.map(order => Object.assign({ isSelected: false }, order));
        //let x= this.orders.filter(x=> x.isSelected==false);
        //let yy= x.map(y=> {orderN:y.orderN});
        //debugger;
        //console.log(x);
      })
  }



  edit(id) {
    this.EditRowId = id;
  }


  saveEdit(a, orderId) {
    let itemToUpdate = {};
    if (!a) {
      itemToUpdate = {
        'orderId': this.id.nativeElement.value,
        'orderNumber': this.orderNumber.nativeElement.value,
        "orderDate": this.orderDate.nativeElement.value,
        "costumer": this.costumer.nativeElement.value,
        "deliveryDate": this.deliveryDate.nativeElement.value,
        "orderRemarks": this.orderRemarks.nativeElement.value,
      }
    }


    else itemToUpdate = { status: 'close', orderId: orderId }
    console.log(itemToUpdate);
    this.ordersService.editOrder(itemToUpdate).subscribe(res => {
      let i = this.orders.findIndex(elemnt => elemnt._id == orderId);
      itemToUpdate['status']="";
      this.orders[i] = itemToUpdate;
      this.EditRowId='';
      console.log(res)
    });

  }

  deleteOrder(order) {
    this.ordersService.deleteOrder(order).subscribe(res => {
      let i = this.orders.findIndex(elemnt => elemnt._id == order._id);
      delete this.orders[i];
    });
  }
}
