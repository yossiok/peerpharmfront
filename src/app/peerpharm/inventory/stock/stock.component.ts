import { map } from "rxjs/operators";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  ViewEncapsulation,
  HostListener,
} from "@angular/core";
import { InventoryService } from "../../../services/inventory.service";
import { UsersService } from "../../../services/users.service";
import { ActivatedRoute } from "@angular/router";
import { UploadFileService } from "src/app/services/helpers/upload-file.service";
import { HttpRequest } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import { UserInfo } from "../../taskboard/models/UserInfo";
//import { DEC } from '@angular/material';
import { ToastrService } from "ngx-toastr";
//import { toDate } from '@angular/common/src/i18n/format_date';
import { fstat } from "fs";

import { BatchesService } from "src/app/services/batches.service";
import { ItemsService } from "src/app/services/items.service";
import { ExcelService } from "src/app/services/excel.service";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
//import { Console } from '@angular/core/src/console';
import { Procurementservice } from "src/app/services/procurement.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { OrdersService } from "src/app/services/orders.service";
import { SuppliersService } from "src/app/services/suppliers.service";
import { CostumersService } from "src/app/services/costumers.service";
import { upperFirst } from "lodash";
import { FormsService } from "src/app/services/forms.service";
import { Currencies } from "../../procurement/Currencies";
import * as Braket from "aws-sdk/clients/braket";
import { Breakpoints } from "@angular/cdk/layout";

const defaultCmpt = {
  whoPays: "",
  payingCustomersList: [],
  componentN: "",
  componentName: "",
  componentNs: "",
  suplierN: "",
  suplierName: "",
  componentType: "",
  componentCategory: "",
  img: "",
  importFrom: "",
  lastModified: "",
  minimumStock: "",
  needPrint: "",
  packageType: "",
  packageWeight: "",
  remarks: "",
  jumpRemark: "",
  componentItems: [],
  input_actualMlCapacity: 0,
  alternativeComponent: "",
  comaxName: "",
  alternativeSuppliers: [],
  price: "",
  connectedProducts: [],
};

const defaultMaterial = {
  componentN: "",
  componentName: "",
  remarks: "",
  img: "",
  minimumStock: "",
  packageWeight: "",
  itemType: "",
  barcode: "",
  actualMlCapacity: "",
  unitOfMeasure: "",
  group: "",
  subGroup2: "",
  alternativeSuppliers: [],
  status: "",
  threatment: "",
  monthTillExp: "",
  monthAvgPcs: "",
  msds: "",
  coaMaster: "",
  function: "",
  measurement: "",
  notInStock: false,
  inciName: "",
  casNumber: "",
  composition: [],
  umNumber: "",
  imerCode: "",
  imerTreatment: "",
  allowQtyInStock: "",
  expiredQty: "",
  permissionDangerMaterials: "",
  storageTemp: "",
  storageDirections: "",
  frameQuantity: "",
  frameSupplier: "",
  location: "",
  quantityInStock: "",
  mixedMaterial: [],
  formuleRemarks: "",
  manualPrice: 0,
  manualCoin: "ILS",
  price: 0,
  coin: "ILS",
  priceUpdates: [],
};

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.scss"],
})
export class StockComponent implements OnInit {
  // resCmpt: any;

  @ViewChild("numberSearchInput") numberSearchInput: ElementRef;
  @ViewChild("invAmounts") invAmounts: ElementRef;

  itemmoveBtnTitle: string = "Item Movements";
  loadingMovements: boolean = false;
  currShelf: any;
  showItemDetails: boolean = true;
  showLoader: boolean = false;
  smallLoader: boolean = false;
  smallerLoader: boolean = false;
  openOrderRecommendModal: boolean = false;
  customersModal: boolean = false;
  showDeleteBtn: boolean = false;
  inventoryNewReqModal: boolean = false;
  itemsMovementModal: boolean = false;
  invRequestsModal: boolean = false;
  newPurchaseRecommendModal: boolean = false;
  newSpecificPurchaseRecommendModal: boolean = false;
  lastYearOutAmount: number = 0;
  itemMovements: any = [];
  materialPurchases: any[];
  stockItemPurchases: any[];
  allCustomers: any[];
  componentSuppliers: any[];
  itemShell: any[];
  components: any[];
  componentsCopy: any[];
  materialArrivals: any[];
  subscription: any;
  materialFilterType: any;
  materialFilterValue: any;
  filterMaterialOption: String;
  materialLocations: any[];
  items: any[];
  currItem: any;
  compositionName: any;
  compositionPercentage: any;
  compostionFunction: any;
  compositionCAS: any;
  compEdit: number = -1;
  recieveItemType: any;
  allComponentsPurchases: any[];
  allMaterialsPurchases: any[];
  expirationBatchDate: any;
  totalQuantity: String;
  sixMonth: number = 0;
  oneYear: number = 0;
  threeYears: number = 0;
  allowUserEditItem = false;
  updateSupplier = false;
  check = false;
  itemShellUpdates: any[] = [];
  recommendationReportModal: boolean = false;
  recommendationsReport: any[] = [];
  recommendationsReportCopy: any[] = [];
  sortToggle: number = 1;
  purchasers: any[] = [];
  monthsCount: number = null;
  materialUsage: any = null;
  componentUsage: any = null;

  resCmpt: any = defaultCmpt;

  alternativeSupplier: any = {
    name: "",
    material: "",
    price: "",
  };

  newQApallet: any = {
    customerName: "",
    allUnits: "",
    shelf: "",
    shelfId: "",
    shelfAmount: "",
    qaStatus: "מוכן לשליחה",
    itemNumber: "",
    palletStatus: "open",
    isPersonalPackage: false,
    kartonQuantity: "",
    lastFloorQuantity: 0,
    orderNumber: "",
    unitsInKarton: "",
    unitsQuantityPartKarton: 0,
    floorNumber: "",
  };
  alterSuppliers: any[];
  buttonColor: string = "#2962FF";
  buttonColor2: string = "white";
  buttonColor3: string = "white";
  fontColor: string = "white";
  fontColor2: string = "black";
  fontColor3: string = "black";
  openModal: boolean = false;
  openImgModal: boolean = false;
  openAmountsModal: boolean = false;
  openProcurementModal: boolean = false;
  openOrderAmountsModal: boolean = false;
  openProductAmountModal: boolean = false;
  procurementModalHeader: string;
  openModalHeader: string;
  // filteredComponents: any[];
  componentsUnFiltered: any[];
  componentsAmount: any[];
  tempHiddenImgSrc: any;
  procurmentQnt: Number;
  allocatedOrders: any[];
  allocatedProducts: any[];
  amountsModalData: any;
  itemAmountsData: any[];
  itemAmountsWh: any[];
  newAllocationOrderNum: string;
  newAllocationAmount: Number;
  itemIdForAllocation: String;
  rowNumber: number;
  orderItems: any;
  procurementInputEvent: any;
  newPurchaseRecommendation: FormGroup;
  stockType: String = "component";
  newItem: String = "";
  newItemBtn: String = "new";
  today: Date = new Date();
  //var's to edit itemshelf in allowed wh for user
  user: UserInfo;
  whareHouses: Array<any>;
  reallyAllWhareHouses: Array<any>;
  curentWhareHouseId: String;
  curentWhareHouseName: String;
  relatedOrderNum: String = "";
  //adding Stock amounts
  ordersAllocatedAmount: any[];
  newItemShelfQnt: number;
  newItemShelfBatchNumber: string = "";
  newItemShelfArrivalDate: number;
  newItemShelfPosition: String;
  newItemShelfWH: String;
  cmptTypeList: Array<any>;
  cmptCategoryList: Array<any> = [
    "Sacara",
    "Mineralium",
    "Arganicare",
    "Spa Pharma",
    "Olive",
    "Vitamin C",
    "Quinoa",
    "Andrea Milano",
    "Dermalosophy",
    "Kreogen",
    "Careline",
    "Frulatte",
    "Mediskin",
    "4Ever",
    "Adah Lazorgan",
    "Avalanche",
    "Abyssian",
    "Jahshan",
    "Mika",
    "Hyalunol",
    "Hemp",
    "Kiss",
    "Rose",
    "Collagen",
    "Gaya",
  ];
  emptyFilterArr: Boolean = true;
  currItemShelfs: Array<any>;
  updateStockItem: Boolean = false;
  stockAdmin: Boolean = false;
  isSuperAdmin: boolean = false;
  destShelfId: String;
  destShelf: String;
  destShelfQntBefore: Number = 0;
  originShelfQntBefore: Number = 0;
  amountChangeDir: String;
  sehlfChangeNavBtnColor: String = "";
  amountForPalletBtnColor: String = "";
  amountChangeNavBtnColor: String = "#1affa3";
  ItemBatchArr: Array<any>;
  filterVal: String = "";
  currModalImgSrc: String = "";
  productToFind: String = "";
  materialToFind: String = "";
  productResponse: any = {};
  linkDownload: String = "";
  mixMaterial: String;
  mixMaterialPercentage: String;
  arrivalDateExpired = true;
  newItemProcurmentDetails: FormGroup;
  newOrderProcurmentDetails: FormGroup;
  newTransportDetails: FormGroup;
  transportationItem: FormGroup;
  loadingExcel: Boolean = false;
  allSuppliers: any[];
  allPurchases: any[];
  totalComponentsValue: number = 0;
  allocatedAmount: number = null;

  MaterialArrivalStartDate: Date;
  MaterialArrivalEndDate: Date;

  purchaseStartDate: string = "";
  purchaseEndDate: string = "";

  measure: string;
  component: any = null;

  @ViewChild("filterByItem") filterByItem: ElementRef; //this.filterBySupplierN.nativeElement.value
  // @ViewChild('filterbyNum') filterbyNum: ElementRef; //this.filterbyNum.nativeElement.value
  @ViewChild("filterBySupplier") filterBySupplier: ElementRef; //this.filterbyNum.nativeElement.value

  @ViewChild("suppliedAlloc") suppliedAlloc: ElementRef;
  @ViewChild("newProcurmentQnt") newProcurmentQnt: ElementRef;
  @ViewChild("newProcurmentOrderNum") newProcurmentOrderNum: ElementRef;
  @ViewChild("newProcurmentExceptedDate") newProcurmentExceptedDate: ElementRef;

  @ViewChild("supplierName") supplierName: ElementRef;
  @ViewChild("manufacturer") manufacturer: ElementRef;
  @ViewChild("alterName") alterName: ElementRef;
  @ViewChild("alternativeMaterial") alternativeMaterial: ElementRef;
  @ViewChild("price") price: ElementRef;
  @ViewChild("coin") coin: ElementRef;
  @ViewChild("packageWeight") packageWeight: ElementRef;
  @ViewChild("priceLoading") priceLoading: ElementRef;
  @ViewChild("coinLoading") coinLoading: ElementRef;
  @ViewChild("expectedArrival") expectedArrival: ElementRef;
  @ViewChild("subGroup") subGroup: ElementRef;

  @ViewChild("materialToSearch") materialToSearch: ElementRef;

  //Update version For Component
  editVersionForm: FormGroup;

  // material array //
  materials: any[];
  allMaterialArrivals: any[];
  recommandPurchase: any = {
    remarks: "",
    amount: "",
    componentNumber: "",
    date: this.formatDate(new Date()),
    user: "",
    type: "",
    supplier: "",
    componentName: "",
  };

  supplier: any = {
    supplierName: "",
    price: "",
    coin: "",
    coinLoading: "",
    priceLoading: "",
    manufacturer: "",
    alternativeMaterial: "",
    alterName: "",
    subGroup: "",
    packageWeight: "",
  };

  resMaterial: any = defaultMaterial;
  itemExpectedArrivals: any;
  closeResult: string;
  filterParams: FormGroup;

  recommendStockItem = {
    name: "",
    number: "",
    quantity: "",
    threatment: "",
    measurement: "",
    customerOrder: "",
    urgent: false,
  };
  lastOrdersOfItem = [];
  fetchingOrders: boolean = false;
  currencies: Currencies;
  callingForCmptAmounts: boolean = false;
  gettingProducts: boolean;
  alloAmountsLoading: boolean = false;
  loadingText: string;
  lastCustomerOrders: any;
  supPurchases: any[] = [];
  allowPriceUpdate: boolean = false;
  dir: string;
  PPCLoading: boolean = false;
  searchBarcode: any;

  searchMenu: FormGroup = new FormGroup({
    itemNumber: new FormControl(""),
    itemName: new FormControl(""),
    requestNumber: new FormControl(""),
    poNumber: new FormControl(""),
    type: new FormControl(""),
  });

  // currentFileUpload: File; //for img upload creating new component

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.rowNumber = -1;
  }

  @HostListener("document:keydown", ["$event"]) handleKeyboardEvent(
    event: KeyboardEvent
  ): void {
    if (event.key === "F2") {
      if (this.openModal == true) {
        this.openModal = false;
      } else {
        this.newCmpt("new");
      }
    }
    if (event.key === "F4") {
      if (this.inventoryNewReqModal == true) {
        this.inventoryNewReqModal = false;
      } else {
        this.inventoryNewReqModal = true;
      }
    }

    if (event.key === "F7") {
      this.procurementRecommendations("minimumStock");
    }
    if (event.key === "F8") {
      if (this.itemsMovementModal == true) {
        this.itemsMovementModal = false;
      } else {
        this.itemsMovementModal = true;
      }
    }
    if (event.key === "F9") {
      if (this.itemsMovementModal == true) {
        this.itemsMovementModal = false;
      } else {
        this.itemsMovementModal = true;
      }
    }
    if (event.key === "F10") {
      this.newPurchaseRecommendModal = !this.newPurchaseRecommendModal;
    }
  }

  constructor(
    private formService: FormsService,
    private customerSrv: CostumersService,
    private supplierService: SuppliersService,
    private orderService: OrdersService,
    private modalService: NgbModal,
    private procuretServ: Procurementservice,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private uploadService: UploadFileService,
    private authService: AuthService,
    private toastSrv: ToastrService,
    private batchService: BatchesService,
    private itemService: ItemsService,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    this.editVersionForm = new FormGroup({
      date: new FormControl(new Date(this.today), Validators.required),
      versionNumber: new FormControl(null, Validators.required),
      description: new FormControl("", Validators.required),
      image: new FormControl(null, Validators.required),
      user: new FormControl(null, Validators.required),
    });

    this.filterParams = fb.group({
      componentN: new FormControl("", Validators.minLength(3)),
      componentName: new FormControl("", Validators.pattern("^[a-zA-Z]+$")),
      componentType: new FormControl(""),
      componentCategory: new FormControl(""),
    });

    this.newPurchaseRecommendation = fb.group({
      recommendNumber: new FormControl(""),
      remarks: new FormControl(""),
      date: new FormControl(this.formatDate(new Date()), Validators.required),
      user: new FormControl(""),
      mail: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      status: new FormControl("open"),
      stockitems: new FormControl([]),
      purchaser: new FormControl(""),
    });
  }
  @Output() sendDataToExpectedArrivalsModal = new EventEmitter();
  @Input() expectedArrivalItemData: any;

  checkPermission() {
    return Number(this.authService.loggedInUser.screenPermission) > 4;
  }

  //expected Arrivals modal
  getNewExpectedArrivalsData(outputeEvent) {
    console.log("getting new updated expected arrivals data");
    console.log(outputeEvent);
    if (outputeEvent == "closeModal") {
      this.openProcurementModal = false;
      this.resCmpt = {};
      //update expected arrivals info for item
    } else if (outputeEvent == "stockLineChanged") {
      console.log("this.resCmpt", this.resCmpt);
      this.inventoryService
        .getSingleComponentData(this.resCmpt._id)
        .subscribe((res) => {
          console.log("res[0]", res[0]);
          // this.componentsUnFiltered.filter(c=>{
          //   if(c._id==res[0]._id){
          //
          //     c.procurementArr= res[0].procurementArr;
          //   }
          //  });
          this.components.forEach((c) => {
            if (c._id == res[0]._id) {
              c.procurementArr = res[0].procurementArr;
            }
          });
          this.componentsUnFiltered.forEach((c) => {
            if (c._id == res[0]._id) {
              c.procurementArr = res[0].procurementArr;
            }
          });
        });
    }
  }

  fillSupplierInRec(ev) {
    let supplier = this.allSuppliers.find(
      (s) => s.suplierNumber == ev.target.value
    );
    this.newPurchaseRecommendation.controls.supplierName.setValue(
      supplier.suplierName
    );
  }

  fillSupplierDetails() {
    if (this.resCmpt.suplierN != "") {
      this.supplierService
        .getSuppliersByNumber(this.resCmpt.suplierN)
        .subscribe((data) => {
          if (data) {
            this.resCmpt.suplierName = data[0].suplierName;
          }
        });
    }
  }

  addStockItemToRecommend() {
    console.log(this.recommendStockItem);

    if (
      this.recommendStockItem.quantity == "" ||
      this.recommendStockItem.name == "" ||
      this.recommendStockItem.number == "" ||
      this.recommendStockItem.measurement == "" ||
      this.recommendStockItem.customerOrder == ""
    ) {
      this.toastSrv.error("אנא מלא את כל הפרטים של הפריט");
    } else {
      let objToPush = { ...this.recommendStockItem };
      const length =
        this.newPurchaseRecommendation.controls.stockitems.value.length;
      const productsArray =
        this.newPurchaseRecommendation.controls.stockitems.value;
      let isExits = false;

      for (let i = 0; i < length; i++) {
        if (productsArray[i].number == objToPush.number) {
          isExits = true;
        }
      }
      if (isExits) {
        for (let i = 0; i < length; i++) {
          if (
            this.newPurchaseRecommendation.controls.stockitems.value[i]
              .number == objToPush.number
          ) {
            this.newPurchaseRecommendation.controls.stockitems.value[
              i
            ].quantity += objToPush.quantity;
          }
        }
      } else {
        this.newPurchaseRecommendation.controls.stockitems.value.push(
          objToPush
        );
      }
      this.toastSrv.success("פריט נוסף בהצלחה !");
      this.recommendStockItem.quantity = "";
      this.recommendStockItem.name = "";
      this.recommendStockItem.number = "";
      this.recommendStockItem.measurement = "";
      this.recommendStockItem.customerOrder = "";
      this.recommendStockItem.urgent = false;
      this.itemAmountsData = [];
    }
  }

  deleteFromRecommendation(i) {
    this.newPurchaseRecommendation.controls.stockitems.value.splice(i, 1);
  }

  addSupplierToMaterial() {
    if (
      this.supplier.price == "" ||
      this.supplier.price == "" ||
      this.supplier.supplierName == ""
    ) {
      this.toastSrv.error("אנא תמלא שם ספק , מחיר ומטבע ");
    } else {
      this.resMaterial.alternativeSuppliers.push(this.supplier);

      this.toastSrv.success("ספק נוסף בהצלחה , לא לשכוח לעדכן מידע !");
      this.supplier = {
        supplierName: "",
        price: "",
        coin: "",
        coinLoading: "",
        priceLoading: "",
        manufacturer: "",
        alternativeMaterial: "",
        alterName: "",
        subGroup: "",
        packageWeight: "",
        expectedArrival: "",
      };
    }
  }
  addSupplierToComponent() {
    if (
      this.supplier.price == "" ||
      this.supplier.price == "" ||
      this.supplier.supplierName == ""
    ) {
      this.toastSrv.error("אנא תמלא שם ספק , מחיר ומטבע ");
    } else {
      this.resCmpt.alternativeSuppliers.push(this.supplier);
      this.toastSrv.success("ספק נוסף בהצלחה , לא לשכוח לעדכן מידע !");
      this.supplier = {
        supplierName: "",
        price: "",
        coin: "",
        coinLoading: "",
        priceLoading: "",
        manufacturer: "",
        alternativeMaterial: "",
        alterName: "",
        subGroup: "",
        packageWeight: "",
      };
    }
  }
  // getProcurementData(){
  //   this.inventoryService.getProcurementData().subscribe(data=>{

  //   })
  // }

  updateExpectedProcurment(stockItem) {
    this.resCmpt = stockItem;
    this.openProcurementModal = true;
  }

  async ngOnInit() {
    this.getCurrencies();
    this.getUser();
    this.getAllSuppliers();
    this.getAllCustomers();
    await this.getUserAllowedWH();
    if (this.route.queryParams) {
      if (this.route.snapshot.queryParams.componentN)
        this.filterByComponentN(this.route.snapshot.queryParams.componentN);
    }
    this.getPurchasers();
    this.getColor(new Date());
    this.numberSearchInput.nativeElement.focus();
    this.route.queryParams.subscribe((params) => {
      if (params.itemNumber || params.type) {
        let itemNumber = params.itemNumber;
        this.stockType = params.type;
        this.filterParams.controls.componentN.setValue(itemNumber);

        this.filterComponents();
      }
    });
    // if(itemNumber){
    //   this.setType("product")
    //   this.filterComponents(itemNumber)
    // }
  }

  getPurchasers() {
    this.usersService.getAllUsers().subscribe((data) => {
      this.purchasers = data.filter(
        (user) =>
          user.authorization.includes("newPurchase") &&
          user.authorization.includes("editPurchase")
      );

      console.log(this.purchasers);
    });
  }

  getItemPurchases(component) {
    let numbers = this.components.map((c) => c.componentN);
    if (component) {
      component.purchaseOrders = [];
    }
    this.procuretServ.getPurchasesForMulti(numbers).subscribe((purchases) => {
      console.log(purchases);
      for (let component of this.components) {
        for (let purchase of purchases) {
          for (let item of purchase.stockitems) {
            if (item.number == component.componentN) {
              purchase.arrivedAmount = item.arrivedAmount
                ? item.arrivedAmount
                : null;
              component.purchaseOrders
                ? component.purchaseOrders.push(purchase)
                : (component.purchaseOrders = [purchase]);
            }
          }
        }
      }
      this.smallLoader = false;
      this.toastSrv.warning("שים לב, לא כל הנתונים נטענו. טוען הקצאות..");
    });
  }

  getLastCustomerOrders() {
    this.orderService.getOpenOrdersLimit(200).subscribe((data) => {
      this.lastCustomerOrders = data;
    });
  }

  // Not used
  // getAllPurchases() {
  //   for (let component of this.components) {
  //     this.getItemPurchases(component, 0)
  //   }
  // }

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((data) => {
      this.allSuppliers = data;
    });
  }

  getAllItemShell() {
    this.itemService.getAllItemShells().subscribe((data) => {
      this.itemShell = data;
    });
  }

  getCurrencies() {
    this.procuretServ.getCurrencies().subscribe((currencies) => {
      delete currencies[0]._id;
      this.currencies = currencies[0];
    });
  }

  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(this.itemShell, "itemShell");
  }

  exportItemData() {
    const sortOrder = [
      "componentN",
      "componentName",
      "componentType",
      "actualMlCapacity",
      "componentCategory",
      "suplierN",
      "suplierName",
      "OrderNumber",
      "Customer",
      "OrderDate",
      "DeliveryDate",
      "amount",
      "alloAmount",
      "availableStock",
    ];

    let componentsForExcel = [];
    let x = 0;
    let y;
    for (let i = 0; i < this.components.length; i++) {
      componentsForExcel[x] = { ...this.components[i] };
      for (let z = 0; z < this.components[i].allocations.length; z++) {
        if (this.components[i].allocations[z]) {
          componentsForExcel[x + z] = { ...this.components[i] };
          componentsForExcel[x + z].OrderNumber =
            this.components[i].allocations[z].orderNumber;
          componentsForExcel[x + z].Customer =
            this.components[i].allocations[z].costumer;
          componentsForExcel[x + z].OrderDate =
            this.components[i].allocations[z].orderDate;
          componentsForExcel[x + z].DeliveryDate =
            this.components[i].allocations[z].deliveryDate;
        }
        y = z + 1;
      }
      x += y;
      // componentsForExcel[x+1] = {}
    }

    componentsForExcel.forEach((component) => {
      component.availableStock =
        Number(component.amount) - Number(component.alloAmount);
      delete component.alternativeSuppliers;
      delete component.allocations;
      delete component.procurementArr;
      delete component.productAllocation;
      delete component.allAllocatedOrders;
      delete component.purchaseOrders;
      delete component.composition;
      delete component.purchaseRecommendations;
      delete component.mixedMaterial;
      delete component.payingCustomersList;
      delete component._id;
      delete component.componentNs;
      delete component.img;
      delete component.lastModified;
      delete component.needPrint;
      delete component.packageType;
      delete component.packageWeight;
      delete component.remarks;
      delete component.amountKasem;
      delete component.amountRH;
      delete component.itemType;
      delete component.__v;
      delete component.showPurch;
      delete component.comaxName;
      delete component.frameQuantity;
      delete component.finalPrice;
      delete component.shippingPrice;
      delete component.procurementSent;
      delete component.procurementAmount;
      delete component.barcode;
    });
    this.excelService.exportAsExcelFile(
      componentsForExcel,
      "Item Orders Report",

      sortOrder
    );
  }

  exportCurrTable() {
    this.loadingExcel = true;
    this.makeFileForExcelDownload()
      .then((data: any[]) => {
        console.log(data);
        // var anyArr: any[]=data;
        switch (this.stockType) {
          case "component":
            this.excelService.exportAsExcelFile(
              data,

              "component stock table"
            );
            break;
          case "product":
            this.excelService.exportAsExcelFile(
              data,

              "product stock table"
            );
            break;
          case "material":
            this.excelService.exportAsExcelFile(
              data,

              "material stock table"
            );
            break;
          case "sticker":
            this.excelService.exportAsExcelFile(
              data,

              "sticker stock table"
            );
            break;
        }
        this.loadingExcel = false;
        // switch case;
      })
      .catch((errMsg) => {
        this.toastSrv.error(errMsg);
      });
  }

  makeFileForExcelDownload() {
    var that = this;
    var arr: any[] = [];
    return new Promise(function (resolve, reject) {
      var line = {};
      if (that.stockType == "component") {
        for (let i = 0; i < that.components.length; i++) {
          line = {
            "מספר פריט": that.components[i].componentN,
            'מק"ט פריט אצל הספק': that.components[i].componentNs,
            "שם הפריט": that.components[i].componentName,
            "סוג פריט": that.components[i].componentType,
            כמות: that.components[i].amount,
            "כמות מוקצת": that.components[i].alloAmount,
            "1מחיר": that.components[i].alternativeSuppliers[0]
              ? that.components[i].alternativeSuppliers[0].price
              : "",
            מטבע1: that.components[i].alternativeSuppliers[0]
              ? that.components[i].alternativeSuppliers[0].coin
              : "",
            מחיר2: that.components[i].alternativeSuppliers[1]
              ? that.components[i].alternativeSuppliers[1].price
              : "",
            מטבע2: that.components[i].alternativeSuppliers[1]
              ? that.components[i].alternativeSuppliers[1].coin
              : "",
            מחיר3: that.components[i].alternativeSuppliers[2]
              ? that.components[i].alternativeSuppliers[2].price
              : "",
            מטבע3: that.components[i].alternativeSuppliers[2]
              ? that.components[i].alternativeSuppliers[2].coin
              : "",
            "קישור לתמונה": that.components[i].img,
          };
          arr.push(line);
        }
        resolve(arr);
      } else if (that.stockType == "product") {
        for (let i = 0; i < that.components.length; i++) {
          line = {
            "מספר פריט": that.components[i].componentN,
            "שם המוצר": that.components[i].componentName,
            "כמות Kasem": that.components[i].amountKasem,
            "כמות Rosh-HaAyin": that.components[i].amountRH,
          };
          arr.push(line);
        }
        resolve(arr);
      } else if (that.stockType == "material") {
        for (let i = 0; i < that.components.length; i++) {
          line = {
            "מספר פריט": that.components[i].componentN,
            'שם החו"ג': that.components[i].componentName,
            "כמות ": that.components[i].amount,
            "1מחיר": that.components[i].alternativeSuppliers[0]
              ? that.components[i].alternativeSuppliers[0].price
              : "",
            מטבע1: that.components[i].alternativeSuppliers[0]
              ? that.components[i].alternativeSuppliers[0].coin
              : "",
            מחיר2: that.components[i].alternativeSuppliers[1]
              ? that.components[i].alternativeSuppliers[1].price
              : "",
            מטבע2: that.components[i].alternativeSuppliers[1]
              ? that.components[i].alternativeSuppliers[1].coin
              : "",
            מחיר3: that.components[i].alternativeSuppliers[2]
              ? that.components[i].alternativeSuppliers[2].price
              : "",
            מטבע3: that.components[i].alternativeSuppliers[2]
              ? that.components[i].alternativeSuppliers[2].coin
              : "",
          };
          arr.push(line);
        }
        resolve(arr);
      }
    });
  }

  updateSupplierDetails(component?) {
    var obj;
    if (component) {
      obj = {
        id: this.resCmpt._id,
        supplierName: this.supplierName.nativeElement.value,
        price: this.price.nativeElement.value,
        coin: this.coin.nativeElement.value,
        // coinLoading: this.coinLoading.nativeElement.value,
        priceLoading: this.priceLoading.nativeElement.value,
        manufacturer: this.manufacturer.nativeElement.value,
        alterName: this.alterName.nativeElement.value,
        packageWeight: this.packageWeight.nativeElement.value,
        subGroup: "",
        expectedArrival: "",
      };
    } else {
      obj = {
        id: this.resMaterial._id,
        supplierName: this.supplierName.nativeElement.value,
        price: this.price.nativeElement.value,
        coin: this.coin.nativeElement.value,
        // coinLoading: this.coinLoading.nativeElement.value,
        priceLoading: this.priceLoading.nativeElement.value,
        manufacturer: this.manufacturer.nativeElement.value,
        alternativeMaterial: this.alternativeMaterial.nativeElement.value,
        alterName: this.alterName.nativeElement.value,
        packageWeight: this.packageWeight.nativeElement.value,
        subGroup: "",
        expectedArrival: "",
      };
    }

    if (component) {
      if (this.resCmpt._id != undefined) {
        obj.subGroup = this.subGroup ? this.subGroup.nativeElement.value : "";
        obj.expectedArrival = this.expectedArrival
          ? this.expectedArrival.nativeElement.value
          : "";
      }
    } else {
      if (this.resMaterial._id != undefined) {
        obj.subGroup = this.subGroup ? this.subGroup.nativeElement.value : "";
        obj.expectedArrival = this.expectedArrival
          ? this.expectedArrival.nativeElement.value
          : "";
      }
    }

    if (obj.id == undefined || obj.id == null || obj.id == "") {
      obj.id = this.resCmpt._id;
    }

    this.inventoryService.updateSupplier(obj).subscribe((data) => {
      if (data) {
        var supplier;
        var updatedSupplier = data.alternativeSuppliers.find(
          (s) => s.supplierName == obj.supplierName
        );
        if (component)
          supplier = this.resCmpt.alternativeSuppliers.find(
            (s) => s.supplierName == obj.supplierName
          );
        else
          supplier = this.resMaterial.alternativeSuppliers.find(
            (s) => s.supplierName == obj.supplierName
          );
        if (!supplier)
          this.toastSrv.error(
            "Can't change supplier name. Please delete supplier and add new."
          );
        else {
          supplier.supplierName = updatedSupplier.supplierName;
          supplier.price = updatedSupplier.price;
          supplier.coin = updatedSupplier.coin;
          supplier.priceLoading = updatedSupplier.priceLoading;
          supplier.subGroup = updatedSupplier.subGroup;
          supplier.expectedArrival = updatedSupplier.expectedArrival;
          supplier.manufacturer = updatedSupplier.manufacturer;
          supplier.alternativeMaterial = updatedSupplier.alternativeMaterial;
          supplier.alterName = updatedSupplier.alterName;
          supplier.packageWeight = updatedSupplier.packageWeight;
          this.updateSupplier = false;
          this.rowNumber = -1;
          this.toastSrv.success("ספק עודכן בהצלחה !");
        }
      }
    });
  }

  getAllCustomers() {
    this.customerSrv.getAllCostumers().subscribe((data) => {
      this.allCustomers = data;
    });
  }

  addCustomerToPayingList(ev) {
    if (confirm("האם להוסיף לקוח זה לרשית לקוחות משלמים ?")) {
      if (this.resCmpt.payingCustomersList == undefined)
        this.resCmpt.payingCustomersList = [];
      this.resCmpt.payingCustomersList.push(ev.target.value);
      this.toastSrv.success("לקוח נוסף בהצלחה , לא לשכוח לעדכן פריט !");
    } else {
      console.log("no");
    }
  }

  //************************************************/

  getUserAllowedWH() {
    this.inventoryService.getWhareHousesList().subscribe((res) => {
      if (res) {
        this.reallyAllWhareHouses = res.filter(
          (wh) => wh.name != "Rosh HaAyin"
        );
        let displayAllowedWH = [];
        for (const wh of this.reallyAllWhareHouses) {
          if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
            displayAllowedWH.push(wh);
          }
        }
        if (this.authService.loggedInUser.authorization) {
          if (
            this.authService.loggedInUser.authorization.includes(
              "updateStockItem"
            )
          ) {
            this.updateStockItem = true;
          }
          if (
            this.authService.loggedInUser.authorization.includes("stockAdmin")
          ) {
            this.stockAdmin = true;
          }
          if (Number(this.authService.loggedInUser.screenPermission) < 4) {
            this.isSuperAdmin = true;
          }
        }

        this.whareHouses = displayAllowedWH;
        this.curentWhareHouseId = displayAllowedWH[0]._id;
        this.curentWhareHouseName = displayAllowedWH[0].name;
        if (this.curentWhareHouseName.includes("product")) {
          this.stockType = "product";
        } else {
          this.stockType = "component";
        }
      }
      console.log(res);
    });
  }

  open(modal) {
    if ((Object.keys(modal._def.references)[0] = "printInventoryValue")) {
      this.getTotalComponentsValue();
    }
    this.modalService.open(modal, {
      size: "lg",
      ariaLabelledBy: "modal-basic-title",
    });
  }

  checkIfItemIsActive(itemNumber) {
    return new Promise((resolve, reject) => {
      this.inventoryService
        .checkIfItemIsActive(itemNumber)
        .subscribe((data) => {
          if (data.msg) {
            console.log(data.msg);
            this.toastSrv.error(data.msg);
            resolve(data.msg);
            return;
          }
          resolve(data);
        });
    });
  }

  // start
  async getStockItemByNumber(ev) {
    let componentN = "";
    if (typeof ev == "string") {
      componentN = ev;
    } else if (typeof ev == "object") {
      componentN = ev.target.value;
    }

    if (componentN) {
      let notActive = await this.checkIfItemIsActive(componentN);
      console.log(notActive);
      if (notActive) {
        this.newSpecificPurchaseRecommendModal = false;
        this.recommendStockItem.number = "";
        this.recommendStockItem.name = "";
        this.recommendStockItem.quantity = null;
        this.recommendStockItem.measurement = null;
        this.recommendStockItem.customerOrder = "";

        alert("הפריט לא פעיל ולא ניתן להזמין אותו ");
        return;
      }

      this.recommendStockItem.number = componentN;

      //get existing amounts of and locations on shelfs
      this.inventoryService
        .getAmountOnShelfs(componentN)
        .subscribe(async (res) => {
          this.itemAmountsData = res.data;
          this.itemAmountsWh = res.whList;
        });

      this.inventoryService
        .getCmptByitemNumber(componentN)
        .subscribe((data) => {
          if (data) {
            this.recommendStockItem.name = data[0].componentName;
            if (data[0].itemType == "material") {
              if (data[0].threatment)
                this.recommendStockItem.threatment = data[0].threatment;
            }
          }
        });
    }
  }

  // E2
  sendRecommandation() {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      re.test(
        String(this.newPurchaseRecommendation.controls.mail.value).toLowerCase()
      )
    ) {
      this.newPurchaseRecommendation.controls.user.setValue(
        this.authService.loggedInUser.userName
      );
      this.inventoryService
        .addNewRecommendation(this.newPurchaseRecommendation.value)
        .subscribe((data) => {
          // this.inventoryService.onNewRecommend(this.recommandPurchase);
          if (data) {
            this.toastSrv.success("המלצת רכש נשלחה בהצלחה !");
            this.newPurchaseRecommendModal = false;
            this.newPurchaseRecommendation.reset();
            this.newPurchaseRecommendation.controls.stockitems.setValue([]);
            this.newSpecificPurchaseRecommendModal = false;
            alert("מספר הבקשה: " + data.recommendNumber);
          }
        });
    } else this.toastSrv.error("אנא הכנס מייל תקין");
  }

  createMixedMaterial() {
    this.mixMaterial;
    let obj = {
      materialName: this.mixMaterial,
      materialPercentage: this.mixMaterialPercentage,
    };
    if (this.mixMaterial == "" || this.mixMaterialPercentage == "") {
      this.toastSrv.error("אנא תמלא את השם והאחוזים בכדי להוסיף");
    } else {
      this.resMaterial.mixedMaterial.push(obj);
      this.mixMaterial = "";
      this.mixMaterialPercentage = "";
      this.toastSrv.success("חומר גלם נוסף בהצלחה!");
    }
  }

  calculateMaterialArrival() {
    for (let i = 0; i < this.allMaterialArrivals.length; i++) {
      for (let j = 0; j < this.componentsUnFiltered.length; j++) {
        if (
          this.allMaterialArrivals[i].internalNumber ==
          this.componentsUnFiltered[j].componentN
        ) {
          this.componentsUnFiltered[j].measureType =
            this.allMaterialArrivals[i].mesureType;
          if (this.componentsUnFiltered[j].totalQnt) {
            this.componentsUnFiltered[j].totalQnt =
              Number(this.componentsUnFiltered[j].totalQnt) +
              this.allMaterialArrivals[i].totalQnt;
            if (this.route.snapshot.queryParams.componentN) {
              this.filterByComponentN(
                this.route.snapshot.queryParams.componentN
              );
            }
          } else {
            this.componentsUnFiltered[j].totalQnt =
              this.allMaterialArrivals[i].totalQnt;
            if (this.route.snapshot.queryParams.componentN) {
              this.filterByComponentN(
                this.route.snapshot.queryParams.componentN
              );
            }
          }
        }
      }
    }
  }

  getAmountsFromShelfs() {
    let allNumbers = this.components.map((component) => component.componentN);
    this.inventoryService
      .getAmountsForMulti(allNumbers)
      .subscribe((itemsAmounts) => {
        console.log(itemsAmounts);
        for (let component of this.components) {
          let itemWithTotal = itemsAmounts.find(
            (item) => item._id == component.componentN
          );
          if (itemWithTotal) {
            component.amount = itemWithTotal.total ? itemWithTotal.total : 0;
            //   let amount = itemWithTotal.total;
            //   let roundedAmount = Math.round(amount);
            //   component.amount = roundedAmount ? roundedAmount : 0;
          } else component.amount = 0;
        }
        this.loadingText = "(3/4) מייבא הזמנות רכש...";
      });
  }

  getAllExpectedArrivalsData() {
    this.procuretServ.getAllExpectedArrivals().subscribe((res) => {
      this.itemExpectedArrivals = res;
    });
  }

  calcIfLowThenMin(component) {
    if (component.minimumStock && component.alloAmount) {
      if (component.amount - component.alloAmount > component.minimumStock) {
        return "manyleft";
      } else {
        return "notmanyleft";
      }
    }
    return "";
  }

  dangerColor(threatment) {
    if (
      threatment == "flammableLiquid" ||
      threatment == "flammableSolid" ||
      threatment == "flammable"
    ) {
      return "flame";
    } else if (threatment == "acid") {
      return "acid";
    } else if (threatment == " oxidizer") {
      return "oxidizer";
    } else if (threatment == "toxic") {
      return "toxic";
    } else if (threatment == "base") {
      return "base";
    }
  }

  createNewQAPallet() {
    let amountToReduce =
      this.newQApallet.floorNumber *
      this.newQApallet.kartonQuantity *
      this.newQApallet.unitsInKarton;
    if (this.newQApallet.lastFloorQuantity > 0) {
      amountToReduce =
        amountToReduce +
        this.newQApallet.lastFloorQuantity * this.newQApallet.unitsInKarton;
    }
    if (this.newQApallet.unitsQuantityPartKarton > 0) {
      amountToReduce =
        amountToReduce + this.newQApallet.unitsQuantityPartKarton;
    }
    if (this.newQApallet.shelfAmount < amountToReduce) {
      this.toastSrv.error("שים לב , כמות מדף קטנה מהכמות שאתה מבקש למשוך");
    } else {
      this.newQApallet.itemNumber = this.resCmpt.componentN;
      this.formService.createNewQaPallet(this.newQApallet).subscribe((data) => {
        if (data) {
          this.toastSrv.success("הועבר לרשימת פריטים בהצלחה !");
          this.currShelf.amount -= amountToReduce;
          this.getAmountsFromShelfs();
        }
      });
    }
  }

  getAllCmptTypesAndCategories() {
    this.cmptTypeList = [];
    this.cmptCategoryList = [];
    this.components.forEach((cmpt) => {
      if (
        cmpt.componentType != "" &&
        cmpt.componentType != null &&
        cmpt.componentType != undefined
      ) {
        if (!this.cmptTypeList.includes(cmpt.componentType)) {
          return this.cmptTypeList.push(cmpt.componentType);
        }
      }
      if (
        cmpt.componentCategory != "" &&
        cmpt.componentCategory != null &&
        cmpt.componentCategory != undefined
      ) {
        if (!this.cmptCategoryList.includes(cmpt.componentCategory)) {
          return this.cmptCategoryList.push(cmpt.componentCategory);
        }
      }
    });
    this.cmptCategoryList.sort();
    console.log(this.cmptCategoryList);
  }

  loadComponentItems() {
    // this.resCmpt.componentType=  this.stockType;
    if (this.resCmpt.itemType != "") {
      this.inventoryService
        .getItemsByCmpt(this.resCmpt.componentN, this.resCmpt.itemType)
        .subscribe((res) => {
          if (res.length > 0) {
            this.resCmpt.componentItems = res;
          } else this.resCmpt.componentItems = [];
        });
    } else {
      this.toastSrv.error("Item type error \nPlease refresh screen.");
    }
  }

  loadMaterialItems() {
    this.inventoryService.updateMaterial(this.resMaterial).subscribe((data) => {
      this.components.map((doc) => {
        if (doc.id == this.resMaterial._id) {
          doc = data;
        } else {
          this.toastSrv.error("Item type error \nPlease refresh screen.");
        }
      });
    });
  }

  async updateItemStockShelfChange(direction) {
    this.destShelf = this.destShelf.toLocaleUpperCase();
    await this.inventoryService
      .checkIfShelfExist(this.destShelf, this.newItemShelfWH)
      .subscribe(async (shelfRes) => {
        if (shelfRes.ShelfId) {
          this.destShelfId = shelfRes.ShelfId;
          this.destShelfQntBefore = 0;
          if (shelfRes.stock.length > 0) {
            shelfRes.stock.map((shl) => {
              if (shl.item == this.resCmpt.componentN) {
                this.destShelfQntBefore = shl.amount;
              }
            });
          }
          this.updateItemStock(direction);
        } else {
          this.toastSrv.error("מדף יעד לא קיים");
        }
      });
    /* we need to send two objects with negitive and positive amounts
    both with dir="shelfchange",
   and make sure server side will deal with this dir and update movments
    */
  }

  dirSet(direction) {
    this.dir = direction;
    // if (direction == "shelfChange") {
    //   this.amountChangeDir = 'shelfChange';
    //   this.sehlfChangeNavBtnColor = "#1affa3";
    //   this.amountChangeNavBtnColor = "";
    //   this.amountForPalletBtnColor = "";
    // }
    // else if (direction == 'withdrawForPallet') {
    //   this.amountChangeDir = 'withdrawForPallet';
    //   this.sehlfChangeNavBtnColor = "";
    //   this.amountForPalletBtnColor = "#1affa3";
    //   this.amountChangeNavBtnColor = "";
    // }
    // else {
    //   this.amountChangeDir = '';
    //   this.sehlfChangeNavBtnColor = "";
    //   this.amountForPalletBtnColor = "";
    //   this.amountChangeNavBtnColor = "#1affa3";
    // }
  }

  async updateItemStock(direction) {
    //check enough amount for "out"

    this.newItemShelfPosition = this.newItemShelfPosition.toUpperCase().trim();
    var shelfExsit = false;
    let itemShelfCurrAmounts = [];
    await this.currItemShelfs.forEach((x) => {
      if (x.position == this.newItemShelfPosition) {
        itemShelfCurrAmounts.push(x.amount);
        shelfExsit = true;
      }
    });
    await this.inventoryService
      .checkIfShelfExist(this.newItemShelfPosition, this.newItemShelfWH)
      .subscribe(async (shelfRes) => {
        if (shelfRes.ShelfId) {
          if (shelfRes.stock.length > 0) {
            let temp = shelfRes.stock.find(
              (shl) => shl.item == this.resCmpt.componentN
            );
            if (temp) this.originShelfQntBefore = temp.amount;
            else this.originShelfQntBefore = 0;
          }
          shelfExsit = true;

          if (
            (direction != "in" && itemShelfCurrAmounts.length > 0) ||
            direction == "in"
          ) {
            let enoughAmount = itemShelfCurrAmounts[0] >= this.newItemShelfQnt;
            if ((direction != "in" && enoughAmount) || direction == "in") {
              if (direction != "in") this.newItemShelfQnt *= -1;

              if (this.newItemShelfWH != "") {
                let relatedOrderNum = this.relatedOrderNum.toUpperCase();
                let ObjToUpdate = [
                  {
                    amount: this.newItemShelfQnt,
                    item: this.resCmpt.componentN,
                    itemName: this.resCmpt.componentName,
                    shell_id_in_whareHouse: shelfRes.ShelfId,
                    position: this.newItemShelfPosition,
                    arrivalDate: null, // only for "in"
                    expirationDate: null, // for products stock
                    productionDate: null, // for products stock
                    barcode: "",
                    itemType: this.stockType,
                    // relatedOrderNum:itemLine.relatedOrder,
                    // deliveryNoteNum:itemLine.deliveryNote,
                    actionType: direction,
                    WH_originId: this.curentWhareHouseId,
                    WH_originName: this.curentWhareHouseName,
                    shell_id_in_whareHouse_Dest: this.destShelfId,
                    shell_position_in_whareHouse_Dest: this.destShelf,
                    WH_destId: this.curentWhareHouseId,
                    WH_destName: this.curentWhareHouseName,
                    batchNumber: "",
                    relatedOrderNum: relatedOrderNum,
                    originShelfQntBefore: this.originShelfQntBefore,
                    destShelfQntBefore: this.destShelfQntBefore,
                    userName:
                      this.authService.loggedInUser.firstName +
                      " " +
                      this.authService.loggedInUser.lastName,
                  },
                ];

                if (direction == "in") {
                  ObjToUpdate[0].arrivalDate = new Date();
                }
                if (direction != "in") {
                  // ObjToUpdate[0].amount=ObjToUpdate[0].amount*(-1);
                }
                //  if(itemLine.reqNum) ObjToUpdate.inventoryReqNum=itemLine.reqNum;
                //  if(typeof(itemLine.arrivalDate)=='string') ObjToUpdate.arrivalDate=itemLine.arrivalDate;
                if (this.stockType == "product") {
                  ObjToUpdate[0].batchNumber = this.newItemShelfBatchNumber;
                  if (this.newItemShelfBatchNumber != "") {
                    let itemBatch = this.ItemBatchArr.filter(
                      (b) => b.batchNumber == this.newItemShelfBatchNumber
                    );
                    //fix date format
                    let dateArr = itemBatch[0].expration.split("/");
                    let dateArrToJoin = [];
                    dateArrToJoin[0] = dateArr[2];
                    dateArrToJoin[1] = dateArr[1];
                    dateArrToJoin[2] = dateArr[0];
                    let dateToUpdate = dateArrToJoin.join("-");

                    let expDate = new Date(itemBatch[0].expration);
                    ObjToUpdate[0].expirationDate = expDate;
                  } else {
                    ObjToUpdate[0].expirationDate = null;
                  }

                  //  ObjToUpdate.expirationDate=itemRes.expirationDate ;ObjToUpdate.productionDate=itemRes.productionDate
                }
                if (direction == "shelfChange") {
                  ObjToUpdate[0].shell_id_in_whareHouse_Dest = this.destShelfId;
                  ObjToUpdate[0].shell_position_in_whareHouse_Dest =
                    this.destShelf;
                }

                //  READY!

                await this.inventoryService
                  .updateInventoryChangesTest(ObjToUpdate, this.stockType)
                  .subscribe((res) => {
                    console.log("ObjToUpdate", ObjToUpdate);
                    if (
                      res == "all updated" ||
                      (res.msg && res.msg == "all updated")
                    ) {
                      this.toastSrv.success("Changes Saved");

                      this.inventoryService
                        .getAmountOnShelfs(this.resCmpt.componentN)
                        .subscribe(async (res) => {
                          this.itemAmountsData = res.data;
                          this.itemAmountsWh = res.whList;
                        });

                      this.inventoryService
                        .deleteZeroStockAmounts()
                        .subscribe((x) => {
                          console.log(x.n + " items with amount=0 deleted");
                        });
                      let actionLogObj = {
                        dateAndTime: new Date(),
                        logs: ObjToUpdate,
                        userName:
                          this.authService.loggedInUser.firstName +
                          " " +
                          this.authService.loggedInUser.lastName,
                        movementType: ObjToUpdate[0].actionType,
                      };

                      this.inventoryService
                        .addToWHActionLogs(actionLogObj)
                        .subscribe((res) => {
                          this.toastSrv.success("פעולות מחסנאי נשמרו");
                        });
                      this.components.forEach((stkItem) => {
                        if (stkItem.componentN == ObjToUpdate[0].item) {
                          stkItem.amount =
                            stkItem.amount + ObjToUpdate[0].amount;
                        }
                      });
                      this.newItemShelfQnt = null;
                      this.destShelf = "";
                      this.destShelfId = "";
                      this.newItemShelfPosition = "";
                      this.originShelfQntBefore = 0;
                      this.destShelfQntBefore = 0;
                    } else {
                      this.toastSrv.error("Error - Changes not saved");
                    }
                  });
              } else {
                this.toastSrv.error("Choose warehouse");
              }
            } else {
              this.toastSrv.error(
                "Not enough stock on shelf!\n Item Number " +
                  this.resCmpt.componentN +
                  "\n Amount on shelf: " +
                  itemShelfCurrAmounts[0]
              );
            }
          } else {
            this.toastSrv.error(
              "No Item Amounts On Shelf: " + this.newItemShelfPosition
            );
          }
        } else {
          this.toastSrv.error("No Such Shelf: " + this.newItemShelfPosition);
        }
      });
  }

  deleteSupplier(index, componentN) {
    if (confirm("האם למחוק ספק ?")) {
      var material = this.components.find((c) => c.componentN == componentN);
      material.alternativeSuppliers.splice(index, 1);
      this.toastSrv.success("ספק הוסר בהצלחה , לא לשכוח לעדכן מידע !");
    }
  }

  filterByComponentN(componentN) {
    let comp = this.components.find((c) => c.componentN == componentN);
    if (this.componentsUnFiltered) this.stockType = comp.itemType;
    this.components = this.componentsUnFiltered.filter(
      (c) => c.componentN == componentN
    );
  }

  getUserInfo() {
    this.authService.userEventEmitter.subscribe((user) => {
      this.user = user.loggedInUser;
    });
    if (!this.authService.loggedInUser) {
      this.authService.userEventEmitter.subscribe((user) => {
        if (user.userName) {
          this.user = user;
        }
      });
    } else {
      this.user = this.authService.loggedInUser;
    }
  }

  setType(type) {
    this.components = [];
    switch (type) {
      case "component":
        this.buttonColor = "#2962FF";
        this.buttonColor2 = "white";
        this.buttonColor3 = "white";
        this.fontColor = "white";
        this.fontColor2 = "black";
        this.fontColor3 = "black";

        break;
      case "material":
        this.buttonColor = "white";
        this.buttonColor2 = "#ffaf0e";
        this.buttonColor3 = "white";
        this.fontColor = "black";
        this.fontColor2 = "white";
        this.fontColor3 = "black";

        break;
      case "product":
        this.buttonColor = "white";
        this.buttonColor2 = "white";
        this.buttonColor3 = "#36bea6";
        this.fontColor = "black";
        this.fontColor2 = "black";
        this.fontColor3 = "white";

        break;
    }
    if (this.stockType != type) {
      // this.filterbyNum.nativeElement.value = "";
    }
    this.stockType = type;
  }

  getLastOrdersItem(numOfOrders, type) {
    this.fetchingOrders = true;
    let componentN;
    switch (type) {
      case "material":
        componentN = this.resMaterial.componentN;
        break;
      case "component":
        componentN = this.resCmpt.componentN;
    }
    this.procuretServ
      .getLastOrdersForItem(componentN, numOfOrders)
      .subscribe((orders) => {
        this.fetchingOrders = false;
        if (orders && orders.length > 0) {
          orders.map((order) => {
            if (order.coin) order.coin = order.coin.toUpperCase();
            if (order.price)
              order.localPrice = order.price * this.currencies[order.coin];
            return order;
          });
          this.lastOrdersOfItem = orders;
        } else
          this.lastOrdersOfItem = [
            {
              orderNumber: "Sorry.",
              price: "There",
              coin: "are no",
              supplierName: "orders",
              quantity: "for this",
              date: "item.",
            },
          ];
      });
  }
  // My new one
  getLastOrdersItemByDates(type) {
    this.fetchingOrders = true;
    let componentN;
    switch (type) {
      case "material":
        componentN = this.resMaterial.componentN;
        break;
      case "component":
        componentN = this.resCmpt.componentN;
    }
    this.procuretServ
      .getLastOrdersForItemByDates(
        componentN,
        this.purchaseStartDate,
        this.purchaseEndDate
      )
      .subscribe((orders) => {
        this.fetchingOrders = false;
        if (orders && orders.length > 0) {
          orders.map((order) => {
            if (order.coin) order.coin = order.coin.toUpperCase();
            if (order.price)
              order.localPrice = order.price * this.currencies[order.coin];
            return order;
          });
          this.lastOrdersOfItem = orders;
        } else
          this.lastOrdersOfItem = [
            {
              orderNumber: "Sorry.",
              price: "There",
              coin: "are no",
              supplierName: "orders",
              quantity: "for this",
              date: "item.",
            },
          ];
      });
  }

  getSearchReport() {
    let invReport = [];
    for (let c of this.components) {
      invReport.push({
        פריט: c.componentN,
        "שם פריט": c.componentName,
        סוג: c.componentType,
        ספק: c.suplierN,
        "שם ספק": c.suplierName,
        'מק"ט ספק': c.componentNs,
        "כמות במלאי": c.amount,
        מחיר: c.price,
        מטבע: c.coin,
      });
    }
    this.excelService.exportAsExcelFile(
      invReport,

      `דו"ח מלאי ${new Date().toString().slice(0, 10)}`
    );
  }

  // getRecommendationReport() {
  //   let query = this.filterParams.value;
  //   query.itemType = this.stockType;
  //   this.smallerLoader = true;
  //   this.toastSrv.info(
  //     "פעולה זו עשויה להימשך מספר דקות.",
  //     'מכין דו"ח המלצה לרכש.'
  //   );
  //   this.inventoryService.getpurchaseRec(query).subscribe((res) => {
  //     this.smallerLoader = false;
  //     let filt = res
  //       .filter(
  //         (item) =>
  //           item.minimum != "" && Number(item.minimum) >= Number(item.stock)
  //       )
  //       .map((item) => {
  //         item.openOrders = "";
  //         item.orderedAmount = 0;
  //         for (let order of item.purchases) {
  //           if (order.status != "closed" && order.status != "canceled") {
  //             item.openOrders += "," + order.orderNumber; // purchase order numbers
  //             let i = order.stockitems.findIndex((i) => i.name == item.name);
  //             item.orderedAmount += Number(order.stockitems[i].quantity); // purchase amounts
  //           }
  //         }
  //         delete item.purchases;
  //         return item;
  //       });
  //     this.excelService.exportAsExcelFile(
  //       filt,

  //       `דו"ח המלצה לרכש ${new Date().toString().slice(0, 10)}`
  //     );
  //   });
  // }

  getRecommendationReport() {
    this.smallerLoader = true;
    this.toastSrv.info(
      "פעולה זו עשויה להימשך מספר דקות.",
      'מכין דו"ח דרישות רכש.'
    );
    this.procuretServ.getRecommendationsReport().subscribe((data) => {
      if (data.msg) {
        console.log(data.msg);
        this.smallerLoader = false;
        return;
      } else if (data && data.length > 0) {
        // console.log(data);
        this.smallerLoader = false;
        this.recommendationsReport = data;
        this.recommendationsReportCopy = data;
        this.recommendationReportModal = true;

        // this.excelService.exportAsExcelFile(
        //   data,
        //   `דו"ח המלצה לרכש ${new Date().toString().slice(0, 10)}`
        // );
      } else {
        this.smallerLoader = false;
        this.toastSrv.error("לא התקבלו תוצאות, אין דרישות פתוחות");
        return;
      }
    });
  }

  exportToExcel() {
    let exportArr = [];

    for (let recom of this.recommendationsReport) {
      let line = {
        "Item Number": recom.itemNumber,
        "Item Name": recom.itemName,
        "Request Number": recom.recommendNumber,
        "Request Date": recom.requestDate,
        Type: recom.type,
        "Requested Qty": recom.requestQty,
        Unit: recom.measurement,
        "PO Number": recom.poNumber,
        "PO Date": recom.poDate,
        "PO Status": recom.poStatus,
        "Arrived Qty": recom.arrivedAmount,
        "Arrival Date": recom.arrivalDate,
        "Supplier Name": recom.supplierName,
      };
      exportArr.push(line);
    }

    this.excelService.exportAsExcelFile(
      exportArr,
      `דו"ח דרישות לרכש ${new Date().toString().slice(0, 10)}`
    );
  }

  filterByItemNumber() {
    console.log(this.searchMenu.value);
    let itemNumber = this.searchMenu.value.itemNumber;
    if (itemNumber == "") {
      this.recommendationsReport = [...this.recommendationsReportCopy];
    } else {
      this.recommendationsReport = this.recommendationsReportCopy.filter(
        (rec) => {
          return rec.itemNumber.includes(itemNumber);
        }
      );
    }
  }
  filterByItemName() {
    console.log(this.searchMenu.value);
    let itemName = this.searchMenu.value.itemName.toLowerCase();
    if (itemName == "") {
      this.recommendationsReport = [...this.recommendationsReportCopy];
    } else {
      this.recommendationsReport = this.recommendationsReportCopy.filter(
        (rec) => {
          return rec.itemName.toLowerCase().includes(itemName);
        }
      );
    }
  }
  filterByReq() {
    console.log(this.searchMenu.value);
    let requestNumber = this.searchMenu.value.requestNumber;
    if (requestNumber == "") {
      this.recommendationsReport = [...this.recommendationsReportCopy];
    } else {
      this.recommendationsReport = this.recommendationsReportCopy.filter(
        (rec) => {
          return rec.recommendNumber.toString().includes(requestNumber);
        }
      );
    }
  }

  filterByType() {
    console.log(this.searchMenu.value);
    let type = this.searchMenu.value.type;
    if (type == "") {
      this.recommendationsReport = this.recommendationsReportCopy.filter(
        (rec) =>
          rec.type == "material" || rec.type == "component" || rec.type == ""
      );
    } else {
      this.recommendationsReport = this.recommendationsReportCopy.filter(
        (rec) => {
          return rec.type == type;
        }
      );
    }
  }

  clearMenu() {
    this.searchMenu.reset();
    this.recommendationsReport = this.recommendationsReportCopy;
  }
  sortByItemNumber() {
    let i = this.sortToggle;
    this.recommendationsReport.sort((a, b) => {
      return a.itemNumber > b.itemNumber
        ? i
        : a.itemNumber < b.itemNumber
        ? -i
        : 0;
    });
    this.sortToggle *= -1;
  }
  sortByReqNumber() {
    let i = this.sortToggle;
    this.recommendationsReport.sort((a, b) => {
      return a.recommendNumber > b.recommendNumber
        ? i
        : a.recommendNumber < b.recommendNumber
        ? -i
        : 0;
    });
    this.sortToggle *= -1;
  }
  sortByItemName() {
    let i = this.sortToggle;
    this.recommendationsReport.sort((a, b) => {
      return a.itemName.toLowerCase() > b.itemName.toLowerCase()
        ? i
        : a.itemName.toLowerCase() < b.itemName.toLowerCase()
        ? -i
        : 0;
    });
    this.sortToggle *= -1;
  }

  getPPCReport() {
    this.PPCLoading = true;
    this.toastSrv.info("פעולה זו עשויה להימשך מספר דקות.", 'מכין דו"ח תפ"י.');
    let query = this.filterParams.value;
    query.itemType = this.stockType;
    this.inventoryService.getPPCReport(query).subscribe((components) => {
      this.PPCLoading = false;
      console.log(components);
      let ppcReport = [];
      let ppcIndex = 1;
      for (let cmpt of components) {
        console.log(cmpt);
        if (cmpt.openOrders) {
          for (let order of cmpt.openOrders) {
            console.log(order);
            ppcReport.push({
              "No.": ppcIndex,
              "Comp. Number": cmpt.componentN,
              "Comp. Name": cmpt.componentName,
              "Comp. Type": cmpt.componentType,
              Supplier: cmpt.suplierN + " - " + cmpt.suplierName,
              Item: order.itemNumber,
              "Item Description": order.discriptionK,
              Order: order.orderNumberInt,
              PcsCarton: order.PcsCarton,
              Customer:
                order.orders.costumerInternalId + " - " + order.orders.costumer,
              amount: Number(order.orderItems.quantity),
              Status: order.orderItems.fillingStatus,
              Date: `${new Date().toISOString().slice(0, 10)}`,
            });
            ppcIndex++;
          }
        }
      }
      console.log(ppcReport);
      this.excelService.exportAsExcelFile(
        ppcReport,

        `דו"ח תפ"י ${new Date().toISOString().slice(0, 10)}`
      );
    });
  }

  filterComponents(productNumber?) {
    console.log("filter parameters: ", this.filterParams.value);
    this.smallLoader = true;
    let query = this.filterParams.value;
    query.componentN = query.componentN.trim();
    query.componentName = query.componentName.trim();
    console.log(query);
    if (productNumber) {
      query.componentN = productNumber;
      // query.componentCategory = "product"
    }

    if (
      query.componentName == "" &&
      query.componentCategory == "" &&
      query.componentType == "" &&
      query.componentN.length < 2
    ) {
      alert(
        "יש למלא לפחות שדה חיפוש אחד, במידה והחיפוש לפי מקט, יש להכניס לפחות 2 ספרות."
      );
      this.smallLoader = false;
      return;
    }

    query.componentN = query.componentN.trim();
    query.componentName = query.componentName.trim();
    console.log(query);
    query.itemType = this.stockType;
    this.loadingText = "(1/4) מייבא פריטים...";

    setTimeout(() => {
      if (this.smallLoader) {
        this.smallLoader = false;
        this.toastSrv.error("משהו השתבש.");
      }
    }, 1000 * 15); // stop the loader if no answer

    this.inventoryService
      .getFilteredComponents(query)
      .subscribe((filteredComponents) => {
        console.log(filteredComponents);
        filteredComponents.forEach((co) => {
          co.active = co.notActive ? "לא פעיל" : "פעיל";
          co.color = co.notActive ? "red" : "black";
        });
        this.components = filteredComponents;
        this.componentsUnFiltered = filteredComponents;

        // not needed as the query is filtering out the by item type
        // this.components = filteredComponents.filter(
        //   (s) => s.itemType == this.stockType
        // );
        // this.componentsUnFiltered = filteredComponents.filter(
        //   (s) => s.itemType == this.stockType
        // );

        if (this.components.length > 0) {
          try {
            console.log(this.components);
            this.loadingText = "(2/4) מחשב כמויות... ";
            this.getAmountsFromShelfs();
            this.getItemPurchases(false);
            // this.getAllocations();
            this.getAllocationsNew();
          } catch (e) {
            this.smallLoader = false;
            alert(e);
          }
        } else {
          this.toastSrv.error(
            "לא נמצאו פריטים עבור החיפוש שביצעתם. אנא נסו חיפוש אחר."
          );
          this.smallLoader = false;
        }
      });
  }

  getAllocationsNew() {
    if (this.components.length > 0) {
      let itemNumbers = this.components.map((c) => c.componentN);

      if (this.stockType == "product") {
        this.inventoryService
          .getAllocatedOrdersByNumbers(itemNumbers)
          .subscribe((data) => {
            console.log(data);
            if (data.msg) {
              this.toastSrv.error(data.msg);
              return;
            } else if (data) {
              for (let itemNumber of data) {
                let idx = this.components.findIndex(
                  (c) => c.componentN == itemNumber.itemNumber
                );
                if (idx > -1) {
                  this.components[idx].allocatedAmount = itemNumber.orderAmount;
                }
              }
              console.log(this.components);
            }
          });
      } else if (this.stockType == "--component") {
        this.inventoryService
          .getCmptPPCDetails(itemNumbers)
          .subscribe((data) => {
            console.log(data);
            if (data.msg) {
              this.toastSrv.error(data.msg);
              return;
            } else if (data) {
              for (let item of data.allocations) {
                let idx = this.components.findIndex(
                  (c) => c.componentN == item.itemNumber
                );
                if (idx > -1) {
                  this.components[idx].allocatedAmount = item.orderAmount;
                }
              }
              console.log(this.components);
            }
            // component.allocations = data.allocations;
            // component.allocationsAmount = data.allocationsAmount;
          });
      }
    }
  }
  searchItemShelfs() {
    if (this.newItemShelfWH != "") {
      this.inventoryService
        .getShelfListForItemInWhareHouse(
          this.resCmpt.componentN,
          this.newItemShelfWH
        )
        .subscribe(async (res) => {
          if (res.length > 0) {
            this.currItemShelfs = res;
          } else {
            this.currItemShelfs = [];
            this.currItemShelfs.push(
              "NO SHELFS WITH ITEM # " + this.resCmpt.componentN
            );
          }
        });
    } else {
      this.toastSrv.error("Choose Wharhouse");
    }
  }

  loadShelfToInput(shelf, ev) {
    if (!shelf.position.includes("NO SHELFS")) {
      this.newItemShelfPosition = shelf.position;
      this.newQApallet.shelf = shelf.position;
      this.newQApallet.shelfId = shelf._id;
      this.newQApallet.shelfAmount = shelf.amount;
      this.currShelf = shelf;
    }
  }

  searchData() {
    this.inventoryService
      .getMaterialArrivalByDate(
        this.MaterialArrivalStartDate,
        this.MaterialArrivalEndDate,
        this.searchBarcode
      )
      .subscribe((res) => {
        if (res && res.qty > 0) {
          this.totalQuantity = String(res.qty);
          this.measure = res.measure;
        } else {
          this.totalQuantity = "0";
        }
      });
  }

  async openData(cmptNumber) {
    this.sixMonth = 0;
    this.switchModalView(cmptNumber);
    this.showItemDetails = true;
    this.itemmoveBtnTitle = "Item movements";
    this.itemMovements = [];
    this.openModalHeader = "פריט במלאי  " + cmptNumber;
    this.openModal = true;
    this.resMaterial = defaultMaterial;
    this.resCmpt = this.components.find(
      (cmpt) => cmpt.componentN == cmptNumber
    );
    this.editVersionForm.controls.versionNumber.setValue(
      this.resCmpt.versionNumber + 1
    );
    if (isNaN(this.editVersionForm.controls.versionNumber.value))
      this.editVersionForm.controls.versionNumber.setValue(5);
    let mainSupplier = this.resCmpt.alternativeSuppliers.find(
      (s) => s.isMain == true
    );
    // if(mainSupplier){
    //   this.resCmpt.suplierN = mainSupplier.supplierName
    //   this.resCmpt.price = mainSupplier.price + mainSupplier.coin;
    // }
    this.getLastOrdersItem(10, "component");
    // this.resCmpt.finalPrice = this.resCmpt.shippingPrice ? Number(this.resCmpt.price) + Number(this.resCmpt.shippingPrice) : this.resCmpt.price
    // this.loadComponentItems();
    if (this.resCmpt.jumpRemark == "" || this.resCmpt.jumpRemark == undefined) {
      console.log("ok");
    } else {
      alert("Jumping Remark: " + this.resCmpt.jumpRemark);
    }
  }

  async openImg(componentImg) {
    this.openImgModal = true;
    this.currModalImgSrc = componentImg;
  }
  async openAmountsData(cmptNumber, cmptId) {
    this.openModalHeader = "כמויות פריט במלאי  " + cmptNumber;
    this.openAmountsModal = true;
    this.dir = "";
    this.resCmpt = this.components.find(
      (cmpt) => cmpt.componentN == cmptNumber
    );
    this.itemIdForAllocation = cmptId;
    //get product (and TBD materials) batchs for select
    //??? this.resCmpt has mkp category
    if (this.stockType != "components") {
      await this.batchService
        .getBatchesByItemNumber(cmptNumber + "")
        .subscribe((data) => {
          this.ItemBatchArr = data;
        });
    }
  }

  showBatchExpDate(ev) {
    var batch = ev.target.value;
    if (batch != "") {
      for (let i = 0; i < this.ItemBatchArr.length; i++) {
        if (this.ItemBatchArr[i].batchNumber == batch) {
          this.expirationBatchDate = this.ItemBatchArr[i].expration;
        }
      }
    } else {
      this.expirationBatchDate = "";
    }
  }

  addComposition() {
    var obj = {
      compName: this.compositionName,
      compPercentage: this.compositionPercentage,
      compFunction: this.compostionFunction,
      compCAS: this.compositionCAS,
    };

    this.resMaterial.composition.push(obj);
    this.compositionName = "";
    this.compositionPercentage = null;
    this.compostionFunction = "";
    this.compositionCAS = "";
  }

  editComp(i) {
    this.compEdit = i;
  }

  moveToSuppliers(supplierName) {
    window.open(
      "http://peerpharmsystem.com/#/peerpharm/inventory/suppliers?supplierName=" +
        supplierName
    );
  }

  async openDataMaterial(materNum) {
    this.searchBarcode = materNum;
    this.materialArrivals = [];
    this.itemShellUpdates = [];
    this.inventoryService
      .getMaterialArrivalByNumber(materNum)
      .subscribe((data) => {
        if (data) {
          this.materialArrivals = [];
          var dateFrom = new Date("01/01/2019");
          var dateTo = new Date("01/01/2020");
          var totalQnt = 0;
          for (let i = 0; i < data.length; i++) {
            if (
              data[i].arrivalDate >= dateFrom.toISOString() &&
              data[i].arrivalDate <= dateTo.toISOString()
            ) {
              totalQnt += data[i].totalQnt;
            }
          }
          if (
            totalQnt + data[0].mesureType != null ||
            totalQnt + data[0].mesureType != undefined
          ) {
            this.totalQuantity = totalQnt + data[0].mesureType;
          }
          this.materialArrivals = data;
        }
      });

    this.showItemDetails = true;
    this.itemmoveBtnTitle = "Item movements";
    this.itemMovements = [];
    this.openModalHeader = "פריט במלאי  " + materNum;
    this.openModal = true;
    this.resCmpt = defaultCmpt;
    this.resMaterial = this.components.find(
      (mat) => mat.componentN == materNum
    );
    let mainSupplier = this.resMaterial.alternativeSuppliers.find(
      (s) => s.isMain == true
    );
    // if(mainSupplier){
    //   this.resMaterial.suplierN = mainSupplier.supplierName
    //   this.resMaterial.price = mainSupplier.price + mainSupplier.coin;
    // }
    this.getLastOrdersItem(10, "material");
    this.inventoryService
      .getItemShellsAfterUpdateByNumber(materNum)
      .subscribe((itemShells) => {
        console.log(itemShells);
        if (itemShells.msg) {
          this.toastSrv.error(itemShells.msg);
        } else if (itemShells.length > 0) {
          this.itemShellUpdates = itemShells;
        }
      });

    // this.resMaterial.finalPrice = this.resMaterial.shippingPrice ? Number(this.resMaterial.price) + Number(this.resMaterial.shippingPrice) : this.resMaterial.price

    this.linkDownload =
      "http://peerpharmsystem.com/material/getpdf?_id=" + this.resMaterial._id;
    // this.loadComponentItems();
  }

  /**
   async openAllocatedOrders(componentN, index?, forEach?) {
   * 
   *   this.openModalHeader = "הקצאות מלאי"
              this.openOrderAmountsModal = true;
              this.allocatedOrders = data
   * 
   * 
   */

  openAllocatedOrders(component) {
    this.allocatedOrders = [];
    this.component = null;
    this.alloAmountsLoading = true;
    console.log(component);
    console.log(component.componentN);
    this.openModalHeader = "הקצאות מלאי";

    this.openOrderAmountsModal = true;
    this.inventoryService
      .getCmptPPCDetails(component.componentN)
      .subscribe((data) => {
        data.stockQty = data.stock[0] ? data.stock[0].stock : 0;
        // data.stock = data.stock.length == 0 ? [{ stock: 0 }] : data.stock;
        this.alloAmountsLoading = false;
        console.log(data);
        this.component = data;
        this.allocatedOrders = data.allocations;
      });
  }

  getAllocations() {
    let allNumbers = this.components.map((c) => c.componentN);
    this.orderService
      .getAllOrdersForComponentsNew(allNumbers)
      .subscribe((allComponentsOrders) => {
        console.log(allComponentsOrders);
        for (let component of this.components) {
          let ordersObject = allComponentsOrders.find(
            (co) => co.componentN == component.componentN
          );
          component.openOrders = ordersObject.openOrders;
        }
        console.log(this.components);
        this.toastSrv.success("כל הנתונים נטענו.");
      });
  }

  async openAllocatedProducts(componentN) {
    this.allocatedProducts = [];
    this.alloAmountsLoading = true;
    this.openModalHeader = "הקצאות מלאי";
    this.openProductAmountModal = true;
    this.inventoryService
      .getAllocatedOrdersByNumber(componentN)
      .subscribe((data) => {
        console.log(data);
        this.alloAmountsLoading = false;
        let productAllocation = [];
        this.allocatedAmount = 0;
        for (let orderItem of data) {
          this.allocatedAmount += +orderItem.quantity;
          productAllocation.push({
            orderNumber: orderItem.orderNumber,
            allocatedQuantity: orderItem.quantity,
            ...orderItem,
          });
        }
        this.allocatedProducts = productAllocation;
      });
  }

  searchProduct() {
    if (this.productToFind != "") {
      // check the stock item is really new
      this.inventoryService
        .getCmptByNumber(this.productToFind, "product")
        .subscribe((res) => {
          if (res.length == 0) {
            // get item data from item tree
            this.itemService
              .getItemData(this.productToFind)
              .subscribe((data) => {
                this.resCmpt = {
                  actualMlCapacity: 0,
                  componentCategory: "",
                  componentN: data[0].itemNumber,
                  componentName:
                    data[0].name +
                    " " +
                    data[0].subName +
                    " " +
                    data[0].discriptionK,
                  componentNs: "",
                  componentType: data[0].itemType,
                  img: data[0].imgMain1,
                  importFrom: "",
                  itemType: "product",
                  lastModified: "",
                  minimumStock: "",
                  needPrint: "",
                  packageType: "",
                  packageWeight: "",
                  remarks: "",
                  suplierN: "",
                  suplierName: "",
                  measurement: "",
                };
              });
          } else {
            this.toastSrv.error("Stock Item alredy exist");
          }
        });
    } else {
      this.toastSrv.error("Please enter product number");
      this.resetResCmptData();
    }
  }

  getColor(date) {
    switch (date) {
      case "date < new Date()":
        return "red";
      case "date > new Date()":
        return "black";
    }
  }

  checkIfItemExist(ev) {
    var itemNumber = ev.target.value;
    if (itemNumber != "") {
      this.inventoryService
        .getCmptByitemNumber(itemNumber)
        .subscribe((data) => {
          if (data.length > 0) {
            this.toastSrv.error("שים לב ! מספר זה קיים במערכת");
          } else {
            console.log("ok");
          }
        });
    }
  }

  closeAmountsData() {
    this.openAmountsModal = false;
    this.itemAmountsData = [];
    this.newItemShelfPosition = "";
    this.newItemShelfQnt = null;
    this.destShelf = "";
  }

  newCmpt(newItem) {
    this.newItem = newItem;
    this.resCmpt = {
      componentN: "",
      componentName: "",
      componentNs: "",
      suplierN: "",
      suplierName: "",
      componentType: "",
      componentCategory: "",
      img: "",
      importFrom: "",
      lastModified: "",
      minimumStock: "",
      needPrint: "",
      packageType: "",
      packageWeight: "",
      remarks: "",
      itemType: "",
      actualMlCapacity: 0,
      price: 0,
      manualPrice: 0,
      coin: "ILS",
      manualCoin: "ILS",
      priceUpdates: [],
    };

    this.openModalHeader = "יצירת פריט חדש";
    this.openModal = true;
  }

  writeNewComponent() {
    if (this.resCmpt.componentN != "") {
      this.resCmpt.itemType = this.stockType;
      console.log(this.resCmpt);
      this.inventoryService.addNewCmpt(this.resCmpt).subscribe((res) => {
        console.log("res from front: " + res);
        if (res == "itemExist") {
          this.toastSrv.error("פריט קיים במלאי");
        } else if (res.componentN) {
          this.toastSrv.success("New stock item created");
          this.componentsUnFiltered.push(res);
          this.components.push(res);

          // this.getAllComponents();
          this.resetResCmptData();
          // this.filterbyNum.nativeElement.value = '';
        }
        this.newItem = "";
      });
    } else {
      this.toastSrv.error("Can't create new stock item without number");
    }
  }

  writeNewMaterial() {
    //this.stockType = "material"/"component"/"product"
    this.resMaterial.itemType = "material";
    if (this.resMaterial.componentN != "") {
      this.inventoryService
        .addNewMaterial(this.resMaterial)
        .subscribe((res) => {
          if (res == "פריט קיים במערכת !") {
            this.toastSrv.error("פריט קיים במערכת !");
          } else {
            this.toastSrv.success("New material item created");
            this.components.push(res);
          }
        });
    }
  }

  checkIfExist(ev) {
    if (ev.target.value != "") {
      this.inventoryService
        .getMaterialtByNumber(ev.target.value)
        .subscribe((data) => {
          if (data.length > 0) {
            this.toastSrv.error("שים לב , הפריט כבר קיים במערכת !");
          } else {
          }
        });
    }
  }

  clearSearchFields() {
    this.filterParams.setValue({
      componentN: "",
      componentName: "",
      componentType: "",
      componentCategory: "",
    });
  }

  clearFields() {
    this.resMaterial = {
      componentN: "",
      componentName: "",
      remarks: "",
      img: "",
      minimumStock: "",
      packageWeight: "",
      itemType: "",
      barcode: "",
      actualMlCapacity: "",
      unitOfMeasure: "",
      group: "",
      subGroup2: "",
      alternativeSuppliers: [],
      status: "",
      threatment: "",
      monthTillExp: "",
      monthAvgPcs: "",
      msds: "",
      coaMaster: "",
      function: "",
      measurement: "",
      notInStock: false,
      inciName: "",
      casNumber: "",
      composition: [],
      umNumber: "",
      imerCode: "",
      imerTreatment: "",
      allowQtyInStock: "",
      expiredQty: "",
      permissionDangerMaterials: "",
      storageTemp: "",
      storageDirections: "",
      frameQuantity: "",
      frameSupplier: "",
      location: "",
      quantityInStock: "",
      mixedMaterial: [],
      formuleRemarks: "",
    };

    this.supplier = {
      supplierName: "",
      price: "",
      coin: "",
      coinLoading: "",
      priceLoading: "",
      manufacturer: "",
      alternativeMaterial: "",
      alterName: "",
      subGroup: "",
      packageWeight: "",
    };
  }
  onSelectMsds(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed

        this.resMaterial.msds = event.target["result"];
        this.resMaterial.msds = this.resMaterial.msds.replace(
          "data:application/pdf;base64,",
          ""
        );
      };
    }
  }

  onSelectCoaMaster(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed

        this.resMaterial.coaMaster = event.target["result"];
        this.resMaterial.coaMaster = this.resMaterial.coaMaster.replace(
          "data:application/pdf;base64,",
          ""
        );
      };
    }
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.resMaterial.img = event.target["result"];
      };
    }
  }

  editStockItemDetails() {
    this.resCmpt;
    if (confirm("לעדכן פריט?")) {
      this.inventoryService.updateCompt(this.resCmpt).subscribe((res) => {
        if (res._id) {
          this.getAllMaterialLocations();
          this.toastSrv.success("פריט עודכן בהצלחה");
        } else {
          this.toastSrv.error("עדכון פריט נכשל");
        }
      });
    }
  }

  editMaterialItemDetails() {
    if (confirm("לעדכן פריט?")) {
      this.inventoryService
        .updateMaterial(this.resMaterial)
        .subscribe((res) => {
          if (res.msg == "noUpdate") {
            this.toastSrv.error("עדכון פריט נכשל");
          } else {
            if (res._id) {
              this.toastSrv.success("פריט עודכן בהצלחה");
            } else {
              this.toastSrv.error("עדכון פריט נכשל");
            }
          }
        });
    }
  }

  addToPriceHistory(type) {
    let componentN;
    let newPrice;
    let coin;
    switch (type) {
      case "c":
        componentN = this.resCmpt.componentN;
        newPrice = this.resCmpt.manualPrice;
        coin = this.resCmpt.manualCoin;
        break;
      case "m":
        componentN = this.resMaterial.componentN;
        newPrice = this.resMaterial.manualPrice;
        coin = this.resMaterial.manualCoin;
        break;
    }
    let user = this.authService.loggedInUser.userName;
    this.inventoryService
      .updatePriceHistory(componentN, newPrice, coin, user)
      .subscribe((data) => {
        console.log(data);
        if (type == "c") {
          this.resCmpt.priceUpdates.push({
            price: newPrice,
            coin,
            user,
            date: new Date(),
            type: "manual",
          });
        } else if (type == "m") {
          this.resMaterial.priceUpdates.push({
            price: newPrice,
            coin,
            user,
            date: new Date(),
            type: "manual",
          });
        }
      });
    this.allowPriceUpdate = false;
  }

  checkUpdatePriceValidity(type) {
    this.allowPriceUpdate = false;
    if (type == "c")
      this.allowPriceUpdate =
        this.resCmpt.manualCoin != undefined &&
        this.resCmpt.manualPrice != undefined;
    if (type == "m")
      this.allowPriceUpdate =
        this.resMaterial.manualCoin != undefined &&
        this.resMaterial.manualPrice != undefined;
  }

  getSupplierPriceHistory(i) {
    //TODO: get supplier NUmber!!!
    this.procuretServ
      .getAllOrdersFromSupplier(
        this.resMaterial.alternativeSuppliers[i].suplierNumber
      )
      .subscribe((data) => {
        this.supPurchases = data.filter(
          (purchase) => purchase.status == "open"
        );
        for (let order of data) {
        }
      });
  }

  deleteComponent(id) {
    this.inventoryService.deleteComponentById(id).subscribe((data) => {
      if (data.msg == "deleted") {
        this.toastSrv.success("Component Deleted !");
        this.components = this.components.filter((c) => c._id != id);
      }
    });
  }

  getProductsWithItem() {
    this.gettingProducts = true;
    this.inventoryService
      .getAllProductsWithItem(this.resCmpt.componentN)
      .subscribe((response) => {
        this.gettingProducts = false;
        if (response.allProductsWithItem)
          this.resCmpt.connectedProducts = response.allProductsWithItem;
      });
  }

  async getUser() {
    if (this.authService.loggedInUser.authorization.includes("updateStock")) {
      this.allowUserEditItem = true;
    }

    if (
      this.authService.loggedInUser.userName == "SHARK" ||
      this.authService.loggedInUser.userName == "sima" ||
      this.authService.loggedInUser.userName == "martha" ||
      this.authService.loggedInUser.userName == "dani"
    ) {
      this.showDeleteBtn = true;
    }
    await this.authService.userEventEmitter.subscribe((user) => {
      this.user = user;
      // this.user=user.loggedInUser;
      // if (!this.authService.loggedInUser) {
      //   this.authService.userEventEmitter.subscribe(user => {
      //     if (user.userName) {
      //       this.user = user;

      //     }
      //   });
      // }
      // else {
      //   this.user = this.authService.loggedInUser;
      // }
    });
  }

  resetResCmptData() {
    this.resCmpt = {
      whoPays: "",
      payingCustomersList: [],
      componentN: "",
      componentName: "",
      componentNs: "",
      suplierN: "",
      suplierName: "",
      componentType: "",
      componentCategory: "",
      img: "",
      importFrom: "",
      lastModified: "",
      minimumStock: "",
      needPrint: "",
      packageType: "",
      packageWeight: "",
      remarks: "",
      componentItems: [],
      input_actualMlCapacity: 0,
    };
  }

  uploadMsds(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    console.log(file);

    this.uploadService.uploadFileToS3Storage(file).subscribe((data) => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.resMaterial.msds = data.partialText;
        console.log(" this.resCmpt.img " + this.resCmpt.img);
      }
    });
  }

  uploadCoaMaster(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    console.log(file);

    this.uploadService.uploadFileToS3Storage(file).subscribe((data) => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.resMaterial.coaMaster = data.partialText;
        console.log(" this.resCmpt.img " + this.resCmpt.img);
      }
    });
  }

  uploadImg(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    console.log(file);

    this.uploadService.uploadFileToS3Storage(file).subscribe((data) => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.resCmpt.img = data.partialText;
        console.log(" this.resCmpt.img " + this.resCmpt.img);
        this.editVersionForm.controls.image.setValue(this.resCmpt.img);
      }
    });
  }

  updateComponentVersion() {
    this.editVersionForm.controls.user.setValue(
      this.authService.loggedInUser.userName
    );
    this.resCmpt.versionNumber =
      this.editVersionForm.get("versionNumber").value;
    this.resCmpt.versionHistory.push(this.editVersionForm.value);
    this.editStockItemDetails();
    this.editVersionForm.reset();
  }

  async getCmptAmounts(cmptN, cmptId) {
    this.callingForCmptAmounts = true;
    // this.currItemShelfs=[];
    this.newItemShelfPosition = "";
    this.newItemShelfQnt = 0;
    this.destShelf = "";
    await this.inventoryService
      .getAmountOnShelfs(cmptN)
      .subscribe(async (res) => {
        this.callingForCmptAmounts = false;

        // remove these 2 filters after "Rosh HaAyin" components are all removed from db ("Rosh HaAyin C" = new warehouse for components)
        this.itemAmountsData =
          this.stockType == "material"
            ? res.data
            : res.data.filter((is) => is.wh != "5c1124ef2db99c4434914a0e"); // remove
        this.itemAmountsWh =
          this.stockType == "material"
            ? res.whList
            : res.whList.filter((wh) => wh != "Rosh HaAyin"); // remove

        this.currItemShelfs = [];
        this.newItemShelfWH = "";

        await this.openAmountsData(cmptN, cmptId);
      });
  }
  getAllOrderItems(componentN) {
    this.orderService.getOrderItemsByNumber(componentN).subscribe((data) => {
      this.orderItems = data;
    });
  }

  // getAllItems() {
  //
  //   this.itemService.getAllItemsTwo().subscribe(data=>{
  //
  //     this.items = data;
  //   })
  // }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  inputProcurment(event: any) {
    // without type info
    this.procurementInputEvent = event;
    this.procurmentQnt = event.target.value;
  }

  getAllMaterialLocations() {
    this.inventoryService.getAllMaterialLocations().subscribe((data) => {
      this.materialLocations = data;
    });
  }

  updateProcurment(componentId, componentNum, status) {
    if (status == "false") {
      this.procurmentQnt = null;
    }
    let objToUpdate = {
      _id: componentId,
      componentN: componentNum,
      procurementSent: status, //האם בוצעה הזמנת רכש
      procurementAmount: this.procurmentQnt, //כמות בהזמנת רכש
    };
    this.inventoryService
      .updateComptProcurement(objToUpdate)
      .subscribe((res) => {
        if (res.ok != 0 && res.n != 0) {
          console.log("res updateComptProcurement: " + res);
          this.components.map((item) => {
            if (item._id == componentId) {
              item.procurementAmount = objToUpdate.procurementAmount;
              if (this.procurmentQnt == null) {
                item.procurementSent = false;
              } else {
                this.procurementInputEvent.target.value = "";
                item.procurementSent = true;
              }
            }
          });
        }
      });
  }

  addItemStockAllocation(componentNum) {
    if (
      this.newAllocationOrderNum != null &&
      this.newAllocationAmount != null
    ) {
      let objToUpdate = {
        _id: this.itemIdForAllocation,
        componentN: componentNum,
        allocations: [
          {
            relatedOrderN: this.newAllocationOrderNum,
            amount: this.newAllocationAmount,
            supplied: 0,
          },
        ],
      };
      this.inventoryService
        .updateComptAllocations(objToUpdate)
        .subscribe((res) => {
          if (res.ok != 0 && res.n != 0) {
            console.log("res updateComptAllocations: " + res);
            this.resCmpt.allocations.push(objToUpdate.allocations[0]);
            this.resCmpt.allocAmount += objToUpdate.allocations[0].amount;
          }
        });
    }
    this.newAllocationOrderNum = null;
    this.newAllocationAmount = null;
  }
  edit(index) {
    this.rowNumber = index;
    setTimeout(() => (this.rowNumber = -1), 1000 * 60);
  }

  deleteStockItemValidation(stockItemNumber) {
    let ItemToDelete = this.components
      .filter(
        (i) => i.componentN == stockItemNumber && i.itemType == this.stockType
      )
      .slice()[0];
    if (
      confirm(
        "האם אתה רוצה למחוק את פריט ?\n מספר פריט: " +
          ItemToDelete.componentN +
          "\n שם פריט: " +
          ItemToDelete.componentName
      )
    ) {
      if (this.stockType == "component") {
        this.inventoryService
          .getItemsByCmpt(ItemToDelete.componentN, ItemToDelete.componentType)
          .subscribe((resp) => {
            if (resp.length > 0) {
              alert("יש מוצרים מקושרים לפריט - לא ניתן למחוק");
            } else {
              this.deleteStockItem(ItemToDelete);
            }
          });
      } else if (this.stockType == "product") {
        this.deleteStockItem(ItemToDelete);
      } else if (this.stockType == "material") {
      }
    }
  }

  deleteStockItem(ItemToDelete) {
    this.inventoryService
      .deleteStockItemAndItemShelfs(
        ItemToDelete.componentN,
        ItemToDelete.itemType
      )
      .subscribe((res) => {
        if (res.componentN) {
          this.toastSrv.success("item deleted!\n" + res.componentN);
          this.componentsUnFiltered.filter((c, key) => {
            if (c.componentN == res.componentN && c.itemType == res.itemType) {
              this.componentsUnFiltered.splice(key, 1); //remove from array

              if (this.components.length > 1) {
                this.components.filter((c, key) => {
                  if (
                    c.componentN == res.componentN &&
                    c.itemType == res.itemType
                  ) {
                    this.components.splice(key, 1); //remove from array
                  }
                });
              } else {
                this.setType(this.stockType);
              }
            }
          });
        }
      });
  }

  deleteItemStockAllocation(cmptId, rowIndex) {
    if (confirm("מחיקת הקצאה")) {
      let amountDeleted = this.resCmpt.allocations[rowIndex].amount;
      let newAllocationsArr = this.resCmpt.allocations.splice(rowIndex - 1, 1);
      let objToUpdate = {
        _id: this.itemIdForAllocation,
        allocations: newAllocationsArr,
      };
      this.inventoryService.updateCompt(objToUpdate).subscribe((res) => {
        console.log("res updateCompt: " + res);
        if (res._id) {
          this.resCmpt.allocAmount -= amountDeleted;
        }
      });
    }
  }

  procurementRecommendations(filterType) {
    if (filterType == "minimumStock") {
      if (this.stockType != "product") {
        let recommendList = this.components.filter(
          (cmpt) => Number(cmpt.minimumStock) >= cmpt.amount
        );
        this.components = recommendList;
      }
    } else if (filterType == "haveRecommendation") {
      if (this.stockType != "product") {
        let recommendList = this.components.filter(
          (cmpt) => cmpt.purchaseRecommendations.length > 0
        );
        this.components = recommendList;
      }
    }
  }

  filterMaterialsTable() {
    let tempArr = [...this.componentsUnFiltered];
    let type = this.materialFilterType;
    let value = this.materialFilterValue;
    if (type == "location") {
      let filteredArray = tempArr.filter((m) => m.location == value);
      this.components = filteredArray;
    }
    if (type == "permissionDangerMaterials") {
      let filteredArray = tempArr.filter(
        (m) => m.permissionDangerMaterials == "true"
      );
      this.components = filteredArray;
    }
    if (type == "threatment") {
      let filteredArray = tempArr.filter((m) => m.threatment == value);
      this.components = filteredArray;
    }
    if (type == "function") {
      let filteredArray = tempArr.filter(
        (m) => m.function && m.function.includes(value)
      );
      this.components = filteredArray;
    }
    if (type == "stateOfMatter") {
      let filteredArray = tempArr.filter((m) => m.stateOfMatter == value);
      this.components = filteredArray;
    }
    if (type == "") {
      this.components = this.components.filter((x) => x.itemType == "material");
    }
  }

  getTotalComponentsValue() {
    for (let component of this.components) {
      if (component.itemType == "component") {
        for (let i = 0; i < 3; i++) {
          if (
            component.alternativeSuppliers[i] &&
            component.alternativeSuppliers[i].price
          ) {
            if (component.alternativeSuppliers[i].price != "") {
              this.totalComponentsValue +=
                parseInt(component.alternativeSuppliers[i].price) *
                parseInt(component.amount);
            }
            break;
          }
        }
      }
    }
  }

  upload(src) {
    // const number = this.route.snapshot.paramMap.get('itemNumber');
    // this.progress.percentage = 0;
    // this.currentFileUpload = this.selectedFiles.item(0);
    // this.uploadService.pushFileToStorage(this.currentFileUpload, src, number).subscribe(event => {
    //   console.log(event);
    //   if (event.type === HttpEventType.UploadProgress) {
    //     this.progress.percentage = Math.round(100 * event.loaded / event.total);
    //   } else if (event instanceof HttpResponse) {
    //     console.log('File is completely uploaded!');
    //     console.log(event.body);
    //   }
    // });
    // this.selectedFiles = undefined;
  }

  deleteFromComposition(materialId, compositionName) {
    let material = this.components.find((m) => m._id == materialId);
    for (let i = 0; i < material.composition.length; i++) {
      if (material.composition[i].compName == compositionName) {
        material.composition.splice(i, 1);
        this.toastSrv.success("Composition Deleted");
      }
    }
  }

  checkIfInciNameExist(ev) {
    let inciName = ev.target.value;
    if (inciName != "") {
      let material = this.components.filter((m) => m.inciName == inciName);
      if (material.length > 0) {
        material.forEach((m) => {
          this.toastSrv.error(m.componentN);
        });
        this.toastSrv.error("שים לב שם זה קיים בחומרי גלם :");
      }
    }
  }

  showDialog() {}

  makeAsMainSupplier(index) {
    let id;
    if (this.stockType == "component") id = this.resCmpt._id;
    if (this.stockType == "material") id = this.resMaterial._id;

    this.inventoryService.setAsMainSupplier(index, id).subscribe((data) => {
      if (data) {
        if (this.stockType == "component")
          this.resCmpt.alternativeSuppliers = data.alternativeSuppliers;
        if (this.stockType == "material")
          this.resMaterial.alternativeSuppliers = data.alternativeSuppliers;

        this.toastSrv.success("ספק ראשי עודכן בהצלחה!");
      }
    });
  }

  mainSupplier(isMain) {
    if (isMain) {
      return "lightgreen";
    } else {
      return "";
    }
  }

  switchModalView(componentN) {
    let sumOutMovements = 0;
    this.loadingMovements = true;

    var beforeOneYear = new Date();
    beforeOneYear.setFullYear(beforeOneYear.getFullYear() - 1);

    if (componentN == "" || componentN == undefined) {
      componentN = this.resCmpt.componentN;
    }
    this.inventoryService.getItemMovements(componentN).subscribe((data) => {
      if (data) {
        //  for (let i = 0; i < data.length; i++) {
        //    if(data[i].movementType != 'in'){
        //     data[i].originShelfQntBefore = data[i].originShelfQntBefore + Math.abs(data[i].amount)
        //    }
        //  }
        console.log(data);
        data.forEach((component) => {
          if (component.movementType) {
            component.originShelfQntBefore =
              component.originShelfQntBefore - Math.abs(component.amount);
          }
          if (component.movementType == "out") {
            if (component.movementDate > beforeOneYear.toISOString()) {
              sumOutMovements += component.amount;
            }
          }
        });

        this.lastYearOutAmount = sumOutMovements;
        this.itemMovements = data;
        this.itemShellUpdates = [];
        this.inventoryService
          .getItemShellsAfterUpdateByNumber(componentN)
          .subscribe((itemShells) => {
            console.log(itemShells);
            if (itemShells.msg) {
              this.toastSrv.error(itemShells.msg);
            } else if (itemShells.length > 0) {
              this.itemShellUpdates = itemShells;
            }
          });
        this.loadingMovements = false;
      }
    });

    if (!this.showItemDetails) {
      this.showItemDetails = true;
      this.itemmoveBtnTitle = "Item movements";
    } else {
      this.showItemDetails = false;
      this.itemmoveBtnTitle = "Back to item details";
      this.loadingMovements = false;
    }
  }

  getMaterialUsage() {
    console.log(this.monthsCount);
    console.log(this.lastOrdersOfItem[0].number);
    console.log(this.lastOrdersOfItem[0].itemName);
    console.log(this.lastOrdersOfItem[0].name);
    this.inventoryService
      .getMaterialUsage(this.monthsCount, this.lastOrdersOfItem[0].number)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          console.log(data.msg);
          this.toastSrv.error(data.msg);
          return;
        } else if (data) {
          this.materialUsage = data;
        }
      });
  }
  getComponentUsage() {
    console.log(this.monthsCount);
    console.log(this.resCmpt.componentN);
    console.log(this.resCmpt.componentName);
    this.inventoryService
      .getComponentUsage(this.monthsCount, this.resCmpt.componentN)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          console.log(data.msg);
          this.toastSrv.error(data.msg);
          this.componentUsage = data;
          return;
        } else if (data) {
          this.componentUsage = data;
        }
      });
  }

  // ********************ENLARGE TABLE IMAGE BY CLICK************

  // ************************************************************
} // END OF CMPT CLASS

// startDownloadingInventory() {
//   ;
//   this.inventoryService.startNewItemObservable().subscribe((components) => {
//     ;
//     components.forEach(comp => {
//       if(comp.alternativeSuppliers) {
//         comp.alternativeSuppliers.forEach(supplier => {
//           if(supplier.subGroup == undefined){
//             supplier.subGroup = ''
//           }
//           if(supplier.expectedArrival == undefined){
//             supplier.expectedArrival = ''
//           }
//         });
//       }
//     });

//     if(components.length < 1500) {
//       this.smallLoader = false;
//       // this.getAllPurchases();
//     }
//     if (components.length > 0) {
//       this.showLoader = false;
//       this.components= this.components.concat([...components]);
//       if (!this.componentsUnFiltered) {
//         this.componentsUnFiltered = [];
//       }
//       this.componentsUnFiltered= this.componentsUnFiltered.concat([...components]);
//       // this.calculateMaterialArrival();
//       this.getAmountsFromShelfs();
//     }
//   });
// }

// filterRows(event, filterType) {
//   ;
//   this.emptyFilterArr = true;
//   this.components = this.componentsUnFiltered.filter(x => x.itemType == this.stockType);
//   this.filterVal = '';
//   this.filterVal = event.target.value;
//   if (this.route.snapshot.queryParams.componentN) {
//     this.filterVal = this.route.snapshot.queryParams.componentN
//   }
//   if (this.stockType != 'product') {
//     if (this.filterByType != undefined) {
//       if (this.filterByType.nativeElement.value != "" && this.filterByType.nativeElement.value != 'בחר סוג') {
//         let CmptType = this.filterByType.nativeElement.value;
//         this.components = this.components.filter(x => (x.componentType == CmptType));
//         this.components
//       }
//     }
//     if (this.filterByCategory != undefined) {
//       if (this.filterByCategory.nativeElement.value != "" && this.filterByCategory != undefined) {
//         let category = this.filterByCategory.nativeElement.value;
//         this.components = this.components.filter(x => (x.componentCategory == category && x.itemType.includes(this.stockType)));

//       }
//     }
//     if (this.filterBySupplierN != undefined) {
//       if (this.filterBySupplierN.nativeElement.value != "" && this.filterBySupplierN != undefined) {
//         let supplierN = this.filterBySupplierN.nativeElement.value;

//         this.components = this.components.filter(x => (x.componentNs.includes(supplierN) && x.itemType.includes(this.stockType)));
//       }
//     }
//     if (this.filterBySupplier != undefined) {
//       if (this.filterBySupplier.nativeElement.value != "" && this.filterBySupplier != undefined) {
//         let supplierName = this.filterBySupplier.nativeElement.value;

//         this.components = this.components.filter(x => (x.suplierName.includes(supplierName) && x.itemType.includes(this.stockType)));
//       }
//     }
//   }
//   if (this.filterbyNum.nativeElement.value != "" && this.filterbyNum != undefined) {
//     let itemNum = this.filterbyNum.nativeElement.value;
//     this.components = this.components.filter(x => (x.componentN == itemNum && x.itemType == this.stockType));
//   }

//   if (this.filterByItem.nativeElement.value != '' && this.filterByItem != undefined) {

//     let itemNumber = this.filterByItem.nativeElement.value;
//     this.itemService.getItemData(itemNumber).subscribe(data => {
//       this.components = this.components.filter(x => x.componentN == data[0].bottleNumber || x.componentN == data[0].sealNumber || x.componentN == data[0].tubeNumber || x.componentN == data[0].capNumber
//         || x.componentN == data[0].boxNumber || x.componentN == data[0].stickerNumber)
//     })
//   }

//   if (this.filterByCmptName.nativeElement.value != "") {
//     let word = event.target.value;
//     let wordsArr = word.split(" ");
//     wordsArr = wordsArr.filter(x => x != "");
//     if (wordsArr.length > 0) {
//       let tempArr = [];
//       this.components.filter(stk => {
//         var check = false;
//         var matchAllArr = 0;
//         wordsArr.forEach(w => {
//           if (stk.componentName.toLowerCase().includes(w.toLowerCase()) && stk.itemType == this.stockType) {
//             matchAllArr++
//           }
//           if (stk.inciName && stk.inciName.toLowerCase().includes(w.toLowerCase()) && stk.itemType == this.stockType) {
//             matchAllArr++
//           }
//           (matchAllArr == wordsArr.length) ? check = true : check = false;
//         });

//         if (!tempArr.includes(stk) && check) tempArr.push(stk);
//       });
//       this.components = tempArr;

//     }
//   }

//   if (this.components.length == 0) {
//     this.emptyFilterArr = false;
//     this.components = this.componentsUnFiltered.filter(x => x.itemType == this.stockType);
//   }

// }
