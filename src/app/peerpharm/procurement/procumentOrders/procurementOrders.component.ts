import { Component, OnInit } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.css']
})

export class ProcurementOrdersComponent implements OnInit {
  procurementData: any;

  constructor(
    private procurementservice: Procurementservice
  ) {}

  ngOnInit() {
    console.log('Enter');
    this.getAllProcurementOrders();
  }

  getAllProcurementOrders() {
    this.procurementservice.getProcurementOrder().subscribe(res => {
      this.procurementData = res;
      console.log(this.procurementData);
    });
  }
}
