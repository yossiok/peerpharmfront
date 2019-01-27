import { Component, OnInit } from '@angular/core';
import { BatchesService } from '../../services/batches.service'
// test for excel export
import {ExcelService} from '../../services/excel.service';
// private excelService:ExcelService
import * as moment from 'moment';
import { Toast } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {
  myRefresh: any = null;

  constructor(private batchService: BatchesService, private excelService:ExcelService , private toastSrv: ToastrService) { }
  dateList:Array<any>=[{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5}];
  batches: Array<any>;
  batchesCopy: Array<any>;
  lastBatchToExport:String;

  ngOnInit() {

    this.getAllBatches();
    this.startInterval();
  }

  stopInterval() {
    clearInterval(this.myRefresh)
  }

  startInterval() {
    this.myRefresh = setInterval(() => { this.getAllBatches(); }, 1000 * 60 * 3);
  }


  getAllBatches() {

    this.batchService.getAllBatches().subscribe((res) => {
      console.log(res);
      this.batches = res;
      this.batchesCopy = res;
      this.batches.map(batch => {
        if (batch.weightKg != null && batch.weightQtyLeft != null) {
          if (batch.weightQtyLeft == 0) batch.color = 'Aquamarine';
          else if (batch.weightQtyLeft < batch.weightKg) batch.color = "yellow";
          else batch.color = "white";
        }
      });

    });
  }

  filterBatchesBiggerThenBatchN() {
    var excelTable=[];
    if(this.lastBatchToExport!="" && this.lastBatchToExport!=null){
      this.batchesCopy.map(batch => {
        let lastBatchYear=this.lastBatchToExport.split("pp")[0];
        let lastBatchNum=this.lastBatchToExport.split("pp")[1];
        let year=batch.batchNumber.split("pp")[0] ;
        let number=batch.batchNumber.split("pp")[1] ;
        if(year>=lastBatchYear && number>=lastBatchNum && batch.weightKg != null && batch.weightQtyLeft != null){
          let obj={
            batchNumber:batch.batchNumber,
            produced:batch.produced,
            item:batch.item,
            itemName:batch.itemName, 
            expration: batch.expration, 
            order:batch.order,
            ph:batch.ph, 
            weightKg: batch.weightKg,
          }
          excelTable.push(obj);
        }
      });
      this.exportAsXLSX(excelTable);
      this.lastBatchToExport="";
    }else{
      this.toastSrv.error("No batch number to follow");
    }
  }


  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(data, 'batches');
 }

  changeText(ev, filterBy)
  {
    if(filterBy=='itemName'){
      let word= ev.target.value;
      let wordsArr= word.split(" ");
      wordsArr= wordsArr.filter(x=>x!="");
      if(wordsArr.length>0){
        let tempArr=[];
        this.batchesCopy.filter(b=>{
          var check=false;
          var matchAllArr=0;
          wordsArr.forEach(w => {
              if(b.itemName.toLowerCase().includes(w.toLowerCase()) ){
                matchAllArr++
              }
              (matchAllArr==wordsArr.length)? check=true : check=false ; 
          }); 
  
          if(!tempArr.includes(b) && check) tempArr.push(b);
        });
           this.batches= tempArr;
           debugger
      }else{
        this.batches=this.batchesCopy.slice();
      }
    }else if(filterBy=='batchNumber'){
      let bNum= ev.target.value;
      if(bNum!=''){
        let tempArr=[];
        this.batchesCopy.filter(b=>{
          var check=false;
          var matchAllArr=0;
          if(b.batchNumber.includes(bNum.toLowerCase()) ){
            tempArr.push(b);
          }
        });
           this.batches= tempArr;
           debugger
      }else{
        this.batches=this.batchesCopy.slice();
      }
    }

  }

  deleteBatch(batch) {
    if (confirm("Delete batch?")) {
      this.batchService.deleteBatch(batch).subscribe(res => {
        this.batches = this.batches.filter(elem => elem._id != batch._id);
      });
    }
  }

}

