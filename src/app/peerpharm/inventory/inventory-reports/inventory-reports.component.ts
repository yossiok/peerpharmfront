import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ExcelService } from "src/app/services/excel.service";
import { InventoryService } from "src/app/services/inventory.service";
import { Procurementservice } from "src/app/services/procurement.service";

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
    private purchaseService: Procurementservice
  ) {}

  ngOnInit(): void {
    this.getTypes();
    this.getAllWhs();
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

  minuseReport() {
    this.reportForm.controls.minus.setValue(true);
    this.getInvRep();
  }
  getInvRep() {
    console.log(this.reportForm.value);
    let sortOrder;
    this.loader = true;
    this.inventorySer.getInvRep(this.reportForm.value).subscribe((data) => {
      this.loader = false;
      console.log(data);
      if (this.reportForm.value.itemType == "product") {
        data.map((item) => {
          item.itemNumber = item._id;
          item.itemName =
            item.name[0] + " " + item.subName[0] + ", " + item.description[0];
          item.totalAmount = item.total;
          item.warehouse = this.reportForm.controls.warehouse.value;
          delete item.name;
          delete item.subName;
          delete item.description;
          delete item._id;
        });
        sortOrder = ["_id", "name", "position", "total"];
      } else if (false) {
        data.map((item) => {
          console.log(item);
          (item.item = item._id.itemNumber),
            (item.name = item.name),
            (item.amount = item.totalAmount);
          return item;
          // delete item.shell_id_in_whareHouse;
          // delete item.deliveryNoteNum;
          // delete item._id;
          // delete item.whareHouseID;
          if (this.reportForm.value.itemType != "material") {
            delete item.expirationDate;
            delete item.productionDate;
          }

          // get purchase details for components and materials
          if (this.reportForm.value.itemType != "product") {
            item.name = item.stockitem[0].componentName;
            delete item.stockitem;
          }
          delete item.batchNumber;
          delete item.supplierBatchNumber;
          if (this.reportForm.value.itemType != "all") delete item.itemType;
          delete item.__v;
          delete item.barcode;
          delete item.userName;
          delete item.shell_id_in_whareHouse;
          console.log(item);
          return item;
        });
        sortOrder = ["item", "name", "position", "amount"];
      }
      console.log(data);
      this.reportData = data;

      // this.excelService.exportAsExcelFile(data, "Inventory Report", sortOrder);
    });
  }
  exportToExcel() {
    let sortOrder = ["itemNumber", "itemName", "totalAmount"];
    this.excelService.exportAsExcelFile(
      this.reportData,
      "Inventory Report",
      sortOrder
    );
  }
}
