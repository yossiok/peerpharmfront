import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { FormulesService } from 'src/app/services/formules.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from 'src/app/services/items.service';
import * as _ from 'lodash'

interface FormuleWeight {
  formuleNumber: any;
  formuleWeight: any;
  formuleOrder: any;
  formuleUnitWeight: any;
  data: any;
}

@Component({
  selector: 'app-weight-production',
  templateUrl: './weight-production.component.html',
  styleUrls: ['./weight-production.component.scss']
})
export class WeightProductionComponent implements OnInit {


  @ViewChild('printFormuleBtn') printFormuleBtn: ElementRef;
  @ViewChild('reduceMaterialAmount') reduceMaterialAmount: ElementRef;
  @ViewChild('formuleNumberElement') formuleNumberElement: ElementRef;
  @ViewChild('formuleNumber') formuleNumber: ElementRef;
  @ViewChild('formuleWeight') formuleWeight: ElementRef;
  @ViewChild('orderNumber') orderNumber: ElementRef;

  formules: FormuleWeight[] = [];

  finalFormule: FormuleWeight;
  allMaterialArrivals: any[];
  materialShelfs: any[] = []
  shelfPosition: any
  kgToRemove: any;
  shelfNumber: any;
  earlierExpiries: any = []
  finalWeight: number = 0;
  formuleExist: boolean = true
  materialArrivals: Boolean = false;
  printStickerBtn: Boolean = false;
  edit: boolean = false;
  showPill: boolean = true


  barcode = {
    materialId: '',
    materialNumber: '',
    materialName: '',
    weight: '',
    formuleNumber: ''
  }
  materialName: any;
  materialNumber: any;

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent): void {

    if (this.formules.length == 1 && this.formules[0].data.phases && event.key === 'Enter' && this.formuleNumber.nativeElement.value == '') {
      this.chooseFormule(this.formules[0])
    }

    if(event.key === 'F2') this.newProcess()
    if(event.key === 'F4') this.compareFormules()
    if(event.key === 'F10') this.printFormule()
  }

  constructor(
    private formuleSrv: FormulesService,
    private inventorySrv: InventoryService,
    private toastSrv: ToastrService,
    private modalService: NgbModal,
    private itemService: ItemsService) { }

  ngOnInit() {
    setTimeout(() => {
      this.formuleNumber.nativeElement.focus()
    }, 500)
  }

  deleteFormule(i) {
    if(confirm('להסיר פורמולה?')) this.formules.splice(i, 1)
  }

  newProcess() {
    this.showPill = true
    this.formules = []
    this.finalFormule = null
    this.finalWeight = 0
    this.formuleNumber.nativeElement.value = ''
    this.orderNumber.nativeElement.value = ''
    this.formuleWeight.nativeElement.value = ''
    setTimeout(()=>this.formuleNumber.nativeElement.focus(),500)
  }

  checkFormule(e) {
    this.formuleSrv.getFormuleByNumber(e.target.value).subscribe(data => {
      if (data == null) {
        this.toastSrv.error(`Formule Number ${e.target.value} Not Found!`)
        this.formuleExist = false
      }
      else {
        this.formuleExist = true
      }
    })
  }

  go() {
    if (this.formuleNumber.nativeElement.value != '' && this.formuleWeight.nativeElement.value != '') {
      this.itemService.getItemData(this.formuleNumber.nativeElement.value).subscribe(itemData => {
        this.addFormuleWeight(itemData)
       
      })
    } else {
      this.toastSrv.error('Please fill all fields')
      this.formuleNumber.nativeElement.focus()
    }
  }

  addFormuleWeight(itemData) {
    let formuleWeight: FormuleWeight = {
      formuleNumber: this.formuleNumber.nativeElement.value,
      formuleWeight: this.formuleWeight.nativeElement.value,
      formuleOrder: this.orderNumber.nativeElement.value,
      formuleUnitWeight: itemData[0].netWeightK,
      // formuleUnitWeight: itemData[0] ? itemData[0].netWeightK : 0,
      data: {}
    }
    this.formuleSrv.getFormuleByNumber(this.formuleNumber.nativeElement.value).subscribe(data => {
      if (data == null) {
        this.toastSrv.error(`Formule Number ${this.formuleNumber.nativeElement.value} Not Found!`)
        return
      }
      else {
        formuleWeight.data = this.formuleCalculate(data, this.formuleWeight.nativeElement.value);
        this.finalWeight += Number(this.formuleWeight.nativeElement.value)
        this.formules.push(formuleWeight)
      }
      this.formuleNumber.nativeElement.value = ''
      this.formuleWeight.nativeElement.value = ''
      this.formuleNumber.nativeElement.value = ''
      this.formuleNumber.nativeElement.focus()
    })
  }

  formuleCalculate(data, formuleWeight) {
    data.phases.forEach(phase => {
      phase.items.forEach(item => {
        item.kgProd = Number(formuleWeight) * (Number(item.percentage) / 100)
      });
    });
    return data
  }

  compareFormules() {
    for (let i = 0; i < this.formules.length - 1; i++) {
      if (_.isEqual(this.formules[i].data.phases, this.formules[i + 1].data.phases)) {
        // console.log(_.differenceWith(this.formules[i].data, this.formules[i+1].data, _.isEqual))
        this.finalFormule = this.formules[i]
        this.toastSrv.success('Twin Formules!')
      }
      else {
        for (let j = 0; j < this.formules[i].data.phases.length; j++) {
          for (let k = 0; k < this.formules[i].data.phases[j].items.length; k++) {
            if (Number(this.formules[i].data.phases[j].items[k].percentage) != Number(this.formules[i + 1].data.phases[j].items[k].percentage)) {
              this.formules[i].data.phases[j].items[k].color = 'orange'
              this.formules[i + 1].data.phases[j].items[k].color = 'orange'
            }
          }
        }
      }
    }
  }

  chooseFormule(formule) {
    this.showPill = false
    this.finalFormule = { ...formule }
    this.finalFormule.data = this.formuleCalculate(this.finalFormule.data, this.finalWeight)
  }

  printFormule() {
    this.printFormuleBtn.nativeElement.click();
    document.getElementById("formuleNumber").focus();
  }

  // reduceAmountFromShelf(material) {
  //   if (confirm('האם להוריד כמות ממדף זה ?')) {
  //     material.amount = material.amount - this.kgToRemove;

  //     this.inventorySrv.reduceMaterialAmountFromShelf(this.materialNumber, this.shelfPosition, this.kgToRemove).subscribe(response => {

  //       if (response) {
  //         this.currentFormule.phases.forEach(phase => {
  //           phase.items.forEach(item => {
  //             if (item.itemNumber == response.updatedMaterial.item) {
  //               item.check = true
  //             }
  //           });
  //         });
  //         this.toastSrv.success(`${this.kgToRemove} kg reduced from shelf ${this.shelfPosition} for material ${this.materialNumber} - ${this.materialName}`)
  //         this.materialShelfs = []
  //       }
  //     })
  //   }
  // }

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

  getMaterialByNumber() {
    this.inventorySrv.getMaterialtByComponentN(this.barcode.materialNumber).subscribe(data => {
      if (data) {
        this.barcode.materialName = data[0].componentName
      }
    })

    this.inventorySrv.getMaterialArrivalByNumber(this.barcode.materialNumber).subscribe(data => {
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



}
