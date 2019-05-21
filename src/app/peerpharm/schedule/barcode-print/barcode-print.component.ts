import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Schedule } from "./../models/schedule";
import { ScheduleService } from "./../../../services/schedule.service";
import { ItemsService } from "./../../../services/items.service";
import { BatchesService } from "./../../../services/batches.service";
import { ToastrService } from "ngx-toastr";
import { BarcodePrintService } from "./../../../services/barcodePrint.service";

@Component({
  selector: "app-barcode-print",
  templateUrl: "./barcode-print.component.html",
  styleUrls: ["./barcode-print.component.css"]
})
export class BarcodePrintComponent implements OnInit {
  @ViewChild("print-section") printSection: ElementRef;
  today: any;
  scheduleData: any;
  public addScheduleForm: FormGroup;
  public printBarcodeForm: FormGroup;
  schedLine = new Schedule();
  closeResult: string;
  itemData: any;
  pcsCarton: string;
  volumeK: string;
  barcodeK: string;
  netoW: number;
  grossW: number;
  exp: string;
  showCustomerFlag = true;
  showOrderNumFlag = true;
  showItemFlag = true;
  showBarcodeFlag = true;
  showBatchFlag = true;
  showExpFlag = true;
  amountOfStickersArr: any[] = [];
  stickerPrintView: any[] = [];
  printBarkod: any;
  barcodeElementType = "svg";
  barcodeFormat = "CODE128";
  barcodeWidth = 2.3;
  barcodeHeight = 75;
  barcodeFontSize = 28;
  barcodeFlat = true;
  printBarcodeId: string;
  barcodeUrl: string;
  create_table: string;


  constructor(
    private scheduleService: ScheduleService,
    private itemsService: ItemsService,
    private batchesService: BatchesService,
    private modalService: NgbModal,
    private toastSrv: ToastrService,
    private barcodePrintService: BarcodePrintService
  ) {}

  ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format("YYYY-MM-DD");

    this.initAddScheduleForm();
    this.getAllSchedule();
  }

  initAddScheduleForm() {
    this.addScheduleForm = new FormGroup({
      positionN: new FormControl("", [Validators.required]),
      orderN: new FormControl("", [Validators.required]),
      item: new FormControl("", [Validators.required]),
      costumer: new FormControl("", [Validators.required]),
      productName: new FormControl("", [Validators.required]),
      batch: new FormControl("", [Validators.required]),
      packageP: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
      date: new FormControl("", [Validators.required]),
      marks: new FormControl("", [Validators.required]),
      shift: new FormControl("", [Validators.required]),
      mkp: new FormControl("", [Validators.required])
    });
  }

  getAllSchedule() {
    this.scheduleService.getSchedule().subscribe(res => {
      this.scheduleData = res;
    });
  }

  onSubmit(): void {
    const newSchedule = this.printBarcodeForm.value;
  }

  clearPrintView(){
    this.stickerPrintView=[];
    this.amountOfStickersArr=[];
  }

  // Modal Functions
  openPrintBarkod(content, line) {
    this.schedLine = line;
    this.amountOfStickersArr = [];
    this.GetItemAllData()
      .then(async () => {
        if (this.schedLine.batch) {
          //waiting foe batch data =batchNumber+Exp Date
          await this.GetBatchAllData();
        }
      })
      .then(() => this.initPrintScheduleForm())
      .then(() => {
        this.modalService
          .open(content, { ariaLabelledBy: "modal-basic-title" })
          .result.then(
            result => {
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult);
            },
            reason => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
      });
  }

  GetItemAllData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.itemsService.getItemData(this.schedLine.item).subscribe(data => {
          this.itemData = data;
          console.log(data);
          resolve(data);
        });
      }, 500);
    });
  }

  GetBatchAllData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.batchesService
          .getBatchData(this.schedLine.batch)
          .subscribe(data => {
            this.exp = data[0].expration;
            console.log(data);
            resolve(data);
          });
      }, 1000);
    });
  }

  initPrintScheduleForm() {
    this.pcsCarton = this.itemData[0].PcsCarton.replace(/\D/g, "") + " Pcs";
    this.barcodeK = this.itemData[0].barcodeK;
    this.volumeK = this.itemData[0].volumeKey+' ml';
    this.netoW = this.itemData[0].netWeightK;
    this.grossW = this.itemData[0].grossUnitWeightK;

    this.printBarcodeForm = new FormGroup({
      costumer: new FormControl(
        { value: this.schedLine.costumer, disabled: true },
        [Validators.required]
      ),
      orderN: new FormControl(
        { value: this.schedLine.orderN, disabled: true },
        [Validators.required]
      ),
      item: new FormControl({ value: this.schedLine.item, disabled: true }, [
        Validators.required
      ]),
      productName: new FormControl(
        { value: this.schedLine.productName, disabled: true },
        [Validators.required]
      ),
      unitMsr: new FormControl({ value: this.volumeK, disabled: true }, [
        Validators.required
      ]),
      pcsCtn: new FormControl(this.pcsCarton, [Validators.required]),
      barcode: new FormControl(this.barcodeK, [Validators.required]),
      batch: new FormControl(this.schedLine.batch, [Validators.required]),
      exp: new FormControl(this.exp, [Validators.required]),
      local: new FormControl("", [Validators.required]),
      printQty: new FormControl("", [Validators.required])
    });
  }

  RemoveFields(field) {
    switch (field) {
      case "customer":
        this.showCustomerFlag = false;
        break;
      case "orderN":
        this.showOrderNumFlag = false;
        break;
      case "item":
        this.showItemFlag = false;
        break;
      case "barcode":
        this.showBarcodeFlag = false;
        break;
      case "batch":
        this.showBatchFlag = false;
        break;
      case "exp":
        this.showExpFlag = false;
        break;
    }
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

  printSubmit() {
    this.amountOfStickersArr = [];
    this.printBarcodeId=null;
    this.showCustomerFlag = true;
    this.showOrderNumFlag = true;
    this.showItemFlag = true;
    this.showBarcodeFlag = true;
    this.showBatchFlag = true;
    this.showExpFlag = true;

    this.printBarkod = this.printBarcodeForm.value;
    if (this.printBarkod.printQty > 0 && this.printBarkod.printQty != "") {
      for (let i = 0; i < this.printBarkod.printQty; i++) {
        this.amountOfStickersArr.push(this.printBarkod);
        this.create_table = "create_table"+i;
      }
      this.stickerPrintView[0]=this.amountOfStickersArr[0];

      console.log(this.amountOfStickersArr);

    } else {
      this.toastSrv.error("Please enter amount of stickers");
    }
  }

  get printBarcodeValues(): string[] {
    return this.printBarkod.barcode.split("\n");
  }

  printBarcode() {
    document.getElementById("print-section").setAttribute('style' , 'margin: 0px ; padding: 0px');

    const prtContent = document.getElementById("print-section").innerHTML;
    const barcodeObj = { allBarcode: prtContent };
    debugger
    this.barcodePrintService.addBarcodePrint(barcodeObj).subscribe(data => {
      console.log(data);
      this.printBarcodeId = data.id;
      console.log(this.printBarcodeId);
      // this.barcodeUrl = 'http://localhost/old/newBarcode.html?_id=' + this.printBarcodeId; //localhost
      this.barcodeUrl = 'http://peerpharmsystem.com/old/newBarcode.html?_id=' + this.printBarcodeId; // production 18.221.58.99
    });

  }
}
