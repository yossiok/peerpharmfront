import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { InventoryService } from "src/app/services/inventory.service";
import { InventoryRequestService } from "src/app/services/inventory-request.service";
import { NotificationService } from "src/app/services/notification.service";
import { ExcelService } from "src/app/services/excel.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-inventory-requests",
  templateUrl: "./inventory-requests.component.html",
  styleUrls: ["./inventory-requests.component.scss"],
})
export class InventoryRequestsComponent implements OnInit {
  constructor(
    private inventoryService: InventoryService,
    private inventoryReqService: InventoryRequestService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    private auth: AuthService
  ) {}

  ordersDemands: any = [];
  EditRowId2nd: any = "";
  expand: boolean = false;
  openOrder: string = "";
  newReqIncoming: boolean = false;
  allRequests: Array<any>;
  isAllowedToView: boolean = false;
  @Output() outPutItemsArray = new EventEmitter();

  ngOnInit() {
    console.log(this.auth.loggedInUser);
    this.isAllowedToView =
      this.auth.loggedInUser.screenPermission == "6" ? false : true;

    this.getAllHistoryRequests();
    this.notificationService.newInventoryReqEventEmitter.subscribe((data) => {
      if (data == "newInventoryReq") this.newReqIncoming = true;
      else this.getAllGeneralDemands();
    });
    this.getAllGeneralDemands();
  }

  // שבועיים אחרונים
  getAllHistoryRequests() {
    this.inventoryReqService
      .getInventoryRequestsListWeek()
      .subscribe((data) => {
        this.allRequests = data;
        console.log(this.allRequests);
      });
  }

  // getNewIncomingInventoryReq(){
  //   this.getAllGeneralDemands();
  // }

  // { reqStatus:"open" }
  getAllGeneralDemands() {
    this.inventoryReqService.getOpenInventoryRequestsList().subscribe((res) => {
      console.log(res);

      res.forEach((InvRequest) => {
        if (InvRequest.reqList != null && InvRequest.reqList != undefined) {
          InvRequest.reqList.map((item) => {
            item.isSelected = false;
            if (item.amount <= item.qntSupplied)
              item.cmptLineColor = "lightgreen";
            if (item.amount > item.qntSupplied && item.qntSupplied > 0)
              item.cmptLineColor = "LemonChiffon";
          });
        }
      });
      this.ordersDemands = res;
      this.newReqIncoming = false;
    });
  }

  //export to excel
  export() {
    console.log(this.ordersDemands);
    let excel = [];
    for (let demand of this.ordersDemands) {
      for (let req of demand.reqList) {
        excel.push({
          "Request Number": demand.reqNum,
          Date: demand.currDate,
          "From Warehouse": demand.fromWH,
          "To Warehouse": demand.toWH,
          Department: demand.toDepartment,
          User: demand.userName,
          "Item Number": req.itemNumber,
          "Delivery Date": demand.deliveryDate,
          amount: req.amount,
          Supplied: req.qntSupplied,
          Remarks: req.remarks,
        });
      }
    }
    this.excelService.exportAsExcelFile(
      excel,
      "Inventory Requests" + new Date().toString().slice(0, 10)
    );
  }

  getDetails(reqId, orderNumber): void {
    this.EditRowId2nd = reqId;
    if (this.expand === true) {
      this.expand = false;
      this.openOrder = "";
    } else {
      this.expand = true;
      this.openOrder = orderNumber;
    }
  }

  loadItems() {
    console.log(this.ordersDemands);
    // let demandObj =this.ordersDemands.filter(orderObj=>orderObj.order==this.openOrder)
    let demandObj = this.ordersDemands.filter(
      (orderObj) => orderObj.reqNum == this.openOrder
    );
    // console.log(demandObj);
    // console.log(demandObj[0].components);
    let tempArr = demandObj[0].reqList
      .filter((e) => e.isSelected == true)
      .map((elmnt) => {
        elmnt.reqNum = demandObj[0].reqNum;
        return elmnt;
      });
    console.log(tempArr);
    //let tempArr = demandObj[0].components.filter(e => e.isSelected == true).map(e => e = {"item":e.cmptN, "demandId":e._id});
    if (tempArr.length > 0) {
      this.outPutItemsArray.emit(tempArr);
    }
    console.log(tempArr);
  }

  closeInventoryReqManually(invReqId) {
    if (confirm("לא כל הכמויות סופקו לבקשת מלאי\nהאם לסגור בקשת מלאי?")) {
      this.inventoryReqService
        .closeRequest({ id: invReqId })
        .subscribe((res) => {
          if (res._id) {
            this.getAllGeneralDemands();
          }
        });
    }
  }
}
