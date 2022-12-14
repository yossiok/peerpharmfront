import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { OrdersService } from "../../../services/orders.service";
import { Router } from "@angular/router";
import * as moment from "moment-timezone";
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
    waiting: 0,
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

  sortByOrderDateFlag: boolean = false;
  sortByDeliveryDateFlag: boolean = false;
  sortByStageFlag: boolean = false;
  stageFilter: string = "";
  sortByCustomerNameFlag = false

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
        "??????????+????????": order.NumberCostumer,
        "????' ??????????": order.orderNumber,
        ????????: order.costumer,
        "????' ?????????? ????????": order.customerOrderNum,
        '????"?? ???????? (??????????)': order.costumerInternalId,
        "?????????? ??????????": order.orderDate,
        "?????????? ?????????? (??????????)": order.deliveryDate,
        "?????? ??????????": order.type,
        ??????????: order.user,
        ??????????: order.orderRemarks,
        ??????????: order.status,
        ??????: order.stage,
      });
    }
    this.excelService.exportAsExcelFile(
      orders,
      `????"?? ???????????? ${new Date().toString().slice(0, 10)}`
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
            "???????? ????????: " +
            item.itemNumber +
            ", " +
            "??????: " +
            item.fillingStatus +
            "| ";
        }

        orders.push({
          ??????????: order.openOrder.costumer,
          "????' ??????????": order.openOrder.orderNumber,
          ????????: order.openOrder.costumer,
          '????"?? ???????? (??????????)': order.openOrder.costumerInternalId,
          "????' ?????????? ????????": order.customerOrderNum,
          "?????????? ??????????": order.openOrder.orderDate,
          "?????????? ?????????? (??????????)": order.openOrder.deliveryDate,
          "?????? ??????????": order.openOrder.type,
          ??????????: order.openOrder.user,
          ??????????: order.openOrder.orderRemarks,
          ??????????: order.openOrder.status,
          ??????: order.openOrder.stage,
          ????????????: items,
        });
      }
      this.excelService.exportAsExcelFile(
        orders,
        `????"?? ???????????? ???????????? ${new Date().toString().slice(0, 10)}`
      );
    });
    console.log("orders: ", this.orders);
  }

  uploadFreeBatchesFile(ev) {
    if (confirm("?????? ?????? ???????? ?????????? ?????????? ?????????? ?")) {
      let remark = prompt("?????? ???????? ??????????");
      const target: DataTransfer = <DataTransfer>ev.target;
      //
      if (target.files.length > 1) {
        alert("???????? ?????????? ???????? ?????? ????????");
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
          batchNumber: <string>el["??????????"],
          orderNumber: <string>el["??????????"],
          originalQnt: <number>el["???????? ????????????"],
          updatedQnt: <number>el["???????? ????????????"],
          position: <string>el["??????????"],
          itemNumber: <string>el['????"??'],
          itemName: <string>el["????????"],
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
      for (let order of orders) {
        order.color = "white";
        if (order.deliveryDate) {
          order.deliveryDate = new Date(order.deliveryDate);
          // console.log(order.deliveryDate);

          if (order.deliveryDate <= new Date()) {
            order.color = "#ff9999";
          }
        }
        this.returnStageColor(order);
        Object.assign({ isSelected: false }, order);
        order.NumberCostumer = order.costumerInternalId + " " + order.costumer;
      }

      // orders.map((order) => {
      //   order.color = "white";
      //   let deliveryDateArr;
      //   if (order.deliveryDate && order.deliveryDate.includes("/")) {
      //     deliveryDateArr = order.deliveryDate.split("/");
      //     if (deliveryDateArr[0].length == 1) {
      //       deliveryDateArr[0] = "0" + deliveryDateArr[0];
      //     }
      //     if (deliveryDateArr[1].length == 1) {
      //       deliveryDateArr[1] = "0" + deliveryDateArr[1];
      //     }
      //   } else if (order.deliveryDate) {
      //     deliveryDateArr = order.deliveryDate.split("-");
      //     let tempV = deliveryDateArr[0];
      //     deliveryDateArr[0] = deliveryDateArr[2];
      //     deliveryDateArr[2] = tempV;

      //     order.deliveryDate =
      //       deliveryDateArr[0] +
      //       "/" +
      //       deliveryDateArr[1] +
      //       "/" +
      //       deliveryDateArr[2];

      //     // let newDate =
      //     //   deliveryDateArr[2] +
      //     //   "-" +
      //     //   deliveryDateArr[1] +
      //     //   "-" +
      //     //   deliveryDateArr[0];
      //     // order.deliveryDate = new Date(newDate);
      //   }
      //   let todayDateArr = this.today.split("/");
      //   if (parseInt(deliveryDateArr[2]) < parseInt(todayDateArr[2])) {
      //     //RED
      //     order.color = "#ff9999";
      //   } else {
      //     if (
      //       parseInt(deliveryDateArr[1]) < parseInt(todayDateArr[1]) &&
      //       parseInt(deliveryDateArr[2]) == parseInt(todayDateArr[2])
      //     ) {
      //       //RED
      //       order.color = "#ff9999";
      //     } else if (
      //       parseInt(deliveryDateArr[0]) < parseInt(todayDateArr[0]) &&
      //       parseInt(deliveryDateArr[1]) == parseInt(todayDateArr[1])
      //     ) {
      //       //RED
      //       order.color = "#ff9999";
      //     }
      //   }

      //   this.returnStageColor(order);
      //   Object.assign({ isSelected: false }, order);
      //   order.NumberCostumer = order.orderNumber + " " + order.costumer;
      // });
      this.orders = orders;
      this.ordersCopy = orders;
    });
  }

  returnStageColor(order) {
    if (order.stage == "waiting") {
      order.stageColor = "#ff3700";
      this.stagesCount.waiting++;
    } else if (order.stage == "new" || order.stage == "customerApproved") {
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
        orderDateConverted: this.orderDate.nativeElement.value,
        costumer: this.costumer.nativeElement.value,
        deliveryDate: this.deliveryDate.nativeElement.value,
        deliveryDateConverted: this.deliveryDate.nativeElement.value,
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
        if (confirm("???? ?????????? ?????????????? ????????????")) {
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
    if (value.length < 3) {
      this.toastSrv.warning('????/????"?? ???????????? ?????????? ?????? 2 ??????????');
      return;
    }
    this.lodingOrders = true;
    this.ordersService
      .getAllOpenOrderItemsByItemValue(value)
      .subscribe((data) => {
        this.lodingOrders = false;
        if (value.match(/[a-z, A-Z]/)) {
          value = `Item name: ${value}`;
        } else {
          value = `Item number: ${value}`;
        }
        this.filterValue = value;
        this.orders = this.ordersCopy.filter((orderFromTable) =>
          data.find(
            (orderFromServer) =>
              orderFromServer.orderNumber == orderFromTable.orderNumber
          )
        );
        console.log(this.orders);
      });
  }
  filterByOrderNumber(value) {
    if (value.length < 3) {
      this.toastSrv.warning("???????? ???????????? ???????? ?????????? ?????? 2 ??????????");
      return;
    }
    this.lodingOrders = true;
    this.ordersService
      .getAllOpenOrdersByIncludeNumber(value)
      .subscribe((data) => {
        this.lodingOrders = false;
        this.filterValue = `Order Number: ${value}`;
        this.orders = data;
      });
  }

  filterByCustomer(value) {
    if (value.length < 3) {
      this.toastSrv.warning("???????? ???????????? ?????????? ???????? ?????????? ?????? 2 ??????????");
      return;
    }
    this.lodingOrders = true;
    this.ordersService
      .getAllOpenOrdersByIncludeCustomer(value)
      .subscribe((data) => {
        this.lodingOrders = false;
        this.filterValue = value;
        this.orders = data;
      });
  }
  filterByOrderDate(startDate, endDate) {
    if (!startDate || !endDate) {
      if (!startDate) {
        this.toastSrv.warning("???? ???????????? ?????????? ?????????? ??????????");
      }
      if (!endDate) {
        this.toastSrv.warning("???? ???????????? ?????????? ???????? ??????????");
      }
      return;
    }
    this.lodingOrders = true;
    this.ordersService
      .getAllOpenOrdersByOrderDate(startDate, endDate)
      .subscribe((res) => {
        this.orders = res;
        let startYear = startDate.split("-")[0];
        let startMonth = startDate.split("-")[1];
        let startDay = startDate.split("-")[2];
        let startStr = startDay + "/" + startMonth + "/" + startYear;

        let endYear = endDate.split("-")[0];
        let endMonth = endDate.split("-")[1];
        let endDay = endDate.split("-")[2];
        let endStr = endDay + "/" + endMonth + "/" + endYear;
        this.filterValue = `???????????? ?????????? ?? ${startStr} ?????? ${endStr}`;
        this.lodingOrders = false;
      });
  }
  filterByDeliveryDate(startDate,endDate){
    if(!startDate || !endDate){
      if(!startDate){
        this.toastSrv.warning("???? ???????????? ?????????? ?????????? ??????????")
      }
      if(!endDate){
        this.toastSrv.warning("???? ???????????? ?????????? ???????? ??????????")
      }
      return
    }
    this.lodingOrders = true;
    this.ordersService.getAllOpenOrdersByDeliveryDate(startDate,endDate).subscribe((res)=>{
      this.orders = res
      let startYear = startDate.split("-")[0]
      let startMonth = startDate.split("-")[1]
      let startDay = startDate.split("-")[2]
      let startStr = startDay + "/" + startMonth + "/" + startYear

      let endYear = endDate.split("-")[0]
      let endMonth = endDate.split("-")[1]
      let endDay = endDate.split("-")[2]
      let endStr = endDay + "/" + endMonth + "/" + endYear
      this.filterValue = `???????????? ?????????? ??${startStr} ?????? ${endStr}`
      this.lodingOrders = false;
    })

  }

  filterByStage() {
    if (this.stageFilter == "") {
      this.toastSrv.warning("???? ???????? Stage");
      return;
    }
    let stage = "";
    switch (this.stageFilter) {
      case "new":
        stage = "??????";
        break;
      case "done":
        stage = "?????????? ??????????";
        break;
      case "allCmpt":
        stage = "???? ?????????????? ????????????";
        break;
      case "production":
        stage = "???????? ????????????";
        break;
      case "prodFinish":
        stage = "?????? ??????????";
        break;
      case "partialCmpt":
        stage = "???????????? ???????????? ??????????";
        break;
      case "waitToCustomer":
        stage = "?????????? ???????????? ????????";
        break;
      case "customerApprove":
        stage ='???????? ??"?? ????????';
        break;

      default:
        break;
    }
    this.lodingOrders = true;
    this.ordersService
      .getAllOpenOrderByStage(this.stageFilter)
      .subscribe((res) => {
        this.orders = res;
        this.filterValue = `Stage: ${stage}`;
        this.lodingOrders = false;
      });
  }

  allOrders(elements: Array<any>) {
    this.orders = this.ordersCopy;
    this.filterValue = "";
    this.stageFilter = "";
    elements.forEach((elm) => {
      elm.value = "";
    });
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
    try {
      this.orders = this.ordersCopy;
      console.log(this.orders[20]);

      if (type == "order") {
        if (this.sortByOrderDateFlag) {
          this.orders.sort(function (a, b) {
            if (
              new Date(a.orderDate).getTime() > new Date(b.orderDate).getTime()
            ) {
              return -1;
            }
            if (
              new Date(a.orderDate).getTime() < new Date(b.orderDate).getTime()
            ) {
              return 1;
            }
          });
          this.sortByOrderDateFlag = !this.sortByOrderDateFlag;
        } else {
          this.orders.sort(function (a, b) {
            if (
              new Date(a.orderDate).getTime() > new Date(b.orderDate).getTime()
            ) {
              return 1;
            }
            if (
              new Date(a.orderDate).getTime() < new Date(b.orderDate).getTime()
            ) {
              return -1;
            }
          });
          this.sortByOrderDateFlag = !this.sortByOrderDateFlag;
        }
      }


      if(type == "delivery"){

        if (this.sortByDeliveryDateFlag) {
          this.orders.sort(function (a, b) {
            if (
              new Date(a.deliveryDate).getTime() > new Date(b.deliveryDate).getTime()
            ) {
              return -1;
            }
            if (
              new Date(a.deliveryDate).getTime() < new Date(b.deliveryDate).getTime()
            ) {
              return 1;
            }
          });
          this.sortByDeliveryDateFlag = !this.sortByDeliveryDateFlag;
        } else {
          this.orders.sort(function (a, b) {
            if (
              new Date(a.deliveryDate).getTime() > new Date(b.deliveryDate).getTime()
            ) {
              return 1;
            }
            if (
              new Date(a.deliveryDate).getTime() < new Date(b.deliveryDate).getTime()
            ) {
              return -1;
            }
          });
          this.sortByDeliveryDateFlag = !this.sortByDeliveryDateFlag;
        }

      }
    } catch (error) {
      console.log(error);
    }
  }

  checkboxAllOrders(ev) {
    this.orders.filter((e) => (e.isSelected = ev.target.checked));
  }

  sortOrdersByStage2() {
      if (this.sortByStageFlag) {
        this.orders.sort(function (a, b) {
          if (
            a.stage > b.stage
          ) {
            return -1;
          }
          if (
            a.stage < b.stage
          ) {
            return 1;
          }
        });
        this.sortByStageFlag = !this.sortByStageFlag;
      } else {
        this.orders.sort(function (a, b) {
          if (
              a.stage > b.stage
          ) {
            return 1;
          }
          if (
              a.stage < b.stage
          ) {
            return -1;
          }
        });
        this.sortByStageFlag = !this.sortByStageFlag;
      }
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
        // "??????????+????????": order.NumberCostumer,
        "????' ??????????": order.orderNumber,
        ????????: order.costumer,
        // '????"?? ???????? (??????????)': order.costumerInternalId,
        "?????????? ??????????": order.orderDate,
        "?????????? ?????????? (??????????)": order.formatedDate,
        // "?????? ??????????": order.type,
        // "??????????": order.user,
        // "??????????": order.orderRemarks,
      });
    }

    this.excelService.exportAsExcelFile(
      fom,
      `????"?? ?????????????? ${new Date().toString().slice(0, 10)}`
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
    this.toastSrv.info("???? ???????? ???????? ????????..", '???????? ????"?? ????????????.');
    this.loadingUri = true;
    this.ordersService.getUriReport().subscribe((data) => {
      this.loadingUri = false;
      console.log(data);
      let excel = [];
      for (let item of data) {
        try {
          // let quantitySupplied = 0;
          // if (item.orderItem.billing && item.orderItem.billing > 0) {
          //   quantitySupplied = item.orderItem.billing
          //     .map((b) => b.billQty)
          //     .reduce((a, b) => a + b, 0);
          // }
          // item.quantityRemained =
          //   Number(item.orderItem.quantity) - quantitySupplied;
          // let missingComponents = [];
          // if (item.componentsExplosion) {
          //   for (let component of item.componentsExplosion) {
          //     if (component.amount < 0) missingComponents.push(component._id);
          //   }
          // }
          // let stringifiedMissingComponents = JSON.stringify(missingComponents);
          excel.push({
            "????' ??????????": item.orderNumberString,
            ????????: item.customer,
            '????"??': item.itemNumber,
            ????????: item.description,
            "?????? ??????????": item.type,
            "?????????? ??????????": item.orderDate,
            "?????? ??????????": item.deliveryDate,
            ??????????: item.itemStatus,
            "?????????? ??????????": item.oiStatus,
            ????????: item.netWeightGr,
            "???????? ??????????": item.amountEffi,
            "???????? ????????????": Number(item.quantity),
            "???????? ????????????": item.quantityProduced,
            "???????? ????????????": item.quantitySupplied,
            "???????? ????????????": item.quantity - item.quantityProduced,
            ??????????: item.batchNumber,
            "2??????????": item.batch2,
            "3??????????": item.batch3,
            "4??????????": item.batch4,
            "???? ?????????? ????????": item.primaryLine,
            "???? ?????????? ????????": item.secondaryLine,
            // "?????????? ?????????? ????????": item.expectedFillingDate
            //   ? item.expectedFillingDate.substring(0, 10)
            //   : "",
            "?????????? ?????????? ????????": item.expectedFillingDate
              ? `${new Date(item.expectedFillingDate).getDate()}/${new Date(
                  item.expectedFillingDate
                ).getMonth()}/${new Date(
                  item.expectedFillingDate
                ).getFullYear()}`
              : "",

            "?????????? ?????????? ????????": item.fillingDate
              ? `${new Date(item.fillingDate).getDate()}/${new Date(
                  item.fillingDate
                ).getMonth()}/${new Date(item.fillingDate).getFullYear()}`
              : "",
            "???????? ????????????": isNaN(Number(item.quantity_Produced))
              ? ""
              : Number(item.quantity_Produced),
            "?????????? ??????????": item.fillingStatus,
            // "???????????????????? ??????????": stringifiedMissingComponents,
            "Bottle Number": item.bottleNumber,
            "Bottle Stock": item.bottleAmount,
            "Box Number": item.boxNumber,
            "Box Stock": item.boxAmount,
            "Cap Number": item.capNumber,
            "Cap Stock": item.capAmount,
            "Carton Number": item.cartonNumber,
            "Pcs/Carton": item.PcsCarton,
            "Carton Stock": item.cartonAmount,
            "Carton2 Number": item.cartonNumber2,
            "Pcs/Carton2": item.PcsCarton2,
            "Carton2 Stock": item.cartonAmount2,
            "Pump Number": item.pumpNumber,
            "Pump Stock": item.pumpAmount,
            "Seal Number": item.sealNumber,
            "Seal Stock": item.sealAmount,
            "Sticker Number": item.stickerNumber,
            "Sticker Stock": item.stickerAmount,
            "Sticker2 Number": item.sticker2Number,
            "Sticker2 Stock": item.sticker2Amount,
            ??????????: item.itemRemarks,
            // "????????????": ""
          });
        } catch (e) {
          console.log("error: ", e);
        }
      }
      this.excelService.exportAsExcelFile(excel, '????"?? ???????????? ' + new Date());
    });

    // remained:
    //   let quantitySupplied = item.billing
    //   .map((b) => b.billQty)
    //   .reduce((a, b) => a + b, 0);
    // item.quantityRemained = Number(item.quantity) - quantitySupplied;
  }

  sortOrdersCustomerName(){
    if(this.sortByCustomerNameFlag){

      this.orders.sort((a,b)=>{
        if(a.costumer < b.costumer){return -1}
        if(a.costumer > b.costumer){return 1}
        return 0
      })

    }else{

      this.orders.sort((a,b)=>{
        if(a.costumer < b.costumer){return 1}
        if(a.costumer > b.costumer){return -1}
        return 0
      })

    }

    this.sortByCustomerNameFlag = !this.sortByCustomerNameFlag

  }

  getValue = (date: string | Date | null | undefined) => {
    return date ? moment(date).tz("utc").format("YYYY-MM-DD") : null;
  }
}
