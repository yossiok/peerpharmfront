import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuppliersService } from "src/app/services/suppliers.service";
import { InventoryService } from "src/app/services/inventory.service";
import { AuthService } from "src/app/services/auth.service";
import { UserInfo } from "../../taskboard/models/UserInfo";
import { Procurementservice } from "src/app/services/procurement.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PurchaseData } from "../procumentOrders/PurchaseData";
import { DeliveryCertificate } from "../procumentOrders/DeliveryCert";
import { InvoiceData } from "./InvoiceData";
import { StockItem } from "./StockItem";
import { Currencies } from "../Currencies";

import { UsersService } from "src/app/services/users.service";
import { templateJitUrl } from "@angular/compiler";

@Component({
  selector: "app-new-procurement",
  templateUrl: "./new-procurement.component.html",
  styleUrls: ["./new-procurement.component.scss"],
})
export class NewProcurementComponent implements OnInit, OnChanges {
  @Input() purchaseData: any;
  @Input() requestToPurchase: any;
  @Input() isEdit: boolean;
  @Input() currencies: Currencies;
  @Output() newProcurementSaved: EventEmitter<PurchaseData> =
    new EventEmitter<PurchaseData>();
  @Output() closeOrderModal: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @ViewChild("itemNumber") itemNumber: ElementRef;
  @ViewChild("itemName") itemName: ElementRef;
  @ViewChild("coin") coin: ElementRef;
  @ViewChild("measurement") measurement: ElementRef;
  @ViewChild("supplierPrice") supplierPrice: ElementRef;
  @ViewChild("itemRemarks") itemRemarks: ElementRef;
  @ViewChild("updateItemAmount") updateItemAmount: ElementRef;
  @ViewChild("updateItemPrice") updateItemPrice: ElementRef;

  @ViewChild("editQuantity") editQuantity: ElementRef;
  @ViewChild("editPrice") editPrice: ElementRef;
  @ViewChild("editArrival") editArrival: ElementRef;
  @ViewChild("sumShipping") sumShipping: ElementRef;
  @ViewChild("cb") checkItem: ElementRef;
  @ViewChild("setEstimatedDate") setEstimatedDate: ElementRef;

  openOrdersModal: boolean = false;
  shippingInvoiceDetails: boolean = false;
  disabled: boolean = true;
  supplierToUpdate: any;
  stockItems: any[] = [];
  user: any;
  EditRowId: string = "";
  currSupplier: any;
  currItemForPL: any;
  procurementSupplier: boolean = true;
  procurementItems: boolean = false;
  allSuppliers: any[];
  hasAuthorization: boolean = false;
  existOpenOrderAlert: boolean = false;
  showUpdatePLModal: boolean = false;
  allMaterials: any[];
  itemExistInOrders: any[];
  userEmail: any;
  editItem: boolean = false;
  newPurchaseAllowed: boolean = false;
  editPurchaseAllowed: boolean = false;
  notActive: boolean = false;

  newPurchase: FormGroup;
  // deliveryCertificateForm: FormGroup;
  itemForm: FormGroup;
  userName: string;
  editArrivalDateForPurchase: boolean = false;

  // Items to select for invoice / deliveryCert
  selectedItems: StockItem[] = [];

  deliveryCertificate: DeliveryCertificate = {
    certificateNumber: "",
    deliveryArrivalDate: null,
    stockitems: this.selectedItems,
    remarks: "",
    userName: this.authService.loggedInUser.userName,
  };
  certValid: boolean = false;

  //invoice data
  invoice: InvoiceData = {
    purchaseInvoiceNumber: 0,
    invoiceRemarks: "",
    coinRate: 0,
    invoiceCoin: "",
    invoicePrice: 0,
    taxes: 0,
    taxesTwo: 0,
    fixedPrice: 0,
    stockitems: this.selectedItems,
    shippingPrice: 0,
  };

  //toggle purchase details
  showPurchaseDetails: boolean = false;
  showItemDetails: boolean = false;
  itemIndex: number;
  submittingCert: boolean;
  sendingPurchase: boolean;
  lastSupplier: string;
  wow: boolean = false;
  statusDate: any;
  statusTypeToSet: any;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {}

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private procurementService: Procurementservice,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private supplierService: SuppliersService,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.newPurchase = fb.group({
      _id: [""],
      supplierName: ["", Validators.required],
      supplierNumber: ["", Validators.required],
      supplierCountry: [""],
      supplierEmail: [""],
      origin: [""],
      creationDate: [this.formatDate(new Date()), Validators.required],
      requestedDate: [{ value: null, disabled: this.disabled && this.isEdit }],
      arrivalDate: [
        {
          value: this.formatDate(new Date()),
          disabled: this.disabled && this.isEdit,
        },
      ], //approval(promised) date
      stockitems: [[], Validators.required],
      orderNumber: [""],
      userEmail: [""],
      user: [""],
      billNumber: [[]],
      orderType: ["", Validators.required],
      remarks: [""],
      status: ["open"],
      statusChange: [this.formatDate(new Date())],
      statusUpdates: [
        [
          {
            prev: null,
            date: this.formatDate(new Date()),
            new: "open",
            user: this.authService.loggedInUser.userName,
          },
        ],
      ],
      deliveryCerts: [[]],
      outOfCountry: [false],
      recommendId: [""],
      sumShippingCost: [0],
      closeReason: [""],
      shippingPercentage: [0],
      finalPurchasePrice: [0],
    });

    // this.deliveryCertificateForm = fb.group({
    //   certificateNumber: ['', Validators.required],
    //   deliveryArrivalDate: [new Date(), Validators.required],
    //   // itemNumber: ['', Validators.required],
    //   amount: [null, Validators.required],
    //   remarks: [''],
    //   userName: ['']
    // })

    this.itemForm = fb.group({
      number: ["", Validators.required],
      name: ["", Validators.required],
      coin: ["", Validators.required],
      measurement: ["kg", Validators.required],
      price: [0, Validators.required],
      quantity: ["", Validators.required],
      color: [""],
      remarks: [""],
      itemPrice: [""],
      itemArrival: [""],
      itemRequested: [this.newPurchase.value.requestedDate],
      supplierItemNum: [""],
      historyAmounts: [[""]],
      componentType: [""],
      isStock: [true],
      customerOrders: [[]],
    });
  }

  ngOnInit() {
    this.getUserInfo();
    if (this.purchaseData && this.purchaseData.arrivalDate) {
      this.itemForm.controls.itemArrival.setValue(
        this.purchaseData.arrivalDate
      );
    } else if (this.purchaseData && !this.purchaseData.arrivalDate) {
      this.itemForm.controls.itemArrival.setValue(null);
    }
    if (this.requestToPurchase) {
      this.newPurchase.patchValue({
        _id: "",
        supplierName: this.requestToPurchase.supplierName,
        supplierNumber: this.requestToPurchase.supplierNumber,
        creationDate: this.formatDate(new Date()),
        arrivalDate: this.requestToPurchase.arrivalDate,
        stockitems: this.requestToPurchase.stockitems,
        orderNumber: "",
        userEmail: "",
        user: this.requestToPurchase.user,
        billNumber: [],
        orderType: this.requestToPurchase.type,
        remarks: this.requestToPurchase.remarks,
        status: "open",
        deliveryCerts: [],
        outOfCountry: false,
        recommendId: this.requestToPurchase._id,
      });
    }
    if (this.purchaseData) {
      this.purchaseData.recommendId = "";
      this.stockItems = this.purchaseData.stockitems;
    } else console.log("");
    if (this.isEdit) {
      if (!this.purchaseData.closeReason) this.purchaseData.closeReason = "";
      if (!this.purchaseData.userEmail) this.purchaseData.userEmail = "";
      if (!this.purchaseData.user) this.purchaseData.user = "";
      if (!this.purchaseData.supplierCountry)
        this.purchaseData.supplierCountry = "";
      if (!this.purchaseData.shippingPercentage)
        this.purchaseData.shippingPercentage = 0;
      if (!this.purchaseData.finalPurchasePrice)
        this.purchaseData.finalPurchasePrice = 0;
      if (!this.purchaseData.origin) this.purchaseData.origin = "";
      if (!this.purchaseData.statusUpdates)
        this.purchaseData.statusUpdates = [];
      if (!this.purchaseData.statusChange)
        this.purchaseData.statusChange = null;
      if (!this.purchaseData.requestedDate)
        this.purchaseData.requestedDate = null;
      if (!this.purchaseData.arrivalDate) this.purchaseData.arrivalDate = null;
      this.newPurchase.setValue(this.purchaseData as PurchaseData);
      this.newPurchase.controls.orderType.setValue(this.purchaseData.orderType);
    } else this.purchaseData = undefined;
    this.getAllSuppliers();
    this.getAllMaterials();
    if (this.authService.loggedInUser) {
      this.newPurchase.controls.userEmail.setValue(
        this.authService.loggedInUser.userEmail
      );
      this.user = this.authService.loggedInUser.userName;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isEdit.currentValue) {
      if (changes.purchaseData) {
        if (!changes.purchaseData.currentValue.recommendId)
          changes.purchaseData.currentValue.recommendId = "";
        if (!changes.purchaseData.currentValue.sumShippingCost)
          changes.purchaseData.currentValue.sumShippingCost = 0;
      }
      if (this.isEdit) {
        if (changes.purchaseData.currentValue.remarks == null)
          changes.purchaseData.currentValue.remarks = "";
        if (!changes.purchaseData.currentValue.closeReason)
          changes.purchaseData.currentValue.closeReason = "";
        if (!changes.purchaseData.currentValue.userEmail)
          changes.purchaseData.currentValue.userEmail = "";
        if (!changes.purchaseData.currentValue.supplierCountry)
          changes.purchaseData.currentValue.supplierCountry = "";
        if (!changes.purchaseData.currentValue.user)
          changes.purchaseData.currentValue.user = "";
        if (!changes.purchaseData.currentValue.shippingPercentage)
          changes.purchaseData.currentValue.shippingPercentage = 0;
        if (!changes.purchaseData.currentValue.finalPurchasePrice)
          changes.purchaseData.currentValue.finalPurchasePrice = 0;
        if (!changes.purchaseData.currentValue.origin)
          changes.purchaseData.currentValue.origin = "";
        if (!changes.purchaseData.currentValue.statusUpdates)
          changes.purchaseData.currentValue.statusUpdates = [];
        if (!changes.purchaseData.currentValue.statusChange)
          changes.purchaseData.currentValue.statusChange = null;
        if (!changes.purchaseData.currentValue.requestedDate)
          changes.purchaseData.currentValue.requestedDate = null;
        this.newPurchase.setValue(changes.purchaseData.currentValue);
      }
    }
  }

  getUserInfo() {
    this.userName = this.authService.loggedInUser.userName;
    if (this.authService.loggedInUser.authorization.includes("newPurchase")) {
      this.newPurchaseAllowed = true;
    }
    if (this.authService.loggedInUser.authorization.includes("editPurchase")) {
      this.editPurchaseAllowed = true;
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  updateItemInPL() {
    this.supplierService
      .updateSupplierPrice(this.supplierToUpdate)
      .subscribe((data) => {
        if (data) {
          this.toastr.success("מחיר עודכן בהצלחה !");
        }
      });
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

  //Materials
  fillMaterialNumber(ev) {
    var materialName = ev.target.value;
    var material = this.allMaterials.find(
      (material) => material.componentName == materialName
    );
    this.itemForm.controls.number.setValue(material.componentN);
    this.findStockItemByNumber();
  }

  getAllMaterials() {
    this.inventoryService.getAllMaterialsForFormules().subscribe((data) => {
      this.allMaterials = data;
    });
  }

  // Suppliers
  getAllSuppliers() {
    this.supplierService.getSuppliersDiffCollection().subscribe((data) => {
      this.allSuppliers = data;
    });
  }

  fillSupplierDetails(ev) {
    let supplier = ev.target.value;
    let result = this.allSuppliers.filter((x) => supplier == x.suplierName);
    this.currSupplier = result[0];
    this.newPurchase.controls.supplierNumber.setValue(
      this.currSupplier.suplierNumber
    );
    if (this.currSupplier.email) {
      this.newPurchase.controls.supplierEmail.setValue(this.currSupplier.email);
    }
    if (this.currSupplier.country) {
      this.newPurchase.controls.supplierCountry.setValue(
        this.currSupplier.country
      );
    }
    if (this.currSupplier.origin) {
      this.newPurchase.controls.origin.setValue(this.currSupplier.origin);
    }
  }

  updateSupplierEmail(ev) {
    let email = ev.target.value;
    if (confirm("האם לעדכן מייל אצל הספק ?")) {
      this.currSupplier.email = email;
      if (email != "") {
        this.supplierService
          .updateCurrSupplier(this.currSupplier)
          .subscribe((data) => {
            if (data) {
              this.toastr.success("מייל עודכן בהצלחה !");
            }
          });
      }
    }
  }

  //Stock Items

  editAllItemsArrival(e) {
    this.newPurchase.value.stockitems.map((si) => {
      si.itemArrival = e.target.value;
      return si;
    });
  }

  checkIfItemIsActive(itemNumber) {
    return new Promise((resolve, reject) => {
      this.inventoryService
        .checkIfItemIsActive(itemNumber)
        .subscribe((data) => {
          console.log(data);
          this.notActive = data ? true : false;
          resolve(data);
        });
    });
  }

  async findStockItemByNumber() {
    let notActive = await this.checkIfItemIsActive(
      this.itemForm.get("number").value
    );
    console.log(notActive);
    if (notActive) {
      alert("הפריט לא פעיל ולא ניתן להזמין אותו ");
      return;
    }

    this.getLastOrdersForItem(this.itemForm.get("number").value);

    if (this.itemForm.get("number").value != "") {
      //this.purchaseData.orderType
      if (this.newPurchase && this.purchaseData) {
        this.newPurchase.controls.orderType.setValue(
          this.purchaseData.orderType
        );
      }
      if (this.newPurchase.controls.orderType.value == "material") {
        this.inventoryService
          .getMaterialStockItemByNum(this.itemForm.get("number").value)
          .subscribe((data) => {
            if (data[0]) {
              if (data[0].permissionDangerMaterials)
                this.toastr.info(
                  "לחומר גלם זה מסומן היתר רעלים והכמות המותרת לאחסון הינה" +
                    " " +
                    data[0].allowQtyInStock,
                  "הערה חשובה!"
                );
              this.itemForm.controls.name.setValue(data[0].componentName);
              //set price
              this.itemForm.controls.price.setValue(data[0].manualPrice);
              // set coin
              this.itemForm.controls.coin.setValue(
                data[0].manualCoin ? data[0].manualCoin.toUpperCase() : null
              );
              this.itemForm.controls.measurement.setValue(
                data[0].unitOfMeasure
                  ? data[0].unitOfMeasure
                  : data[0].measurement
              );
              this.itemForm.controls.supplierItemNum.setValue(
                data[0].componentNs
              );

              if (!data[0].price || data[0].price == "") {
                // search in suppliers
                var supplier = data[0].alternativeSuppliers.find(
                  (s) =>
                    s.supplierName ==
                    this.newPurchase.controls.supplierName.value
                );
                if (!supplier)
                  this.toastr.info("הספק אינו ברשימת הספקים של הפריט");
                else {
                  this.itemForm.controls.price.setValue(
                    parseFloat(supplier.price)
                  );
                  this.itemForm.controls.coin.setValue(
                    supplier.coin.toUpperCase()
                  );
                }
              }
            } else {
              this.toastr.error(
                "" +
                  this.newPurchase.controls.orderType.value +
                  "פריט לא קיים במערכת כ"
              );
            }
          });
      } else if (this.newPurchase.controls.orderType.value == "component") {
        this.inventoryService
          .getCmptByitemNumber(this.itemForm.get("number").value)
          .subscribe((data) => {
            if (data[0]) {
              this.itemForm.controls.name.setValue(data[0].componentName);
              this.itemForm.controls.coin.setValue(
                data[0].coin ? data[0].coin.toUpperCase() : "ILS"
              );
              this.itemForm.controls.measurement.setValue(
                data[0].unitOfMeasure
                  ? data[0].unitOfMeasure
                  : data[0].measurement
              );
              this.itemForm.controls.supplierItemNum.setValue(
                data[0].componentNs
              );
              this.itemForm.controls.componentType.setValue(
                data[0].componentType
              );

              //set price
              this.itemForm.controls.price.setValue(data[0].price);
              if (!data[0].price || data[0].price == "") {
                // search in suppliers
                var supplier = data[0].alternativeSuppliers.find(
                  (s) =>
                    s.supplierName ==
                    this.newPurchase.controls.supplierName.value
                );
                if (!supplier)
                  this.toastr.info("הספק אינו ברשימת הספקים של הפריט");
                else {
                  this.itemForm.controls.price.setValue(
                    parseFloat(supplier.price)
                  );
                  this.itemForm.controls.coin.setValue(
                    supplier.coin.toUpperCase()
                  );
                }
              }
            } else {
              this.toastr.error(
                "" +
                  this.newPurchase.controls.orderType.value +
                  "פריט לא קיים במערכת כ"
              );
            }
          });
      } else if (
        this.newPurchase.controls.orderType.value == "" ||
        this.newPurchase.controls.orderType.value == null ||
        this.newPurchase.controls.orderType.value == undefined
      ) {
        this.toastr.warning("Must Choose Component Type");
      }
    } else this.toastr.warning("יש לרשום מספר פריט.");
  }

  getLastOrdersForItem(componentN) {
    this.itemForm.controls.historyAmounts.setValue([]);
    this.lastSupplier = "";
    this.procurementService
      .getLastOrdersForItem(componentN, 100)
      .subscribe((orders) => {
        if (orders && orders.length > 0) {
          let currentYear = 0;
          let lastYear = 0;
          for (let order of orders) {
            if (this.lastSupplier == "") this.lastSupplier = order.supplierName;
            if (order.orderDate.slice(0, 4) == "2022")
              currentYear += Number(order.quantity);
            else if (order.orderDate.slice(0, 4) == "2021")
              lastYear += Number(order.quantity);
          }
          this.itemForm.controls.historyAmounts.setValue([
            { year: 2022, amount: currentYear },
            { year: 2021, amount: lastYear },
          ]);
        } else this.itemForm.controls.historyAmounts.setValue([]);
      });
  }

  addItemToPurchase() {
    this.itemForm.controls.itemRequested.setValue(
      this.newPurchase.value.requestedDate
    );
    this.stockItems.push(this.itemForm.value);
    this.newPurchase.controls.stockitems.setValue(this.stockItems);
    this.resetStockItem();
    this.toastr.success("Item Added Successfully");
  }

  addCusomerOrderNumberToItem(e, i) {
    if (!this.itemForm.controls.customerOrders.value)
      this.itemForm.controls.customerOrders.setValue([]);
    this.itemForm.controls.customerOrders.value.push(e.value);
    e.value = "";
  }

  editStockItem(number) {
    if (number != "") {
      this.EditRowId = number;
    } else {
      this.EditRowId = "";
    }
  }

  saveStockItem(index) {
    let stockitem = this.newPurchase.controls.stockitems.value[index];
    stockitem.price = this.editPrice.nativeElement.value;
    stockitem.itemArrival = this.editArrival.nativeElement.value;
    stockitem.quantity = this.editQuantity.nativeElement.value;
    this.toastr.success("פריט עודכן בהצלחה");
    this.editStockItem("");
  }

  removeStockitemFromPurchase(i) {
    if (confirm("האם להסיר פריט זה ?")) {
      this.newPurchase.controls.stockitems.value.splice(i, 1);
      confirm("יש לשמור את ההזמנה על מנת לעדכן את מחיקת הפריט");
    }
  }

  openToEdit(i: number) {
    this.editItem = !this.editItem;
    this.itemIndex = i;
  }

  updateItems(stockItem) {
    this.itemIndex = -1;
    this.toastr.warning("שמור את ההזמנה על מנת לשמור את שינויים");
    this.editItem = false;
  }

  changeOrder(i, order, j) {
    this.newPurchase.value.stockitems[i].isStock = false;
    this.newPurchase.value.stockitems[i].customerOrders[j] = order;
  }

  deleteCusomerOrderNumber(i, j) {
    this.newPurchase.value.stockitems[i].customerOrders.pop();
  }

  addOrderToPurchase(i, orderNumber) {
    if (!this.newPurchase.value.stockitems)
      this.newPurchase.controls.stockitems.setValue([]);
    if (!this.newPurchase.value.stockitems[i].customerOrders)
      this.newPurchase.value.stockitems[i].customerOrders = [];
    this.newPurchase.value.stockitems[i].customerOrders.push(orderNumber.value);
  }

  resetStockItem() {
    this.itemForm.reset();
  }

  selectItem(i, checked) {
    if (checked) {
      this.selectedItems.push({
        ...this.newPurchase.controls.stockitems.value[i],
      });
      this.selectedItems[this.selectedItems.length - 1].quantity = 0;
    } else
      this.selectedItems.forEach((item, index) => {
        if (item.name == this.newPurchase.controls.stockitems.value[i].name) {
          this.selectedItems.splice(index, 1);
        }
      });
  }

  // Invoices and Certificates
  checkCertValidation() {
    let bool = false;
    if (
      this.deliveryCertificate.certificateNumber != null &&
      this.deliveryCertificate.certificateNumber != "" &&
      this.deliveryCertificate.certificateNumber != undefined
    ) {
      if (
        this.deliveryCertificate.deliveryArrivalDate != null &&
        this.deliveryCertificate.deliveryArrivalDate != undefined
      ) {
        if (this.selectedItems.length > 0) {
          let allAmountsFilled = true;
          for (let item of this.selectedItems) {
            if (item.quantity <= 0) allAmountsFilled = false;
          }
          for (let cert of this.newPurchase.controls.deliveryCerts.value) {
            if (
              cert.certificateNumber ==
              this.deliveryCertificate.certificateNumber
            ) {
              allAmountsFilled = false;
              this.toastr.error(
                `Certificate ${this.deliveryCertificate.certificateNumber} allready exist.`
              );
            }
          }
          bool = allAmountsFilled;
        }
      }
    }
    this.certValid = bool;
    // if(bool) this.toastr.success('תעודה תקינה. ניתן לשמור.')
    // else this.toastr.error('תעודה לא תקינה. אנא בדוק את כל השדות')
  }

  saveCertificate() {
    this.submittingCert = true;
    // set purchase stockitems arrived amounts
    for (let arrivedItem of this.deliveryCertificate.stockitems) {
      let item = this.newPurchase.controls.stockitems.value.find(
        (si) => si.name == arrivedItem.name
      );
      if (item.arrivedAmount) {
        item.arrivedAmount =
          Number(item.arrivedAmount) + Number(arrivedItem.quantity);
      } else item.arrivedAmount = Number(arrivedItem.quantity);
    }

    this.newPurchase.controls.deliveryCerts.value.push(
      this.deliveryCertificate
    );
    this.procurementService
      .updatePurchaseOrder(this.newPurchase.value as PurchaseData)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(
            `תעודה מספר ${this.deliveryCertificate.certificateNumber} התווספה בהצלחה להזמנה מספר ${this.purchaseData.orderNumber} `
          );
          this.newProcurementSaved.emit(res);
        } else this.toastr.error("משהו השתבש. אנא פנה לתמיכה");
        this.deliveryCertificate.userName =
          this.authService.loggedInUser.userName;
        this.submittingCert = false;
        this.selectedItems = [];
        this.checkItem.nativeElement.checked = false;
        this.modalService.dismissAll();
      });
  }

  deleteCert(i, cn) {
    if (confirm(`Erase certificate ${cn}.`)) {
      let cert = this.newPurchase.controls.deliveryCerts.value.find(
        (cert) => cert.certificateNumber == cn
      );

      for (let arrivedItem of cert.stockitems) {
        let item = this.newPurchase.controls.stockitems.value.find(
          (si) => si.name == arrivedItem.name
        );
        if (item.arrivedAmount) {
          item.arrivedAmount =
            Number(item.arrivedAmount) - Number(arrivedItem.quantity);
        }
      }

      this.newPurchase.controls.deliveryCerts.value.splice(i, 1);
      this.procurementService
        .updatePurchaseOrder(this.newPurchase.value as PurchaseData)
        .subscribe((res) => {
          if (res) {
            this.toastr.success(`Certificate no. ${cn} erased successfully.`);
          } else this.toastr.error("משהו השתבש. אנא פנה לתמיכה");
          this.deliveryCertificate.userName =
            this.authService.loggedInUser.userName;
          this.modalService.dismissAll();
        });
    }
  }

  // addItemToInvoice() {
  //   this.invoice.stockitems.push(this.invoiceStockitem)
  //   this.invoiceStockitem = {
  //     number: '',
  //     name: '',
  //     amount: 0,
  //     shippingPrice: null
  //   }
  // }

  checkItemAmount(i, itemNumber, amount, inputRef) {
    if (amount <= 0) {
      this.toastr.error("יש להזין כמות");
    }
    amount = amount.target.value;
    for (let item of this.newPurchase.controls.stockitems.value) {
      if (item.number == itemNumber) {
        if (amount > item.quantity) {
          this.toastr.warning("שים לב! הכמות שהזנת גדולה מהכמות בהזמנה");
        }
        this.selectedItems[i].quantity = amount;
      }
    }
  }

  saveInvoiceToPurchase() {
    this.newPurchase.controls.billNumber.value.push(this.invoice);
    this.procurementService
      .updatePurchaseOrder(this.newPurchase.value as PurchaseData)
      .subscribe((res) => {
        if (res) {
          this.newPurchase.patchValue({
            stockitems: res.stockitems,
          });
          this.toastr.success(
            `חשבונית מספר ${this.invoice.purchaseInvoiceNumber} התווספה בהצלחה להזמנה מספר ${this.purchaseData.orderNumber} `
          );
          this.invoice.purchaseInvoiceNumber = 0;
          this.invoice.invoiceRemarks = "";
          this.invoice.invoicePrice = 0;
          this.invoice.invoiceCoin = "";
          this.invoice.coinRate = 0;
          this.invoice.taxes = 0;
          this.invoice.taxesTwo = 0;
          this.invoice.stockitems = [];
        } else this.toastr.error("משהו השתבש. אנא פנה לתמיכה");
        this.invoice.purchaseInvoiceNumber = null;
        this.modalService.dismissAll();
      });
  }

  calculateShipping(orderPrice, shippingPrice, tax1, tax2, update) {
    // sum order value
    this.newPurchase.controls.finalPurchasePrice.setValue(orderPrice);
    this.newPurchase.controls.sumShippingCost.setValue(
      shippingPrice - tax1 - tax2
    );
    this.newPurchase.controls.shippingPercentage.setValue(
      Number(this.newPurchase.value.sumShippingCost) /
        Number(this.newPurchase.value.finalPurchasePrice)
    );

    // set shipping price for each item in purchase
    this.newPurchase.controls.stockitems.value.map((si) => {
      if (si.arrivedAmount)
        si.shippingPrice =
          Number(si.price) * this.newPurchase.controls.shippingPercentage.value;
    });

    if (update) this.sendNewProc("update");
  }

  sendNewProc(action) {
    let withRemarks = confirm("האם להוסיף הערות להזמנת הלקוח?");
    this.sendingPurchase = true;
    if (action == "add") {
      if (this.newPurchase.controls.stockitems.value) {
        this.newPurchase.controls.stockitems.value.map(
          (si) => (si.number = si.number.trim())
        );
        if (confirm("האם להקים הזמנה זו ?")) {
          // Ensure that send button won't be blocked
          setTimeout(() => {
            if (this.sendingPurchase) {
              this.sendingPurchase = false;
              this.disabled = false;
              this.toastr.error("Something went wrong. Try again.");
            }
          }, 1000 * 20);

          this.newPurchase.controls["user"].setValue(
            this.authService.loggedInUser.userName
          );
          this.newPurchase.controls.userEmail.setValue(
            this.authService.loggedInUser.userEmail
          );

          // set order arrival date as the latest item arrival date
          let latestArrivalItem = this.newPurchase.value.stockitems.reduce(
            (latestItem, item) => {
              return item.itemArrival > latestItem.itemArrival
                ? item
                : latestItem;
            },
            this.newPurchase.value.stockitems[0]
          );

          if (this.newPurchase.value.requestedDate) {
            this.newPurchase.value.stockitems.map((si) => {
              si.itemRequested = this.newPurchase.value.requestedDate;
              return si;
            });
          }

          let tempPurchase = this.newPurchase.value;
          if (latestArrivalItem.itemArrival) {
            tempPurchase.arrivalDate = latestArrivalItem.itemArrival;
          } else {
            tempPurchase.arrivalDate = null;
          }
          tempPurchase.withRemarks = withRemarks;
          tempPurchase.update = action == "add" ? false : true;
          tempPurchase.creationDate = tempPurchase.creationDate
            ? tempPurchase.creationDate.substring(0, 10)
            : new Date().toISOString().substring(0, 10);
          console.log(tempPurchase);
          this.procurementService
            .addNewProcurement(tempPurchase)
            .subscribe((data) => {
              this.sendingPurchase = false;
              if (data) {
                if (data.message)
                  this.toastr.warning(data.message + ". Order Saved");
                this.toastr.success(
                  "הזמנה מספר" + data.orderNumber + "נשמרה בהצלחה!"
                );
                this.newPurchase.reset();
                this.newProcurementSaved.emit(data);
                this.closeOrderModal.emit(false);
                // location.reload();
              } else this.toastr.error("משהו השתבש...");
            });
        }
      } else {
        this.toastr.error("אין אפשרות להקים הזמנה ללא פריטים");
      }
    }
    if (action == "update") {
      if (confirm("האם לעדכן הזמנה זו ?")) {
        this.newPurchase.controls.stockitems.value.map(
          (si) => (si.number = si.number.trim())
        );
        // Ensure that send button won't be blocked
        setTimeout(() => {
          if (this.sendingPurchase) {
            this.sendingPurchase = false;
            this.toastr.error("Something went wrong. Try again.");
          }
        }, 1000 * 10);

        // set order arrival date as the latest item arrival date
        let latestArrivalItem = this.newPurchase.value.stockitems.reduce(
          (latestItem, item) => {
            return item.itemArrival > latestItem.itemArrival
              ? item
              : latestItem;
          },
          this.newPurchase.value.stockitems[0]
        );

        if (latestArrivalItem.itemArrival != "")
          this.newPurchase.controls.arrivalDate.setValue(
            latestArrivalItem.itemArrival
          );
        if (
          !latestArrivalItem.itemArrival ||
          latestArrivalItem.itemArrival == ""
        ) {
          this.newPurchase.controls.arrivalDate.setValue(null);
        }
        let purchaseObject = this.newPurchase.value;
        purchaseObject.update = true;
        purchaseObject.withRemarks = withRemarks;
        purchaseObject.creationDate = purchaseObject.creationDate
          ? purchaseObject.creationDate.substring(0, 10)
          : null;
        this.procurementService
          .addNewProcurement(purchaseObject)
          .subscribe((data) => {
            this.sendingPurchase = false;
            if (data) {
              this.toastr.success("הזמנה עודכנה בהצלחה !");
              this.closeOrderModal.emit(false);
              this.newProcurementSaved.emit(data);
              // location.reload()
            } else this.toastr.error("משהו השתבש...");
          });
      }
    }
  }

  setPurchaseStatus(ev) {
    if (confirm("האם לשנות סטטוס הזמנה ?")) {
      // calculate final shipping price
      if (ev.target.value == "closed") {
        try {
          this.calculateShipping(
            this.newPurchase.controls.finalPurchasePrice.value,
            this.newPurchase.controls.sumShippingCost.value,
            0,
            0,
            false
          );
          this.setFinalStatus(ev);
          // location.reload()
        } catch {
          this.toastr.error("יש להזין נתוני העמסה");
        }
      } else if (ev.target.value == "ETA" || ev.target.value == "ETD") {
        this.newPurchase.controls.status.setValue(ev.target.value);
        this.open(this.setEstimatedDate, ev.target.value);
      } else this.setFinalStatus(ev);
    }
  }

  setFinalStatus(ev) {
    this.newPurchase.controls.status.setValue(ev.target.value);
    this.procurementService
      .setPurchaseStatus(this.newPurchase.value)
      .subscribe((data) => {
        if (data) {
          this.purchaseData = data;
          this.newProcurementSaved.emit(data);
          this.toastr.success("סטטוס עודכן בהצלחה !");
        } else this.toastr.error("משהו השתבש...");
      });
  }

  setStatusDate() {
    this.newPurchase.controls.statusChange.setValue(this.statusDate);
    this.procurementService
      .setPurchaseStatus(this.newPurchase.value)
      .subscribe((data) => {
        if (data) {
          this.purchaseData = data;
          this.newProcurementSaved.emit(data);
          this.modalService.dismissAll();
          this.toastr.success("סטטוס עודכן בהצלחה !");
        } else this.toastr.error("משהו השתבש...");
      });
  }

  open(modal, param?) {
    if (param) this.statusTypeToSet = param;
    if (
      modal._def.references.recieveDeliveryCertificate &&
      this.selectedItems.length == 0
    ) {
      this.toastr.error("Must choose at least one item.");
    } else {
      this.certValid = false;
      this.deliveryCertificate = {
        certificateNumber: "",
        deliveryArrivalDate: null,
        stockitems: this.selectedItems,
        remarks: "",
        userName: this.authService.loggedInUser.userName,
      };
      this.invoice = {
        purchaseInvoiceNumber: 0,
        invoiceRemarks: "",
        coinRate: 0,
        invoiceCoin: "",
        invoicePrice: 0,
        taxes: 0,
        taxesTwo: 0,
        fixedPrice: 0,
        stockitems: this.selectedItems,
        shippingPrice: 0,
      };
      this.modalService.open(modal, {
        size: "lg",
        ariaLabelledBy: "modal-basic-title",
      });
    }
  }

  routeToItemIndex(item) {
    const url = this.router.navigate(["/peerpharm/itemindex"], {
      queryParams: {
        itemNumber: item,
      },
    });
  }
}
