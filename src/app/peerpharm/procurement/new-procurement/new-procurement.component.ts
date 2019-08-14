import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { Procurementservice } from 'src/app/services/procurement.service';


@Component({
  selector: 'app-new-procurement',
  templateUrl: './new-procurement.component.html',
  styleUrls: ['./new-procurement.component.css']
})
export class NewProcurementComponent implements OnInit {

  newProcurementForm:any;
  procurementSupplier:boolean = true;
  procurementItems:boolean = false;
  allSuppliers:any[];
  hasAuthorization:boolean = false;
  

  newProcurement = {

    itemNumber: '',
    itemName:'',
    supplierNumber:'',

  }

  constructor(private procurementService: Procurementservice,private authService: AuthService,private inventoryService:InventoryService,private supplierService: SuppliersService ,public formBuilder: FormBuilder,) { 

  }

  ngOnInit() {
    this.getAllSuppliers();
    
  }

  moveToProcItems() {  
    if(this.newProcurementForm.value.orderNumber != "") {
      this.procurementSupplier = false;
      this.procurementItems = true;
    }
  }

  findMaterialByNumber(){
    debugger;
    this.inventoryService.getMaterialStockItemByNum(this.newProcurement.itemNumber).subscribe(data=>{
      debugger;
     data;
     this.newProcurement.itemName = data[0].componentName; 
    })
  }

  getAllSuppliers() { 
    this.supplierService.getSuppliersDiffCollection().subscribe(data=>{
    this.allSuppliers = data;
    })
  }

  findSupplierByNumber(ev) {
    debugger;
    let supplier = ev.target.value;
    let result =  this.allSuppliers.filter(x => supplier == x.suplierName)
    
    this.newProcurement.supplierNumber = result[0].suplierNumber
    
  }

  sendNewProc() { 
    debugger;
   this.procurementService.addNewProcurement(this.newProcurement).subscribe(data=>{
     data;
   })
  }


}
