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
  styleUrls: ["./barcode-print.component.scss"]
})
export class BarcodePrintComponent implements OnInit {
  @ViewChild("print-section") printSection: ElementRef;
  @ViewChild("otherValue") otherValue: ElementRef;
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;

  today: any;
  scheduleData: any;
  scheduleDataCopy: any;
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
  date:string;
  dc:string;
  deliveryAdress:string;
  po:string;
  invoice:string;
  other: string;
  netWeight: string;
  grossWeight: string;
  item:number;
  packingCode: number;
  showExp = true;
  showBatch = true;
  showItemNumber = true;
  showPcsCarton = true;
  showVolume = true;
  showProductName = true;
  showCustomerFlag = true;
  showPcsCtnFlag = true;
  showVolumeKeyFlag = true;
  showOtherFlag = true;
  showProductFlag = true;
  showOrderNumFlag = true;
  showItemFlag = true;
  showBarcodeFlag = true;
  showBatchFlag = true;
  showExpFlag = true;
  showInvoiceFlag = true;
  showDcFlag = true;
  showPoFlag = true;
  showNetWeightFlag = true;
  showGrossWeightFlag = true;
  showPackingCodeFlag = true;
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
  shipInIsrael = true;


  constructor(
    private scheduleService: ScheduleService,
    private itemsService: ItemsService,
    private batchesService: BatchesService,
    private modalService: NgbModal,
    private toastSrv: ToastrService,
    private barcodePrintService: BarcodePrintService
    
  ) { }

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
      mkp: new FormControl("", [Validators.required]),
      other: new FormControl("", [Validators.required]),
      dc: new FormControl("", [Validators.required]),
      deliveryAdress: new FormControl("", [Validators.required]),
      po: new FormControl("", [Validators.required]),
      invoice: new FormControl("", [Validators.required]),
      netWeight: new FormControl("", [Validators.required]),
      grossWeight: new FormControl("", [Validators.required]),
      packingCode: new FormControl("", [Validators.required])
    
      

      
    });
  }

  dateChange(){
    
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.scheduleService.getAllSchedulePrintByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.scheduleData = data;
        this.scheduleDataCopy = data;
      })
    } else {
      this.getAllSchedule();
    }
  
  }

  getAllSchedule() {
    
    this.scheduleService.getSchedule().subscribe(res => {
      this.scheduleData = res;
      this.scheduleDataCopy = res;
   
    });
  }

  filterByOrderNumber(ev){
    
    var orderNumber = ev.target.value;
    if(orderNumber != "") {
    this.scheduleService.getScheduleByOrderNumber(orderNumber).subscribe(data=>{
      this.scheduleData = data;
     

    })
  }else {
    this.scheduleData = this.scheduleDataCopy
  }
  }

  onSubmit(): void {
    
    const newSchedule = this.printBarcodeForm.value;
  }

  clearPrintView() {
    this.stickerPrintView = [];
    this.amountOfStickersArr = [];
  }

  // Modal Functions
  openPrintBarkod(content, line) {
    debugger
    this.schedLine = line;
    this.amountOfStickersArr = [];
    this.GetItemAllData()
      .then(async () => {
        if (this.schedLine.batch) {
          //waiting foe batch data =batchNumber+Exp Date
          await this.GetBatchAllData();
        }
      })
      .then(() => this.initPrintScheduleForm(line))
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

  openPrintBarkodHul(contentHul, line) {
    debugger;
    this.schedLine = line;
    this.amountOfStickersArr = [];
    this.GetItemAllData()
      .then(async () => {
        if (this.schedLine.batch) {
          //waiting foe batch data =batchNumber+Exp Date
          await this.GetBatchAllData();
        }
      })
      .then(() => this.initPrintScheduleForm(line))
      .then(() => {
        this.modalService
          .open(contentHul, { ariaLabelledBy: "modal-basic-title" })
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
            if(data.length != 0) {
              this.exp = data[0].expration;
            }
            
            console.log(data);
            resolve(data);
          });
      }, 1000);
    });
  }

  initPrintScheduleForm(line) {
    
    this.pcsCarton = this.itemData[0].PcsCarton.replace(/\D/g, "") + " Pcs";
    this.barcodeK = this.itemData[0].barcodeK;
    this.volumeK = this.itemData[0].volumeKey + ' ml';
    this.netoW = this.itemData[0].netWeightK;
    this.grossW = this.itemData[0].grossUnitWeightK;


    var dcNumber;
    var deliveryAdress;
    var qtyToPrint;

    var poNumber = this.schedLine.marks
    
    if(poNumber.startsWith( "03")){
      dcNumber = "883"
      deliveryAdress = "PHILADELPHIA 2760 RED LION RD PHILADELPHIA,PA 19114 U.S.A"
    }
    
    if(poNumber.startsWith( "30")){
      dcNumber = "893"
      deliveryAdress = "PITTSTON 4000 OLDFIELD DRIVE PITTSTON, PA 18640 U.S.A"
    }

    
    if(poNumber.startsWith( "20")){
      deliveryAdress = "Winners Mechant int'l LP 60 Standish Court Mississauga,ON L5R OG1"
    }

    qtyToPrint = (Math.ceil(Number(this.schedLine.qty)/parseInt(this.pcsCarton)))*2
    
    
    

    this.printBarcodeForm = new FormGroup({
      costumer: new FormControl(
        { value: this.schedLine.costumer, disabled: false },
        [Validators.required]
      ),
      orderN: new FormControl(
        { value: this.schedLine.orderN, disabled: false },
        [Validators.required]
      ),
      item: new FormControl({ value: this.schedLine.item, disabled: false }, [
        Validators.required
      ]),
      productName: new FormControl(
        { value: this.schedLine.productName, disabled: false },
        [Validators.required]
      ),
      unitMsr: new FormControl({ value: this.volumeK, disabled: false }, [
        Validators.required
      ]),
      pcsCtn: new FormControl(this.pcsCarton, [Validators.required]),
      barcode: new FormControl(this.barcodeK, [Validators.required]),
      batch: new FormControl(this.schedLine.batch, [Validators.required]),
      exp: new FormControl(this.exp, [Validators.required]),
      date: new FormControl(JSON.stringify(this.schedLine.date).slice(1,11), [Validators.required]),
      local: new FormControl("", [Validators.required]),
      printQty: new FormControl(qtyToPrint, [Validators.required]),
      other: new FormControl('' ,[Validators.required]),
      dc: new FormControl(dcNumber ,[Validators.required]),
      deliveryAdress: new FormControl(deliveryAdress ,[Validators.required]),
      po: new FormControl(this.schedLine.marks ,[Validators.required]),
      invoice: new FormControl(line.invoiceNumber ,[Validators.required]),
      netWeight: new FormControl('' ,[Validators.required]),
      grossWeight: new FormControl('' ,[Validators.required]),
      packingCode: new FormControl('' ,[Validators.required])
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
        this.showItemNumber = false;
        break;
      case "barcode":
        this.showBarcodeFlag = false;
        break;
      case "batch":
        this.showBatchFlag = false;
        this.showBatch = false;
        break;
      case "exp":
        this.showExpFlag = false;
        this.showExp = false;
        break;
      case "other":
        this.showOtherFlag = false;
        break;
      case "po":
        this.showPoFlag = false;
        break;
      case "invoice":
        this.showInvoiceFlag = false;
        break;
      case "netWeight":
        this.showNetWeightFlag = false;
        break;
      case "grossWieght":
        this.showGrossWeightFlag = false;
        break;
      case "dc":
        this.showDcFlag = false;
        break;
      case "productName":
        this.showProductFlag = false;
        this.showProductName = false;
        break;
      case "unitMsr":
        this.showVolumeKeyFlag = false;
        this.showVolume = false;
        break;
      case "pcsCtn":
        this.showPcsCtnFlag = false;
        this.showPcsCarton = false;
        break;
        case "packingCode":
          this.showPackingCodeFlag = false;
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
    
    if(this.printBarcodeForm.value.other!=""){
      this.other= this.printBarcodeForm.value.other;
    }
    if(this.printBarcodeForm.value.date !="") {
      this.date = this.printBarcodeForm.value.date
    }
    if(this.printBarcodeForm.value.dc !="") {
      this.dc = this.printBarcodeForm.value.dc
    }

    if(this.printBarcodeForm.value.deliveryAdress !=""){
      this.deliveryAdress = this.printBarcodeForm.value.deliveryAdress;
    }
  
    if(this.printBarcodeForm.value.po !="") {
      this.po = this.printBarcodeForm.value.po
    }
  
    if(this.printBarcodeForm.value.invoice !="") {
      this.invoice = this.printBarcodeForm.value.invoice
    }
  
    if(this.printBarcodeForm.value.netWeight !="") {
      this.netWeight = this.printBarcodeForm.value.netWeight
    }
  
    if(this.printBarcodeForm.value.grossWeight !="") {
      this.grossWeight = this.printBarcodeForm.value.grossWeight
    }
    if(this.printBarcodeForm.value.packingCode !="") {
      this.packingCode = this.printBarcodeForm.value.packingCode
    }
    if(this.printBarcodeForm.value.item !="") {
      this.item = this.printBarcodeForm.value.item
    }
  
    if(this.printBarcodeForm.value.unitMsr !="") {
      this.volumeK = this.printBarcodeForm.value.unitMsr
    }
  
    
 

   
    this.printBarkod = this.printBarcodeForm.value;
    if (this.printBarkod.printQty > 0 && this.printBarkod.printQty != "") {
      for (let i = 0; i < this.printBarkod.printQty; i++) {
        this.amountOfStickersArr.push(this.printBarkod);
        this.create_table = "create_table" + i;
      }
      this.stickerPrintView[0] = this.amountOfStickersArr[0];

      console.log(this.amountOfStickersArr);

    } else {
      this.toastSrv.error("Please enter amount of stickers");
    }

 
    
  }

  get printBarcodeValues(): string[] {
    return this.printBarkod.barcode.split("\n");
  }

  printBarcode() {
    
    document.getElementById("print-section").setAttribute('style', 'margin: 0px ; padding: 0px');

    const prtContent = document.getElementById("print-section").innerHTML;
    const barcodeObj = { allBarcode: prtContent };
    
    this.barcodePrintService.addBarcodePrint(barcodeObj).subscribe(data => {
      console.log(data);
      this.printBarcodeId = data.id;
      console.log(this.printBarcodeId);
      // this.barcodeUrl = 'http://localhost/old/newBarcode.html?_id=' + this.printBarcodeId; //localhost
      this.barcodeUrl = 'http://peerpharmsystem.com/old/newBarcode.html?_id=' + this.printBarcodeId; // production 18.221.58.99
    });

  }
}
