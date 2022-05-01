import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { OrdersService } from "../../../services/orders.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { ChatService } from "src/app/shared/chat.service";
import { AuthService } from "src/app/services/auth.service";
import { ExcelService } from "src/app/services/excel.service";
import * as XLSX from "xlsx";
import { FreeBatchesFile } from "../free-batches/FreeBatch";
import { de } from "date-fns/locale";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  @ViewChild("orderRemarks") orderRemarks: ElementRef;
  @ViewChild("orderType") orderType: ElementRef;
  @ViewChild("deliveryDate") deliveryDate: ElementRef;
  @ViewChild("orderDate") orderDate: ElementRef;
  @ViewChild("customerOrderNum") customerOrderNum: ElementRef;
  @ViewChild("costumer") costumer: ElementRef;
  @ViewChild("orderNumber") orderNumber: ElementRef;
  @ViewChild("id") id: ElementRef;
  @ViewChild("stage") stage: ElementRef;
  @ViewChild("onHoldDate") onHoldDate: ElementRef;
  @ViewChild("uploadExFile") uploadExFile: ElementRef;

  stagesCount = {
    new: 0,
    partialCmpt: 0,
    allCmpt: 0,
    production: 0,
    prodFinish: 0,
    done: 0,
  };
  orders: any[];
  ordersCopy: any[];
  freeBatches: any[];
  problematicorderItems: any[];
  today: any;
  EditRowId: any = "";
  onHoldStrDate: String;
  filterValue: string = "";
  stageSortDir: string = "done";
  numberSortDir: string = "oldFirst";
  sortCurrType: String = "OrderNumber";
  lodingOrders: boolean = false;
  selectAllOrders: boolean = false;
  newOrderModal: boolean = false;
  loadingUri: boolean = false;
  freeBatchesModal: boolean = false;
  problematicsModal: boolean = false;
  PPCPermission: boolean = false;
  loadingProblematics: boolean = false;
  orderEditApprove: boolean = false;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.edit("");
  }

  @HostListener("document:keydown", ["$event"]) handleKeyboardEvent(
    event: KeyboardEvent
  ): void {
    if (event.key === "F2") {
      if (this.newOrderModal == true) {
        this.newOrderModal = false;
      } else {
        this.newOrderModal = true;
      }
    }
  }

  constructor(
    private chat: ChatService,
    private ordersService: OrdersService,
    private router: Router,
    private toastSrv: ToastrService,
    private authService: AuthService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.PPCPermission =
      this.authService.loggedInUser.authorization.includes("PPCPermission");
    this.orderEditApprove =
      this.authService.loggedInUser.authorization.includes("newOrder");

    this.today = new Date();
    this.today = moment(this.today).format("DD/MM/YYYY");
    this.getOrders();
    this.checkfunc();
    this.chat.joinroom("orders");
    this.chat.messages.subscribe((data) => {
      console.log(data);
      if (data.msg == "order_refresh" && data.to == "allusers") {
        this.getOrders();
      }
    });
  }

  exportAsXLSX() {
    let orders = [];
    console.log("orders: ", this.orders);
    for (let order of this.orders) {
      orders.push({
        "הזמנה+לקוח": order.NumberCostumer,
        "מס' הזמנה": order.orderNumber,
        לקוח: order.costumer,
        'מק"ט לקוח (פנימי)': order.costumerInternalId,
        "תאריך הזמנה": order.orderDate,
        "תאריך אספקה (משוער)": order.deliveryDate,
        "סוג הזמנה": order.type,
        משתמש: order.user,
        הערות: order.orderRemarks,
        סטטוס: order.status,
        שלב: order.stage,
      });
    }
    this.excelService.exportAsExcelFile(
      orders,
      `דו"ח הזמנות ${new Date().toString().slice(0, 10)}`
    );
  }

  exportAsXLSX2() {
    this.ordersService.getOpenOrderReport().subscribe((data) => {
      let orders = [];
      // console.log(data)

      for (let order of data) {
        let items = "";
        for (let item of order.items) {
          items =
            items +
            "מספר מוצר: " +
            item.itemNumber +
            ", " +
            "מצב: " +
            item.fillingStatus +
            "| ";
        }

        orders.push({
          הלקוח: order.openOrder.costumer,
          "מס' הזמנה": order.openOrder.orderNumber,
          לקוח: order.openOrder.costumer,
          'מק"ט לקוח (פנימי)': order.openOrder.costumerInternalId,
          "תאריך הזמנה": order.openOrder.orderDate,
          "תאריך אספקה (משוער)": order.openOrder.deliveryDate,
          "סוג הזמנה": order.openOrder.type,
          משתמש: order.openOrder.user,
          הערות: order.openOrder.orderRemarks,
          סטטוס: order.openOrder.status,
          שלב: order.openOrder.stage,
          מוצרים: items,
        });
      }
      this.excelService.exportAsExcelFile(
        orders,
        `דו"ח הזמנות תקועות ${new Date().toString().slice(0, 10)}`
      );
    });
    console.log("orders: ", this.orders);
  }

  uploadFreeBatchesFile(ev) {
    if (confirm("האם אתה בטוח שבחרת בקובץ הנכון ?")) {
      let remark = prompt("הזן הערה לקובץ");
      const target: DataTransfer = <DataTransfer>ev.target;
      //
      if (target.files.length > 1) {
        alert("ניתן לבחור קובץ אחד בלבד");
        this.uploadExFile.nativeElement.value = "";
        return;
      }
      const reader: FileReader = new FileReader();

      // reader.readAsDataURL(ev.target.files[0]); // read file as data url
      reader.readAsBinaryString(target.files[0]);

      // reader.onLoad is called once readAsBinaryString is completed
      reader.onload = (event: any) => {
        // binaryStr is the binary string rsult of the excel file reading
        const binaryStr = event.target.result;

        const workBook: XLSX.WorkBook = XLSX.read(binaryStr, {
          type: "binary",
        });

        const workSheetName: string = workBook.SheetNames[0];
        const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetName];
        let wsJson = XLSX.utils.sheet_to_json(workSheet);
        // let names = workSheetName.split("-");
        let fileName = target.files[0].name;
        let fileDate = ev.target.files[0].lastModified;
        let batches = wsJson.map((el) => ({
          batchNumber: <string>el["אצווה"],
          orderNumber: <string>el["הזמנה"],
          originalQnt: <number>el["כמות מקורית"],
          updatedQnt: <number>el["כמות נוכחית"],
          position: <string>el["מיקום"],
          itemNumber: <string>el['מק"ט'],
          itemName: <string>el["תאור"],
        }));

        let freeBatches: FreeBatchesFile = {
          batches,
          date: fileDate,
          fileName,
          userName: this.authService.loggedInUser.userName,
          remark,
        };

        this.ordersService.uploadFreeBatches(freeBatches).subscribe((data) => {
          if (data.msg == "success")
            this.toastSrv.success("File Uploaded successfully");
          else this.toastSrv.error(data.msg);
        });
      };
    }
  }

  downloadFreeBatches() {
    this.ordersService.downloadFreeBatches().subscribe((data) => {
      console.log(data);
      if (data.msg == "success") {
        this.freeBatches = data.freeBatches;
        this.freeBatchesModal = true;
      } else this.toastSrv.error(data.msg);
    });
  }

  checkPermission() {
    if (this.authService.loggedInUser.screenPermission == "5") return true;
  }

  checkfunc() {
    this.ordersService.refreshOrders.subscribe((order) => {
      this.orders.push(order);
    });
  }

  getOrders() {
    this.ordersService.getOrders().subscribe((orders) => {
      console.log(orders);
      orders.map((order) => {
        order.color = "white";
        let deliveryDateArr;
        if (order.deliveryDate.includes("/")) {
          deliveryDateArr = order.deliveryDate.split("/");
          if (deliveryDateArr[0].length == 1) {
            deliveryDateArr[0] = "0" + deliveryDateArr[0];
          }
          if (deliveryDateArr[1].length == 1) {
            deliveryDateArr[1] = "0" + deliveryDateArr[1];
          }
        } else {
          deliveryDateArr = order.deliveryDate.split("-");
          let tempV = deliveryDateArr[0];
          deliveryDateArr[0] = deliveryDateArr[2];
          deliveryDateArr[2] = tempV;

          order.deliveryDate =
            deliveryDateArr[0] +
            "/" +
            deliveryDateArr[1] +
            "/" +
            deliveryDateArr[2];

          // let newDate =
          //   deliveryDateArr[2] +
          //   "-" +
          //   deliveryDateArr[1] +
          //   "-" +
          //   deliveryDateArr[0];
          // order.deliveryDate = new Date(newDate);
        }
        let todayDateArr = this.today.split("/");
        if (parseInt(deliveryDateArr[2]) < parseInt(todayDateArr[2])) {
          //RED
          order.color = "#ff9999";
        } else {
          if (
            parseInt(deliveryDateArr[1]) < parseInt(todayDateArr[1]) &&
            parseInt(deliveryDateArr[2]) == parseInt(todayDateArr[2])
          ) {
            //RED
            order.color = "#ff9999";
          } else if (
            parseInt(deliveryDateArr[0]) < parseInt(todayDateArr[0]) &&
            parseInt(deliveryDateArr[1]) == parseInt(todayDateArr[1])
          ) {
            //RED
            order.color = "#ff9999";
          }
        }

        this.returnStageColor(order);
        Object.assign({ isSelected: false }, order);
        order.NumberCostumer = order.orderNumber + " " + order.costumer;
      });
      this.orders = orders;
      this.ordersCopy = orders;
    });
  }

  returnStageColor(order) {
    if (order.stage == "new") {
      order.stageColor = "white";
      this.stagesCount.new++;
    } else if (order.stage == "partialCmpt") {
      order.stageColor = "#ffa64d";
      this.stagesCount.partialCmpt++;
    } else if (order.stage == "allCmpt") {
      order.stageColor = "#ffff80";
      this.stagesCount.allCmpt++;
    } else if (order.stage == "production") {
      order.stageColor = "#b3ecff";
      this.stagesCount.production++;
    } else if (order.stage == "prodFinish") {
      order.stageColor = "#d9b3ff";
      this.stagesCount.prodFinish++;
    } else if (order.stage == "done") {
      order.stageColor = "#9ae59a";
      this.stagesCount.done++;
    }
  }

  edit(id) {
    if (this.orderEditApprove) {
      this.EditRowId = id;
    }

    if (id != "" && this.orderEditApprove) {
      let i = this.orders.findIndex((elemnt) => elemnt._id == id);
      if (
        this.orders[i].onHoldDate != null &&
        this.orders[i].onHoldDate != "" &&
        this.orders[i].onHoldDate != undefined
      ) {
        this.onHoldStrDate = moment(this.orders[i]).format("YYYY-MM-DD");
      }
    }
  }

  saveEdit(closedOrder, orderId) {
    // a - is if the request is to set order - ready
    if (!closedOrder) {
      let orderToUpdate = {
        orderId: this.id.nativeElement.value,
        orderNumber: this.orderNumber.nativeElement.value,
        orderDate: this.orderDate.nativeElement.value,
        costumer: this.costumer.nativeElement.value,
        deliveryDate: this.deliveryDate.nativeElement.value,
        orderRemarks: this.orderRemarks.nativeElement.value,
        orderType: this.orderType.nativeElement.value,
        stage: this.stage.nativeElement.value,
        customerOrderNum: this.customerOrderNum.nativeElement.value,
      };

      this.ordersService.editOrder(orderToUpdate).subscribe((res) => {
        if (res != "order missing") {
          let i = this.orders.findIndex((elemnt) => elemnt._id == orderId);
          // orderToUpdate['status'] = this.orders[i].status;
          orderToUpdate["color"] = this.orders[i].color;
          orderToUpdate["stageColor"] = this.orders[i].stageColor;
          orderToUpdate["NumberCostumer"] = this.orders[i].NumberCostumer;
          orderToUpdate["isSelected"] = this.orders[i].isSelected;
          this.orders[i] = res[0];
          this.orders[i].color = orderToUpdate["color"];
          this.returnStageColor(this.orders[i]);
          this.orders[i].NumberCostumer = orderToUpdate["NumberCostumer"];
          this.orders[i].isSelected = orderToUpdate["isSelected"];
          this.EditRowId = "";
          this.toastSrv.success("Changes Saved!");

          console.log(res);
        } else {
          this.toastSrv.error("Changes Not Saved");
        }
      });
    } else {
      if (orderId.id != "") {
        console.log("this.orders before", this.orders);
        let orderToUpdate = {
          status: "close",
          orderId: orderId,
          stage: "done",
        };
        if (confirm("Close Order?")) {
          console.log(orderToUpdate);
          this.ordersService.editOrder(orderToUpdate).subscribe((res) => {
            if (res != "order missing") {
              let i = this.orders.findIndex((elemnt) => elemnt._id == orderId);
              orderToUpdate["status"] = "";
              orderToUpdate["stage"] = "done";
              // this.orders[i] = orderToUpdate;

              this.orders.splice(i, 1);
              console.log("this.orders after", this.orders);

              // this.orders[i] = res;
              this.EditRowId = "";
              this.toastSrv.success("Order Closed!");
              console.log(res);
            }
          });
        }
      } else {
        if (confirm("לא נשמרו שינויים להזמנה")) {
          this.EditRowId = "";
        }
      }
    }
  }

  deleteOrder(order) {
    if (confirm("Delete Order?")) {
      this.ordersService.deleteOrder(order).subscribe((res) => {
        //  let i = this.orders.findIndex(elemnt => elemnt._id == order._id);
        //  delete this.orders[i];
        this.orders = this.orders.filter((elem) => elem._id != order._id);
      });
    }
  }

  loadOrders() {
    console.log(this.orders);
    // let tempArr = this.orders.filter(e => e.isSelected == true).map(e => e = e._id);
    let tempArr = this.orders
      .filter((e) => e.isSelected == true)
      .map((e) => (e = e.orderNumber));
    if (tempArr.length > 0) {
      this.ordersService.sendOrderData(tempArr);
      this.ordersService.getAllOpenOrdersItems(false);
      let tempArrStr = "";
      tempArr.forEach((number) => {
        tempArrStr = tempArrStr + "," + number;
      });

      let urlPrefixIndex = window.location.href.indexOf("#");
      let urlPrefix = window.location.href.substring(0, urlPrefixIndex);

      window.open(urlPrefix + "#/peerpharm/allorders/orderitems/" + tempArrStr);
      // this.router.navigate(["/peerpharm/allorders/orderitems/"+tempArrStr]); // working good but in the same tab
    } else {
      this.toastSrv.error("0 Orders selected");
    }
  }

  loadOrdersItems() {
    this.ordersService.getAllOpenOrdersItems(true);
    let urlPrefixIndex = window.location.href.indexOf("#");
    let urlPrefix = window.location.href.substring(0, urlPrefixIndex);
    window.open(urlPrefix + "#/peerpharm/allorders/orderitems/00");
    // this.router.navigate(["/peerpharm/allorders/orderitems/00"]);
  }

  changeText(ev) {
    let word = ev.target.value;
    let wordsArr = word.split(" ");
    wordsArr = wordsArr.filter((x) => x != "");
    if (wordsArr.length > 0) {
      let tempArr = [];
      this.ordersCopy.filter((x) => {
        var check = false;
        var matchAllArr = 0;
        wordsArr.forEach((w) => {
          if (x.NumberCostumer.toLowerCase().includes(w.toLowerCase())) {
            matchAllArr++;
          }
          matchAllArr == wordsArr.length ? (check = true) : (check = false);
        });

        if (!tempArr.includes(x) && check) tempArr.push(x);
      });
      this.orders = tempArr;
    } else {
      this.orders = this.ordersCopy.slice();
    }
  }

  // filterOrdersByArea(ev) {
  //   let orderArea = ev.target.value
  //   this.ordersService.getOrdersByArea(orderArea).subscribe(data => {
  //     this.orders = data;
  //   })
  // }

  filterByItem(value) {
    this.lodingOrders = true;
    this.ordersService
      .getAllOpenOrderItemsByItemValue(value)
      .subscribe((data) => {
        this.lodingOrders = false;
        this.filterValue = value;
        this.orders = this.ordersCopy.filter((orderFromTable) =>
          data.find(
            (orderFromServer) =>
              orderFromServer.orderNumber == orderFromTable.orderNumber
          )
        );
      });
  }

  allOrders(element) {
    this.orders = this.ordersCopy;
    this.filterValue = "";
    element.value = "";
  }

  searchByType(ev) {
    let word = ev.target.value;
    if (word != "") {
      if (word == "Cosmetic") {
        this.orders = this.ordersCopy;
        var tempArr = this.orders.filter((x) => x.type == "Cosmetic");
        this.orders = tempArr;
      }

      if (word == "Make Up") {
        this.orders = this.ordersCopy;
        var tempArr = this.orders.filter((x) => x.type == "Make Up");
        this.orders = tempArr;
      }

      if (word == "Cosmetic & MakeUp") {
        this.orders = this.ordersCopy;
        var tempArr = this.orders.filter((x) => x.type == "Cosmetic & Make Up");
        this.orders = tempArr;
      }
    } else {
      this.orders = this.ordersCopy;
    }
  }

  filterOrdersByDate(type) {
    this.orders = this.ordersCopy;

    if (type == "order") {
      this.orders.sort(function (a, b) {
        return (
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      });
    }

    if (type == "delivery") {
      this.orders.sort(function (a, b) {
        return (
          new Date(b.deliveryDate).getTime() -
          new Date(a.deliveryDate).getTime()
        );
      });
    }
  }

  checkboxAllOrders(ev) {
    this.orders.filter((e) => (e.isSelected = ev.target.checked));
  }

  sortOrdersByStage() {
    var tempArr = [],
      stageNewArr = [],
      stagePartialCmptArr = [],
      stageAllCmptArr = [],
      stageProductionArr = [],
      stageProdFinishArr = [],
      stageDoneArr = [];

    this.orders.forEach((order, key) => {
      if (order.stage == "new") {
        stageNewArr.push(order);
      } else if (order.stage == "partialCmpt") {
        stagePartialCmptArr.push(order);
      } else if (order.stage == "allCmpt") {
        stageAllCmptArr.push(order);
      } else if (order.stage == "production") {
        stageProductionArr.push(order);
      } else if (order.stage == "prodFinish") {
        stageProdFinishArr.push(order);
      } else if (order.stage == "done") {
        stageDoneArr.push(order);
      } else {
      }

      if (key + 1 == this.orders.length) {
      }
      if (
        stageNewArr.length +
          stagePartialCmptArr.length +
          stageAllCmptArr.length +
          stageProductionArr.length +
          stageProdFinishArr.length +
          stageDoneArr.length ==
        this.orders.length
      ) {
        if (this.stageSortDir == "new") {
          stageDoneArr.map((order) => tempArr.push(order));
          stageProdFinishArr.map((order) => tempArr.push(order));
          stageProductionArr.map((order) => tempArr.push(order));
          stageAllCmptArr.map((order) => tempArr.push(order));
          stagePartialCmptArr.map((order) => tempArr.push(order));
          stageNewArr.map((order) => tempArr.push(order));
          this.stageSortDir = "done";
        } else if (this.stageSortDir == "done") {
          stageNewArr.map((order) => tempArr.push(order));
          stagePartialCmptArr.map((order) => tempArr.push(order));
          stageAllCmptArr.map((order) => tempArr.push(order));
          stageProductionArr.map((order) => tempArr.push(order));
          stageProdFinishArr.map((order) => tempArr.push(order));
          stageDoneArr.map((order) => tempArr.push(order));
          this.stageSortDir = "new";
        }
        this.orders = tempArr;
        this.sortCurrType = "stage";
      }
    });
  }

  sortOrdersByOrderNumber() {
    if (this.sortCurrType != "orderNumber") this.orders = this.ordersCopy;
    if (this.numberSortDir == "oldFirst") {
      this.orders = this.orders.reverse();
      this.numberSortDir = "newFirst";
    } else if (this.numberSortDir == "newFirst") {
      this.orders = this.orders.reverse();
      this.numberSortDir = "oldFirst";
    }
    this.sortCurrType = "orderNumber";
  }

  getLatesReport() {
    let excel = [...this.orders];

    excel = excel
      .map((o) => {
        o.formatedDate = new Date(
          `${o.deliveryDate.slice(6, 10)}-${o.deliveryDate.slice(
            3,
            5
          )}-${o.deliveryDate.slice(0, 2)}`
        );
        return o;
      })
      .filter((o) => {
        return o.formatedDate.getTime() < new Date().getTime();
      })
      .sort((a, b) => {
        return a.formatedDate.getTime() - b.formatedDate.getTime();
      });

    let fom = [];
    for (let order of excel) {
      fom.push({
        // "הזמנה+לקוח": order.NumberCostumer,
        "מס' הזמנה": order.orderNumber,
        לקוח: order.costumer,
        // 'מק"ט לקוח (פנימי)': order.costumerInternalId,
        "תאריך הזמנה": order.orderDate,
        "תאריך אספקה (משוער)": order.formatedDate,
        // "סוג הזמנה": order.type,
        // "משתמש": order.user,
        // "הערות": order.orderRemarks,
      });
    }

    this.excelService.exportAsExcelFile(
      fom,
      `דו"ח איחורים ${new Date().toString().slice(0, 10)}`
    );
  }

  getProblematicsReport() {
    this.loadingProblematics = true;
    this.ordersService.getProblematicsReport().subscribe((orderItems) => {
      this.problematicsModal = true;

      //filter orderItems without problems:
      this.problematicorderItems = orderItems
        .filter((oi) => {
          if (
            (oi.orderItem.problematicMaterials &&
              oi.orderItem.problematicMaterials.length > 0) ||
            (oi.orderItem.problematicComponents &&
              oi.orderItem.problematicComponents.length > 0)
          )
            return true;
        })
        .reverse();
      //
      this.loadingProblematics = false;
    });
  }

  getUriReport() {
    this.toastSrv.info("זה ייקח מספר דקות..", 'מכין דו"ח הזמנות.');
    this.loadingUri = true;
    this.ordersService.getUriReport().subscribe((data) => {
      this.loadingUri = false;
      let excel = [];
      for (let item of data) {
        try {
          let quantitySupplied = 0;
          if (item.orderItem.billing && item.orderItem.billing > 0) {
            quantitySupplied = item.orderItem.billing
              .map((b) => b.billQty)
              .reduce((a, b) => a + b, 0);
          }
          item.quantityRemained =
            Number(item.orderItem.quantity) - quantitySupplied;
          let missingComponents = [];
          if (item.componentsExplosion) {
            for (let component of item.componentsExplosion) {
              if (component.amount < 0) missingComponents.push(component._id);
            }
          }
          let stringifiedMissingComponents = JSON.stringify(missingComponents);
          excel.push({
            "מס' הזמנה": item.orderNumberString,
            "סוג הזמנה": item.type,
            לקוח: item.costumer,
            "תאריך הזמנה": item.orderDate,
            "צפי שניתן": item.deliveryDate,
            'מק"ט': item.orderItem.itemNumber,
            תאור: item.orderItem.discription,
            משקל: item.orderItem.netWeightGr,
            "כמות במלאי": item.amountEffi,
            "כמות בהזמנה": Number(item.orderItem.quantity),
            סופק: Number(item.orderItem.quantity) - item.quantityRemained,
            "יתרה לאספקה": item.quantityRemained,
            אצווה: item.batch,
            "2אצווה": item.batch2,
            "3אצווה": item.batch3,
            "4אצווה": item.batch4,
            "קו מילוי ראשי": item.itemTree[0].primaryLine,
            "קו מילוי משני": item.itemTree[0].secondaryLine,
            "תאריך מילוי צפוי": item.expectedFillingDate
              ? `${new Date(item.expectedFillingDate).getDate()}/${new Date(
                  item.expectedFillingDate
                ).getMonth()}/${new Date(
                  item.expectedFillingDate
                ).getFullYear()}`
              : "",
            "תאריך מילוי סופי": item.fillingDate
              ? `${new Date(item.fillingDate).getDate()}/${new Date(
                  item.fillingDate
                ).getMonth()}/${new Date(item.fillingDate).getFullYear()}`
              : "",
            "כמות שמילאו": isNaN(Number(item.quantity_Produced))
              ? ""
              : Number(item.quantity_Produced),
            "סטטוס מילוי": item.fillingStatus,
            // "קומפוננטים חסרים": stringifiedMissingComponents,
            "Main Component": item.itemTree[0].bottleAmount[0]._id,
            "Main Component Inventory": item.itemTree[0].bottleAmount[0].amount,
            "Sticker 1": item.itemTree[0].stickerAmount[0]._id,
            "Sticker 1 Inventory": item.itemTree[0].stickerAmount[0].amount,
            "Sticker 2": item.itemTree[0].sticker2Amount[0]._id,
            "Sticker 2 Inventory": item.itemTree[0].sticker2Amount[0].amount,
            הערות: item.orderItem.itemRemarks,
            // "מדבקות": ""
          });
        } catch (e) {
          console.log("error: ", e);
        }
      }
      this.excelService.exportAsExcelFile(excel, 'דו"ח הזמנות ' + new Date());
    });

    // remained:
    //   let quantitySupplied = item.billing
    //   .map((b) => b.billQty)
    //   .reduce((a, b) => a + b, 0);
    // item.quantityRemained = Number(item.quantity) - quantitySupplied;
  }
}
