import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { WorkPlanStatusPipe } from "src/app/pipes/work-plan-status.pipe";
import { AuthService } from "src/app/services/auth.service";
import { ExcelService } from "src/app/services/excel.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ProductionService } from "src/app/services/production.service";
import { WorkPlan } from "../WorkPlan";
import { OrdersService } from "../../../../services/orders.service";
import { NextPartNumberMarker } from "@aws-amplify/core/node_modules/aws-sdk/clients/s3";

@Component({
  selector: "app-all-items",
  templateUrl: "./all-items.component.html",
  styleUrls: ["./all-items.component.scss"],
})
export class AllItemsComponent implements OnInit {
  workPlans: WorkPlan[];
  checkedWorkPlans: WorkPlan[] = [];
  workPlansInterval: any = null;
  currentWorkPlan: WorkPlan;
  materialsForFormules: Array<any>;
  disableCheckBox: boolean = false;
  showMaterialsForFormules: boolean = false;
  showWorkPlan: boolean = false;
  loadData: boolean = false;
  showCheckbox: boolean = false;
  authorized: boolean = false;
  orderItems: any[] = [];
  viewOrderItems: boolean = true;
  viewWorkPlans: boolean = false;
  filteredWorkPlans: any[] = [];
  draftWPCount: number;
  movedWPCount: number;
  inProdWPCount: number;
  manufWPCount: number;
  closedWPCount: number;
  onholdWPCount: number;
  cancelledWPCount: number;
  selectedArr: any[];

  constructor(
    private productionService: ProductionService,
    private excelService: ExcelService,
    private workPlanStatusPipe: WorkPlanStatusPipe,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.getWorkPlans();
    this.authorized = this.authService.loggedInUser.authorization.includes(
      "creamProductionManager"
    );

    this.getAllOrderItems();
  }

  getAllOrderItems() {
    this.orderItems = [];

    this.ordersService.getAllOpenOrderItems().subscribe((data) => {
      console.log(data);
      this.orderItems = data;
    });
  }
  getWorkPlans() {
    this.productionService.getAllWorkPlans().subscribe((workPlans) => {
      this.workPlans = workPlans;
      console.log(this.workPlans);
      for (let i = 1; i <= 7; i++) {
        this.filteredWorkPlans = [];
        this.filteredWorkPlans = this.workPlans.filter((wp) => {
          return wp.status == i;
        });
        switch (i) {
          case 1:
            this.draftWPCount = this.filteredWorkPlans.length;
            break;
          case 2:
            this.movedWPCount = this.filteredWorkPlans.length;
            break;
          case 3:
            this.inProdWPCount = this.filteredWorkPlans.length;
            break;
          case 4:
            this.manufWPCount = this.filteredWorkPlans.length;
            break;
          case 5:
            this.closedWPCount = this.filteredWorkPlans.length;
            break;
          case 6:
            this.onholdWPCount = this.filteredWorkPlans.length;
            break;
          case 7:
            this.cancelledWPCount = this.filteredWorkPlans.length;
            break;
        }
      }
    });
  }

  openWorkPlan(serialNum) {
    this.showWorkPlan = true;
    this.currentWorkPlan = this.workPlans.find(
      (wp) => wp.serialNumber == serialNum
    );
  }

  closeWorkPlan(i) {
    this.currentWorkPlan = null;
    this.showWorkPlan = false;
    if (i != -1) {
      this.currentWorkPlan = this.workPlans[i];
      this.showWorkPlan = true;
    }
  }

  // add or remove selection
  addOrRemove(event, i) {
    if (event.target.checked) this.checkedWorkPlans.push(this.workPlans[i]);
    else {
      let serialNum = this.workPlans[i].serialNumber;
      let j = this.checkedWorkPlans.findIndex(
        (wp) => wp.serialNumber == serialNum
      );
      this.checkedWorkPlans.splice(j, 1);
    }
    console.log(this.checkedWorkPlans);
  }

  showHideCheckBox() {
    if (this.showCheckbox) this.checkedWorkPlans = [];
    this.showCheckbox = !this.showCheckbox;
  }

  setColor(status) {
    switch (status) {
      case 1:
        return "#e5e831";
      case 2:
        return "#15eb20";
      case 3:
        return "#595850";
    }
  }

  exportAll() {
    let excel = [];
    for (let workPlan of this.workPlans) {
      for (let orderItem of workPlan.orderItems) {
        excel.push({
          "Work Plan": workPlan.serialNumber,
          status: this.workPlanStatusPipe.transform(workPlan.status),
          ...orderItem,
        });
      }
    }
    this.excelService.exportAsExcelFile(excel, `תכניות עבודה ${new Date()}`);
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

  loadMaterialsForFormule() {
    if (this.checkedWorkPlans.length == 0)
      this.toastr.warning("יש לבחור לפחות תכנית אחת");
    else {
      let orderItemsToExplode = [];
      for (let workPlan of this.checkedWorkPlans) {
        let temp = orderItemsToExplode.concat(workPlan.orderItems);
        orderItemsToExplode = temp;
      }
      this.toastr.info("אנא המתן...", "מחשב כמויות");
      this.loadData = true;
      this.disableCheckBox = true;
      this.inventoryService
        .getMaterialsForFormules(orderItemsToExplode)
        .subscribe((data) => {
          // this.checkedWorkPlans = []
          this.materialsForFormules = data.newArray;
          this.showMaterialsForFormules = true;
          this.loadData = false;
          this.disableCheckBox = false;
        });
    }
  }

  checkAmountsForMaterial(prod, stock) {
    return Number(stock) - Number(prod);
  }

  viewWP(status) {
    console.log("WP clicked! Status = " + status);
    if (status != 0) {
      this.filteredWorkPlans = this.workPlans.filter((wp) => {
        return wp.status == status;
      });
    } else {
      this.filteredWorkPlans = this.workPlans;
    }

    this.viewOrderItems = false;
    this.viewWorkPlans = true;
  }

  viewOrders() {
    this.viewOrderItems = true;
    this.viewWorkPlans = false;
  }

  isSelected(ev, item) {
    console.log(ev.target.checked);
    console.log(item);
    if (ev.target.checked == true) {
      let cont = true;
      if (!item.formuleExist)
        cont = confirm(
          "לפריט זה לא קיימת פורמולה. האם אתה בטוח שברצונך להוסיף אותו לרשימה?"
        );
      if (cont) {
        var isSelected = this.selectedArr;
        isSelected.push({ ...item });
        this.selectedArr = isSelected;
      } else ev.target.checked = false;
    }

    if (ev.target.checked == false) {
      var isSelected = this.selectedArr;
      var tempArr = isSelected.filter((x) => x.itemNumber != item.itemNumber);
      this.selectedArr = tempArr;
    }
    console.log(this.selectedArr);
  }
}
