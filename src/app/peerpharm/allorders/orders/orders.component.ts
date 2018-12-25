import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrdersService } from '../../../services/orders.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private ordersService: OrdersService, private router: Router) { }
  orders: any[];
  ordersCopy: any[];
  EditRowId: any = "";
  today:any;



  //private orderSrc = new BehaviorSubject<Array<string>>(["3","4","5"]);
  //private orderSrc = new BehaviorSubject<string>("");

  @ViewChild('orderRemarks') orderRemarks: ElementRef;
  @ViewChild('orderType') orderType:ElementRef; 
  @ViewChild('deliveryDate') deliveryDate: ElementRef;
  @ViewChild('orderDate') orderDate: ElementRef;
  @ViewChild('costumer') costumer: ElementRef;
  @ViewChild('orderNumber') orderNumber: ElementRef;
  @ViewChild('id') id: ElementRef;


  ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format("DD/MM/YYYY");
    // var todayArr = this.today.split('/');
    this.getOrders();
  }


  getOrders() {
    this.ordersService.getOrders()
      .subscribe(orders => {
        orders.map(order => {
          order.color='white'
          let deliveryDateArr;
          if(order.deliveryDate.includes("/")){
            deliveryDateArr=order.deliveryDate.split("/");
          }else{
            deliveryDateArr=order.deliveryDate.split("-");
          }
          let todayDateArr=this.today.split("/");
          //some date formated as 'YYYY/MM/DD' insted of 'DD/MM/YYYY'
          if(parseInt(deliveryDateArr[0]) >31){ //=========deliveryDateArr:  YYYY/MM/DD
          debugger
            if(parseInt(deliveryDateArr[0]) < parseInt(todayDateArr[2])){
              //RED
              order.color = '#ff9999';
            }else if(parseInt(deliveryDateArr[1]) < parseInt(todayDateArr[1])){
              //RED
              order.color = '#ff9999';
            }else if(parseInt(deliveryDateArr[2]) < parseInt(todayDateArr[0])){
              //RED
              order.color = '#ff9999';
            }
                       
          }else{//===============deliveryDateArr:  DD/MM/YYYY 
            if(parseInt(deliveryDateArr[2]) < parseInt(todayDateArr[2])){
              //RED
              order.color = '#ff9999';
            }else if(parseInt(deliveryDateArr[1]) < parseInt(todayDateArr[1])){
              //RED
              order.color = '#ff9999';
            }else if(parseInt(deliveryDateArr[0]) < parseInt(todayDateArr[0])){
              //RED
              order.color = '#ff9999';
            }
          }

          Object.assign({ isSelected: false }, order);
          order.NumberCostumer = order.orderNumber + " " + order.costumer;

        })
        this.orders = orders;
        this.ordersCopy = orders;
      })
  }



  edit(id) {
    this.EditRowId = id;
  }


  saveEdit(a, orderId) {
    
    let orderToUpdate = {};
    // a - is if the request is to set order - ready
    if (!a) {
      orderToUpdate = {
        'orderId': this.id.nativeElement.value,
        'orderNumber': this.orderNumber.nativeElement.value,
        "orderDate": this.orderDate.nativeElement.value,
        "costumer": this.costumer.nativeElement.value,
        "deliveryDate": this.deliveryDate.nativeElement.value,
        "orderRemarks": this.orderRemarks.nativeElement.value,
        "orderType": this.orderType.nativeElement.value,
      }
      this.ordersService.editOrder(orderToUpdate).subscribe(res => {
        let i = this.orders.findIndex(elemnt => elemnt._id == orderId);
        orderToUpdate['status'] = "";
        this.orders[i] = orderToUpdate;
        this.EditRowId = '';
        console.log(res)
      });

    }
    else {
      orderToUpdate = { status: 'close', orderId: orderId }
      if (confirm("Close Order?")) {
        console.log(orderToUpdate);
        this.ordersService.editOrder(orderToUpdate).subscribe(res => {
          let i = this.orders.findIndex(elemnt => elemnt._id == orderId);
          orderToUpdate['status'] = "";
          this.orders[i] = orderToUpdate;
          this.EditRowId = '';
          console.log(res)
        });
      }
    }
  }


  deleteOrder(order) {
    if (confirm("Delete Order?")) {
      this.ordersService.deleteOrder(order).subscribe(res => {
      //  let i = this.orders.findIndex(elemnt => elemnt._id == order._id);
      //  delete this.orders[i];
        this.orders=this.orders.filter(elem=>elem._id!=order._id);
      });
    }
  }

  loadOrders() {
    console.log(this.orders);
    let tempArr = this.orders.filter(e => e.isSelected == true).map(e => e = e._id);
    this.ordersService.sendOrderData(tempArr);
    this.ordersService.getAllOpenOrdersItems(false);
    this.router.navigate(["/peerpharm/allorders/orderitems/43"]);
    console.log(tempArr);
    //this.ordersService.getMultiOrdersIds(tempArr).subscribe(res=>console.log(res));
  }

  loadOrdersItems() {
    this.ordersService.getAllOpenOrdersItems(true);
    this.router.navigate(["/peerpharm/allorders/orderitems/43"]);

  }

  changeText(ev) {
    let word = ev.target.value;
    if (word == "") {
      this.orders = this.ordersCopy.slice();
    }
    else {
      this.orders = this.orders.filter(x => x.NumberCostumer.toLowerCase().includes(word.toLowerCase()));
    }
  }
}
