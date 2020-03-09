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

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.css']
})

export class ProcurementOrdersComponent implements OnInit {

  allComponents:any[];
  purchaseRecommendations:any[];
  allComponentsCopy:any[];
  printBill:boolean = false;
  orderDetailsModal:boolean = false;
  procurementData: any[];
  procurementDataCopy: any[];
  currentOrder: any[];
  currentItems: any[];
  currentSupplier:object;
  orderData:any[];
  EditRowId:any="";
  requestNum:any="";
  user:any;

  totalAmount:any;
  itemAmounts:any;
  totalPrice:any;
  importantRemarks:any;
  orderDate:any;
  outOfCountry:any;

  @ViewChild('arrivedAmount') arrivedAmount: ElementRef;
  @ViewChild('orderAmount') orderAmount: ElementRef;
  @ViewChild('referenceNumber') referenceNumber: ElementRef;
  @ViewChild('arrivalDate') arrivalDate: ElementRef;
  @ViewChild('recommendRemarks') recommendRemarks: ElementRef;
  @ViewChild('supplierPrice') supplierPrice: ElementRef;
  @ViewChild('expectedDate') expectedDate: ElementRef;
  
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
 
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
    this.editRecommend('','')
  }

  constructor( 
    private toastr: ToastrService,private procurementservice: Procurementservice, private excelService: ExcelService,private supplierService:SuppliersService,
    private inventoryService:InventoryService , private authService:AuthService, private arrayService:ArrayServiceService
  ) {}

  ngOnInit() {
    console.log('Enter');
    this.getAllProcurementOrders();
    this.getComponentsWithPurchaseRec();
    this.user = this.authService.loggedInUser.firstName;

  }

  getAllProcurementOrders() {
    debugger;
    this.procurementservice.getProcurementOrder().subscribe(res => {
      this.procurementData = res;
      
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

  editRecommend(id,requestNumber){
    debugger;
    if (id != '') {
      this.requestNum = requestNumber
      this.EditRowId = id;
    } else {
      this.EditRowId = '';
      this.requestNum = '';
    }
  }

  saveRecommendRemarks(purchase){
  debugger;
  
  purchase.recommendRemarks = this.recommendRemarks.nativeElement.value;

  this.procurementservice.updateRecommendRemarks(purchase).subscribe(data=>{
    debugger;
    if(data){
      for (let i = 0; i < this.purchaseRecommendations.length; i++) {
        if(this.purchaseRecommendations[i].componentNumber == data.componentNumber && this.purchaseRecommendations[i].requestNumber == data.requestNumber ){
          this.purchaseRecommendations[i].recommendRemarks = data.recommendRemarks
          this.editRecommend('','')
          this.toastr.success("הערה להמלצה עודכנה בהצלחה !")
        }
        
      }
    }

  })
  }

  
  changeStatusToDone(purchase){
    debugger;
    this.user = this.authService.loggedInUser.firstName;
    if(this.user == "shanie" || this.user == "sima"){
      this.procurementservice.updateComponentPurchase(purchase).subscribe(data=>{
        debugger;
        if(data){
          for (let i = 0; i < this.purchaseRecommendations.length; i++) {
            if(this.purchaseRecommendations[i].componentNumber == data.componentNumber && this.purchaseRecommendations[i].requestNumber == data.requestNumber){
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

  findInInventory(componentN){

    location.href = 'http://peerpharmsystem.com/#/peerpharm/inventory/stock?componentN='+componentN
  
  }

  sortTable(typeOfSort){
    debugger;
    switch (typeOfSort) {
      case 'supplier':
        this.purchaseRecommendations=this.arrayService.sortByAttribute(this.purchaseRecommendations,'supplierName')
        break;
      case 'date':
        this.purchaseRecommendations=this.arrayService.sortByAttribute(this.purchaseRecommendations,'date')
        break;
      case 'ordered':
        this.purchaseRecommendations=this.arrayService.sortByAttribute(this.purchaseRecommendations,'color')
        break;
      case 'itemNumber':
        this.purchaseRecommendations=this.arrayService.sortByAttribute(this.purchaseRecommendations,'componentNumber')
        break;

    }  
  }
  printOrder(line) {
    debugger;

    var supplierNumber = line.supplierNumber
    this.supplierService.getSuppliersByNumber(supplierNumber).subscribe(data=>{
      debugger;
      this.currentSupplier = data[0]
    })
    this.printBill=true;
    this.currentOrder = line;
    this.currentItems = line.item
    var total = 0;
    var totalP = 0; 
    var coin ="";

    for (let i = 0; i < this.currentItems.length; i++) {
     total = total + Number(this.currentItems[i].supplierAmount)
     totalP = totalP + Number(this.currentItems[i].itemPrice)
     coin = this.currentItems[i].coin

    }
   
    this.importantRemarks = line.remarks
    this.totalAmount = total
    this.totalPrice = ((totalP)+" "+coin)
    this.orderDate = line.outDate.slice(0,10)
    if(line.outOfCountry == false){
      this.outOfCountry = "Payment Terms:Current+95 Days"
    }
  }

  searchBySupplier(ev){
   
    var supplierName = ev.target.value;
    if(supplierName != ""){
      var tempArr = this.procurementData.filter(purchase=>purchase.supplierName.includes(supplierName))
      this.procurementData = tempArr
    } else {
      this.procurementData = this.procurementDataCopy
    }

  }

  searchByReference(ev){
   
    var referenceNumber = ev.target.value;
    var tempArr = []
    if(referenceNumber != ""){
     for (let i = 0; i < this.procurementData.length; i++) {
       for (let j = 0; j < this.procurementData[i].item.length; j++) {
        if(this.procurementData[i].item[j].referenceNumber == referenceNumber) {
          tempArr.push(this.procurementData[i])
        }
         
       }
       
     }
      this.procurementData = tempArr
    } else {
      this.procurementData = this.procurementDataCopy
    }

  }

  searchByItem(ev){
   
    var itemNumber = ev.target.value;
    var tempArr = []
    if(itemNumber != ""){
     for (let i = 0; i < this.procurementData.length; i++) {
       for (let j = 0; j < this.procurementData[i].item.length; j++) {
        if(this.procurementData[i].item[j].itemNumber == itemNumber) {
          tempArr.push(this.procurementData[i])
        }
         
       }
       
     }
      this.procurementData = tempArr
    } else {
      this.procurementData = this.procurementDataCopy
    }

  }


  getComponentsWithPurchaseRec(){
    this.procurementservice.componentsWithPurchaseRec().subscribe(data=>{
      this.purchaseRecommendations = data;
      this.purchaseRecommendations = data;
    })
  }


  dateChange(){
    ;
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.procurementservice.getProcurementOrderItemByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.procurementData = data;
        this.procurementDataCopy = data;
      })
    } else { 
      this.getAllProcurementOrders()
    }
  
  }

  searchNumber(ev)
  
  {

    if(ev.target.value=="") {
      this.getAllProcurementOrders();
    }
   
    let word= ev.target.value;
    let wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      
      let tempArr=[];
      this.procurementData.filter(x=>{
        
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
         
            if(x.orderNumber==w ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.procurementData= tempArr;
        
         
    }else{
      
      this.procurementData=this.procurementDataCopy.slice();
    }
  }

  exportAsXLSX():void {
    
    this.excelService.exportAsExcelFile(this.procurementData, 'data');
  }

  

  viewOrderDetails(index){

    debugger;
    this.orderDetailsModal = true;
    var order = [];
    order.push(this.procurementData[index])

    this.orderData = order
  }

  cancelOrder(orderNumber){
    if(confirm("האם לבטל הזמנה זו ?")) {
         this.procurementservice.cancelOrder(orderNumber).subscribe(data=>{
      debugger
      if(data) {
        this.procurementData = data;
        this.toastr.success("הזמנה בוטלה !")
      } else { 
        this.toastr.error('error')
      }
      
    }) 
    }

  }  

  orderSentToClient(orderNumber){
    if(confirm("האם לעדכן סטטוס נשלח ללקוח ?")) {
    this.procurementservice.orderSentToClient(orderNumber).subscribe(data=>{
      if(data) {
        this.procurementData = data;
        this.toastr.success("סטטוס 'נשלח ללקוח' עודכן בהצלחה !")
      } else { 
        this.toastr.error('error')
      }
    })
    }
  }
  clientGotTheOrder(orderNumber){
    if(confirm("האם לעדכן סטטוס הזמנה הגיעה ללקוח ?")) {
    this.procurementservice.clientGotTheOrder(orderNumber).subscribe(data=>{
      if(data) {
        this.procurementData = data;
        this.toastr.success("סטטוס 'הזמנה הגיעה ללקוח' עודכן בהצלחה !")
      } else { 
        this.toastr.error('error')
      }
    })
    }
  }
  closeOrder(orderNumber){
    if(confirm("האם לסגור הזמנה זו  ?")) {
    this.procurementservice.closeOrder(orderNumber).subscribe(data=>{
      if(data) {
        this.procurementData = data;
        this.toastr.success("סטטוס 'הזמנה סגורה' עודכן בהצלחה !")
      } else { 
        this.toastr.error('error')
      }
    })
    }
  }

  deleteFromOrder(itemNumber,orderNumber){
    if(confirm("האם למחוק פריט מספר "+itemNumber)) {
      this.procurementservice.deleteItemFromOrder(itemNumber,orderNumber).subscribe(data=>{
        debugger;
        if(data) {
          this.toastr.success("פריט נמחק בהצלחה")
          this.procurementData = data;
 
        }   
      })
    }
  
  }

  checkIfArrived(itemNumber,orderNumber,index){
    debugger;
    var arrivedAmount = this.arrivedAmount.nativeElement.value;
    var orderAmount = this.orderAmount.nativeElement.value;
    var arrivalDate = this.arrivalDate.nativeElement.value;
    var referenceNumber = this.referenceNumber.nativeElement.value;
    var supplierPrice = this.supplierPrice.nativeElement.value;
    var expectedDate = this.supplierPrice.nativeElement.expectedDate;

    if(arrivedAmount == 'undefined' || arrivedAmount == undefined){
      arrivedAmount = null;
    }
    if(referenceNumber == "undefined" || referenceNumber == undefined){
      referenceNumber = null;
    }
    if(expectedDate == 'undefined' || expectedDate == undefined) {
      expectedDate = null
    }
  
    debugger;
    this.orderData
    if (confirm("האם לשנות?") == true) {
      this.procurementservice.changeColor(itemNumber,orderNumber,arrivedAmount,orderAmount,arrivalDate,referenceNumber,supplierPrice,expectedDate).subscribe(data=>{
        debugger
      for (let i = 0; i < this.procurementData.length; i++) {
        if(this.procurementData[i].orderNumber == orderNumber) {
          if(Number(this.procurementData[i].item[index].supplierAmount) > Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'yellow'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].arrivalDate = arrivalDate
            this.procurementData[i].item[index].referenceNumber = referenceNumber
            this.procurementData[i].item[index].supplierPrice = supplierPrice
            this.procurementData[i].item[index].expectedDate = expectedDate
            this.toastr.success(" עודכן בהצלחה !")
            this.edit('');
          }
          if(Number(this.procurementData[i].item[index].supplierAmount) < Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'yellow'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].arrivalDate = arrivalDate
            this.procurementData[i].item[index].referenceNumber = referenceNumber
            this.procurementData[i].item[index].supplierPrice = supplierPrice
            this.procurementData[i].item[index].expectedDate = expectedDate
            this.toastr.success(" עודכן בהצלחה !")
            this.edit('');
          }
          if(Number(this.procurementData[i].item[index].supplierAmount) == Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'lightgreen'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].arrivalDate = arrivalDate
            this.procurementData[i].item[index].referenceNumber = referenceNumber
            this.procurementData[i].item[index].supplierPrice = supplierPrice
            this.procurementData[i].item[index].expectedDate = expectedDate
           
            this.toastr.success("כמות עודכנה בהצלחה !")
            this.edit('');
          }
        
        }
        
      }
      
      })
    } else {
     
    }  

   
  }

}
