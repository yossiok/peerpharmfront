import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BatchesService } from "src/app/services/batches.service";
import { ItemsService } from "src/app/services/items.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-batches-mkp",
  templateUrl: "./batches-mkp.component.html",
  styleUrls: ["./batches-mkp.component.scss"],
})
export class BatchesMkpComponent implements OnInit {
  mkpBatches: any[];
  allStickers: any[] = [];
  currentItem: any;
  currentItemName: any;
  currentBarrels: any;
  currentBatchNumber: any;
  currentExpDate: any;
  currentProduced: any;
  currentOrderN: any;
  currentPH: any;
  currentWeightKG: any;

  @ViewChild("printBtn") printBtn: ElementRef;

  newMkpBatch = {
    order: "",
    item: "",
    itemName: "",
    produced: this.formatDate(new Date()),
    expration: "",
    barrels: "",
    weightKg: "",
    ph: "",
    batchNumber: "",
    type: "",
    user: this.authService.loggedInUser.userName,
  };

  constructor(
    private toastSr: ToastrService,
    private itemService: ItemsService,
    private batchService: BatchesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllMkpBatches();
    let user = this.authService.loggedInUser;
    console.log(user);
  }

  checkPermission() {
    return this.authService.loggedInUser.screenPermission == "5";
  }

  getAllMkpBatches() {
    this.batchService.getAllMkpBatches().subscribe((data) => {
      this.mkpBatches = data;
    });
  }
  rePrint(batch) {
    this.currentItem = batch.item;
    this.currentItemName = batch.itemName;
    this.currentBarrels = batch.barrels;
    this.currentBatchNumber = batch.batchNumber;
    this.currentExpDate = batch.expration;
    this.currentProduced = batch.produced;
    this.currentOrderN = batch.order;
    this.currentPH = batch.ph;
    this.currentWeightKG = batch.weightKg;

    if (parseInt(batch.barrels) > 1) {
      for (let x = 1; x < parseInt(batch.barrels) + 1; x++) {
        let obj = {
          item: {
            currentItem: this.currentItem,
            currentItemName: this.currentItemName,
            currentBarrels: this.currentBarrels,
            currentBatchNumber: this.currentBatchNumber,
            currentExpDate: this.currentExpDate,
            currentProduced: this.currentProduced,
            currentOrderN: this.currentOrderN,
            currentPH: this.currentPH,
            currentWeightKG: (
              this.currentWeightKG / +this.currentBarrels
            ).toFixed(2),
          },
          printNum: "" + x + "/" + parseInt(batch.barrels),
        };
        this.allStickers.push(obj);
      }
    } else {
      let obj = {
        item: {
          currentItem: this.currentItem,
          currentItemName: this.currentItemName,
          currentBarrels: this.currentBarrels,
          currentBatchNumber: this.currentBatchNumber,
          currentExpDate: this.currentExpDate,
          currentProduced: this.currentProduced,
          currentOrderN: this.currentOrderN,
          currentPH: this.currentPH,
          currentWeightKG: this.currentWeightKG,
        },
        printNum: "1/1",
      };
      this.allStickers.push(obj);
    }

    setTimeout(() => {
      this.printBtn.nativeElement.click();
    }, 500);

    setTimeout(() => {
      this.allStickers = [];
    }, 3500);
  }
  addNewMkpBatch() {
    this.currentItem = this.newMkpBatch.item.trim();
    this.currentItemName = this.newMkpBatch.itemName.trim();
    this.currentBarrels = this.newMkpBatch.barrels;
    this.currentBatchNumber = this.newMkpBatch.batchNumber;
    this.currentExpDate = this.newMkpBatch.expration;
    this.currentProduced = this.newMkpBatch.produced;
    this.currentOrderN = this.newMkpBatch.order;
    this.currentPH = this.newMkpBatch.ph;
    this.currentWeightKG = this.newMkpBatch.weightKg;

    if (
      this.currentItem == "" ||
      this.currentItemName == "" ||
      this.currentExpDate == "" ||
      this.currentBatchNumber == "" ||
      this.currentExpDate == "" ||
      this.currentProduced == "" ||
      this.currentWeightKG == ""
    ) {
      this.toastSr.error("?????? ?????? ???? ???? ????????????", "???????? ?????????? ????????????");
      return;
    }

    if (parseInt(this.newMkpBatch.barrels) > 1) {
      for (let x = 1; x < 1 + this.currentBarrels; x++) {
        let obj = {
          item: {
            currentItem: this.currentItem,
            currentItemName: this.currentItemName,
            currentBarrels: this.currentBarrels,
            currentBatchNumber: this.currentBatchNumber,
            currentExpDate: this.currentExpDate,
            currentProduced: this.currentProduced,
            currentOrderN: this.currentOrderN,
            currentPH: this.currentPH,
            currentWeightKG: (
              this.currentWeightKG / +this.currentBarrels
            ).toFixed(2),
          },
          printNum: "" + x + "/" + parseInt(this.newMkpBatch.barrels),
        };
        this.allStickers.push(obj);
      }
    } else {
      let obj = {
        item: {
          currentItem: this.currentItem,
          currentItemName: this.currentItemName,
          currentBarrels: this.currentBarrels,
          currentBatchNumber: this.currentBatchNumber,
          currentExpDate: this.currentExpDate,
          currentProduced: this.currentProduced,
          currentOrderN: this.currentOrderN,
          currentPH: this.currentPH,
          currentWeightKG: this.currentWeightKG,
        },
        printNum: "1/1",
      };
      this.allStickers.push(obj);
    }

    if (this.newMkpBatch.batchNumber != "") {
      this.newMkpBatch.type = "makeup";
      let reduce = confirm("?????? ???????????? ???????????? ?????????????");
      console.log(this.newMkpBatch);
      console.log(reduce);

      this.batchService
        .addNewMkpBatch(this.newMkpBatch, reduce)
        .subscribe((data) => {
          console.log(data);
          if (data.msg) {
            this.toastSr.error(
              "???????????? ???? ??????????. ?????? ???????? ?????????? ???????? ??????. ",
              data.msg
            );
            return;
          } else if (data) {
            this.mkpBatches = data;
            setTimeout(() => {
              this.printBtn.nativeElement.click();
            }, 500);
            this.toastSr.success("?????????? ?????????? ????????");
            this.resetValues();
            setTimeout(() => {
              this.allStickers = [];
            }, 3500);
          }
        });
    }
  }
  resetValues() {
    this.newMkpBatch.item = "";
    this.newMkpBatch.itemName = "";
    this.newMkpBatch.barrels = "";
    this.newMkpBatch.batchNumber = "";
    this.newMkpBatch.expration = "";
    this.newMkpBatch.order = "";
    this.newMkpBatch.ph = "";
    this.newMkpBatch.weightKg = "";
  }

  fillItemName(ev) {
    var itemNumber = ev.target.value;
    this.itemService.getItemData(itemNumber).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSr.error(data.msg);
        return;
      } else if (data.length == 0) {
        this.toastSr.error("?????????????? " + itemNumber + " ???? ?????????? ????????????");
        this.newMkpBatch.item = "";
        this.newMkpBatch.itemName = "";
        return;
      } else {
        this.newMkpBatch.itemName =
          data[0].name + " " + data[0].subName + " " + data[0].discriptionK;
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
}
