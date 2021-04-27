import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { FormulesService } from 'src/app/services/formules.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-weight-production',
  templateUrl: './weight-production.component.html',
  styleUrls: ['./weight-production.component.scss']
})
export class WeightProductionComponent implements OnInit {


  @ViewChild('printFormuleBtn') printFormuleBtn: ElementRef;
  @ViewChild('reduceMaterialAmount') reduceMaterialAmount: ElementRef;
  @ViewChild('formuleNumberElement') formuleNumberElement: ElementRef;
  
  allMaterialArrivals:any[];
  materialShelfs:any[] = []
  materialArrivals:Boolean = false;
  printStickerBtn:Boolean = false;
  currentFormule:any;
  kgToRemove:any;
  formuleNumber:any;
  formuleWeight:any;
  formuleOrder:any;
  shelfNumber:any;
  shelfPosition
  earlierExpiries:any = []
 

  barcode = {
    materialId:'',
    materialNumber:'',
    materialName:'',
    weight:'',
    formuleNumber:''
  }
  materialName: any;
  materialNumber: any;

  constructor(
    private formuleSrv:FormulesService,
    private inventorySrv:InventoryService, 
    private toastSrv:ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.formuleNumberElement.nativeElement.focus()
  }


  getMaterialByNumber(){

  this.inventorySrv.getMaterialtByComponentN(this.barcode.materialNumber).subscribe(data=>{
  if(data){
    this.barcode.materialName = data[0].componentName
  }
  })

  this.inventorySrv.getMaterialArrivalByNumber(this.barcode.materialNumber).subscribe(data=>{
    ;
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
    ;
  if(this.formuleNumber != '' && this.formuleWeight != '') {
    this.formuleSrv.getFormuleByNumber(this.formuleNumber).subscribe(data=>{
      ;
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


  printFormule(){
    this.printFormuleBtn.nativeElement.click();
    this.finishWeight();
    document.getElementById("formuleNumber").focus();
  }

  reduceAmountFromShelf(material){
    if(confirm('האם להוריד כמות ממדף זה ?')){
      material.amount = material.amount - this.kgToRemove;

      this.inventorySrv.reduceMaterialAmountFromShelf(this.materialNumber, this.shelfPosition, this.kgToRemove).subscribe(response=>{
        
        if(response){
          this.currentFormule.phases.forEach(phase => {
            phase.items.forEach(item => {
              if(item.itemNumber == response.updatedMaterial.item){
                item.check = true
              }
            });
          });
          this.toastSrv.success(`${this.kgToRemove} kg reduced from shelf ${this.shelfPosition} for material ${this.materialNumber} - ${this.materialName}`)
          this.materialShelfs = []
        }
      })
    }
  }

  finishWeight(){
  this.currentFormule = {}
  this.formuleNumber = ''
  this.formuleOrder = ''
  this.formuleWeight = ''
  }


  
  weightProduction(materialNumber, materialName, ev, kgProd){

    // First, we need to check if there is an older expired (פג תוקף)
    // reqNum = arrival ID scanned
    let materialArrivalReqNum = ev.target.value;
    this.inventorySrv.checkExpirationsForMaterial(materialNumber, materialArrivalReqNum).subscribe(response=>{
        switch (response.msg) {
          case 'Scanned wrong line. Try again.':
            this.toastSrv.error(response.msg)
            break;
          case 'Earlier Expiries Exist':
            this.materialShelfs = response.itemShelfs
            break
          case 'No Earlier Expiries': 
            this.openReduceMaterialModal(materialName, materialNumber, response.shelfPosition, kgProd)
        }
    })



    // this.kgToRemove = kgProd

    // if(materialArrivalReqNum != ''){
    //   this.inventorySrv.getShelfListForMaterial(materialNumber).subscribe(data=>{
    //     ;
    //     if(data.msg == 'noShelf'){
    //       this.toastSrv.error('Material is not exist on this shelf')
    //     }
    //     else{
    //       this.materialShelfs = data;
    //     }
    //   })
    // } else {
    //   this.toastSrv.error('Please scan / fill the material number')
    // }
  }

  openReduceMaterialModal(materialName, materialNumber, shelfPosition, kgProd) {
    this.materialName = materialName
    this.materialNumber = materialNumber
    this.shelfPosition = shelfPosition
    this.kgToRemove = kgProd
    this.modalService.open(this.reduceMaterialAmount)
  }
  

}
