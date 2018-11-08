import { Component, OnInit } from '@angular/core';
import {BatchesService} from '../../services/batches.service'

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {

  constructor(private batchService:BatchesService) { }
  batches:any[];
  ngOnInit() {

    this.batchService.getAllBatches().subscribe((res)=>{
      console.log(res);
      this.batches=res;
      this.batches.map(batch=>{
        if(batch.weightKg!=null && batch.weightQtyLeft!=null){
          if(batch.weightQtyLeft==0) batch.color='Aquamarine';
          else if(batch.weightQtyLeft<batch.weightKg) batch.color="yellow";
        }
      })
    });
  }

}
