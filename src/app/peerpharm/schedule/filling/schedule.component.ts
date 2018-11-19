import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ScheduleService } from "../../../services/schedule.service"
import { ItemsService } from "../../../services/items.service"
import { OrdersService } from "../../../services/orders.service" 
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleData: any[];
  EditRowId: any = "";
  buttonColor: string = 'white';
  buttonColor2: string = '#B8ECF1';
  buttonColor3: string = '#B8ECF1';
  today: any;
  currentType:string="";
  editRadioBtnType:string="";
  @ViewChild('position') positionN: ElementRef;
  @ViewChild('orderNum') orderN: ElementRef;
  @ViewChild('item') item: ElementRef;
  @ViewChild('costumer') costumer: ElementRef;
  @ViewChild('productName') productName: ElementRef;
  @ViewChild('batch') batch: ElementRef;
  @ViewChild('packageP') packageP: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('aaaa') date: ElementRef;
  @ViewChild('marks') marks: ElementRef;
  @ViewChild('shiftA') shift: ElementRef;
  @ViewChild('mkpA') mkp: ElementRef;
  @ViewChild('id') id: ElementRef;

  scheduleLine = {
    scheduleId: '',
    positionN: '',
    orderN: '',
    item: '',
    costumer: '',
    productName: '',
    batch: '',
    packageP: '',
    qty: '',
    qtyRdy: '',
    date: '',
    marks: '',
    shift: '',
    mkp: '',
    status: 'open',
    productionLine: '',
    pLinePositionN: 999,
  }
  typeShown: String = "basic";
  constructor(private scheduleService: ScheduleService, private itemSer: ItemsService,private orderSer: OrdersService) { }


  ngOnInit() {
    
    this.today = new Date();
    this.today= moment( this.today).format("YYYY-MM-DD");
    this.getAllSchedule(this.today);
  }

  writeScheduleData() {
    console.log(this.scheduleLine);
    this.scheduleService.setNewProductionSchedule(this.scheduleLine).subscribe(res => this.scheduleData.push(res));
  }

  dateChanged(date) {
    
    console.log(date);
    this.scheduleService.getScheduleByDate(date).subscribe(res => {
      res.map(sced => {
        if (sced.status == 'filled') sced.color = 'Aquamarine';
        if (sced.status == 'beingFilled') sced.color = 'yellow';
        if (sced.status == 'packed') sced.color = 'orange';
        if (sced.status == 'problem') sced.color = 'red';
        sced.date3 = moment(sced.date).format("YYYY-MM-DD");

        //let pipe = new DatePipe('en-US'); // Use your own locale
        //  sced.date3 = pipe.transform(sced.date, 'short');
      });
      this.scheduleData = res;
    });
  }

  getAllSchedule(today) {
    this.scheduleService.getScheduleByDate(today).subscribe(res=>{
      res.map(sced => {
        sced.color='white';
        if (sced.status == 'filled') sced.color = '#CE90FF';
        if (sced.status == 'beingFilled') sced.color = 'yellow';
        if (sced.status == 'packed') sced.color = 'Aquamarine';
        if (sced.status == 'problem') sced.color = 'red';
        sced.date2 = moment(sced.date).format("DD/MM/YY");
        sced.date3 = moment(sced.date).format("YYYY-MM-DD");
       
      });
      res.map(sced => {
        Object.assign({ isSelected: false }, sced);
      });
      this.scheduleData = res;

    });
  }

  setType(type, elem) {
    console.log("hi " + type);
    console.log("hi " + elem.style);
    switch (type) {
      case 'basic':
        this.buttonColor = "white";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        break;
      case 'tube':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "white";
        this.buttonColor3 = "#B8ECF1";
        break;
      case 'mkp':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "white";
        break;
    }
    this.typeShown = type;

  }


  edit(id, type) {
    this.EditRowId = id;
    this.currentType = type;
  }


  updateSchedule() {
    console.log(this.date.nativeElement.value);
    console.log(this.orderN.nativeElement.value);
    console.log(this.item.nativeElement.value);
    console.log(this.positionN.nativeElement.value);
    console.log(this.costumer.nativeElement.value);
    console.log(this.batch.nativeElement.value);
    console.log(this.packageP.nativeElement.value);
    console.log(this.marks.nativeElement.value);
    console.log(this.shift.nativeElement.value);
    console.log(this.mkp.nativeElement.value);
    console.log(this.qty.nativeElement.value);

    let scheduleToUpdate:any = {
      scheduleId: this.id.nativeElement.value,
      positionN: this.positionN.nativeElement.value,
      orderN: this.orderN.nativeElement.value,
      item: this.item.nativeElement.value,
      costumer: this.costumer.nativeElement.value,
      productName: this.productName.nativeElement.value,
      batch: this.batch.nativeElement.value,
      packageP: this.packageP.nativeElement.value,
      qty: this.qty.nativeElement.value,
      qtyRdy: '',
      date: this.date.nativeElement.value,
      marks: this.marks.nativeElement.value,
      shift: this.shift.nativeElement.value,
      mkp: this.currentType
    }
    console.log(scheduleToUpdate);
    this.scheduleService.editSchedule(scheduleToUpdate).subscribe(res => {
      this.EditRowId = 0;
      scheduleToUpdate.date3 = moment(scheduleToUpdate.date).format("YYYY-MM-DD");
      this.scheduleData[this.scheduleData.findIndex(sced => sced._id == scheduleToUpdate.scheduleId)] = scheduleToUpdate;
      this.editRadioBtnType="";
    });

  }

  setItemDetails(itemNumber) {
    console.log(itemNumber);
    this.itemSer.getItemData(itemNumber).subscribe(res => {
       console.log(res[0]);
      let itemName = res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
      let packageP = res[0].bottleTube+  " "  +  res[0].capTube + " "  + res[0].pumpTube +  " " + res[0].sealTube + " " + res[0].extraText1 + " " + res[0].extraText2;
      this.scheduleLine.productName= itemName;
      this.scheduleLine.packageP = packageP;
    })
  }

  setOrderDetails(orderNumber){
    console.log(orderNumber);
    this.orderSer.getOrderByNumber(orderNumber).subscribe(res=>{
      let costumer = res[0].costumer;
      this.scheduleLine.costumer = costumer;
    })
  }

  deleteLine(id){
      this.scheduleService.deleteSchedule(id).subscribe(res=>{
        this.scheduleData = this.scheduleData.filter(elem=>elem._id!=id);
      });
  }


  filterSchedule(){
    this.scheduleData=this.scheduleData.filter(e => e.isSelected == true);
  }

  handleChange(type){
      this.currentType=type;
  }
  setDone() {
  }
}

