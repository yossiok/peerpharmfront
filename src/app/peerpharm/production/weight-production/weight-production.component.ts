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
  kgToRemove: any;
  formuleNumber: any;
  formuleUnitWeight:any;
  formuleWeight: any;
  formuleWeight2: any;
  formuleOrder: any;
  formuleOrder2: any;
  shelfNumber: any;
  shelfPosition
  earlierExpiries: any = []
  isSplitted: boolean = false;


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

  formuleOneCalculate(data){
    
    data.phases.forEach(phase => {
      phase.items.forEach(item => {
        item.kgProd = Number(this.formuleWeight) * (Number(item.percentage) / 100)
      });
    });

    return data
  }

  formuleTwoCalculate(data){
    
    data.phases.forEach(phase => {
      phase.items.forEach(item => {
        item.kgProd = Number(this.formuleWeight2) * (Number(item.percentage) / 100)
      });
    });

    return data

  }

  getFormuleByNumber() {

    if (this.formuleNumber != '' && this.formuleWeight != '') {

      //get formule weight per unit
      this.itemService.getItemData(this.formuleNumber).subscribe(data=>this.formuleUnitWeight = data[0].netWeightK)

      //splitted formule
      if(this.formuleWeight2 && this.formuleWeight2 != '') {
        this.formuleSrv.getFormuleByNumber(this.formuleNumber).subscribe(data => {
  
          let copyData = JSON.parse(JSON.stringify(data))
          let copyData2 = JSON.parse(JSON.stringify(data))
  
          let formule1 = this.formuleOneCalculate(copyData);
          let formule2 = this.formuleTwoCalculate(copyData2);

          this.currentFormule = formule1
          this.currentFormule2 = formule2

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
