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
import { BatchesService } from "src/app/services/batches.service";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"]
})
export class ScheduleComponent implements OnInit {

  fillingReport: boolean = false;
  showPrintBtn: boolean = false;
  scheduleData: any[];
  scheduleDataCopy: any[];
  unPackedSchedules: any[];
  EditRowId: any = "";
  buttonColor: string = "#2962FF";
  buttonColor2: string = "#B8ECF1";
  buttonColor3: string = "#B8ECF1";
  buttonColor4: string = "#B8ECF1";
  buttonColor5: string = "#B8ECF1";
  buttonColor6: string = "#B8ECF1";
  buttonColor7: string = "#B8ECF1";
  buttonColor8: string = "#B8ECF1";
  buttonColor9: string = "#B8ECF1";
  today: any;
  pcsCarton: any;
  barcodeK: any;
  newBatch: any;
  volumeK: any;
  netoW: any;
  grossW: any;
  expireDate: any;
  printBarkod: any;
  currentType: string = "";
  editRadioBtnType: string = "";
  selectedArr: any[] = [];
  printItemBarcode: boolean = true;
  printCostumerBarcode: boolean = true;
  printExpBarcode: boolean = true;
  newBatchChange: boolean = false;
  time: any;
  batchesSpecifications: any[]

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
  @ViewChild('whatIsMissing') whatIsMissing: ElementRef;
  @ViewChild('mkpA') mkp: ElementRef;
  @ViewChild('id') id: ElementRef;
  @ViewChild('batchSpecStatus') batchSpecStatus: ElementRef;
  openingPrintModal: boolean;

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
    itemImpRemark: '',
  };
  typeShown: String = 'basic';
  constructor(
    private scheduleService: ScheduleService,
    private itemSer: ItemsService,
    private orderSer: OrdersService,
    private modalService: NgbModal,
    private batchService: BatchesService,
    private toastSrv: ToastrService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.startTime()
    this.getAllUnpackedSchedules();
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
      mkp: new FormControl('', [Validators.required]),
      pcsCartonQuantity: new FormControl('', [Validators.required]),
      barcodeK: new FormControl('', [Validators.required])
    });
  }

  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = this.checkTime(m);
    s = this.checkTime(s);
    this.time = h + ":" + m + ":" + s;
  }

  get printBarcodeValues(): string[] {
    ;
    return this.printBarkod.barcode.split("\n");
  }

  exportAsXLSX(): void {
    let tempArr = this.scheduleData.filter(s => s.mkp == this.typeShown);

    this.excelService.exportAsExcelFile(tempArr, 'data');

  }


  writeScheduleData() {
    ;
    if (this.scheduleLine.orderN != '') {

      console.log(this.scheduleLine);
      if (this.scheduleLine.mkp == 'sachet') {
        this.scheduleLine.productionLine = '10';
      } else if (this.scheduleLine.mkp == 'mkp') {
        this.scheduleLine.productionLine = '11';
      } else if (this.scheduleLine.mkp == 'tube') {
        this.scheduleLine.productionLine = '12';

      } else if (this.scheduleLine.mkp == 'laser') {
        this.scheduleLine.productionLine = '13';

      } else if (this.scheduleLine.mkp == 'stickers') {
        this.scheduleLine.productionLine = '14';
      }
      else if (this.scheduleLine.mkp == 'mkp2') {
        this.scheduleLine.productionLine = '15'
      }
      else if (this.scheduleLine.mkp == 'basic') {
        if (this.scheduleLine.positionN.startsWith('1')) {
          this.scheduleLine.productionLine = '1'
        }
        if (this.scheduleLine.positionN.startsWith('2')) {
          this.scheduleLine.productionLine = '2'
        }
        if (this.scheduleLine.positionN.startsWith('3')) {
          this.scheduleLine.productionLine = '3'
        }
        if (this.scheduleLine.positionN.startsWith('4')) {
          this.scheduleLine.productionLine = '4'
        }
        if (this.scheduleLine.positionN.startsWith('5')) {
          this.scheduleLine.productionLine = '5'
        }
        if (this.scheduleLine.positionN.startsWith('6')) {
          this.scheduleLine.productionLine = '6'
        }
        if (this.scheduleLine.positionN.startsWith('7')) {
          this.scheduleLine.productionLine = '7'
        }
        if (this.scheduleLine.positionN.startsWith('8')) {
          this.scheduleLine.productionLine = '8'
        }
        if (this.scheduleLine.positionN.startsWith('9')) {
          this.scheduleLine.productionLine = '9'
        }
      }

      console.log(this.scheduleLine);

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
    } else {
      alert('מספר הזמנה של פק"ע לא יכול להיות ריק\nעבור הזמנות פנימיות יש להזין 0 במספר הזמנה.');
    }
  }

  dateChanged(date) {
    this.startTime()
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
        if (sced.whatIsMissing == 'noStickers' || sced.whatIsMissing == 'noMaterial' || sced.whatIsMissing == 'noComponent') {
          sced.color = 'grey'
        }
        sced.date3 = moment(sced.date).format('YYYY-MM-DD');

        //let pipe = new DatePipe('en-US'); // Use your own locale
        //  sced.date3 = pipe.transform(sced.date, 'short');
      });



      this.scheduleData = res;
      this.scheduleDataCopy = res;
      this.selectedArr = []

      //get batch specifications status
      this.scheduleData.map(sced => {
        if (sced.batch && sced.batch != "") {
          let batches = sced.batch.split('+')
          if(batches.length > 1) {
            debugger
            sced.batchSpecStatus = 999
          } 
          else {
            this.batchService.getSpecvalue(batches[0]).subscribe(res => {
              if (res.status) sced.batchSpecStatus = res.status
              else sced.batchSpecStatus = -1
            })
          }
        }
      })
      setTimeout(() => this.scheduleDataCopy = this.scheduleDataCopy, 5000)
    });
  }

  getAllSchedule(today) {

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
        if (sced.whatIsMissing == 'noStickers' || sced.whatIsMissing == 'noMaterial' || sced.whatIsMissing == 'noComponent') {
          sced.color = 'grey'
        }
        sced.date2 = moment(sced.date).format('DD/MM/YY');
        sced.date3 = moment(sced.date).format('YYYY-MM-DD');
      });
      res.map(sced => {
        Object.assign({ isSelected: false }, sced);
      });


      this.scheduleData = res;
      this.scheduleDataCopy = res;

      //get batch specifications status
      this.scheduleData.map(sced => {
        if (sced.batch && sced.batch != "") {
          let batches = sced.batch.split('+')
          if(batches.length > 1) {
            debugger
            sced.batchSpecStatus = 999
          } 
          else {
            this.batchService.getSpecvalue(batches[0]).subscribe(res => {
              if (res.status) sced.batchSpecStatus = res.status
              else sced.batchSpecStatus = -1
            })
          }
        }
      })
      setTimeout(() => this.scheduleDataCopy = this.scheduleDataCopy, 5000)
    });
  }

  checkBatchesSpec(batches) {
    this.batchesSpecifications = []
    batches = batches.split('+')
    batches.forEach(batch => {
      this.batchService.getSpecvalue(batch).subscribe(res => {

        if (res.status) this.batchesSpecifications.push({ batch, batchSpec: res.status })
        else this.batchesSpecifications.push({ batch, batchSpec: -1 })
      })
    })
    this.modalService.open(this.batchSpecStatus)
  }

  isSelected(ev, item) {

    if (ev.target.checked == true) {
      var isSelected = this.selectedArr

      this.itemSer.createFillingReport(item.item).subscribe(data => {
        ;
        item.impRemarks = data[0].impRemarks
        item.bottleNumber = data[0].bottleNumber
        item.pumpNumber = data[0].pumpNumber
        item.sealNumber = data[0].sealNumber
        item.capNumber = data[0].capNumber
        item.cartonNumber = data[0].cartonNumber
        item.stickerNumber = data[0].stickerNumber
        item.boxNumber = data[0].boxNumber
        item.PcsCarton = data[0].PcsCarton
        item.bottleImage = data[0].bottleImage
        item.bottlePosition = data[0].bottlePosition
        item.sealImage = data[0].sealImage
        item.sealPosition = data[0].sealPosition
        item.capPosition = data[0].capPosition
        item.capImage = data[0].capImage
        item.pumpImage = data[0].pumpImage
        item.pumpPosition = data[0].pumpPosition
        item.imgMain1 = data[0].imgMain1
        item.imgMain2 = data[0].imgMain2
        item.scheduleRemark = data[0].scheduleRemark
        item.boxImage = data[0].boxImage
        item.proRemarks = data[0].proRemarks
      })

      isSelected.push(item);
      this.selectedArr = isSelected
    }

    if (ev.target.checked == false) {
      var isSelected = this.selectedArr
      var tempArr = isSelected.filter(x => x.item != item.item)
      this.selectedArr = tempArr
    }


  }

  makeFillingReport() {
    ;

    this.fillingReport = true;
    this.selectedArr;


  }

  setType(type, elem) {
    debugger;
    console.log('hi ' + type);
    console.log('hi ' + elem.style);
    switch (type) {
      case 'basic':
        this.buttonColor = '#2962FF';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#B8ECF1';
        this.buttonColor9 = '#B8ECF1';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'tube':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#2962FF';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#B8ECF1';
        this.buttonColor9 = '#B8ECF1';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'mkp':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#2962FF';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#B8ECF1';
        this.buttonColor9 = '#B8ECF1';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'sachet':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#2962FF';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#B8ECF1';
        this.buttonColor9 = '#B8ECF1';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'laser':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#2962FF';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#B8ECF1';
        this.buttonColor9 = '#B8ECF1';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'stickers':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#2962FF';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#B8ECF1';
        this.buttonColor9 = '#B8ECF1';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'mkp2':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#2962FF';
        this.buttonColor9 = '#B8ECF1';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'packaging':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#B8ECF1';
        this.buttonColor8 = '#B8ECF1';
        this.buttonColor9 = '#2962FF';
        this.scheduleData = this.scheduleDataCopy
        break;
      case 'unpacked':
        this.buttonColor = '#B8ECF1';
        this.buttonColor2 = '#B8ECF1';
        this.buttonColor3 = '#B8ECF1';
        this.buttonColor4 = '#B8ECF1';
        this.buttonColor5 = '#B8ECF1';
        this.buttonColor6 = '#B8ECF1';
        this.buttonColor7 = '#2962FF';


        this.scheduleData = this.unPackedSchedules

        break;
    }
    this.typeShown = type;
  }

  edit(id, type) {
    this.EditRowId = id;
    this.currentType = type;
  }


  getAllUnpackedSchedules() {
    this.scheduleService.getUnpackedSchedules().subscribe(data => {

      data.forEach(element => {
        element.mkp = 'unpacked'
      });
      this.unPackedSchedules = data;
    })
  }

  filterByOrder(ev) {
    this.scheduleData = this.scheduleDataCopy
    if (ev.target.value != '') {
      this.scheduleData = this.scheduleData.filter(s => s.orderN == ev.target.value)
    } else {
      this.scheduleData = this.scheduleDataCopy
    }
  }

  filterByItem(ev) {
    this.scheduleData = this.scheduleDataCopy
    if (ev.target.value != '') {
      this.scheduleData = this.scheduleData.filter(s => s.item == ev.target.value)
    } else {
      this.scheduleData = this.scheduleDataCopy
    }
  }

  filterByLine(ev) {
    this.scheduleData = this.scheduleDataCopy
    if (ev.target.value != '') {
      this.scheduleData = this.scheduleData.filter(s => s.productionLine == ev.target.value)
    } else {
      this.scheduleData = this.scheduleDataCopy
    }
  }

  async updateSchedule() {
    ;
    if (this.orderN.nativeElement.value != '') {
      this.EditRowId;
      this.scheduleData;
      let scdLneInfo =
        await this.scheduleData.filter(
          sced => {
            if (sced._id == this.EditRowId) {

              return sced;
            }
          });
      let updateOrderItemDate = (scdLneInfo[0].date == this.date.nativeElement.value);
      scdLneInfo[0].itemImpRemark

      this.date.nativeElement.value
      this.whatIsMissing.nativeElement.value;
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
        whatIsMissing: this.whatIsMissing.nativeElement.value,
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
        if (updateOrderItemDate) {
          //update orderItemSchedule
        }
      });
    } else {
      alert('מספר הזמנה של פק"ע לא יכול להיות ריק\nעבור הזמנות פנימיות יש להזין 0 במספר הזמנה.');
    }

  }

  setItemDetails(itemNumber) {
    console.log(itemNumber);
    this.itemSer.getItemData(itemNumber).subscribe(res => {
      console.log("getItemData: " + res[0]);
      console.log(res[0]);
      let impremark = res[0].impRemarks;
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
    if (confirm('האם אתה בטוח שברצונך למחוק את השורה?')) {
      this.scheduleService.deleteSchedule(id).subscribe(res => {
        this.scheduleData = this.scheduleData.filter(elem => elem._id != id);
      });
    }
  }

  filterSchedule() {
    ;
    this.scheduleData = this.selectedArr

  }

  handleChange(type) {
    this.currentType = type;
  }
  setDone() { }

  moveAllOpenScedToToday() {
    ;
    if (this.selectedArr.length > 0) {
      this.scheduleService.moveToNextDay(this.selectedArr).subscribe(data => {
        if (data.msg == "success") {
          this.toastSrv.success("פריטים נבחרים עברו 24 שעות קדימה")
          this.today = new Date();
          this.today = moment(this.today).format('YYYY-MM-DD');
          this.getAllSchedule(this.today)
          this.selectedArr = [];
        }

      })
    } else {
      this.scheduleService.setOpenToToday().subscribe(res => {
        console.log(res);
      });
    }

  }

  dismissInfo(id) {
    this.scheduleData[
      this.scheduleData.findIndex(sced => sced._id == id)
    ].cmptsStatus = 'true';
  }

  markMkpDone(id) {
    ;
    this.scheduleService.setMpkDone(id).subscribe(data => {
      if (data) {
        let schedule = this.scheduleData.find(s => s._id == id);
        schedule.status = data.status;
        schedule.color = 'Aquamarine'
      }
    })
  }



  // Modal Functions
  openPrintBarkod(content, line) {
    this.showPrintBtn = false;
    this.openingPrintModal = true;
    // this.schedFillLine = line;
    ;
    this.newBatchChange = false;
    // setTimeout(() => {
     
    // }, 5000);
    this.itemSer.getItemData(line.item).subscribe(data => {
      line.pcsCarton = data[0].PcsCarton.replace(/\D/g, "") + " Pcs";
      line.barcodeK = data[0].barcodeK;
      line.volumeK = data[0].volumeKey + ' ml';
      line.netoW = data[0].netWeightK;
      line.grossW = data[0].grossUnitWeightK;

      this.batchService.getBatchData(line.batch).subscribe(data => {
        if(data.length > 0) line.packageP = data[0].expration.slice(0, 11);
        
        this.printScheduleFillingForm.patchValue(line)

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
        this.showPrintBtn = true;
        this.openingPrintModal = false;
      })

    })

  

    // this.printScheduleFillingForm.value.orderN = this.schedFillLine.orderN;
    // this.printScheduleFillingForm.value.item = this.schedFillLine.item;
    // this.printScheduleFillingForm.value.costumer = this.schedFillLine.costumer;
    // this.printScheduleFillingForm.value.productName = this.schedFillLine.productName;
    // this.printScheduleFillingForm.value.batch = this.schedFillLine.batch;
    // this.printScheduleFillingForm.value.packageP = this.schedFillLine.packageP;
    // this.printScheduleFillingForm.value.qty = this.schedFillLine.qtyProduced;
    // this.printScheduleFillingForm.value.date = this.schedFillLine.date;
    // this.printScheduleFillingForm.value.marks = this.schedFillLine.marks;
    // this.printScheduleFillingForm.value.shift = this.schedFillLine.shift;
    // this.printScheduleFillingForm.value.mkp = this.schedFillLine.mkp;


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
    this.printCostumerBarcode = true;
    this.printExpBarcode = true;
    this.printItemBarcode = true;
    this.printScheduleFillingForm.reset()
  }

  saveBatchNumber() {
    this.newBatch = this.printScheduleFillingForm.value.batch
    this.newBatchChange = true;
  }
  savePcsCarton() {
    ;
    this.pcsCarton = this.printScheduleFillingForm.value.pcsCartonQuantity
  }





  addImpRemarkFromItemTree() {
    this.scheduleService.addImpRemarkFromItemTree().subscribe(data => {
      console.log(data);

    });
  }







}
