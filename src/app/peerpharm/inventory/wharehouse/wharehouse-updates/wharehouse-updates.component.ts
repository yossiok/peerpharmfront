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
import { IoTThingsGraph } from "aws-sdk";

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
  sortItemNameOrder: number = 1;
  sortItemNumberOrder: number = 1;
  sortAmountOrder: number = 1;
  sortBatchOrder: number = 1;
  sortPriceOrder: number = 1;
  sortValueOrder: number = 1;
  sortCoinOrder: number = 1;
  sortDiffOrder: number = -1;
  updates: any = [];
  today: Date = new Date();
  currencies: any = {};
  authWarehouses: any = [];
  pageType: string = "";
  lotNumbersList: any[] = [];
  lotNotExist: boolean = false;
  missingLotReport: any[] = [];

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
    itemName: new FormControl(""),
    itemType: new FormControl(""),
    whareHouse: new FormControl("", Validators.required),
    warehouseId: new FormControl("", Validators.required),
    position: new FormControl("", Validators.required),
    shelfId: new FormControl(""),
    amount: new FormControl(null, Validators.required),
    batchNumber: new FormControl(""),
    supplierBatchNumber: new FormControl(""),
    productionDate: new FormControl(null),
    expirationDate: new FormControl(null),
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
  missingLotNumbersForm: FormGroup = new FormGroup({
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
    public modalService: NgbModal,
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
      } else this.toastSrv.error("???????? ?????????? ?????????? ????!");
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
        this.fetchingShelfs = false;
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
        a.position > b.position ? 1 : -1
      );
      this.sortPositionOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.position < b.position ? 1 : -1
      );
      this.sortPositionOrder = 1;
    }
  }

  sortByDiff() {
    let val = this.sortDiffOrder;
    this.allShelfs = this.allShelfs.sort((a, b) =>
      a.difference > b.difference ? val : a.difference < b.difference ? -val : 0
    );
    this.sortDiffOrder *= -1;
  }

  sortByPositionNew() {
    let reA = /[^a-zA-Z]/g;
    let reN = /[^0-9]/g;
    let i = this.sortPositionOrder;

    // this can be done also by regex pattern (^[1-3]{1}[A-Z]{1}[0-9].*) - mayb next time :)
    // let pattern = /^[1-3]{1}[A-Z]{1}[0-9].*/;
    // let firstPart = this.allShelfs.filter((sh) => pattern.test(sh.position));
    // let lastPart = this.allShelfs.filter((sh) => !pattern.test(sh.position));
    // console.log(firstPart);
    // console.log(lastPart);
    let zeroWall = this.allShelfs.filter((sh) => {
      return (
        sh.position.substr(0, 1) == 0 &&
        // isNaN(sh.position.substr(1, 1)) &&
        sh.position.length > 2
      );
    });
    let firstWall = this.allShelfs.filter((sh) => {
      return (
        sh.position.substr(0, 1) == 1 &&
        isNaN(sh.position.substr(1, 1)) &&
        sh.position.length > 2
      );
    });
    let secondWall = this.allShelfs.filter((sh) => {
      return (
        sh.position.substr(0, 1) == 2 &&
        isNaN(sh.position.substr(1, 1)) &&
        sh.position.length > 2
      );
    });
    let thirdWall = this.allShelfs.filter((sh) => {
      return (
        sh.position.substr(0, 1) == 3 &&
        isNaN(sh.position.substr(1, 1)) &&
        sh.position.length > 2
      );
    });
    let fourthWall = this.allShelfs.filter((sh) => {
      return (
        sh.position.substr(0, 1) == 4 &&
        isNaN(sh.position.substr(1, 1)) &&
        sh.position.length > 2
      );
    });
    let fifthWall = this.allShelfs.filter((sh) => {
      return (
        sh.position.substr(0, 1) > 4 &&
        isNaN(sh.position.substr(1, 1)) &&
        sh.position.length > 2
      );
    });

    let lastWall = this.allShelfs.filter((sh) => {
      return isNaN(sh.position.substr(0, 1)) || sh.position.length < 3;
    });
    // let lastWall = this.allShelfs.filter((sh) => {
    //   return (
    //     !isNaN(sh.position.substr(, 1)) ||
    //     (isNaN(sh.position.substr(1, 1)) &&
    //       (sh.position.length < 3 || sh.position.length > 4))
    //   );
    // });
    let walls = [];
    if (i == 1) {
      walls = [
        zeroWall,
        firstWall,
        secondWall,
        thirdWall,
        fourthWall,
        fifthWall,
        lastWall,
      ];
    } else {
      walls = [
        lastWall,
        fifthWall,
        fourthWall,
        thirdWall,
        secondWall,
        firstWall,
        zeroWall,
      ];
    }
    // let walls = [];
    // if (i == 1) {
    //   walls = [firstPart, lastPart];
    // } else {
    //   walls = [lastPart, firstPart];
    // }

    let newWalls = [];
    for (let wall of walls) {
      wall = wall.sort((a, b) => {
        let aA = a.position.replace(reA, "");
        let bA = b.position.replace(reA, "");
        if (aA === bA) {
          let aN = parseInt(a.position.replace(reN, ""), 10);
          let bN = parseInt(b.position.replace(reN, ""), 10);
          return aN === bN ? 0 : aN > bN ? i : -i;
        } else {
          return aA > bA ? i : -i;
        }
      });
      newWalls = newWalls.concat(wall);
    }

    console.log(walls);
    // this.allShelfs = this.allShelfs.sort((a, b) => {
    //   let aA = a.position.replace(reA, "");
    //   let bA = b.position.replace(reA, "");
    //   if (aA === bA) {
    //     let aN = parseInt(a.position.replace(reN, ""), 10);
    //     let bN = parseInt(b.position.replace(reN, ""), 10);
    //     return aN === bN ? 0 : aN > bN ? i : -i;
    //   } else {
    //     return aA > bA ? i : -i;
    //   }
    // });

    this.allShelfs = newWalls;
    this.sortPositionOrder *= -1;
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

  sortByName() {
    this.allShelfs = this.allShelfs.sort((a, b) =>
      a.componentName.trim().toLowerCase() >
      b.componentName.trim().toLowerCase()
        ? this.sortItemNameOrder
        : -this.sortItemNameOrder
    );
    this.sortItemNameOrder *= -1;
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
  sortByValue() {
    this.allShelfs = this.allShelfs.sort((a, b) =>
      a.value > b.value ? this.sortValueOrder : -this.sortValueOrder
    );
    this.sortValueOrder *= -1;
  }

  sortByCoin() {
    this.allShelfs = this.allShelfs.sort((a, b) =>
      a.coin > b.coin ? this.sortCoinOrder : -this.sortCoinOrder
    );
    this.sortCoinOrder *= -1;
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
            this.toastSrv.error("???????? ?????? ???? ???????? ???? ?????? ??????????");
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
        alert("?????? ????! ???? ?????????? ?????????? ?????? ?????? ????????!");
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
                "?????? ?????? ???????????? ???? ???????? ??????????",
                "?????????? ???? ???????? ????????"
              );
              console.log(data.messages);
            } else {
              this.toastSrv.success("?????? ???????? ????????????", "?????????? ????????????!");
              // fetch updated shelfs
              if (this.whareHouse == "Rosh HaAyin")
                this.getShelfsByWH(this.itemType);
              else this.getShelfsByWH(this.whareHouse);
            }
            setTimeout(() => (this.printing = false), 2000);
          });
      } else this.toastSrv.error("???????? ??????????");
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
    } else if (this.pageType == "missingLotReport") {
      for (let shelf of this.allShelfs) {
        let xlLine = {
          "No.": index,
          "Item Number": shelf.item,
          "Item Name": shelf.componentName,
          "Manual Lot Number": shelf.manualLotNumber,
          "Manufacturer Lot Number": shelf.supplierBatchNumber,
          "Production Date": shelf.productionDate,
          "Expiration Date": shelf.expirationDate,
          // "Batch Number": shelf.supplierBatchNumber,
          Amount: shelf.amount,
          Position: shelf.position,
          Warehouse: shelf.whareHouse,
          "Item Type": shelf.itemType,
          "User Name": shelf.userName,
        };
        index++;
        shelfs.push(xlLine);
      }
    }

    this.xlSrv.exportAsExcelFile(shelfs, "Shelf Report");
  }

  // updateShelfAmount(shelf) {
  //   this.updatingAmount = true;
  //   if (confirm("?????? ?????????? ?????? ?")) {
  //     this.inventorySrv.updateShelfAmount(shelf).subscribe((data) => {
  //       this.updatingAmount = false;
  //       if (data) {
  //         let UIShelf = this.allShelfs.find(
  //           (s) => s._id == data.item && s.position == data.position
  //         );
  //         if (UIShelf) {
  //           UIShelf.total = data.amount;
  //           this.toastSrv.success("???????? ?????????? ???????????? !");
  //         } else this.toastSrv.error("???????? ??????????");
  //         this.editShelfAmount("");
  //       }
  //     });
  //   }
  // }

  validateItem() {
    if (!this.newShelfForm.value.warehouseId) {
      alert("???? ???????????? ????????");
      return;
    } else if (!this.newShelfForm.value.item) {
      return;
    } else {
      this.lotNumbersList = [];
      this.inventorySrv
        .getComponentByitemNumber(this.newShelfForm.value.item)
        .subscribe((data) => {
          console.log(data);

          if (data && data.msg) {
            this.toastSrv.error(data.msg);
            this.validItem = false;
            this.newShelfForm.controls.item.reset();
          } else {
            this.itemType = data.itemType;
            this.newShelfForm.controls.itemType.setValue(data.itemType);
            this.newShelfForm.controls.itemName.setValue(data.componentName);
            this.lotNumbersList = data.materials;
            this.validItem = true;
            console.log(this.newShelfForm);
            console.log(this.newShelfForm.valid);
          }
        });
    }
  }

  updateLotNumber() {
    let lotNumber = this.newShelfForm.value.supplierBatchNumber;
    if (lotNumber != "other") {
      let lot = this.lotNumbersList.find((lot) => lot.lotNumber == lotNumber);

      if (lot) {
        console.log(lot);
        let productionDate = lot.productionDate
          ? new Date(lot.productionDate).toISOString().substring(0, 10)
          : null;
        let expirationDate = lot.expiryDate
          ? new Date(lot.expiryDate).toISOString().substring(0, 10)
          : null;
        this.newShelfForm.controls.productionDate.setValue(productionDate);
        this.newShelfForm.controls.expirationDate.setValue(expirationDate);
        this.lotNotExist = false;
      }
      console.log(this.newShelfForm.value);
    } else {
      this.newShelfForm.controls.productionDate.reset();
      this.newShelfForm.controls.expirationDate.reset();

      this.lotNotExist = true;
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
          this.toastSrv.success("?????? ???????? ????????????");
          console.log(this.newShelfForm.value);
          let position = this.newShelfForm.value.position;
          let warehouseId = this.newShelfForm.value.warehouseId;
          this.newShelfForm.reset();
          this.itemType = "";
          this.lotNotExist = false;
          this.lotNumbersList = [];
          this.validItem = false;
          console.log(this.newShelfForm.value);
          this.newShelfForm.controls.whareHouse.setValue(this.whareHouse);
          this.newShelfForm.controls.warehouseId.setValue(warehouseId);
          this.newShelfForm.controls.position.setValue(position);

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
        } else this.toastSrv.error("???????? ??????????");
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
  //           this.toastSrv.success("???????? ?????????? ???????????? !");
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
        this.toastSrv.success("?????? ?????????? ???????????? !");
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
          this.toastSrv.error("???? ?????????? ???????????? ???????????????? ????????????");
        }
      });
  }

  currentStockReport() {
    this.toastSrv.success("Report is under construction");
  }

  missingLotNumbersReport() {
    this.fetchingShelfs = true;
    this.inventorySrv
      .getMissingLotNumbersReport(this.missingLotNumbersForm.value)
      .subscribe((data) => {
        this.fetchingShelfs = false;
        this.missingLotNumbersForm.reset();
        this.missingLotReport = [];
        this.modalService.dismissAll();
        console.log(data);
        if (data && data.msg) {
          this.toastSrv.error(data.msg);
          return;
        } else if (data && data.length > 0) {
          this.pageType = "missingLotReport";
          this.missingLotReport = data;
          this.allShelfs = data;
          return;
        } else {
          this.toastSrv.error("???? ?????????? ???????????? ???????????????? ????????????");
          return;
        }
      });
  }

  previousStockReport() {
    console.log(this.previousStockForm.value);
    if (this.previousStockForm.controls.itemType.value != "product") {
      this.fetchingShelfs = true;
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
            this.toastSrv.error("???? ?????????? ???????????? ???????????????? ?????????? ????????????");
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
            this.toastSrv.error("???? ?????????? ???????????? ???????????????? ?????????? ????????????");
          }
          this.fetchingShelfs = false;
          this.modalService.dismissAll();
          this.previousStockForm.reset();
        });
    }
  }
}
