import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { ExcelService } from "src/app/services/excel.service";
import { FormulesService } from "src/app/services/formules.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ProductionService } from "src/app/services/production.service";
import { ProductionFormule, WorkPlan } from "../WorkPlan";
import { ConfirmService } from "../../../../services/confirm.modal.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-planning-details",
  templateUrl: "./planning-details.component.html",
  styleUrls: ["./planning-details.component.scss"],
})
export class PlanningDetailsComponent implements OnInit {
  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   event.stopPropagation()
  //   if(this.tableDiv.nativeElement.contains(event.target)) {

  //   } else {
  //     this.edit = -1
  //   }
  // }
  @Input() workPlan: WorkPlan;
  @Output() closeWorkPlanEmitter: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() updateWorkPlans: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("editWeight") editWeightDiv: ElementRef;
  @ViewChild("printFormuleBtn") printFormuleBtn: ElementRef;
  @ViewChild("formuleSection") formuleSection: ElementRef;
  @ViewChild("printAmounts") printAmounts: ElementRef;
  @ViewChild("tableDiv") tableDiv: ElementRef;

  // finalFormule: any;
  statuses: number[] = [1, 2, 3];
  materialsForFormules: Array<any>;
  edit: number = -1;
  authorized: boolean = false;
  loadData: boolean;
  showMaterialsForFormules: boolean = false;
  printingFormules: boolean = false;
  formulePrinting: any;
  statusTest: number = 1
  notAndrey: boolean = true
  editDueDate: number = -1

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private productionService: ProductionService,
    private excelService: ExcelService,
    private formuleService: FormulesService,
    private inventoryService: InventoryService,
    private modalService: ConfirmService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.authorized = this.authService.loggedInUser.authorization.includes(
      "creamProductionManager"
    );
  }

  authenticate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // resolve(true)
      this.modalService.userAnserEventEmitter.subscribe((userChoice) => {
        if (userChoice) resolve(userChoice);
        else reject(false);
      });
      this.modalService.confirm({ title: "title", message: "message" });
      // resolve(true);
    });
  }

  closeWorkPlan(i: number) {
    this.closeWorkPlanEmitter.emit(i);
  }

  checkAllItems(event) {
    for (let oi of this.workPlan.orderItems) oi.checked = event.target.checked
  }

  checkAllFormules(event) {
    for (let oi of this.workPlan.productionFormules) oi.checked = event.target.checked
  }

  createPAKA() {
    let orderItemsChecked = this.workPlan.orderItems.filter(oi => oi.checked == true)

    for (let element of orderItemsChecked) {
      if (element.formule.parentNumber) element.parentFormule = element.formule.parentNumber
      else element.parentFormule = element.formule.formuleNumber
      let allreadyExist = this.workPlan.productionFormules.findIndex(pf => pf.formule == element.parentFormule)
      if (allreadyExist != -1) {
        this.workPlan.productionFormules[allreadyExist].totalKG += element.totalKG
        this.workPlan.productionFormules[allreadyExist].enoughMaterials = !this.workPlan.productionFormules[allreadyExist].enoughMaterials || element.enoughMaterials === false ? false : true
        this.workPlan.productionFormules[allreadyExist].ordersAndItems.push({
          order: element.orderNumber,
          item: element.itemNumber
        })
      }
      else this.workPlan.productionFormules.push({
        ordersAndItems: [{
          order: element.orderNumber,
          item: element.itemNumber
        }],
        status: element.status,
        formuleData: element.formule,
        formule: element.parentFormule,
        totalKG: element.totalKG,
        enoughMaterials: element.enoughMaterials,
        batchNumber: '',
      })
    }

    this.saveChanges()
    .then((succesMessage) => this.toastr.success(succesMessage))
    .catch((errorMessage) => this.toastr.error(errorMessage));

  }

  // setStatus(event) {
  //   let currentStatus = this.workPlan.status;
  //   if (confirm("האם אתה בטוח שברצונך לשנות סטטוס?")) {
  //     this.workPlan.status = event.target.value;

  //     this.saveChanges()
  //     .then((succesMessage) => this.toastr.success(succesMessage, 'פורמולות מאושרות'))
  //     .catch((errorMessage) => this.toastr.error(errorMessage));

  //     this.saveChanges()
  //       .then((success) => {
  //         this.toastr.success("סטטוס עודכן בהצלחה");
  //       })
  //       .catch((error) => {
  //         this.toastr.error(error);
  //         this.workPlan.status = currentStatus;
  //       });
  //   }
  // }

  scheduleBatch(i) {
    this.workPlan.productionFormules[i].status = 4
    this.saveChanges()
      .then(succesMessage => {
        this.toastr.success(succesMessage)
        this.editDueDate = -1  
      })
      .catch(errorMessage => this.toastr.error(errorMessage))
  }

  // changeStatus(i) {
  //   this.workPlan.orderItems[i].status = 3
  //   this.saveChanges()
  //   .then(succesMessage => this.toastr.success(succesMessage))
  //   .catch(errorMessage => this.toastr.error(errorMessage))
  // }

  saveChanges(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.productionService.editWorkPlan(this.workPlan).subscribe((data) => {
        if (data.status) {
          this.edit = -1;
          this.workPlan = data;
          this.updateWorkPlans.emit();
          resolve("הפרטים נשמרו בהצלחה");
        } else if (data.error) {
          reject(data.error);
        }
      });
    });
  }

  deleteLine(i: number) {
    if (confirm("השורה תימחק והכמויות יחושבו מחדש. האם אתה בטוח?")) {
      this.workPlan.orderItems.splice(i, 1);
      this.saveChanges()
        .then((succesMessage) => this.toastr.success(succesMessage, 'השורה נמחקה בהצלחה'))
        .catch((errorMessage) => this.toastr.error(errorMessage));
    } else this.toastr.warning("לא בוצעו שינויים");
  }

  deleteWorkPlan() {
    if (confirm('למחוק פק"ע???')) {
      this.productionService
        .deleteWorkPlan(this.workPlan.serialNumber)
        .subscribe((data) => {
          this.updateWorkPlans.emit();
          this.closeWorkPlanEmitter.emit(-1);
          console.log(data);
        });
    }
  }

  setColor(status) {
    switch (status) {
      case 1: return "#FFC000";
      case 2: return "#68e37d";
      case 3: return "#5B9BD5";
      case 3: return "#ED7D31";
      case 3: return "#C48170";
    }
  }

  export(data, title) {
    this.excelService.exportAsExcelFile(data, title);
  }

  exportExplosion(data, title) {
    let excel = [];
    data.map((i) => {
      excel.push({
        'מק"ט': i.itemNumber,
        "שם החומר": i.itemName,
        "כמות נדרשת": i.kgProduction,
        "כמות במלאי": i.materialArrivals[0].amount,
      });
    });
    this.excelService.exportAsExcelFile(excel, title);
  }

  toast(title, msg) {
    this.toastr.info(msg, title);
  }

  weightFormules() {
    console.log(this.workPlan.productionFormules);
    this.router.navigate(["/peerpharm/formules/weight-production"], {
      queryParams: {
        formuleNumbers: this.workPlan.productionFormules.filter(f => f.checked).map(f => f.formule),
        workPlanId: this.workPlan.serialNumber
      },
    });
  }

  async approveFormules() {
    if (confirm('האם אתה מאשר את כל הפורמולות?')) {
      this.workPlan.productionFormules.map(f => f.status = 3)
      this.saveChanges()
      .then((succesMessage) => this.toastr.success(succesMessage, 'פורמולות מאושרות'))
      .catch((errorMessage) => this.toastr.error(errorMessage));
      let approved = await this.authenticate();
      if (approved) {
        let amountsLoaded = await this.loadMaterialsForFormule(true);
        let formulesPrinted = await this.printFormules();
      } else this.toastr.error("אימות נכשל");
    } else this.toastr.error("בוטל");
  }

  async printFormules() {
    for (let formule of this.workPlan.productionFormules) {
      formule.formuleData = this.formuleCalculate(
        formule.formuleData,
        formule.totalKG
      );
    }

    this.printingFormules = true;
    setTimeout(() => {
      this.printFormuleBtn.nativeElement.click();
      setTimeout(() => {
        this.printingFormules = false;
        this.showMaterialsForFormules = false;
      }, 1000);
    }, 1000);
  }

  formuleCalculate(data, formuleWeight) {
    data.phases.forEach((phase) => {
      phase.items.forEach((item) => {
        item.kgProd = Number(formuleWeight) * (Number(item.percentage) / 100);
      });
    });
    return data;
  }

  async loadMaterialsForFormule(authenticated) {
    if (!authenticated) authenticated = await this.authenticate();
    if (authenticated) {
      return new Promise((resolve, reject) => {
        if (this.materialsForFormules && this.materialsForFormules.length > 0) {
          this.showMaterialsForFormules = true;
          resolve(true);
        } else {
          this.toastr.info("אנא המתן...", "מחשב כמויות");
          this.loadData = true;
          this.inventoryService
            .getMaterialsForFormules(this.workPlan.orderItems)
            .subscribe((data) => {
              this.materialsForFormules = data.newArray;
              this.showMaterialsForFormules = true;
              this.loadData = false;
              resolve(true);
            });
        }
      });
    } else this.toastr.error("אימות נכשל");
  }

  checkAmountsForMaterial(prod, stock) {
    return Number(stock) - Number(prod);
  }
}
