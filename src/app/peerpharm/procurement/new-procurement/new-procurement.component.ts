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
  @ViewChild('supplierAmount') supplierAmount: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;
  @ViewChild('updateItemAmount') updateItemAmount: ElementRef;
  @ViewChild('updateItemPrice') updateItemPrice: ElementRef;

  @ViewChild('editQuantity') editQuantity: ElementRef;
  @ViewChild('editPrice') editPrice: ElementRef;
  @ViewChild('sumShipping') sumShipping: ElementRef;

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

  newPurchase: FormGroup;
  // deliveryCertificateForm: FormGroup;
  itemForm: FormGroup;

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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
  }

  constructor(private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private toastr: ToastrService, private procurementService: Procurementservice, private authService: AuthService, private inventoryService: InventoryService, private supplierService: SuppliersService, public formBuilder: FormBuilder,) {
    this.newPurchase = fb.group({
      _id: [''],
      supplierName: ["", Validators.required],
      supplierNumber: ["", Validators.required],
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
      price: [0],
      quantity: ['', Validators.required],
      color: [''],
      itemRemarks: [''],
      itemPrice: [''],
      supplierItemNum: [''],
      supplierAmount: [0]
    })
  }

  ngOnInit() {
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
      if(!this.purchaseData.closeReason) this.purchaseData.closeReason = ''
      if(!this.purchaseData.userEmail) this.purchaseData.userEmail = ''
      if(!this.purchaseData.user) this.purchaseData.user = ''
      if(!this.purchaseData.shippingPercentage) this.purchaseData.shippingPercentage = 0
      if(!this.purchaseData.finalPurchasePrice) this.purchaseData.finalPurchasePrice = 0
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
        if(!changes.purchaseData.currentValue.closeReason) changes.purchaseData.currentValue.closeReason = ''
        if(!changes.purchaseData.currentValue.userEmail) changes.purchaseData.currentValue.userEmail = ''
        if(!changes.purchaseData.currentValue.user) changes.purchaseData.currentValue.user = ''
        if(!changes.purchaseData.currentValue.shippingPercentage) changes.purchaseData.currentValue.shippingPercentage = 0
        if(!changes.purchaseData.currentValue.finalPurchasePrice) changes.purchaseData.currentValue.finalPurchasePrice = 0
        this.newPurchase.setValue(changes.purchaseData.currentValue)
      }
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
    if (this.itemForm.get('number').value != '') {
      //this.purchaseData.orderType
      if (this.newPurchase && this.purchaseData) {
        this.newPurchase.controls.orderType.setValue(this.purchaseData.orderType);
      }
      if (this.newPurchase.controls.orderType.value == 'material') {
        this.inventoryService.getMaterialStockItemByNum(this.itemForm.get('number').value).subscribe(data => {
          if (data[0]) {
            this.itemForm.controls.name.setValue(data[0].componentName);
            this.itemForm.controls.coin.setValue(data[0].coin.toUpperCase())
            this.itemForm.controls.measurement.setValue(data[0].unitOfMeasure)
            this.itemForm.controls.supplierItemNum.setValue(data[0].componentNs)
            this.itemForm.controls.coin.setValue(data[0].coin)

            //set price
            var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
            if (!supplier) {
              this.toastr.info('הספק אינו ברשימת הספקים של הפריט')
              for (let aSupplier of data[0].alternativeSuppliers) {
                if(aSupplier.price) this.itemForm.controls.price.setValue(parseFloat(aSupplier.price))
                if(aSupplier.coin) this.itemForm.controls.coin.setValue(parseFloat(aSupplier.coin))
                break;
              }
            } 
            else this.itemForm.controls.price.setValue(parseFloat(supplier.price))
            if(!this.itemForm.controls.price.value) {
              this.itemForm.controls.price.setValue(parseFloat(data[0].price))
              this.itemForm.controls.coin.setValue('NIS')
            }

          } else {
            this.toastr.error(""+this.newPurchase.controls.orderType.value+'פריט לא קיים במערכת כ')
          }

        })
      } else if (this.newPurchase.controls.orderType.value == 'component') {
        this.inventoryService.getCmptByitemNumber(this.itemForm.get('number').value).subscribe(data => {
          if (data[0]) {
            this.itemForm.controls.name.setValue(data[0].componentName)
            this.itemForm.controls.measurement.setValue(data[0].unitOfMeasure)
            this.itemForm.controls.supplierItemNum.setValue(data[0].componentNs)

               //set price
            var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
            if (!supplier) {
              this.toastr.info('הספק אינו ברשימת הספקים של הפריט')
              for (let aSupplier of data[0].alternativeSuppliers) {
                if(aSupplier.price) this.itemForm.controls.price.setValue(parseFloat(aSupplier.price))
                if(aSupplier.coin) this.itemForm.controls.coin.setValue(parseFloat(aSupplier.coin))
                break;
              }
            } 
            else this.itemForm.controls.price.setValue(parseFloat(supplier.price))
            if(!this.itemForm.controls.price.value) {
              this.itemForm.controls.price.setValue(parseFloat(data[0].price))
              this.itemForm.controls.coin.setValue('NIS')
            }

          } else {
            this.toastr.error(""+this.newPurchase.controls.orderType.value+'פריט לא קיים במערכת כ')
          }
        })
      }
      else if (this.newPurchase.controls.orderType.value == '' || this.newPurchase.controls.orderType.value == null || this.newPurchase.controls.orderType.value == undefined) {
        this.toastr.warning('Must Choose Component Type')
      }
    }
    else this.toastr.warning('יש לרשום מספר פריט.')
  }

  addItemToPurchase() {
    this.stockItems.push(this.itemForm.value)
    this.newPurchase.controls.stockitems.setValue(this.stockItems)
    this.resetStockItem();
    this.toastr.success('Item Added Successfully')
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
    this.itemIndex = -1
    this.toastr.warning("שמור את ההזמנה על מנת לשמור את שינויים")
    this.editItem = false;
  }


  resetStockItem() {
    this.itemForm.reset()
  }

  selectItem(i, checked) {
    if (checked) {
      this.selectedItems.push({...this.newPurchase.controls.stockitems.value[i]})
      this.selectedItems[this.selectedItems.length - 1].quantity = 0
    } 
    else this.selectedItems.forEach( (item, index) => { 
      if (item.name == this.newPurchase.controls.stockitems.value[i].name) {
        this.selectedItems.splice(index, 1)
      }})
  }

  // Invoices and Certificates
  checkCertValidation() {
    let bool = false;
    if(this.deliveryCertificate.certificateNumber != null && this.deliveryCertificate.certificateNumber != '' && this.deliveryCertificate.certificateNumber != undefined) {
      if(this.deliveryCertificate.deliveryArrivalDate != null && this.deliveryCertificate.deliveryArrivalDate != undefined) {
        if(this.selectedItems.length > 0) {
          let allAmountsFilled = true;
          for (let item of this.selectedItems) {
            if (item.quantity <= 0) allAmountsFilled = false
          }
          for(let cert of this.newPurchase.controls.deliveryCerts.value) {
            if(cert.certificateNumber == this.deliveryCertificate.certificateNumber) {
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
    // set purchase stockitems arrived amounts
    for (let arrivedItem of this.deliveryCertificate.stockitems) {
      let item = this.newPurchase.controls.stockitems.value.find(si => si.name == arrivedItem.name)
      if(item.arrivedAmount) {
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
        this.modalService.dismissAll()
      })
  }

  deleteCert(i, cn) {
    if(confirm(`Erase certificate ${cn}.`)) {

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
    if(amount <= 0) {
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
    this.newPurchase.controls.shippingPercentage.setValue( Number(this.newPurchase.value.sumShippingCost) / Number(this.newPurchase.value.finalPurchasePrice))

    // set shipping price for each item in purchase
    this.newPurchase.controls.stockitems.value.map(si => {
      if(si.arrivedAmount) si.shippingPrice = Number(si.price) * this.newPurchase.controls.shippingPercentage.value 
    })

    if(update) this.sendNewProc('update')

  }


  sendNewProc(action) {
    if (action == 'add') {
      if (this.newPurchase.controls.stockitems.value) {
        if (confirm("האם להקים הזמנה זו ?")) {
          this.newPurchase.controls['user'].setValue(this.authService.loggedInUser.userName)
          this.newPurchase.controls.userEmail.setValue(this.authService.loggedInUser.userEmail);
          this.procurementService.addNewProcurement(this.newPurchase.value).subscribe(data => {
            if (data) {
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
        this.procurementService.updatePurchaseOrder(this.newPurchase.value).subscribe(data => {
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
      if(ev.target.value == 'closed') {
        try{
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
    debugger
    if(modal._def.references.recieveDeliveryCertificate && this.selectedItems.length == 0) {
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












  // fillPurchaseDetails(recommendation) {
  //   this.itemForm.value.controls.number = recommendation.componentNumber;
  //   this.newPurchase.controls.orderType.setValue(recommendation.type);
  //   this.itemForm.value.controls.quantity = recommendation.amount
  //   this.newProcurement.recommendId = recommendation._id
  //   this.findStockItemByNumber();
  // }

      // this.procurementService.getPurchaseOrderByItem(this.newItem.itemNumber).subscribe(data => {
      //   ;
      //   let items = data[0].items;

      //   if (items.length > 0) {
      //     items.forEach(item => {
      //       if (item.arrivedAmount != undefined) {
      //         if (item.arrivedAmount <= item.supplierAmount) {
      //           this.existOpenOrderAlert = true;
      //           this.openOrdersModal = true;
      //           if (this.newItem.supplierPrice == 0 || isNaN(this.newItem.supplierPrice)) {
      //             this.newItem.supplierPrice = Number(data[0].price)
      //           }
      //         }
      //       } else {
      //         this.openOrdersModal = true;
      //       }

      //       if (item.status == 'supplierGotOrder' || item.status == 'sentToSupplier') {
      //         item.status = 'open'
      //       }
      //     });
      //   }
      //   else {
      //     this.itemExistInOrders = [];
      //     this.openOrdersModal = false;
      //   }

      //   this.itemExistInOrders = data.filter(p => p.status != 'closed');

      // })









    // addToSupplierPriceList() {
    //   ;
    //   if (confirm('האם להוסיף למחירון ספק ?')) {
    //     var obj = {
    //       itemName: this.newItem.itemName,
    //       itemNumber: this.newItem.itemNumber,
    //       supplierPrice: this.newItem.supplierPrice,
    //       supplierNumber: this.newProcurement.supplierNumber
    //     }

    //     this.supplierToUpdate = obj;

    //     this.supplierService.addToSupplierPriceList(obj).subscribe(data => {
    //       if (data.itemNumber) {
    //         this.currItemForPL = data;
    //         this.showUpdatePLModal = true
    //       } else {
    //         this.toastr.success('פריט הוסף למחירון ספק בהצלחה !')
    //       }
    //     })
    //   }

    // }


    // addItemToProcurement() {
      //   ;
      //   var newItem = {
        //     coin: this.coin.nativeElement.value,
        //     itemName: this.itemName.nativeElement.value,
        //     itemNumber: this.itemNumber.nativeElement.value,
        //     measurement: this.measurement.nativeElement.value,
        //     supplierAmount: this.supplierAmount.nativeElement.value,
        //     supplierPrice: this.supplierPrice.nativeElement.value,
        //     itemPrice: Number(this.supplierPrice.nativeElement.value) * Number(this.supplierAmount.nativeElement.value),
        //     itemRemarks: this.itemRemarks.nativeElement.value,
        //     componentNs: this.newItem.componentNs,
        //     componentType: this.newItem.componentType
        //   }

        //   if (newItem.itemName) {
  //     newItem.itemName.trim()
  //   }
  //   if (newItem.itemNumber) {
  //     newItem.itemNumber.trim()
  //   }
  //   if (newItem.componentNs) {
  //     newItem.componentNs.trim()
  //   }



  //   if (this.itemName.nativeElement.value == "" || this.itemNumber.nativeElement.value == "" || this.measurement.nativeElement.value == "" || this.supplierAmount.nativeElement.value == "") {
  //     this.toastr.error('שים לב , לא כל הפרטים מלאים.')
  //   } else {
  //     if (this.newProcurement.orderType == 'material') {
  //       if (this.allMaterials != undefined) {
  //         var material = this.allMaterials.find(m => m.componentN == newItem.itemNumber);
  //       }

  //       ;
  //       if (material) {
  //         if (material.permissionDangerMaterials == true || material.permissionDangerMaterials == 'true') {
  //           if (confirm('שים לב , לחומר גלם זה מסומן היתר רעלים והכמות המותרת לאחסון הינה' + ' ' + material.allowQtyInStock)) {
  //             this.pushAndResetItem(newItem)
  //           }
  //         } else {
  //           this.pushAndResetItem(newItem)
  //         }
  //       }
  //       else {
  //         this.pushAndResetItem(newItem)

  //       }
  //     } else {
  //       this.pushAndResetItem(newItem)

  //     }




  //   }
  // }

  // pushAndResetItem(newItem) {
  //   this.newProcurement.item.push(newItem);

  //   this.newItem.coin = "";
  //   this.newItem.itemName = "";
  //   this.newItem.itemNumber = "";
  //   this.newItem.measurement = "";
  //   this.newItem.supplierAmount = "";
  //   this.newItem.itemRemarks = '';
  //   this.newItem.supplierPrice = 0;
  //   this.itemExistInOrders = [];
  //   this.openOrdersModal = false;
  //   this.toastr.success("פריט התווסף בהצלחה!")
  // }
