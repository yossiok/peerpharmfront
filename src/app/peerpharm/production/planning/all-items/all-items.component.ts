import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { WorkPlanStatusPipe } from "src/app/pipes/work-plan-status.pipe";
import { AuthService } from "src/app/services/auth.service";
import { ExcelService } from "src/app/services/excel.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ProductionService } from "src/app/services/production.service";
import { WorkPlan } from "../WorkPlan";
import { OrdersService } from "../../../../services/orders.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { FormulesService } from "src/app/services/formules.service";
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

  // work plans
  draftWPCount: number;
  PPCWPCount: number;
  FormulaWPCount: number;
  ScheduledWPCount: number;
  MaterialsWPCount: number;
  ProducedWPCount: number;
  DoneWPCount: number;
  CancelledWPCount: number;
  selectedWorkplan: any;
  selectedArr: any[] = [];

  // items
  waitingCount: number = 0;
  plannedCount: number = 0;
  approvedCount: number = 0;
  scheduledCount: number = 0;
  allocatedCount: number = 0;
  inProdCount: number = 0;
  producedCount: number = 0;
  canceledCount: number = 0;
  nullCount: number = 0;

  formuleToggle: boolean = true;
  sortToggle: number = 1;
  edit: number = -1;
  currentView: number = 1;
  currentWPView: number = 1;
  filteredOrderItems: any[] = [];
  filteredOrderItemsCopy: any[] = [];
  filteredWorkPlans: any[] = [];
  filteredWorkPlansCopy: any[] = [];

  @ViewChild("oiFilter") oiFilter: ElementRef;
  @ViewChild("oiFilter2") oiFilter2: ElementRef;
  @ViewChild("wpFilter") wpFilter: ElementRef;
  @ViewChild("wpList") invstck: ElementRef;
  @ViewChild("itemFilter") itemFilter: ElementRef;
  @ViewChild("orderFilter") orderFilter: ElementRef;
  @ViewChild("familyFilter") familyFilter: ElementRef;

  constructor(
    private productionService: ProductionService,
    private excelService: ExcelService,
    private workPlanStatusPipe: WorkPlanStatusPipe,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private formuleService: FormulesService
  ) {}

  ngOnInit(): void {
    this.getWorkPlans();
    this.authorized = this.authService.loggedInUser.authorization.includes(
      "creamProductionManager"
    );
    this.route.queryParamMap.subscribe((params) => {
      if (params["params"].workPlanId) {
        this.currentWorkPlan = params["params"].workPlanId;
        this.showWorkPlan = true;
      }
    });

    this.getAllOrderItems();
  }

  openModal(modal) {
    this.filteredWorkPlans = [];
    //filter out the cancelled and done workplans
    this.filteredWorkPlans = this.workPlans.filter((wp) => {
      return wp.status < 3;
    });
    this.filteredWorkPlansCopy = [...this.filteredWorkPlans];
    this.modalService.open(modal);
  }

  getAllOrderItems() {
    this.orderItems = [];
    this.waitingCount = 0;
    this.plannedCount = 0;
    this.approvedCount = 0;
    this.scheduledCount = 0;
    this.allocatedCount = 0;
    this.FormulaWPCount = 0;
    this.producedCount = 0;
    this.canceledCount = 0;

    this.ordersService.getAllOpenOrderItemsNew().subscribe((data) => {
      console.log(data);
      for (let item of data) {
        console.log(
          `Order Status: ${item.order.status}, Item number: ${item.itemNumber}, Order Number: ${item.orderNumber}`
        );
      }
      // this.orderItems = data;
      for (let item of data) {
        item.origQty = Number(item.quantity);
        item.maxQty =
          item.wpRemainQty || item.wpRemainQty == 0
            ? item.wpRemainQty
            : item.quantity;
        item.maxQty = Number(item.maxQty);
        item.quantity = Number(item.quantity);
        item.isSelected = false;
        item.isSelectedColor = "#FEFEFE";
        item.WPstatus = 0;
        item.dueDate =
          item.workPlans && item.workPlans.dueDate
            ? item.workPlans.dueDate
            : null;
        item.itemOrderDate = item.itemOrderDate
          ? item.itemOrderDate
          : item.order.orderDate;
        item.itemOrderDate = new Date(item.itemOrderDate);
        if (item.workPlans) {
          if (item.wpSplit && item.maxQty > 0) {
            if (this.orderItems.findIndex((oi) => oi._id == item._id) == -1) {
              // newItem1 = remained qty
              let newItem1 = { ...item };
              newItem1.pakaStatus = 1;
              newItem1.quantity = item.wpRemainQty;
              newItem1.workPlanId = null;
              this.orderItems.push(newItem1);

              // newItem2 = Prod qty (workPlan)
              let newItem2 = { ...item };
              newItem2.pakaStatus = item.workPlans.itemStatus;
              newItem2.quantity = item.wpProdQty;
              newItem2.workPlanId = item.workPlans.workPlanId;
              this.orderItems.push(newItem2);
            }
          } else {
            item.pakaStatus = item.workPlans.itemStatus;
            // item.dueDate = item.workPlans.dueDate ? item.workPlans.dueDate : null;
            item.workPlanId = item.workPlans.workPlanId;
            item.quantity = item.workPlans.quantity;
            item.WPstatus = item.workPlans.WPstatus;
            this.orderItems.push(item);
          }
        } else this.orderItems.push(item);
      }
      console.log(this.orderItems);
      for (let i = 1; i <= 8; i++) {
        this.filteredOrderItems = this.orderItems.filter((oi) => {
          return oi.pakaStatus == i;
        });

        switch (i) {
          case 1:
            this.waitingCount = 0 + this.filteredOrderItems.length;

            break;
          case 2:
            this.plannedCount = 0 + this.filteredOrderItems.length;
            break;
          case 3:
            this.approvedCount = 0 + this.filteredOrderItems.length;
            break;
          case 4:
            this.scheduledCount = 0 + this.filteredOrderItems.length;
            break;
          case 5:
            this.allocatedCount = 0 + this.filteredOrderItems.length;
            break;
          case 6:
            this.inProdCount = 0 + this.filteredOrderItems.length;
            break;
          case 7:
            this.producedCount = 0 + this.filteredOrderItems.length;
            break;
          case 8:
            this.canceledCount = 0 + this.filteredOrderItems.length;
            break;
          case null:
            this.waitingCount = 0 + this.filteredOrderItems.length;
            break;
          default:
            this.waitingCount = 0 + this.filteredOrderItems.length;
            break;
        }
      }

      this.viewOrders(1);
    });
  }

  getWorkPlans() {
    this.productionService.getAllWorkPlansList().subscribe((workPlans) => {
      this.workPlans = workPlans;
      console.log(this.workPlans);

      for (let i = 1; i <= 8; i++) {
        this.filteredWorkPlans = [];
        this.filteredWorkPlans = this.workPlans.filter((wp) => {
          return wp.status == i;
        });
        switch (i) {
          case 1:
            this.draftWPCount = this.filteredWorkPlans.length;
            break;
          case 2:
            this.PPCWPCount = this.filteredWorkPlans.length;
            break;
          case 3:
            this.FormulaWPCount = this.filteredWorkPlans.length;
            break;
          case 4:
            this.ScheduledWPCount = this.filteredWorkPlans.length;
            break;
          case 5:
            this.MaterialsWPCount = this.filteredWorkPlans.length;
            break;
          case 6:
            this.ProducedWPCount = this.filteredWorkPlans.length;
            break;
          case 7:
            this.DoneWPCount = this.filteredWorkPlans.length;
            break;
          case 8:
            this.CancelledWPCount = this.filteredWorkPlans.length;
            break;
        }
      }
    });
  }

  openWorkPlan(serialNum) {
    this.productionService.getWorkPlan(serialNum).subscribe((data) => {
      console.log(data);
      if (data && data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data && data.serialNumber == serialNum) {
        this.showWorkPlan = true;
        this.currentWorkPlan = data;
      } else {
        this.toastr.error(
          "Workplan wasn't found - לא נמצאה פקודת עבודה מספר: " + serialNum
        );
      }
    });
  }
  // openWorkPlan(serialNum) {
  //   this.showWorkPlan = true;
  //   this.currentWorkPlan = this.workPlans.find(
  //     (wp) => wp.serialNumber == serialNum
  //   );
  // }

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
    this.currentWPView = status;
    console.log("WP clicked! Status = " + this.currentWPView);
    if (status != 9) {
      this.filteredWorkPlans = this.workPlans.filter((wp) => {
        return wp.status == status;
      });
      this.filteredWorkPlansCopy = [...this.filteredWorkPlans];
    } else {
      this.filteredWorkPlans = this.workPlans;
      this.filteredWorkPlansCopy = [...this.filteredWorkPlans];
    }

    this.viewOrderItems = false;
    this.viewWorkPlans = true;
  }

  viewOrders(status) {
    console.log("view orders clicked! Status = " + status);

    this.currentView = status;
    this.filteredOrderItems = [];
    if (status != 9) {
      this.filteredOrderItems = this.orderItems.filter((oi) => {
        return oi.pakaStatus == status;
      });
    } else {
      this.filteredOrderItems = this.orderItems;
    }

    this.viewOrderItems = true;
    this.viewWorkPlans = false;
    this.oiFilter.nativeElement.value = "";
  }

  isSelected(ev, item) {
    if (ev.target.checked) {
      let cont = true;
      if (!item.formule.formuleNumber)
        cont = confirm(
          "לפריט זה לא קיימת פורמולה. האם אתה בטוח שברצונך להוסיף אותו לרשימה?"
        );

      if (cont) {
        this.edit = -1;
        let ind = this.filteredOrderItems.findIndex((fi) => fi._id == item._id);
        this.filteredOrderItems[ind].isSelected = true;
        this.filteredOrderItems[ind].isSelectedColor = "#ccc";

        console.log("Before push of item");
        console.log(item);
        let newItem = {
          isSelected: true,
          formule: item.formule,
          parentFormule: item.formule.parentNumber
            ? item.formule.parentNumber
            : item.formule.formuleNumber,
          customerID: item.order.costumerInternalId,
          customerName: item.order.costumer,
          description: item.discription,
          itemNumber: item.itemNumber,
          enoughtComponents: true,
          netWeightGr: item.netWeightGr,
          quantity: item.quantity,
          origQty: item.origQty,
          wpRemainQty: item.maxQty,
          remarks: null,
          totalKG: Number(item.quantity) * Number(item.netWeightGr),
          orderNumber: item.orderNumber,
          _id: item._id,
          status: 2,
        };
        this.selectedArr.push(newItem);
      } else ev.target.checked = false;
    } else {
      item.isSelected = false;
      item.isSelectedColor = "#FEFEFE";
      let ind = this.filteredOrderItems.findIndex((fi) => fi._id == item._id);
      this.filteredOrderItems[ind].isSelected = false;
      this.filteredOrderItems[ind].isSelectedColor = "#FEFEFE";
      let index = this.selectedArr.findIndex((oi) => {
        return oi._id == item._id;
      });
      this.selectedArr.splice(index, 1);
    }
    console.log(this.selectedArr);
  }
  addToPlan(wp) {
    let ok = confirm(`אתה מאשר להוסיף את הפריט/ים לפק"ע ${wp.serialNumber}`);
    if (ok) {
      console.log(wp);
      console.log(this.selectedArr);
      this.selectedWorkplan = wp;
      this.modalService.dismissAll();
      for (let item of this.selectedArr) {
        if (Number(item.quantity) < Number(item.origQty)) {
          item.wpSplit = true;
          item.wpProdQty = item.wpProdQty
            ? item.wpProdQty + item.quantity
            : item.quantity;
          item.wpRemainQty = item.wpRemainQty
            ? item.wpRemainQty - item.quantity
            : item.qantity - item.wpProdQty;
        }
        if (item.remainQty <= 0) {
          alert(
            "כמות היחידות שהוזנו לפקודת העבודה חורגת מהכמות שהוזמנה על ידי הלקוח"
          );
          return;
        }
      }

      this.addWorkPlan(
        this.selectedArr,
        wp.remark + ": updated!",
        wp.serialNumber
      );
      // this.ordersService
      //   .makePlan(this.selectedArr, "WP updated!!!", wp.serialNumber)
      //   .subscribe((data) => {
      //     console.log(data);
      //   });
    }
  }
  addWorkPlan(orderItems, remark, wp) {
    console.log(orderItems);
    console.log(remark);
    console.log(wp);
    this.ordersService.makePlan(orderItems, remark, wp).subscribe((data) => {
      console.log(data);
      console.log(data.workPlan);
      console.log(data.result);
      if (!data) {
        this.toastr.error("Work plan creation failed");
        return;
      }

      if (data.error && data.error == "No formules for all products")
        this.toastr.error(
          `יש לעדכן פורמולות עבור הפריטים הבאים: ${data.missingFormules}`,
          "פורמולות חסרות"
        );
      else if (data.msg == "duplicate formules")
        this.toastr.error(
          "יש למחוק את אחד המופעים על מנת להמשיך",
          `פורמולה מס. ${data.formule} מופיעה פעמיים במערכת`
        );
      else if (data.msg) {
        this.toastr.error(data.msg);
      } else if (data.errors.length > 0) {
        for (let msg of data.errors) {
          this.toastr.error(msg.msg);
        }
      } else if (data.workPlan.orderItems.length > 0) {
        console.log(data.workPlan);
        // this.deleteProductionFormules(data.workPlan);

        // let idx = this.workPlans.findIndex(
        //   (wp) => wp.serialNumber == data.workPlan.serialNumber
        // );
        // if (idx == -1) {
        //   this.workPlans.unshift(data.workPlan);
        // } else {
        //   this.workPlans.splice(idx, 1, data.workPlan);
        // }
        // for (let item of this.orderItems) {
        //   let index = data.workPlan.orderItems.findIndex(
        //     (oi) => oi._id == item._id
        //   );
        //   if (index > -1) {
        //     this.orderItems[index].pakaStatus = 2;
        //     this.orderItems[index].workPlanId = data.workPlan.serialNumber;
        //   }
        // }

        this.toastr.success(
          "נשמרה בהצלחה.",
          `תכנית עבודה ${data.workPlan.serialNumber}`
        );
        this.selectedArr = [];
      } else {
        this.toastr.warning(
          'היתה בעיה. אנא בדוק את תכנית העבודה במסך "Planning"'
        );
      }
      this.getAllOrderItems();
      this.getWorkPlans();
      this.orderItems = [];
      this.selectedArr = [];
    });
  }

  deleteProductionFormules(wp) {
    let updatedWP = wp;
    if (confirm("כל הפורמולות יימחקו ותצטרך ליצור אותן מחדש. להמשיך?")) {
      updatedWP.productionFormules = [];
      // TODO: update status
      updatedWP.orderItems.map((oi) => {
        oi.hasFormule = false;
        oi.status = 2;
        return oi;
      });
      console.log(updatedWP);
      this.productionService.editWorkPlan(updatedWP).subscribe((data) => {
        console.log(data);
        if (data.msg) {
          console.log(data.msg);
          this.toastr.error(data.msg);
        } else if (data) {
          this.toastr.success("הפרטים נשמרו בהצלחה");
        }
      });
    }
  }

  makePlan() {
    if (this.selectedArr.length == 0)
      this.toastr.error("יש לבחור לפחות פריט אחד");
    else {
      let remark = prompt("אנא רשום שם / הערה לתכנית עבודה:");
      if (!remark) return;
      for (let item of this.selectedArr) {
        if (Number(item.quantity) < Number(item.origQty)) {
          item.wpSplit = true;
          item.wpProdQty = item.wpProdQty
            ? item.wpProdQty + item.quantity
            : item.quantity;
          item.wpRemainQty = item.wpRemainQty
            ? item.wpRemainQty - item.quantity
            : item.qantity - item.wpProdQty;
        }
        if (item.remainQty <= 0) {
          alert(
            "כמות היחידות שהוזנו לפקודת העבודה חורגת מהכמות שהוזמנה על ידי הלקוח"
          );
          return;
        }
      }
      this.addWorkPlan(this.selectedArr, remark, null);
    }
  }

  deleteItem(item, i) {
    if (confirm(`למחוק פריט ${item.itemNumber} מהרשימה?`)) {
      this.ordersService.deleteItemFromPAKALIST(item._id).subscribe((data) => {
        console.log(data);
        this.filteredOrderItems.splice(i, 1);
      });
    }
  }

  //sort by the first level of the array
  sortItemsTwo(field, sub) {
    let i = this.sortToggle;
    this.filteredOrderItems.sort((a, b) =>
      a[field][sub] > b[field][sub] ? i : a[field][sub] < b[field][sub] ? -i : 0
    );
    this.sortToggle *= -1;
  }
  sortByFormuleNumber() {
    let i = this.sortToggle;
    this.filteredOrderItems.sort((a, b) => {
      let formuleA = a.formule.parentNumber
        ? a.formule.parentNumber
        : a.formule.formuleNumber;
      let formuleB = b.formule.parentNumber
        ? b.formule.parentNumber
        : b.formule.formuleNumber;

      return formuleA > formuleB ? i : formuleA < formuleB ? -i : 0;
    });
    this.sortToggle *= -1;
  }
  //sort by the second level of the array (nested array)
  sortItemsOne(field) {
    let i = this.sortToggle;
    this.filteredOrderItems.sort((a, b) => {
      return a[field] > b[field] ? i : a[field] < b[field] ? -i : 0;
    });
    this.sortToggle *= -1;
  }

  sortWpOne(field) {
    let i = this.sortToggle;
    this.filteredWorkPlans.sort((a, b) => {
      return a[field] > b[field] ? i : a[field] < b[field] ? -i : 0;
    });
    this.sortToggle *= -1;
  }

  splitOrderItem(item) {
    this.edit = -1;
    console.log(item);
    let newItem = { ...item };
    let index = this.orderItems.findIndex((oi) => {
      return oi._id == newItem._id && !oi.workPlans;
    });

    this.orderItems[index].quantity = this.orderItems[index].maxQty;
    this.orderItems[index].maxQty -= newItem.quantity;
    this.orderItems.splice(index + 1, 0, newItem);

    console.log(this.orderItems);

    this.viewOrders(1);
  }

  findInValues(arr, value) {
    value = String(value).toLowerCase();
    return arr.filter((o) =>
      Object.entries(o).some((entry) =>
        String(entry[1]).toLowerCase().includes(value)
      )
    );
  }

  filterOrderItems() {
    let value = this.oiFilter.nativeElement.value;
    console.log(value);
    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearOrderItems();
    } else {
      let array = [...this.filteredOrderItems];
      let arrayCopy = [...this.filteredOrderItems];
      this.filteredOrderItems = arrayCopy.filter((o) =>
        Object.entries(o).some((entry) =>
          String(entry[1]).toLowerCase().includes(value)
        )
      );
    }
  }

  filterOrderItemsNew() {
    let value = this.oiFilter2.nativeElement.value;
    console.log(value);

    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearOrderItems();
    } else {
      let arrayCopy = [...this.filteredOrderItems];
      this.filteredOrderItems = arrayCopy.filter((item) => {
        let formule = item.formule.parentNumber
          ? item.formule.parentNumber
          : item.formule.formuleNumber;
        return formule.toLowerCase().includes(value);
      });
    }
  }

  clearOrderItems() {
    this.viewOrders(this.currentView);
    this.oiFilter.nativeElement.value = "";
    this.oiFilter2.nativeElement.value = "";
  }

  filterWorkPlans() {
    let value = this.wpFilter.nativeElement.value.trim();
    console.log(value);
    console.log(this.filteredWorkPlansCopy);

    if (value == "") {
      this.clearWorkPlans();
    } else {
      this.filteredWorkPlans = this.filteredWorkPlansCopy.filter((wp) =>
        String(wp.serialNumber).includes(value)
      );
    }
  }
  clearWorkPlans() {
    this.viewWP(this.currentWPView);
    this.wpFilter.nativeElement.value = "";
    this.itemFilter.nativeElement.value = "";
    this.orderFilter.nativeElement.value = "";
    this.familyFilter.nativeElement.value = "";
  }

  filterByItem() {
    let value = this.itemFilter.nativeElement.value;
    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearWorkPlans();
    } else {
      this.filteredWorkPlans = this.filteredWorkPlansCopy.filter((wp) => {
        let idx = wp.orderItems.findIndex((oi) =>
          oi.itemNumber.includes(value)
        );
        return idx > -1;
      });
    }
  }

  filterByOrder() {
    let value = this.orderFilter.nativeElement.value;
    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearWorkPlans();
    } else {
      this.filteredWorkPlans = this.filteredWorkPlansCopy.filter((wp) => {
        let idx = wp.orderItems.findIndex((oi) =>
          oi.orderNumber.includes(value)
        );
        return idx > -1;
      });
    }
  }

  filterByFamily() {
    let value = String(this.familyFilter.nativeElement.value)
      .toLowerCase()
      .trim();
    if (value == "") {
      this.clearWorkPlans();
    } else {
      this.formuleService.getFormuleByNumber(value).subscribe((data) => {
        let parentFormule = data.parentNumber ? data.parentNumber : value;
        console.log(parentFormule);

        this.filteredWorkPlans = this.filteredWorkPlansCopy.filter((wp) => {
          let idx = wp.orderItems.findIndex(
            (oi) => oi.parentFormule == parentFormule
          );
          return idx > -1;
        });
      });
    }
  }
}
