import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { BatchesService } from "../../services/batches.service";
// test for excel export
import { ExcelService } from "../../services/excel.service";
// private excelService:ExcelService
import * as moment from "moment";
import { Toast } from "ngx-toastr";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UserInfo } from "../taskboard/models/UserInfo";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ItemsService } from "src/app/services/items.service";

@Component({
  selector: "app-batches",
  templateUrl: "./batches.component.html",
  styleUrls: ["./batches.component.scss"],
})
export class BatchesComponent implements OnInit {
  myRefresh: any = null;
  savingSpecValues: boolean;

  constructor(
    private itemService: ItemsService,
    private modalService: NgbModal,
    private authService: AuthService,
    private batchService: BatchesService,
    private excelService: ExcelService,
    private toastSrv: ToastrService
  ) {}
  // dateList:Array<any>=[{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5}];
  batches: Array<any>;
  mkpBatches: Array<any>;
  batchesCopy: Array<any>;
  lastBatchToExport: String;
  userValueUpdate: String;
  lastValueUpdate: String;
  EditRowId: any = "";
  hasMoreItemsToload: boolean = true;
  currentDoc: any;
  currBatch: any;
  user: UserInfo;
  alowUserEditBatches: Boolean = false;
  tableType: String = "batch";
  ifConfirmed: Boolean = false;
  editValues: Boolean = false;
  showLoader: Boolean = true;
  specValuesModal: Boolean = false;
  showRemarks: Boolean = true;
  closeResult: any;
  batchPrint: any;
  item: any;
  batchToPrint: any;
  allStickers: Array<any>;

  batch = {
    batchNumber: "",
    batchStatus: "",
    barrels: "",
    expration: "",
    item: "",
    itemName: "",
    order: "",
    ph: "",
    produced: "",
    weightQtyLeft: 0,
    weightKg: "",
    color: "",
  };

  itemTree = {
    phValue: "",
    viscosityValue: "",
    colorValue: "",
    textureValue: "",
    scentValue: "",
    densityValue: "",
  };

  @ViewChild("colorValue") colorValue: ElementRef;
  @ViewChild("textureValue") textureValue: ElementRef;
  @ViewChild("scentValue") scentValue: ElementRef;
  @ViewChild("viscosityValue") viscosityValue: ElementRef;
  @ViewChild("densityValue") densityValue: ElementRef;
  @ViewChild("phValue") phValue: ElementRef;
  @ViewChild("batchNumber") batchNumber: ElementRef;
  @ViewChild("batchProduced") batchProduced: ElementRef;
  @ViewChild("batchItemName") batchItemName: ElementRef;
  @ViewChild("batchPh") batchPh: ElementRef;
  @ViewChild("batchWeightKd") batchWeightKg: ElementRef;
  @ViewChild("batchWeightQtyLeft") batchWeightQtyLeft: ElementRef;
  @ViewChild("batchWeightQty") batchWeightQty: ElementRef;
  @ViewChild("batchBarrels") batchBarrels: ElementRef;
  @ViewChild("batchOrder") batchOrder: ElementRef;
  @ViewChild("batchItem") batchItem: ElementRef;
  @ViewChild("printValueBtn") printValueBtn: ElementRef;
  @ViewChild("printBtn") printBtn: ElementRef;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.edit("");
  }

  ngOnInit() {
    this.getAllBatchesYear();
    this.startInterval();
    this.lastValueUpdate = this.formatDate(new Date());
    this.getUserInfo();
  }

  checkPermission() {
    return this.authService.loggedInUser.screenPermission == "5";
  }

  printSpecValues() {
    this.editValues = false;
    this.showRemarks = false;
    this.printValueBtn.nativeElement.click();
  }

  addBatch() {
    this.batchService.addBatch(this.batch).subscribe((data) => {
      this.batches.push(data);
      this.batchesCopy.push(data);
      this.getAllBatches();
      this.toastSrv.success("Batch has been added successfully");

      this.batch = {
        batchNumber: "",
        batchStatus: "",
        barrels: "",
        expration: "",
        item: "",
        itemName: "",
        order: "",
        ph: "",
        produced: "",
        weightQtyLeft: 0,
        weightKg: "",
        color: "",
      };
    });
  }

  getAllBatches() {
    this.batchService.getAllBatches().subscribe((res) => {
      console.log(res);
      this.batches = res;
      this.batchesCopy = res;
      this.batches.map((batch) => {
        if (batch.weightKg != null && batch.weightQtyLeft != null) {
          if (batch.weightQtyLeft == 0) batch.color = "Aquamarine";
          else if (batch.scheduled == "yes") batch.color = "yellow";
          else if (batch.weightQtyLeft < batch.weightKg) batch.color = "orange";
          else batch.color = "white";
          if (res.length == res.length) {
            this.hasMoreItemsToload = false;
            this.showLoader = false;
          }
        }
      });
    });
  }

  edit(id) {
    if (this.alowUserEditBatches == true) {
      this.EditRowId = id;

      if (id != "") {
        this.currentDoc = this.batches.filter((i) => {
          if (i._id == id) {
            return i;
          }
        })[0];
      } else {
        this.EditRowId = "";
      }
    }
  }

  stopInterval() {
    clearInterval(this.myRefresh);
  }

  startInterval() {
    this.myRefresh = setInterval(() => {
      this.getAllBatchesYear();
    }, 1000 * 60 * 5);
  }

  getAllBatchesYear() {
    this.batchService.getAllBatchesYear().subscribe((res) => {
      console.log(res);
      this.batches = res.filter((b) => b.type != "makeup");
      this.mkpBatches = res.filter((b) => b.type == "makeup");
      this.batchesCopy = res;
      this.batches.map((batch) => {
        if (batch.weightKg != null && batch.weightQtyLeft != null) {
          if (batch.weightQtyLeft == 0) batch.color = "Aquamarine";
          else if (batch.scheduled == "yes") batch.color = "yellow";
          else if (batch.weightQtyLeft < batch.weightKg) batch.color = "orange";
          else batch.color = "white";

          if (res.length == res.length) {
            this.hasMoreItemsToload = false;
            this.showLoader = false;
          }
        }
      });
      this.mkpBatches.map((batch) => {
        if (batch.weightKg != null && batch.weightQtyLeft != null) {
          if (batch.weightQtyLeft == 0) batch.color = "Aquamarine";
          else if (batch.scheduled == "yes") batch.color = "yellow";
          else if (batch.weightQtyLeft < batch.weightKg) batch.color = "orange";
          else batch.color = "white";

          if (res.length == res.length) {
            this.hasMoreItemsToload = false;
            this.showLoader = false;
          }
        }
      });
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  openTableValues(itemNumber, batchNumber) {
    this.batchService.getBatchData(batchNumber).subscribe((data) => {
      this.currBatch = data[0];
      this.currBatch.kgProduced =
        Number(this.currBatch.weightKg) - Number(this.currBatch.weightQtyLeft);
    });

    this.specValuesModal = true;
    this.loadSpecTable(itemNumber);
  }

  setBatchAsScheduled(id) {
    if (confirm("האם לשנות סטטוס לאצווה זו ?")) {
      this.batchService.setBatchToSchedule(id).subscribe((data) => {
        if (data) {
          let batch = this.batches.find((b) => b._id == data._id);
          batch.scheduled = data.scheduled;
          if (batch.scheduled == "yes") batch.color = "yellow";
          this.toastSrv.success("סטטוס עודכן בהצלחה");
        }
      });
    }
  }

  loadSpecTable(itemNumber) {
    this.itemService.getItemData(itemNumber).subscribe((data) => {
      if (data[0].valueStatus == undefined) {
        data[0].valueStatus = "";
      }
      if (data[0].scentValue == undefined) {
        data[0].scentValue = "";
      }
      if (data[0].textureValue == undefined) {
        data[0].textureValue = "";
      }
      if (data[0].colorValue == undefined) {
        data[0].colorValue = "";
      }
      if (data[0].viscosityValue == undefined) {
        data[0].viscosityValue = "";
      }
      if (data[0].densityValue == undefined) {
        data[0].densityValue = "";
      }
      if (data[0].phValue == undefined) {
        data[0].phValue = "";
      }
      this.item = data[0];

      if (data[0].valueStatus == "confirm") {
        this.ifConfirmed = true;
      } else {
        this.ifConfirmed = false;
      }
    });
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  openPrint(printBatch, batchNumber) {
    this.modalService
      .open(printBatch, { size: "lg", ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    this.loadDataPrint(batchNumber);
  }

  loadDataPrint(batchNumber) {
    var batchToPrint = [];
    batchToPrint = this.batches.find(
      (batch) => batch.batchNumber == batchNumber
    );
    this.batchPrint = batchToPrint;
  }

  filterBatchesBiggerThenBatchN() {
    var excelTable = [];
    if (this.lastBatchToExport != "" && this.lastBatchToExport != null) {
      this.batches.map((batch) => {
        var lastBatchYear;
        var lastBatchNum;
        var year;
        var number;
        if (this.lastBatchToExport.includes("pp")) {
          lastBatchYear = this.lastBatchToExport.split("pp")[0];
          lastBatchNum = this.lastBatchToExport.split("pp")[1];
        } else {
          //some batches dont have "YYpp...""
          lastBatchYear = "1";
          lastBatchNum = this.lastBatchToExport;
        }
        if (batch.batchNumber.includes("pp")) {
          year = batch.batchNumber.split("pp")[0];
          number = batch.batchNumber.split("pp")[1];
        } else {
          //some batches dont have "YYpp...""
          year = 1;
          number = batch.batchNumber;
        }

        if (
          year >= lastBatchYear &&
          number >= lastBatchNum &&
          batch.weightKg != null &&
          batch.weightQtyLeft != null
        ) {
          let obj = {
            batchNumber: batch.batchNumber,
            produced: batch.produced,
            item: batch.item,
            itemName: batch.itemName,
            expration: batch.expration,
            order: batch.order,
            ph: batch.ph,
            weightKg: batch.weightKg,
          };
          excelTable.push(obj);
        }
      });
      this.exportAsXLSX(excelTable);
      this.lastBatchToExport = "";
    } else {
      this.toastSrv.error("No batch number to follow");
    }
  }

  addNewBatch() {}

  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(data, "batches");
  }

  filterBatches(ev, filterBy) {
    if (ev.target.value == "" || ev.target.value == undefined) {
      this.batches = this.batchesCopy;
    } else if (ev.target.value.length > 2) {
      if (filterBy == "itemName") {
        let name = ev.target.value;
        this.batches = this.batchesCopy.filter((batch) =>
          batch.itemName.toLowerCase().includes(name.toLowerCase())
        );
      }

      if (filterBy == "itemNumber") {
        let number = ev.target.value;
        this.batches = this.batchesCopy.filter((batch) =>
          batch.item ? batch.item.includes(number) : false
        );
      }

      if (filterBy == "batchNumber") {
        let number = ev.target.value;
        this.batches = this.batchesCopy.filter((batch) =>
          batch.batchNumber.toLowerCase().includes(number.toLowerCase())
        );
      }
    }
  }

  resetFilters() {
    this.batches = this.batchesCopy;
  }

  deleteBatch(batch) {
    if (confirm("Delete batch?")) {
      this.batchService.deleteBatch(batch).subscribe((res) => {
        this.batches = this.batches.filter((elem) => elem._id != batch._id);
      });
    }
  }

  saveEdit(currdoc) {
    if (
      this.batchNumber.nativeElement.value &&
      this.batchItemName.nativeElement.value != ""
    ) {
      this.currentDoc.batchNumber = this.batchNumber.nativeElement.value.trim();
      this.currentDoc.itemName = this.batchItemName.nativeElement.value.trim();
      this.currentDoc.weightQtyLeft =
        this.batchWeightQtyLeft.nativeElement.value.trim();
      this.currentDoc.weightKg = Number(
        this.batchWeightQty.nativeElement.value.trim()
      );
      this.currentDoc.ph = this.batchPh.nativeElement.value.trim();
      this.currentDoc.barrels = this.batchBarrels.nativeElement.value.trim();
      this.currentDoc.order = this.batchOrder.nativeElement.value.trim();
      this.currentDoc.item = this.batchItem.nativeElement.value.trim();

      if (confirm("האם אתה בטוח רוצה לשנות פריטים אלו ?") == true) {
        this.updateDocument();
      }
    } else {
      this.toastSrv.error("Can't save changes with missing fields.");
    }
  }

  saveSpecValues(itemNumber) {
    this.savingSpecValues = true;
    switch (this.item.valueStatus) {
      case "confirm":
        this.currBatch.specStatus = { color: "green", status: 1 };
        break;
      case "noConfirm":
        this.currBatch.specStatus = { color: "red", status: 0 };
        break;
      case "hold":
        this.currBatch.specStatus = { color: "orange", status: 2 };
        break;
      default:
        this.currBatch.specStatus = { color: "#2962FF", status: -1 };
    }
    this.batchService
      .updateSpecvalue(this.currBatch.batchNumber, this.currBatch.specStatus)
      .subscribe((response) => {
        response.msg == "success"
          ? this.toastSrv.success("Spec status saved.")
          : this.toastSrv.error("Spec status not saved");
      });
    var obj = {
      date: this.lastValueUpdate,
      user: this.userValueUpdate,
    };

    var batchObj = {
      batchNumber: this.currBatch.batchNumber,
      phValue: this.phValue.nativeElement.value,
      viscosityValue: this.viscosityValue.nativeElement.value,
      colorValue: this.colorValue.nativeElement.value,
      textureValue: this.textureValue.nativeElement.value,
      scentValue: this.scentValue.nativeElement.value,
      densityValue: this.densityValue.nativeElement.value,
      lastUpdatedValues: [],
    };

    batchObj.lastUpdatedValues.push(obj);

    this.itemService.updateItemValues(batchObj).subscribe((data) => {
      if (data.msg == "cantUpdate") {
        this.toastSrv.error("Cant update after confirmation");
        this.editValues = false;
      } else {
        this.toastSrv.success("עודכן בהצלחה !");
        this.editValues = false;
        this.specValuesModal = false;
        this.item = data;
        if (data.valueStatus == "confirm") {
          this.ifConfirmed = true;
        } else {
          this.ifConfirmed = false;
        }
      }
      this.savingSpecValues = false;
    });
  }

  updateDocument() {
    this.batchService.updateBatchesForm(this.currentDoc).subscribe((data) => {
      this.batches.map((doc) => {
        if (doc.id == this.currentDoc._id) {
          doc = data;
        }
      });
      this.batchesCopy.map((doc) => {
        if (doc.id == this.currentDoc._id) {
          doc = data;
        }
      });

      this.EditRowId = "";
      this.toastSrv.success("Details were successfully saved");
    });
  }

  async getUserInfo() {
    if (this.authService.loggedInUser) {
      if (this.authService.loggedInUser.authorization.includes("editBatches")) {
        this.alowUserEditBatches = true;
      }
    }

    await this.authService.userEventEmitter.subscribe((user) => {
      this.user = user;
      this.userValueUpdate = user.userName;
    });
  }
  printSticker(index) {
    this.batchToPrint = this.batches[index];
    let multiBatch = [];
    multiBatch = this.batches.filter(
      (b) => b.batchNumber == this.batchToPrint.batchNumber
    );
    let orders = [];
    let totalWeight = 0;
    for (let b of multiBatch) {
      orders.push({
        order: b.order,
        itemNumber: b.item,
        weight: b.weightKg,
      });
      totalWeight += b.weightKg;
    }
    console.log(multiBatch);
    console.log(orders);
    console.log(this.batchToPrint);
    if (this.batchToPrint) {
      console.log("Batch list exists");
      console.log(this.batchToPrint.barrels);
      let barellsNum = this.batchToPrint.barrels;
      console.log(barellsNum);
      this.allStickers = [];
      for (let x = 1; x <= barellsNum; x++) {
        console.log("I am in the loop");
        let batchSticker = {
          printNum: "" + x + "/" + barellsNum,
          itemName: this.batchToPrint.itemName,
          batchNumber: this.batchToPrint.batchNumber,
          produced: this.batchToPrint.produced,
          expiration: this.batchToPrint.expration,
          ph: this.batchToPrint.ph,
          orders: orders,
          itemNumber: this.batchToPrint.item,
          weightKg: totalWeight,
        };
        console.log(batchSticker);
        this.allStickers.push(batchSticker);
      }
      console.log(this.allStickers);
      setTimeout(() => {
        this.printBtn.nativeElement.click();
      }, 500);
    } else {
      this.toastSrv.error("The batch doesn't exist.");
    }
  }
}
