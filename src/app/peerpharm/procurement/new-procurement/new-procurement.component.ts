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


@Component({
  selector: 'app-new-procurement',
  templateUrl: './new-procurement.component.html',
  styleUrls: ['./new-procurement.component.scss']
})
export class NewProcurementComponent implements OnInit, OnChanges {

  @Output() newProcurementSaved: EventEmitter<any> = new EventEmitter<any>();
  @Input() purchaseData: any;
  @Input() requestToPurchase: any;
  @Input() isEdit: boolean;
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
  deliveryCertificateForm: FormGroup;
  itemForm: FormGroup;

  //invoice data
  purchaseInvoiceNumber: number;
  invoiceRemarks: string;
  coinRate:number = 1
  invoiceCoin:string;
  invoicePrice:number;
  taxes:number = 0
  taxesTwo:number = 0
  fixedPrice:number;

  //toggle purchase details
  showPurchaseDetails: boolean = false;
  showItemDetails: boolean = false;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
  }

  constructor(private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private toastr: ToastrService, private procurementService: Procurementservice, private authService: AuthService, private inventoryService: InventoryService, private supplierService: SuppliersService, public formBuilder: FormBuilder,) {
    debugger;
    this.newPurchase = fb.group({
      _id: [''],
      supplierName: ["", Validators.required],
      supplierNumber: ["", Validators.required],
      supplierEmail: [''],
      creationDate: [this.formatDate(new Date()), Validators.required],
      arrivalDate: [{value: this.formatDate(new Date()), disabled: this.disabled && this.isEdit}, Validators.required],
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
      sumShippingCost:[0]
    });

    this.deliveryCertificateForm = fb.group({
      certificateNumber: ['', Validators.required],
      deliveryArrivalDate: [new Date(), Validators.required],
      itemNumber: ['', Validators.required],
      amount: [null, Validators.required],
      remarks: [''],
      userName: ['']
    })

    this.itemForm = fb.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      coin: [''],
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
      debugger
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
    if (this.isEdit) this.newPurchase.setValue(this.purchaseData as PurchaseData)
    else this.purchaseData = undefined
    this.getAllSuppliers();
    this.getAllMaterials();
    if (this.authService.loggedInUser) {
      this.newPurchase.controls.userEmail.setValue(this.authService.loggedInUser.userEmail);
      this.user = this.authService.loggedInUser.userName
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.isEdit.currentValue){
      if(changes.purchaseData) if(!changes.purchaseData.currentValue.recommendId) changes.purchaseData.currentValue.recommendId = '' 
      if(this.isEdit) this.newPurchase.setValue(changes.purchaseData.currentValue)
    }
  
  }

  updateItemInPL() {
    this.supplierService.updateSupplierPrice(this.supplierToUpdate).subscribe(data => {
      if (data) {
        this.toastr.success('מחיר עודכן בהצלחה !')
      }
    })
  }

  setPurchaseStatus(ev) {
    if(confirm('האם לשנות סטטוס הזמנה ?')) {
      this.newPurchase.controls.status.setValue(ev.target.value);
      this.procurementService.setPurchaseStatus(this.newPurchase.value).subscribe(data=>{
      if(data){
        this.toastr.success('סטטוס עודכן בהצלחה !')
      }
      })
    }
   
 
  }

  // fillPurchaseDetails(recommendation) {
  //   this.itemForm.value.controls.number = recommendation.componentNumber;
  //   this.newPurchase.controls.orderType.setValue(recommendation.type);
  //   this.itemForm.value.controls.quantity = recommendation.amount
  //   this.newProcurement.recommendId = recommendation._id
  //   this.findStockItemByNumber();
  // }

  findStockItemByNumber() {
    if (this.itemForm.get('number').value != '') {
      this.toastr.warning('שים לב! יש ללחוץ על + בסיום')
      this.toastr.warning('אחרת הפריט לא יישמר!')
      if (this.newPurchase.controls.orderType.value == 'material') {
        this.inventoryService.getMaterialStockItemByNum(this.itemForm.get('number').value).subscribe(data => {
          if (data[0]) {
            this.itemForm.controls.name.setValue(data[0].componentName);
            this.itemForm.controls.coin.setValue(data[0].coin)
            this.itemForm.controls.measurement.setValue(data[0].unitOfMeasure)
            this.itemForm.controls.supplierItemNum.setValue(data[0].componentNs)
            var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
            if(!supplier) console.log('Supplier undefined') 
            else this.itemForm.controls.price.setValue(parseFloat(supplier.price))
          } else {
            this.toastr.error('פריט לא קיים במערכת')
          }

        })
      } else if (this.newPurchase.controls.orderType.value == 'component') {
        this.inventoryService.getCmptByitemNumber(this.itemForm.get('number').value).subscribe(data => {
          if (data[0]) {
            this.itemForm.controls.name.setValue(data[0].componentName) 
            this.itemForm.controls.measurement.setValue(data[0].unitOfMeasure) 
            this.itemForm.controls.supplierItemNum.setValue(data[0].componentNs) 
            var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
            if(!supplier) console.log('Supplier undefined')
            else {
              this.itemForm.controls.price.setValue(parseFloat(supplier.price)) 
              this.itemForm.controls.coin = supplier.coin
            } 

          } else {
            this.toastr.error('פריט לא קיים במערכת')
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

  getAllMaterials() {
    this.inventoryService.getAllMaterialsForFormules().subscribe(data => {
      this.allMaterials = data;
    })
  }

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

  removeStockitemFromPurchase(i) {
    if (confirm('האם להסיר פריט זה ?')) {
          this.newPurchase.controls.stockitems.value.splice(i, 1)
          this.toastr.success('פריט הוסר בהצלחה !')
    }
  }

  updateItems(stockItem) {
    this.toastr.warning('שים לב!!!!!!!')
    this.toastr.warning("! 'confirm' כדי שהפריט יתעדכן יש ללחוץ  ")
    this.editItem = false;
  }

 

  fillMaterialNumber(ev) {
    var materialName = ev.target.value;
    var material = this.allMaterials.find(material => material.componentName == materialName)
    this.itemForm.controls.number.setValue(material.componentN);
    this.findStockItemByNumber();
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
              this.newProcurementSaved.emit()
              this.closeOrderModal.emit(false)
              location.reload()

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
            this.newProcurementSaved.emit()
            location.reload()
          }
          else this.toastr.error('משהו השתבש...')
        })
      }
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

  resetStockItem() {
    this.itemForm.reset()
  }

  saveCertificate() {
    this.newPurchase.controls.deliveryCerts.value.push(this.deliveryCertificateForm.value as DeliveryCertificate);
    this.procurementService.updatePurchaseOrder(this.newPurchase.value as PurchaseData)
      .subscribe(res => {
        if (res) {
          this.toastr.success(`תעודה מספר ${this.deliveryCertificateForm.get('certificateNumber').value} התווספה בהצלחה להזמנה מספר ${this.purchaseData.orderNumber} `)
        }
        else this.toastr.error('משהו השתבש. אנא פנה לתמיכה')
        this.deliveryCertificateForm.reset()
        this.deliveryCertificateForm.controls['userName'].setValue(this.authService.loggedInUser.userName)
        this.modalService.dismissAll()
      })
  }

  saveInvoiceToPurchase() {
    this.fixedPrice = (this.invoicePrice-(this.taxes+this.taxesTwo))*this.coinRate
    this.newPurchase.controls.billNumber.value.push({
      invoiceNumber: this.purchaseInvoiceNumber,
      remarks: this.invoiceRemarks,
      invoicePrice:this.invoicePrice,
      invoiceCoin:this.invoiceCoin,
      coinRate:this.coinRate,
      taxes:this.taxes,
      taxesTwo:this.taxesTwo,
      fixedPrice:this.fixedPrice

    });

    this.newPurchase.controls.sumShippingCost.setValue(this.newPurchase.controls.sumShippingCost.value + this.fixedPrice)
    this.procurementService.updatePurchaseOrder(this.newPurchase.value as PurchaseData)
      .subscribe(res => {
        if (res) {
          this.newPurchase.patchValue({
            stockitems:res.stockitems
          })
          this.toastr.success(`חשבונית מספר ${this.purchaseInvoiceNumber} התווספה בהצלחה להזמנה מספר ${this.purchaseData.orderNumber} `)
          this.purchaseInvoiceNumber = 0
          this.invoiceRemarks = ''
          this.invoicePrice = 0
          this.invoiceCoin = ''
          this.coinRate = 0
          this.taxes = 0
          this.taxesTwo = 0
        }
        else this.toastr.error('משהו השתבש. אנא פנה לתמיכה')
        this.purchaseInvoiceNumber = null
        this.modalService.dismissAll()
      })
  }

  open(modal) {
    this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
  }

}









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
