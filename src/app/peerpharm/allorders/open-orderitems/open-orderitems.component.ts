import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { BatchesService } from "src/app/services/batches.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { ItemsService } from "src/app/services/items.service";
import { CreamBarrelService } from "src/app/services/cream-barrel.service";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-open-orderitems",
  templateUrl: "./open-orderitems.component.html",
  styleUrls: ["./open-orderitems.component.scss"],
})
export class OpenOrderitemsComponent implements OnInit {
  allOpenOrderItems: any[] = [];
  filteredOpenOrderItems: any[] = [];
  sortToggle: number = 1;
  orderItemsLoader: boolean = false;

  @ViewChild("orderItmeFilter") orderItemFilter: ElementRef;

  constructor(
    private itemService: ItemsService,
    private authService: AuthService,
    private batchService: BatchesService,
    private toastSrv: ToastrService,
    private creamBarrelService: CreamBarrelService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.getAllOpenOrders();
  }

  getAllOpenOrders() {
    this.orderItemsLoader = true;
    this.creamBarrelService.getOpenOrderItemsAndBarrels().subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
      } else if (data) {
        this.allOpenOrderItems = data;
        this.filteredOpenOrderItems = this.allOpenOrderItems;
      } else {
        this.toastSrv.error("לא נמצאו נתונים במערכת");
      }
      this.orderItemsLoader = false;
    });
  }

  //sort by the second level of the array (nested array)
  sortItemsOne(field) {
    let i = this.sortToggle;
    this.filteredOpenOrderItems.sort((a, b) => {
      return a[field] > b[field] ? i : a[field] < b[field] ? -i : 0;
    });
    this.sortToggle *= -1;
  }

  filterOrderItems() {
    let value = this.orderItemFilter.nativeElement.value;
    console.log(value);
    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearOrderItems();
    } else {
      this.filteredOpenOrderItems = this.filteredOpenOrderItems.filter((o) =>
        Object.entries(o).some((entry) =>
          String(entry[1]).toLowerCase().includes(value)
        )
      );
    }
  }

  clearOrderItems() {
    this.orderItemFilter.nativeElement.value = "";
    this.filteredOpenOrderItems = this.allOpenOrderItems;
  }

  withBarrels() {
    this.filteredOpenOrderItems = this.filteredOpenOrderItems.filter(
      (oi) => oi.relevantBarrels.length > 0
    );
  }

  withoutBarrels() {
    this.filteredOpenOrderItems = this.filteredOpenOrderItems.filter(
      (oi) => !oi.relevantBarrels || oi.relevantBarrels.length == 0
    );
  }

  exportAsXLSX() {
    let orders = [];
    console.log("orders: ", this.allOpenOrderItems);
    for (let order of this.allOpenOrderItems) {
      if (order.relevantBarrels.length > 0) {
        for (let barrel of order.relevantBarrels) {
          orders.push({
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
            חבית: barrel.barrelNumber,
            "מיועד להזמנה": barrel.orderlNumber,
            "סטטוס חבית": barrel.barrelStatus,
            "משקל חבית": barrel.barrelWeight,
            "תאריך ייצור": barrel.productionDate,
            "תאריך תפוגה": barrel.expirationDate,
            pH: barrel.ph,
          });
        }
      } else {
        orders.push({
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
          חבית: null,
          "מיועד להזמנה": null,
          "סטטוס חבית": null,
          "משקל חבית": null,
          "תאריך ייצור": null,
          "תאריך תפוגה": null,
          pH: null,
        });
      }
    }
    this.excelService.exportAsExcelFile(
      orders,
      `Open Order Items Report ${new Date().toString().slice(0, 10)}`
    );
  }
}
