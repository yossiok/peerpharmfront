import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';


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
  user: UserInfo;

  newProcurement = {

    itemNumber: '',
    itemName:'',

  }

  constructor(private authService: AuthService,private inventoryService:InventoryService,private supplierService: SuppliersService ,public formBuilder: FormBuilder,) { 

  }

  ngOnInit() {
    this.getAllSuppliers();
    this.getUserInfo();
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

  async getUserInfo() {
    debugger
    await this.authService.userEventEmitter.subscribe(user => {
      this.user=user;
      // this.user=user.loggedInUser;
      // if (!this.authService.loggedInUser) {
      //   this.authService.userEventEmitter.subscribe(user => {
      //     if (user.userName) {
      //       this.user = user;
            
      //     }
      //   });
      // }
      // else {
      //   this.user = this.authService.loggedInUser;
      // }
      if (this.user.authorization){
        debugger
        if (this.authService.loggedInUser.authorization.includes("viewReports")){
          this.hasAuthorization=true;
        }
      }

    });

  }
}
