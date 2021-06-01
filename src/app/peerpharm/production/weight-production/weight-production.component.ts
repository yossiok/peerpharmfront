import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { FormulesService } from 'src/app/services/formules.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-weight-production',
  templateUrl: './weight-production.component.html',
  styleUrls: ['./weight-production.component.scss']
})
export class WeightProductionComponent implements OnInit {


  @ViewChild('printFormuleBtn') printFormuleBtn: ElementRef;
  @ViewChild('reduceMaterialAmount') reduceMaterialAmount: ElementRef;
  @ViewChild('formuleNumberElement') formuleNumberElement: ElementRef;

  allMaterialArrivals: any[];
  materialShelfs: any[] = []
  materialArrivals: Boolean = false;
  printStickerBtn: Boolean = false;
  currentFormule: any;
  currentFormule2: any;
  currentFormule3: any;
  currentFormule4: any;
  kgToRemove: any;
  formuleNumber: any;
  formuleUnitWeight:any;
  formuleWeight: any;
  formuleWeight2: any;
  formuleWeight3: any;
  formuleWeight4: any;
  formuleOrder: any;
  formuleOrder2: any;
  shelfNumber: any;
  shelfPosition
  earlierExpiries: any = []
  numOfBatches: number = 1;
  batches:any[] = [{
    orderNum: '',
    weight: 0,
    item: ''
  }]


  barcode = {
    materialId: '',
    materialNumber: '',
    materialName: '',
    weight: '',
    formuleNumber: ''
  }
  materialName: any;
  materialNumber: any;

  constructor(
    private formuleSrv: FormulesService,
    private inventorySrv: InventoryService,
    private toastSrv: ToastrService,
    private modalService: NgbModal,
    private itemService: ItemsService) { }

  ngOnInit() {
    this.formuleNumberElement.nativeElement.focus()
  }


  getMaterialByNumber() {

    this.inventorySrv.getMaterialtByComponentN(this.barcode.materialNumber).subscribe(data => {
      if (data) {
        this.barcode.materialName = data[0].componentName
      }
    })

    this.inventorySrv.getMaterialArrivalByNumber(this.barcode.materialNumber).subscribe(data => {
      ;
      if (data) {
        this.allMaterialArrivals = data.reverse();
        this.materialArrivals = true;
      } else {
        this.toastSrv.error('No Material Arrivals')
      }



    })
  }

  checkIfIdExist(event) {
    var materialId = event.target.value;
    var materialArrival = this.allMaterialArrivals.find(a => a._id == materialId)
    if (materialArrival) {
      this.toastSrv.success('You can now print the sticker')
      this.printStickerBtn = true;
    } else {
      this.barcode.materialId = '';
      this.toastSrv.error('Wrong Material')
    }
  }

  printBarcode() {
    this.printStickerBtn = false;
    this.materialArrivals = false;
    this.barcode = {
      materialId: '',
      materialNumber: '',
      materialName: '',
      weight: '',
      formuleNumber: ''
    };
  }

  
  
  getFormuleByNumber() {
    
    if (this.formuleNumber != '' && this.formuleWeight != '') {
      
      //get formule weight per unit
      this.itemService.getItemData(this.formuleNumber).subscribe(data=>this.formuleUnitWeight = data[0].netWeightK)
      
      //splitted formule
      if(this.formuleWeight2 && this.formuleWeight2 != '') {
        this.formuleSrv.getFormuleByNumber(this.formuleNumber).subscribe(data => {

          for (let batch of this.batches) {
            let copyData = JSON.parse(JSON.stringify(data))
            batch.formule = this.formuleCalculate(copyData, this.formuleWeight);
          }
          
          // let copyData2 = JSON.parse(JSON.stringify(data))
          // let copyData3 = JSON.parse(JSON.stringify(data))
          // let copyData4 = JSON.parse(JSON.stringify(data))
          
          // this.currentFormule2 = this.formuleCalculate(copyData2, this.formuleWeight2);
          // this.currentFormule3 = this.formuleCalculate(copyData3, this.formuleWeight3);
          // this.currentFormule4 = this.formuleCalculate(copyData4, this.formuleWeight4);
          
        })
      }
      
      //not splitted
      else {
        this.formuleSrv.getFormuleByNumber(this.formuleNumber).subscribe(data => {
          data.phases.forEach(phase => {
            phase.items.forEach(item => {
              item.kgProd = Number(this.formuleWeight) * (Number(item.percentage) / 100)
            });
          });
          this.currentFormule = data;
          
        })
      }
    } else {
      this.toastSrv.error('Please fill all fields')
    }
    
  }


  addBatch() {
    this.batches.push({
      orderNum: '',
      weight: 0,
      item: ''
    })
  }

  resetBatches(){
    this.batches = [{ 
        orderNum: '',
        weight: 0,
        item: ''
      }]
  }
  
  formuleCalculate(data, weight){
    
    data.phases.forEach(phase => {
      phase.items.forEach(item => {
        item.kgProd = Number(weight) * (Number(item.percentage) / 100)
      });
    });

    return data
  }
  
  printFormule() {
    this.printFormuleBtn.nativeElement.click();
    this.finishWeight();
    document.getElementById("formuleNumber").focus();
  }
  
  reduceAmountFromShelf(material) {
    if (confirm('האם להוריד כמות ממדף זה ?')) {
      material.amount = material.amount - this.kgToRemove;

      this.inventorySrv.reduceMaterialAmountFromShelf(this.materialNumber, this.shelfPosition, this.kgToRemove).subscribe(response => {

        if (response) {
          this.currentFormule.phases.forEach(phase => {
            phase.items.forEach(item => {
              if (item.itemNumber == response.updatedMaterial.item) {
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

  finishWeight() {
    this.currentFormule = {}
    this.formuleNumber = ''
    this.formuleOrder = ''
    this.formuleWeight = ''
  }



  weightProduction(materialNumber, materialName, ev, kgProd) {

    // First, we need to check if there is an older expired (פג תוקף)
    // reqNum = arrival ID scanned
    let materialArrivalReqNum = ev.target.value;
    this.inventorySrv.checkExpirationsForMaterial(materialNumber, materialArrivalReqNum).subscribe(response => {
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
