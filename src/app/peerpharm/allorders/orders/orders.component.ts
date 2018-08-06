import { Component, OnInit } from '@angular/core';
import {OrdersService} from '../../../services/orders.service'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private ordersService:OrdersService) { }
  orders:any[];
  ngOnInit() {
    this.getOrders();
  }


  getOrders(){
    this.ordersService.getOrders()
    .subscribe(orders=>{
      this.orders= orders.map(order => Object.assign({isSelected:false}, order));
      //let x= this.orders.filter(x=> x.isSelected==false);
      //let yy= x.map(y=> {orderN:y.orderN});
      //debugger;
      //console.log(x);
    })
  }
}
