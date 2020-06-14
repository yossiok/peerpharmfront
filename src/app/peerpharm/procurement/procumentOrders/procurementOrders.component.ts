import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { ArrayServiceService } from 'src/app/utils/array-service.service';
import { p } from '@angular/core/src/render3';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.css']
})

export class ProcurementOrdersComponent implements OnInit {

  linkDownload: String = '';
  orderRemarks: String;
  allComponents: any[];
  allInvoices: any[];
  allInvoicesCopy: any[];
  purchaseRecommendations: any[];
  purchaseRecommendationsCopy: any[];
  allComponentsCopy: any[];
  allMaterials: any[];
  printBill: boolean = false;
  orderDetailsModal: boolean = false;
  showImage: boolean = false;
  showLoader: boolean = true;
  showInfoModal: boolean = false;
  editArrivalModal: boolean = false;
  changeItemQuantity: boolean = false;
  invoiceModal: boolean = false;
  changeItemPrice: boolean = false;
  bill: boolean = false;
  procurementData: any[];
  procurementDataCopy: any[];
  procurementArrivals: any[] = []
  procurementArrivalsCopy: any[] = []
  currentOrder: any[];
  currentItems: any[];
  certificate: any[];
  allSuppliers: any[];
  billToPrint: any[];
  currentSupplier: object;
  orderData: any[];
  arrivalData: any[];
  EditRowId: any = "";
  EditRowComax: any = "";
  requestNum: any = "";
  user: any;
  currCertifItem: any;
  currentInvoice: any;
  sumCharge: any;
  sumChargeTaxes: any;
  newItemQuantity: string = '';
  certifNumberToPush: any;
  priceAlert: Boolean = false;
  currStatus: any;
  currOrderNumber: any;
  infoToStatus: any;
  referNumberForReciept: any;
  certifTotalPrice: number = 0;
  totalAmount: any;
  priceTaxes: any;
  itemAmounts: any;
  totalPrice: any;
  totalPriceWithTaxes:any;
  currCoin: any;
  importantRemarks: any;
  orderDate: any;
  outOfCountry: any;

  newItem = {

    itemNumber: '',
    itemName: '',
    coin: '',
    measurement: '',
    supplierPrice: '',
    supplierAmount: '',
    color: '',
    orderNumber: '',
    itemRemarks: '',
    itemPrice: 0,
    remarks: ''

  }
  newReference = {
    referenceNumber: "",
    arrivalDate: "",
    arrivedAmount: "",
    orderId: "",
    itemNumber: "",
  }

  newBill = {
    billNumber: '',
    supplierNumber: '',
    certificateNumbers: [],
    totalPrice: '',
  }

  @ViewChild('arrivedAmount') arrivedAmount: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;
  @ViewChild('orderAmount') orderAmount: ElementRef;
  @ViewChild('orderCoin') orderCoin: ElementRef;
  @ViewChild('referenceNumber') referenceNumber: ElementRef;
  @ViewChild('arrivalDate') arrivalDate: ElementRef;
  @ViewChild('recommendRemarks') recommendRemarks: ElementRef;
  @ViewChild('supplierPrice') supplierPrice: ElementRef;
  @ViewChild('expectedDate') expectedDate: ElementRef;

  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;

  @ViewChild('purchaseRemarks') purchaseRemarks: ElementRef;
  @ViewChild('purchaseArrivalDate') purchaseArrivalDate: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
    this.editRecommend('', '')
  }

  constructor(
    private toastr: ToastrService, private procurementservice: Procurementservice, private excelService: ExcelService, private supplierService: SuppliersService,
    private inventoryService: InventoryService, private authService: AuthService, private arrayService: ArrayServiceService
  ) { }

  ngOnInit() {
    console.log('Enter');
    this.getAllProcurementOrders();
    this.getComponentsWithPurchaseRec();
       this.getAllSuppliers();
    this.getAllInvoices();
    this.user = this.authService.loggedInUser.firstName;

  }



  loadPurchasesItems(){
    debugger;
    var tempArr = []
    for (let i = 0; i < this.procurementData.length; i++) {
    for (let j = 0; j < this.procurementData[i].item.length; j++) {
      tempArr.push(this.procurementData[i].item[j])
      
    }
      
    }
    tempArr
    this.excelService.exportAsExcelFile(tempArr, 'data');
  }

  fillMaterialName(ev) {
    debugger;
    var itemNumber = ev.target.value;

    this.inventoryService.getCmptByitemNumber(itemNumber).subscribe(data => {
      debugger;
      if (data) {
        if (data[0].componentN == itemNumber) {
          this.newItem.itemName = data[0].componentName
        }

      }
    })


  }
  filterPurchases(event, type) {
    debugger;

    switch (type) {
      case 'supplier':
        if (event.target.value != '') {
          this.procurementArrivals = []
          this.procurementArrivalsCopy = []
          var tempArr = this.procurementDataCopy.filter(p => p.supplierName == event.target.value && p.status != 'canceled');
          for (let i = 0; i < tempArr.length; i++) {
            
              for (let j = 0; j < tempArr[i].item.length; j++) {

                var obj = {
                  id: tempArr[i]._id,
                  supplierName: tempArr[i].supplierName,
                  comaxNumber: tempArr[i].comaxNumber,
                  orderNumber: tempArr[i].orderNumber,
                  orderDate:tempArr[i].outDate,
                  itemNumber: tempArr[i].item[j].itemNumber,
                  itemName: tempArr[i].item[j].itemName,
                  supplierAmount: tempArr[i].item[j].supplierAmount,
                  arrivals: [],


                }
                if (tempArr[i].item[j].arrivals) {
                  for (let k = 0; k < tempArr[i].item[j].arrivals.length; k++) {

                    var arrival = {
                      referenceNumber: tempArr[i].item[j].arrivals[k].referenceNumber,
                      arrivalDate: tempArr[i].item[j].arrivals[k].arrivalDate,
                      arrivedAmount: tempArr[i].item[j].arrivals[k].arrivedAmount
                    }
                    obj.arrivals.push(arrival)

                  }
                }

                this.procurementArrivals.push(obj)
                this.procurementArrivalsCopy.push(obj)

              }
            

          }

        } else {
          this.procurementArrivals = []
          this.procurementArrivalsCopy = []
        }

        break;
      case 'itemNumber':
        var tempArr = [...this.procurementArrivals];
        if (event.target.value != '') {
          this.procurementArrivals = tempArr.filter(p => p.itemNumber == event.target.value)
        } else {
          this.procurementArrivals = this.procurementArrivalsCopy
        }

        break;
      case 'orderNumber':
        var tempArr = [...this.procurementArrivals];
        if (event.target.value != '') {
          this.procurementArrivals = tempArr.filter(p => p.orderNumber == event.target.value)
        } else {
          this.procurementArrivals = this.procurementArrivalsCopy
        }

        break;


    }


  }
  openPriceModal(item){
    this.changeItemPrice = true;
    this.currCertifItem = item;
  }

  openQuantityModal(item){
    this.changeItemQuantity = true;
    this.currCertifItem = item;
  }

  changeCertifPrice(ev){
    debugger;
      var newItemPrice = ev.target.value;
      if(newItemPrice != ''){
        var item = this.certificate.find(i=>i.itemNumber == this.currCertifItem.itemNumber && i.quantity == this.currCertifItem.quantity);
        item.changedItemPrice = Number(newItemPrice)
        this.changeItemPrice = false;
        this.toastr.success('מחיר חדש נוסף בהצלחה')
        
      }
  }


  filterInvoices(ev,type){
    debugger
    this.allInvoices = this.allInvoicesCopy
    var wordToFilter = ev.target.value;
    if(wordToFilter != ''){
      switch(type) {
        case 'suppliers':
        this.allInvoices = this.allInvoices.filter(i=>i.supplierNumber == wordToFilter)
          break;
        case 'invoiceNumber':
          this.allInvoices = this.allInvoices.filter(i=>i.invoiceNumber == wordToFilter)
          break;
        case 'status':
          this.allInvoices = this.allInvoices.filter(i=>i.status == wordToFilter)
          break;
  
      }
    } else {
      this.allInvoices = this.allInvoicesCopy
    }
 
  }

  getAllInvoices(){

  this.procurementservice.getAllInvoices().subscribe(data=>{
    debugger;
    for (let i = 0; i < data.length; i++) {
     if(data[i].status == 'approved'){
       data[i].status == 'מאושר'
     }
     if(data[i].status == 'inCheck'){
       data[i].status == 'בבדיקה'
     }
      
    }
    this.allInvoices = data;
    this.allInvoicesCopy = data;
  })

  }

  changeCertifQuantity(ev){
    debugger;
      var newItemQuantity = ev.target.value;
      if(newItemQuantity != ''){
        var item = this.certificate.find(i=>i.itemNumber == this.currCertifItem.itemNumber && i.quantity == this.currCertifItem.quantity);
        item.changedQuantity = Number(newItemQuantity)
        this.changeItemQuantity = false;
        this.toastr.success('כמות חדשה נוספה בהצלחה')
        
      }
  }

  addCertifToBill(){
    debugger;
    if(this.certifNumberToPush != ''){
      this.newBill.certificateNumbers.push(this.certifNumberToPush)
      this.toastr.success('תעודה נוספה בהצלחה !')
      this.certifNumberToPush = ''
    } else {
      this.toastr.error('חובה למלא מספר תעודה')
    }
    
  }

  generateInvoice(invoice){
    debugger;
  this.invoiceModal = true;
  var sum = 0;
  for (let i = 0; i < invoice.invoices.length; i++) {
    if(invoice.invoices[i].changedQuantity){
      invoice.invoices[i].fixedQuantity = Math.abs(invoice.invoices[i].quantity - invoice.invoices[i].changedQuantity)
    } else {
      invoice.invoices[i].fixedQuantity = invoice.invoices[i].quantity
    }
    if(invoice.invoices[i].changedItemPrice){
      invoice.invoices[i].fixedPrice = this.formatNumber(Math.abs(Number(invoice.invoices[i].supplierPrice) - invoice.invoices[i].changedItemPrice))
    } else {
      invoice.invoices[i].fixedPrice = this.formatNumber(Number(invoice.invoices[i].supplierPrice))
    }
   
    invoice.invoices[i].chargeSupplier = Number(invoice.invoices[i].fixedPrice)*Number(invoice.invoices[i].fixedQuantity)
    invoice.invoices[i].chargeSupplier = JSON.stringify(invoice.invoices[i].chargeSupplier).slice(0,7)
    

      sum += Number(invoice.invoices[i].chargeSupplier)
    
    
  }
  this.sumCharge = sum
  this.sumChargeTaxes = sum + (sum*17/100)

  this.sumCharge = this.formatNumber(this.sumCharge)
  this.sumChargeTaxes = this.formatNumber(this.sumChargeTaxes)
  this.currentInvoice = invoice;




  }

  createCertifForBill() {
    debugger;
    this.certificate = [];
    this.newBill
    var purchases = this.procurementData.filter(p => p.supplierNumber == this.newBill.supplierNumber)
    purchases

    var obj = {
      itemNumber: '',
      itemName: '',
      quantity: '',
      price: 0,
      arrivalDate: '',
      supplierPrice:'',
      referenceNumber:''
    }

    var tempArr = []

    for (let i = 0; i < purchases.length; i++) {
      for (let j = 0; j < purchases[i].item.length; j++) {
        if (purchases[i].item[j].arrivals == undefined) purchases[i].item[j].arrivals = []
        for (let k = 0; k < purchases[i].item[j].arrivals.length; k++) {
          for (let l = 0; l < this.newBill.certificateNumbers.length; l++) {
            
            
           var refNumber = this.newBill.certificateNumbers[l].substr(this.newBill.certificateNumbers[l].length - 4); // => "1"
          if (purchases[i].item[j].arrivals[k].referenceNumber == refNumber) {
            obj.itemNumber = purchases[i].item[j].itemNumber
            obj.itemName = purchases[i].item[j].itemName
            obj.arrivalDate = purchases[i].item[j].arrivals[k].arrivalDate
            obj.quantity = purchases[i].item[j].arrivals[k].arrivedAmount
            obj.referenceNumber = purchases[i].item[j].arrivals[k].referenceNumber
            obj.supplierPrice = purchases[i].item[j].supplierPrice
            var price = Number(purchases[i].item[j].supplierPrice) * Number(purchases[i].item[j].arrivals[k].arrivedAmount)
            obj.price = Number(price.toFixed(2))
            this.certifTotalPrice += obj.price
            var objToPush = { ...obj }
            tempArr.push(objToPush)
          }
        }
        }

      }

    }
    if (this.certifTotalPrice != Number(this.newBill.totalPrice)) {
      this.priceAlert = true;
    }
    this.certificate = tempArr
  }

  saveNewInvoice(status) {
    debugger;
    var supInvoiceNum = this.newBill.billNumber
    var supplierNumber = this.newBill.supplierNumber
    this.procurementservice.saveNewInvoice(supInvoiceNum,supplierNumber,status, this.certificate).subscribe(data => {
      debugger;
      if (data) {
        this.toastr.success('חשבונית נשמרה בהצלחה')
      }
    })


  }

  getAllProcurementOrders() {
debugger;
    this.procurementservice.getProcurementOrder().subscribe(res => {

      for (let i = 0; i < res.length; i++) {
        if (res[i].closeReason == 'orderFrozen') {
          res[i].closeReason = 'בהקפאה'
        }
        if (res[i].closeReason == 'havivApproval') {
          res[i].closeReason = 'מבוטל באישור חביב'
        }
        if (res[i].closeReason == 'tomerApproval') {
          res[i].closeReason = 'מבוטל באישור תומר'
        }
        if (res[i].closeReason == 'sigiOrAkivaApproval') {
          res[i].closeReason = 'באיזור סיגלית/עקיבא'
        }
        if (res[i].closeReason == 'movedToOtherPurchase') {
          res[i].closeReason = 'הוכנס להזמנה אחרת'
        }
        if (res[i].closeReason == 'balanceNotImp') {
          res[i].closeReason = 'יתרה לא רלוונטית'
        }
        if (res[i].closeReason == 'NoApprovePrice') {
          res[i].closeReason = 'מחיר לא אושר'
        }
        if (res[i].closeReason == 'withoutReciept') {
          res[i].closeReason = 'נסגר ללא תעודה'
        }


        if (res[i].status == 'sentToSupplier') {
          res[i].status = 'נשלחה לספק'
        }

        if (res[i].status == 'supplierGotOrder') {
          res[i].status = 'הגיעה לספק'
        }

        if (res[i].status == 'orderOffer') {
          res[i].status = 'הצעת מחיר הועברה לחביב'
        }

        if (res[i].status == 'havivApprovedOffer') {
          res[i].status = 'אושרה הצעת המחיר'
        }

        if (res[i].status == 'orderPayedToSupplier' || res[i].status.startsWith('orderPayedToSupplier')) {
          // res[i].status = 'שולם לספק'
          res[i].status = 'שולם לספק' + ' ' + res[i].status.substr(res[i].status.indexOf(" ") + 1);
        }

        if (res[i].status == 'timeToProduction' || res[i].status.startsWith('timeToProduction')) {
          // res[i].status = 'צפי ייצור'

          res[i].status = 'צפי ייצור' + ' ' + res[i].status.substr(res[i].status.indexOf(" ") + 1);
        }
        if (res[i].status == 'expectedArrival' || res[i].status.startsWith('expectedArrival')) {
          // res[i].status = 'צפי הגעה'
          res[i].status = 'צפי הגעה' + ' ' + res[i].status.substr(res[i].status.indexOf(" ") + 1);
        }
        if (res[i].status == 'open') {
          res[i].status = 'הזמנה פתוחה'
        }

      }
      this.procurementData = res;
      if(this.procurementData.length > 0){
      this.showLoader = false;
      }

      this.procurementDataCopy = res


      console.log(this.procurementData);

    });
  }

  edit(itemNumber) {
    if (itemNumber != '') {
      this.EditRowId = itemNumber;
    } else {
      this.EditRowId = '';
    }
  }

  editRecommend(id, requestNumber) {
    debugger;
    if (id != '') {
      this.requestNum = requestNumber
      this.EditRowId = id;
    } else {
      this.EditRowId = '';
      this.requestNum = '';
    }
  }

  editRemarks(orderNumber) {
    debugger;
    if (orderNumber != '') {

      this.EditRowId = orderNumber;
    } else {
      this.EditRowId = '';

    }


  }
  
  filterByCategory(ev){
  debugger;
  var category = ev.target.value;

  var tempArr = [];
if(category != ''){
  this.procurementData.forEach(purchase => {
    purchase.item.forEach(item => {
      if(item.componentType == category){
        tempArr.push(purchase);
      }
    });
  });
  var removeDuplicatesArr = [...new Set(tempArr)];
  this.procurementData = removeDuplicatesArr
} else {
  this.procurementData = this.procurementDataCopy
}
  
  }


  filterByStatus(ev, expression) {

    debugger;
    switch (expression) {
      case 'recommendations':
        this.purchaseRecommendations = this.purchaseRecommendationsCopy
        if (ev.target.value != '') {
          var status = ev.target.value;
          var type = ev.target.value;
          switch (type) {
            case 'closed':
              this.purchaseRecommendations = this.purchaseRecommendations.filter(p => p.status == status)
              break
            case 'hold':
              this.purchaseRecommendations = this.purchaseRecommendations.filter(p => p.status == status)
              break
            case 'open':
              this.purchaseRecommendations = this.purchaseRecommendations.filter(p => p.status == status)
              break
        

          }
        } else {
          this.purchaseRecommendations = this.purchaseRecommendationsCopy
        }
        break;
      case 'purchases':
        this.procurementData = this.procurementDataCopy
        if (ev.target.value != "") {
          var status = ev.target.value;
          if (status == 'ongoing') {
            this.procurementData = this.procurementData.filter(p => p.status != 'closed' && p.status != 'open' && p.status != 'canceled' && p.status != 'הזמנה פתוחה')
          } else if(status == 'material'){
            this.procurementData = this.procurementData.filter(p=>p.orderType == 'material')
          } else if(status == 'component'){
            this.procurementData = this.procurementData.filter(p=>p.orderType == 'component')
          } else {
            this.procurementData = this.procurementData.filter(p => p.status == status)
          }

        } else {
          this.procurementData = this.procurementDataCopy
        }
        break;
      default:

    }


  }

  setLinkDownlowd(id) {
    this.linkDownload = "http://peerpharmsystem.com/procurementOrderController/getpdf?_id=" + id;
  }
  setLinkDownlowdTwo(id) {
    this.linkDownload = "http://peerpharmsystem.com/procurementOrderController/getpdfTwo?_id=" + id;
  }


  updateArrivalDate(ev, orderNumber) {
    debugger;
    var arrivalDate = ev.target.value;

    var order = this.procurementData.find(o => o.orderNumber == orderNumber);
    order.validDate = arrivalDate

    this.procurementservice.updatePurchaseRemarks(order).subscribe(data => {
      if (data) {
        this.toastr.success('תאריך עודכן בהצלחה !')
        this.editRemarks('')
      }
    })

  }

  saveRecommendRemarks(purchase) {
    debugger;

    purchase.recommendRemarks = this.recommendRemarks.nativeElement.value;

    this.procurementservice.updateRecommendRemarks(purchase).subscribe(data => {
      debugger;
      if (data) {
        for (let i = 0; i < this.purchaseRecommendations.length; i++) {
          if (this.purchaseRecommendations[i].componentNumber == data.componentNumber && this.purchaseRecommendations[i].requestNumber == data.requestNumber) {
            this.purchaseRecommendations[i].recommendRemarks = data.recommendRemarks
            this.editRecommend('', '')
            this.toastr.success("הערה להמלצה עודכנה בהצלחה !")
          }

        }
      }

    })
  }

  saveOrderRemarks(order) {

    order.remarks = this.purchaseRemarks.nativeElement.value;
    this.procurementservice.updatePurchaseRemarks(order).subscribe(data => {
      if (data) {
        var purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
        purchase.remarks = data.remarks
        this.toastr.success('הערה עודכנה בהצלחה !')
        this.editRemarks('')
      }
    })
  }

  onSelectOrderBill(event, orderNumber) {
    debugger;
    var currOrder = this.procurementData.find(o => o.orderNumber == orderNumber)
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();



      reader.onload = (event) => { // called once readAsDataURL is completed

        currOrder.orderBill = event.target['result'];
        currOrder.orderBill = currOrder.orderBill.replace("data:application/pdf;base64,", "")
        // this.resMaterial.coaMaster = event.target["result"]
        // this.resMaterial.coaMaster=this.resMaterial.coaMaster.replace("data:application/pdf;base64,","");


        this.procurementservice.updatePdfFile(currOrder).subscribe(data => {
          if (data) {
            this.toastr.success("קובץ הועלה בהצלחה !")
          }
        })
      }

      reader.readAsDataURL(event.target.files[0]); // read file as data url
    }

  }

  onSelectSwift(event, orderNumber) {
    debugger
    var currOrder = this.procurementData.find(o => o.orderNumber == orderNumber)
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event) => { // called once readAsDataURL is completed

        currOrder.orderBill = event.target['result'];
        currOrder.orderBill = currOrder.orderBill.replace("data:application/pdf;base64,", "");
        // this.resMaterial.coaMaster = event.target["result"]
        // this.resMaterial.coaMaster=this.resMaterial.coaMaster.replace("data:application/pdf;base64,","");
        this.procurementservice.updatePdfFile(currOrder).subscribe(data => {
          if (data) {
            this.toastr.success("קובץ הועלה בהצלחה !")
          }
        });
      }

      reader.readAsDataURL(event.target.files[0]); // read file as data url


    }


  }

  changeStatus(ev, orderNumber) {
    var status = ev.target.value;

    if (status == 'orderPayedToSupplier' || status == 'timeToProduction' || status == 'expectedArrival') {
      this.showInfoModal = true;
      this.currStatus = ev.target.value;
      this.currOrderNumber = orderNumber
    } else {
      if (confirm("האם לעדכן סטטוס  ?")) {
        this.procurementservice.changeStatus(status, orderNumber).subscribe(data => {
          if (data) {
            this.getAllProcurementOrders();
            this.toastr.success("סטטוס עודכן בהצלחה !")
          } else {
            this.toastr.error('error')
          }
        })
      }

    }
  }

  addMoreInfo() {

    var status = this.currStatus + ' ' + this.infoToStatus
    var orderNumber = this.currOrderNumber
    this.procurementservice.changeStatus(status, orderNumber).subscribe(data => {
      if (data) {
        this.getAllProcurementOrders();
        this.toastr.success("סטטוס עודכן בהצלחה !")
        this.showInfoModal = false;
      } else {
        this.toastr.error('error')
      }
    })
  }

  changeStatusToDone(purchase) {
    debugger;
    this.user = this.authService.loggedInUser.firstName;
    if (this.user == "shanie" || this.user == "sima") {
      this.procurementservice.updateComponentPurchase(purchase).subscribe(data => {
        debugger;
        if (data) {
          for (let i = 0; i < this.purchaseRecommendations.length; i++) {
            if (this.purchaseRecommendations[i].componentNumber == data.componentNumber && this.purchaseRecommendations[i].requestNumber == data.requestNumber) {
              this.purchaseRecommendations[i].color = data.color
            }
          }
          this.toastr.success("סטטוס עודכן בהצלחה")
        }

      })
    } else {
      this.toastr.error("רק משתמש מורשה רשאי לערוך זאת")
    }

  }

  findInInventory(componentN) {

    location.href = 'http://peerpharmsystem.com/#/peerpharm/inventory/stock?componentN=' + componentN

  }

  sortTable(typeOfSort) {
    debugger;
    switch (typeOfSort) {
      case 'supplier':
        this.purchaseRecommendations = this.arrayService.sortByAttribute(this.purchaseRecommendations, 'supplierName')
        break;
      case 'date':
        this.purchaseRecommendations = this.arrayService.sortByAttribute(this.purchaseRecommendations, 'date')
        break;
      case 'ordered':
        this.purchaseRecommendations = this.arrayService.sortByAttribute(this.purchaseRecommendations, 'color')
        break;
      case 'itemNumber':
        this.purchaseRecommendations = this.arrayService.sortByAttribute(this.purchaseRecommendations, 'componentNumber')
        break;

    }
  }
  printOrder(line) {
    debugger;
    this.showImage = false;
    var supplierNumber = line.supplierNumber
    this.supplierService.getSuppliersByNumber(supplierNumber).subscribe(data => {
      debugger;
      this.currentSupplier = data[0]
    })
    this.printBill = true;
    this.currentOrder = line;
    this.currentItems = line.item
    var total = 0;
    var totalP = 0;
    var coin = "";

    for (let i = 0; i < this.currentItems.length; i++) {

      if(this.currentItems[i].itemPrice == 0) this.currentItems[i].itemPrice = Number(this.currentItems[i].supplierAmount)*Number(this.currentItems[i].supplierPrice)
      total = total + Number(this.currentItems[i].supplierAmount)
      totalP = totalP + Number(this.currentItems[i].itemPrice)
      coin = this.currentItems[i].coin
      if(line.orderType == 'component'){
        this.showImage = true;
        this.inventoryService.getCmptByNumber(this.currentItems[i].itemNumber,'component').subscribe(data=>{
          debugger;
         this.currentItems[i].img = data[0].img
        })
      }

    }
    

    this.importantRemarks = line.remarks
    
    
    var num = this.formatNumber(total)
    var numTwo = this.formatNumber(totalP)
    var numThree = this.formatNumber(totalP*17/100);
  
    this.totalAmount = num
    this.totalPrice = numTwo
    this.priceTaxes = numThree
    var combined = ((totalP*17/100) + totalP)
    var numFour = this.formatNumber(combined)
    this.totalPriceWithTaxes = numFour

    this.currCoin = coin
    this.orderDate = line.outDate.slice(0, 10)
    if (line.outOfCountry == false) {
      this.outOfCountry = "Payment Terms:Current+95 Days"
    }
  }

  sendOrder(line) {
    debugger;
    this.procurementservice.sendOrderToSupplier(line).subscribe(data => {

    })
  }

  printReciept() {
    debugger;
    this.referNumberForReciept;

    var tempArr = []
    var obj = {
      itemNumber: '',
      comaxNumber: '',
      referenceNumber: '',
      arrivedAmount: '',
      arrivalDate: ''

    }
    for (let i = 0; i < this.procurementArrivals.length; i++) {
      for (let j = 0; j < this.procurementArrivals[i].arrivals.length; j++) {
        if (Number(this.procurementArrivals[i].arrivals[j].referenceNumber) == this.referNumberForReciept) {

          obj.itemNumber = this.procurementArrivals[i].itemNumber
          obj.comaxNumber = this.procurementArrivals[i].comaxNumber
          obj.referenceNumber = this.procurementArrivals[i].arrivals[j].referenceNumber
          obj.arrivedAmount = this.procurementArrivals[i].arrivals[j].arrivedAmount
          obj.arrivalDate = this.procurementArrivals[i].arrivals[j].arrivalDate
          var objectToPush = { ...obj }
          tempArr.push(objectToPush)

        }
      }
    }

    tempArr
    this.procurementData;
    for (let i = 0; i < tempArr.length; i++) {
      for (let j = 0; j < this.procurementData.length; j++) {
        for (let k = 0; k < this.procurementData[j].item.length; k++) {
          if (tempArr[i].comaxNumber == this.procurementData[j].comaxNumber) {
            if (tempArr[i].itemNumber == this.procurementData[j].item[k].itemNumber) {
              var price = this.procurementData[j].item[k].supplierPrice + this.procurementData[j].item[k].coin
              tempArr[i].price = price
            }

          }
        }
      }
    }
    this.billToPrint = tempArr
    this.bill = true;
  }

  formatNumber(number) {
    number = number.toFixed(2) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  searchBySupplier(ev) {

    var supplierName = ev.target.value;
    if (supplierName != "") {
      var tempArr = this.procurementData.filter(purchase => purchase.supplierName.includes(supplierName))
      this.procurementData = tempArr
    } else {
      this.procurementData = this.procurementDataCopy
    }

  }

  searchByReference(ev) {

    var referenceNumber = ev.target.value;
    var tempArr = []
    if (referenceNumber != "") {
      for (let i = 0; i < this.procurementData.length; i++) {
        for (let j = 0; j < this.procurementData[i].item.length; j++) {
          if (this.procurementData[i].item[j].referenceNumber == referenceNumber) {
            tempArr.push(this.procurementData[i])
          }

        }

      }
      this.procurementData = tempArr
    } else {
      this.procurementData = this.procurementDataCopy
    }

  }

  addNewItem() {
    debugger;
    this.newItem.orderNumber = this.orderData[0].orderNumber;
    this.newItem.itemPrice = Number(this.newItem.supplierAmount) * Number(this.newItem.supplierPrice);
    var itemObject = { ...this.newItem }
    this.procurementservice.addItemToProcurement(itemObject).subscribe(data => {
      debugger;
      if (data) {
        this.orderData[0].item.push(itemObject);
        this.toastr.success("פריט נוסף בהצלחה !")
        this.clearNewItem();

      }
    })
    this.orderData
  }

  searchByItem(ev) {
  debugger;
    var itemNumber = ev.target.value;
    var tempArr = []
    if (itemNumber != "") {
      for (let i = 0; i < this.procurementData.length; i++) {
        for (let j = 0; j < this.procurementData[i].item.length; j++) {
          if (this.procurementData[i].item[j].itemNumber == itemNumber) {
            tempArr.push(this.procurementData[i])
          }

        }

      }
      this.procurementData = tempArr
    } else {
      this.procurementData = this.procurementDataCopy
    }

  }


  getComponentsWithPurchaseRec() {
    this.procurementservice.componentsWithPurchaseRec().subscribe(data => {
      this.purchaseRecommendations = data;
      this.purchaseRecommendationsCopy = data;
    })
  }

  clearNewItem() {
    this.newItem.itemNumber = '',
      this.newItem.itemName = '',
      this.newItem.coin = '',
      this.newItem.measurement = '',
      this.newItem.supplierPrice = '',
      this.newItem.supplierAmount = '',
      this.newItem.color = '',
      this.newItem.orderNumber = '',
      this.newItem.itemRemarks = '',
      this.newItem.itemPrice = 0,
      this.newItem.remarks = ''
  }


  dateChange() {
    debugger;
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "") {

      this.procurementservice.getProcurementOrderItemByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data => {
        this.procurementData = data;
        this.procurementDataCopy = data;
      })
    } else {
      this.getAllProcurementOrders()
    }

  }

  searchNumber(ev) {

    if (ev.target.value == "") {
      this.getAllProcurementOrders();
    }

    let word = ev.target.value;
    let wordsArr = word.split(" ");
    wordsArr = wordsArr.filter(x => x != "");
    if (wordsArr.length > 0) {

      let tempArr = [];
      this.procurementData.filter(x => {

        var check = false;
        var matchAllArr = 0;
        wordsArr.forEach(w => {

          if (x.orderNumber == w) {
            matchAllArr++
          }
          (matchAllArr == wordsArr.length) ? check = true : check = false;
        });

        if (!tempArr.includes(x) && check) tempArr.push(x);
      });
      this.procurementData = tempArr;


    } else {

      this.procurementData = this.procurementDataCopy.slice();
    }
  }

  exportAsXLSX(expression): void {

    switch (expression) {
      case 'purchaseData':
        this.excelService.exportAsExcelFile(this.procurementData, 'data');
        break;
      case 'purchaseRecommendations':
        this.excelService.exportAsExcelFile(this.purchaseRecommendations, 'data');
        break;
      case 'purchaseArrivals':
        this.excelService.exportAsExcelFile(this.procurementArrivals, 'data');
        break;
      case 'billsToCheck':
        this.excelService.exportAsExcelFile(this.certificate, 'data');
        break;
      default:

    }

  }


  getAllSuppliers() {
    this.supplierService.getSuppliersDiffCollection().subscribe(data => {
      this.allSuppliers = data;
    })
  }


  viewOrderDetails(index) {

    debugger;
    this.orderDetailsModal = true;
    var order = [];
    order.push(this.procurementData[index])

    this.orderData = order
  }
  editArrivalDetails(index) {

    debugger;
    this.editArrivalModal = true;
    var order = [];
    order.push(this.procurementArrivals[index])


    this.arrivalData = order
    this.arrivalData[0].index = index;
  }

  addReferenceDetails(arrival) {
    debugger;
    this.newReference.orderId = arrival.id
    this.newReference.itemNumber = arrival.itemNumber
    this.procurementservice.updatePurchaseOrder(this.newReference).subscribe(data => {

      if (data.msg == 'referenceExist') {
        this.toastr.error('Reference Number Exist')
      } else {
        debugger;
        for (let i = 0; i < this.procurementArrivals.length; i++) {

          if (this.procurementArrivals[i].id == data._id) {
            for (let k = 0; k < data.item.length; k++) {
              if (this.procurementArrivals[i].itemNumber == data.item[k].itemNumber) {
                this.procurementArrivals[this.arrivalData[0].index].arrivals = data.item[k].arrivals
                this.getAllProcurementOrders();
                this.editArrivalModal = false;
                this.toastr.success("עודכן בהצלחה !")
                this.newReference.arrivalDate = ''
                this.newReference.arrivedAmount = ''
                this.newReference.itemNumber = ''
                this.newReference.referenceNumber = ''
              }
            }

          }
        }
      }
    })

  }

  cancelOrder(orderNumber) {
    if (confirm("האם לבטל הזמנה זו ?")) {
      this.procurementservice.cancelOrder(orderNumber).subscribe(data => {
        debugger
        if (data) {
          this.procurementData = data;
          this.toastr.success("הזמנה בוטלה !")
        } else {
          this.toastr.error('error')
        }

      })
    }

  }

  orderSentToClient(orderNumber) {
    if (confirm("האם לעדכן סטטוס נשלח ללקוח ?")) {
      this.procurementservice.orderSentToClient(orderNumber).subscribe(data => {
        if (data) {
          this.procurementData = data;
          this.toastr.success("סטטוס 'נשלח ללקוח' עודכן בהצלחה !")
        } else {
          this.toastr.error('error')
        }
      })
    }
  }

  clientGotTheOrder(orderNumber) {
    if (confirm("האם לעדכן סטטוס הזמנה הגיעה ללקוח ?")) {
      this.procurementservice.clientGotTheOrder(orderNumber).subscribe(data => {
        if (data) {
          this.procurementData = data;
          this.toastr.success("סטטוס 'הזמנה הגיעה ללקוח' עודכן בהצלחה !")
        } else {
          this.toastr.error('error')
        }
      })
    }
  }

  closeOrder(ev, orderNumber) {
    var reason = ev.target.value;
    if (confirm("האם לסגור הזמנה זו  ?")) {
      this.procurementservice.closeOrder(orderNumber, reason).subscribe(data => {
        if (data) {
          this.procurementData = data;
          this.toastr.success("סטטוס 'הזמנה סגורה' עודכן בהצלחה !")
        } else {
          this.toastr.error('error')
        }
      })
    }
  }

  deleteFromOrder(itemNumber, orderNumber) {
    if (confirm("האם למחוק פריט מספר " + itemNumber)) {
      this.procurementservice.deleteItemFromOrder(itemNumber, orderNumber).subscribe(data => {
        debugger;
        if (data) {
        for (let i = 0; i < this.procurementData.length; i++) {
          for (let j = 0; j < this.procurementData[i].item.length; j++) {
            if(this.procurementData[i].orderNumber == orderNumber){
              if(this.procurementData[i].item[j].itemNumber == itemNumber){
                this.procurementData[i].item.splice(j,1)
              }
            }
          } 
        }
          this.toastr.success("פריט נמחק בהצלחה")
          
          

        }
      })
    }

  }

  checkIfArrived(itemNumber, orderNumber, index) {
    debugger;

    var orderAmount = this.orderAmount.nativeElement.value;
    var supplierPrice = this.supplierPrice.nativeElement.value;
    var itemRemarks = this.itemRemarks.nativeElement.value;
    var orderCoin = this.orderCoin.nativeElement.value;


    debugger;
    this.orderData
    if (confirm("האם לשנות?") == true) {
      this.procurementservice.changeColor(itemNumber, orderNumber, orderAmount, supplierPrice,itemRemarks,orderCoin).subscribe(data => {
        debugger
        for (let i = 0; i < this.procurementData.length; i++) {
          if (this.procurementData[i].orderNumber == orderNumber) {

            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].supplierPrice = supplierPrice
            this.procurementData[i].item[index].itemRemarks = itemRemarks
            this.procurementData[i].item[index].coin = orderCoin

            this.toastr.success(" עודכן בהצלחה !")
            this.edit('');

          }

        }

      })
    } else {

    }


  }

}
