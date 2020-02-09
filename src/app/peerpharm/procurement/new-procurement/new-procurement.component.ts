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
    supplierName:'',
    outDate:'',
    validDate:'',
    blockProcurement:'',
    blockSales:'',
    hasWeight:'',
    notWeight:'',
    measurement:'',
    barcode:'',
    alternativeCode:'',
    coin:'',
    supplierPrice:'',
    fromDate:'',
    supplierAmount:'',
    salePrice:'',
    saleDate:'',
    saleAmount:'',
    discount:'',
    supplierItemNumber:'',
    supplierItemName:'',

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
    
    this.inventoryService.getMaterialStockItemByNum(this.newProcurement.itemNumber).subscribe(data=>{
      
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
    
    let supplier = ev.target.value;
    let result =  this.allSuppliers.filter(x => supplier == x.suplierName)
    
    this.newProcurement.supplierNumber = result[0].suplierNumber
    
  }

  sendNewProc() { 
    
   this.procurementService.addNewProcurement(this.newProcurement).subscribe(data=>{
     data;
   })
  }

}