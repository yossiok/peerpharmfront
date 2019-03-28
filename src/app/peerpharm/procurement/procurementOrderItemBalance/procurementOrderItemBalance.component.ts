import { Component, OnInit } from '@angular/core';
import { Procurementservice } from './../../../services/procurement.service';

@Component({
  selector: 'app-procurement-order-item-balance',
  templateUrl: './procurementOrderItemBalance.component.html',
  styleUrls: ['./procurementOrderItemBalance.component.css']
})

export class ProcurementOrderItemBalanceComponent implements OnInit {
  procurementData: any;

  constructor(
    private procurementservice: Procurementservice
  ) {}

  ngOnInit() {
    this.getAllProcurementOrderItemBalance();
  }

  getAllProcurementOrderItemBalance() {
    this.procurementservice.getProcurementOrderItemBalance().subscribe(res => {
      this.procurementData = res;
      console.log(this.procurementData);
    });
  }
}
