import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { FormulesService } from 'src/app/services/formules.service';

@Component({
  selector: 'app-weight-production',
  templateUrl: './weight-production.component.html',
  styleUrls: ['./weight-production.component.scss']
})
export class WeightProductionComponent implements OnInit {


  allMaterialArrivals:any[];
  materialShelfs:any[] = []
  materialArrivals:Boolean = false;
  printStickerBtn:Boolean = false;
  currentFormule:any;
  kgToRemove:any;
  formuleNumber:any;
  formuleWeight:any;
  shelfNumber:any;
 

  barcode = {
    materialId:'',
    materialNumber:'',
    materialName:'',
    weight:'',
    formuleNumber:''
  }

  constructor(private formuleSrv:FormulesService,private inventorySrv:InventoryService, private toastSrv:ToastrService) { }

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

  getFormuleByNumber(){
    debugger;
  if(this.formuleNumber != '' && this.formuleWeight != '') {
    this.formuleSrv.getFormuleByNumber(this.formuleNumber).subscribe(data=>{
      debugger;
    data.phases.forEach(phase => {
    phase.items.forEach(item => {
    item.kgProd = Number(this.formuleWeight)*(Number(item.percentage)/100)
    });
    });
    this.currentFormule = data;

    })
  } else {
    this.toastSrv.error('Please fill all fields')
  }
  
  }

  reduceAmountFromShelf(material){
    if(confirm('האם להוריד כמות ממדף זה ?')){
      material.amount = material.amount - this.kgToRemove;

      this.inventorySrv.reduceMaterialAmount(material).subscribe(data=>{
        debugger
        if(data){
          this.currentFormule.phases.forEach(phase => {
            phase.items.forEach(item => {
              if(item.itemNumber == data.item){
                item.check = true
              }
            });
          });
          this.toastSrv.success('Amount reduced from shelf')
          this.materialShelfs = []
        }
      })
    }
  }

  finishWeight(){
  this.currentFormule = {}
  }


  
  searchForShelf(ev,kgProd){
  let material = ev.target.value;
  this.kgToRemove = kgProd

  if(material != ''){
    this.inventorySrv.getShelfListForMaterial(material).subscribe(data=>{
      debugger;
      if(data.msg == 'noShelf'){
        this.toastSrv.error('Material is not exist on this shelf')
      }
      else{
        this.materialShelfs = data;
      }
    })
  } else {
    this.toastSrv.error('Please scan / fill the material number')
  }
    }

  

}
