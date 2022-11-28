import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  OnChanges,
} from "@angular/core";
import { InventoryService } from "src/app/services/inventory.service";
import { InventoryRequestService } from "src/app/services/inventory-request.service";
import { NotificationService } from "src/app/services/notification.service";
import { ExcelService } from "src/app/services/excel.service";
import { AuthService } from "src/app/services/auth.service";
import { FormGroup } from "@angular/forms";

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

  ordersDemands: any[] = [];
  ordersDemandsCopy: any[] = [];
  EditRowId2nd: any = "";
  expand: boolean = false;
  openOrder: string = "";
  newReqIncoming: boolean = false;
  allRequests: any[] = [];
  allRequestsCopy: any[] = [];
  isAllowedToView: boolean = false;
  editRequest: boolean = false;
  reqNum: number = null;

  @Output() outPutItemsArray = new EventEmitter();
  @ViewChild("tabGroup") tabGroup;
  @Input() refreshMessage: String;

  component: string = "";

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

  ngOnChanges() {
    console.log(this.refreshMessage);
    this.getAllHistoryRequests();
    this.getAllGeneralDemands();
  }

  // שבועיים אחרונים
  getAllHistoryRequests() {
    this.inventoryReqService
      .getInventoryRequestsListWeek()
      .subscribe((data) => {
        this.allRequests = data;
        this.allRequestsCopy = data;
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
      this.ordersDemandsCopy = res;
      this.ordersDemands = res;
      this.newReqIncoming = false;
    });
  }

  //export to excel
  export() {
    console.log(this.tabGroup.selectedIndex);
    console.log(this.ordersDemands);
    console.log(this.allRequests);
    let array2Export =
      this.tabGroup.selectedIndex == 0
        ? this.ordersDemands
        : this.tabGroup.selectedIndex == 1
        ? this.allRequests
        : [];

    let excel = [];
    for (let demand of array2Export) {
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

  searchDemandByComponent() {
    console.log(this.component);
    console.log(this.ordersDemandsCopy);

    this.ordersDemands = this.ordersDemandsCopy.filter((od) => {
      let item = od.reqList.find((rl) => rl.itemNumber == this.component);
      if (item) {
        item.cmptLineColor = "yellow";
        this.EditRowId2nd = od._id;
        this.expand = true;
        this.openOrder = od.reqNum;

        return od;
      }
    });
    console.log(this.ordersDemands);
  }
  clearSearch() {
    this.ordersDemands = this.ordersDemandsCopy;
    this.allRequests = this.allRequestsCopy;
    this.EditRowId2nd = null;
    this.expand = false;
    this.openOrder = null;
    this.component = "";
  }

  searchRequestByComponent() {
    console.log(this.component);
    console.log(this.allRequests);

    this.allRequests = this.allRequestsCopy.filter((od) => {
      let item = od.reqList.find((rl) => rl.itemNumber == this.component);
      if (item) {
        item.cmptLineColor = "yellow";
        this.EditRowId2nd = od._id;
        this.expand = true;
        this.openOrder = od.reqNum;

        return od;
      }
    });
    console.log(this.allRequests);
  }

  editRequestView(reqNum) {
    this.reqNum = reqNum;
    this.editRequest = true;
  }
}
