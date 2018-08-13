import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {ScheduleService} from "../../services/schedule.service"
import {NgbTabChangeEvent} from '../../tabset'
import * as moment from 'moment';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleData:any[];
  EditRowId:any="";
  buttonColor:string='silver';
  @ViewChild('positionN') positionN:ElementRef; 
  @ViewChild('orderN') orderN:ElementRef; 
  @ViewChild('item') item:ElementRef; 
  @ViewChild('costumer') costumer:ElementRef; 
  @ViewChild('productName') productName:ElementRef; 
  @ViewChild('batch') batch:ElementRef; 
  @ViewChild('packageP') packageP:ElementRef; 
  @ViewChild('qty') qty:ElementRef; 
  @ViewChild('date') date:ElementRef; 
  @ViewChild('marks') marks:ElementRef;
  @ViewChild('shift') shift:ElementRef;
  @ViewChild('mkp') mkp:ElementRef; 

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
    status:'open', 
    productionLine:'', 
    pLinePositionN:99,
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
    this.scheduleService.getScheduleByDate(date).subscribe(res=>{
     
      res.map(sced=>
      {
        sced.date= moment(sced.date).format("DD/MM/YY"); 
      });
    
      this.scheduleData=res;
    
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
  
  setType(type, elem){
    console.log("hi " +type);
    console.log("hi " +elem);
   // elem.style.backgroundColor = "red";
    this.typeShown=type;

  }


  edit(id){
    this.EditRowId=id;
}


updateSchedule(){
  let dateSend= this.date.nativeElement.value
  console.log(this.date.nativeElement.value);
  let b=0;
  var idx = dateSend.indexOf("/");
  while (idx != -1) {
    
    idx = dateSend.indexOf("/", idx + 1);
    console.log(idx);
  }
  /*
  let scheduleToUpdate={
    'positionN':this.positionN.nativeElement.value,
    orderN:this.orderN.nativeElement.value,
    item:this.item.nativeElement.value,
    costumer:this.costumer.nativeElement.value,
    productName:this.productName.nativeElement.value,
    batch:this.batch.nativeElement.value,
    packageP:this.packageP.nativeElement.value,
    qty:this.qty.nativeElement.value,
    qtyRdy:'',
    date:this.date.nativeElement.value,
    marks:this.marks.nativeElement.value,
    shift:this.shift.nativeElement.value,
    mkp:this.mkp.nativeElement.value
  }
  console.log(a);
  this.scheduleService.editSchedule(scheduleToUpdate).subscribe(res=>console.log(res));
  */
}
}
