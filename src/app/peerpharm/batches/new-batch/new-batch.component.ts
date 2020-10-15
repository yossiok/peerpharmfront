import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { BatchesService } from 'src/app/services/batches.service';

@Component({
  selector: 'app-new-batch',
  templateUrl: './new-batch.component.html',
  styleUrls: ['./new-batch.component.scss']
})
export class NewBatchComponent implements OnInit {

  allStickers:any[]=[];
  newBatch = {
    order:'',
    item:'',
    itemName:'',
    produced:this.formatDate(new Date()),
    expration:'',
    barrels:'',
    ph:'',
    weightKg:'',
    weightQtyLeft:'',
    batchNumber:'20pp',
    batchCreated:0
  }
  lastBatch:any;
  @ViewChild('printBtn') printBtn: ElementRef;

  constructor(private toastSrv:ToastrService,private itemSrv:ItemsService,private batchService:BatchesService) { }

  ngOnInit() {
    this.getLastBatch();
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  getLastBatch(){
    this.batchService.getLastBatch().subscribe(data=>{
    this.lastBatch = data;
    })
  }



  fillItemName(ev){
  var itemNumber = ev.target.value;

  this.itemSrv.getItemData(itemNumber).subscribe(data=>{
    if(data){
      this.newBatch.itemName = data[0].name+' '+data[0].subName+' '+data[0].discriptionK

    } else {
      this.toastSrv.error('פריט לא קיים במערכת')
    }
  })
  }

  addNewBatch(){
   
    
    if(parseInt(this.newBatch.barrels)>1)
    {
      for(let x=1; x<parseInt(this.newBatch.barrels)+1 ;x++)
      {
        let obj={
          item:{currentItem:this.newBatch.item,
            currentItemName: this.newBatch.itemName ,
            currentBarrels: this.newBatch.barrels ,
            currentBatchNumber: this.newBatch.batchNumber ,
            currentExpDate:  this.newBatch.expration ,
            currentProduced: this.newBatch.produced  ,
            currentOrderN: this.newBatch.order ,
            currentPH: this.newBatch.ph ,
            currentWeightKG: this.newBatch.weightKg   
          },
          printNum:""+x+"/"+(parseInt(this.newBatch.barrels))
        } 
        this.allStickers.push(obj);
  
      }
   
    }
    else{
      let obj={
        item:{currentItem:this.newBatch.item,
          currentItemName: this.newBatch.itemName ,
          currentBarrels: this.newBatch.barrels ,
          currentBatchNumber: this.newBatch.batchNumber ,
          currentExpDate:  this.newBatch.expration ,
          currentProduced: this.newBatch.produced  ,
          currentOrderN: this.newBatch.order ,
          currentPH: this.newBatch.ph ,
          currentWeightKG: this.newBatch.weightKg   
        },
        printNum:"1/1"
      } 
      this.allStickers.push(obj);
    }
    this.newBatch.weightQtyLeft = this.newBatch.weightKg
    var today = new Date();
    today.setFullYear(today.getFullYear() + Number(this.newBatch.expration));
    this.newBatch.expration = JSON.stringify(today)
    this.newBatch.expration = this.newBatch.expration.slice(1,11)
    debugger;
    this.newBatch.batchNumber = this.newBatch.batchNumber.toLowerCase();
    this.newBatch.batchCreated = new Date().getTime();
    this.batchService.addBatch(this.newBatch).subscribe(data=>{
    if(data){
      this.printBtn.nativeElement.click();  
      this.toastSrv.success('באטצ נוסף בהצלחה !')
      this.newBatch.barrels = ''
      this.newBatch.ph = ''
      this.newBatch.weightKg = ''
      this.newBatch.produced = ''
      this.newBatch.expration = ''
      this.newBatch.order = ''
      this.newBatch.itemName = ''
      this.newBatch.weightQtyLeft =''
      this.newBatch.item = ''
      this.newBatch.batchNumber = '20pp'
      this.allStickers = [];
      this.getLastBatch();
    }
    })

  }


}
