import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-material-scan-view',
  templateUrl: './material-scan-view.component.html',
  styleUrls: ['./material-scan-view.component.css']
})
export class MaterialScanViewComponent implements OnInit {
  params:String;
  currMaterial: any={ // MaterialArrivalForm- server side schema
      arrivalDate: Date,
      user: String,
      internalNumber: String,
      materialName: String,
      lotNumber: String,
      expiryDate: Date,
      productionDate: Date,
      supplierName: String,
      supplierNumber: String,
      analysisApproval: Boolean,
      totalQnt: Number,
      mesureType: String,
      remarks: String,
      cmxOrderN: String,
      packageType: String,
      packageQnt: Number,
      unitsInPack: Number,
      warehouse: String,
      position: String,
      barcode: String,
      lastUpdate:Date,
      lastUpdateUser:String,
  
  };
  constructor( private activatedRoute:ActivatedRoute , private invtSer:InventoryService , ) { }

  ngOnInit() {
    debugger
      this.activatedRoute.queryParams.subscribe(params => {
        if(params.id){
          this.invtSer.getMaterialArrivalFormById(params.id).subscribe(data=>{
            this.currMaterial = data;
          })
        }
      });
  }
}