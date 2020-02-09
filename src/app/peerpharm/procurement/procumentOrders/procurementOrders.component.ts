import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.css']
})

export class ProcurementOrdersComponent implements OnInit {

  orderDetailsModal:boolean = false;
  procurementData: any[];
  procurementDataCopy: any[];
  hasMoreItemsToload: boolean = true;
  orderData:any[];
  EditRowId:any="";
  arrivedAmount:"";
  
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
 
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  constructor(
    private procurementservice: Procurementservice, private excelService: ExcelService,private modalService: NgbModal
    private toastr: ToastrService,private procurementservice: Procurementservice, private excelService: ExcelService
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

    this.orderData = order[0].item
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

  checkIfArrived(itemNumber,orderNumber,index){
    var arrivedAmount = this.arrivedAmount
    debugger;
    this.orderData
    if (confirm("האם לשנות?") == true) {
      this.procurementservice.changeColor(itemNumber,orderNumber,arrivedAmount).subscribe(data=>{
        debugger
      for (let i = 0; i < this.procurementData.length; i++) {
        if(this.procurementData[i].orderNumber == orderNumber) {
          if(this.procurementData[i].item[index].supplierAmount > arrivedAmount) {
            this.procurementData[i].item[index].color = 'lightyellow'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
            this.toastr.success("כמות עודכנה בהצלחה !")
            this.edit('');
          }
          if(this.procurementData[i].item[index].supplierAmount == arrivedAmount) {
            this.procurementData[i].item[index].color = 'lightgreen'
            this.procurementData[i].item[index].arrivedAmount = arrivedAmount
           
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
