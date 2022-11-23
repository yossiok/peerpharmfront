import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ExcelService } from "src/app/services/excel.service";
import { InventoryService } from "src/app/services/inventory.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-inventory-reports",
  templateUrl: "./inventory-reports.component.html",
  styleUrls: ["./inventory-reports.component.scss"],
})
export class InventoryReportsComponent implements OnInit {
  loader: boolean = false;
  cmptTypes: Array<any>;
  purchaseOrders: Array<any>;
  allWarehouses: any[] = [];
  reportData: any[] = [];
  shelvesList: any[] = [];
  showWareHousesActions: boolean = false;
  user: any = null;
  authorized: boolean = false;

  reportForm = new FormGroup({
    cmptType: new FormControl(""),
    itemType: new FormControl("all", Validators.required),
    componentN: new FormControl(null),
    componentName: new FormControl(null),
    warehouse: new FormControl(""),
    warehouseID: new FormControl("", Validators.required),
    position: new FormControl("all", Validators.required),
    minus: new FormControl(false, Validators.required),
  });

  constructor(
    private inventorySer: InventoryService,
    private excelService: ExcelService,
    private purchaseService: Procurementservice,
    private authSerice: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTypes();
    this.getAllWhs();
    this.getUser();
  }

  getUser() {
    this.user = this.authSerice.loggedInUser;
    this.authorized = this.user.authorization.includes("adminPanel");
  }

  getTypes() {
    this.inventorySer.getAllComponentTypes().subscribe((allTypes) => {
      this.cmptTypes = allTypes;
    });
  }
  getAllWhs() {
    this.inventorySer.getWhareHousesList().subscribe((whs) => {
      this.allWarehouses = whs;
    });
  }
  getShelves() {
    let wh = this.reportForm.controls.warehouse.value;
    if (!wh) {
      alert("יש לבחור  מחסן");
      return;
    } else {
      this.inventorySer.getShelvesByWHName(wh).subscribe((data) => {
        console.log(data);
        this.shelvesList = data;
        this.reportForm.controls.destinationWHID.setValue(data[0].whareHouseId);

        console.log(this.reportForm.value);
      });
    }
  }

  minusReport() {
    this.reportForm.controls.minus.setValue(true);
    this.getInvRep();
    this.reportForm.controls.minus.setValue(false);
  }
  getInvRep() {
    console.log(this.reportForm.value);
    this.reportData = [];
    let sortOrder;
    this.loader = true;
    this.inventorySer.getInvRep(this.reportForm.value).subscribe((data) => {
      this.loader = false;
      console.log(data);
      if (this.reportForm.value.itemType == "product") {
        data.map((item) => {
          item.lastOrderPrice = item.productPrice;
          item.lastOrderShippingPrice = 0;
          item.lastOrderCoin = "ILS";
        });
        // sortOrder = ["_id", "name", "position", "total"];
        this.reportData = data;
      } else {
        this.reportData = data;
      }
    });
  }
  exportToExcel() {
    let exportData = [];

    for (let component of this.reportData) {
      let line = {
        "מק''ט": component.itemNumber,
        "שם הפריט/מוצר": component.itemName,
        "סוג הפריט": component.itemType,
        כמות: component.totalAmount,
        "מחיר אחרון": component.lastOrderPrice,
        "העמסה למחיר אחרון": component.lastOrderShippingPrice,
        "מטבע  מחיר אחרון": component.lastOrderCoin,
        "מחיר ידני": component.manualPrice,
        "מטבע מחיר ידני": component.manualCoin,
        מחסן: this.reportForm.value.warehouse,
        הערות: component.remark,
      };
      exportData.push(line);
    }

    this.excelService.exportAsExcelFile(exportData, "Inventory Report");
  }
}
