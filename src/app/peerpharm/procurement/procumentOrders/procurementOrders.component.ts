import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { Procurementservice } from "../../../services/procurement.service";
import { ExcelService } from "src/app/services/excel.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { SuppliersService } from "src/app/services/suppliers.service";
import { InventoryService } from "src/app/services/inventory.service";
import { AuthService } from "src/app/services/auth.service";
import { ArrayServiceService } from "src/app/utils/array-service.service";
import { PurchaseData } from "./PurchaseData";
import { ActivatedRoute } from "@angular/router";
import { Currencies } from "../Currencies";
import { UsersService } from "src/app/services/users.service";
import { FormControl, FormGroup } from "@angular/forms";
import { OrdersService } from "src/app/services/orders.service";

@Component({
  selector: "app-procurement-orders",
  templateUrl: "./procurementOrders.component.html",
  styleUrls: ["./procurementOrders.component.scss"],
})
export class ProcurementOrdersComponent implements OnInit {
  @ViewChild("arrivedAmount") arrivedAmount: ElementRef;
  @ViewChild("itemRemarks") itemRemarks: ElementRef;
  @ViewChild("orderAmount") orderAmount: ElementRef;
  @ViewChild("orderCoin") orderCoin: ElementRef;
  @ViewChild("referenceNumber") referenceNumber: ElementRef;
  @ViewChild("recommendRemarks") recommendRemarks: ElementRef;
  @ViewChild("supplierPrice") supplierPrice: ElementRef;
  @ViewChild("expectedDate") expectedDate: ElementRef;
  @ViewChild("printRecommendBtn") printRecommendBtn: ElementRef;
  @ViewChild("fromDateStr") fromDateStr: ElementRef;
  @ViewChild("toDateStr") toDateStr: ElementRef;
  @ViewChild("purchaseRemarks") purchaseRemarks: ElementRef;
  @ViewChild("purchaseArrivalDate") purchaseArrivalDate: ElementRef;
  @ViewChild("printBillBtn") printBillBtn: ElementRef;
  @ViewChild("updateCurrencies") updateCurrencies: ElementRef;
  @ViewChild("printOrdersBtn") printOrdersBtn: ElementRef;
  @ViewChild("printRequest") printRequest: ElementRef;

  linkDownload: String = "";
  expandNumber: String;
  requestToPurchase: any;
  purchaseRecommendations: any[] = [];
  purchaseRecommendationsCopy: any[] = [];
  checkedRecommendations: any[] = [];
  printBill: boolean = false;
  recommendStockItemsCollapse: boolean = false;
  orderDetailsModal: boolean = false;
  newPurchaseModal: boolean = false;
  purchaseRecommendationsModal: boolean = false;
  showImage: boolean = false;
  showLoader: boolean = true;
  showInfoModal: boolean = false;
  invoiceModal: boolean = false;
  bill: boolean = false;
  procurementData: any[];
  procurementDataClosed: any[] = [];
  procurementDataNoFilter: any[];
  procurementDataCopy: any[];
  procurementArrivals: any[] = [];
  procurementArrivalsCopy: any[] = [];
  currentOrder: any[];
  currentItems: any[];
  certificate: any[];
  allSuppliers: any[];
  billToPrint: any[];
  currentSupplier: any;
  purchaseData: PurchaseData;
  user: any;
  currRecommend: any;
  currentInvoice: any;
  sumCharge: any;
  sumChargeTaxes: any;
  priceAlert: Boolean = false;
  currStatus: any;
  currOrderNumber: any;
  infoToStatus: any;
  totalAmount: number = 0;
  priceTaxes: any;
  totalPrice: number = 0;
  totalPriceWithTaxes: any;
  currCoin: any;
  filterStatus: any;
  importantRemarks: any;
  orderDate: any;
  outOfCountry: any;
  country: boolean = false;
  newRecommend: any;
  isEdit: boolean = false;
  fetchingOrders: boolean = true;
  newPurchaseAllowed: boolean = false;
  currencies: Currencies;
  EditRowId: any = "";
  totalPriceNis: number = 0;
  printSum: boolean = false;
  nisSymbol: string = "\u20AA";
  usdSymbol: string = "$";
  eurSymbol: string = "\u20AC";
  gbpSymbol: string = "\u00A3";
  loadingRecommendations: boolean;
  arrivalDate: any;
  destinationLine: any;
  chooseMultipleSuppliers: boolean = false;
  // users: import("c:/tommy/system/peerpharmfront/src/app/peerpharm/taskboard/models/UserInfo").UserInfo[];
  users: any;
  newItem = {
    itemNumber: "",
    itemName: "",
    coin: "",
    measurement: "",
    supplierPrice: "",
    supplierAmount: "",
    color: "",
    orderNumber: "",
    itemRemarks: "",
    itemPrice: 0,
    remarks: "",
  };

  filterForm: FormGroup = new FormGroup({
    status: new FormControl(null),
    category: new FormControl(null),
    itemType: new FormControl(null),
    userName: new FormControl(null),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null),
    orderNumber: new FormControl(null),
    supplier: new FormControl(null),
    supplier2: new FormControl(null),
    itemNumber: new FormControl(null),
    origin: new FormControl(null),
  });
  purchaseRecommendationToPrint: any = {};
  loadingProblematics: boolean = false;
  problematicsModal: boolean = false;
  problematicsModalSelect: boolean = false;
  problematicItems: any[];
  problematicsType: string;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    // this.edit('', '');
    // this.editRecommend('', '')
  }

  @HostListener("document:keydown", ["$event"]) handleKeyboardEvent(
    event: KeyboardEvent
  ): void {
    if (event.key === "F2") {
      if (this.orderDetailsModal == true) {
        this.orderDetailsModal = false;
      } else if (this.newPurchaseAllowed) {
        this.orderDetailsModal = true;
      }
    }
    if (event.key === "F10") {
      if (
        this.orderDetailsModal === false &&
        this.purchaseRecommendationsModal === false &&
        this.fetchingOrders === false
      ) {
        this.printOrdersBtn.nativeElement.click();
      }
    }

    if (event.key === "F8") {
      this.modalService.open(this.updateCurrencies);
    }

    if (event.key === "F4") {
      if (this.purchaseRecommendationsModal == true) {
        this.purchaseRecommendationsModal = false;
      } else {
        this.purchaseRecommendationsModal = true;
      }
    }
  }

  constructor(
    private toastr: ToastrService,
    private procurementservice: Procurementservice,
    private excelService: ExcelService,
    private supplierService: SuppliersService,
    private inventoryService: InventoryService,
    private authService: AuthService,
    private arrayService: ArrayServiceService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UsersService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.getAllUsers();
    this.getCurrencies();
    this.getAllPurchaseRecommends();
    this.getAllSuppliers();
    this.user = this.authService.loggedInUser.firstName;
    if (this.authService.loggedInUser.authorization.includes("newPurchase")) {
      this.newPurchaseAllowed = true;
    }
    this.inventoryService.newRecommendEmitter.subscribe((data) => {
      this.purchaseRecommendations.push(data);
    });
    //isClosed is a boolean parameter, default value is false
    let isClosed = false;
    this.getAllProcurementOrders(isClosed);
  }
  //The isClosed argument is sent from filterPurchaseOrders()
  getAllProcurementOrders(isClosed) {
    this.orderDetailsModal = false;
    this.fetchingOrders = true;
    // this.procurementservice.getAllPurchasesObservable(isClosed).subscribe(
    this.procurementservice.getAllPurchaseOrders(isClosed).subscribe(
      (purchases) => {
        if (purchases.length > 0) {
          this.showLoader = false;
          if (this.procurementData && isClosed) {
            this.procurementDataClosed = this.procurementData =
              this.procurementData.filter((order) => order.status == "closed");
            this.procurementDataClosed = this.procurementData =
              this.procurementData.concat([...purchases]);
            console.log(
              `${this.procurementDataClosed.length} closed orders were retrieved`
            );
          } else if (this.procurementData)
            this.procurementData = this.procurementData
              .concat([...purchases])
              .filter((order) => order.status != "closed");
          else this.procurementData = purchases;

          if (!this.procurementDataCopy) {
            this.procurementDataCopy = [];
          }
          // this.procurementDataCopy = this.procurementDataCopy.concat([...purchases]).filter(purchase => purchase.status != 'canceled');
          // query result with the canceled, to enable filtering by canceled at the GUI
          this.procurementDataCopy = this.procurementDataCopy.concat([
            ...purchases,
          ]);
          //to show all the orders without the canceled in the GUI unless it is explicitly required by the user
          this.procurementData = this.procurementData.filter(
            (order) => order.status != "canceled"
          );
        }
      },
      () => {},
      () => {
        this.fetchingOrders = false;
        if (this.procurementData.length > 0) {
          this.procurementData.forEach((pd) => {
            if (pd.status == "open") {
              pd.stockitems.forEach((si) => {
                if (si.recommendationnum) {
                  let pr = this.purchaseRecommendations.find(
                    (x) => x.recommendNumber == si.recommendationnum
                  );
                  if (pr) {
                    let prsi = pr.stockitems.find((y) => y.number == si.number);
                    if (prsi)
                      prsi.remarks =
                        "open order exists from date:" +
                        new Date(pd.creationDate).toLocaleDateString() +
                        " order: " +
                        pd.orderNumber;
                  }
                }
              });
            }
          });
        }

        this.route.queryParams.subscribe((params) => {
          if (params["orderNumber"]) {
            for (let i = 1; i < this.procurementData.length; i++) {
              if (
                this.procurementData[i].orderNumber == params["orderNumber"]
              ) {
                this.viewOrderDetails(i);
              }
            }
          }
        });
      }
    );
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (users) =>
        (this.users = users.sort((a, b) => {
          if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1;
          else return -1;
        }))
    );
  }

  getCurrencies(): void {
    this.procurementservice.getCurrencies().subscribe((currencies) => {
      delete currencies[0]._id;
      this.currencies = currencies[0];
    });
  }

  setCurrencies() {
    this.procurementservice.setCurrencies(this.currencies).subscribe((res) => {
      if (res.error) this.toastr.error(res.error);
      else {
        delete res._id;
        this.toastr.info(`שערים שנשמרו: ${JSON.stringify(res)}`);
      }
    });
  }

  closePurchaseRequestsModal() {
    this.purchaseRecommendationsModal = false;
    this.purchaseRecommendations.forEach((pr) => {
      pr.stockitems.forEach((si) => {
        si.color = si.color == "lightgreen" ? "lightgreen" : "";
      });
    });
  }

  isSelected(ev, stockitem) {
    if (ev.target.checked == true) {
      stockitem.price = stockitem.lastorder.price;
      stockitem.coin = stockitem.lastorder.coin;

      stockitem.recommendationnum = ev.target.title;
      if (stockitem.customerOrder == "stock") {
        stockitem.isStock = true;
      } else {
        stockitem.isStock = false;
      }
      this.checkedRecommendations.push(stockitem);
      //check if this supplier is also in other purchase reccomendations
      this.purchaseRecommendations.forEach((pr) => {
        pr.stockitems.forEach((si) => {
          if (
            si.lastorder.supplierName == stockitem.lastorder.supplierName &&
            si.color != "lightgreen"
          )
            si.color = "yellow";
        });
      });
    } else {
      this.purchaseRecommendations.forEach((pr) => {
        pr.stockitems.forEach((si) => {
          if (
            si.lastorder.supplierName == stockitem.lastorder.supplierName &&
            si.color != "lightgreen"
          )
            si.color = "";
        });
      });
      for (let i = 0; i < this.checkedRecommendations.length; i++) {
        if (this.checkedRecommendations[i].itemNumber == stockitem.itemNumber)
          this.checkedRecommendations.slice(i, 1);
      }
    }
  }

  expandRecommend(recommendNumber) {
    this.recommendStockItemsCollapse = !this.recommendStockItemsCollapse;
    this.expandNumber = this.recommendStockItemsCollapse ? "" : recommendNumber;
  }

  moveToNewPurchase() {
    let result = confirm("are you sure you want to create a new order?");
    if (result) {
      this.purchaseRecommendationsModal = false;
      this.requestToPurchase = {
        type: this.checkedRecommendations[0].type,
        supplierName: this.checkedRecommendations[0].lastorder.supplierName,
        supplierNumber: this.checkedRecommendations[0].lastorder.supplierNumber,
        stockitems: this.checkedRecommendations,
        arrivalDate: null,
        remarks: "Created by Recommandation Request",
      };
      this.orderDetailsModal = true;
    }
  }

  checkRecommendedOrderedItems() {
    if (this.checkedRecommendations && this.checkedRecommendations.length > 0) {
      for (let item of this.checkedRecommendations) {
        this.procurementservice
          .checkRecommendationItemAsOrdered(item.number, item.recommendationnum)
          .subscribe((updatedRecommend) => {});
      }
      this.getAllPurchaseRecommends();
    }
  }

  deletePurchaseRequest(recommendationNumber) {
    if (
      confirm(`בקשה מספר ${recommendationNumber} תימחק לצמיתות. האם להמשיך?`)
    ) {
      this.purchaseRecommendations = [];
      this.procurementservice
        .deletePurchaseRequest(recommendationNumber)
        .subscribe((deleteResult) => {
          this.getAllPurchaseRecommends();
        });
    }
  }
  approveRequest(recommendationNumber) {
    if (confirm(`האם אתה מאשר את בקשה מספר ${recommendationNumber}?`)) {
      this.purchaseRecommendations = [];
      console.log("approve");
    }
  }

  printPurchaseRequest(recommendationNumber) {
    this.purchaseRecommendationToPrint = this.purchaseRecommendations.find(
      (pr) => pr.recommendNumber == recommendationNumber
    );
    setTimeout(() => this.printRequest.nativeElement.click(), 500);
  }

  //open in excel
  loadPurchasesItems() {
    var tempArr = [];
    for (let i = 0; i < this.procurementData.length; i++) {
      for (let j = 0; j < this.procurementData[i].stockitems.length; j++) {
        this.procurementData[i].stockitems[j].supplier =
          this.procurementData[i].supplierName;
        tempArr.push(this.procurementData[i].stockitems[j]);
      }
    }
    this.excelService.exportAsExcelFile(tempArr, "data");
  }

  async newProcurementSaved(e) {
    this.showLoader = true;
    await this.checkRecommendedOrderedItems();

    let index = this.procurementDataCopy.findIndex(
      (order) => order.orderNumber == e.orderNumber
    );
    if (index < 0) {
      this.procurementDataCopy.splice(0, 0, e);
    } else {
      this.procurementDataCopy.splice(index, 1, e);
    }
    this.filterPurchaseOrders();
    this.showLoader = false;

    // let isClosed = false;
    // this.getAllProcurementOrders(isClosed);
  }

  closeOrderModal(e) {
    this.orderDetailsModal = e;
    this.isEdit = e;
    this.requestToPurchase = null;
    this.purchaseData = null;
    this.checkedRecommendations = [];
  }

  filterPurchaseOrders() {
    this.procurementData = this.procurementDataCopy;

    let status = this.filterForm.value.status;
    let category = this.filterForm.value.category;
    let type = this.filterForm.value.itemType;
    let userName = this.filterForm.value.userName;
    let dateFrom = this.filterForm.value.dateFrom;
    let dateTo = this.filterForm.value.dateTo;
    let orderNumber = this.filterForm.value.orderNumber;
    let itemNumber = this.filterForm.value.itemNumber;
    let supplier = this.filterForm.value.supplier;
    let origin = this.filterForm.value.origin;
    // prevent status == null
    status = status ? status : "allOrders";

    if (status) {
      // Removed on 18/08/2021 by Dani Morag - no need to combine open and deliverd together
      // if (status == 'open') this.procurementData = this.procurementData.filter(p => p.status == status || p.status == 'supplied')
      //if status is isClosed get new query result from the DB with status == closed only one time
      if (status == "closed" && this.procurementDataClosed.length == 0) {
        let isClosed = true;
        this.getAllProcurementOrders(isClosed);
      }
      // If we aleady have the results of status == closed, use them from the procurementDataClosed array instead of query again the DB
      else if (status == "closed" && this.procurementDataClosed.length > 0)
        this.procurementData = this.procurementDataClosed;
      //removed on 17/08/21 by Dani Morag else if (status != 'allOrders' || status == 'canceled' || status == 'closed') this.procurementData = this.procurementData.filter(p => p.status == status)
      //if status is not open and not closed and not all, filter the procurmentData by the requested status
      else if (status != "allOrders") {
        this.procurementData = this.procurementData.filter(
          (p) => p.status == status
        );
      }
      // if status is 'allOrders', get all orders that are'nt closed or cancelled
      else
        this.procurementData = this.procurementData.filter(
          (purchase) =>
            purchase.status != "canceled" && purchase.status != "closed"
        );
    }

    if (category && category != "") {
      this.procurementData = this.procurementData.filter((order) => {
        for (let item of order.stockitems) {
          if (item.componentType == category) return true;
        }
      });
    }

    if (type) {
      if (type == "all") this.procurementData = this.procurementData;
      else
        this.procurementData = this.procurementData.filter(
          (order) => order.orderType == type
        );
    }

    if (userName) {
      if (userName == "all") this.procurementData = this.procurementData;
      else
        this.procurementData = this.procurementData.filter(
          (p) => p.user == userName
        );
    }

    if (dateFrom) {
      this.procurementData = this.procurementData.filter(
        (purchOrder) => purchOrder.creationDate > dateFrom
      );
    }

    if (dateTo) {
      this.procurementData = this.procurementData.filter(
        (purchOrder) => purchOrder.creationDate < dateTo
      );
    }
    // eran new Search
    if (orderNumber) {
      this.procurementData = this.procurementData.filter((purchOrder) =>
        purchOrder.orderNumber.toString().includes(orderNumber)
      );
      if (this.procurementData.length < 1) {
        this.procurementservice
          .getProcurementsByIncludeOrderNumber(orderNumber)
          .subscribe((res) => {
            this.procurementData = res;
          });
      }
    }

    if (supplier) {
      this.procurementData = this.procurementData.filter((purchOrder) =>
        purchOrder.supplierName.toLowerCase().includes(supplier)
      );
    }

    if (origin) {
      this.procurementData = this.procurementData.filter((purchOrder) =>
        purchOrder.origin ? purchOrder.origin == origin : false
      );
    }

    if (itemNumber) {
      this.procurementData = this.procurementData.filter((purchase) => {
        if (purchase.stockitems.length == 0 && itemNumber == "") return true;
        for (let item of purchase.stockitems) {
          if (item.number && item.number.includes(itemNumber)) {
            return true;
          }
        }
      });
    }
  }

  filterMultipleSuppliers() {
    let supplier = this.filterForm.value.supplier;
    let supplier2 = this.filterForm.value.supplier2;

    if (supplier2 && supplier) {
      this.procurementData = this.procurementDataCopy.filter(
        (purchOrder) =>
          purchOrder.supplierName.toLowerCase().includes(supplier) ||
          purchOrder.supplierName.toLowerCase().includes(supplier2)
      );
    }
  }

  resetFilters() {
    this.procurementData = this.procurementDataCopy;
    this.filterForm.reset();
  }

  hebStat(engStat) {
    switch (engStat) {
      case "approvedBySupplier":
        return "approved";
      case "waitingForApproval":
        return "waiting approval";
      case "open":
        return "open";
      case "closed":
        return "closed";
      case "supplied":
        return "delivered";
      case "partlyDelivered":
        return "partly delivered";
      case "canceled":
        return "canceled";
      case "sentBySupplier":
        return "sent by supplier";
      case "ETD":
        return "Estimated Departure";
      case "ETA":
        return "Estimated Arrival";
      case "ready":
        return "ready";
      case "cstClear":
        return "custom cleared";
    }
  }

  setStatusColor(status) {
    switch (status) {
      case "open":
        return "";
      case "closed":
        return "brown";
      case "waitingForApproval":
        return "orange";
      case "approvedBySupplier":
        return "lightgreen";
      case "supplied":
        return "#09d5e8"; //delivered
      case "partlyDelivered":
        return "#0742e6"; //delivered
      case "canceled":
        return "#9198a3";
      case "sentBySupplier":
        return "#17e610";
      case "ETD":
        return "#1553e6";
      case "ETA":
        return "#15abe6";
      case "ready":
        return "#2f732d";
      case "cstClear":
        return "#e615e6";
    }
  }

  setStatusTextColor(status) {
    switch (status) {
      case "open":
        return "black";
      case "closed":
        return "white";
      case "waitingForApproval":
        return "black";
      case "approvedBySupplier":
        return "black";
      case "supplied":
        return "black"; //delivered
      case "partlyDelivered":
        return "black"; //delivered
      case "canceled":
        return "white";
      case "sentBySupplier":
        return "black";
      case "ETD":
        return "white";
      case "ETA":
        return "white";
      case "ready":
        return "black";
      case "cstClear":
        return "black";
    }
  }

  editRemarks(orderNumber) {
    if (orderNumber != "") {
      this.EditRowId = orderNumber;
    } else {
      this.EditRowId = "";
    }
  }

  printRecommend(recommend) {
    this.currRecommend = recommend;
    this.printRecommendBtn.nativeElement.click();
  }

  setLinkDownlowd(id) {
    this.linkDownload =
      "http://peerpharmsystem.com/procurementOrderController/getpdf?_id=" + id;
  }
  setLinkDownlowdTwo(id) {
    this.linkDownload =
      "http://peerpharmsystem.com/procurementOrderController/getpdfTwo?_id=" +
      id;
  }

  updateArrivalDate(ev, orderNumber) {
    var arrivalDate = ev.target.value;

    var order = this.procurementData.find((o) => o.orderNumber == orderNumber);
    order.validDate = arrivalDate;

    this.procurementservice.updatePurchaseRemarks(order).subscribe((data) => {
      if (data) {
        this.toastr.success("תאריך עודכן בהצלחה !");
        this.editRemarks("");
      }
    });
  }

  addMoreInfo() {
    var status = this.currStatus + " " + this.infoToStatus;
    var orderNumber = this.currOrderNumber;
    this.procurementservice
      .changeStatus(status, orderNumber)
      .subscribe((data) => {
        if (data) {
          let isClosed = false;
          this.getAllProcurementOrders(isClosed);
          this.toastr.success("סטטוס עודכן בהצלחה !");
          this.showInfoModal = false;
        } else {
          this.toastr.error("error");
        }
      });
  }

  findInInventory(componentN) {
    location.href =
      "http://peerpharmsystem.com/#/peerpharm/inventory/stock?componentN=" +
      componentN;
  }

  sortTable(typeOfSort) {
    switch (typeOfSort) {
      case "supplier":
        this.purchaseRecommendations = this.arrayService.sortByAttribute(
          this.purchaseRecommendations,
          "supplierName"
        );
        break;
      case "date":
        this.purchaseRecommendations = this.arrayService.sortByAttribute(
          this.purchaseRecommendations,
          "date"
        );
        break;
      case "ordered":
        this.purchaseRecommendations = this.arrayService.sortByAttribute(
          this.purchaseRecommendations,
          "color"
        );
        break;
      case "itemNumber":
        this.purchaseRecommendations = this.arrayService.sortByAttribute(
          this.purchaseRecommendations,
          "componentNumber"
        );
        break;
    }
  }

  printOrder(line) {
    this.showImage = false;
    var supplierNumber = line.supplierNumber;
    this.supplierService
      .getSuppliersByNumber(supplierNumber)
      .subscribe((data) => {
        this.currentSupplier = data[0];
        if (this.currentSupplier.origin == "import") {
          this.country = true;
        } else if (
          this.currentSupplier.origin != "import" &&
          line.stockitems[0].coin.toLowerCase() != "nis"
        ) {
          this.country = true;
        } else {
          this.country = false;
        }
      });

    this.currentOrder = line;
    this.currentItems = [...line.stockitems];
    // var total = 0;
    // var totalP = 0;
    // var totalN = 0;

    var coin = "";

    this.totalAmount = 0;
    this.totalPriceNis = 0;
    this.totalPrice = 0;
    this.printSum = false;
    for (let i = 0; i < this.currentItems.length; i++) {
      if (i == 0) {
        coin = this.currentItems[i].coin;
        if (this.currentItems.length == 1) this.printSum = true;
      } else {
        if (this.currentItems[i].coin == coin) this.printSum = true;
        else this.printSum = false;
      }
      this.currentItems[i].coin = this.currentItems[i].coin.toUpperCase();
      this.currentItems[i].itemPrice =
        Number(this.currentItems[i].quantity) *
        Number(this.currentItems[i].price);
      this.currentItems[i].localTotal =
        this.currentItems[i].itemPrice *
        this.currencies[this.currentItems[i].coin.toUpperCase()];
      this.totalAmount =
        this.totalAmount + Number(this.currentItems[i].quantity);
      this.totalPriceNis =
        this.totalPriceNis + Number(this.currentItems[i].localTotal);
      this.totalPrice =
        this.totalPrice + Number(this.currentItems[i].itemPrice);

      if (line.orderType == "component") {
        this.showImage = true;
        this.inventoryService
          .getCmptByNumber(this.currentItems[i].number, "component")
          .subscribe((data) => {
            this.currentItems[i].img = data[0].img;
          });
      }
    }

    this.importantRemarks = line.remarks;

    // var num = this.formatNumber(total)
    // var numTwo = this.formatNumber(totalP)
    this.priceTaxes = (this.totalPrice * 17) / 100;
    // var numFour = this.formatNumber(totalN);
    var combined = (this.totalPrice * 17) / 100 + this.totalPrice;
    var numFour = this.formatNumber(combined);
    this.totalPriceWithTaxes = numFour;

    if (this.printSum) {
      if (coin == "nis" || coin == "NIS" || coin == "ILS") {
        this.currCoin = this.nisSymbol;
      }
      if (coin == "eur" || coin == "EUR") {
        this.currCoin = "\u20AC";
      }
      if (coin == "usd" || coin == "USD") {
        this.currCoin = "$";
      }
      if (coin == "gbp" || coin == "GBP") {
        this.currCoin = "\u00A3";
      }
    }

    this.orderDate = line.creationDate.slice(0, 10);
    this.arrivalDate = line.arrivalDate ? line.arrivalDate.slice(0, 10) : null;
    this.printBill = true;
  }

  formatNumber(number) {
    number = number.toFixed(2) + "";
    var x = number.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }

  getProblematicsReport(type) {
    this.problematicsModalSelect = false;
    this.problematicsType = type.value;
    this.loadingProblematics = true;
    this.ordersService
      .getProblematicsReportForPurchase(this.problematicsType)
      .subscribe((problematicItems) => {
        this.problematicItems = problematicItems;
        this.problematicsModal = true;

        console.log(problematicItems);

        //
        this.loadingProblematics = false;
      });
  }

  getAllPurchaseRecommends() {
    this.loadingRecommendations = true;

    this.procurementservice.getAllPurchaseRecommends().subscribe((data) => {
      this.loadingRecommendations = false;
      // console.log(data);
      this.purchaseRecommendations = data;
      this.purchaseRecommendations.forEach((pr) => {
        pr.stockitems.forEach((si) => {
          si.type = pr.type;
          if (si.lastorder) {
            si.tooltip = `supplier name: ${si.lastorder.supplierName} | order number: ${si.lastorder.orderNumber}|
            price:${si.lastorder.price} | price:  ${si.lastorder.price}| coin: ${si.lastorder.coin} | quantity: ${si.lastorder.quantity}
            `;
          } else si.tooltip = "";
          si.color = si.color == "lightgreen" ? "lightgreen" : "";
        });
      });
    });
  }

  clearNewItem() {
    (this.newItem.itemNumber = ""),
      (this.newItem.itemName = ""),
      (this.newItem.coin = ""),
      (this.newItem.measurement = ""),
      (this.newItem.supplierPrice = ""),
      (this.newItem.supplierAmount = ""),
      (this.newItem.color = ""),
      (this.newItem.orderNumber = ""),
      (this.newItem.itemRemarks = ""),
      (this.newItem.itemPrice = 0),
      (this.newItem.remarks = "");
  }

  filterByComponent(ev) {
    var componentN = ev.target.value;
    if (componentN != "") {
      this.inventoryService
        .getCmptByitemNumber(componentN)
        .subscribe((data) => {
          this.purchaseRecommendations = data[0].purchaseRecommendations;
        });
    } else {
      this.purchaseRecommendations = this.purchaseRecommendationsCopy;
    }
  }

  dateChange() {
    if (
      this.fromDateStr.nativeElement.value != "" &&
      this.toDateStr.nativeElement.value != ""
    ) {
      this.procurementservice
        .getProcurementOrderItemByDate(
          this.fromDateStr.nativeElement.value,
          this.toDateStr.nativeElement.value
        )
        .subscribe((data) => {
          this.procurementData = data;
          this.procurementDataCopy = data;
        });
    } else {
      this.getAllProcurementOrders(false);
    }
  }

  searchNumber(ev) {
    this.procurementData = this.procurementDataCopy.filter((purchase) => {
      return purchase.orderNumber.toString().includes(ev.target.value);
    });
  }

  searchBySupplier(ev) {
    this.procurementData = this.procurementDataCopy.filter((purchase) => {
      return purchase.supplierName.toLowerCase().includes(ev.target.value);
    });
  }

  searchByItem(ev) {
    this.procurementData = this.procurementDataCopy.filter((purchase) => {
      if (purchase.stockitems.length == 0 && ev.target.value == "") return true;
      for (let item of purchase.stockitems) {
        if (item.number && item.number.includes(ev.target.value)) {
          return true;
        }
      }
    });
  }

  searchByCertNum(ev) {
    this.procurementData = this.procurementDataCopy.filter((purchase) => {
      if (purchase.deliveryCerts.length == 0 && ev.target.value == "")
        return true;
      for (let deliveryCert of purchase.deliveryCerts) {
        if (
          deliveryCert.certificateNumber &&
          deliveryCert.certificateNumber.includes(ev.target.value)
        ) {
          return true;
        }
      }
    });
  }

  exportAsXLSX(expression): void {
    switch (expression) {
      case "purchaseData":
        let temp = this.procurementData;
        temp.sort((a, b) => {
          return (
            new Date(a.creationDate).getTime() -
            new Date(b.creationDate).getTime()
          );
        });
        console.log(temp);
        let exelData = [];
        for (let purchase of temp) {
          exelData.push({
            Order: purchase.orderNumber,
            Supplier: purchase.supplierNumber,
            "": purchase.supplierName,
            Status: this.hebStat(purchase.status),
            ET:
              purchase.status == "ETA" || purchase.status == "ETD"
                ? purchase.statusChange
                  ? purchase.statusChange.slice(0, 10)
                  : ""
                : "",
            "Item Type": purchase.orderType,
            "Opened At": purchase.creationDate
              ? purchase.creationDate.slice(0, 10)
              : "",
            User: purchase.user,
            Remarks: purchase.remarks,
            Origin: purchase.origin,
          });
        }

        this.excelService.exportAsExcelFile(exelData, "purchase orders");
        break;

      case "purchaseRecommendations":
        this.excelService.exportAsExcelFile(
          this.purchaseRecommendations,
          "data"
        );
        break;

      case "purchaseArrivals":
        this.excelService.exportAsExcelFile(this.procurementArrivals, "data");
        break;

      case "billsToCheck":
        this.excelService.exportAsExcelFile(this.certificate, "data");
        break;

      case "purchaseItems":
        let conf = confirm("האם להוציא מהדוח שורות שסופקו?");
        let allItems = [];
        for (let purchaseOrder of this.procurementData) {
          if (purchaseOrder.stockitems)
            purchaseOrder.stockitems.map((item) => {
              let includeLine = true;
              if (conf) {
                if (item.arrivedAmount) {
                  let leftover = item.arrivedAmount - item.quantity;
                  console.log(item.arrivedAmount);
                  console.log(item.quantity);
                  if (leftover >= 0 && leftover < item.quantity * 0.2) {
                    includeLine = false;
                  }
                }
              }
              if (includeLine) {
                allItems.push({
                  Supplier:
                    purchaseOrder.supplierNumber +
                    " - " +
                    purchaseOrder.supplierName,
                  origin: purchaseOrder.origin,
                  PONum: purchaseOrder.orderNumber,
                  POstatus: purchaseOrder.status,
                  POstatusChange: new Date(purchaseOrder.statusChange),
                  itemNum: item.number,
                  itemName: item.name,
                  Type: item.componentType,
                  Price: item.price,
                  coin: item.coin,
                  Po_Amount: item.quantity,
                  Po_Delivered: item.arrivedAmount,
                  PO_Date: new Date(purchaseOrder.creationDate),
                  PO_Requested_Date: purchaseOrder.requestedDate
                    ? new Date(purchaseOrder.requestedDate)
                    : null,
                  PO_Approval_Date: purchaseOrder.arrivalDate
                    ? new Date(purchaseOrder.arrivalDate)
                    : null,
                  measurement: item.measurement,
                  totalPriceNIS: item.localTotal,
                  supplierItemNum: item.supplierItemNum,
                  shippingPrice: item.shippingPrice,
                  remarks: item.remarks,
                });
              }
            });
        }
        this.excelService.exportAsExcelFile(allItems, "purchase items");
        break;

      default:
    }
  }

  getAllSuppliers() {
    this.supplierService.getSuppliersDiffCollection().subscribe((data) => {
      this.allSuppliers = data;
    });
  }

  viewOrderDetails(index) {
    this.purchaseData = <PurchaseData>this.procurementData[index];
    if (!this.purchaseData.outOfCountry) this.purchaseData.outOfCountry = false;
    this.isEdit = true;
    this.orderDetailsModal = true;
  }

  open(modal) {
    this.modalService.open(modal);
  }
}
