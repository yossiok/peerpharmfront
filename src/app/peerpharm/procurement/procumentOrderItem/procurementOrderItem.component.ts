import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-procurement-order-item',
  templateUrl: './procurementOrderItem.component.html',
  styleUrls: ['./procurementOrderItem.component.css']
})

export class ProcurementOrderItemComponent implements OnInit {
  
  procurementData: any[];
  procurementDataCopy: any[];
  orderNumber: any;
  orderDate: any;
  hasMoreItemsToload: boolean = true;

  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;

  constructor(
    private procurementservice: Procurementservice,
    private route: ActivatedRoute,
    private excelService: ExcelService
  ) {
  }

  ngOnInit() {
    console.log('Enter');
    this.orderNumber = this.route.snapshot.paramMap.get('orderNumber');
   // this.orderDate =  this.route.snapshot.paramMap.get('orderDate');

    if (this.orderNumber){
      this.getAllProcurementOrderItemByOrderId();
    }
    else {
      this.getAllProcurementOrderItem();
    }

  }

  getAllProcurementOrderItem() {
    this.procurementservice.getProcurementOrderItem().subscribe(res => {
      this.procurementData = res;
      this.procurementDataCopy = res;
      console.log(this.procurementData);

      if(res.length == res.length) {
        this.hasMoreItemsToload == false;
      }
    });
  }

  getAllProcurementOrderItemByOrderId() {
    this.procurementservice.getProcurementOrderItemByOrderNumber(this.orderNumber).subscribe(res => {
      this.procurementData = res;
      console.log(this.procurementData);
    });
  }

  dateChange(){
    ;
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.procurementservice.getProcurementOrderItemByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.procurementData = data;
        this.procurementDataCopy = data;
      })
    } else { 
      this.getAllProcurementOrderItem()
    }
  
  }

  searchNumber(ev)
  
  {

    if(ev.target.value=="") {
      this.getAllProcurementOrderItem();
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

  searchSupplier(ev) {
    debugger;
    console.log(this.procurementData)
    if(ev.target.value=="") {
      this.getAllProcurementOrderItem();
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
         
            if(x.supplierName.toLowerCase().includes(w) ){
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
    debugger
    this.excelService.exportAsExcelFile(this.procurementData, 'data');
  }
}
