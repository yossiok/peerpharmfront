import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from '../../../services/schedule.service';

@Component({
  selector: 'app-makeup',
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.css']
})
export class MakeupComponent implements OnInit {
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
    itemN:'',
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
  constructor(private scheduleService:ScheduleService ) { }

  ngOnInit() {
  }


  
  writeScheduleData(){
    console.log(this.scheduleLine);
    this.scheduleService.setNewPrintSchedule(this.scheduleLine).subscribe(res=>console.log(res));
  }

  dateChanged(date){

    this.scheduleService.getPrintScheduleByDate(date).subscribe(
      res=>{
        res.map(elem=>{if(elem.status=="printed") elem.color="Aquamarine"})
        this.scheduleData=res;
      }
    )

  }

  getAllSchedule(){
    this.scheduleService.getOpenPrintSchedule().subscribe(res=>{
      console.log(res);      
      this.scheduleData=res;
    
    });
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
    console.log(scheduleToUpdate);
    this.scheduleService.updatePrintSchedule(scheduleToUpdate).subscribe(res=>console.log(res));
  
  }
  
  setDone(id, orderN, itemN){
    let today = new Date();
    today.setHours(3,0,0,0);
    //var _dt2 = new Date(today);
    //today = [_dt2.getDate(), _dt2.getMonth() + 1, _dt2.getFullYear()].join('/');
    var amountPrinted = prompt("Enter Amount Printed", "");
    var amountPckgs = prompt("Enter Amount pf packages", "");  //for print sticker later
    if (amountPrinted == null || amountPrinted == "" || amountPckgs == null || amountPckgs == "") {
    }else {
      console.log(amountPckgs + " , " + amountPrinted);
    }
    var tempItem, tempOrderN, itemRemarks = "";
    var a = confirm("Print process is done ?");
    if (a == true) {
      let scheduleToUpdate={
        scheduleId:id,
        qtyProduced:amountPrinted,
        amountPckgs:amountPckgs,
        printDate:today,
        orderN:orderN,
        itemN:itemN,
        status:'printed'
      }
      console.log(scheduleToUpdate);
      this.scheduleService.updatePrintSchedule(scheduleToUpdate).subscribe(res=>console.log(res));
    }
  }
}