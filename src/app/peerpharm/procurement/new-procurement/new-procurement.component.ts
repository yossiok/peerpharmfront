import { Component, OnInit, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-new-procurement',
  templateUrl: './new-procurement.component.html',
  styleUrls: ['./new-procurement.component.scss']
})
export class NewProcurementComponent implements OnInit {

  @Output() newProcurementSaved: EventEmitter<any> = new EventEmitter<any>();
  openOrdersModal: boolean = false;
  newProcurementForm: any;
  supplierToUpdate: any;
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
  editRow: String = ''
  newPurchase:FormGroup

  @ViewChild('itemNumber') itemNumber: ElementRef;
  @ViewChild('itemName') itemName: ElementRef;
  @ViewChild('coin') coin: ElementRef;
  @ViewChild('measurement') measurement: ElementRef;
  @ViewChild('supplierPrice') supplierPrice: ElementRef;
  @ViewChild('supplierAmount') supplierAmount: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;

  @ViewChild('updateItemAmount') updateItemAmount: ElementRef;
  @ViewChild('updateItemPrice') updateItemPrice: ElementRef;

  newItem = {

    itemNumber: '',
    itemName: '',
    coin: '',
    measurement: '',
    supplierPrice: 0,
    supplierAmount: '',
    color: '',
    orderNumber: '',
    itemRemarks: '',
    itemPrice: '',
    componentNs: '',
    componentType: ''

  }
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
    supplierItemNum:''

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


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.editPurchaseItems('');

  }

  constructor(private fb:FormBuilder,private route: ActivatedRoute, private toastr: ToastrService, private procurementService: Procurementservice, private authService: AuthService, private inventoryService: InventoryService, private supplierService: SuppliersService, public formBuilder: FormBuilder,) {

    this.newPurchase = fb.group({
      supplierName: ["", Validators.required],
      supplierNumber: ["", Validators.required],
      supplierEmail: ['', Validators.required],

      creationDate: [this.formatDate(new Date()), Validators.required],
      arrivalDate: [Date, Validators.required],
      color: ['', Validators.required],
      stockitems: [[], Validators.required],
      orderNumber: ['', Validators.required],
     
      userEmail: ['', Validators.required],
      user: ['', Validators.required],
      billNumber: [[], Validators.required],
      closeReason: ['', Validators.required],
      orderType: ['', Validators.required],
      remarks: ['', Validators.required],
      status: ['', Validators.required],
      deliveryCerts: [[], Validators.required],
      
 
    });
  }

  ngOnInit() {
    this.getAllSuppliers();
    this.getAllMaterials();
    debugger;
    if (this.route.snapshot.queryParams.id != undefined) {
      debugger
      let recommendId = this.route.snapshot.queryParams.id
      this.procurementService.getRecommendById(recommendId).subscribe(data => {
        if (data) {
          this.fillPurchaseDetails(data)
        }
      })
    }
    // if (this.route.snapshot.queryParams.multi != undefined) {
    //   debugger
    //  let multi =  this.route.snapshot.queryParams.multi
    //  multi = multi.split(',')
    //  this.procurementService.getRecommendById(multi).subscribe(data=>{
    //   if(data){
    //     this.fillPurchaseDetails(data)
    //   }
    //  })
    // }
    if (this.authService.loggedInUser) {
      this.userEmail = this.authService.loggedInUser.userEmail;
      this.newProcurement.user = this.authService.loggedInUser.userName

    }
    else {
      this.authService.userEventEmitter.subscribe(data => {
        this.userEmail = this.authService.loggedInUser.userEmail;

      })
    }

  }


  sendNewPurchase(){
    debugger;
    this.newPurchase.controls.supplierName
  }


  updateItemInPL() {
    this.supplierService.updateSupplierPrice(this.supplierToUpdate).subscribe(data => {
      if (data) {
        this.toastr.success('מחיר עודכן בהצלחה !')
      }
    })
  }


  moveToProcItems() {

    if (this.newProcurementForm.value.orderNumber != "") {
      this.procurementSupplier = false;
      this.procurementItems = true;
    }
  }

  fillPurchaseDetails(recommendation) {
    debugger;


    this.newItem.itemNumber = recommendation.componentNumber;
    this.newProcurement.orderType = recommendation.type
    this.newItem.supplierAmount = recommendation.amount
    this.newProcurement.recommendId = recommendation._id
    this.findStockItemByNumber();

  }

  findStockItemByNumber() {
    debugger
    if (this.stockitem.number != '') {

      if (this.newPurchase.controls.orderType.value == 'material') {
        this.inventoryService.getMaterialStockItemByNum(this.stockitem.number).subscribe(data => {
          debugger;
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
          debugger;
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

      // this.procurementService.getPurchaseOrderByItem(this.newItem.itemNumber).subscribe(data => {
      //   debugger;
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

    }


  }

  editPurchaseItems(itemNumber) {
    if (itemNumber != '') {

      this.editRow = itemNumber;
    } else {
      this.editRow = '';

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
    debugger;
    let supplier = ev.target.value;
    let result = this.allSuppliers.filter(x => supplier == x.suplierName)
    this.currSupplier = result[0]

    this.newPurchase.controls.supplierNumber.setValue(this.currSupplier.suplierNumber)
    this.newPurchase.controls.supplierEmail.setValue(this.currSupplier.email)

  }

  removeItemFromPurchase(itemNumber) {

    for (let i = 0; i < this.newProcurement.item.length; i++) {
      if (this.newProcurement.item[i].itemNumber == itemNumber) {
        this.newProcurement.item.splice(i, 1);
        this.toastr.success('פריט הוסר בהצלחה')
      }

    }

  }

  editItemInPurchase(itemNumber) {
    if (itemNumber != '') {
      var item = this.newProcurement.item.find(i => i.itemNumber == itemNumber)
      item.supplierAmount = this.updateItemAmount.nativeElement.value;
      item.supplierPrice = this.updateItemPrice.nativeElement.value;
      this.editPurchaseItems('')
      this.toastr.success('פריט עודכן בהצלחה !')
    }
  }


  addItemToPurchase(){
    let objToPush = {...this.stockitem}
    this.newPurchase.controls.stockitems.value.push(objToPush)
    this.resetStockItem();
    this.toastr.success('Item Added Successfully')
  }

  addItemToProcurement() {
    debugger;
    var newItem = {
      coin: this.coin.nativeElement.value,
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      measurement: this.measurement.nativeElement.value,
      supplierAmount: this.supplierAmount.nativeElement.value,
      supplierPrice: this.supplierPrice.nativeElement.value,
      itemPrice: Number(this.supplierPrice.nativeElement.value) * Number(this.supplierAmount.nativeElement.value),
      itemRemarks: this.itemRemarks.nativeElement.value,
      componentNs: this.newItem.componentNs,
      componentType: this.newItem.componentType
    }

    if (newItem.itemName) {
      newItem.itemName.trim()
    }
    if (newItem.itemNumber) {
      newItem.itemNumber.trim()
    }
    if (newItem.componentNs) {
      newItem.componentNs.trim()
    }



    if (this.itemName.nativeElement.value == "" || this.itemNumber.nativeElement.value == "" || this.measurement.nativeElement.value == "" || this.supplierAmount.nativeElement.value == "") {
      this.toastr.error('שים לב , לא כל הפרטים מלאים.')
    } else {
      if (this.newProcurement.orderType == 'material') {
        if (this.allMaterials != undefined) {
          var material = this.allMaterials.find(m => m.componentN == newItem.itemNumber);
        }

        debugger;
        if (material) {
          if (material.permissionDangerMaterials == true || material.permissionDangerMaterials == 'true') {
            if (confirm('שים לב , לחומר גלם זה מסומן היתר רעלים והכמות המותרת לאחסון הינה' + ' ' + material.allowQtyInStock)) {
              this.pushAndResetItem(newItem)
            }
          } else {
            this.pushAndResetItem(newItem)
          }
        }
        else {
          this.pushAndResetItem(newItem)

        }
      } else {
        this.pushAndResetItem(newItem)

      }




    }
  }

  pushAndResetItem(newItem) {
    this.newProcurement.item.push(newItem);

    this.newItem.coin = "";
    this.newItem.itemName = "";
    this.newItem.itemNumber = "";
    this.newItem.measurement = "";
    this.newItem.supplierAmount = "";
    this.newItem.itemRemarks = '';
    this.newItem.supplierPrice = 0;
    this.itemExistInOrders = [];
    this.openOrdersModal = false;
    this.toastr.success("פריט התווסף בהצלחה!")
  }

  fillMaterialNumber(ev) {
    debugger;
    var materialName = ev.target.value;

    var material = this.allMaterials.find(material => material.componentName == materialName)

    this.newItem.itemNumber = material.componentN;
    this.findStockItemByNumber();

  }

  sendNewProc() {

    debugger;
   
      if (this.newPurchase.controls.stockitems.value) {
        if (confirm("האם להקים הזמנה זו ?")) {
          this.newProcurement.outDate.toString();
          this.procurementService.addNewProcurement(this.newPurchase.value).subscribe(data => {
            // console.log('data from addNewProcurement: ',data)
            if (data) {
              this.toastr.success("הזמנה מספר" + data.orderNumber + "נשמרה בהצלחה!")
              this.newPurchase.reset();
              this.newProcurementSaved.emit()
            }
          })
         
        }
      } else {
        this.toastr.error('אין אפשרות להקים הזמנה ללא פריטים')
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


  addToSupplierPriceList() {
    debugger;
    if (confirm('האם להוסיף למחירון ספק ?')) {
      var obj = {
        itemName: this.newItem.itemName,
        itemNumber: this.newItem.itemNumber,
        supplierPrice: this.newItem.supplierPrice,
        supplierNumber: this.newProcurement.supplierNumber
      }

      this.supplierToUpdate = obj;

      this.supplierService.addToSupplierPriceList(obj).subscribe(data => {
        if (data.itemNumber) {
          this.currItemForPL = data;
          this.showUpdatePLModal = true
        } else {
          this.toastr.success('פריט הוסף למחירון ספק בהצלחה !')
        }
      })
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

  resetStockItem(){
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

}