import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { CostumersService } from "src/app/services/costumers.service";
import { ExcelService } from "src/app/services/excel.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ItemsService } from "src/app/services/items.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { YearCount } from "../../shelf-list/YearCount";
import * as XLSX from "xlsx";
import { difference } from "lodash";
import { Subject } from "rxjs";

@Component({
  selector: "app-wharehouse-updates",
  templateUrl: "./wharehouse-updates.component.html",
  styleUrls: ["./wharehouse-updates.component.scss"],
})
export class WhareHouseUpdatesComponent implements OnInit {
  allShelfs: any;
  allCostumers: any;
  EditRow: any;
  materialShelfs: any;
  allShelfsCopy: any;
  itemType: string = "";
  whareHouse: string = "";
  shelfId: any = {};
  allowedWHS: string[];
  allowedCountYear: boolean = false;
  sortPositionOrder: number = 1;
  sortItemNumberOrder: number = 1;
  sortAmountOrder: number = 1;
  sortBatchOrder: number = 1;
  sortPriceOrder: number = 1;
  updates: any = [];
  today: Date = new Date();
  currencies: any = {};
  authWarehouses: any = [];
  pageType: string = "";

  @ViewChild("shelfPosition") shelfPosition: ElementRef;
  @ViewChild("shelfAmount") shelfAmount: ElementRef;
  @ViewChild("countInput") countInput: ElementRef;
  @ViewChild("updatesModal") updatesModal: ElementRef;
  @ViewChild("diffReportModal") diffReportModal: ElementRef;
  @ViewChild("previousStockModal") previousStockModal: ElementRef;
  @ViewChild("printStocktake") printStocktake: ElementRef;
  updatingAmount: boolean;
  fetchingShelfs: boolean;

  newShelfForm: FormGroup = new FormGroup({
    item: new FormControl("", Validators.required),
    itemType: new FormControl(""),
    whareHouse: new FormControl("", Validators.required),
    warehouseId: new FormControl("", Validators.required),
    position: new FormControl("", Validators.required),
    shelfId: new FormControl(""),
    amount: new FormControl(null, Validators.required),
    batchNumber: new FormControl(""),
    productionDate: new FormControl(new Date()),
    expirationDate: new FormControl(new Date()),
    userName: new FormControl(""),
  });

  diffReportForm: FormGroup = new FormGroup({
    warehouseName: new FormControl(""),
    itemType: new FormControl(""),
    fromDate: new FormControl(null),
    toDate: new FormControl(new Date()),
  });
  previousStockForm: FormGroup = new FormGroup({
    warehouseName: new FormControl(""),
    itemType: new FormControl(""),
    fromDate: new FormControl(null),
    toDate: new FormControl(new Date()),
  });
  shellNums: any;
  printing: boolean = false;
  validItem: boolean = false;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.edit("");
    this.editShelfAmount("");
  }

  constructor(
    private costumerSrv: CostumersService,
    private toastSrv: ToastrService,
    private itemService: ItemsService,
    private inventorySrv: InventoryService,
    private xlSrv: ExcelService,
    private authService: AuthService,
    private modalService: NgbModal,
    private procurementService: Procurementservice
  ) {}

  ngOnInit() {
    this.getAllCostumers();
    this.getCurrencies();
    this.getAuthWarehouses();
    this.allowedWHS = this.authService.loggedInUser.allowedWH;
    this.allowedCountYear =
      this.authService.loggedInUser.authorization.includes("allowedCountYear");
  }

  getCurrencies() {
    this.procurementService.getCurrencies().subscribe((data) => {
      this.currencies = data[0];
      console.log(this.currencies);
    });
  }

  getAuthWarehouses() {
    this.inventorySrv.getWhareHousesList().subscribe((data) => {
      this.authWarehouses = data.filter((wh) =>
        this.allowedWHS.includes(wh._id)
      );
      console.log(this.authWarehouses);
    });
  }

  getAllWhShelfs() {
    this.inventorySrv.getWhareHousesList().subscribe((res) => {
      let whid = res.find((wh) => wh.name == this.whareHouse)._id;
      if (this.allowedWHS.includes(whid)) {
        this.newShelfForm.controls.warehouseId.setValue(whid);
        this.inventorySrv.getWhareHouseShelfList(whid).subscribe((res) => {
          this.shellNums = res.map((shell) => {
            shell.shell_id_in_whareHouse = shell._id;
            return shell;
          });
          console.log(this.shellNums);
        });
      } else this.toastSrv.error("אינך מורשה למחסן זה!");
    });
  }

  getShelfsByWH(ev) {
    this.fetchingShelfs = true;
    let whareHouse = ev.target ? ev.target.value : ev;
    this.newShelfForm.controls.whareHouse.setValue(whareHouse);
    this.newShelfForm.controls.userName.setValue(
      this.authService.loggedInUser.userName
    );
    this.whareHouse = whareHouse;
    this.getAllWhShelfs();
    if (this.whareHouse == "Rosh HaAyin products") {
      this.itemType = "product";
      this.getProductsItemShellByWHName();
      return;
    }
    this.inventorySrv
      .getItemShellsByWhouseName(this.whareHouse)
      .subscribe((data) => {
        this.fetchingShelfs = false;
        if (data) {
          // for (let item of data) {
          //   item.actualPrice = item.price
          //     ? item.price
          //     : item.manualPrice
          //     ? item.manualPrice
          //     : 0;
          //   item.actualCoin = item.coin
          //     ? item.coin
          //     : item.manualCoin
          //     ? item.manualCoin
          //     : "ILS";
          //   if (item.actualPrice == 0) {
          //     let maxPrice = 0;
          //     for (let sup of item.alternativeSuppliers) {
          //       if (sup.price && sup.price > maxPrice) {
          //         maxPrice = sup.price;
          //         item.actualPrice = sup.price;
          //         item.actualCoin = sup.coin;
          //       }
          //     }
          //   }
          //   item.actualCoin = item.actualCoin.toUpperCase();

          //   item.rate = this.currencies[item.actualCoin];

          //   item.value = item.actualPrice * item.amount * item.rate;
          // }
          // let allShelfsWithOrWithoutItems = data.emptyShells.concat(data.itemShells)
          // allShelfsWithOrWithoutItems.sort((a, b) => (a._id.position > b._id.position ? 1 : -1));
          // let emptyLines = []
          // for (let i = 0; i < 50; i++) {
          //     emptyLines.push({ _id: {} })
          // }
          // allShelfsWithOrWithoutItems = allShelfsWithOrWithoutItems.concat(emptyLines)
          this.allShelfs = data;
          this.allShelfsCopy = data;
          this.pageType = "countPage";
          console.log(this.allShelfs);
        } else this.toastSrv.error("No Shelfs in Wharehouse");
      });
  }

  getProductsItemShellByWHName() {
    this.inventorySrv
      .getProductsItemShellByWHName(this.whareHouse)
      .subscribe((data) => {
        console.log(data);
        this.allShelfs = data;
        this.allShelfsCopy = data;
        this.fetchingShelfs = false;
        this.pageType = "countPage";
      });
  }

  printCountingForm() {}

  sortByPosition() {
    if (this.sortPositionOrder == 1) {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a._id.position > b._id.position ? 1 : -1
      );
      this.sortPositionOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a._id.position < b._id.position ? 1 : -1
      );
      this.sortPositionOrder = 1;
    }
  }

  sortByItem() {
    if (this.sortItemNumberOrder == 1) {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.item > b.item ? 1 : -1
      );
      this.sortItemNumberOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.item < b.item ? 1 : -1
      );
      this.sortItemNumberOrder = 1;
    }
  }
  sortByItemType() {
    if (this.sortItemNumberOrder == 1) {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.itemType > b.itemType ? 1 : -1
      );
      this.sortItemNumberOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.itemType < b.itemType ? 1 : -1
      );
      this.sortItemNumberOrder = 1;
    }
  }

  sortByAmount() {
    if (this.sortAmountOrder == 1) {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.amount > b.amount ? 1 : -1
      );
      this.sortAmountOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.amount < b.amount ? 1 : -1
      );
      this.sortAmountOrder = 1;
    }
  }

  sortByPrice() {
    this.allShelfs = this.allShelfs.sort((a, b) =>
      a.actualPrice > b.actualPrice ? this.sortPriceOrder : -this.sortPriceOrder
    );
    this.sortPriceOrder *= -1;
  }

  sortByBatch() {
    if (this.sortBatchOrder == 1) {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.supplierBatchNumber > b.supplierBatchNumber ? 1 : -1
      );
      this.sortBatchOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.supplierBatchNumber < b.supplierBatchNumber ? 1 : -1
      );
      this.sortBatchOrder = 1;
    }
  }

  filterByIetmNumber(ev) {
    this.allShelfs = this.allShelfsCopy;
    let itemNumber = ev.target.value;
    // console.log(itemNumber);
    if (itemNumber != "") {
      this.allShelfs = this.allShelfs
        .filter((shelf) => shelf.item == itemNumber)
        .sort((a, b) => (a.item > b.item ? 1 : -1));
    } else {
      this.allShelfs = this.allShelfsCopy;
    }
  }

  // filterByCostumer(ev) {
  //   this.allShelfs = this.allShelfsCopy;
  //   let costumer = ev.target.value;

  //   if (costumer != "") {
  //     this.allShelfs = this.allShelfs.filter((s) => s.costumer == costumer);
  //   } else {
  //     this.allShelfs = this.allShelfsCopy;
  //   }
  // }

  filterByItemType(ev) {
    let type = ev.target.value;
    if (type != "all") {
      this.allShelfs = this.allShelfsCopy.filter((sh) => sh.itemType == type);
    } else {
      this.allShelfs = this.allShelfsCopy;
    }
  }

  filterByShelf(ev) {
    this.allShelfs = this.allShelfsCopy;
    let position = ev.target.value.toUpperCase();
    // console.log(position);
    let regExp = new RegExp(position);
    if (position != "") {
      if (position == "QC ROOM") {
        this.allShelfs = this.allShelfs.filter((s) =>
          s.position.includes(position)
        );
      } else {
        this.allShelfs = this.allShelfs.filter((s) => regExp.test(s.position));
      }
    } else {
      this.allShelfs = this.allShelfsCopy;
    }
  }

  filterByArea(e) {
    let area = String(e.target.value).trim().toUpperCase();

    this.allShelfs = this.allShelfsCopy;
    this.allShelfs = this.allShelfs.filter((sh) => {
      let secChar = sh.position.charAt(area.length);
      let isDigit = Number.isInteger(Number(secChar));
      isDigit = Number.isInteger(Number(area)) ? isDigit : !isDigit;
      // let isDigit = isNaN(Number(secChar));
      console.log(isNaN(Number(secChar)));
      return sh.position.toUpperCase().indexOf(area) == 0 && !isDigit;
    });
  }
  searchForShelfs(ev) {
    if (ev.target.value != "") {
      this.inventorySrv
        .getShelfListForMaterial(ev.target.value)
        .subscribe((data) => {
          if (data.msg == "noShelf") {
            this.toastSrv.error("חומר גלם לא נמצא על מדף מסוים");
          } else {
            this.materialShelfs = data;
            console.log(data);
          }
        });
    }
  }

  editShelfAmount(shelf) {
    if (shelf != "") {
      if (this.itemType == "material")
        alert("שים לב! יש לעדכן חומרי גלם לפי באטץ!");
      this.shelfId = shelf._id;
    } else this.shelfId = {};
    setTimeout(() => this.countInput.nativeElement.focus(), 500);
  }

  setShelfs() {
    console.log(this.shelfId);
    console.log(this.allShelfs.find((sh) => sh._id == this.shelfId));
    this.shelfId = {};
  }

  calculateDifference(shelf) {
    shelf.difference = -1 * (shelf.amount - shelf.countedAmount);
  }

  takeStock() {
    this.allShelfs = this.allShelfsCopy;
    this.updates = this.allShelfs.filter((s) => s.countedAmount != null);
    console.log("updates before sending: ", this.updates);
    this.modalService.open(this.updatesModal);
  }

  printStocktakeForm() {
    this.printing = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.printStocktake.nativeElement.click();
        resolve(true);
      }, 500);
    });
  }

  update() {
    this.printStocktakeForm().then((result) => {
      if (result) {
        this.exportShelfListToXl();
        this.modalService.dismissAll();
        this.inventorySrv
          .takeStock({
            itemType: this.itemType,
            updates: this.updates,
            whareHouse: this.whareHouse,
          })
          .subscribe((data) => {
            console.log(data);
            if (data.messages.length > 0) {
              this.toastSrv.warning(
                "צור קשר במיידי עם צוות מחשוב",
                "ייתכן כי היתה בעיה"
              );
              console.log(data.messages);
            } else {
              this.toastSrv.success("אנא וודא כמויות", "עודכן בהצלחה!");
              // fetch updated shelfs
              if (this.whareHouse == "Rosh HaAyin")
                this.getShelfsByWH(this.itemType);
              else this.getShelfsByWH(this.whareHouse);
            }
            setTimeout(() => (this.printing = false), 2000);
          });
      } else this.toastSrv.error("משהו השתבש");
    });
  }

  exportShelfListToXl() {
    let shelfs = [];
    let index = 1;

    if (this.pageType == "countPage") {
      for (let shelf of this.allShelfs) {
        let xlLine = {
          "No.": index,
          "Item Number": shelf.item,
          "Item Name": shelf.componentName,
          "Batch Number": shelf.supplierBatchNumber,
          "Item Type": shelf.itemType,
          Price: shelf.actualPrice,
          Coin: shelf.actualCoin,
          // Rate: shelf.rate,
          // "Previous Amount": shelf.previousAmount,
          "Stock Amount": shelf.amount,
          "Value (ILS)": shelf.value,
          Counted: shelf.countedAmount,
          "Diff - Units": shelf.difference,
          "Diff - Value": shelf.countedAmount
            ? (shelf.countedAmount - shelf.amount) *
              shelf.actualPrice *
              shelf.rate
            : 0,
          Position: shelf.position,
          Warehouse: shelf.whareHouse,
        };

        shelfs.push(xlLine);
        index++;
      }
    } else if (this.pageType == "diffReport") {
      for (let shelf of this.allShelfs) {
        let xlLine = {
          "No.": index,
          "Item Number": shelf.item,
          "Item Name": shelf.componentName,
          // "Batch Number": shelf.supplierBatchNumber,
          "Item Type": shelf.itemType,
          Price: shelf.actualPrice,
          Coin: shelf.actualCoin,
          // Rate: shelf.rate,
          // "Previous Amount": shelf.previousAmount,
          "Current Amount": shelf.amount,
          "Current Value (ILS)": shelf.value,
          Counted: shelf.countedAmount,
          "Diff - Units": shelf.difference,
          "Diff - Value (ILS)": shelf.difference
            ? shelf.difference * shelf.actualPrice * shelf.rate
            : 0,
          Warehouse: shelf.whareHouse,
        };
        index++;
        shelfs.push(xlLine);
      }
    } else if (this.pageType == "previousStock") {
      for (let shelf of this.allShelfs) {
        let xlLine = {
          "No.": index,
          "Item Number": shelf.item,
          "Item Name": shelf.componentName,
          // "Batch Number": shelf.supplierBatchNumber,
          "Item Type": shelf.itemType,
          Price: shelf.actualPrice,
          Coin: shelf.actualCoin,
          // Rate: shelf.rate,
          "Previous Amount": shelf.previousAmount,
          "Current Amount": shelf.amount,
          "Diff - Units": shelf.difference,
          "Previous Value": shelf.previousValue,
          "Current Value": shelf.value,
          "Diff - Value (ILS)": shelf.difference
            ? shelf.difference * shelf.actualPrice * shelf.rate
            : 0,
          Warehouse: shelf.whareHouse,
        };
        index++;
        shelfs.push(xlLine);
      }
    }

    this.xlSrv.exportAsExcelFile(shelfs, "Shelf Report");
  }

  // updateShelfAmount(shelf) {
  //   this.updatingAmount = true;
  //   if (confirm("האם לעדכן מדף ?")) {
  //     this.inventorySrv.updateShelfAmount(shelf).subscribe((data) => {
  //       this.updatingAmount = false;
  //       if (data) {
  //         let UIShelf = this.allShelfs.find(
  //           (s) => s._id == data.item && s.position == data.position
  //         );
  //         if (UIShelf) {
  //           UIShelf.total = data.amount;
  //           this.toastSrv.success("פריט עודכן בהצלחה !");
  //         } else this.toastSrv.error("משהו השתבש");
  //         this.editShelfAmount("");
  //       }
  //     });
  //   }
  // }

  validateItem() {
    if (!this.newShelfForm.controls.warehouseId)
      this.toastSrv.error("", "יש להגדיר מחסן");
    else {
      this.inventorySrv
        .getCmptByitemNumber(this.newShelfForm.value.item)
        .subscribe((data) => {
          console.log(data);

          if (data.length == 0) {
            this.toastSrv.error("", "!פריט לא קיים");
            this.validItem = false;
          } else {
            this.itemType = data[0].itemType;
            this.newShelfForm.controls.itemType.setValue(data[0].itemType);
            this.validItem = true;
            console.log(this.newShelfForm);
            console.log(this.newShelfForm.valid);
          }
        });
    }
  }

  addNewItemShelf() {
    console.log(this.newShelfForm);
    this.newShelfForm.controls.shelfId.setValue(
      this.shellNums.find(
        (sh) => sh.position == this.newShelfForm.value.position
      )._id
    );

    this.inventorySrv
      .addNewItemShelf(this.newShelfForm.value)
      .subscribe((data) => {
        if (data.msg) {
          console.log(data.msg);
          this.toastSrv.error(data.msg);
          return;
        } else if (data.messages.length > 1) {
          for (let msg of data.messages) {
            this.toastSrv.error(msg.msg);
          }
        } else if (data.itemShelf) {
          this.toastSrv.success("מדף הוקם בהצלחה");
          console.log(this.newShelfForm.value);
          //   this.newShelfForm.controls.position.setValue("");
          //   this.newShelfForm.controls.amount.setValue(0);
          //   this.newShelfForm.controls.item.setValue("");
          this.newShelfForm.reset();
          this.itemType = "";

          this.validItem = false;
          console.log(this.newShelfForm.value);
          this.newShelfForm.controls.whareHouse.setValue(this.whareHouse);

          this.inventorySrv
            .getItemShellsByWhouseName(this.whareHouse)
            .subscribe((data) => {
              this.fetchingShelfs = false;
              if (data) {
                console.log(data);
                // let allShelfsWithOrWithoutItems = data.emptyShells.concat(data.itemShells)
                // allShelfsWithOrWithoutItems.sort((a, b) => (a._id.position > b._id.position ? 1 : -1));
                // let emptyLines = []
                // for (let i = 0; i < 50; i++) {
                //     emptyLines.push({ _id: {} })
                // }
                // allShelfsWithOrWithoutItems = allShelfsWithOrWithoutItems.concat(emptyLines)
                this.allShelfs = data;
                this.allShelfsCopy = data;
              } else this.toastSrv.error("No Shelfs in Wharehouse");
            });
        } else this.toastSrv.error("משהו השתבש");
      });
  }

  edit(id) {
    if (id != "") {
      this.EditRow = id;
    } else {
      this.EditRow = "";
    }
  }

  // updateShelfCostumer(shelf) {
  //   this.inventorySrv
  //     .updateShelfCostumer(shelf, this.item.costumer)
  //     .subscribe((data) => {
  //       if (data) {
  //         let shelf = this.allShelfs.find(
  //           (s) => s.item == data.item && s.position == data.position
  //         );
  //         if (shelf) {
  //           shelf.costumer = data.tempCostumer;
  //           this.toastSrv.success("לקוח עודכן בהצלחה !");
  //           this.editShelfAmount("", "");
  //         }
  //       }
  //     });
  // }

  updateShelf(id) {
    let amount = this.shelfAmount.nativeElement.value;
    let position = this.shelfPosition.nativeElement.value;

    let shelfToUpdate = this.materialShelfs.find((s) => s._id == id);
    shelfToUpdate.amount = amount;
    shelfToUpdate.position = position;

    this.inventorySrv.updateShelf(shelfToUpdate).subscribe((data) => {
      if (data) {
        this.toastSrv.success("מדף עודכן בהצלחה !");
        this.edit("");
      }
    });
  }

  getAllCostumers() {
    this.costumerSrv.getAllCostumers().subscribe((data) => {
      this.allCostumers = data;
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

  getDiffReport() {
    console.log(this.diffReportForm);
    this.whareHouse = this.diffReportForm.controls.warehouseName.value;

    this.inventorySrv
      .getDiffReport(this.diffReportForm.value)
      .subscribe((data) => {
        if (data.msg) {
          this.toastSrv.error(data.msg);
          return;
        } else if (data && data.length > 0) {
          console.log(data);
          this.whareHouse = this.diffReportForm.value.warehouseName;
          this.allShelfs = data;
          this.pageType = "diffReport";
          this.modalService.dismissAll();
          this.diffReportForm.reset();
        } else {
          this.toastSrv.error("לא נמצאו נתונים המתאימים לחיפוש");
        }
      });
  }

  currentStockReport() {
    this.toastSrv.success("Report is under construction");
  }

  previousStockReport() {
    this.fetchingShelfs;
    console.log(this.previousStockForm.value);
    if (this.previousStockForm.controls.itemType.value != "product") {
      this.inventorySrv
        .getPreviousStockReport(this.previousStockForm.value)
        .subscribe((data) => {
          console.log(data);
          for (let item of data) {
            if (item.previousAmount) {
              console.log(item);
            }
          }
          if (data.msg) {
            this.toastSrv.error(data.msg);
          } else if (data && data.length > 0) {
            this.pageType = "previousStock";
            this.allShelfs = data;
          } else {
            this.toastSrv.error("לא נמצאו נתונים המתאימים לתנאי החיפוש");
          }
          this.fetchingShelfs = false;
          this.modalService.dismissAll();
          this.previousStockForm.reset();
        });
    } else {
      this.inventorySrv
        .getPreviousProductsReport(this.previousStockForm.value)
        .subscribe((data) => {
          console.log(data);
          if (data.msg) {
            this.toastSrv.error(data.msg);
          } else if (data && data.length > 0) {
            this.pageType = "previousStock";
            this.allShelfs = data;
          } else {
            this.toastSrv.error("לא נמצאו נתונים המתאימים לתנאי החיפוש");
          }
          this.fetchingShelfs = false;
          this.modalService.dismissAll();
          this.previousStockForm.reset();
        });
    }
  }
}
