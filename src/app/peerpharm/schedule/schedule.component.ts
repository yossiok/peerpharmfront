import { Component, OnInit } from '@angular/core';
import {ScheduleService} from "../../services/schedule.service"
import {NgbTabChangeEvent} from '../../tabset'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleData:any[];
  scheduleLine = {
    positionN:'',
    orderN:'',
    item:'',
    costumer:'',
    productName:'',
    batch:'',
    packageP:'',
    qty:'',
    qtyRdy:'',
    date:'',
    marks:'',
    shift:'',
    mkp:'',
    status:'open'
  }
  typeShown:String="basic";
  constructor(private scheduleService:ScheduleService ) { }

  
  ngOnInit() {
    this.getAllSchedule();
  }

  writeScheduleData(){
    console.log(this.scheduleLine);
    this.scheduleService.setNewProductionSchedule(this.scheduleLine).subscribe(res=>console.log(res));
  }

  dateChanged(date){
    console.log(date);
    this.scheduleService.getScheduleByDate(date).subscribe(res=>console.log(res));
  }

  getAllSchedule(){
    this.scheduleService.getSchedule().subscribe(res=>this.scheduleData=res);
  }
  
  setType(type){
    console.log("hi " +type);
    this.typeShown=type;
  }


}
