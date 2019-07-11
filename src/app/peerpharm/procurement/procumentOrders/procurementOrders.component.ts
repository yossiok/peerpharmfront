import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Procurementservice } from '../../../services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-procurement-orders',
  templateUrl: './procurementOrders.component.html',
  styleUrls: ['./procurementOrders.component.css']
})

export class ProcurementOrdersComponent implements OnInit {

  procurementData: any[];
  procurementDataCopy: any[];
  hasMoreItemsToload: boolean = true;
  
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
 

  constructor(
    private procurementservice: Procurementservice, private excelService: ExcelService
  ) {}

  ngOnInit() {
    console.log('Enter');
    this.getAllProcurementOrders();
  }

  getAllProcurementOrders() {
    this.procurementservice.getProcurementOrder().subscribe(res => {
      this.procurementData = res;
      console.log(this.procurementData);

      if(res.length == res.length) {
        this.hasMoreItemsToload == false;
      }
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
    debugger
    this.excelService.exportAsExcelFile(this.procurementData, 'data');
  }


}
