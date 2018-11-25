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
  batches: any[];
  ngOnInit() {

    this.getAllBatches();
    this.startInterval();
  }

  stopInterval() {
    clearInterval(this.myRefresh)
  }

  startInterval() {
    this.myRefresh = setInterval(()=>{this.getAllBatches();}, 1000*60*3);
  }


  getAllBatches() {

    this.batchService.getAllBatches().subscribe((res) => {
      console.log(res);
      this.batches = res;
      this.batches.map(batch => {
        if (batch.weightKg != null && batch.weightQtyLeft != null) {
          if (batch.weightQtyLeft == 0) batch.color = 'Aquamarine';
          else if (batch.weightQtyLeft < batch.weightKg) batch.color = "yellow";
          else batch.color = "white";
        }
      })
    });
  }



}

