import { Component, OnInit, ViewChild, ElementRef, HostListener, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseData } from '../procumentOrders/PurchaseData';
import { DeliveryCertificate } from '../procumentOrders/DeliveryCert';
import { InvoiceData } from './InvoiceData';
import { StockItem } from './StockItem';
import { Currencies } from '../Currencies';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-new-procurement',
  templateUrl: './new-procurement.component.html',
  styleUrls: ['./new-procurement.component.scss']
})
export class NewProcurementComponent implements OnInit, OnChanges {

  @Input() purchaseData: any;
  @Input() requestToPurchase: any;
  @Input() isEdit: boolean;
  @Input() currencies: Currencies;
  @Output() newProcurementSaved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeOrderModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('itemNumber') itemNumber: ElementRef;
  @ViewChild('itemName') itemName: ElementRef;
  @ViewChild('coin') coin: ElementRef;
  @ViewChild('measurement') measurement: ElementRef;
  @ViewChild('supplierPrice') supplierPrice: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;
  @ViewChild('updateItemAmount') updateItemAmount: ElementRef;
  @ViewChild('updateItemPrice') updateItemPrice: ElementRef;

  @ViewChild('editQuantity') editQuantity: ElementRef;
  @ViewChild('editPrice') editPrice: ElementRef;
  @ViewChild('editArrival') editArrival: ElementRef;
  @ViewChild('sumShipping') sumShipping: ElementRef;
  @ViewChild('cb') checkItem: ElementRef;

  openOrdersModal: boolean = false;
  shippingInvoiceDetails: boolean = false;
  disabled: boolean = true;
  supplierToUpdate: any;
  stockItems: any[] = [];
  user: any;
  EditRowId: string = ''
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

  newPurchase: FormGroup;
  // deliveryCertificateForm: FormGroup;
  itemForm: FormGroup;
  userName: string;
  editArrivalDateForPurchase: boolean = false;

  // Items to select for invoice / deliveryCert
  selectedItems: StockItem[] = []

  deliveryCertificate: DeliveryCertificate = {
    certificateNumber: '',
    deliveryArrivalDate: null,
    stockitems: this.selectedItems,
    remarks: '',
    userName: this.authService.loggedInUser.userName
  }
  certValid: boolean = false

  //invoice data
  invoice: InvoiceData = {
    purchaseInvoiceNumber: 0,
    invoiceRemarks: '',
    coinRate: 0,
    invoiceCoin: '',
    invoicePrice: 0,
    taxes: 0,
    taxesTwo: 0,
    fixedPrice: 0,
    stockitems: this.selectedItems,
    shippingPrice: 0
  }

  //toggle purchase details
  showPurchaseDetails: boolean = false;
  showItemDetails: boolean = false;
  itemIndex: number;
  submittingCert: boolean;
  sendingPurchase: boolean;
  lastSupplier: string;
  wow: boolean = false;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
  }

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
     ) {
    this.newPurchase = fb.group({
      _id: [''],
      supplierName: ["", Validators.required],
      supplierNumber: ["", Validators.required],
      supplierCountry: [""],
      supplierEmail: [''],
      creationDate: [this.formatDate(new Date()), Validators.required],
      arrivalDate: [{ value: this.formatDate(new Date()), disabled: this.disabled && this.isEdit }, Validators.required],
      stockitems: [[], Validators.required],
      orderNumber: [''],
      userEmail: [''],
      user: [''],
      billNumber: [[]],
      orderType: ['', Validators.required],
      remarks: [''],
      status: ['open'],
      deliveryCerts: [[]],
      outOfCountry: [false],
      recommendId: [''],
      sumShippingCost: [0],
      closeReason: [''],
      shippingPercentage: [0],
      finalPurchasePrice: [0]
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
      number: ['', Validators.required],
      name: ['', Validators.required],
      coin: ['', Validators.required],
      measurement: ['kg', Validators.required],
      price: [0, Validators.required],
      quantity: ['', Validators.required],
      color: [''],
      remarks: [''],
      itemPrice: [''],
      itemArrival: [''],
      supplierItemNum: [''],
      historyAmounts: [['']],
      componentType:[''],
      isStock: [true],
      customerOrders: [[]]
    })
  }

  ngOnInit() {
    this.getUserInfo()
    if(this.purchaseData) this.itemForm.controls.itemArrival.setValue(this.purchaseData.arrivalDate)
    if (this.requestToPurchase) {
      this.newPurchase.patchValue({
        _id: '',
        supplierName: this.requestToPurchase.supplierName,
        supplierNumber: this.requestToPurchase.supplierNumber,
        creationDate: this.formatDate(new Date()),
        arrivalDate: new Date(),
        stockitems: this.requestToPurchase.stockitems,
        orderNumber: '',
        userEmail: '',
        user: this.requestToPurchase.user,
        billNumber: [],
        orderType: this.requestToPurchase.type,
        remarks: this.requestToPurchase.remarks,
        status: 'open',
        deliveryCerts: [],
        outOfCountry: false,
        recommendId: this.requestToPurchase._id

      })
    }
    if (this.purchaseData) {
      this.purchaseData.recommendId = '';
      this.stockItems = this.purchaseData.stockitems
    }
    else console.log('')
    if (this.isEdit) {
      if (!this.purchaseData.closeReason) this.purchaseData.closeReason = ''
      if (!this.purchaseData.userEmail) this.purchaseData.userEmail = ''
      if (!this.purchaseData.user) this.purchaseData.user = ''
      if (!this.purchaseData.supplierCountry) this.purchaseData.supplierCountry = ''
      if (!this.purchaseData.shippingPercentage) this.purchaseData.shippingPercentage = 0
      if (!this.purchaseData.finalPurchasePrice) this.purchaseData.finalPurchasePrice = 0
      this.newPurchase.setValue(this.purchaseData as PurchaseData);
      this.newPurchase.controls.orderType.setValue(this.purchaseData.orderType);
    }
    else this.purchaseData = undefined
    this.getAllSuppliers();
    this.getAllMaterials();
    if (this.authService.loggedInUser) {
      this.newPurchase.controls.userEmail.setValue(this.authService.loggedInUser.userEmail);
      this.user = this.authService.loggedInUser.userName
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isEdit.currentValue) {
      if (changes.purchaseData) {
        if (!changes.purchaseData.currentValue.recommendId) changes.purchaseData.currentValue.recommendId = ''
        if (!changes.purchaseData.currentValue.sumShippingCost) changes.purchaseData.currentValue.sumShippingCost = 0
      }
      if (this.isEdit) {
        if (changes.purchaseData.currentValue.remarks == null) changes.purchaseData.currentValue.remarks = ''
        if (!changes.purchaseData.currentValue.closeReason) changes.purchaseData.currentValue.closeReason = ''
        if (!changes.purchaseData.currentValue.userEmail) changes.purchaseData.currentValue.userEmail = ''
        if (!changes.purchaseData.currentValue.supplierCountry) changes.purchaseData.currentValue.supplierCountry = ''
        if (!changes.purchaseData.currentValue.user) changes.purchaseData.currentValue.user = ''
        if (!changes.purchaseData.currentValue.shippingPercentage) changes.purchaseData.currentValue.shippingPercentage = 0
        if (!changes.purchaseData.currentValue.finalPurchasePrice) changes.purchaseData.currentValue.finalPurchasePrice = 0
        this.newPurchase.setValue(changes.purchaseData.currentValue)
      }
    }

  }

  getUserInfo(){
    this.userName = this.authService.loggedInUser.userName
    if(this.authService.loggedInUser.authorization.includes("newPurchase")) {
      this.newPurchaseAllowed = true;
    }
    if(this.authService.loggedInUser.authorization.includes("editPurchase")) {
      this.editPurchaseAllowed = true
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }

  updateItemInPL() {
    this.supplierService.updateSupplierPrice(this.supplierToUpdate).subscribe(data => {
      if (data) {
        this.toastr.success('מחיר עודכן בהצלחה !')
      }
    })
  }




  //Materials
  fillMaterialNumber(ev) {
    var materialName = ev.target.value;
    var material = this.allMaterials.find(material => material.componentName == materialName)
    this.itemForm.controls.number.setValue(material.componentN);
    this.findStockItemByNumber();
  }


  getAllMaterials() {
    this.inventoryService.getAllMaterialsForFormules().subscribe(data => {
      this.allMaterials = data;
    })
  }


  // Suppliers
  getAllSuppliers() {
    this.supplierService.getSuppliersDiffCollection().subscribe(data => {
      this.allSuppliers = data;
    })
  }

  fillSupplierDetails(ev) {
    let supplier = ev.target.value;
    let result = this.allSuppliers.filter(x => supplier == x.suplierName)
    this.currSupplier = result[0]
    this.newPurchase.controls.supplierNumber.setValue(this.currSupplier.suplierNumber)
    if (this.currSupplier.email) {
      this.newPurchase.controls.supplierEmail.setValue(this.currSupplier.email)
    }
    if (this.currSupplier.country) {
      this.newPurchase.controls.supplierCountry.setValue(this.currSupplier.country)
    }
  }

  updateSupplierEmail(ev) {
    let email = ev.target.value;
    if (confirm('האם לעדכן מייל אצל הספק ?')) {
      this.currSupplier.email = email
      if (email != '') {
        this.supplierService.updateCurrSupplier(this.currSupplier).subscribe(data => {
          if (data) {
            this.toastr.success('מייל עודכן בהצלחה !')
          }
        })
      }
    }
  }


  //Stock Items
  findStockItemByNumber() {
    this.getLastOrdersForItem(this.itemForm.get('number').value)

    if (this.itemForm.get('number').value != '') {
      //this.purchaseData.orderType
      if (this.newPurchase && this.purchaseData) {
        this.newPurchase.controls.orderType.setValue(this.purchaseData.orderType);
      }
      if (this.newPurchase.controls.orderType.value == 'material') {
        this.inventoryService.getMaterialStockItemByNum(this.itemForm.get('number').value).subscribe(data => {
          if (data[0]) {
            this.itemForm.controls.name.setValue(data[0].componentName);
            this.itemForm.controls.coin.setValue(data[0].coin ? data[0].coin.toUpperCase() : 'NIS')
            this.itemForm.controls.measurement.setValue(data[0].unitOfMeasure ? data[0].unitOfMeasure : data[0].measurement)
            this.itemForm.controls.supplierItemNum.setValue(data[0].componentNs)

            //set price
            this.itemForm.controls.price.setValue(data[0].price)
            if (!data[0].price || data[0].price == '') {
              // search in suppliers
              var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
              if (!supplier) this.toastr.info('הספק אינו ברשימת הספקים של הפריט')
              else {
                this.itemForm.controls.price.setValue(parseFloat(supplier.price))
                this.itemForm.controls.coin.setValue(supplier.coin.toUpperCase())
              }
            }

          } else {
            this.toastr.error("" + this.newPurchase.controls.orderType.value + 'פריט לא קיים במערכת כ')
          }

        })
      } else if (this.newPurchase.controls.orderType.value == 'component') {
        this.inventoryService.getCmptByitemNumber(this.itemForm.get('number').value).subscribe(data => {
          if (data[0]) {
            this.itemForm.controls.name.setValue(data[0].componentName)
            this.itemForm.controls.coin.setValue(data[0].coin ? data[0].coin.toUpperCase() : 'NIS')
            this.itemForm.controls.measurement.setValue(data[0].unitOfMeasure ? data[0].unitOfMeasure : data[0].measurement)
            this.itemForm.controls.supplierItemNum.setValue(data[0].componentNs)
            this.itemForm.controls.componentType.setValue(data[0].componentType)

            //set price
            this.itemForm.controls.price.setValue(data[0].price)
            if (!data[0].price || data[0].price == '') {
              // search in suppliers
              var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
              if (!supplier) this.toastr.info('הספק אינו ברשימת הספקים של הפריט')
              else {
                this.itemForm.controls.price.setValue(parseFloat(supplier.price))
                this.itemForm.controls.coin.setValue(supplier.coin.toUpperCase())
              }
            }

          } else {
            this.toastr.error("" + this.newPurchase.controls.orderType.value + 'פריט לא קיים במערכת כ')
          }
        })
      }
      else if (this.newPurchase.controls.orderType.value == '' || this.newPurchase.controls.orderType.value == null || this.newPurchase.controls.orderType.value == undefined) {
        this.toastr.warning('Must Choose Component Type')
      }
    }
    else this.toastr.warning('יש לרשום מספר פריט.')
  }

  getLastOrdersForItem(componentN) {
    this.itemForm.controls.historyAmounts.setValue([])
    this.lastSupplier = ''
    this.procurementService.getLastOrdersForItem(componentN, 100).subscribe(orders => {
      if (orders && orders.length > 0) {
        let currentYear = 0
        let lastYear = 0
        for (let order of orders) {
          if (this.lastSupplier == '') this.lastSupplier = order.supplierName 
          if (order.orderDate.slice(0, 4) == '2021') currentYear += Number(order.quantity)
          else if (order.orderDate.slice(0, 4) == '2020') lastYear += Number(order.quantity)
        }
        this.itemForm.controls.historyAmounts.setValue([
          { year: 2021, amount: currentYear },
          { year: 2020, amount: lastYear },
        ])
      }
      else this.itemForm.controls.historyAmounts.setValue([])
    })
  }

  addItemToPurchase() {
    this.stockItems.push(this.itemForm.value)
    this.newPurchase.controls.stockitems.setValue(this.stockItems)
    this.resetStockItem();
    this.toastr.success('Item Added Successfully')
  }

  addCusomerOrderNumberToItem(e, i) {
    debugger
    this.itemForm.controls.customerOrders.value.push(e.value)
    e.value = ''
  }

  editStockItem(number) {
    if (number != '') {
      this.EditRowId = number
    } else {
      this.EditRowId = ''
    }
  }

  saveStockItem(index) {
    let stockitem = this.newPurchase.controls.stockitems.value[index];
    stockitem.price = this.editPrice.nativeElement.value;
    stockitem.itemArrival = this.editArrival.nativeElement.value;
    stockitem.quantity = this.editQuantity.nativeElement.value;
    this.toastr.success('פריט עודכן בהצלחה')
    this.editStockItem('')
  }


  removeStockitemFromPurchase(i) {
    if (confirm('האם להסיר פריט זה ?')) {
      this.newPurchase.controls.stockitems.value.splice(i, 1)
      confirm('יש לשמור את ההזמנה על מנת לעדכן את מחיקת הפריט')
    }
  }

  openToEdit(i: number) {
    this.editItem = !this.editItem
    this.itemIndex = i;
  }

  updateItems(stockItem) {
    console.log(this.newPurchase.value)
    this.itemIndex = -1
    this.toastr.warning("שמור את ההזמנה על מנת לשמור את שינויים")
    this.editItem = false;
  }

  changeOrder(i, order, j) {
    this.newPurchase.value.stockitems[i].customerOrders[j] = order
  }

  deleteCusomerOrderNumber(i,j){
    this.newPurchase.value.stockitems[i].customerOrders.splice(j,1)
  }

  addOrderToPurchase(i, e) {
    this.newPurchase.value.stockitems[i].customerOrders.push(e.target.value)
  }


  resetStockItem() {
    this.itemForm.reset()
  }

  selectItem(i, checked) {
    if (checked) {
      this.selectedItems.push({ ...this.newPurchase.controls.stockitems.value[i] })
      this.selectedItems[this.selectedItems.length - 1].quantity = 0
    }
    else this.selectedItems.forEach((item, index) => {
      if (item.name == this.newPurchase.controls.stockitems.value[i].name) {
        this.selectedItems.splice(index, 1)
      }
    })
  }

  // Invoices and Certificates
  checkCertValidation() {
    let bool = false;
    if (this.deliveryCertificate.certificateNumber != null && this.deliveryCertificate.certificateNumber != '' && this.deliveryCertificate.certificateNumber != undefined) {
      if (this.deliveryCertificate.deliveryArrivalDate != null && this.deliveryCertificate.deliveryArrivalDate != undefined) {
        if (this.selectedItems.length > 0) {
          let allAmountsFilled = true;
          for (let item of this.selectedItems) {
            if (item.quantity <= 0) allAmountsFilled = false
          }
          for (let cert of this.newPurchase.controls.deliveryCerts.value) {
            if (cert.certificateNumber == this.deliveryCertificate.certificateNumber) {
              allAmountsFilled = false
              this.toastr.error(`Certificate ${this.deliveryCertificate.certificateNumber} allready exist.`)
            }
          }
          bool = allAmountsFilled
        }
      }
    }
    this.certValid = bool;
    // if(bool) this.toastr.success('תעודה תקינה. ניתן לשמור.')
    // else this.toastr.error('תעודה לא תקינה. אנא בדוק את כל השדות')
  }

  saveCertificate() {
    this.submittingCert = true
    // set purchase stockitems arrived amounts
    for (let arrivedItem of this.deliveryCertificate.stockitems) {
      let item = this.newPurchase.controls.stockitems.value.find(si => si.name == arrivedItem.name)
      if (item.arrivedAmount) {
        item.arrivedAmount = Number(item.arrivedAmount) + Number(arrivedItem.quantity)
      }
      else item.arrivedAmount = Number(arrivedItem.quantity)
    }

    this.newPurchase.controls.deliveryCerts.value.push(this.deliveryCertificate);
    this.procurementService.updatePurchaseOrder(this.newPurchase.value as PurchaseData)
      .subscribe(res => {
        if (res) {
          this.toastr.success(`תעודה מספר ${this.deliveryCertificate.certificateNumber} התווספה בהצלחה להזמנה מספר ${this.purchaseData.orderNumber} `)
        }
        else this.toastr.error('משהו השתבש. אנא פנה לתמיכה')
        this.deliveryCertificate.userName = this.authService.loggedInUser.userName
        this.submittingCert = false
        this.selectedItems = []
        this.checkItem.nativeElement.checked = false
        this.modalService.dismissAll()
      })
  }

  deleteCert(i, cn) {
    if (confirm(`Erase certificate ${cn}.`)) {
      let cert = this.newPurchase.controls.deliveryCerts.value.find(cert => cert.certificateNumber == cn)

      for (let arrivedItem of cert.stockitems) {
        let item = this.newPurchase.controls.stockitems.value.find(si => si.name == arrivedItem.name)
        if (item.arrivedAmount) {
          item.arrivedAmount = Number(item.arrivedAmount) - Number(arrivedItem.quantity)
        }
      }

      this.newPurchase.controls.deliveryCerts.value.splice(i, 1)
      this.procurementService.updatePurchaseOrder(this.newPurchase.value as PurchaseData)
        .subscribe(res => {
          if (res) {
            this.toastr.success(`Certificate no. ${cn} erased successfully.`)
          }
          else this.toastr.error('משהו השתבש. אנא פנה לתמיכה')
          this.deliveryCertificate.userName = this.authService.loggedInUser.userName
          this.modalService.dismissAll()
        })
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
      this.toastr.error('יש להזין כמות')
    }
    amount = amount.target.value
    for (let item of this.newPurchase.controls.stockitems.value) {
      if (item.number == itemNumber) {
        if (amount > item.quantity) {
          this.toastr.warning('שים לב! הכמות שהזנת גדולה מהכמות בהזמנה')
        }
        this.selectedItems[i].quantity = amount
      }
    }
  }


  saveInvoiceToPurchase() {
    this.newPurchase.controls.billNumber.value.push(this.invoice);
    this.procurementService.updatePurchaseOrder(this.newPurchase.value as PurchaseData)
      .subscribe(res => {
        if (res) {
          this.newPurchase.patchValue({
            stockitems: res.stockitems
          })
          this.toastr.success(`חשבונית מספר ${this.invoice.purchaseInvoiceNumber} התווספה בהצלחה להזמנה מספר ${this.purchaseData.orderNumber} `)
          this.invoice.purchaseInvoiceNumber = 0
          this.invoice.invoiceRemarks = ''
          this.invoice.invoicePrice = 0
          this.invoice.invoiceCoin = ''
          this.invoice.coinRate = 0
          this.invoice.taxes = 0
          this.invoice.taxesTwo = 0
          this.invoice.stockitems = []
        }
        else this.toastr.error('משהו השתבש. אנא פנה לתמיכה')
        this.invoice.purchaseInvoiceNumber = null
        this.modalService.dismissAll()
      })
  }

  calculateShipping(orderPrice, shippingPrice, tax1, tax2, update) {

    // sum order value
    this.newPurchase.controls.finalPurchasePrice.setValue(orderPrice)
    this.newPurchase.controls.sumShippingCost.setValue(shippingPrice - tax1 - tax2)
    this.newPurchase.controls.shippingPercentage.setValue(Number(this.newPurchase.value.sumShippingCost) / Number(this.newPurchase.value.finalPurchasePrice))

    // set shipping price for each item in purchase
    this.newPurchase.controls.stockitems.value.map(si => {
      if (si.arrivedAmount) si.shippingPrice = Number(si.price) * this.newPurchase.controls.shippingPercentage.value
    })

    if (update) this.sendNewProc('update')

  }


  sendNewProc(action) {
    this.sendingPurchase = true;
    if (action == 'add') {
      if (this.newPurchase.controls.stockitems.value) {
        if (confirm("האם להקים הזמנה זו ?")) {
          this.newPurchase.controls['user'].setValue(this.authService.loggedInUser.userName)
          this.newPurchase.controls.userEmail.setValue(this.authService.loggedInUser.userEmail);

          // set order arrival date as the latest item arrival date
          let latestArrivalItem = this.newPurchase.value.stockitems.reduce((latestItem, item)=> {
            return item.itemArrival > latestItem.itemArrival ? item : latestItem
          }, this.newPurchase.value.stockitems[0])
          this.newPurchase.controls.arrivalDate.setValue(latestArrivalItem.itemArrival)

          this.procurementService.addNewProcurement(this.newPurchase.value).subscribe(data => {
            this.sendingPurchase = false;
            if (data) {
              if(data.message) this.toastr.warning(data.message+". Order Saved")
              this.toastr.success("הזמנה מספר" + data.orderNumber + "נשמרה בהצלחה!")
              this.newPurchase.reset();
              this.newProcurementSaved.emit(true)
              this.closeOrderModal.emit(false)
              // location.reload();

            }
            else this.toastr.error('משהו השתבש...')
          })
        }
      } else {
        this.toastr.error('אין אפשרות להקים הזמנה ללא פריטים')
      }
    }
    if (action == 'update') {
      if (confirm('האם לעדכן הזמנה זו ?')) {
        
        // set order arrival date as the latest item arrival date
        let latestArrivalItem = this.newPurchase.value.stockitems.reduce((latestItem, item)=> {
          return item.itemArrival > latestItem.itemArrival ? item : latestItem
        }, this.newPurchase.value.stockitems[0])
        this.newPurchase.controls.arrivalDate.setValue(latestArrivalItem.itemArrival)
        
        this.procurementService.updatePurchaseOrder(this.newPurchase.value).subscribe(data => {
          this.sendingPurchase = false;
          if (data) {
            this.toastr.success('הזמנה עודכנה בהצלחה !')
            this.closeOrderModal.emit(false)
            this.newProcurementSaved.emit(true)
            location.reload()
          }
          else this.toastr.error('משהו השתבש...')
        })
      }
    }
  }

  setPurchaseStatus(ev) {
    if (confirm('האם לשנות סטטוס הזמנה ?')) {
      // calculate final shipping price
      if (ev.target.value == 'closed') {
        try {
          this.calculateShipping(this.newPurchase.controls.finalPurchasePrice.value, this.newPurchase.controls.sumShippingCost.value, 0, 0, false)
          this.setFinalStatus(ev)
        } catch {
          this.toastr.error('יש להזין נתוני העמסה')
        }
      }
      else this.setFinalStatus(ev)
    }
  }

  setFinalStatus(ev) {
    this.newPurchase.controls.status.setValue(ev.target.value);
    this.procurementService.setPurchaseStatus(this.newPurchase.value).subscribe(data => {
      if (data) {
        this.toastr.success('סטטוס עודכן בהצלחה !')
        location.reload()
      }
      else this.toastr.error('משהו השתבש...')
    })
  }

  open(modal) {
    if (modal._def.references.recieveDeliveryCertificate && this.selectedItems.length == 0) {
      this.toastr.error('Must choose at least one item.')
    }
    else {

      this.certValid = false;
      this.deliveryCertificate = {
        certificateNumber: '',
        deliveryArrivalDate: null,
        stockitems: this.selectedItems,
        remarks: '',
        userName: this.authService.loggedInUser.userName
      }
      this.invoice = {
        purchaseInvoiceNumber: 0,
        invoiceRemarks: '',
        coinRate: 0,
        invoiceCoin: '',
        invoicePrice: 0,
        taxes: 0,
        taxesTwo: 0,
        fixedPrice: 0,
        stockitems: this.selectedItems,
        shippingPrice: 0
      }
      this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
    }
  }



}










