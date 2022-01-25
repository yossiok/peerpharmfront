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
import { OrderItem, ProductionFormule, WorkPlan } from "../WorkPlan";
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
  editF: number = -1;
  authorized: boolean = false;
  loadData: boolean;
  showMaterialsForFormules: boolean = false;
  printingFormules: boolean = false;
  formulePrinting: any;
  statusTest: number = 1;
  notAndrey: boolean = true;
  editDueDate: number = -1;
  checkedFormules: ProductionFormule[];
  andreyisalazyworkersowehavetoworkharderfrohim: number[] = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    ,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private productionService: ProductionService,
    private excelService: ExcelService,
    private formuleService: FormulesService,
    private inventoryService: InventoryService,
    private modalService: ConfirmService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.authorized = this.authService.loggedInUser.authorization.includes(
      "creamProductionManager"
    );
    this.notAndrey =
      !this.authService.loggedInUser.authorization.includes("andrey");
    this.workPlan.orderItems.sort(
      (a, b) => <any>a.parentFormule - <any>b.parentFormule
    );
  }

  checkItemsFormules() {
    let allItemsHaveFormules = this.workPlan.orderItems.find(
      (oi) => !oi.hasFormule
    );
    return allItemsHaveFormules;
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
    for (let oi of this.workPlan.orderItems) oi.checked = event.target.checked;
  }

  checkAllFormules(event) {
    for (let oi of this.workPlan.productionFormules)
      oi.checked = event.target.checked;
  }

  checkForItemsInFormule(formule: ProductionFormule, orderItem: OrderItem) {
    return formule.ordersAndItems.find(
      (oi) =>
        oi.itemNumber == orderItem.itemNumber &&
        oi.orderNumber == oi.orderNumber
    );
  }

  // create formules from items
  createPAKA() {
    if (
      confirm(
        "ברגע שתיצור פורמולות שינויים במשקלי הפריטים לא ישפיעו יותר. להמשיך?"
      )
    ) {
      let orderItemsChecked = this.workPlan.orderItems.filter(
        (oi) => oi.checked == true
      );

      for (let element of orderItemsChecked) {
        if (element.formule.parentNumber)
          element.parentFormule = element.formule.parentNumber;
        else element.parentFormule = element.formule.formuleNumber;
        let allreadyExist = this.workPlan.productionFormules.findIndex(
          (pf) => pf.formule == element.parentFormule
        );
        if (allreadyExist != -1) {
          this.workPlan.productionFormules[allreadyExist].totalKG +=
            element.totalKG;
          this.workPlan.productionFormules[allreadyExist].enoughMaterials =
            !this.workPlan.productionFormules[allreadyExist].enoughMaterials ||
            element.enoughMaterials === false
              ? false
              : true;
          this.workPlan.productionFormules[allreadyExist].ordersAndItems.push({
            orderNumber: element.orderNumber,
            itemNumber: element.itemNumber,
            itemName: element.description,
            weightKg: element.totalKG,
          });
          element.hasFormule = true;
        } else
          this.workPlan.productionFormules.push({
            ordersAndItems: [
              {
                orderNumber: element.orderNumber,
                itemNumber: element.itemNumber,
                itemName: element.description,
                weightKg: element.totalKG,
              },
            ],
            status: element.status,
            formuleData: element.formule,
            formule: element.parentFormule,
            totalKG: element.totalKG,
            enoughMaterials: element.enoughMaterials,
            batchNumber: "",
          });
        element.hasFormule = true;
      }

      this.saveChanges()
        .then((succesMessage) => this.toastr.success(succesMessage))
        .catch((errorMessage) => this.toastr.error(errorMessage));
    }
  }

  scheduleBatch(i, event) {
    let date = new Date();
    date.setDate(date.getDate() + Number(event.target.value));
    this.workPlan.productionFormules[i].dueDate = date;
    this.workPlan.productionFormules[i].status = 4;
    this.saveChanges()
      .then((succesMessage) => {
        this.toastr.success(succesMessage);
        this.editDueDate = -1;
      })
      .catch((errorMessage) => this.toastr.error(errorMessage));
  }

  addBatch(formule) {
    this.router.navigate(["/peerpharm/batches/newBatch"], {
      queryParams: {
        formule: formule.formule,
        workPlanId: this.workPlan.serialNumber,
      },
    });
  }

  WorkPlanDone() {
    if (confirm('התכנית וכל הפריטים שבה יעברו למצב "Done". להמשיך?')) {
      this.workPlan.status = 7;
      this.saveChanges()
        .then((succesMessage) => {
          this.toastr.success(succesMessage);
        })
        .catch((errorMessage) => this.toastr.error(errorMessage));
    }
  }

  saveChanges(oderItemToDelete?): Promise<string> {
    return new Promise((resolve, reject) => {
      this.productionService
        .editWorkPlan(this.workPlan, oderItemToDelete)
        .subscribe((data) => {
          if (data.status) {
            this.edit = -1;
            this.editF = -1;
            this.workPlan = data;
            this.updateWorkPlans.emit();
            if(data.status == -1) {
              this.closeWorkPlan(-1)
              this.toastr.info('פק"ע ריקה מפריטים', 'פק"ע נמחקה.')
            } 
            resolve("הפרטים נשמרו בהצלחה");
          } else if (data.msg) {
            reject(data.msg);
          }
        });
    });
  }

  deleteLine(i: number) {
    let orderITemToDelete = this.workPlan.orderItems[i];
    if (confirm("השורה תימחק. האם אתה בטוח?")) {
      this.workPlan.orderItems.splice(i, 1);
      this.saveChanges(orderITemToDelete)
        .then((succesMessage) => {
          this.toastr.success(succesMessage, "השורה נמחקה בהצלחה");
        })
        .catch((errorMessage) => {
          this.toastr.error(errorMessage);
        });
    } else this.toastr.warning("לא בוצעו שינויים");
  }

  deleteProductionFormules() {
    if (confirm("כל הפורמולות יימחקו ותצטרך ליצור אותן מחדש. להמשיך?")) {
      this.workPlan.productionFormules = [];
      // TODO: update status
      this.workPlan.orderItems.map((oi) => {
        oi.hasFormule = false;
        oi.status = 2;
        return oi;
      });
      this.saveChanges()
        .then((succesMessage) =>
          this.toastr.success(succesMessage, "פורמולות נמחקו")
        )
        .catch((errorMessage) => this.toastr.error(errorMessage));
    }
  }

  cancelWorkPlan() {
    if (confirm(' הפריטים יוחזרו למצב Waiting. האם לבטל פק"ע?')) {
      this.workPlan.status = 8;
      this.workPlan.productionFormules.map((f) => (f.status = 8));
      this.saveChanges()
        .then((succesMessage) =>
          this.toastr.success(succesMessage, 'פק"ע בוטלה, פריטים הוחזרו')
        )
        .catch((errorMessage) => this.toastr.error(errorMessage));
    }
  }

  // deleteWorkPlan() {
  //   if (confirm('למחוק פק"ע???')) {
  //     this.productionService
  //       .deleteWorkPlan(this.workPlan.serialNumber)
  //       .subscribe((data) => {
  //         this.updateWorkPlans.emit();
  //         this.closeWorkPlanEmitter.emit(-1);
  //         console.log(data);
  //       });
  //   }
  // }

  setColor(status) {
    switch (status) {
      case 1:
        return "#FFC000";
      case 2:
        return "#68e37d";
      case 3:
        return "#5B9BD5";
      case 3:
        return "#ED7D31";
      case 3:
        return "#C48170";
    }
  }

  export(data, title) {
    this.excelService.exportAsExcelFile(data, title);
  }

  exportBatches() {
    let excel = [];
    for (let batch of this.workPlan.productionFormules) {
      for (let oai of batch.ordersAndItems) {
        excel.push({
          Formule: batch.formule,
          Order: oai.orderNumber,
          Item: oai.itemNumber,
          "Item Name": oai.itemName,
          "Order KG": oai.weightKg,
          "Batch KG": batch.totalKG,
          'חו"ג קיים?': batch.enoughMaterials,
          Status: batch.status,
          "Due date": batch.dueDate,
          batch: batch.batchNumber,
        });
      }
    }
    this.excelService.exportAsExcelFile(
      excel,
      `PAKA ${this.workPlan.serialNumber} batches`
    );
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
        formuleNumbers: this.workPlan.productionFormules
          .filter((f) => f.checked)
          .map((f) => f.formule),
        workPlanId: this.workPlan.serialNumber,
      },
    });
  }

  async approveFormules() {
    if (confirm("לאשר לייצור?")) {
      // change status
      this.workPlan.productionFormules.map(f => f.status < 3 ? f.status = 3 : f.status = f.status);

      this.saveChanges()
        .then((succesMessage) => {
          this.toastr.success(succesMessage, "פורמולות מאושרות");
          this.authenticate()
            .then(async (approved) => {
              if (approved) {
                let amountsLoaded = await this.loadMaterialsForFormule(true);
                let formulesPrinted = await this.printFormules();
              } else this.toastr.error("אימות נכשל");
            })
            .catch((authFailedMsg) => {
              this.toastr.error("אימות נכשל!");
            });
        })
        .catch((errorMessage) => {
          this.toastr.error(errorMessage);
        });
    }
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
    if (!this.checkedFormules)
      this.checkedFormules = this.workPlan.productionFormules.filter(
        (f) => f.checked
      );
    if (!authenticated) authenticated = await this.authenticate();
    if (authenticated) {
      return new Promise((resolve, reject) => {
        if (this.materialsForFormules && this.materialsForFormules.length > 0) {
          this.showMaterialsForFormules = true;
          resolve(true);
        } else {
          this.toastr.info("אנא המתן...", "מחשב כמויות");
          for (let formule of this.workPlan.productionFormules) {
            formule.formuleData = this.formuleCalculate(
              formule.formuleData,
              formule.totalKG
            );
          }
          this.loadData = true;
          this.inventoryService
            .getBomMulti(this.workPlan.productionFormules)
            .subscribe((data) => {
              this.materialsForFormules = data;
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
