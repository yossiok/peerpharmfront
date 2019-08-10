import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-new-procurement',
  templateUrl: './new-procurement.component.html',
  styleUrls: ['./new-procurement.component.css']
})
export class NewProcurementComponent implements OnInit {

  newProcurementForm:any;
  procurementSupplier:boolean = true;
  procurementItems:boolean = false;

  constructor(public formBuilder: FormBuilder,) { 


  this.newProcurementForm = this.formBuilder.group({
    orderNumber:'',
    date:'',
    supplier:'',

  })
  }

  ngOnInit() {
  }

  moveToProcItems() {  
    if(this.newProcurementForm.value.orderNumber != "") {
      this.procurementSupplier = false;
      this.procurementItems = true;
    }
  }
}
