import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.css']
})

export class ProcurementOrdersComponent implements OnInit {


  printBill:boolean = false;
  orderDetailsModal:boolean = false;
  procurementData: any[];
  procurementDataCopy: any[];
  currentOrder: any[];
  currentItems: any[];
  currentSupplier:object;
  hasMoreItemsToload: boolean = true;
  orderData:any[];
  EditRowId:any="";

  totalAmount:any;
  totalPrice:any;
  importantRemarks:any;
  orderDate:any;
  outOfCountry:any;

  @ViewChild('arrivedAmount') arrivedAmount: ElementRef;
  @ViewChild('orderAmount') orderAmount: ElementRef;
  
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
 
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  constructor( 
    private toastr: ToastrService,private procurementservice: Procurementservice, private excelService: ExcelService,private supplierService:SuppliersService
  ) {}

  ngOnInit() {
    console.log('Enter');
    this.getAllProcurementOrders();
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
     totalP = totalP + Number(this.currentItems[i].supplierPrice)
     coin = this.currentItems[i].coin

    }
    this.importantRemarks = line.remarks
    this.totalAmount = total
    this.totalPrice = totalP+coin
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
         this.hasMoreItemsToload = false;
         
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

  closeOrder(orderNumber){
    this.procurementservice.closeOrder(orderNumber).subscribe(data=>{
      debugger
      if(data) {
        this.procurementData = data;
      } else { 
        this.toastr.error('error')
      }
      
    })
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
  
    debugger;
    this.orderData
    if (confirm("האם לשנות?") == true) {
      this.procurementservice.changeColor(itemNumber,orderNumber,arrivedAmount,orderAmount).subscribe(data=>{
        debugger
      for (let i = 0; i < this.procurementData.length; i++) {
        if(this.procurementData[i].orderNumber == orderNumber) {
          if(Number(this.procurementData[i].item[index].supplierAmount) > Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'lightyellow'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
            this.toastr.success("כמות עודכנה בהצלחה !")
            this.edit('');
          }
          if(Number(this.procurementData[i].item[index].supplierAmount) == Number(arrivedAmount)) {
            this.procurementData[i].item[index].color = 'lightgreen'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.procurementData[i].item[index].supplierAmount = orderAmount
           
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
