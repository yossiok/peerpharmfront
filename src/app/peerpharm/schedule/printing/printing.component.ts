import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ScheduleService } from "../../../services/schedule.service"
//import {NgbTabChangeEvent} from '../../../tabset'
import * as moment from 'moment';
import { DatepickerComponent } from 'angular2-material-datepicker';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { ArrayServiceService } from 'src/app/utils/array-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.scss']
})
export class PrintingComponent implements OnInit {
  today: any;
  scheduleData: any[];
  EditRowId: any = "";
  editPosId: any = "";
  buttonColor: string = 'silver';
  dateToEditStr: any;
  lineColorDone: string = 'Aquamarine';
  lineColorPastDue: string = 'rgb(250, 148, 148)';
  @ViewChild('position') positionN: ElementRef;
  @ViewChild('orderN') orderN: ElementRef;
  @ViewChild('item') item: ElementRef;
  @ViewChild('costumer') costumer: ElementRef;
  @ViewChild('scheduleDate') scheduleDate: ElementRef;
  @ViewChild('scheduleP') scheduleP: ElementRef;
  @ViewChild('cmptN') cmptN: ElementRef;
  @ViewChild('cmptName') cmptName: ElementRef;
  @ViewChild('color') color: ElementRef;
  @ViewChild('packageP') packageP: ElementRef;
  @ViewChild('nextStation') nextStation: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('qtyRdy') qtyRdy: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('marks') marks: ElementRef;
  @ViewChild('printType') printType: ElementRef;
  @ViewChild('blockImg') blockImg: ElementRef;
  @ViewChild('shift') shift: ElementRef;
  @ViewChild('mkp') mkp: ElementRef;
  @ViewChild('id') id: ElementRef;
  @ViewChild('itemImg') itemImg: ElementRef;
  fetchingSchedules: boolean;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
    this.editPosition('');
  }

  scheduleLine = {
    itemN: '',
    itemImg: '',
    positionN: '',
    orderN: '',
    cmptN: '',
    cmptName: '',
    costumer: '',
    productName: '',
    color: '',
    packageP: '',
    qty: '',
    qtyRdy: '',
    date: '',
    scheduleDate: '',
    dateRdy: '',
    marks: '',
    mkp: '',
    nextStation: '',
    printType: '',
    palletN: '',
    status: 'open',
  }

  typeShown: String = "basic";
  currModalImgArr: Array<any>;
  openImgModal: Boolean = false;
  constructor(
    private arrayService: ArrayServiceService,
    private scheduleService: ScheduleService,
    private toastSrv: ToastrService,
    private itemsService: ItemsService,
    private excelService: ExcelService,
    private authService: AuthService
  ) { }


  ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format("YYYY-MM-DD");
    this.scheduleLine.date = this.today;
    this.dateChanged(this.today);
    // this.getAllSchedule();
  }

  checkPermission() {
    return this.authService.loggedInUser.screenPermission == '5'
  }

  writeScheduleData() {
    console.log(this.scheduleLine);
    this.scheduleService.setNewPrintSchedule(this.scheduleLine).subscribe(res => {
    });
  }

  exportToExcel() {
    let excel = []
    for(let line of this.scheduleData) {
      excel.push({
        Item: line.itemN,
        "Item Name": line.itemName,
        Order: line.orderN,
        Customer: line.costumer,
        status: line.status,
        Component: line.cmptN,
        "Component Name": line.cmptName,
        color: line.color,
        "Total Quantity": line.qty,
        "Quantity Produced": line.qtyProduced,
        "Schedule Date": line.scheduleDate ? line.scheduleDate.toString().slice(0,10) : "Not Defined",
        "Print Date": line.printDate ? line.printDate.toString().slice(0,10) : "Not Defined",
        Position: line.position,
        Remarks: line.marks,
      })
    }
    this.excelService.exportAsExcelFile(excel, `Printing Schedule ${new Date().toString().slice(0,10)}`)
  }

  dateChanged(date) {
    date = new Date(date)
    // date=date.setHours(2,0,0,0);
    if (moment.isDate(date)) {

      date = moment(date).format("YYYY-MM-DD");

      this.scheduleService.getPrintScheduleByDate(date).subscribe(
        res => {
          if (res.msg == 'Failed') this.toastSrv.error('Wrong date!')
          else {
            // showing only for that date 
            res.map(elem => {
              let pastDue = (moment(elem.date).format() < moment(this.today).format());
              if (elem.status == "printed") elem.trColor = this.lineColorDone;
              else if (pastDue) elem.trColor = this.lineColorPastDue
            });
            this.scheduleData = res;
          }
        })
    }
    else this.toastSrv.error('Invalid Date!')
  }

  getAllSchedule() {
    this.fetchingSchedules = true;
    this.date.nativeElement.value = "";

    this.scheduleService.getAllPrintSchedule().subscribe(res => {
      this.fetchingSchedules = false
      res.map(elem => {
        console.log(elem);
        let pastDue = (moment(elem.date).format() < moment(this.today).format());
        if (elem.status == "printed") elem.trColor = "Aquamarine";
        if (elem.status != "printed" && pastDue) elem.trColor = "rgb(250, 148, 148)";
      });

      this.scheduleData = res;
    });
  }



  getOpenAllSchedule() {
    this.fetchingSchedules = true;
    this.date.nativeElement.value = "";
    this.scheduleService.getOpenPrintSchedule().subscribe(res => {
      this.fetchingSchedules = false;
      res.map(elem => {
        let pastDue = (moment(elem.date).format() < moment(this.today).format());
        if (pastDue) elem.trColor = "rgb(250, 148, 148)";
      });
      res.sort(function (a, b) { return a - b });
      this.scheduleData = res;
    });
  }

  setType(type, elem) {
    console.log("hi " + type);
    console.log("hi " + elem);
    // elem.style.backgroundColor = "red";
    this.typeShown = type;

  }


  edit(id) {

    this.scheduleData.filter(x => {
      if (x._id == id) {
        this.dateToEditStr = moment(x.date).format("YYYY-MM-DD");
      }
    });

    this.EditRowId = id;

  }


  editPosition(id) {

    if (id != '') {
      this.editPosId = id
    } else {
      this.editPosId = ''
    }

  }

  updateLinePosition(id) {

    var position = Number(this.scheduleP.nativeElement.value);
    this.scheduleService.updatePrintPosition(id, position).subscribe(data => {
      ;
      let schedule = this.scheduleData.find(s => s._id == data._id);
      schedule.position = data.position;
      this.editPosition('');
      this.toastSrv.success('מיקום עודכן בהצלחה')
    })

  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }


  updateSchedule(line) {
    ;
    if (!line.qtyProduced) line.qtyProduced = 0;
    if (!line.amountPckgs) line.amountPckgs = 0;

    let dateToUpdate = moment(this.dateToEditStr).format();
    if (this.dateToEditStr != "" && this.item.nativeElement.value != "") {

      let scheduleToUpdate = {
        scheduleId: line._id,
        orderN: this.orderN.nativeElement.value,
        itemN: this.item.nativeElement.value,
        itemName: line.value,
        costumer: this.costumer.nativeElement.value,
        scheduleDate: this.scheduleDate.nativeElement.value,

        cmptName: this.cmptName.nativeElement.value,
        cmptN: this.cmptN.nativeElement.value,
        color: this.color.nativeElement.value,
        qty: this.qty.nativeElement.value,
        qtyRdy: line.qtyProduced, // in PrintSchedule the field is called "qtyProduced" we change it in server side
        date: dateToUpdate,
        marks: this.marks.nativeElement.value,
        nextStation: this.nextStation.nativeElement.value,
        printType: this.printType.nativeElement.value,
        itemImg: this.itemImg.nativeElement.value,
      }
      if (confirm("update schedule line?")) {
        console.log('scheduleToUpdate ', scheduleToUpdate);
        this.scheduleService.updatePrintSchedule(scheduleToUpdate).subscribe(res => {
          if (res._id) {
            this.toastSrv.success("Changes Saved to item ", res.itemN);
            this.scheduleData.filter((sch, key) => {
              if (sch._id == res._id) {

                // sch=res; //NOT WORKING WELL - we turned to quick fix
                sch.cmptN = scheduleToUpdate.cmptN;
                sch.cmptName = scheduleToUpdate.cmptName;
                sch.color = scheduleToUpdate.color;
                sch.costumer = scheduleToUpdate.costumer;
                sch.scheduleDate = scheduleToUpdate.scheduleDate;

                sch.date = scheduleToUpdate.date;
                sch.itemN = scheduleToUpdate.itemN;
                sch.itemName = scheduleToUpdate.itemName;
                sch.marks = scheduleToUpdate.marks;
                sch.nextStation = scheduleToUpdate.nextStation;
                sch.orderN = scheduleToUpdate.orderN;
                sch.printType = scheduleToUpdate.printType;
                sch.qty = scheduleToUpdate.qty;
                sch.qtyProduced = scheduleToUpdate.qtyRdy;
                sch.itemImg = scheduleToUpdate.itemImg;
              }
              if (key + 1 == this.scheduleData.length) {
                this.EditRowId = '';
              }
            });

          } else {
            this.toastSrv.error("Failed to update item ", line.itemN);
          }
          // this.EditRowId="";
        });
      }
    }

  }

  setDone(id, orderN, itemN, line) {
    ;
    if (!line.qtyProduced) line.qtyProduced = 0;
    if (!line.amountPckgs) line.amountPckgs = 0;

    var amountPrinted = prompt("Enter Amount Printed\nCurrent printed amount: " + line.qtyProduced + "\nFrom total Amount of:" + line.qty, line.qtyProduced);
    var amountPckgs = prompt("How many packages?\nCurrent printed amount: " + line.amountPckgs, line.amountPckgs);
    if (amountPckgs != null && amountPrinted != null) {
      var scheduleToUpdate = {
        scheduleId: id,
        qtyRdy: amountPrinted,
        amountPckgs: amountPckgs,
        printDate: this.today,
        orderN: orderN,
        itemN: itemN,
        status: 'partial printing'
      }
      var a = confirm("Amount printed: " + amountPrinted + "\nRequired Amount: " + line.qty + "\nPrint process is done ?");
      if (a == true) {
        scheduleToUpdate.status = "printed";
        line.trColor = "Aquamarine";

      }
      this.scheduleService.updatePrintSchedule(scheduleToUpdate).subscribe(res => {
        if (res._id) {
          console.log(res);
          this.toastSrv.success("Changes Saved to item ", res.itemN);
          this.scheduleData.map(sch => {
            if (sch._id == res._id) {
              sch.qtyProduced = scheduleToUpdate.qtyRdy;
              sch.status = scheduleToUpdate.status;
              sch.printDate = scheduleToUpdate.printDate;
              sch.amountPckgs = scheduleToUpdate.amountPckgs;
              this.EditRowId = '';
            }
          });

        } else {
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

  showItemImg(itemNumber) {
    this.itemsService.getItemData(itemNumber).subscribe(doc => {
      if (doc[0].imgMain1 != "" && doc[0].imgMain1 != undefined && doc[0].imgMain1 != null && doc[0].imgMain1 != "null") {
        window.open(doc[0].imgMain1);
      } else if (doc[0].imgMain2 != "" && doc[0].imgMain2 != undefined && doc[0].imgMain2 != null && doc[0].imgMain2 != "null") {
        window.open(doc[0].imgMain2);
      } else if (doc[0].imgMain3 != "" && doc[0].imgMain3 != undefined && doc[0].imgMain3 != null && doc[0].imgMain3 != "null") {
        window.open(doc[0].imgMain3);
      } else {
        this.toastSrv.error("No main image for this item")
      }
    });
  }

  async openItemImg(itemNumber) {

    // this.openImgModal = true;
    this.currModalImgArr = [];
    this.openImgModal = false;
    await this.itemsService.getItemData(itemNumber).subscribe(doc => {
      this.currModalImgArr = [];

      if (doc[0].imgMain1 != "" && doc[0].imgMain1 != undefined && doc[0].imgMain1 != null && doc[0].imgMain1 != "null") {
        this.currModalImgArr.push(doc[0].imgMain1);
      }
      if (doc[0].imgMain2 != "" && doc[0].imgMain2 != undefined && doc[0].imgMain2 != null && doc[0].imgMain2 != "null") {
        this.currModalImgArr.push(doc[0].imgMain2);
      }
      if (doc[0].imgMain3 != "" && doc[0].imgMain3 != undefined && doc[0].imgMain3 != null && doc[0].imgMain3 != "null") {
        this.currModalImgArr.push(doc[0].imgMain3);
      }

      if (this.currModalImgArr.length > 0) {
        this.openImgModal = true;
      } else {
        this.toastSrv.error("No item images");
      }

    });

  }

  showImg(src) {
    window.open(src);
  }

}

