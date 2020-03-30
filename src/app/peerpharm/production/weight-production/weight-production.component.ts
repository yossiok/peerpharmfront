import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-weight-production',
  templateUrl: './weight-production.component.html',
  styleUrls: ['./weight-production.component.css']
})
export class WeightProductionComponent implements OnInit {


  allMaterialArrivals:any[];
  materialArrivals:Boolean = false;
  printStickerBtn:Boolean = false;
 

  barcode = {
    materialId:'',
    materialNumber:'',
    materialName:'',
    weight:'',
    formuleNumber:''
  }

  constructor(private inventorySrv:InventoryService, private toastSrv:ToastrService) { }

  ngOnInit() {
  }

  getMaterialByNumber(){

  this.inventorySrv.getMaterialtByComponentN(this.barcode.materialNumber).subscribe(data=>{
  if(data){
    this.barcode.materialName = data[0].componentName
  }
  })

  this.inventorySrv.getMaterialArrivalByNumber(this.barcode.materialNumber).subscribe(data=>{
    debugger;
    if(data){
      this.allMaterialArrivals = data.reverse();
      this.materialArrivals = true;
    } else {
      this.toastSrv.error('No Material Arrivals')
    }
    


  })
  }

  checkIfIdExist(event){
   var materialId = event.target.value;
   var materialArrival = this.allMaterialArrivals.find(a=>a._id == materialId)
   if(materialArrival){
     this.toastSrv.success('You can now print the sticker')
     this.printStickerBtn = true;
   } else {
     this.barcode.materialId = '';
     this.toastSrv.error('Wrong Material')
   }
  }

  printBarcode(){
    this.printStickerBtn = false;
    this.materialArrivals = false;
    this.barcode = {
      materialId:'',
    materialNumber:'',
    materialName:'',
    weight:'',
    formuleNumber:''
    };
  }

}
