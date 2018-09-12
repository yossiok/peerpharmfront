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
    });
  }

}
