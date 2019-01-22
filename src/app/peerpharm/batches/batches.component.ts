import { Component, OnInit } from '@angular/core';
import { BatchesService } from '../../services/batches.service'

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {
  myRefresh: any = null;

  constructor(private batchService: BatchesService) { }
  batches: Array<any>;
  batchesCopy: Array<any>;
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

  changeText(ev, filterBy)
  {
    debugger
    if(filterBy=='itemName'){
      let word= ev.target.value;
      let wordsArr= word.split(" ");
      wordsArr= wordsArr.filter(x=>x!="");
      if(wordsArr.length>0){
        let tempArr=[];
        this.batches.filter(b=>{
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
        this.batches.filter(b=>{
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

