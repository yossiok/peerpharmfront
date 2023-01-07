import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { InventoryService } from "src/app/services/inventory.service";
import { ToastrService } from "ngx-toastr";
import { FormulesService } from "src/app/services/formules.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ItemsService } from "src/app/services/items.service";
import * as _ from "lodash";
import { fromEventPattern } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkPlan } from "../planning/WorkPlan";
import { ProductionService } from "src/app/services/production.service";
import { Location } from "@angular/common";
import { AuthService } from "src/app/services/auth.service";
import { getWeightProductionWizardColumns } from "../../reports/utils/grid";
import { ItemDetailsTabComponent } from "../../items/item-details-tab/item-details-tab.component";
import { ColDef } from "ag-grid-community";
import { CustomClickRendererComponent } from "src/app/shared/grid-component/custom-click-renderer.component";
import { WeightProductionStepRendererComponent } from "src/app/shared/grid-component/weight-production-step-renderer/weight-production-step-renderer.component";

interface FormuleWeight {
  formuleNumber: any;
  formuleWeight: any;
  formuleOrder: any;
  formuleUnitWeight: any;
  data: any;
  gridData: any;
}

@Component({
  selector: "app-weight-production-wizard",
  templateUrl: "./weight-production-wizard.component.html",
  styleUrls: ["./weight-production-wizard.component.scss"],
})
export class WeightProductionWizardComponent  implements OnInit {
  @ViewChild("printFormuleBtn") printFormuleBtn: ElementRef;
  @ViewChild("printBOMBtn") printBOMBtn: ElementRef;
  @ViewChild("reduceMaterialAmount") reduceMaterialAmount: ElementRef;
  @ViewChild("formuleNumberElement") formuleNumberElement: ElementRef;
  @ViewChild("formuleNumber") formuleNumber: ElementRef;
  @ViewChild("formuleWeight") formuleWeight: ElementRef;
  @ViewChild("orderNumber") orderNumber: ElementRef;
  @ViewChild("bomModal") bomModal: ElementRef;

  formules: FormuleWeight[] = [];

  finalFormule: FormuleWeight;
  allMaterialArrivals: any[];
  materialShelfs: any[] = [];
  shelfPosition: any;
  kgToRemove: any;
  shelfNumber: any;
  earlierExpiries: any = [];
  finalWeight: number = 0;
  formuleExist: boolean = true;
  materialArrivals: Boolean = false;
  printStickerBtn: Boolean = false;
  edit: boolean = false;
  showPill: boolean = true;
  importedFormule: any;
  workPlan: WorkPlan;
  workPlanId: number;
  showBOM: boolean = false;
  billOfMaterials: any[] = [];
  openModal: boolean = false;
  user: string;

  barcode = {
    materialId: "",
    materialNumber: "",
    materialName: "",
    weight: "",
    formuleNumber: "",
  };
  materialName: any;
  materialNumber: any;

  columnDefs = getWeightProductionWizardColumns();
  rowData = [];
  groupDefaultExpanded = 0;
  defaultColDef: ColDef = {
    flex: 1,
    sortable: false,
  };
  gridOptions = {
    enableFilter: true,
    enableSorting: true,
    frameworkComponents: {
      customClick: CustomClickRendererComponent,
      wizardStep: WeightProductionStepRendererComponent,
    }
  }


  @HostListener("document:keydown", ["$event"]) handleKeyboardEvent(
    event: KeyboardEvent
  ): void {
    if (
      this.formules.length == 1 &&
      this.formules[0].data.phases &&
      event.key === "Enter" &&
      this.formuleNumber.nativeElement.value == ""
    ) {
      this.chooseFormule(this.formules[0]);
    }

    if (event.key === "F2") this.newProcess();
    if (event.key === "F4") this.compareFormules();
    if (event.key === "F10") this.printFormule();
  }

  constructor(
    private formuleSrv: FormulesService,
    private inventorySrv: InventoryService,
    private toastSrv: ToastrService,
    private modalService: NgbModal,
    private itemService: ItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private productionService: ProductionService,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(this.authService.loggedInUser);
    this.user = this.authService.loggedInUser.userName;
    setTimeout(() => {
      this.formuleNumber.nativeElement.focus();
    }, 500);
    this.importedFormule = this.route.queryParamMap.subscribe((params) => {
      console.log("params: ", params);
      let workPlanId = params["params"].workPlanId || null;
      let formuleNumbers = params["params"].formuleNumbers || null;

      if (workPlanId && formuleNumbers) {
        this.workPlanId = workPlanId;
        this.displayFormules(workPlanId, formuleNumbers);
      }
    });
  }
  ngOnDestroy() {
    this.importedFormule.unsubscribe();
  }

  backToWP() {
    this.router.navigate(["/peerpharm/production/planning"], {
      queryParams: {
        workPlanId: this.workPlanId,
      },
    });
  }

  deleteFormule(i) {
    console.log(i);
    if (confirm("להסיר פורמולה?")) {
      this.formules.splice(i, 1);
      this.finalWeight = 0;
      for (let formule of this.formules) {
        this.finalWeight += Number(formule.formuleWeight);
      }
      this.newCompareFormules();
    }
  }

  newProcess() {
    this.showPill = true;
    this.formules = [];
    this.finalFormule = null;
    this.finalWeight = 0;
    this.formuleNumber.nativeElement.value = "";
    this.orderNumber.nativeElement.value = "";
    this.formuleWeight.nativeElement.value = "";
    setTimeout(() => this.formuleNumber.nativeElement.focus(), 500);
  }

  checkFormule(e) {
    console.log(e.target.value);
    this.formuleSrv.getFormuleByNumber(e.target.value).subscribe((data) => {
      console.log(data);
      if (data) {
        if (data.msg) {
          console.log(data);
          this.toastSrv.error(`Formule Number ${e.target.value} Not Found!`);
          this.formuleExist = false;
        } else if (data) {
          console.log(data);
          this.formuleExist = true;
        }
      } else {
        this.toastSrv.error(`Formule Number ${e.target.value} Not Found!`);
        console.log("this formula doesn't exist");
        this.formuleExist = false;
      }
    });
  }

  go() {
    if (
      this.formuleNumber.nativeElement.value != "" &&
      this.formuleWeight.nativeElement.value != ""
    ) {
      this.itemService
        .getItemData(this.formuleNumber.nativeElement.value)
        .subscribe((itemData) => {
          console.log(itemData);
          if (itemData.length != 0) {
            if (itemData.msg) {
              this.toastSrv.error(itemData.msg);
              this.formuleNumber.nativeElement.focus();
              return;
            } else {
              this.addFormuleWeight(itemData);
            }
          } else {
            this.toastSrv.error(
              "Item number not found, check if there is an item defined for this formule."
            );
            this.formuleNumber.nativeElement.focus();
            return;
          }
        });
    } else {
      this.toastSrv.error("Please fill all fields");
      this.formuleWeight.nativeElement.focus();
    }
  }

  displayFormules(workPlanId, formuleNumbers) {
    this.productionService.getWorkPlan(workPlanId).subscribe((data) => {
      if (data.msg) {
        this.toastSrv.error(data.msg);
        return;
      } else if (data) {
        this.finalWeight = 0;
        for (let orderItem of data.orderItems) {
          let exist = formuleNumbers.find((f) => f == orderItem.itemNumber);
          if (exist) {
            let formuleWeight: FormuleWeight = {
              formuleNumber: orderItem.itemNumber,
              formuleWeight: orderItem.totalKG,
              formuleOrder: orderItem.orderNumber,
              formuleUnitWeight: orderItem.netWeightGr,
              data: orderItem.formule,
              gridData: []
            };
            this.finalWeight += Number(formuleWeight.formuleWeight);
            this.formules.push({...formuleWeight, gridData: this.getPhasesData(formuleWeight.data.phases)});
          }
        }
      } else {
        this.toastSrv.error("Workplan was not found.", "Try again");
        return;
      }
    });
  }

  addFormuleWeight(itemData) {
    console.log(itemData);
    let formuleWeight: FormuleWeight = {
      formuleNumber: itemData[0].itemNumber,
      formuleWeight: this.formuleWeight.nativeElement.value,
      formuleOrder: this.orderNumber.nativeElement.value,
      formuleUnitWeight: itemData[0].netWeightK,
      // formuleUnitWeight: itemData[0] ? itemData[0].netWeightK : 0,
      data: {},
      gridData: []
    };
    this.formuleSrv
      .getFormuleByNumber(formuleWeight.formuleNumber)
      .subscribe((data) => {
        if (data == null) {
          this.toastSrv.error(
            `Formule Number ${formuleWeight.formuleNumber} Not Found!`
          );
          return;
        } else if (data.msg) {
          this.toastSrv.error(data.msg);
          return;
        } else {
          formuleWeight.data = this.formuleCalculate(
            data,
            formuleWeight.formuleWeight
          );
          this.finalWeight += Number(formuleWeight.formuleWeight);

          this.formules.push({...formuleWeight, gridData: this.getPhasesData(formuleWeight.data.phases)});
        }
        this.formuleNumber.nativeElement.value = "";
        this.formuleWeight.nativeElement.value = "";
        this.formuleNumber.nativeElement.value = "";
        this.formuleNumber.nativeElement.focus();
      });
  }

  formuleCalculate(data, formuleWeight) {
    data.phases.forEach((phase) => {
      phase.items.forEach((item) => {
        item.kgProd = Number(formuleWeight) * (Number(item.percentage) / 100);
      });
    });
    return data;
  }

  newCompareFormules() {
    let identical = true;

    for (let formule = 0; formule < this.formules.length - 1; formule++) {
      if (this.formules[formule].data.phases.length == 0) {
        this.toastSrv.error(
          "לא קיימות פאזות באחת או יותר מהפורמולות...",
          "חסר מידע!"
        );
        return;
      }
      for (
        let phase = 0;
        phase < this.formules[formule].data.phases.length;
        phase++
      ) {
        for (
          let item = 0;
          item < this.formules[formule].data.phases[phase].items.length;
          item++
        ) {
          let currentItem =
            this.formules[formule].data.phases[phase].items[item];
          let itemsToCompare =
            this.formules[formule + 1].data.phases[phase].items;
          let index = itemsToCompare.findIndex(
            (item) => item.itemNumber == currentItem.itemNumber
          );
          if (index == -1) {
            identical = false;
            this.formules[formule].data.phases[phase].items[item].color =
              "orange";
          } else if (
            Number(currentItem.percentage) !=
            Number(itemsToCompare[index].percentage)
          ) {
            identical = false;
            currentItem.color = "orange";
            itemsToCompare[index].color = "orange";
          } else {
            currentItem.color = "lightgreen";
            itemsToCompare[index].color = "lightgreen";
          }
        }
      }
    }

    if (identical == true) {
      this.toastSrv.success("The formules are identical.", "Twin Formules!");
    }
  }

  compareFormules() {
    for (let i = 0; i < this.formules.length - 1; i++) {
      if (
        _.isEqual(
          this.formules[i].data.phases,
          this.formules[i + 1].data.phases
        )
      ) {
        // this.finalFormule = this.formules[i];
        this.toastSrv.success("Twin Formules!", "The formules are identical");
        return;
      } else {
        for (let j = 0; j < this.formules[i].data.phases.length; j++) {
          for (
            let k = 0;
            k < this.formules[i].data.phases[j].items.length;
            k++
          ) {
            if (
              Number(this.formules[i].data.phases[j].items[k].percentage) !=
              Number(this.formules[i + 1].data.phases[j].items[k].percentage)
            ) {
              this.formules[i].data.phases[j].items[k].color = "orange";
              this.formules[i + 1].data.phases[j].items[k].color = "orange";
            }
          }
        }
      }
    }
  }

  chooseFormule(formule) {
    let formuleNumbers = this.formules.map((f) => f.formuleNumber);
    // this.productionService.setItemsSttatusTo3(this.workPlanId, formuleNumbers)
    this.showPill = false;
    this.finalFormule = { ...formule };
    this.finalFormule.data = this.formuleCalculate(
      this.finalFormule.data,
      this.finalWeight
    );
    if (this.workPlanId) {
      this.productionService
        .joinFormules(this.workPlanId, formuleNumbers, this.finalFormule)
        .subscribe((data) => {
          this.inventorySrv.getBOM(this.finalFormule.data).subscribe((data) => {
            console.log(data);
            this.billOfMaterials = data;
            this.showBOM = true;
          });
        });
    } else {
      this.inventorySrv.getBOM(this.finalFormule.data).subscribe((data) => {
        console.log(data);
        this.billOfMaterials = data;
        this.showBOM = true;
      });
    }
  }

  openBillOfMaterials() {
    this.modalService.open(this.bomModal);
  }

  checkAmountsForMaterial(prod, stock) {
    return Number(stock) - Number(prod);
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
    this.inventorySrv
      .checkExpirationsForMaterial(materialNumber, materialArrivalReqNum)
      .subscribe((response) => {
        switch (response.msg) {
          case "Scanned wrong line. Try again.":
            this.toastSrv.error(response.msg);
            break;
          case "Earlier Expiries Exist":
            this.materialShelfs = response.itemShelfs;
            break;
          case "No Earlier Expiries":
            this.openReduceMaterialModal(
              materialName,
              materialNumber,
              response.shelfPosition,
              kgProd
            );
        }
      });
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
    this.materialName = materialName;
    this.materialNumber = materialNumber;
    this.shelfPosition = shelfPosition;
    this.kgToRemove = kgProd;
    this.modalService.open(this.reduceMaterialAmount);
  }

  getMaterialByNumber() {
    this.inventorySrv
      .getMaterialtByComponentN(this.barcode.materialNumber)
      .subscribe((data) => {
        if (data) {
          this.barcode.materialName = data[0].componentName;
        }
      });

    this.inventorySrv
      .getMaterialArrivalByNumber(this.barcode.materialNumber)
      .subscribe((data) => {
        if (data) {
          this.allMaterialArrivals = data.reverse();
          this.materialArrivals = true;
        } else {
          this.toastSrv.error("No Material Arrivals");
        }
      });
  }

  checkIfIdExist(event) {
    var materialId = event.target.value;
    var materialArrival = this.allMaterialArrivals.find(
      (a) => a._id == materialId
    );
    if (materialArrival) {
      this.toastSrv.success("You can now print the sticker");
      this.printStickerBtn = true;
    } else {
      this.barcode.materialId = "";
      this.toastSrv.error("Wrong Material");
    }
  }

  printBarcode() {
    this.printStickerBtn = false;
    this.materialArrivals = false;
    this.barcode = {
      materialId: "",
      materialNumber: "",
      materialName: "",
      weight: "",
      formuleNumber: "",
    };
  }

  materialMrpReport() {
    console.log("MRP Report");
    this.inventorySrv.getMaterialMrpReport().subscribe((data) => {
      console.log(data);
    });
  }

  getPhasesData = (phases) => {
    const data =  [];
    phases.forEach(
      phase => phase.items.forEach((item, index) => {
        data.push({phaseName: phase.phaseName, phaseRowIndex: index, ...item})

      })
    )
    return data;
  }

}
