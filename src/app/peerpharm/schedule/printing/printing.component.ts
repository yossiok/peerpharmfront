  import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
  import {ScheduleService} from "../../../services/schedule.service"
  import {NgbTabChangeEvent} from '../../../tabset'
  import * as moment from 'moment';
  
  @Component({
    selector: 'app-schedule',
    templateUrl: './printing.component.html',
    styleUrls: ['./printing.component.css']
  })
  export class PrintingComponent implements OnInit {
    scheduleData:any[];
    EditRowId:any="";
    buttonColor:string='silver';
    @ViewChild('position') positionN:ElementRef; 
    @ViewChild('orderN') orderN:ElementRef; 
    @ViewChild('item') item:ElementRef; 
    @ViewChild('costumer') costumer:ElementRef; 
    @ViewChild('productName') productName:ElementRef; 
    @ViewChild('batch') batch:ElementRef; 
    @ViewChild('packageP') packageP:ElementRef; 
    @ViewChild('qty') qty:ElementRef; 
    @ViewChild('aaaa') date:ElementRef; 
    @ViewChild('marks') marks:ElementRef;
    @ViewChild('shift') shift:ElementRef;
    @ViewChild('mkp') mkp:ElementRef; 
    @ViewChild('id') id:ElementRef; 
  
    scheduleLine = {
      itemImg:'',
      positionN:'',
      orderN:'',
      cmptN:'',
      cmptName:'',
      costumer:'',
      productName:'',
      color:'',
      packageP:'',
      qty:'',
      qtyRdy:'',
      date:'',
      dateRdy:'',
      marks:'',
      mkp:'',
      nextStation:'',
      printType:'',
      palletN:'',
      status:'open',
    }
    
    typeShown:String="basic";
    constructor(private scheduleService:ScheduleService ) { }
  
    
    ngOnInit() {
      this.getAllSchedule();
    }
  
    writeScheduleData(){
      console.log(this.scheduleLine);
      this.scheduleService.setNewPrintSchedule(this.scheduleLine).subscribe(res=>console.log(res));
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
      this.scheduleService.getOpenPrintSchedule().subscribe(res=>{
        console.log(res);
       /*
        res.map(sced=>
        {
        //  sced.date= moment(sced.date).format("DD/MM/YY"); 
          sced.date2= moment(sced.date).format("DD/MM/YY"); 
          sced.date3= moment(sced.date).format("YYYY-MM-DD"); 
        });*/
      
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
    console.log(this.date.nativeElement.value);
    console.log(this.orderN.nativeElement.value);
    console.log(this.item.nativeElement.value);
    
    let scheduleToUpdate={
      scheduleId:this.id.nativeElement.value,
      positionN:this.positionN.nativeElement.value,
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
    this.scheduleService.editSchedule(scheduleToUpdate).subscribe(res=>console.log(res));
  
  }
  
  setDone(){
  }
  
  }
  