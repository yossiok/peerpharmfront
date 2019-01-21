  import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
  import {ScheduleService} from "../../../services/schedule.service"
  //import {NgbTabChangeEvent} from '../../../tabset'
  import * as moment from 'moment';
import { DatepickerComponent } from 'angular2-material-datepicker';
import { ToastrService } from 'ngx-toastr';
  
  @Component({
    selector: 'app-schedule',
    templateUrl: './printing.component.html',
    styleUrls: ['./printing.component.css']
  })
  export class PrintingComponent implements OnInit {
    today:any;
    scheduleData:any[];
    EditRowId:any="";
    buttonColor:string='silver';
    dateToEditStr:any;
    lineColorDone: string = 'Aquamarine';
    lineColorPastDue: string = 'rgb(250, 148, 148)';
    @ViewChild('position') positionN:ElementRef; 
    @ViewChild('orderN') orderN:ElementRef; 
    @ViewChild('item') item:ElementRef; 
    @ViewChild('costumer') costumer:ElementRef; 
    @ViewChild('productName') productName:ElementRef; 
    @ViewChild('batch') batch:ElementRef; 
    @ViewChild('packageP') packageP:ElementRef; 
    @ViewChild('nextStation') nextStation:ElementRef; 
    @ViewChild('qty') qty:ElementRef; 
    @ViewChild('qtyRdy') qtyRdy:ElementRef; 
    // @ViewChild('date') date:ElementRef; 
    @ViewChild('marks') marks:ElementRef;
    @ViewChild('printType') printType:ElementRef;
    @ViewChild('blockImg') blockImg:ElementRef;
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
      date:'' ,
      dateRdy:'',
      marks:'',
      mkp:'',
      nextStation:'',
      printType:'',
      palletN:'',
      status:'open',
    }
    
    typeShown:String="basic";
    constructor(private scheduleService:ScheduleService , private toastSrv: ToastrService) { }
  
    
    ngOnInit() {
      this.today= new Date();
      this.today = moment(this.today).format("YYYY-MM-DD");
      this.scheduleLine.date=this.today;
      this.getAllSchedule();
    }
  
    writeScheduleData(){
      console.log(this.scheduleLine);
      this.scheduleService.setNewPrintSchedule(this.scheduleLine).subscribe(res=>{
      });
    }
  
    dateChanged(date){
      // date=date.setHours(2,0,0,0);
      debugger
      date=moment(date).format();
      debugger
      this.scheduleService.getPrintScheduleByDate(date).subscribe(
        res=>{
          // showing only for that date 
          res.map(elem=>{
            let pastDue=(moment(elem.date).format() < moment(this.today).format());
            if(elem.status=="printed") {
              elem.trColor=this.lineColorDone;
            }else if (pastDue){
              elem.trColor=this.lineColorPastDue;
            }
          });
          this.scheduleData=res;
        }
      )

    }
  
    getAllSchedule(){
      this.scheduleService.getOpenPrintSchedule().subscribe(res=>{
        res.map(elem=>{
          let pastDue=(moment(elem.date).format() < moment(this.today).format());

          if(elem.status=="printed" && !pastDue) elem.trColor="Aquamarine";
          if(elem.date) {
            // let d=moment(elem.date).format();
            // let td=moment(this.today).format();
            // let pastDue=(moment(elem.date).format() < moment(this.today).format());
            if(pastDue) elem.trColor="rgb(250, 148, 148)";            
          }
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

      this.scheduleData.filter(x=> {
        if(x._id==id){
          this.dateToEditStr=moment(x.date).format("YYYY-MM-DD");
        }
      } ); 
      debugger
      this.EditRowId=id;
      debugger
  }
  
  
  updateSchedule(line){
    if (!line.qtyProduced) line.qtyProduced=0; 
    if (!line.amountPckgs) line.amountPckgs=0; 

    let dateToUpdate= moment(this.dateToEditStr).format();
    if(this.dateToEditStr!="" && this.item.nativeElement.value!=""){
      let scheduleToUpdate={
        scheduleId:line._id,
        // positionN:line.position,
        orderN:this.orderN.nativeElement.value,
        item:this.item.nativeElement.value,
        costumer:this.costumer.nativeElement.value,
        productName:this.productName.nativeElement.value,
        batch:this.batch.nativeElement.value,
        // packageP:line.packageP,
        qty:this.qty.nativeElement.value,
        qtyRdy:line.qtyProduced, // in PrintSchedule the field is called "qtyProduced" we change it in server side
        // date:this.date.nativeElement.value,
        date: dateToUpdate,
        marks:this.marks.nativeElement.value,
        // shift:this.shift.nativeElement.value,
        // mkp:this.mkp.nativeElement.value
      }
      if (confirm("update schedule line?")) {
        this.scheduleService.updatePrintSchedule(scheduleToUpdate).subscribe(res=>{
          if(res.nModified==1 && res.n==1){
            console.log(res);
            this.toastSrv.success("Changes Saved to item ", line.itemN);
          } else if(res.nModified==0 && res.n==1){
            this.toastSrv.info("Item "+ line.itemN+ " is already updated to changes");
          } else if(res.ok==0){
            this.toastSrv.error("Failed to update item ", line.itemN);
          }
          this.EditRowId="";
        });  
      }
    }
  
  }
  
  setDone(id, orderN, itemN, line){
    if (!line.qtyProduced) line.qtyProduced=0; 
    if (!line.amountPckgs) line.amountPckgs=0; 
    // let today = new Date();
    // today.setHours(2,0,0,0);



    var amountPrinted = prompt("Enter Amount Printed\nCurrent printed amount: "+line.qtyRdy+"\nFrom total Amount :"+line.qty, line.qtyProduced);
    var amountPckgs = prompt("Enter Amount Printed\nCurrent printed amount: "+line.amountPckgs,line.amountPckgs ); 
    if(amountPckgs!=null && amountPrinted!=null){
      var scheduleToUpdate={
        scheduleId:id,
        qtyRdy:amountPrinted,
        amountPckgs:amountPckgs,
        printDate:this.today,
        orderN:orderN,
        itemN:itemN,
        status:'partial printing'
      }
      if (amountPrinted >= line.qty ){
          var a = confirm("Amount printed: "+amountPrinted+"\nRequired Amount: "+line.qty+"\nPrint process is done ?");
          if (a == true) {
            scheduleToUpdate.status="printed";
            line.trColor="Aquamarine";
            debugger
          }
      }
      this.scheduleService.updatePrintSchedule(scheduleToUpdate).subscribe(res=>{
        if(res.nModified==1 && res.n==1){
          if (a == true) {
            this.scheduleData.map(scd=>{
              if(scd._id==line._d) scd.trColor=this.lineColorDone;
            })
            debugger
            // line.trColor="Aquamarine";
          }
          line.qtyProduced=amountPrinted;
          line.amountPckgs=amountPckgs;
          this.toastSrv.success("Changes Saved to item ", line.itemN);
        } else if(res.nModified==0 && res.n==1){
          this.toastSrv.info("Item "+ line.itemN+ " is already updated to changes");
        } else if(res.ok==0){
          this.toastSrv.error("Failed to update item ", line.itemN);
        }
      });
    }
  }


  deleteLine(id) {
    this.scheduleService.deletePrintSchedule(id).subscribe(res => {
      this.scheduleData = this.scheduleData.filter(elem => elem._id != id);
    });
  }
  

  showImg(src){
      window.open(src);
  }
  }

  