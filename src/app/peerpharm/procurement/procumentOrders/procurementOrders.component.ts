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
  purchaseRecommendationsCopy:any[];
  allComponentsCopy:any[];
  allMaterials:any[];
  printBill:boolean = false;
  orderDetailsModal:boolean = false;
  editArrivalModal:boolean = false;
  procurementData: any[];
  procurementDataCopy: any[];
  procurementArrivals: any[]=[]
  currentOrder: any[];
  currentItems: any[];
  allSuppliers: any[];
  currentSupplier:object;
  orderData:any[];
  arrivalData:any[];
  EditRowId:any="";
  EditRowComax:any="";
  requestNum:any="";
  user:any;

  totalAmount:any;
  itemAmounts:any;
  totalPrice:any;
  importantRemarks:any;
  orderDate:any;
  outOfCountry:any;

  newItem = {

    itemNumber:'',
    itemName:'',
    coin:'',
    measurement:'',
    supplierPrice:'',
    supplierAmount:'',
    color:'',
    orderNumber:'',
    itemRemarks:'',
    itemPrice:0,
    remarks:''
  
    }
    newReference = {
      referenceNumber:"",
      arrivalDate:"",
      arrivedAmount:"",
      orderId:"",
      itemNumber:"",
    }

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
    this.getAllMaterials();
    this.getAllSuppliers();
    this.user = this.authService.loggedInUser.firstName;

  }

  getAllMaterials(){
    debugger;
    this.inventoryService.getAllMaterialsForFormules().subscribe(data=>{
      this.allMaterials = data;
    })
  }

  fillMaterialNumber(ev){
    debugger;
    var material = ev.target.value;

    for (let i = 0; i < this.allMaterials.length; i++) {
     if(this.allMaterials[i].componentName == material){
       this.newItem.itemNumber = this.allMaterials[i].componentN
     }
      
    }
  }
  filterPurchases(event,type){
    debugger;
   if(event.target.value == ''){
     type = "";
     this.procurementArrivals = []
   } else {
    switch (type) {
      case 'supplier':
      var tempArr = this.procurementDataCopy.filter(p=>p.supplierName == event.target.value);
      for (let i = 0; i < tempArr.length; i++) {
      if(tempArr[i].status != 'closed'){
        for (let j = 0; j < tempArr[i].item.length; j++) {

        var obj = {
          id:tempArr[i]._id,
          supplierName:tempArr[i].supplierName,
          comaxNumber:tempArr[i].comaxNumber,
          itemNumber:tempArr[i].item[j].itemNumber,
          itemName:tempArr[i].item[j].itemName,
          arrivals:[],

          
        }
        if(tempArr[i].item[j].arrivals){
          for (let k = 0; k < tempArr[i].item[j].arrivals.length; k++) {

            var arrival = {
              referenceNumber : tempArr[i].item[j].arrivals[k].referenceNumber,
              arrivalDate : tempArr[i].item[j].arrivals[k].arrivalDate,
              arrivedAmount : tempArr[i].item[j].arrivals[k].arrivedAmount 
            }
            obj.arrivals.push(arrival)
                    
          }
        }

          this.procurementArrivals.push(obj)
        
        }
      }
        
      }
        break;
      case 'itemNumber':
        var tempArr = [...this.procurementArrivals];
        this.procurementArrivals = tempArr.filter(p=>p.itemNumber == event.target.value)
        break;
      case 'orderNumber':
        var tempArr = [...this.procurementArrivals];
        this.procurementArrivals = tempArr.filter(p=>p.comaxNumber == event.target.value)
        break;


    } 
   }
   
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

  

  filterByStatus(ev){

    this.purchaseRecommendations = this.purchaseRecommendationsCopy
    if(ev.target.value != '') {
      var status = ev.target.value;
      var type = ev.target.value;
      switch (type) {
        case 'lightcoral':
          this.purchaseRecommendations = this.purchaseRecommendations.filter(p=>p.color == status)
          break
        case 'open':
          this.purchaseRecommendations = this.purchaseRecommendations.filter(p=>p.color != 'lightcoral')
          break
  
      }  
    } else {
      this.purchaseRecommendations = this.purchaseRecommendationsCopy
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

  addNewItem(){
    debugger;
    this.newItem.orderNumber = this.orderData[0].orderNumber;
    this.newItem.itemPrice = Number(this.newItem.supplierAmount)*Number(this.newItem.supplierPrice);
    var itemObject = {...this.newItem}
    this.procurementservice.addItemToProcurement(itemObject).subscribe(data=>{
    debugger;
    if(data){
      this.orderData[0].item.push(itemObject);
      this.toastr.success("פריט נוסף בהצלחה !")
      this.clearNewItem();
      
    }
    })
    this.orderData
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
      this.purchaseRecommendationsCopy = data;
    })
  }

  clearNewItem(){
    this.newItem.itemNumber='',
    this.newItem.itemName='',
    this.newItem.coin='',
    this.newItem.measurement='',
    this.newItem.supplierPrice='',
    this.newItem.supplierAmount='',
    this.newItem.color='',
    this.newItem.orderNumber='',
    this.newItem.itemRemarks='',
    this.newItem.itemPrice=0,
    this.newItem.remarks=''
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


  getAllSuppliers() { 
    this.supplierService.getSuppliersDiffCollection().subscribe(data=>{
    this.allSuppliers = data;
    })
  }
  

  viewOrderDetails(index){

    debugger;
    this.orderDetailsModal = true;
    var order = [];
    order.push(this.procurementData[index])

    this.orderData = order
  }
  editArrivalDetails(index){

    debugger;
    this.editArrivalModal = true;
    var order = [];
    order.push(this.procurementArrivals[index])
    

    this.arrivalData = order
    this.arrivalData[0].index = index;
  }

  addReferenceDetails(arrival){
  debugger;
  this.newReference.orderId = arrival.id
  this.newReference.itemNumber = arrival.itemNumber
  this.procurementservice.updatePurchaseOrder(this.newReference).subscribe(data=>{
  
  if(data){
    debugger;
    for (let i = 0; i < this.procurementArrivals.length; i++) {

      if(this.procurementArrivals[i].id == data._id) {
          for (let k = 0; k < data.item.length; k++) {
            if(this.procurementArrivals[i].itemNumber == data.item[k].itemNumber) {
              this.procurementArrivals[this.arrivalData[0].index].arrivals = data.item[k].arrivals
              this.getAllProcurementOrders();
              this.editArrivalModal = false;
              this.toastr.success("עודכן בהצלחה !")
            }  
          }   
          
        }
      }
    } 
  })

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
    var supplierPrice = this.supplierPrice.nativeElement.value;
   

    if(arrivedAmount == 'undefined' || arrivedAmount == undefined){
      arrivedAmount = null;
    }

    debugger;
    this.orderData
    if (confirm("האם לשנות?") == true) {
      this.procurementservice.changeColor(itemNumber,orderNumber,arrivedAmount,orderAmount,supplierPrice).subscribe(data=>{
        debugger
      for (let i = 0; i < this.procurementData.length; i++) {
        if(this.procurementData[i].orderNumber == orderNumber) {
          if(Number(this.procurementData[i].item[index].supplierAmount) > Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'yellow'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].supplierPrice = supplierPrice

            this.toastr.success(" עודכן בהצלחה !")
            this.edit('');
          }
          if(Number(this.procurementData[i].item[index].supplierAmount) < Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'yellow'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].supplierPrice = supplierPrice
        
            this.toastr.success(" עודכן בהצלחה !")
            this.edit('');
          }
          if(Number(this.procurementData[i].item[index].supplierAmount) == Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'lightgreen'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.procurementData[i].item[index].supplierPrice = supplierPrice
        
           
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
