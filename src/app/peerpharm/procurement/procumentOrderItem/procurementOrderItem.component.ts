import { Component, OnInit } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-procurement-order-item',
  templateUrl: './procurementOrderItem.component.html',
  styleUrls: ['./procurementOrderItem.component.css']
})

export class ProcurementOrderItemComponent implements OnInit {
  procurementData: any;
  orderNumber: any;
  orderDate: any;

  constructor(
    private procurementservice: Procurementservice,
    private route: ActivatedRoute
  ) {
    debugger;
  }

  ngOnInit() {
    console.log('Enter');
    this.orderNumber = this.route.snapshot.paramMap.get('orderNumber');
    this.orderDate =  this.route.snapshot.paramMap.get('orderDate');

    if (this.orderNumber){
      debugger;
      this.getAllProcurementOrderItemByOrderId();
    }
    else {
      debugger;
      this.getAllProcurementOrderItem();
    }

  }

  getAllProcurementOrderItem() {
    this.procurementservice.getProcurementOrderItem().subscribe(res => {
      this.procurementData = res;
      console.log(this.procurementData);
    });
  }

  getAllProcurementOrderItemByOrderId() {
    debugger;
    this.procurementservice.getProcurementOrderItemByOrderNumber(this.orderNumber, this.orderDate).subscribe(res => {
      this.procurementData = res;
      console.log(this.procurementData);
    });
  }
}
