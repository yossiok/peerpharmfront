import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.css']
})

export class ProcurementOrdersComponent implements OnInit {

  allComponents:any[];
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
  
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
 
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  constructor( 
    private toastr: ToastrService,private procurementservice: Procurementservice, private excelService: ExcelService,private supplierService:SuppliersService,
    private inventoryService:InventoryService , private authService:AuthService,
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

  
  changeStatusToDone(purchase){
    this.user = this.authService.loggedInUser.firstName;
    if(this.user == "shanie"){
      this.procurementservice.updateComponentPurchase(purchase).subscribe(data=>{
        debugger;
        if(data){
          var component = this.allComponents.find(c=>c.componentN == data.componentNumber);
          for (let i = 0; i < component.purchaseRecommendations.length; i++) {
           if(data.requestNumber == component.purchaseRecommendations[i].requestNumber){
            component.purchaseRecommendations[i].color = data.color
           }
            
          }
          component = data;
          this.toastr.success("סטטוס עודכן בהצלחה")
        }
  
      })
    } else {
      this.toastr.error("רק משתמש מורשה רשאי לערוך זאת")
    }
 
  }

  sortTable(typeOfSort){
    debugger;
    switch (typeOfSort) {
      case 'supplier':
        
        break;
      case 'date':
     
        break;
      case 'ordered':
        
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
      this.allComponents = data;
      this.allComponentsCopy = data;
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

    if(arrivedAmount == 'undefined'){
      arrivedAmount = null;
    }
    if(referenceNumber == "undefined" || referenceNumber == undefined){
      referenceNumber = null;
    }
  
    debugger;
    this.orderData
    if (confirm("האם לשנות?") == true) {
      this.procurementservice.changeColor(itemNumber,orderNumber,arrivedAmount,orderAmount,arrivalDate,referenceNumber).subscribe(data=>{
        debugger
      for (let i = 0; i < this.procurementData.length; i++) {
        if(this.procurementData[i].orderNumber == orderNumber) {
          if(Number(this.procurementData[i].item[index].supplierAmount) > Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'yellow'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].arrivalDate = arrivalDate
            this.procurementData[i].item[index].referenceNumber = referenceNumber
            this.toastr.success(" עודכן בהצלחה !")
            this.edit('');
          }
          if(Number(this.procurementData[i].item[index].supplierAmount) == Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'lightgreen'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].arrivalDate = arrivalDate
            this.procurementData[i].item[index].referenceNumber = referenceNumber
           
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
