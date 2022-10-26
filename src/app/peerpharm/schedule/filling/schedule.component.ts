import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
} from "@angular/core";
import { ScheduleService } from "../../../services/schedule.service";
import { ItemsService } from "../../../services/items.service";
import { OrdersService } from "../../../services/orders.service";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { Schedule } from "./../models/schedule";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BatchesService } from "src/app/services/batches.service";
import { ExcelService } from "src/app/services/excel.service";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { cpuUsage } from "process";
import { ConsoleLogger } from "@aws-amplify/core";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
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
  buttonColor10: string = "#B8ECF1";
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
  batchesSpecifications: any[];
  fillingDate: any;
  componentsTotalQty: any[] = [];
  componentsTotalQtyCopy: any[] = [];
  componentsQtyReport: boolean = false;
  sortToggle: number = 1;

  myDate: Date = new Date();
  intervalId: any;
  chkAll: boolean = false;

  closeResult: string;
  public printScheduleFillingForm: FormGroup;
  schedFillLine = new Schedule();

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
  @ViewChild("shiftA") shift: ElementRef;
  @ViewChild("whatIsMissing") whatIsMissing: ElementRef;
  @ViewChild("mkpA") mkp: ElementRef;
  @ViewChild("id") id: ElementRef;
  @ViewChild("batchSpecStatus") batchSpecStatus: ElementRef;
  @ViewChild("btnPrint") btnPrint: ElementRef;
  openingPrintModal: boolean;
  sameLineAlert: boolean = false;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.edit("", this.currentType);
  }

  scheduleLine = {
    scheduleId: "",
    positionN: "",
    orderN: "",
    item: "",
    costumer: "",
    productName: "",
    batch: "",
    packageP: "",
    qty: "",
    qtyProduced: "",
    date: "",
    marks: "",
    shift: "",
    mkp: "",
    status: "open",
    productionLine: "",
    pLinePositionN: 999,
    itemImpRemark: "",
    editLineReason: "",
  };

  typeShown: String = "basic";

  itemsNumbers: Array<any> = [];
  itemsComponentsByItemNumber: any = {};

  remarks: Array<any> = [];
  expanded: boolean = false;
  remarksToAdd: Array<any> = [];
  remarksLangues: Array<any> = [];
  unscheduledBatches: Array<any> = [];
  showBatchesAlert: boolean = false;
  showBatchesList: boolean = false;

  searchMenu: FormGroup = new FormGroup({
    itemNumber: new FormControl(""),
    orderNumber: new FormControl(""),
    componentN: new FormControl(""),
    type: new FormControl(""),
  });

  constructor(
    private scheduleService: ScheduleService,
    private itemSer: ItemsService,
    private orderSer: OrdersService,
    private modalService: NgbModal,
    private batchService: BatchesService,
    private toastSrv: ToastrService,
    private excelService: ExcelService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    let x = window.innerWidth;
    this.startTime();
    this.getAllUnpackedSchedules();
    this.today = new Date();
    this.today = moment(this.today).format("YYYY-MM-DD");
    this.fillingDate = this.today;
    this.getAllSchedule(this.today);

    this.printScheduleFillingForm = new FormGroup({
      position: new FormControl("", [Validators.required]),
      orderN: new FormControl("", [Validators.required]),
      item: new FormControl("", [Validators.required]),
      costumer: new FormControl("", [Validators.required]),
      productName: new FormControl("", [Validators.required]),
      batch: new FormControl("", [Validators.required]),
      packageP: new FormControl("", [Validators.required]),
      exp: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
      date: new FormControl("", [Validators.required]),
      marks: new FormControl("", [Validators.required]),
      shift: new FormControl("", [Validators.required]),
      mkp: new FormControl("", [Validators.required]),
      pcsCarton: new FormControl("", [Validators.required]),
      volumeK: new FormControl("", [Validators.required]),
      barcodeK: new FormControl("", [Validators.required]),
    });

    this.intervalId = setInterval(() => {
      this.myDate = new Date();
    }, 1000);

    this.scheduleService.getScheduleRemarks().subscribe((res) => {
      if (res && !res.msg && res.length > 0) {
        this.remarks = res;
      }
    });

    this.getUnscheduledBatches();
  }

  getUnscheduledBatches() {
    this.batchService.getTenDaysUnscheduledBatches().subscribe((res) => {
      if (res) {
        this.unscheduledBatches = res;
        if (this.unscheduledBatches.length > 0) {
          this.showBatchesAlert = true;
        }
      }
    });
  }

  showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      checkboxes.style.display = "block";
      this.expanded = true;
    } else {
      checkboxes.style.display = "none";
      this.expanded = false;
    }
  }

  addRemarks(id) {
    const temp = this.remarks.find((rem) => rem._id == id);
    if (!temp) {
      return;
    } else {
      if (this.remarksToAdd.includes(temp)) {
        this.remarksToAdd = this.remarksToAdd.filter((rem) => rem._id != id);
      } else {
        this.remarksToAdd.push(temp);
      }
    }
  }

  addLangues(lang) {
    console.log("ERAN GRADY THE KING", lang);
    if (this.remarksLangues.includes(lang)) {
      this.remarksLangues = this.remarksLangues.filter((x) => x != lang);
    } else {
      this.remarksLangues.push(lang);
    }
    console.log("ERAN GRADY THE KING2", this.remarksLangues);
  }

  checkPermission() {
    if (this.authService.loggedInUser.screenPermission != "3") {
      if (this.authService.loggedInUser.screenPermission != "2") {
        if (this.authService.loggedInUser.screenPermission != "1") {
          return true; // No permission
        }
      }
    }
    return false; // Permission granted
  }

  goToProductTree() {
    this.router.navigate([`/peerpharm/items/itemDetails`]);
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
    return this.printBarkod.barcode.split("\n");
  }

  exportAsXLSX(): void {
    try {
      let tempArr = this.scheduleData.filter((s) => s.mkp == this.typeShown);
      tempArr.forEach((x) => {
        // console.log(x);
        let str = "";
        // let componentsArray = this.itemsComponentsByItemNumber[Number(x.item)];
        //  console.log(this.itemsComponentsByItemNumber[84]);
        x.components.map((compo) => {
          str += String(compo.componentN) + ", ";
        });
        x.components = str;
        delete x._id;
        delete x._v;
        delete x.color;
        delete x.shift;
      });

      this.excelService.exportAsExcelFile(tempArr, "data");
    } catch (error) {
      console.log(error);
    }
  }

  writeScheduleData() {
    this.scheduleData.map((line) => {
      if (
        line.orderN == this.scheduleLine.orderN &&
        line.item == this.scheduleLine.item &&
        line.qty == this.scheduleLine.qty &&
        line.date3 == this.scheduleLine.date &&
        line.mkp == this.scheduleLine.mkp
      ) {
        this.sameLineAlert = true;
      }
    });
    if (this.scheduleLine.orderN != "") {
      if (this.scheduleLine.mkp == "sachet") {
        this.scheduleLine.productionLine = "10";
      } else if (this.scheduleLine.mkp == "mkp") {
        this.scheduleLine.productionLine = "11";
      } else if (this.scheduleLine.mkp == "tube") {
        this.scheduleLine.productionLine = "12";
      } else if (this.scheduleLine.mkp == "laser") {
        this.scheduleLine.productionLine = "13";
      } else if (this.scheduleLine.mkp == "stickers") {
        this.scheduleLine.productionLine = "14";
      } else if (this.scheduleLine.mkp == "mkp2") {
        this.scheduleLine.productionLine = "15";
      } else if (this.scheduleLine.mkp == "basic") {
        if (this.scheduleLine.positionN.startsWith("1")) {
          this.scheduleLine.productionLine = "1";
        }
        if (this.scheduleLine.positionN.startsWith("2")) {
          this.scheduleLine.productionLine = "2";
        }
        if (this.scheduleLine.positionN.startsWith("3")) {
          this.scheduleLine.productionLine = "3";
        }
        if (this.scheduleLine.positionN.startsWith("4")) {
          this.scheduleLine.productionLine = "4";
        }
        if (this.scheduleLine.positionN.startsWith("5")) {
          this.scheduleLine.productionLine = "5";
        }
        if (this.scheduleLine.positionN.startsWith("6")) {
          this.scheduleLine.productionLine = "6";
        }
        if (this.scheduleLine.positionN.startsWith("7")) {
          this.scheduleLine.productionLine = "7";
        }
        if (this.scheduleLine.positionN.startsWith("8")) {
          this.scheduleLine.productionLine = "8";
        }
        if (this.scheduleLine.positionN.startsWith("9")) {
          this.scheduleLine.productionLine = "9";
        }
      }

      var date = moment(this.scheduleLine.date);
      if (!date.isValid())
        this.toastSrv.error("אנא הזיני תאריך תקין", "תאריך לא תקין!");
      else {
        this.scheduleService
          .setNewProductionSchedule(this.scheduleLine)
          .subscribe((res) => {
            if (res.msg == "Failed")
              this.toastSrv.error(
                "Schedule not Saved! Please check all fields"
              );
            else {
              console.log(this.scheduleLine.date);
              this.scheduleData.push(res);
              this.scheduleLine.scheduleId = "";
              this.scheduleLine.positionN = "";
              this.scheduleLine.orderN = "";
              this.scheduleLine.item = "";
              this.scheduleLine.costumer = "";
              this.scheduleLine.productName = "";
              this.scheduleLine.batch = "";
              this.scheduleLine.packageP = "";
              this.scheduleLine.qty = "";
              this.scheduleLine.qtyProduced = "";
              this.scheduleLine.date = "";
              this.scheduleLine.marks = "";
              this.scheduleLine.shift = "";
              this.scheduleLine.mkp = "";
              this.scheduleLine.status = "open";
              this.scheduleLine.productionLine = "";
              this.scheduleLine.pLinePositionN = 999;
              this.scheduleLine.itemImpRemark = "";
              this.scheduleLine.editLineReason = "";
            }
          });
      }
    } else {
      alert(
        'מספר הזמנה של פק"ע לא יכול להיות ריק\nעבור הזמנות פנימיות יש להזין 0 במספר הזמנה.'
      );
    }
  }

  dateChanged(date) {
    if (date == "") {
      this.toastSrv.error("יש לבחור תאריך מתוך הלוח");
      return;
    }

    this.fillingDate = date;
    this.startTime();
    this.componentsTotalQty = [];
    this.scheduleData = [];
    this.itemsNumbers = [];
    this.scheduleService.getScheduleByDate(date).subscribe((res) => {
      if (res.msg) {
        console.log(res);
        this.toastSrv.error(res.msg);
        return;
      }
      if (res && res.length > 0) {
        res.map((sced) => {
          if (sced.status == "filled") sced.color = "#CE90FF";
          if (sced.status == "done") sced.color = "Aquamarine";
          if (sced.status == "beingFilled") sced.color = "yellow";
          if (sced.status == "packed") sced.color = "orange";
          if (sced.status == "partialDone") sced.color = "#ff7272";
          if (sced.status == "problem") sced.color = "red";
          if (sced.status == "open") sced.color = "white";
          if (sced.cmptsStatus == null) sced.cmptsStatus = "true";
          if (
            sced.whatIsMissing == "noStickers" ||
            sced.whatIsMissing == "noMaterial" ||
            sced.whatIsMissing == "noComponent"
          ) {
            sced.color = "grey";
          }
          sced.date3 = moment(sced.date).format("YYYY-MM-DD");

          //let pipe = new DatePipe('en-US'); // Use your own locale
          //  sced.date3 = pipe.transform(sced.date, 'short');
        });

        this.scheduleData = res;
        console.log(this.scheduleData[0]);
        this.scheduleDataCopy = res;
        this.scheduleData.forEach((row) => {
          this.itemsNumbers.push(row.item);
        });
        if (this.itemsNumbers.length > 0) {
          this.itemSer
            .getComponentsForMultiItems(this.itemsNumbers)
            .subscribe((res2) => {
              if (res2.msg) {
                console.log(res2);
                this.toastSrv.error(res2.msg);
              }
              this.itemsComponentsByItemNumber = res2;

              console.log(res2);
              console.log(this.scheduleData);

              this.scheduleData.forEach((line) => {
                let idx = res2.findIndex(
                  (item) => item.itemNumber == line.item
                );
                if (idx > -1) {
                  line.components = res2[idx].components;
                }
              });

              console.log(this.scheduleData);
              //get batch specifications status
              this.scheduleData.map((sced) => {
                if (sced.batch && sced.batch != "") {
                  let batches = sced.batch.split("+");
                  if (batches.length > 1) {
                    sced.batchSpecStatus = 999;
                  } else {
                    this.batchService
                      .getSpecvalue(batches[0])
                      .subscribe((res) => {
                        if (res.msg && res.msg != "success") {
                          console.log(res);
                          this.toastSrv.error(res.msg);
                        }

                        if (res.status) sced.batchSpecStatus = res.status;
                        else sced.batchSpecStatus = -1;
                      });
                  }
                }
              });
              this.selectedArr = [];
              this.scheduleDataCopy = this.scheduleData;

              setTimeout(() => {
                this.scheduleDataCopy = this.scheduleData;
                // this.getComponentsQty();
              }, 5000);
            });
        } else {
          this.toastSrv.error("אין תכנון ליום זה.");
          return;
        }
      } else {
        this.toastSrv.error("אין תכנון ליום זה.");
        return;
      }
    });
  }

  openFormDetails(scheduleId) {
    this.router.navigate([
      `/peerpharm/forms/formDetails/${undefined}/${scheduleId}`,
    ]);
    // location.href="http://localhost:4200/#/peerpharm/forms/formDetails/"+scheduleId+'scheduleId';

    this.router.navigate([]).then((result) => {
      window.open(
        `#/peerpharm/forms/formDetails/${undefined}/${scheduleId}`,
        "_blank"
      );
    });
  }

  getAllSchedule(today) {
    this.scheduleService.getScheduleByDate(today).subscribe((res) => {
      console.log(res);
      res.map((sced) => {
        sced.color = "white";
        if (sced.status === "filled") {
          sced.color = "#CE90FF"; //purple
        }
        if (sced.status === "beingFilled") {
          sced.color = "yellow";
        }
        if (sced.status === "packed") {
          sced.color = "orange";
        }
        if (sced.status === "done") {
          sced.color = "Aquamarine";
        }
        if (sced.status === "partialDone") {
          sced.color = "#ff7272"; //light red
        }
        if (sced.status === "problem") {
          sced.color = "red";
        }
        if (
          sced.whatIsMissing == "noStickers" ||
          sced.whatIsMissing == "noMaterial" ||
          sced.whatIsMissing == "noComponent"
        ) {
          sced.color = "grey";
        }
        sced.date2 = moment(sced.date).format("DD/MM/YY");
        sced.date3 = moment(sced.date).format("YYYY-MM-DD");
      });
      res.map((sced) => {
        Object.assign({ isSelected: false }, sced);
      });
      console.log(res);
      this.scheduleData = res;
      this.scheduleDataCopy = res;
      this.scheduleData.forEach((row) => {
        this.itemsNumbers.push(row.item);
      });
      this.itemSer
        .getComponentsForMultiItems(this.itemsNumbers)
        .subscribe((res2) => {
          this.itemsComponentsByItemNumber = res2;
          console.log(res2);
          console.log(this.scheduleData);

          this.scheduleData.forEach((line) => {
            let idx = res2.findIndex((item) => item.itemNumber == line.item);
            if (idx > -1) {
              line.components = res2[idx].components;
            }
          });

          console.log(this.scheduleData);
        });

      //get batch specifications status
      this.scheduleData.map((sced) => {
        if (sced.batch && sced.batch != "") {
          let batches = sced.batch.split("+");
          if (batches.length > 1) {
            sced.batchSpecStatus = 999;
          } else {
            this.batchService.getSpecvalue(batches[0]).subscribe((res) => {
              if (res.status) sced.batchSpecStatus = res.status;
              else sced.batchSpecStatus = -1;
            });
          }
        }
      });
      setTimeout(() => (this.scheduleDataCopy = this.scheduleDataCopy), 5000);
    });
  }

  checkBatchesSpec(batches) {
    this.batchesSpecifications = [];
    batches = batches.split("+");
    batches.forEach((batch) => {
      this.batchService.getSpecvalue(batch).subscribe((res) => {
        if (res.status)
          this.batchesSpecifications.push({ batch, batchSpec: res.status });
        else this.batchesSpecifications.push({ batch, batchSpec: -1 });
      });
    });
    this.modalService.open(this.batchSpecStatus);
  }

  isSelected(ev, item) {
    try {
      console.log(ev.checked);

      if ((ev.target && ev.target.checked == true) || ev.checked == true) {
        var isSelected = this.selectedArr;

        this.itemSer.createFillingReport(item.item).subscribe((data) => {
          item.impRemarks = data[0].impRemarks;
          item.bottleNumber = data[0].bottleNumber;
          item.pumpNumber = data[0].pumpNumber;
          item.sealNumber = data[0].sealNumber;
          item.capNumber = data[0].capNumber;
          item.cartonNumber = data[0].cartonNumber;
          item.stickerNumber = data[0].stickerNumber;
          item.boxNumber = data[0].boxNumber;
          item.PcsCarton = data[0].PcsCarton;
          item.bottleImage = data[0].bottleImage;
          item.bottlePosition = data[0].bottlePosition;
          item.sealImage = data[0].sealImage;
          item.sealPosition = data[0].sealPosition;
          item.capPosition = data[0].capPosition;
          item.capImage = data[0].capImage;
          item.pumpImage = data[0].pumpImage;
          item.pumpPosition = data[0].pumpPosition;
          item.imgMain1 = data[0].imgMain1;
          item.imgMain2 = data[0].imgMain2;
          item.scheduleRemark = data[0].scheduleRemark;
          item.boxImage = data[0].boxImage;
          item.proRemarks = data[0].proRemarks;
        });

        isSelected.push(item);
        this.selectedArr = isSelected;
      }

      if ((ev.target && ev.target.checked == false) || ev.checked == false) {
        var isSelected = this.selectedArr;
        var tempArr = isSelected.filter((x) => x.item != item.item);
        this.selectedArr = tempArr;
      }
    } catch (error) {
      console.log(error);
    }
  }

  selectAll() {
    console.log(this.scheduleData[0]);
    this.chkAll = !this.chkAll;
    if (this.chkAll) {
      this.selects();
    } else {
      this.deSelect();
    }
  }

  selects() {
    var ele = <HTMLInputElement[]>(
      (<any>document.getElementsByName("selectLine"))
    );
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type == "checkbox") {
        ele[i].checked = true;
        this.isSelected(ele[i], this.scheduleData[i]);
      }
    }
  }

  deSelect() {
    var ele = <HTMLInputElement[]>(
      (<any>document.getElementsByName("selectLine"))
    );
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type == "checkbox") {
        ele[i].checked = false;
        this.isSelected(ele[i], this.scheduleData[i]);
      }
    }
  }

  makeFillingReport() {
    this.fillingReport = true;
    this.selectedArr;
  }

  setType(type, elem) {
    switch (type) {
      case "basic":
        this.buttonColor = "#2962FF";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "tube":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#2962FF";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "mkp":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#2962FF";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "sachet":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#2962FF";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "laser":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#2962FF";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "stickers":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#2962FF";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "mkp2":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#2962FF";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "packaging":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#2962FF";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "cream":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "#B8ECF1";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#2962FF";
        this.scheduleData = this.scheduleDataCopy;
        break;
      case "unpacked":
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        this.buttonColor5 = "#B8ECF1";
        this.buttonColor6 = "#B8ECF1";
        this.buttonColor7 = "yellow";
        this.buttonColor8 = "#B8ECF1";
        this.buttonColor9 = "#B8ECF1";
        this.buttonColor10 = "#B8ECF1";
        this.scheduleData = this.unPackedSchedules;
        this.scheduleData.map((line) => {
          line.date2 = moment(line.date).format("DD/MM/YY");
          line.date3 = moment(line.date).format("YYYY-MM-DD");
          return line;
        });
        break;
    }
    this.typeShown = type;
  }

  edit(id, type) {
    if (this.typeShown == "unpacked") {
      this.currentType = type;
    } else {
      this.EditRowId = id;
      this.currentType = type;
    }
  }

  getAllUnpackedSchedules() {
    this.scheduleService.getUnpackedSchedules().subscribe(async (data) => {
      await data.forEach((element) => {
        element.mkp = "unpacked";
      });
      this.unPackedSchedules = data;
    });
  }

  filterByOrder(ev) {
    this.scheduleData = this.scheduleDataCopy;
    if (ev.target.value != "") {
      this.scheduleData = this.scheduleData.filter(
        (s) => s.orderN == ev.target.value
      );
    } else {
      this.scheduleData = this.scheduleDataCopy;
    }
  }

  filterByItem(ev) {
    this.scheduleData = this.scheduleDataCopy;
    if (ev.target.value != "") {
      this.scheduleData = this.scheduleData.filter(
        (s) => s.item == ev.target.value
      );
    } else {
      this.scheduleData = this.scheduleDataCopy;
    }
  }

  filterByLine(ev) {
    this.scheduleData = this.scheduleDataCopy;
    if (ev.target.value != "") {
      this.scheduleData = this.scheduleData.filter(
        (s) => s.productionLine == ev.target.value
      );
    } else {
      this.scheduleData = this.scheduleDataCopy;
    }
  }

  async updateSchedule(line) {
    if (this.orderN.nativeElement.value != "") {
      let scdLneInfo = await this.scheduleData.filter(
        (sced) => sced._id == this.EditRowId
      );

      let updateOrderItemDate =
        scdLneInfo[0].date == this.date.nativeElement.value;

      let strHe = "";
      let strEn = "";
      let strAr = "";
      let strRs = "";

      if (this.remarksLangues.length > 0) {
        if (this.remarksToAdd.length > 0) {
          this.remarksToAdd.map((rem) => {
            if (this.remarksLangues.includes("heb")) {
              strHe += rem.heb + ", ";
            }
            if (this.remarksLangues.includes("eng")) {
              strEn += rem.eng + ", ";
            }
            if (this.remarksLangues.includes("arab")) {
              strAr += rem.arab + ", ";
            }
            if (this.remarksLangues.includes("rus")) {
              strRs += rem.rus + ", ";
            }
          });
        }
        this.remarksLangues = [];
        this.remarksToAdd = [];
      }

      let scheduleToUpdate: any = {
        _id: line._id,
        positionN: this.positionN.nativeElement.value,
        orderN: this.orderN.nativeElement.value,
        item: this.item.nativeElement.value,
        costumer: this.costumer.nativeElement.value,
        productName: this.productName.nativeElement.value,
        batch: this.batch.nativeElement.value,
        packageP: this.packageP.nativeElement.value,
        qty: this.qty.nativeElement.value,
        qtyProduced: "",
        date: this.date.nativeElement.value,
        marks: this.marks.nativeElement.value,
        shift:
          this.shift.nativeElement.value +
          "\n" +
          strHe +
          "\n" +
          strRs +
          "\n" +
          strAr +
          "\n" +
          strEn +
          "\n",
        mkp: this.currentType,
        itemImpRemark: scdLneInfo[0].itemImpRemark,
        whatIsMissing: this.whatIsMissing.nativeElement.value,
      };

      if (this.typeShown == "unpacked") {
        scheduleToUpdate.status = "";
        scdLneInfo[0].status = "";
      }
      this.scheduleService.editSchedule(scheduleToUpdate).subscribe((res) => {
        this.EditRowId = 0;
        scheduleToUpdate.date3 = moment(scheduleToUpdate.date).format(
          "YYYY-MM-DD"
        );
        this.scheduleData[
          this.scheduleData.findIndex(
            (sced) => sced._id == scheduleToUpdate._id
          )
        ] = scheduleToUpdate;
        this.editRadioBtnType = "";
        if (updateOrderItemDate) {
          //update orderItemSchedule
        }
      });
    } else {
      alert(
        'מספר הזמנה של פק"ע לא יכול להיות ריק\nעבור הזמנות פנימיות יש להזין 0 במספר הזמנה.'
      );
    }
  }

  setItemDetails(itemNumber) {
    this.itemSer.getItemData(itemNumber).subscribe((res) => {
      let impremark = res[0].impRemarks;
      let itemName =
        res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
      let packageP =
        res[0].bottleTube +
        " " +
        res[0].capTube +
        " " +
        res[0].pumpTube +
        " " +
        res[0].sealTube +
        " " +
        res[0].extraText1 +
        " " +
        res[0].extraText2;
      this.scheduleLine.productName = itemName;
      this.scheduleLine.packageP = packageP;
      this.scheduleLine.itemImpRemark = impremark;
    });
  }

  setOrderDetails(orderNumber) {
    this.orderSer.getOrderByNumber(orderNumber).subscribe((res) => {
      let costumer = res[0].costumer;
      this.scheduleLine.costumer = costumer;
    });
  }

  deleteLine(id) {
    if (confirm("האם אתה בטוח שברצונך למחוק את השורה?")) {
      const today = new Date();
      const year = today.getFullYear();
      const mount = today.getMonth();
      const day = today.getDay();
      let l;
      this.scheduleData.forEach((ele) => {
        if (ele._id == id) {
          l = ele;
        }
      });
      const scheduleLineDate = new Date(l.date);
      const scheduleYear = scheduleLineDate.getFullYear();
      const scheduleMount = scheduleLineDate.getMonth();
      const scheduleDay = scheduleLineDate.getDay();
      if (
        year == scheduleYear &&
        mount == scheduleMount &&
        day == scheduleDay
      ) {
        let reason = prompt("אנא הכנס סיבה למחיקת השורה", "");
        reason = reason.trim();
        if (reason != null && reason != "") {
          document.getElementById("deleteReason").innerHTML = reason;
          this.scheduleService.deleteSchedule(id, reason).subscribe((res) => {
            this.scheduleData = this.scheduleData.filter(
              (elem) => elem._id != id
            );
          });
        } else {
          this.toastSrv.warning("חייב לציין את סיבת המחיקה");
        }
      } else {
        this.scheduleService.deleteSchedule(id).subscribe((res) => {
          if (res.msg) {
            this.toastSrv.error(res.msg);
            alert("השורה לא נמחקה, קיים טופס לשורה זו.");
            return;
          } else if (res) {
            console.log(res);
            this.toastSrv.success("שורת הלוז נמחקה");
          }

          this.scheduleData = this.scheduleData.filter(
            (elem) => elem._id != id
          );
        });
      }
    }
  }

  filterSchedule() {
    this.scheduleDataCopy = this.selectedArr;
  }

  handleChange(type) {
    this.currentType = type;
  }
  setDone() {}

  moveAllOpenScedToToday() {
    if (this.selectedArr.length > 0) {
      this.scheduleService.moveToNextDay(this.selectedArr).subscribe((data) => {
        if (data.msg == "success") {
          this.toastSrv.success("פריטים נבחרים עברו 24 שעות קדימה");
          this.today = new Date();
          this.today = moment(this.today).format("YYYY-MM-DD");
          this.getAllSchedule(this.today);
          this.selectedArr = [];
        }
      });
    } else {
      this.scheduleService.setOpenToToday().subscribe((res) => {});
    }
  }

  dismissInfo(id) {
    this.scheduleData[
      this.scheduleData.findIndex((sced) => sced._id == id)
    ].cmptsStatus = "true";
  }

  markScheduleDone(id) {
    this.scheduleService.markScheduleDone(id).subscribe((data) => {
      if (data) {
        let schedule = this.scheduleData.find((s) => s._id == id);
        schedule.status = data.status;
        schedule.color = "Aquamarine";
      }
    });
  }

  // Modal Functions
  openPrintBarkod(content, line) {
    this.showPrintBtn = false;
    this.openingPrintModal = true;
    this.newBatchChange = false;

    //In case something goes wrong, enable clicking agaib
    setTimeout(() => {
      if (this.openingPrintModal) {
        this.toastSrv.error(
          "I am sorry, but something went wrong. Please try again."
        );
        this.openingPrintModal = false;
      }
    }, 5000);
    this.itemSer.getItemData(line.item).subscribe((data) => {
      line.pcsCarton = data[0].PcsCarton.replace(/\D/g, "") + " Pcs";
      line.barcodeK = data[0].barcodeK;
      line.volumeK = data[0].volumeKey + " ml";
      line.netoW = data[0].netWeightK;
      line.grossW = data[0].grossUnitWeightK;

      if (line.batch != "") {
        this.batchService.getBatchData(line.batch).subscribe((data) => {
          if (data.length > 0 && data[0].expration)
            line.exp = data[0].expration.slice(0, 11);
          this.printScheduleFillingForm.patchValue(line);
          this.modalService
            .open(content, { ariaLabelledBy: "modal-basic-title" })
            .result.then(
              (result) => {
                if (result === "Saved") {
                  this.onSubmit();
                }
                this.closeResult = `Closed with: ${result}`;
              },
              (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              }
            );
          this.showPrintBtn = true;
          this.openingPrintModal = false;
        });
      } else {
        this.toastSrv.info("No batch.");
        line.exp = "";
        this.printScheduleFillingForm.patchValue(line);

        this.modalService
          .open(content, { ariaLabelledBy: "modal-basic-title" })
          .result.then(
            (result) => {
              if (result === "Saved") {
                this.onSubmit();
              }
              this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
        this.showPrintBtn = true;
        this.openingPrintModal = false;
      }
    });

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
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(): void {
    const newPrintBarkod = this.printScheduleFillingForm.value;
    this.printCostumerBarcode = true;
    this.printExpBarcode = true;
    this.printItemBarcode = true;
    this.printScheduleFillingForm.reset();
  }

  saveBatchNumber() {
    this.newBatch = this.printScheduleFillingForm.value.batch;
    this.newBatchChange = true;
  }
  savePcsCarton() {
    this.pcsCarton = this.printScheduleFillingForm.value.pcsCartonQuantity;
  }

  // this function is not used

  addImpRemarkFromItemTree() {
    this.scheduleService.addImpRemarkFromItemTree().subscribe((data) => {
      console.log(data);
    });
  }

  getComponentsQty() {
    console.log(this.scheduleData);
    let filtered = this.scheduleData.filter(
      (line) =>
        line.mkp == "basic" ||
        line.mkp == "tube" ||
        line.mkp == "mkp" ||
        line.mkp == "sachet"
    );
    console.log(filtered);
    for (let line of filtered) {
      for (let component of line.components) {
        let idx = this.componentsTotalQty.findIndex(
          (comp) => comp.componentN == component.componentN
        );
        let pcsPerItem = component.PcsCarton
          ? Number(component.PcsCarton)
          : component.stickerType && component.stickerType == "twoSide"
          ? 2
          : 1;
        let qtyProduced = line.qtyProduced ? Number(line.qtyProduced) : 0;
        let qty = line.qty ? Number(line.qty) : 0;
        let quantity =
          qtyProduced > qty * 0.95
            ? 0
            : Math.ceil((qty - qtyProduced) / pcsPerItem);
        let spare = 0;
        if (quantity > 0) {
          spare =
            (qty - qtyProduced) * 0.1 < 50
              ? Math.ceil(50 / pcsPerItem)
              : (qty - qtyProduced) * 0.1 > 200
              ? Math.ceil(200 / pcsPerItem)
              : Math.ceil(((qty - qtyProduced) * 0.1) / pcsPerItem);
        }
        if (idx == -1 && quantity > 0) {
          this.componentsTotalQty.push({
            componentN: component.componentN,
            type: component.type,
            img: component.itemImage,
            pcsPerItem: pcsPerItem,
            quantity: quantity,
            grossQty: quantity + spare,
            orderNumber: line.orderN,
            itemNumber: line.item,
          });
        } else if (quantity > 0) {
          this.componentsTotalQty[idx].quantity += quantity;
          this.componentsTotalQty[idx].grossQty += quantity + spare;
          this.componentsTotalQty[idx].orderNumber += ", " + line.orderN;
          this.componentsTotalQty[idx].itemNumber += ", " + line.item;
        }
      }
    }
    this.componentsTotalQtyCopy = this.componentsTotalQty;
    this.componentsQtyReport = true;
    console.log(this.componentsTotalQty);
    // this.excelService.exportAsExcelFile(this.componentsTotalQty, "data");
  }

  filterByComponent() {
    console.log(this.searchMenu.value);
    let componentN = this.searchMenu.value.componentN;
    if (componentN == "") {
      this.componentsTotalQty = [...this.componentsTotalQtyCopy];
    } else {
      this.componentsTotalQty = this.componentsTotalQtyCopy.filter((rec) => {
        return rec.componentN.includes(componentN);
      });
    }
  }

  clearMenu() {
    this.searchMenu.reset();
    this.componentsTotalQty = this.componentsTotalQtyCopy;
  }
  sortByComponent() {
    let i = this.sortToggle;
    this.componentsTotalQty.sort((a, b) => {
      return a.componentN > b.componentN
        ? i
        : a.componentN < b.componentN
        ? -i
        : 0;
    });
    this.sortToggle *= -1;
  }

  filterByType() {
    let type = this.searchMenu.value.type;
    if (type == "") {
      this.componentsTotalQty = this.componentsTotalQtyCopy;
    } else {
      this.componentsTotalQty = this.componentsTotalQtyCopy.filter((comp) => {
        return comp.type == type;
      });
    }
  }

  printReport() {
    console.log("Print");
    setTimeout(() => {
      this.btnPrint.nativeElement.click();
    }, 500);
  }
  exportToExcel() {
    let tempArr = [];

    for (let component of this.componentsTotalQty) {
      let line = {
        קומפוננט: component.componentN,
        סוג: component.type,
        "יח' למוצר": component.pcsPerItem,
        "כמות דרושה (מדויק)": component.quantity,
        "כמות דרושה (ברוטו)": component.grossQty,
        "מספר הזמנה": component.orderNumber,
        "מקט מוצר": component.itemNumber,
      };
      tempArr.push(line);
    }
    this.excelService.exportAsExcelFile(tempArr, "data");
  }
}
