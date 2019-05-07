import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';

@Component({
  selector: 'app-material-arrival',
  templateUrl: './material-arrival.component.html',
  styleUrls: ['./material-arrival.component.css']
})
export class MaterialArrivalComponent implements OnInit {
  screenHeight: number;
  dateStr: String ;
  user: UserInfo ;
  analysisFlag: Boolean = false;
  borderColor: String = '#36bea6';
  newMaterialArrival: FormGroup;
  constructor(private fb: FormBuilder, private invtSer:InventoryService, private procuretServ: Procurementservice, private toastSrv: ToastrService, 
    private authService: AuthService,) {
      
    this.newMaterialArrival = fb.group({
      arrivalDate: [Date, Validators.nullValidator],
      user: ["", Validators.nullValidator],
      internalNumber: ["", Validators.required],
      materialName: ["", Validators.required], 

      lotNumber: ["", Validators.required], 
      expiryDate: [Date, Validators.nullValidator],
      productionDate: [Date, ],

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
    this.user =   this.authService.loggedInUser;
    debugger
    this.authService.getLoggedInUser().subscribe(data => {
      if (data.msg == null) {
        console.log(data.msg);
        this.user=data;
        debugger
      }
    });

    this.newMaterialArrival.controls.user.setValue( this.user.firstName+" "+this.user.lastName);
    let tmpD=new Date();
    this.dateStr= tmpD.toISOString().slice(0,10);
    console.log(this.dateStr);
    //setting form to screen height
    this.screenHeight = window.innerHeight*(0.8);
    console.log('screenHeight: '+this.screenHeight)
  }

  addMaterialToStock(){
    let formToSend;
    this.dateStr
debugger
    // this.invtSer.newMatrialArrival(formToSend).subscribe( res=>{});         

  }
  searchInternalNumber(){
    console.log(this.newMaterialArrival.value.internalNumber);
    
  }
  searchSupplierNumber(){
    console.log(this.newMaterialArrival.value.supplierNumber);
  }

  submitForm(){

  }

  fieldsColor(){
    if(this.newMaterialArrival.valid){
      this.borderColor; 
    }
  }
  resetForm(){
    this.newMaterialArrival.reset();
  }
}
