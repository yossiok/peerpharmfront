import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { ArrayServiceService } from 'src/app/utils/array-service.service';
import { PurchaseData } from './PurchaseData';
import { ActivatedRoute } from '@angular/router';
import { Currencies } from '../Currencies';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.scss']
})

export class ProcurementOrdersComponent implements OnInit {

  @ViewChild('arrivedAmount') arrivedAmount: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;
  @ViewChild('orderAmount') orderAmount: ElementRef;
  @ViewChild('orderCoin') orderCoin: ElementRef;
  @ViewChild('referenceNumber') referenceNumber: ElementRef;
  @ViewChild('arrivalDate') arrivalDate: ElementRef;
  @ViewChild('recommendRemarks') recommendRemarks: ElementRef;
  @ViewChild('supplierPrice') supplierPrice: ElementRef;
  @ViewChild('expectedDate') expectedDate: ElementRef;
  @ViewChild('printRecommendBtn') printRecommendBtn: ElementRef;
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
  @ViewChild('purchaseRemarks') purchaseRemarks: ElementRef;
  @ViewChild('purchaseArrivalDate') purchaseArrivalDate: ElementRef;
  @ViewChild('printBillBtn') printBillBtn: ElementRef;
  @ViewChild('updateCurrencies') updateCurrencies: ElementRef;


  linkDownload: String = '';
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
  totalAmount: number = 0
  priceTaxes: any;
  totalPrice: number = 0
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
  currencies: Currencies
  EditRowId: any = "";
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
  totalPriceNis: number = 0
  printSum: boolean = false
  nisSymbol: string = '\u20AA'
  usdSymbol: string = '$'
  eurSymbol: string = '\u20AC'
  gbpSymbol: string = '\u00A3'
  loadingRecommendations: boolean;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    // this.edit('', '');
    // this.editRecommend('', '')
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'F2') {
      if (this.orderDetailsModal == true) {
        this.orderDetailsModal = false;
      } else {
        this.orderDetailsModal = true;
      }
    }

    if (event.key === 'F8') {
      this.modalService.open(this.updateCurrencies)
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
    private inventoryService: InventoryService, private authService: AuthService, private arrayService: ArrayServiceService, private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getCurrencies()
    this.getAllPurchaseRecommends();
    this.getAllSuppliers();
    this.user = this.authService.loggedInUser.firstName;
    this.inventoryService.newRecommendEmitter.subscribe(data => {
      console.log(data)
      this.purchaseRecommendations.push(data)
    })
    this.getAllProcurementOrders();
  }

  getCurrencies(): void {
    this.procurementservice.getCurrencies().subscribe(currencies => {
      delete currencies[0]._id
      this.currencies = currencies[0]
    })
  }

  setCurrencies() {
    this.procurementservice.setCurrencies(this.currencies).subscribe(res => {
      if (res.error) this.toastr.error(res.error)
      else {
        delete res._id
        this.toastr.info(`שערים שנשמרו: ${JSON.stringify(res)}`)
      }
    })
  }

  getAllProcurementOrders() {
    this.orderDetailsModal = false;
    this.fetchingOrders = true;
    this.procurementservice.getAllPurchasesObservable().subscribe((purchases) => {
      if (purchases.length > 0) {
        this.showLoader = false;
        if (this.procurementData) this.procurementData = this.procurementData.concat([...purchases]).filter(order => order.status != 'closed');
        else this.procurementData = purchases;

        if (!this.procurementDataCopy) {
          this.procurementDataCopy = [];
        }
        this.procurementDataCopy = this.procurementDataCopy.concat([...purchases]).filter(purchase => purchase.status != 'canceled');
      }
    }, () => { }, () => {
      this.fetchingOrders = false
      if (this.procurementData.length > 0) {

        this.procurementData.forEach(pd => {
          if (pd.status == 'open') {
            pd.stockitems.forEach(si => {
              if (si.recommendationnum) {
                let pr = this.purchaseRecommendations.find(x => x.recommendNumber == si.recommendationnum)
                if (pr) {
                  let prsi = pr.stockitems.find(y => y.number == si.number)
                  if (prsi) prsi.remarks = "open order exists from date:" + new Date(pd.creationDate).toLocaleDateString() + " order: " + pd.orderNumber;
                }
              }
            });
          }

        })
      }

      this.route.queryParams.subscribe(params => {
        if (params['orderNumber']) {
          for (let i = 1; i < this.procurementData.length; i++) {
            if (this.procurementData[i].orderNumber == params['orderNumber']) {
              this.viewOrderDetails(i);
            }
          }

        }

      });

    });
  }

  closePurchaseRequestsModal() {
    this.purchaseRecommendationsModal = false;
    this.purchaseRecommendations.forEach(pr => {
      pr.stockitems.forEach(si => {
        si.color = si.color == 'lightgreen' ? "lightgreen" : '';
      });
    });
  }

  isSelected(ev, stockitem) {
    if (ev.target.checked == true) {
      stockitem.price = stockitem.lastorder.price;
      stockitem.recommendationnum = ev.target.title;
      this.checkedRecommendations.push(stockitem);
      //check if this supplier is also in other purchase reccomendations
      this.purchaseRecommendations.forEach(pr => {
        pr.stockitems.forEach(si => {
          if (si.lastorder.supplierName == stockitem.lastorder.supplierName && si.color != 'lightgreen')
            si.color = "yellow";
        });
      });
    }
    else {
      this.purchaseRecommendations.forEach(pr => {
        pr.stockitems.forEach(si => {
          if (si.lastorder.supplierName == stockitem.lastorder.supplierName && si.color != 'lightgreen')
            si.color = "";
        });
      });
      for (let i = 0; i < this.checkedRecommendations.length; i++) {
        if (this.checkedRecommendations[i].itemNumber == stockitem.itemNumber) this.checkedRecommendations.slice(i, 1)
      }
    }
  }

  expandRecommend(recommendNumber) {
    this.recommendStockItemsCollapse = !this.recommendStockItemsCollapse
    this.expandNumber = this.recommendStockItemsCollapse ? '' : recommendNumber
  }

  moveToNewPurchase() {
    let result = confirm('are you sure you want to create a new order?');
    if (result) {
      this.purchaseRecommendationsModal = false;
      this.requestToPurchase = { 
        type: this.checkedRecommendations[0].type,
        supplierName: this.checkedRecommendations[0].lastorder.supplierName,
        supplierNumber: this.checkedRecommendations[0].lastorder.supplierNumber,
        stockitems: this.checkedRecommendations 
      }
      this.orderDetailsModal = true;
    }

  }

  checkRecommendedOrderedItems() {
    if (this.checkedRecommendations && this.checkedRecommendations.length > 0) {
      for (let item of this.checkedRecommendations) {
        this.procurementservice.checkRecommendationItemAsOrdered(item.number, item.recommendationnum).subscribe(updatedRecommend => {
          console.log(updatedRecommend)
        })
      }
      this.getAllPurchaseRecommends();
    }
  }

  deletePurchaseRequest(recommendationNumber) {
    if (confirm(`בקשה מספר ${recommendationNumber} תימחק לצמיתות. האם להמשיך?`)) {
      this.purchaseRecommendations = []
      this.procurementservice.deletePurchaseRequest(recommendationNumber).subscribe(deleteResult => {
        console.log(deleteResult)
        this.getAllPurchaseRecommends()
      })
    }
  }

  //open in excel
  loadPurchasesItems() {
    var tempArr = []
    for (let i = 0; i < this.procurementData.length; i++) {
      for (let j = 0; j < this.procurementData[i].stockitems.length; j++) {
        this.procurementData[i].stockitems[j].supplier = this.procurementData[i].supplierName
        tempArr.push(this.procurementData[i].stockitems[j])
      }
    }
    this.excelService.exportAsExcelFile(tempArr, 'data');
  }

  async newProcurementSaved(e) {
    debugger
    this.showLoader = e;
    await this.checkRecommendedOrderedItems();
    this.getAllProcurementOrders();
  }

  closeOrderModal(e) {
    this.orderDetailsModal = e;
    this.isEdit = e;
    this.requestToPurchase = null;
    this.purchaseData = null;
    this.checkedRecommendations = []
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


  filterByCategory(ev) {
    var category = ev.target.value;
    this.procurementData = this.procurementDataCopy.filter(order => {
      for (let item of order.stockitems) {
        if (item.componentType == category) return true
      }
    })

  }

  filterByItemType(ev) {
    var type = ev.target.value;
    if (type == 'all') this.procurementData = this.procurementDataCopy.filter(p => p.status == 'open' || p.status == 'הזמנה פתוחה')
    else this.procurementData = this.procurementDataCopy.filter(order => order.orderType == type)

  }

  filterByStatus(ev) {
    var status = ev.target.value;
    if (status != 'allOrders') this.procurementData = this.procurementDataCopy.filter(p => p.status == status)
    else  this.procurementData = this.procurementDataCopy.filter(purchase => purchase.status != 'canceled');

  }


  // filterByStatus(ev) {
  //   if (ev.target.value != "") {
  //     var status = ev.target.value;
  //     this.filterStatus = ev.target.value;
  //     if (status == 'ongoing') {
  //       this.procurementData = this.procurementDataCopy.filter(p => p.status != 'closed' && p.status != 'open' && p.status != 'canceled' && p.status != 'הזמנה פתוחה')
  //     } else if (status == 'material') {
  //       this.procurementData = this.procurementDataCopy.filter(p => p.orderType == 'material')
  //     } else if (status == 'component') {
  //       this.procurementData = this.procurementDataCopy.filter(p => p.orderType == 'component')
  //     } else if (status == 'allOrders') {
  //       this.procurementData = this.procurementDataCopy
  //     } else if (status == 'open') {
  //       this.procurementData = this.procurementDataCopy.filter(p => p.status == 'open' || p.status == 'הזמנה פתוחה')
  //     } else if (status == 'closed') {
  //       this.procurementData = this.procurementDataCopy.filter(p => p.status == 'closed')
  //     } else if (status == 'canceled') {
  //       this.procurementData = this.procurementDataCopy.filter(p => p.status == 'canceled')
  //     }
  //   }
  // }


  editRemarks(orderNumber) {
    ;
    if (orderNumber != '') {

      this.EditRowId = orderNumber;
    } else {
      this.EditRowId = '';

    }


  }

  printRecommend(recommend) {
    ;
    this.currRecommend = recommend
    this.printRecommendBtn.nativeElement.click();

  }


  setLinkDownlowd(id) {
    this.linkDownload = "http://peerpharmsystem.com/procurementOrderController/getpdf?_id=" + id;
  }
  setLinkDownlowdTwo(id) {
    this.linkDownload = "http://peerpharmsystem.com/procurementOrderController/getpdfTwo?_id=" + id;
  }


  updateArrivalDate(ev, orderNumber) {
    ;
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



  findInInventory(componentN) {

    location.href = 'http://peerpharmsystem.com/#/peerpharm/inventory/stock?componentN=' + componentN

  }



  sortTable(typeOfSort) {
    ;
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
    this.showImage = false;
    var supplierNumber = line.supplierNumber
    this.supplierService.getSuppliersByNumber(supplierNumber).subscribe(data => {
      ;
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
    this.currentItems = [...line.stockitems]
    // var total = 0;
    // var totalP = 0;
    // var totalN = 0;

    var coin = "";

    this.totalAmount = 0
    this.totalPriceNis = 0
    this.totalPrice = 0
    this.printSum = false
    for (let i = 0; i < this.currentItems.length; i++) {
      if(i==0) {
        coin = this.currentItems[i].coin
        if(this.currentItems.length == 1) this.printSum = true
      } 
      else {
        if (this.currentItems[i].coin == coin) this.printSum = true
        else this.printSum = false
      }
      this.currentItems[i].coin = this.currentItems[i].coin.toUpperCase() 
      this.currentItems[i].itemPrice = Number(this.currentItems[i].quantity) * Number(this.currentItems[i].price)
      this.currentItems[i].localTotal =this.currentItems[i].itemPrice * this.currencies[this.currentItems[i].coin.toUpperCase()] 
      this.totalAmount = this.totalAmount + Number(this.currentItems[i].quantity)
      this.totalPriceNis = this.totalPriceNis + Number(this.currentItems[i].localTotal)
      this.totalPrice = this.totalPrice + Number(this.currentItems[i].itemPrice)

      
      if (line.orderType == 'component') {
        this.showImage = true;
        this.inventoryService.getCmptByNumber(this.currentItems[i].number, 'component').subscribe(data => {
          this.currentItems[i].img = data[0].img
        })
      }
    }

    this.importantRemarks = line.remarks

    // var num = this.formatNumber(total)
    // var numTwo = this.formatNumber(totalP)
    this.priceTaxes = this.totalPrice * 17 / 100
    // var numFour = this.formatNumber(totalN);
    var combined = ((this.totalPrice * 17 / 100) + this.totalPrice)
    var numFour = this.formatNumber(combined)
    this.totalPriceWithTaxes = numFour

    if(this.printSum) {
      if (coin == 'nis' || coin == 'NIS') {
        this.currCoin = this.nisSymbol
      }
      if (coin == 'eur' || coin == 'EUR') {
        this.currCoin = '\u20AC'
      }
      if (coin == 'usd' || coin == 'USD') {
        this.currCoin = '$'
      }
      if (coin == 'gbp' || coin == 'GBP') {
        this.currCoin = '\u00A3'
      }
    }

    this.orderDate = line.creationDate.slice(0, 10)
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









  getAllPurchaseRecommends() {

    this.loadingRecommendations = true;
    
    this.procurementservice.getAllPurchaseRecommends().subscribe(data => {
      this.loadingRecommendations = false;

      console.log(data);

      this.purchaseRecommendations = data;
      this.purchaseRecommendations.forEach(pr => {
        pr.stockitems.forEach(si => {
          si.type = pr.type
          if (si.lastorder) {
            si.tooltip = `supplier name: ${si.lastorder.supplierName} | order number: ${si.lastorder.orderNumber}|
            price:${si.lastorder.price} | price:  ${si.lastorder.price}| coin: ${si.lastorder.coin} | quantity: ${si.lastorder.quantity}
            `;
          }
          else si.tooltip = ''
          si.color = si.color == 'lightgreen' ? 'lightgreen' : ""
        });
      });


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
    this.procurementData = this.procurementDataCopy.filter(purchase => {
      return purchase.orderNumber.toString().includes(ev.target.value)
    })
  }

  searchBySupplier(ev) {
    this.procurementData = this.procurementDataCopy.filter(purchase => {
      return purchase.supplierName.toLowerCase().includes(ev.target.value)
    })
  }

  searchByItem(ev) {
    this.procurementData = this.procurementDataCopy.filter(purchase => {
      if (purchase.stockitems.length == 0 && ev.target.value == "") return true
      for (let item of purchase.stockitems) {
        if (item.number && item.number.includes(ev.target.value)) {
          return true
        }
      }
    })

  }

  searchByCertNum(ev) {

    this.procurementData = this.procurementDataCopy.filter(purchase => {
      if (purchase.deliveryCerts.length == 0 && ev.target.value == "") return true
      for (let deliveryCert of purchase.deliveryCerts) {
        if (deliveryCert.certificateNumber && deliveryCert.certificateNumber.includes(ev.target.value)) {
          return true
        }
      }
    })

  }

  exportAsXLSX(expression): void {

    switch (expression) {
      case 'purchaseData':
        debugger
        let exelData = [...this.procurementData]
        exelData.map(purchase => {
          delete purchase.billNumber
          delete purchase._id
          delete purchase.deliveryCerts
          delete purchase.outOfCountry
          delete purchase.closeReason
          delete purchase.recommendId
          if(purchase.creationDate) purchase.creationDate = purchase.creationDate.slice(0,10)
          if(purchase.arrivalDate) purchase.arrivalDate = purchase.arrivalDate.slice(0,10)
        })
        this.excelService.exportAsExcelFile(exelData, 'purchase orders');
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
        case 'purchaseItems':
          let allItems = [];
          for(let purchaseOrder of this.procurementData){
            purchaseOrder.stockitems.map(item=>{
              allItems.push({
                orderNumber: purchaseOrder.orderNumber,
                itemNumber: item.number,
                itemName: item.name,
                componentType: item.componentType,
                orderedAmount: item.quantity,
                arrivedAmount:item.arrivedAmount,
                measurement: item.measurement,
                itemPrice: item.price,
                totalPriceNIS: item.localTotal,
                coin: item.coin,
                supplierItemNum: item.supplierItemNum,
                shippingPrice: item.shippingPrice,
                remarks: item.remarks


              })
            })
          }
          this.excelService.exportAsExcelFile(allItems, 'purchase items');
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
    this.purchaseData = <PurchaseData>this.procurementData[index]
    if (!this.purchaseData.outOfCountry) this.purchaseData.outOfCountry = false;
    this.isEdit = true;
    this.orderDetailsModal = true;
  }

  open(modal) {
    this.modalService.open(modal)
  }

}


  // editArrivalDetails(index) {
  //   this.editArrivalModal = true;
  //   var order = [];
  //   order.push(this.procurementArrivals[index])
  //   this.arrivalData = order
  //   this.arrivalData[0].index = index;
  // }



  // itemStatusDone(itemNumber, orderNumber) {
  //   this.procurementservice.setItemToDone({ itemNumber: itemNumber, orderNumber: orderNumber }).subscribe(data => {
  //     ;
  //     if (data) {
  //       var purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
  //       var item = purchase.item.find(i => i.itemNumber == itemNumber)
  //       item.color = 'lightgreen'
  //       purchase.color = 'orange'
  //       this.toastr.success('פריט עודכן בהצלחה !')
  //     }
  //   })

  // }



  // edit(itemNumber, index) {
  //   if (itemNumber != '') {
  //     this.EditRowIndex = index
  //     this.EditRowId = itemNumber;
  //   } else {
  //     this.EditRowId = '';
  //     this.EditRowIndex = ''
  //   }
  // }

  // editRecommend(id, requestNumber) {
  //   ;
  //   if (id != '') {
  //     this.requestNum = requestNumber
  //     this.EditRowId = id;
  //   } else {
  //     this.EditRowId = '';
  //     this.requestNum = '';
  //   }
  // }

  // dangerColor(threatment) {
  //   console.log("threatment:" + threatment);
  //   if (threatment == 'flammableLiquid' || threatment == 'flammableSolid' || threatment == 'flammable') {
  //     return "flame";
  //   }
  //   else if (threatment == 'acid') {
  //     return "acid";
  //   }
  //   else if (threatment == ' oxidizer') {
  //     return 'oxidizer'
  //   }
  //   else if (threatment == 'toxic') {
  //     return "toxic"
  //   }
  //   else if (threatment == 'base') {
  //     return 'base'
  //   }
  // }



  // saveRecommendRemarks(purchase) {
  //   purchase.recommendRemarks = this.recommendRemarks.nativeElement.value;
  //   this.procurementservice.updateRecommendRemarks(purchase).subscribe(data => {
  //     if (data) {
  //       for (let i = 0; i < this.purchaseRecommendations.length; i++) {
  //         if (this.purchaseRecommendations[i].componentNumber == data.componentNumber && this.purchaseRecommendations[i].requestNumber == data.requestNumber) {
  //           this.purchaseRecommendations[i].recommendRemarks = data.recommendRemarks
  //           this.editRecommend('', '')
  //           this.toastr.success("הערה להמלצה עודכנה בהצלחה !")
  //         }
  //       }
  //     }
  //   })
  // }

  // saveOrderRemarks(order) {

  //   order.remarks = this.purchaseRemarks.nativeElement.value;
  //   this.procurementservice.updatePurchaseRemarks(order).subscribe(data => {
  //     if (data) {
  //       var purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
  //       purchase.remarks = data.remarks
  //       this.toastr.success('הערה עודכנה בהצלחה !')
  //       this.editRemarks('')
  //     }
  //   })
  // }

  // onSelectOrderBill(event, orderNumber) {
  //   var currOrder = this.procurementData.find(o => o.orderNumber == orderNumber)
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();



  //     reader.onload = (event) => { // called once readAsDataURL is completed

  //       currOrder.orderBill = event.target['result'];
  //       currOrder.orderBill = currOrder.orderBill.replace("data:application/pdf;base64,", "")
  //       // this.resMaterial.coaMaster = event.target["result"]
  //       // this.resMaterial.coaMaster=this.resMaterial.coaMaster.replace("data:application/pdf;base64,","");
  //       this.procurementservice.updatePdfFile(currOrder).subscribe(data => {
  //         if (data) {
  //           this.toastr.success("קובץ הועלה בהצלחה !")
  //         }
  //       })
  //     }

  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //   }

  // }



  // changeStatus(ev, orderNumber) {
  //   var status = ev.target.value;

  //   if (status == 'orderPayedToSupplier' || status == 'timeToProduction' || status == 'expectedArrival') {
  //     this.showInfoModal = true;
  //     this.currStatus = ev.target.value;
  //     this.currOrderNumber = orderNumber
  //   } else {
  //     if (confirm("האם לעדכן סטטוס  ?")) {
  //       this.procurementservice.changeStatus(status, orderNumber).subscribe(data => {
  //         if (data) {
  //           let purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber);
  //           purchase.color = data.color;
  //           purchase.status = data.status
  //           this.toastr.success("סטטוס עודכן בהצלחה !")
  //         } else {
  //           this.toastr.error('error')
  //         }
  //       })
  //     }

  //   }
  // }

  // changeStatusToDone(purchase) {
  //   ;
  //   this.user = this.authService.loggedInUser.firstName;
  //   if (this.user == "shanie" || this.user == "sima") {
  //     this.procurementservice.updateComponentPurchase(purchase).subscribe(data => {
  //       ;
  //       if (data) {
  //         for (let i = 0; i < this.purchaseRecommendations.length; i++) {
  //           if (this.purchaseRecommendations[i].componentNumber == data.componentNumber && this.purchaseRecommendations[i].requestNumber == data.requestNumber) {
  //             this.purchaseRecommendations[i].color = data.color
  //           }
  //         }
  //         this.toastr.success("סטטוס עודכן בהצלחה")
  //       }

  //     })
  //   } else {
  //     this.toastr.error("רק משתמש מורשה רשאי לערוך זאת")
  //   }

  // }




  // cancelOrder(orderNumber) {
  //   if (confirm("האם לבטל הזמנה זו ?")) {
  //     this.procurementservice.cancelOrder(orderNumber).subscribe(data => {

  //       if (data) {
  //         this.procurementData = data;
  //         this.toastr.success("הזמנה בוטלה !")
  //       } else {
  //         this.toastr.error('error')
  //       }

  //     })
  //   }

  // }

  // orderSentToClient(orderNumber) {
  //   if (confirm("האם לעדכן סטטוס נשלח ללקוח ?")) {
  //     this.procurementservice.orderSentToClient(orderNumber).subscribe(data => {
  //       if (data) {
  //         this.procurementData = data;
  //         this.toastr.success("סטטוס 'נשלח ללקוח' עודכן בהצלחה !")
  //       } else {
  //         this.toastr.error('error')
  //       }
  //     })
  //   }
  // }

  // clientGotTheOrder(orderNumber) {
  //   if (confirm("האם לעדכן סטטוס הזמנה הגיעה ללקוח ?")) {
  //     this.procurementservice.clientGotTheOrder(orderNumber).subscribe(data => {
  //       if (data) {
  //         this.procurementData = data;
  //         this.toastr.success("סטטוס 'הזמנה הגיעה ללקוח' עודכן בהצלחה !")
  //       } else {
  //         this.toastr.error('error')
  //       }
  //     })
  //   }
  // }

  // closeOrder(ev, orderNumber) {
  //   var reason = ev.target.value;
  //   if (reason != 'open') {
  //     if (confirm("האם לסגור הזמנה זו  ?")) {
  //       this.procurementservice.closeOrder(orderNumber, reason).subscribe(data => {
  //         if (data) {
  //           ;
  //           let purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
  //           if (purchase) {
  //             purchase.status = data.status;
  //             purchase.color = data.color
  //           }
  //           this.toastr.success("סטטוס 'הזמנה סגורה' עודכן בהצלחה !")
  //         } else {
  //           this.toastr.error('error')
  //         }
  //       })
  //     }
  //   } else {
  //     if (confirm("האם לפתוח הזמנה זו  ?")) {
  //       this.procurementservice.closeOrder(orderNumber, reason).subscribe(data => {
  //         if (data) {
  //           let purchase = this.procurementData.find(p => p.orderNumber == data.orderNumber)
  //           if (purchase) {
  //             purchase.status = data.status;
  //             purchase.color = data.color
  //           }
  //           this.toastr.success("סטטוס 'הזמנה סגורה' עודכן בהצלחה !")
  //         } else {
  //           this.toastr.error('error')
  //         }
  //       })
  //     }
  //   }

  // }

  // deleteFromOrder(itemNumber, orderNumber) {
  //   if (confirm("האם למחוק פריט מספר " + itemNumber)) {
  //     this.procurementservice.deleteItemFromOrder(itemNumber, orderNumber).subscribe(data => {
  //       ;
  //       if (data) {
  //         for (let i = 0; i < this.procurementData.length; i++) {
  //           for (let j = 0; j < this.procurementData[i].item.length; j++) {
  //             if (this.procurementData[i].orderNumber == orderNumber) {
  //               if (this.procurementData[i].item[j].itemNumber == itemNumber) {
  //                 this.procurementData[i].item.splice(j, 1)
  //               }
  //             }
  //           }
  //         }
  //         this.toastr.success("פריט נמחק בהצלחה")



  //       }
  //     })
  //   }

  // }

  // checkIfArrived(itemNumber, orderNumber, index) {
  //   ;

  //   var orderAmount = this.orderAmount.nativeElement.value;
  //   var supplierPrice = this.supplierPrice.nativeElement.value;
  //   var itemRemarks = this.itemRemarks.nativeElement.value;
  //   var orderCoin = this.orderCoin.nativeElement.value;


  //   if (confirm("האם לשנות?") == true) {
  //     this.procurementservice.changeColor(itemNumber, orderNumber, orderAmount, supplierPrice, itemRemarks, orderCoin, index).subscribe(data => {

  //       for (let i = 0; i < this.procurementData.length; i++) {
  //         if (this.procurementData[i].orderNumber == orderNumber) {

  //           this.procurementData[i].item[index].supplierAmount = orderAmount
  //           this.procurementData[i].item[index].supplierPrice = supplierPrice
  //           this.procurementData[i].item[index].itemRemarks = itemRemarks
  //           this.procurementData[i].item[index].coin = orderCoin

  //           this.toastr.success(" עודכן בהצלחה !")
  //           this.edit('', '');

  //         }

  //       }

  //     })
  //   } else {

  //   }


  // }



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



/*

//data = all purchase recommendations (recommendation object)
data.forEach(purchaseRecommendation => {
//purchaseRecommendation = one object
if (purchaseRecommendation.stockitems && purchaseRecommendation.stockitems.length > 0) {
  purchaseRecommendation.stockitems.forEach(item => {
    // item - recommended item to purchase
    // give id to every item (from which recommendation he is coming from)
    item.recommendationNumber = purchaseRecommendation.recommendNumber
  })
}
})
data.forEach(purchaseRecommendation => {
this.purchaseRecommendations = this.purchaseRecommendations.concat(purchaseRecommendation.stockitems)
this.purchaseRecommendationsCopy = this.purchaseRecommendationsCopy.concat(purchaseRecommendation.stockitems)
})
this.purchaseRecommendations = this.purchaseRecommendations.filter(recommendedItem => recommendedItem != null );

debugger;*/