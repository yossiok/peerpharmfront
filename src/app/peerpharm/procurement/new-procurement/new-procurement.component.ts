import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';


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
  
  @ViewChild('itemNumber') itemNumber: ElementRef;
  @ViewChild('itemName') itemName: ElementRef;
  @ViewChild('coin') coin: ElementRef;
  @ViewChild('measurement') measurement: ElementRef;
  @ViewChild('supplierPrice') supplierPrice: ElementRef;
  @ViewChild('supplierAmount') supplierAmount: ElementRef;

  newItem = {

  itemNumber: '',
  itemName:'',
  coin:'',
  measurement:'',
  supplierPrice:'',
  supplierAmount:'',
  color:'',
  orderNumber:''

  }
  newProcurement = {

    supplierNumber:'',
    supplierName:'',
    outDate:'',
    validDate:'',
    item:[],
    comaxNumber:''

  }

  constructor(private toastr: ToastrService,private procurementService: Procurementservice,private authService: AuthService,private inventoryService:InventoryService,private supplierService: SuppliersService ,public formBuilder: FormBuilder,) { 

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
    this.inventoryService.getMaterialStockItemByNum(this.newItem.itemNumber).subscribe(data=>{
      debugger;
     if(data[0]) {
      this.newItem.itemName = data[0].componentName; 
        if(data[0].frameQuantity || data[0].frameSupplier) {
          alert('שים לב , פריט זה נמצא במסגרת אצל ספק:' +"  "+ data[0].frameSupplier +" "+ 'כמות:'+" "+ data[0].frameQuantity)
        }

     } else {
       this.toastr.error('פריט לא קיים במערכת')
     }
     
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


  addItemToProcurement(){
    
    var newItem = {
      coin:this.coin.nativeElement.value,
      itemName:this.itemName.nativeElement.value,
      itemNumber:this.itemNumber.nativeElement.value,
      measurement:this.measurement.nativeElement.value,
      supplierAmount:this.supplierAmount.nativeElement.value,
      supplierPrice:this.supplierPrice.nativeElement.value,
    }

    this.newProcurement.item.push(newItem);

    this.newItem.coin = "";
    this.newItem.itemName ="";
    this.newItem.itemNumber="";
    this.newItem.measurement="";
    this.newItem.supplierAmount="";
    this.newItem.supplierPrice="";
  
    this.toastr.success("פריט התווסף בהצלחה!")
    
  }
  sendNewProc() { 
    debugger;

   this.procurementService.addNewProcurement(this.newProcurement).subscribe(data=>{
    if(data) {
      this.toastr.success("הזמנה מספר" + data.orderNumber + "נשמרה בהצלחה!")
      this.procurementService.removeFromFrameQuantity(data.item[0]).subscribe(data=>{
        if(data) {
          this.toastr.success("כמות זו ירדה מכמות המסגרת")
        }

      })
      this.newProcurement.validDate = ""
      this.newProcurement.outDate = ""
      this.newProcurement.supplierName = ""
      this.newProcurement.supplierNumber = ""
      this.newProcurement.comaxNumber = ""
      this.newProcurement.item = [];

      
    }
   })
  }


 
}