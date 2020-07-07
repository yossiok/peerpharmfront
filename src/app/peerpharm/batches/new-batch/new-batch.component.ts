import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { BatchesService } from 'src/app/services/batches.service';

@Component({
  selector: 'app-new-batch',
  templateUrl: './new-batch.component.html',
  styleUrls: ['./new-batch.component.css']
})
export class NewBatchComponent implements OnInit {

  newBatch = {
    orderNumber:'',
    itemNumber:'',
    name:'',
    productionDate:'',
    expirationDate:'',
    barrels:'',
    ph:'',
    kg:'',
    batchNumber:'',
  }

  constructor(private toastSrv:ToastrService,private itemSrv:ItemsService,private batchService:BatchesService) { }

  ngOnInit() {
  }



  fillItemName(ev){
  var itemNumber = ev.target.value;

  this.itemSrv.getItemData(itemNumber).subscribe(data=>{
    if(data){
      this.newBatch.name = data[0].name+' '+data[0].subName+' '+data[0].discriptionK

    } else {
      this.toastSrv.error('פריט לא קיים במערכת')
    }
  })
  }

  addNewBatch(){

    this.batchService.addBatch(this.newBatch).subscribe(data=>{
    if(data){
      this.toastSrv.success('באטצ נוסף בהצלחה !')
      this.newBatch.barrels = ''
      this.newBatch.ph = ''
      this.newBatch.kg = ''
      this.newBatch.productionDate = ''
      this.newBatch.expirationDate = ''
      this.newBatch.orderNumber = ''
      this.newBatch.name = ''
      this.newBatch.itemNumber = ''
      this.newBatch.batchNumber = '20pp'
    }
    })

  }
}
