import { Component, OnInit } from '@angular/core';
import {ProductionService} from '../../../services/production.service'
import {ScheduleService} from "../../../services/schedule.service"
import * as moment from 'moment';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnInit {
  pLines=[];
  scheduleData:any[];
  constructor(private productionSer:ProductionService, private scheduleService:ScheduleService ) { }

 
  ngOnInit() {
    this.getAllLines();
  }

  getAllLines(){
    this.productionSer.getAllLines().subscribe(res=>{
      this.pLines=res;
      this.getAllSchedule();
    });
  }

  getAllSchedule(){
    this.scheduleService.getSchedule().subscribe(res=>{
     
      res.map(sced=>
      {
        sced.date= moment(sced.date).format("DD/MM/YY"); 
      });
    
      this.scheduleData=res;
    
    });
  }
}
