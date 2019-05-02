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

  today: Date = new Date();
  newMaterialArrival: FormGroup;
  constructor(private fb: FormBuilder, private invtSer:InventoryService, private procuretServ: Procurementservice, private toastSrv: ToastrService, 
    private authService: AuthService,) {
      
    this.newMaterialArrival = fb.group({
      deliveryDate: [Date, new Date(), Validators.required], 
      productionDate: [Date, null], 
      internalNumber: ["", Validators.required],
      materialName: ["", Validators.required], 
      lotNumber: ["", Validators.required], 
      supplierName: ["", Validators.required], 
      supplierNumber: ["", Validators.required], 
      analysisApproval: [Boolean,false, Validators.required], 
      totalQnt: [0, Validators.required], 
      packageType: ["", Validators.required], //select 
      packageQnt: [0, Validators.required],              
    
      remarks: ["", ],
      lastUpdateDate: [Date, Validators.nullValidator],
      lastUpdateUser: ["", Validators.nullValidator],
      status: ["", Validators.nullValidator],
    });

   }

  ngOnInit() {
  }

}
