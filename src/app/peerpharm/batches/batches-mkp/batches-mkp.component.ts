import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BatchesService } from 'src/app/services/batches.service';
import { ItemsService } from 'src/app/services/items.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-batches-mkp',
  templateUrl: './batches-mkp.component.html',
  styleUrls: ['./batches-mkp.component.css']
})
export class BatchesMkpComponent implements OnInit {


  mkpBatches:any[];
  currentItem:any;
  currentItemName:any;
  currentBarrels:any;
  currentBatchNumber:any;
  currentExpDate:any;
  currentProduced:any;
  currentOrderN:any;
  currentPH:any;
  currentWeightKG:any;

  @ViewChild('printBtn') printBtn: ElementRef;


  newMkpBatch = {
    order:"",
    item:"",
    itemName:"",
    produced:this.formatDate(new Date()),
    expration:"",
    barrels:"",
    weightKg:"",
    ph:"",
    batchNumber:"",
  }

  constructor(private toastSr:ToastrService,private itemService:ItemsService,private batchService:BatchesService) { }

  ngOnInit() {
    this.getAllMkpBatches();
  }


  getAllMkpBatches(){
    this.batchService.getAllMkpBatches().subscribe(data=>{
      debugger;
      this.mkpBatches = data;

    })
  }

  addNewMkpBatch(){
  debugger;
  this.currentItem = this.newMkpBatch.item
  this.currentItemName = this.newMkpBatch.itemName
  this.currentBarrels = this.newMkpBatch.barrels
  this.currentBatchNumber = this.newMkpBatch.batchNumber
  this.currentExpDate = this.newMkpBatch.expration
  this.currentProduced = this.newMkpBatch.produced
  this.currentOrderN = this.newMkpBatch.order
  this.currentPH = this.newMkpBatch.ph
  this.currentWeightKG =this.newMkpBatch.weightKg

  if(this.newMkpBatch.batchNumber != "") {
    this.batchService.addNewMkpBatch(this.newMkpBatch).subscribe(data=>{
      this.mkpBatches = data;
      setTimeout(() => {
        this.printBtn.nativeElement.click();          
      }, 500);

      this.toastSr.success("נוספה אצווה חדשה")
     this.newMkpBatch.item = ""
   this.newMkpBatch.itemName = ""
      this.newMkpBatch.barrels = ""
  this.newMkpBatch.batchNumber = ""
      this.newMkpBatch.expration = ""
    
     this.newMkpBatch.order =""
      this.newMkpBatch.ph= ""
     this.newMkpBatch.weightKg =""

    })
  }

  
  
  }



  


  fillItemName(ev){
    debugger;
    var itemNumber = ev.target.value;
    this.itemService.getItemData(itemNumber).subscribe(data=>{
      debugger;
      this.newMkpBatch.itemName = data[0].name +' '+ data[0].subName +' '+ data[0].discriptionK

    })

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
}
