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
      this.orders=orders;
      console.log(orders);
    })
  }
}
