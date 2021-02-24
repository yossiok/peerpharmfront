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
  @Input() stam: any;
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

  openOrdersModal: boolean = false;
  disabled: boolean = true;
  supplierToUpdate: any;
  user: any;
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
  editItem:boolean = false;

  newPurchase: FormGroup;
  deliveryCertificateForm: FormGroup;
  stockitem = {
    number: '',
    name: '',
    coin: '',
    measurement: '',
    price: 0,
    quantity: '',
    color: '',
    itemRemarks: '',
    itemPrice: '',
    supplierItemNum: '',
    supplierAmount: 0
  }
  newProcurement = {
    supplierNumber: '',
    supplierName: '',
    supplierEmail: '',
    outDate: this.formatDate(new Date()),
    validDate: '',
    item: [],
    outOfCountry: false,
    orderType: '',
    remarks: '',
    comaxNumber: '',
    recommendRemarks: '',
    userEmail: '',
    recommendId: '',
    user: '',

  }

  //invoice data
  purchaseInvoiceNumber: number;
  invoiceRemarks: string;

  //toggle purchase details
  showPurchaseDetails: boolean = false;
  showItemDetails: boolean = false;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
  }

  constructor(private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private toastr: ToastrService, private procurementService: Procurementservice, private authService: AuthService, private inventoryService: InventoryService, private supplierService: SuppliersService, public formBuilder: FormBuilder,) {

    this.newPurchase = fb.group({
      _id: [],
      supplierName: ["", Validators.required],
      supplierNumber: ["", Validators.required],
      supplierEmail: ['', Validators.required],
      creationDate: [this.formatDate(new Date()), Validators.required],
      arrivalDate: ['', Validators.required],
      stockitems: [[], Validators.required],
      orderNumber: ['', Validators.required],
      userEmail: ['', Validators.required],
      user: ['', Validators.required],
      billNumber: [[], Validators.required],
      orderType: ['', Validators.required],
      remarks: ['', Validators.required],
      status: ['', Validators.required],
      deliveryCerts: [[], Validators.required],
      outOfCountry: [false, Validators.required],
    });

    this.deliveryCertificateForm = fb.group({
      certificateNumber: ['', Validators.required],
      deliveryArrivalDate: [new Date(), Validators.required],
      itemNumber: ['', Validators.required],
      amount: [null, Validators.required],
      remarks: [''],
      userName: ['']
    })
  }

  ngOnInit() {
    debugger;
    console.log('purchase data: ', this.purchaseData)
    // this.user = this.authService.loggedInUser.userName
    if (this.isEdit) this.newPurchase.setValue(this.purchaseData as PurchaseData)
    this.getAllSuppliers();
    this.getAllMaterials();
    if (this.route.snapshot.queryParams.id != undefined) {
      let recommendId = this.route.snapshot.queryParams.id
      this.procurementService.getRecommendById(recommendId).subscribe(data => {
        if (data) {
          this.fillPurchaseDetails(data)
        }
      })
    }
    if (this.authService.loggedInUser) {
      this.newPurchase.controls.userEmail.setValue(this.authService.loggedInUser.userEmail);
      this.user = this.authService.loggedInUser.userName
    }
    // else {
    //   this.authService.userEventEmitter.subscribe(data => {
    //     this.userEmail = this.authService.loggedInUser.userEmail;
    //   })
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    debugger;
    // console.log('new purchase on change: ',this.newPurchase.value)
    // console.log('changes: ',changes)
    this.newPurchase.setValue(changes.purchaseData.currentValue)
    
  }

  updateItemInPL() {
    this.supplierService.updateSupplierPrice(this.supplierToUpdate).subscribe(data => {
      if (data) {
        this.toastr.success('מחיר עודכן בהצלחה !')
      }
    })
  }

  setPurchaseStatus(ev) {

    this.newPurchase.controls.status.setValue(ev.target.value);
    this.toastr.success('אנא לחץ על Confirm על מנת לשמור שינויים')
    

  }

  fillPurchaseDetails(recommendation) {
    this.stockitem.number = recommendation.componentNumber;
    this.newPurchase.controls.orderType.setValue(recommendation.type);
    this.stockitem.quantity = recommendation.amount
    this.newProcurement.recommendId = recommendation._id
    this.findStockItemByNumber();
  }

  findStockItemByNumber() {
    if (this.stockitem.number != '') {
      if (this.newPurchase.controls.orderType.value == 'material') {
        this.inventoryService.getMaterialStockItemByNum(this.stockitem.number).subscribe(data => {
          ;
          if (data[0]) {
            this.stockitem.name = data[0].componentName;
            this.stockitem.coin = data[0].coin
            this.stockitem.measurement = data[0].unitOfMeasure
            this.stockitem.supplierItemNum = data[0].componentNs
            var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
            this.stockitem.price = parseFloat(supplier.price)
          } else {
            this.toastr.error('פריט לא קיים במערכת')
          }

        })
      } else if (this.newPurchase.controls.orderType.value == 'component') {
        this.inventoryService.getCmptByitemNumber(this.stockitem.number).subscribe(data => {
          ;
          if (data[0]) {
            this.stockitem.name = data[0].componentName;
            this.stockitem.measurement = data[0].unitOfMeasure
            this.stockitem.supplierItemNum = data[0].componentNs
            var supplier = data[0].alternativeSuppliers.find(s => s.supplierName == this.newPurchase.controls.supplierName.value);
            this.stockitem.price = parseFloat(supplier.price)
            this.stockitem.coin = supplier.coin

          } else {
            this.toastr.error('פריט לא קיים במערכת')
          }
        })
      }
    }
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
    ;
    let supplier = ev.target.value;
    let result = this.allSuppliers.filter(x => supplier == x.suplierName)
    this.currSupplier = result[0]
    this.newPurchase.controls.supplierNumber.setValue(this.currSupplier.suplierNumber)
    if (this.currSupplier.email) {
      this.newPurchase.controls.supplierEmail.setValue(this.currSupplier.email)
    }

  }

  removeStockitemFromPurchase(stockitem) {
    if (confirm('האם להסיר פריט זה ?')) {
      for (let i = 0; i < this.newPurchase.controls.stockitems.value.length; i++) {
        if (this.newPurchase.controls.stockitems.value[i].number == stockitem.number) {
          this.newPurchase.controls.stockitems.value.splice(i, 1)
          this.toastr.success('פריט הוסר בהצלחה !')
        }
      }
    }
  }

  updateItems(stockItem) {
    this.toastr.warning('שים לב!!!!!!!')
    this.toastr.warning("! 'confirm' כדי שהפריט יתעדכן יש ללחוץ  ")
    this.editItem = false;
  }

  addItemToPurchase() {
    
    let objToPush = { ...this.stockitem }
    this.newPurchase.controls.stockitems.value.push(objToPush)
    this.resetStockItem();
    this.toastr.success('Item Added Successfully')
  }

  fillMaterialNumber(ev) {
    var materialName = ev.target.value;
    var material = this.allMaterials.find(material => material.componentName == materialName)
    this.stockitem.number = material.componentN;
    this.findStockItemByNumber();
  }

  sendNewProc(action) {
    
    if (action == 'add') {
      if (this.newPurchase.controls.stockitems.value) {
        if (confirm("האם להקים הזמנה זו ?")) {
          this.newPurchase.controls['user'].setValue(this.authService.loggedInUser.userName)
          this.procurementService.addNewProcurement(this.newPurchase.value).subscribe(data => {
            // console.log('data from addNewProcurement: ',data)
            if (data) {
              this.toastr.success("הזמנה מספר" + data.orderNumber + "נשמרה בהצלחה!")
              this.newPurchase.reset();
              this.newProcurementSaved.emit()
              this.closeOrderModal.emit(false)
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
        console.log('AAAAAAAAAAAAA', this.newPurchase.value)
        this.procurementService.updatePurchaseOrder(this.newPurchase.value).subscribe(data => {
          if (data) {
            
            this.toastr.success('הזמנה עודכנה בהצלחה !')
            this.closeOrderModal.emit(false)
            this.newProcurementSaved.emit()
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
    this.stockitem.number = '',
      this.stockitem.name = '',
      this.stockitem.coin = '',
      this.stockitem.measurement = '',
      this.stockitem.price = 0,
      this.stockitem.quantity = '',
      this.stockitem.color = '',
      this.stockitem.itemRemarks = '',
      this.stockitem.itemPrice = ''
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
    this.newPurchase.controls.billNumber.value.push({
      invoiceNumber: this.purchaseInvoiceNumber,
      remarks: this.invoiceRemarks
    });
    this.procurementService.updatePurchaseOrder(this.newPurchase.value as PurchaseData)
      .subscribe(res => {
        if (res) {
          this.toastr.success(`חשבונית מספר ${this.purchaseInvoiceNumber} התווספה בהצלחה להזמנה מספר ${this.purchaseData.orderNumber} `)
        }
        else this.toastr.error('משהו השתבש. אנא פנה לתמיכה')
        this.purchaseInvoiceNumber = null
        this.modalService.dismissAll()
      })
  }

  open(modal) {
    this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
  }

  setHeight() {

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
