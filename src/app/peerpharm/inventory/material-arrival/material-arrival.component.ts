import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-material-arrival',
  templateUrl: './material-arrival.component.html',
  styleUrls: ['./material-arrival.component.css']
})
export class MaterialArrivalComponent implements OnInit {
  screenHeight: number;
  todayStr: String = '';
  user: String = '';
  analysisFlag: Boolean = false;
  newMaterialArrival: FormGroup;
  constructor(private fb: FormBuilder, private invtSer:InventoryService, private procuretServ: Procurementservice, private toastSrv: ToastrService, 
    private authService: AuthService,) {
      
    this.newMaterialArrival = fb.group({
      arrivalDate: [Date, Validators.nullValidator],
      user: ["", Validators.nullValidator],
      internalNumber: ["", Validators.required],
      materialName: ["", Validators.required], 

      lotNumber: ["", Validators.required], 
      // deliveryDate: [Date, new Date(), Validators.required], 
      // expiryDate: [String, "", Validators.required], 
      expiryDate: [Date, Validators.nullValidator],
      productionDate: [Date, ],

      // productionDate: [String, ""], 
      supplierName: ["", Validators.required], 
      supplierNumber: ["", Validators.required],
      analysisApproval: [Boolean, ], 
      
      totalQnt: [0, Validators.required], 
      mesureType: [ 'kg', Validators.required], 
          
      // remarks: ["", ],
      cmxOrderN: ["", ],
      packageType: ["", Validators.required], //select 
      packageQnt: [0, ],    
      unitsInPack: [0, ],    
      // unitVolume: [0, ],    
      // unitMesureType: [0, ],    
      
      warehouse: [""], //select 
      position: [""], //select 
    });

   }

  ngOnInit() {
    this.user=this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
    debugger
    this.todayStr= (new Date().toISOString() ).slice(0,10);
    console.log(this.todayStr);
    //setting form to screen height
    this.screenHeight = window.innerHeight*(0.8);
    console.log('screenHeight: '+this.screenHeight)
  }

  searchInternalNumber(){
    console.log(this.newMaterialArrival.value.internalNumber);
    
  }
  searchSupplierNumber(){
    console.log(this.newMaterialArrival.value.supplierNumber);
  }

  submitForm(){

  }

  resetForm(){
    this.newMaterialArrival.reset();
  }
}
