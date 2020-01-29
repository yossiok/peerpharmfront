import { Component, OnInit } from '@angular/core';
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
    this.batchService.addNewMkpBatch(this.newMkpBatch).subscribe(data=>{
      this.mkpBatches = data;
      this.toastSr.success("נוספה אצווה חדשה")

    })
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
