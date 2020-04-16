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
  today: any;
  constructor(private productionSer:ProductionService, private scheduleService:ScheduleService ) { }


  ngOnInit() {
    this.today = new Date();
    this.today= moment( this.today).format("YYYY-MM-DD");
    this.getAllLines();
  }

  getAllLines(){
    this.productionSer.getAllLines().subscribe(res=>{
      this.pLines=res;
      this.getAllSchedule();
    });
  }

  getAllSchedule(){
    this.scheduleService.getScheduleByDate(this.today).subscribe(res => {
     
      res.map(sced=>
      {

        sced.date= moment(sced.date).format("DD/MM/YY");
        if (sced.status == 'filled') sced.color = 'Aquamarine';
        if (sced.status == 'beingFilled') sced.color = 'yellow';
        if (sced.status == 'packed') sced.color = 'orange';
        if (sced.status == 'problem') sced.color = 'red';
      });

      console.log(res);
      this.scheduleData=res.reverse();

    });
  }

  updateSchedule(scheduleId, newLine){
    console.log("a");
    this.scheduleService.updateScheduleLine(scheduleId, newLine).subscribe(res=>{
      console.log(res);
      this.getAllSchedule();
    });
  }


  simpleDrop($event: any, lineNumber: string) {
    console.log($event.dragData);
    console.log($event.dragData.productionLine);
    console.log(lineNumber);
    if ($event.dragData.productionLine !== lineNumber) {
      this.updateSchedule($event.dragData._id, lineNumber);
    }
  }

  deleteSchedule($event) {
    
    console.log($event.dragData);
    this.scheduleService.deleteSchedule($event.dragData._id).subscribe(res => {
      this.scheduleData = this.scheduleData.filter(elem => elem._id != $event.dragData._id);
    });
  }

  setPriorty(scheduleId, newPosition){
    console.log(scheduleId);
    console.log(newPosition);
    this.scheduleService.updateScheduleLinePosition(scheduleId, newPosition).subscribe(res=>{console.log(res)})
  }


  dateChanged(date) {

    console.log(date);
    this.scheduleService.getScheduleByDate(date).subscribe(res => {
      res.map(sced => {
        sced.date= moment(sced.date).format("DD/MM/YY");
        if (sced.status == 'filled') sced.color = 'Aquamarine';
        if (sced.status == 'beingFilled') sced.color = 'yellow';
        if (sced.status == 'packed') sced.color = 'orange';
        if (sced.status == 'problem') sced.color = 'red';
      });
      this.scheduleData = res;
    });
  }
}
