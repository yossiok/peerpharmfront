import { Component, OnInit } from '@angular/core';
import {ProductionService} from '../../../services/production.service'
@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css']
})
export class LinesComponent implements OnInit {

  pLines=[];
  lineObj= {
    number:'',
    discription:'',
    type:'',
    location:'',
    startDate:'',
    image:''
  }
  constructor(private productionSer:ProductionService) { } 

  ngOnInit() {
    this.getAllLines();
  }

  getAllLines(){
    this.productionSer.getAllLines().subscribe(res=>this.pLines=res);
  }

  addLine(){
    this.productionSer.addNewProductionLine(this.lineObj).subscribe(res=>console.log(res));
  }

}
