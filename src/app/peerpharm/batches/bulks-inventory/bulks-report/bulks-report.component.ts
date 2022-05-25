import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { BatchesService } from "src/app/services/batches.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { ItemsService } from "src/app/services/items.service";
import { CreamBarrelService } from "src/app/services/cream-barrel.service";
import { ExcelService } from "src/app/services/excel.service";
import { FormulesService } from "src/app/services/formules.service";

@Component({
  selector: "app-bulks-report",
  templateUrl: "./bulks-report.component.html",
  styleUrls: ["./bulks-report.component.scss"],
})
export class BulksReportComponent implements OnInit {
  @Input("allWarehouses") allWarehouses: any[];

  allBarrels: any[] = [];
  filteredBarrelsList: any[];
  barrelsLoader: boolean = false;

  @ViewChild("barrelFilter") barrelFilter: ElementRef;
  @ViewChild("barrelFilterTwo") barrelFilterTwo: ElementRef;
  constructor(
    private itemService: ItemsService,
    private authService: AuthService,
    private batchService: BatchesService,
    private toastSrv: ToastrService,
    private creamBarrelService: CreamBarrelService,
    private excelService: ExcelService,
    private formuleService: FormulesService
  ) {}

  ngOnInit(): void {
    this.getAllBarrels();
  }

  getAllBarrels() {
    this.barrelsLoader = true;
    this.creamBarrelService.getBarrelsAndOrderItems().subscribe((data) => {
      console.log(data);
      if (data) {
        this.allBarrels = data;
        for (let barrel of this.allBarrels) {
          let order = barrel.relevantOrders.find(
            (o) => o.batchUsed == barrel.batchNumber
          );
          barrel.orderNumber = order ? order.orderNumber : barrel.orderNumber;
        }
        this.filteredBarrelsList = this.allBarrels;
        console.log(this.filteredBarrelsList);
        this.barrelsLoader = false;
      }
    });
  }
  filterBarrels(e) {
    console.log(e.target.value);
    let value = e.target.value;
    console.log(value);
    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearBarrelsList();
    } else {
      // let array = [...this.filteredOrderItems];
      // let arrayCopy = [...this.filteredOrderItems];
      this.filteredBarrelsList = this.filteredBarrelsList.filter((b) =>
        Object.entries(b).some((entry) =>
          String(entry[1]).toLowerCase().includes(value)
        )
      );
    }
  }
  filterBarrelsTwo(e) {
    let value = String(e.value).toLowerCase().trim();
    if (value == "") {
      this.clearBarrelsList();
    } else {
      this.formuleService.getFormuleByNumber(value).subscribe((data) => {
        console.log(data);
        let parentFormule = data.parentNumber ? data.parentNumber : value;
        console.log(parentFormule);

        this.filteredBarrelsList = this.filteredBarrelsList.filter((ba) => {
          ba.parentFormule;
          return ba.parentFormule == parentFormule;
        });
        console.log(this.filteredBarrelsList);
      });
    }
  }

  clearBarrelsList() {
    this.barrelFilter.nativeElement.value = "";
    this.filteredBarrelsList = this.allBarrels;
  }
  clearBarrelsListTwo() {
    this.barrelFilterTwo.nativeElement.value = "";
    this.filteredBarrelsList = this.allBarrels;
  }
  filterOrders() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return b.relevantOrders.length > 0;
    });
  }
  getReturned() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return b.barrelStatus == "returned";
    });
  }

  hasOrder() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return b.orderNumber;
    });
  }
  noOrder() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return !b.orderNumber;
    });
  }
  exportAsXLSX() {
    let barrels = [];
    console.log("barrels: ", this.allBarrels);
    for (let barrel of this.allBarrels) {
      if (barrel.relevantOrders.length > 0) {
        for (let order of barrel.relevantOrders) {
          barrels.push({
            חבית: barrel.barrelNumber,
            "מיועד להזמנה": barrel.orderlNumber,
            "סטטוס חבית": barrel.barrelStatus,
            "משקל חבית": barrel.barrelWeight,
            "תאריך ייצור": barrel.productionDate,
            "תאריך תפוגה": barrel.expirationDate,
            pH: barrel.ph,
            "מספר הזמנה": order.orderNumber,
            "שם הלקוח": order.customerName,
            "מקט פריט": order.itemNumber,
            פורמולה: order.formuleNumber,
            "פורמולת אב": order.parentFormule,
            "סוג הפורמולה": order.formuleType,
            "תאריך הזמנה": order.orderDate,
            "תאריך אספקה (משוער)": order.orderDeliveryDate,
            "משקל פריט": order.netWeightGr,
            "כמות מוזמנת": order.qtyOrdered,
            "כמות שיוצרה": order.quantityProduced,
            "סטטוס ייצור": order.oiStatus,
            "סטטוס שורה": order.orderItemStatus,
          });
        }
      } else {
        barrels.push({
          חבית: barrel.barrelNumber,
          "מיועד להזמנה": barrel.orderlNumber,
          "סטטוס חבית": barrel.barrelStatus,
          "משקל חבית": barrel.barrelWeight,
          "תאריך ייצור": barrel.productionDate,
          "תאריך תפוגה": barrel.expirationDate,
          pH: barrel.ph,
          "פורמולת אב": barrel.parentFormule,
        });
      }
    }

    this.excelService.exportAsExcelFile(
      barrels,
      `Barels Stock Report ${new Date().toString().slice(0, 10)}`
    );
  }
}
