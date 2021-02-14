import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { ArrayServiceService } from 'src/app/utils/array-service.service';
import { PurchaseData } from './PurchaseData';
//import { p } from '@angular/core/src/render3';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.scss']
})

export class ProcurementOrdersComponent implements OnInit {


  linkDownload: String = '';
  paymentRemark: String
  orderRemarks: String;
  myRefresh: any = null;
  allComponents: any[];
  allInvoices: any[];
  allInvoicesCopy: any[];
  purchaseRecommendations: any[];
  purchaseRecommendationsCopy: any[];
  allComponentsCopy: any[];
  allMaterials: any[];
  selectedArr: any[] = [];
  printBill: boolean = false;
  orderDetailsModal: boolean = false;
  newPurchaseModal: boolean = false;
  purchaseRecommendationsModal: boolean = false;
  showImage: boolean = false;
  showLoader: boolean = true;
  showInfoModal: boolean = false;
  editArrivalModal: boolean = false;
  changeItemQuantity: boolean = false;
  paymentRemarkModal: boolean = false;
  invoiceModal: boolean = false;
  changeItemPrice: boolean = false;
  bill: boolean = false;
  procurementData: any[];
  procurementDataNoFilter: any[];
  procurementDataCopy: any[];
  procurementArrivals: any[] = []
  procurementArrivalsCopy: any[] = []
  currentOrder: any[];
  currentItems: any[];
  certificate: any[];
  allSuppliers: any[];
  billToPrint: any[];
  currentSupplier: any;
  purchaseData: PurchaseData[];
  arrivalData: any[];
  EditRowId: any = "";
  EditRowIndex: any = "";
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
  totalPriceWithTaxes: any;
  currCoin: any;
  filterStatus: any;
  importantRemarks: any;
  orderDate: any;
  outOfCountry: any;
  country: boolean = false;
  newRecommend: any;
  subscription: Subscription;
  isEdit: boolean = false;

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
    user: ''
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
  @ViewChild('printBillBtn') printBillBtn: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('', '');
    this.editRecommend('', '')
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent): void {

    if (event.key === 'F2') {
      if (this.newPurchaseModal == true) {
        this.newPurchaseModal = false;
      } else {
        this.newPurchaseModal = true;
      }
    }
    if (event.key === 'F4') {
      if (this.purchaseRecommendationsModal == true) {
        this.purchaseRecommendationsModal = false;
      } else {
        this.purchaseRecommendationsModal = true;
      }
    }
  }

  constructor(
    private toastr: ToastrService, private procurementservice: Procurementservice, private excelService: ExcelService, private supplierService: SuppliersService,
    private inventoryService: InventoryService, private authService: AuthService, private arrayService: ArrayServiceService,
  ) { }

  ngOnInit() {
    console.log('Enter');
    this.getAllProcurementOrders();
    this.getAllPurchaseRecommends();
    this.getAllSuppliers();
    this.user = this.authService.loggedInUser.firstName;

    this.inventoryService.newRecommendEmitter.subscribe(data => {
      debugger;
      console.log(data)
      data = JSON.parse(data._body)
      this.purchaseRecommendations.push(data)

    })

  }




  moveToNewPurchase(id, type) {
    if (type == 'single') {
      window.open('http://peerpharmsystem.com/#/peerpharm/procurement/newProcurement?id=' + id)
      // window.open('http://localhost:4200/#/peerpharm/procurement/newProcurement?id='+id)
    } else {
      window.open('http://localhost:4200/#/peerpharm/procurement/newProcurement?multi=' + this.selectedArr)
    }
  }

  setRecommendAsDone(id) {
    this.procurementservice.closeRecommendationById(id).subscribe(data => {
      if (data) {
        this.toastr.success('המלצת רכש נסגרה בהצלחה !');
        this.purchaseRecommendations = this.purchaseRecommendations.filter(p => p._id != data._id)
        this.purchaseRecommendationsCopy = this.purchaseRecommendationsCopy.filter(p => p._id != data._id)
      }
    })
  }

  //open in excel
  loadPurchasesItems() {
    var tempArr = []
    for (let i = 0; i < this.procurementData.length; i++) {
      for (let j = 0; j < this.procurementData[i].item.length; j++) {
        this.procurementData[i].item[j].supplier = this.procurementData[i].supplierName
        tempArr.push(this.procurementData[i].item[j])
      }
    }
    this.excelService.exportAsExcelFile(tempArr, 'data');
  }

  stopInterval() {
    clearInterval(this.myRefresh)
  }

  startInterval() {
    this.myRefresh = setInterval(() => { this.getAllProcurementOrders(); }, 1000 * 60 * 3);
  }

  filterRecByType(ev) {
    let type = ev.target.value;
    switch (type) {
      case 'all':
        this.purchaseRecommendations = this.purchaseRecommendationsCopy
        break;
      case 'components':
        this.purchaseRecommendations = this.purchaseRecommendationsCopy.filter(p => p.type == 'component')
        break;
      case 'materials':
        this.purchaseRecommendations = this.purchaseRecommendationsCopy.filter(p => p.type == 'material')
        break;
    }
  }

  filterRecByNumber(ev) {
    let number = ev.target.value
    if (number != '') {
      this.purchaseRecommendations = this.purchaseRecommendationsCopy.filter(p => p.componentNumber == number)
    } else {
      this.purchaseRecommendations = this.purchaseRecommendationsCopy;
    }
  }

  getAllProcurementOrders() {
    this.newPurchaseModal = false;

    this.procurementservice.getProcurementOrder().subscribe(res => {

      this.procurementData = res.filter(p => p.status != 'closed');
      if (this.procurementData.length > 0) {
        this.showLoader = false;
      }

      this.procurementDataCopy = res
      this.procurementDataNoFilter = res


  
    });
  }

  edit(itemNumber, index) {
    if (itemNumber != '') {
      this.EditRowIndex = index
      this.EditRowId = itemNumber;
    } else {
      this.EditRowId = '';
      this.EditRowIndex = ''
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

  filterByCategory(ev) {
    debugger;
    var category = ev.target.value;

    var tempArr = [];
    if (category != '') {
      this.procurementData.forEach(purchase => {
        purchase.item.forEach(item => {
          if (item.componentType == category) {
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

        if (ev.target.value != "") {
          var status = ev.target.value;
          this.filterStatus = ev.target.value;
          if (status == 'ongoing') {
            this.procurementData = this.procurementDataCopy
            this.procurementData = this.procurementData.filter(p => p.status != 'closed' && p.status != 'open' && p.status != 'canceled' && p.status != 'הזמנה פתוחה')
          } else if (status == 'material') {
            this.procurementData = this.procurementDataCopy
            this.procurementData = this.procurementData.filter(p => p.orderType == 'material')
          } else if (status == 'component') {
            this.procurementData = this.procurementDataCopy
            this.procurementData = this.procurementData.filter(p => p.orderType == 'component')
          } else if (status == 'allOrders') {
            this.procurementData = this.procurementDataNoFilter
          } else if (status == 'open') {
            this.procurementData = this.procurementDataCopy
            this.procurementData = this.procurementData.filter(p => p.status == 'open' && p.status == 'הזמנה פתוחה')
          }
          else {
            this.procurementData = this.procurementDataNoFilter
            this.procurementData = this.procurementData.filter(p => p.status == 'closed')
          }

        } else {

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
            let purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber);
            purchase.color = data.color;
            purchase.status = data.status
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
      if (this.currentSupplier.import == 'outOfIsrael') {
        this.country = true;

      } else if (this.currentSupplier.import != 'outOfIsrael' && (line.stockitems[0].coin).toLowerCase() != 'nis') {
        this.country = true;

      } else {
        this.country = false;
      }
    })

    this.currentOrder = line;
    this.currentItems = line.stockitems
    var total = 0;
    var totalP = 0;

    var coin = "";

    for (let i = 0; i < this.currentItems.length; i++) {

      if (this.currentItems[i].itemPrice == 0) this.currentItems[i].itemPrice = Number(this.currentItems[i].supplierAmount) * Number(this.currentItems[i].supplierPrice)
      total = total + Number(this.currentItems[i].supplierAmount)

      totalP = totalP + Number(this.currentItems[i].itemPrice)

      coin = this.currentItems[0].coin
      if (line.orderType == 'component') {
        this.showImage = true;
        this.inventoryService.getCmptByNumber(this.currentItems[i].number, 'component').subscribe(data => {
          debugger;
          this.currentItems[i].img = data[0].img
        })
      }

    }


    this.importantRemarks = line.remarks


    var num = this.formatNumber(total)
    var numTwo = this.formatNumber(totalP)
    var numThree = this.formatNumber(totalP * 17 / 100);

    this.totalAmount = num
    this.totalPrice = numTwo
    this.priceTaxes = numThree
    var combined = ((totalP * 17 / 100) + totalP)
    var numFour = this.formatNumber(combined)
    this.totalPriceWithTaxes = numFour
    if (coin == 'nis') {
      this.currCoin = '\u20AA'
    }
    if (coin == 'eur') {
      this.currCoin = '\u20ac'
    }
    if (coin == 'usd') {
      this.currCoin = '$'
    }

    this.orderDate = line.outDate.slice(0, 10)
    this.printBill = true;

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
    debugger

    var supplierName = ev.target.value;
    if (supplierName != "") {
      this.procurementDataCopy = this.procurementData
      var tempArr = this.procurementData.filter(purchase => purchase.supplierName.includes(supplierName))
      this.procurementData = tempArr
    } else {
      this.procurementData = this.procurementDataCopy
    }

  }

  itemStatusDone(itemNumber, orderNumber) {
    this.procurementservice.setItemToDone({ itemNumber: itemNumber, orderNumber: orderNumber }).subscribe(data => {
      debugger;
      if (data) {
        var purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
        var item = purchase.item.find(i => i.itemNumber == itemNumber)
        item.color = 'lightgreen'
        purchase.color = 'orange'
        this.toastr.success('פריט עודכן בהצלחה !')
      }
    })

  }




  addNewItem() {
    debugger;
    this.newItem.orderNumber = this.purchaseData[0].orderNumber;
    this.newItem.itemPrice = Number(this.newItem.supplierAmount) * Number(this.newItem.supplierPrice);
    var itemObject = { ...this.newItem }
    this.procurementservice.addItemToProcurement(itemObject).subscribe(data => {
      debugger;
      if (data) {
        this.purchaseData[0].stockitems.push(itemObject);
        this.toastr.success("פריט נוסף בהצלחה !")
        this.clearNewItem();

      }
    })


  }

  searchByItem(ev) {
    debugger;
    var itemNumber = ev.target.value;
    var tempArr = []
    this.procurementData = this.procurementDataNoFilter
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
      if (this.filterStatus == 'ongoing') {
        this.procurementData = this.procurementDataCopy.filter(p => p.status != 'closed' && p.status != 'open' && p.status != 'canceled' && p.status != 'הזמנה פתוחה')
      } else if (this.filterStatus == undefined) {
        this.procurementData = this.procurementDataCopy
      } else if (this.filterStatus == 'allOrders') {
        this.procurementData = this.procurementDataNoFilter;
      } else {
        this.procurementData = this.procurementDataCopy.filter(p => p.status != 'closed')
      }

    }

  }


  getAllPurchaseRecommends() {
    this.procurementservice.getAllPurchaseRecommends().subscribe(data => {
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

  filterByComponent(ev) {
    var componentN = ev.target.value;
    if (componentN != "") {
      this.inventoryService.getCmptByitemNumber(componentN).subscribe(data => {

        this.purchaseRecommendations = data[0].purchaseRecommendations
      })
    } else {
      this.purchaseRecommendations = this.purchaseRecommendationsCopy
    }
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
      this.procurementData = this.procurementDataCopy
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

      this.procurementData = this.procurementDataNoFilter
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
    this.isEdit = true;
    this.orderDetailsModal = true;
    this.purchaseData = this.procurementData[index]
  }

  editArrivalDetails(index) {
    this.editArrivalModal = true;
    var order = [];
    order.push(this.procurementArrivals[index])
    this.arrivalData = order
    this.arrivalData[0].index = index;
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
    if (reason != 'open') {
      if (confirm("האם לסגור הזמנה זו  ?")) {
        this.procurementservice.closeOrder(orderNumber, reason).subscribe(data => {
          if (data) {
            debugger;
            let purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
            if (purchase) {
              purchase.status = data.status;
              purchase.color = data.color
            }
            this.toastr.success("סטטוס 'הזמנה סגורה' עודכן בהצלחה !")
          } else {
            this.toastr.error('error')
          }
        })
      }
    } else {
      if (confirm("האם לפתוח הזמנה זו  ?")) {
        this.procurementservice.closeOrder(orderNumber, reason).subscribe(data => {
          if (data) {
            let purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
            if (purchase) {
              purchase.status = data.status;
              purchase.color = data.color
            }
            this.toastr.success("סטטוס 'הזמנה סגורה' עודכן בהצלחה !")
          } else {
            this.toastr.error('error')
          }
        })
      }
    }

  }

  deleteFromOrder(itemNumber, orderNumber) {
    if (confirm("האם למחוק פריט מספר " + itemNumber)) {
      this.procurementservice.deleteItemFromOrder(itemNumber, orderNumber).subscribe(data => {
        debugger;
        if (data) {
          for (let i = 0; i < this.procurementData.length; i++) {
            for (let j = 0; j < this.procurementData[i].item.length; j++) {
              if (this.procurementData[i].orderNumber == orderNumber) {
                if (this.procurementData[i].item[j].itemNumber == itemNumber) {
                  this.procurementData[i].item.splice(j, 1)
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


    if (confirm("האם לשנות?") == true) {
      this.procurementservice.changeColor(itemNumber, orderNumber, orderAmount, supplierPrice, itemRemarks, orderCoin, index).subscribe(data => {
        debugger
        for (let i = 0; i < this.procurementData.length; i++) {
          if (this.procurementData[i].orderNumber == orderNumber) {

            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].supplierPrice = supplierPrice
            this.procurementData[i].item[index].itemRemarks = itemRemarks
            this.procurementData[i].item[index].coin = orderCoin

            this.toastr.success(" עודכן בהצלחה !")
            this.edit('', '');

          }

        }

      })
    } else {

    }


  }

}


























    // filterPurchases(event, type) {
    //   switch (type) {
    //     case 'supplier':
    //       if (event.target.value != '') {
    //         this.procurementArrivals = []
    //         this.procurementArrivalsCopy = []
    //         var tempArr = this.procurementDataCopy.filter(p => p.supplierNumber == event.target.value && p.status != 'canceled');
    //         for (let i = 0; i < tempArr.length; i++) {
    //           for (let j = 0; j < tempArr[i].item.length; j++) {
    //             var obj = {
    //               id: tempArr[i]._id,
    //               supplierName: tempArr[i].supplierName,
    //               comaxNumber: tempArr[i].comaxNumber,
    //               orderNumber: tempArr[i].orderNumber,
    //               orderDate: tempArr[i].outDate,
    //               arrivedAmount: tempArr[i].item[j].arrivedAmount,
    //               itemNumber: tempArr[i].item[j].itemNumber,
    //               itemName: tempArr[i].item[j].itemName,
    //               supplierAmount: tempArr[i].item[j].supplierAmount,
    //               arrivals: [],
    //             }
    //             if (tempArr[i].item[j].arrivals) {
    //               for (let k = 0; k < tempArr[i].item[j].arrivals.length; k++) {
    //                 var arrival = {
    //                   referenceNumber: tempArr[i].item[j].arrivals[k].referenceNumber,
    //                   arrivalDate: tempArr[i].item[j].arrivals[k].arrivalDate,
    //                   arrivedAmount: tempArr[i].item[j].arrivals[k].arrivedAmount
    //                 }
    //                 obj.arrivals.push(arrival)
    //               }
    //             }
    //             this.procurementArrivals.push(obj)
    //             this.procurementArrivalsCopy.push(obj)
    //           }
    //         }
    //       } else {
    //         this.procurementArrivals = []
    //         this.procurementArrivalsCopy = []
    //       }
    //       break;
    //     case 'itemNumber':
    //       var tempArr = [...this.procurementArrivals];
    //       if (event.target.value != '') {
    //         this.procurementArrivals = tempArr.filter(p => p.itemNumber == event.target.value)
    //       } else {
    //         this.procurementArrivals = this.procurementArrivalsCopy
    //       }
    //       break;
    //     case 'orderNumber':
    //       var tempArr = [...this.procurementArrivals];
    //       if (event.target.value != '') {
    //         this.procurementArrivals = tempArr.filter(p => p.orderNumber == event.target.value)
    //       } else {
    //         this.procurementArrivals = this.procurementArrivalsCopy
    //       }
    //       break;
    //   }
    // }
