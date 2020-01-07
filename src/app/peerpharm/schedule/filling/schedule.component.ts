import { Component, OnInit, ElementRef, ViewChild, HostListener } from "@angular/core";
import { ScheduleService } from "../../../services/schedule.service";
import { ItemsService } from "../../../services/items.service";
import { OrdersService } from "../../../services/orders.service";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { Schedule } from './../models/schedule';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.css"]
})
export class ScheduleComponent implements OnInit {
  scheduleData: any[];
  EditRowId: any = "";
  buttonColor: string = "white";
  buttonColor2: string = "#B8ECF1";
  buttonColor3: string = "#B8ECF1";
  buttonColor4: string = "#B8ECF1";
  today: any;
  currentType: string = "";
  editRadioBtnType: string = "";

  closeResult: string;
  public printScheduleFillingForm: FormGroup;
  schedFillLine = new Schedule;

  @ViewChild("position") positionN: ElementRef;
  @ViewChild("orderNum") orderN: ElementRef;
  @ViewChild("item") item: ElementRef;
  @ViewChild("costumer") costumer: ElementRef;
  @ViewChild("productName") productName: ElementRef;
  @ViewChild("batch") batch: ElementRef;
  @ViewChild("packageP") packageP: ElementRef;
  @ViewChild("qty") qty: ElementRef;
  @ViewChild("aaaa") date: ElementRef;
  @ViewChild("marks") marks: ElementRef;
  @ViewChild('shiftA') shift: ElementRef;
  @ViewChild('mkpA') mkp: ElementRef;
  @ViewChild('id') id: ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('', this.currentType);
  }

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
    itemImpRemark:'',
  };
  typeShown: String = 'basic';
  constructor(
    private scheduleService: ScheduleService,
    private itemSer: ItemsService,
    private orderSer: OrdersService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format('YYYY-MM-DD');
    this.getAllSchedule(this.today);

    this.printScheduleFillingForm = new FormGroup({
      position: new FormControl('', [Validators.required]),
      orderN: new FormControl('', [Validators.required]),
      item: new FormControl('', [Validators.required]),
      costumer: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      batch: new FormControl('', [Validators.required]),
      packageP: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      marks: new FormControl('', [Validators.required]),
      shift: new FormControl('', [Validators.required]),
      mkp: new FormControl('', [Validators.required])
    });
  }

  writeScheduleData() {
    if(this.scheduleLine.orderN!=''){

    console.log(this.scheduleLine);
    if(this.scheduleLine.mkp == 'sachet'){
      this.scheduleLine.productionLine = '7';
    }else if (this.scheduleLine.mkp == 'mkp') {
      this.scheduleLine.productionLine = '6';
    } else if (this.scheduleLine.mkp == 'tube') {
      this.scheduleLine.productionLine = '5';
    }
    console.log(this.scheduleLine);
    debugger
    this.scheduleService
      .setNewProductionSchedule(this.scheduleLine)
      .subscribe(res => {
        this.scheduleData.push(res);

        this.scheduleLine.scheduleId = '';
        this.scheduleLine.scheduleId = '';
        this.scheduleLine.positionN = '';
        this.scheduleLine.orderN = '';
        this.scheduleLine.item = '';
        this.scheduleLine.costumer = '';
        this.scheduleLine.productName = '';
        this.scheduleLine.batch = '';
        this.scheduleLine.packageP = '';
        this.scheduleLine.qty = '';
        this.scheduleLine.qtyRdy = '';
        this.scheduleLine.date = '';
        this.scheduleLine.marks = '';
        this.scheduleLine.shift = '';
        this.scheduleLine.mkp = '';
        this.scheduleLine.status = 'open';
        this.scheduleLine.productionLine = '';
        this.scheduleLine.pLinePositionN = 999;
        this.scheduleLine.itemImpRemark = '';
      });
    }else{
      alert('מספר הזמנה של פק"ע לא יכול להיות ריק\nעבור הזמנות פנימיות יש להזין 0 במספר הזמנה.');
    }
  }

  dateChanged(date) {
    debugger
    console.log(date);
    this.scheduleService.getScheduleByDate(date).subscribe(res => {
      res.map(sced => {
        if (sced.status == 'filled') sced.color = '#CE90FF';
        if (sced.status == 'done') sced.color = 'Aquamarine';
        if (sced.status == 'beingFilled') sced.color = 'yellow';
        if (sced.status == 'packed') sced.color = 'orange';
        if (sced.status == 'partialDone') sced.color = '#ff7272';
        if (sced.status == 'problem') sced.color = 'red';
        if (sced.status == 'open') sced.color = 'white';
        if (sced.cmptsStatus == null) sced.cmptsStatus = 'true';
        sced.date3 = moment(sced.date).format('YYYY-MM-DD');

        //let pipe = new DatePipe('en-US'); // Use your own locale
        //  sced.date3 = pipe.transform(sced.date, 'short');
      });
      this.scheduleData = res;
    });
  }

  getAllSchedule(today) {
    debugger
    this.scheduleService.getScheduleByDate(today).subscribe(res => {
      res.map(sced => {
        console.log(sced);
        sced.color = 'white';
        if (sced.status === 'filled') {
          sced.color = '#CE90FF';
        }
        if (sced.status === 'beingFilled') {
          sced.color = 'yellow';
        }
        if (sced.status === 'packed') {
          sced.color = 'orange';
        }
        if (sced.status === 'done') {
          sced.color = 'Aquamarine';
        }
        if (sced.status === 'partialDone') {
          sced.color = '#ff7272';
        }
        if (sced.status === 'problem') {
          sced.color = 'red';
        }
        sced.date2 = moment(sced.date).format('DD/MM/YY');
        sced.date3 = moment(sced.date).format('YYYY-MM-DD');
      });
      res.map(sced => {
        Object.assign({ isSelected: false }, sced);
      });
      this.scheduleData = res;
      console.log(res);
    });
  }

  setType(type, elem) {
    console.log('hi ' + type);
    console.log('hi ' + elem.style);
    switch (type) {
      case 'basic':
        this.buttonColor = 'white';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        break;
      case 'tube':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = 'white';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        break;
      case 'mkp':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = 'white';
        this.buttonColor4 = 'white';
        break;
      case 'sachet':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = 'white';
        break;
    }
    this.typeShown = type;
  }

  edit(id, type) {
    this.EditRowId = id;
    this.currentType = type;
  }

  async updateSchedule() {
    if(this.orderN.nativeElement.value!=''){
      this.EditRowId;
      this.scheduleData;
      let scdLneInfo=
        await this.scheduleData.filter(
          sced => {
            if(sced._id == this.EditRowId) {
              debugger
              return sced;
            } 
          });
      let updateOrderItemDate= (scdLneInfo[0].date == this.date.nativeElement.value );
      scdLneInfo[0].itemImpRemark
      debugger
      this.date.nativeElement.value
  
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
  
      let scheduleToUpdate: any = {
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
        mkp: this.currentType,
        itemImpRemark: scdLneInfo[0].itemImpRemark,
      };
      console.log(scheduleToUpdate);
      this.scheduleService.editSchedule(scheduleToUpdate).subscribe(res => {
        this.EditRowId = 0;
        scheduleToUpdate.date3 = moment(scheduleToUpdate.date).format(
          'YYYY-MM-DD'
        );
        this.scheduleData[
          this.scheduleData.findIndex(
            sced => sced._id == scheduleToUpdate.scheduleId
          )
        ] = scheduleToUpdate;
        this.editRadioBtnType = '';
        if(updateOrderItemDate) {
          //update orderItemSchedule
        }
      });
    }else{
      alert('מספר הזמנה של פק"ע לא יכול להיות ריק\nעבור הזמנות פנימיות יש להזין 0 במספר הזמנה.');
    }

  }

  setItemDetails(itemNumber) {
    console.log(itemNumber);
    this.itemSer.getItemData(itemNumber).subscribe(res => {
      console.log("getItemData: "+res[0]);
      console.log(res[0]);
      let impremark= res[0].impRemarks;
      let itemName =
        res[0].name + ' ' + res[0].subName + ' ' + res[0].discriptionK;
      let packageP =
        res[0].bottleTube +
        ' ' +
        res[0].capTube +
        ' ' +
        res[0].pumpTube +
        ' ' +
        res[0].sealTube +
        ' ' +
        res[0].extraText1 +
        ' ' +
        res[0].extraText2;
      this.scheduleLine.productName = itemName;
      this.scheduleLine.packageP = packageP;
      this.scheduleLine.itemImpRemark = impremark;
    });
  }

  setOrderDetails(orderNumber) {
    console.log(orderNumber);
    this.orderSer.getOrderByNumber(orderNumber).subscribe(res => {
      let costumer = res[0].costumer;
      this.scheduleLine.costumer = costumer;
    });
  }

  deleteLine(id) {
    this.scheduleService.deleteSchedule(id).subscribe(res => {
      this.scheduleData = this.scheduleData.filter(elem => elem._id != id);
    });
  }

  filterSchedule() {
    this.scheduleData = this.scheduleData.filter(e => e.isSelected == true);
  }

  handleChange(type) {
    this.currentType = type;
  }
  setDone() {}

  moveAllOpenScedToToday() {
    this.scheduleService.setOpenToToday().subscribe(res => {
      console.log(res);
    });
  }

  dismissInfo(id) {
    this.scheduleData[
      this.scheduleData.findIndex(sced => sced._id == id)
    ].cmptsStatus = 'true';
  }


  // Modal Functions
  openPrintBarkod(content, line) {
    this.schedFillLine = line;
    console.log(this.schedFillLine);

    this.printScheduleFillingForm.value.position = this.schedFillLine.positionN;
    this.printScheduleFillingForm.value.orderN = this.schedFillLine.orderN;
    this.printScheduleFillingForm.value.item = this.schedFillLine.item;
    this.printScheduleFillingForm.value.costumer = this.schedFillLine.costumer;
    this.printScheduleFillingForm.value.productName = this.schedFillLine.productName;
    this.printScheduleFillingForm.value.batch = this.schedFillLine.batch;
    this.printScheduleFillingForm.value.packageP = this.schedFillLine.packageP;
    this.printScheduleFillingForm.value.qty = this.schedFillLine.qtyProduced;
    this.printScheduleFillingForm.value.date = this.schedFillLine.date;
    this.printScheduleFillingForm.value.marks = this.schedFillLine.marks;
    this.printScheduleFillingForm.value.shift = this.schedFillLine.shift;
    this.printScheduleFillingForm.value.mkp = this.schedFillLine.mkp;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        result => {
          if (result === 'Saved') {
            console.log(result);
            this.onSubmit();
          }
          this.closeResult = `Closed with: ${result}`;
          console.log(this.closeResult);
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(): void {
    const newPrintBarkod = this.printScheduleFillingForm.value;
    console.log(newPrintBarkod);
   }





   addImpRemarkFromItemTree(){
     this.scheduleService.addImpRemarkFromItemTree().subscribe(data=>{
      console.log(data);
      debugger
     });
   }







}
