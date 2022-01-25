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
import { YearCount } from "./YearCount";
import * as XLSX from "xlsx";
import { differenceInBusinessDays } from "date-fns";
import { runInNewContext } from "vm";

@Component({
  selector: "app-shelf-list",
  templateUrl: "./shelf-list.component.html",
  styleUrls: ["./shelf-list.component.scss"],
})
export class ShelfListComponent implements OnInit {
  lastYearCount: YearCount;
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
  updates: any = [];
  allCountShelves: any = [];
  allCountShelvesCopy: any = [];
  showFile: boolean = false;
  fileName: string = "";
  fileDate: Date = null;
  fileNames: any[] = [];
  componentsPrices = [];
  materialsPrices = [];
  productsPrices = [];
  pageForm = [];
  formNum: string = "";
  shelvesArr: any[] = [];
  user: string;
  allowedYearUpdate: boolean = false;
  exportEmptyFile: boolean = false;
  importExcelFile: boolean = false;
  saveTheExcelToDb: boolean = false;
  viewSavedExcel: boolean = false;
  stockUpdateByFile: boolean = false;
  actionLogsUpdate: boolean = false;
  readOnly: boolean = false;
  countedBy: string = "";
  supervisedBy: string = "";
  typedBy: string = "";
  countDate: Date;
  allWarehouses: any[] = [];
  diffReport: boolean = false;

  @ViewChild("shelfPosition") shelfPosition: ElementRef;
  @ViewChild("shelfAmount") shelfAmount: ElementRef;
  @ViewChild("countInput") countInput: ElementRef;
  @ViewChild("updatesModal") updatesModal: ElementRef;
  @ViewChild("printStocktake") printStocktake: ElementRef;
  @ViewChild("uploadExFile") uploadExFile: ElementRef;
  @ViewChild("selectWh") selectWh: ElementRef;
  @ViewChild("repeatCount") reapeatCount: ElementRef;
  @ViewChild("printPages") printPages: ElementRef;
  @ViewChild("selectWhFile") selectWhFile: ElementRef;
  @ViewChild("selectFile") selectFile: ElementRef;

  updatingAmount: boolean;
  fetchingShelfs: boolean;
  fetchingPrices: boolean = false;
  loadingDataToDB: boolean = false;

  newShelfForm: FormGroup = new FormGroup({
    item: new FormControl(null, Validators.required),
    // whareHouse: new FormControl(null, Validators.required),
    position: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
  });
  shellNums: any;
  printing: boolean = false;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.edit("-1");
    this.editShelfAmount("");
  }

  retroactiveUpdate: FormGroup = new FormGroup({
    warehouseName: new FormControl("", Validators.required),
    fromDate: new FormControl(null, Validators.required),
    toDate: new FormControl(null),
    fromHour: new FormControl(""),
    toHour: new FormControl(""),
  });

  constructor(
    private costumerSrv: CostumersService,
    private toastSrv: ToastrService,
    private itemService: ItemsService,
    private inventorySrv: InventoryService,
    private xlSrv: ExcelService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getLastYearCount();
    this.getAllCostumers();
    this.getAllWH();
    this.getInvRepCosts();
    this.user = this.authService.loggedInUser.userName;
    console.log(this.user);
    this.allowedWHS = this.authService.loggedInUser.allowedWH;
    this.allowedCountYear =
      this.authService.loggedInUser.authorization.includes("allowedCountYear");
    this.allowedYearUpdate =
      this.authService.loggedInUser.authorization.includes("updateYearStock");
  }
  getAllWH() {
    this.inventorySrv.getWhareHousesList().subscribe((whs) => {
      console.log(whs);
      this.allWarehouses = whs;
    });
  }

  getInvRepCosts() {
    this.fetchingPrices = true;
    this.inventorySrv.getInvRepCosts("component").subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
        this.fetchingPrices = false;

        return;
      } else if (data) {
        this.componentsPrices = data;
        this.fetchingPrices = false;
      } else {
        this.toastSrv.error("Components prices were not found");
        this.fetchingPrices = false;
        return;
      }
    });
    this.inventorySrv.getInvRepCosts("material").subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
        this.fetchingShelfs = false;
        return;
      } else if (data) {
        this.materialsPrices = data;
      } else {
        this.toastSrv.error("Materials prices were not found");
        this.fetchingShelfs = false;
        return;
      }
    });
    this.inventorySrv.getInvRepCosts("product").subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
        this.fetchingShelfs = false;
        return;
      } else if (data) {
        this.productsPrices = data;
      } else {
        this.toastSrv.error("Products were not found");
        this.fetchingShelfs = false;
        return;
      }
    });
  }

  getLastYearCount() {
    this.inventorySrv.getLastYearCount().subscribe((data) => {
      this.lastYearCount = data[0];
    });
  }

  exportYearCountForm() {}

  addNewItemShelf() {
    this.inventorySrv
      .newShelfYearCount(this.newShelfForm.value, this.whareHouse)
      .subscribe((data) => {
        if (data._id) {
          this.allShelfs.push(data);
          console.log(this.allShelfs);
          this.toastSrv.success("מדף הוקם בהצלחה");
        } else this.toastSrv.error("משהו השתבש");
      });
  }

  getAllWhShelfs() {
    this.showFile = false;
    console.log(this.whareHouse);
    this.inventorySrv.getWhareHousesList().subscribe((res) => {
      let whid = res.find((wh) => wh.name == this.whareHouse)._id;
      if (this.allowedWHS.includes(whid)) {
        this.inventorySrv.getWhareHouseShelfList(whid).subscribe((res) => {
          this.shellNums = res.map((shell) => {
            shell.shell_id_in_whareHouse = shell._id;
            return shell;
          });
        });
      } else this.toastSrv.error("אינך מורשה למחסן זה!");
    });
  }

  getFileNameByWh(ev) {
    this.showFile = false;
    this.fileNames = [];
    let whFile = ev.target ? ev.target.value : ev;
    console.log(whFile);
    let names = whFile.split("-");
    let whName = "";
    // whName = "KASEM" ? "Kasem" : names[0];
    if (names[0] == "KASEM") {
      whName = "Kasem";
    } else {
      whName = names[0];
    }
    let type = names[1];
    this.itemType = type;
    this.whareHouse = whName;
    console.log(whName);
    this.inventorySrv.getFilesListByWh(whName, type).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
      } else if (data) {
        this.fileNames = data;
      }
    });
  }

  getFileName(ev) {
    let fileDate = ev.target ? ev.target.value : ev;
    console.log(fileDate);
    this.fileDate = fileDate;
    // let fileDate = new Date(fileName);
    this.allCountShelves = [];
    this.inventorySrv.getYearCountFile(fileDate).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
        return;
      } else if (data.length == 0) {
        this.toastSrv.warning("No data was found");
        return;
      } else if (data.length > 0) {
        this.fileName = data[0].counts.fileName;
        this.fileDate = data[0].counts.fileDate;

        for (let doc of data) {
          // console.log(doc);
          let prevQty = doc.counts.prevQty ? doc.counts.prevQty : 0;
          let shelf = {
            companyOwned: doc.companyOwned,
            countDate: doc.counts.countDate,
            countedBy: doc.counts.countQty,
            fileDate: doc.counts.fileDate,
            itemBatch: doc.counts.itemBatch,
            itemCoin: doc.counts.itemCoin,
            itemName: doc.itemName,
            itemNumber: doc.itemNumber,
            itemPosition: doc.position,
            itemPrice: doc.counts.itemPrice,
            itemQty: doc.counts.countQty,
            itemRemark: doc.counts.itemRemark,
            itemUnit: doc.counts.itemUnit,
            prevQty,
            repeatCount: doc.counts.repeatCount,
            supervisedBy: doc.counts.supervisedBy,
            typedBy: doc.counts.typedBy,
            diffQty: doc.counts.repeatCount
              ? doc.counts.repeatCount - prevQty
              : doc.counts.countQty - prevQty,
          };
          // console.log(shelf);
          this.allCountShelves.push(shelf);
          this.showFile = true;
        }
      }
    });
  }

  getShelfsByWH(ev) {
    this.fetchingShelfs = true;
    let whareHouse = ev.target ? ev.target.value : ev;
    // this.whareHouse = ev.target.value;
    console.log(whareHouse);
    this.getAllWhShelfs();
    switch (whareHouse) {
      case "material":
        this.itemType = "material";
        this.whareHouse = "Rosh HaAyin";
        break;
      case "component":
        this.itemType = "component";
        this.whareHouse = "Rosh HaAyin C";
        break;
      case "Rosh HaAyin products":
        this.itemType = "product";
        this.whareHouse = whareHouse;
        break;
      case "NEW KASEM":
        this.itemType = "component";
        this.whareHouse = "NEW KASEM";
        break;
      case "NEW KASEM-2":
        this.itemType = "component";
        this.whareHouse = "NEW KASEM-2";
        break;
      case "Kasem":
        this.itemType = "component";
        this.whareHouse = "Kasem";
        break;
      case "Labels":
        this.itemType = "component";
        this.whareHouse = whareHouse;
      case "ARIEL 1":
        this.itemType = "component";
        this.whareHouse = whareHouse;
      case "ARIEL 2":
        this.itemType = "component";
        this.whareHouse = whareHouse;
      case "ARIEL 3":
        this.itemType = "component";
        this.whareHouse = whareHouse;
      case "ARIEL 4":
        this.itemType = "component";
        this.whareHouse = whareHouse;
      case "Rosh HaAyin-component":
        this.itemType = "component";
        this.whareHouse = "Rosh HaAyin";
    }
    this.inventorySrv
      .shelfListByWH(this.whareHouse, this.itemType)
      .subscribe((data) => {
        if (data.msg) {
          this.toastSrv.error(data.msg);
          this.fetchingShelfs = false;
        } else if (data) {
          console.log(data);
          let allShelfsWithOrWithoutItems = [];
          if (this.whareHouse != "NEW KASEM-2") {
            allShelfsWithOrWithoutItems = data.emptyShells.concat(
              data.itemShells
            );
          } else if (this.whareHouse == "NEW KASEM-2") {
            allShelfsWithOrWithoutItems = data.itemShells;
          }
          allShelfsWithOrWithoutItems = allShelfsWithOrWithoutItems.sort(
            (a, b) => (a._id.position > b._id.position ? 1 : -1)
          );
          allShelfsWithOrWithoutItems.forEach((shelf) => {
            // console.log(shelf);
            let firstPart = shelf._id.position.substring(0, 2);
            // console.log(firstPart);
            let secondPart = shelf._id.position.substring(2);
            // console.log(secondPart);
            if (
              (parseInt(firstPart) &&
                parseInt(secondPart) &&
                parseInt(secondPart) < 10) ||
              (firstPart == "EL" && parseInt(secondPart) < 10)
            ) {
              shelf._id.newPosition = firstPart + "0" + secondPart;
            }
            shelf._id.newPosition = shelf._id.newPosition
              ? shelf._id.newPosition
              : shelf._id.position;
            // console.log(shelf);
            return shelf;
          });
          allShelfsWithOrWithoutItems.sort((a, b) =>
            a._id.newPosition > b._id.newPosition ? 1 : -1
          );
          let emptyLines = [];
          for (let i = 0; i < 50; i++) {
            emptyLines.push({ _id: {} });
          }
          allShelfsWithOrWithoutItems =
            allShelfsWithOrWithoutItems.concat(emptyLines);
          this.allShelfs = allShelfsWithOrWithoutItems;
          this.allShelfsCopy = allShelfsWithOrWithoutItems;
          // console.log(data);
          this.fetchingShelfs = false;
        } else this.toastSrv.error("No Shelfs in Wharehouse");
      });
  }

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
        a._id.item > b._id.item ? 1 : -1
      );
      this.sortItemNumberOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a._id.item < b._id.item ? 1 : -1
      );
      this.sortItemNumberOrder = 1;
    }
  }

  sortByAmount() {
    if (this.sortAmountOrder == 1) {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.total > b.total ? 1 : -1
      );
      this.sortAmountOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a.total < b.total ? 1 : -1
      );
      this.sortAmountOrder = 1;
    }
  }

  sortByBatch() {
    if (this.sortBatchOrder == 1) {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a._id.supplierBatchNumber > b._id.supplierBatchNumber ? 1 : -1
      );
      this.sortBatchOrder = -1;
    } else {
      this.allShelfs = this.allShelfs.sort((a, b) =>
        a._id.supplierBatchNumber < b._id.supplierBatchNumber ? 1 : -1
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
        .filter((shelf) => shelf._id.item == itemNumber)
        .sort((a, b) => (a._id.itemNumber > b._id.itemNumber ? 1 : -1));
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

  filterByShelf(ev) {
    this.allShelfs = this.allShelfsCopy;
    let position = ev.target.value.toUpperCase();
    // console.log(position);
    let regExp = new RegExp(position);
    if (position != "") {
      if (position == "QC ROOM") {
        this.allShelfs = this.allShelfs.filter((s) =>
          s._id.position.includes(position)
        );
      } else {
        this.allShelfs = this.allShelfs.filter((s) =>
          regExp.test(s._id.position)
        );
      }
    } else {
      this.allShelfs = this.allShelfsCopy;
    }
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
    this.shelfId = {};
  }

  calculateDifference(shelf) {
    shelf.difference = -1 * (shelf.total - shelf.countedAmount);
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
        this.modalService.dismissAll();
        this.inventorySrv
          .takeStock({
            itemType: this.itemType,
            updates: this.updates,
            whareHouse: this.whareHouse,
          })
          .subscribe((data) => {
            console.log("response: ", data);
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
    console.log(this.allShelfs);

    let shelvesArr = [];
    let shelfs = [];
    let whName = "data";
    let whNames = [];
    let formNum = 1;
    // let emptyRows = 400;
    let emptyRows = 400;

    let emptyObj = {
      total: 0,
      whareHouse: this.whareHouse,
      _id: {
        item: "",
        name: "",
        newPosition: "",
        position: "",
      },
    };
    for (let e = 0; e < emptyRows; e++) {
      this.allShelfs.push(emptyObj);
    }
    let totalForms = Math.ceil(this.allShelfs.length / 20);
    let i = 0;
    let page = 20;
    let order = [];
    while (i < this.allShelfs.length) {
      // console.log(i);
      // console.log(this.allShelfs[i]);
      // console.log(this.allShelfs[i]._id);

      let headRow1 = {
        A: null,
        B: null,
        C: null,
        D: 'פארפארם בע"מ רחוב העמל 17 אזור התעשיה אפק, ראש העין, 4809256',
        E: null,
        F: null,
        G: null,
        H: null,
        I: null,
      };
      shelfs.push(headRow1);

      let headRow2 = {
        A: null,
        B: null,
        C: null,
        D: "דף ספירת מלאי לסוף שנת הכספים 2021",
        E: null,
        F: null,
        G: null,
        H: null,
        I: null,
      };
      shelfs.push(headRow2);
      // shelfs.push(firstRow);
      let headRow3 = {
        A: "",
        B: "שם הסופר:",
        C: null,
        D: `טופס מספר. ${formNum} מתוך ${totalForms}`,
        E: "תאריך:",
        F: null,
        G: null,
        H: null,
        I: null,
      };
      shelfs.push(headRow3);
      let headRow4 = {
        A: null,
        B: "חתימת הסופר:",
        C: null,
        D: null,
        E: "שעה:",
        F: null,
        G: null,
        H: null,
        I: null,
      };
      shelfs.push(headRow4);
      let headRow5 = {
        A: "",
        B: "שם הבקר:",
        C: null,
        D: "שם וחתימת המקליד/ה:",
        E: null,
        F: null,
        G: null,
        H: null,
        I: null,
      };
      shelfs.push(headRow5);
      let headRow6 = {
        A: null,
        B: "חתימת הבקר:",
        C: null,
        D: null,
        E: null,
        F: null,
        G: null,
        H: null,
        I: null,
      };

      shelfs.push(headRow6);
      let headRow7 = {
        A: "",
        B: "שם המחסן:",
        C: null,
        D: this.whareHouse + "-" + this.itemType + "s",
        E: null,
        F: null,
        G: null,
        H: null,
        I: null,
      };
      shelfs.push(headRow7);

      let headRow8 = {
        A: "מס.",
        B: "איתור",
        C: 'מק"ט',
        D: "תאור הפריט",
        E: "'יח",
        F: "כמות שנספרה",
        G: "פריט חברה",
        H: "הערות",
        I: "אצווה/מנה",
      };
      shelfs.push(headRow8);

      for (let j = 0; j < page; j++) {
        // console.log("J: " + j);
        // console.log(this.allShelfs[i]._id.position);
        // console.log(this.allShelfs[i]._id.item);
        // console.log(this.allShelfs[i]._id.name);
        shelfs.push({
          A: i + 1,
          B: this.allShelfs[i]._id.position,
          C: this.allShelfs[i]._id.item,
          D: this.allShelfs[i]._id.name,
          E: this.itemType == "component" ? "Unit" : "Kg",
          F: "",
          G: "",
          H: "",
          I: this.allShelfs[i]._id.supplierBatchNumber,
        });
        i++;
      }
      whName = this.whareHouse + "-" + this.itemType + "-" + formNum;
      whNames.push(whName);
      // console.log("Form number: " + formNum);
      formNum++;
      page = formNum == totalForms ? this.allShelfs.length - i : page;
      // console.log(shelfs);
      shelvesArr.push(shelfs);
      this.shelvesArr.push(shelfs);
      shelfs = [];
    }
    // console.log(shelvesArr);

    // for (let page of shelvesArr) {
    //   this.pageForm = [];
    //   this.formNum = "";
    //   for (let i = 8; i < page.length; i++) {
    //     console.log(page[i]);
    //     this.pageForm.push(page[i]);
    //   }
    //   console.log(page[2].D);
    //   this.formNum = page[2].D;
    //   console.log(this.pageForm);
    //   let conf = confirm("Print!");
    //   this.printPages.nativeElement.click();
    //   if (conf) {
    //     setTimeout(() => console.log("this.pageForm"), 2000);
    //   }
    // }

    this.xlSrv.exportAsExcelFile(
      shelvesArr,
      `ספירת מלאי ${this.lastYearCount.serialNumber + 1}, ${
        this.whareHouse
      } - ${this.itemType}s, 2021`,
      null,
      whNames,
      true
    );
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
    if (!this.itemType) this.toastSrv.error("", "יש להגדיר מחסן");
    else {
      this.inventorySrv
        .getCmptByNumber(this.newShelfForm.value.item, this.itemType)
        .subscribe((data) => {
          if (data.length == 0) this.toastSrv.error("", "!פריט לא קיים");
        });
    }
  }

  edit(id) {
    console.log(id);
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

  sendExcelToData(ev: any) {
    if (confirm("האם אתה בטוח שבחרת בקובץ הנכון ?") == true) {
      const target: DataTransfer = <DataTransfer>ev.target;
      console.log(target.files);
      //
      if (target.files.length > 1) {
        alert("ניתן לבחור קובץ אחד בלבד");
        this.uploadExFile.nativeElement.value = "";
      }
      const sheetNames = [];
      this.fetchingShelfs = true;
      this.whareHouse = "";
      this.itemType = "";
      const reader: FileReader = new FileReader();

      // reader.readAsDataURL(ev.target.files[0]); // read file as data url
      reader.readAsBinaryString(target.files[0]);

      // reader.onLoad is called once readAsBinaryString is completed
      reader.onload = (event: any) => {
        // binaryStr is the binary string rsult of the excel file reading
        const binaryStr = event.target.result;

        const workBook: XLSX.WorkBook = XLSX.read(binaryStr, {
          type: "binary",
        });

        for (let sheetName of workBook.SheetNames) {
          console.log(sheetName);
          sheetNames.push(sheetName);
        }

        // const workSheetName: string = workBook.SheetNames[0];
        this.allCountShelves = [];
        let wsJson = [];

        //this loop is for readin the excel sheets one by one and push them into the wsJson array
        let firstSheet = true;
        for (let workSheetName of sheetNames) {
          const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetName];
          let currentJson = XLSX.utils.sheet_to_json(workSheet);
          console.log(currentJson);

          if (currentJson) {
            let countedBy;
            let supervisedBy;
            let typedBy;

            if (firstSheet) {
              let names = workSheetName.split("-");
              this.whareHouse = names[0];
              this.itemType = names[1];
              console.log(this.whareHouse);
              console.log(this.itemType);
              // this.selectWh.nativeElement.value = this.whareHouse;
              this.fileName = target.files[0].name;
              this.fileDate = ev.target.files[0].lastModified;
              countedBy = currentJson[2]["C"];
              this.countedBy = countedBy;
              supervisedBy = currentJson[4]["C"];
              this.supervisedBy = supervisedBy;
              typedBy = currentJson[5]["D"];
              this.typedBy = typedBy;
              let countDate = currentJson[2]["F"];
              console.log(countDate);
              let countHour = currentJson[3]["F"];
              console.log(countHour);
              countDate = countDate + " " + countHour;
              this.countDate = new Date(countDate);

              console.log(countedBy, supervisedBy, typedBy, this.countDate);

              this.showFile = true;
              firstSheet = false;
            }
            // for (let item of wsJson) {
            for (let i = 8; i < currentJson.length; i++) {
              currentJson[i]["countedBy"] = countedBy;
              currentJson[i]["supervisedBy"] = supervisedBy;
              currentJson[i]["typedBy"] = typedBy;
              currentJson[i]["fileName"] = this.fileName;
              currentJson[i]["fileDate"] = this.fileDate;
              currentJson[i]["countDate"] = this.countDate;

              console.log(currentJson[i]);
              wsJson.push(currentJson[i]);
            }
          } else {
            // this.showFile = false;
            this.fetchingShelfs = false;
            this.toastSrv.error("No Shelfs in Wharehouse");
          }
          console.log(wsJson);
        }
        // this loop is for structuring the elements in the array
        for (let i = 0; i < wsJson.length; i++) {
          let shelf = {
            itemNumber: wsJson[i]["C"] ? wsJson[i]["C"].toString() : "",
            itemName: wsJson[i]["D"] ? wsJson[i]["D"].trim() : "",
            itemPosition: wsJson[i]["B"]
              ? wsJson[i]["B"].trim().toUpperCase()
              : "",
            itemUnit: wsJson[i]["E"] ? wsJson[i]["E"] : "",
            prevQty: null,
            repeatCount: null,
            diffQty: 0,
            itemPrice: null,
            itemCoin: "",
            itemQty: wsJson[i]["F"] ? wsJson[i]["F"] : 0,
            companyOwned: wsJson[i]["G"]
              ? wsJson[i]["G"].trim().toUpperCase()
              : "",
            itemRemark: wsJson[i]["H"],
            itemBatch: wsJson[i]["I"]
              ? wsJson[i]["I"].toString().toUpperCase()
              : "",
            countedBy: wsJson[i].countedBy,
            supervisedBy: wsJson[i].supervisedBy,
            typedBy: wsJson[i].typedBy,
            fileName: wsJson[i].fileName,
            fileDate: wsJson[i].fileDate,
            countDate: wsJson[i].countDate,
          };

          console.log(shelf);
          this.allCountShelves.push(shelf);
        }
        console.log(this.allCountShelves);
        console.log(this.whareHouse);
        console.log(this.itemType);

        //here we first need to create:
        //1.  itemshells backup
        //2. update whmovements by time of the count
        //3. continue to get the shleflist by wh
        this.inventorySrv
          .itemshellCopy(this.whareHouse, this.itemType)
          .subscribe((data) => {
            console.log(data);
            if (data.msg) {
              this.toastSrv.error(data.msg);
              return;
              //this is step number 2, update the db copy with the movment
            } else if (data.copyResult.length > 0) {
              let updateValues = {
                fromTime: this.countDate,
                toTime: new Date(),
                whName: this.whareHouse,
                db: "copy",
              };

              this.inventorySrv
                .updateActionlogs(updateValues)
                .subscribe((data) => {
                  console.log(data);
                  if (data.msg) {
                    this.toastSrv.error(data.msg);
                    return;
                  } else if (
                    data.savedResults.length == data.whActions.length
                  ) {
                    let filtered = data.savedResults.filter((item) => {
                      return item.ok == 1 && item.nModified == 1 && item.n == 1;
                    });
                    console.log("filtered length: ", filtered.length);
                    console.log("saved length: ", data.savedResults.length);
                    // if (filtered.length == data.savedResults.length) {
                    if (true) {
                      // step number 3, get the item shelves from the copy collection
                      let db = "copy";
                      console.log("Step number 3");
                      this.inventorySrv
                        .shelfListByWH(this.whareHouse, this.itemType, db)
                        .subscribe((data) => {
                          console.log(data);
                          console.log(data.itemShells);
                          if (data.msg) {
                            this.toastSrv.error(data.msg);
                            return;
                          } else if (data) {
                            let itemShells = data.itemShells;
                            console.log(this.allCountShelves);
                            try {
                              for (let item of this.allCountShelves) {
                                let indCS = -1; //shelf position in stock
                                let indP = -1; // component price
                                let indMS = -1; // material price
                                let indPr = -1; //product list

                                if (this.itemType == "component") {
                                  indCS = itemShells.findIndex((shelf) => {
                                    return (
                                      shelf._id.item == item.itemNumber &&
                                      shelf._id.position == item.itemPosition
                                    );
                                  });
                                  indP = this.componentsPrices.findIndex(
                                    (cp) => cp.itemNumber == item.itemNumber
                                  );
                                } else if (this.itemType == "material") {
                                  indCS = itemShells.findIndex((shelf) => {
                                    if (shelf._id.supplierBatchNumber) {
                                      return (
                                        shelf._id.item == item.itemNumber &&
                                        shelf._id.position
                                          .trim()
                                          .toUpperCase() == item.itemPosition &&
                                        shelf._id.supplierBatchNumber
                                          .toString()
                                          .toUpperCase() == item.itemBatch
                                      );
                                    } else {
                                      return (
                                        shelf._id.item == item.itemNumber &&
                                        shelf._id.position
                                          .trim()
                                          .toUpperCase() == item.itemPosition
                                      );
                                    }
                                  });
                                  indMS = this.materialsPrices.findIndex(
                                    (mp) => mp.itemNumber == item.itemNumber
                                  );
                                } else if (this.itemType == "product") {
                                  indCS = itemShells.findIndex((shelf) => {
                                    return (
                                      shelf._id.item == item.itemNumber &&
                                      shelf._id.position.trim().toUpperCase() ==
                                        item.itemPosition
                                    );
                                  });
                                  // indPr = this.productsPrices.findIndex(
                                  //   (pp) => pp.itemNumber == item.itemNumber
                                  // );
                                }

                                // console.log(indCS)
                                if (indCS > -1) {
                                  // console.log(itemShells[indCS].total);
                                  if (this.itemType == "material") {
                                    item.prevQty = parseInt(
                                      itemShells[indCS].total
                                    );
                                  } else {
                                    item.prevQty = parseInt(
                                      itemShells[indCS].total
                                    );
                                  }
                                  // if (item.itemQty && item.prevQty) {
                                  //   item.diffQty = item.itemQty - item.prevQty;
                                  // } else if (
                                  //   item.prevQty &&
                                  //   (!item.itemQty || item.itemQty == 0)
                                  // ) {
                                  //   item.diffQty = 0;
                                  // } else if (
                                  //   item.itemQty &&
                                  //   (!item.prevQty || item.prevQty === 0)
                                  // ) {
                                  //   item.diffQty = item.itemQty;
                                  // }

                                  item.diffQty = item.prevQty
                                    ? item.itemQty - item.prevQty
                                    : item.itemQty;

                                  indCS = -1;
                                }
                                // console.log(indP);
                                if (indP > -1) {
                                  console.log(
                                    this.componentsPrices[indP].actualPrice
                                  );
                                  item.itemPrice =
                                    +this.componentsPrices[indP].actualPrice;
                                  // this.componentsPrices[indP].actualPrice ==
                                  // (0 || null || "")
                                  //   ? null

                                  // : parseFloat(
                                  //     this.componentsPrices[indP]
                                  //       .actualPrice
                                  //   ).toFixed(2);
                                  item.itemCoin =
                                    this.componentsPrices[indP].actualCoin;
                                  indP = -1;
                                }
                                // console.log(indMS);
                                if (indMS > -1) {
                                  console.log(
                                    this.materialsPrices[indMS].actualPrice
                                  );
                                  item.itemPrice =
                                    this.materialsPrices[indMS].actualPrice ==
                                    (0 || null || "")
                                      ? null
                                      : parseFloat(
                                          this.materialsPrices[indMS]
                                            .actualPrice
                                        ).toFixed(2);
                                  item.itemCoin =
                                    this.materialsPrices[indMS].actualCoin;
                                  indMS = -1;
                                }
                              }
                              //* add itemshells that dont exist in the excel file */
                              for (let stock of itemShells) {
                                let ind = this.allCountShelves.findIndex(
                                  (shelf) => {
                                    if (this.itemType == "material") {
                                      if (stock.supplierBatchNumber) {
                                        return (
                                          stock._id.item == shelf.itemNumber &&
                                          stock._id.position
                                            .trim()
                                            .toUpperCase() ==
                                            shelf.itemPosition &&
                                          shelf.itemBatch.toUpperCase() ==
                                            stock.supplierBatchNumber
                                              .toString()
                                              .toUpperCase()
                                        );
                                      } else {
                                        return (
                                          stock._id.item == shelf.itemNumber &&
                                          stock._id.position.toUpperCase() ==
                                            shelf.itemPosition
                                        );
                                      }
                                    } else {
                                      return (
                                        stock._id.item == shelf.itemNumber &&
                                        stock._id.position.toUpperCase() ==
                                          shelf.itemPosition
                                      );
                                    }
                                  }
                                );
                                if (ind == -1) {
                                  let addedRow = {
                                    itemNumber: stock._id.item,
                                    itemName: stock._id.name,
                                    itemPosition: stock._id.position,
                                    prevQty: stock.total,
                                    itemQty: 0,
                                    diffQty: -stock.total,
                                    itemPrice: null,
                                    itemCoin: "",
                                    diffPrice: 0,
                                    itemRemark: "not found",
                                    itemBatch: stock.supplierBatchNumber,
                                  };
                                  if (this.itemType == "component") {
                                    let pIndex =
                                      this.componentsPrices.findIndex((pr) => {
                                        return pr.itemNumber == stock._id.item;
                                      });
                                    if (pIndex > -1) {
                                      addedRow.itemPrice =
                                        this.componentsPrices[pIndex].price;
                                      addedRow.itemCoin =
                                        this.componentsPrices[pIndex].coin;
                                      addedRow.diffPrice =
                                        addedRow.diffQty * addedRow.itemPrice;
                                    }
                                  } else if (this.itemType == "material") {
                                    let mIndex = this.materialsPrices.findIndex(
                                      (pr) => {
                                        return (
                                          pr.itemNumber == stock._id.item &&
                                          pr.itemBatch ==
                                            stock.supplierBatchNumber
                                        );
                                      }
                                    );
                                    if (mIndex > -1) {
                                      addedRow.itemPrice =
                                        this.materialsPrices[mIndex].price;
                                      addedRow.itemCoin =
                                        this.materialsPrices[mIndex].coin;
                                      addedRow.diffPrice =
                                        addedRow.diffQty * addedRow.itemPrice;
                                    }
                                    // } else if (this.itemType == "product") {
                                    //   let mIndex = this.productsPrices.findIndex(
                                    //     (pr) => {
                                    //       return pr.itemNumber == stock._id.item;
                                    //     }
                                    //   );
                                    //   if (mIndex > -1) {
                                    //     addedRow.itemPrice =
                                    //       this.productsPrices[mIndex].price;
                                    //     addedRow.itemCoin =
                                    //       this.materialsPrices[mIndex].coin;
                                    //     addedRow.diffPrice =
                                    //       addedRow.diffQty * addedRow.itemPrice;
                                    //   }
                                  }
                                  this.allCountShelves.push(addedRow);
                                }
                                this.allCountShelves =
                                  this.allCountShelves.filter((shelf) => {
                                    return shelf.itemNumber != "";
                                  });
                              }
                            } catch (error) {
                              console.log("Error message: ", error);
                            }

                            console.log(this.allCountShelves);
                            this.diffReport = true;
                            this.diffReportToExcel();
                            this.toastSrv.success(
                              "טעינת הנתונים עברה בהצלחה",
                              "הצלחה"
                            );
                            this.fetchingShelfs = false;
                            this.uploadExFile.nativeElement.value = "";
                          } else {
                            this.toastSrv.error("No data found");
                            this.fetchingShelfs = false;
                          }
                        });
                    }
                  }
                });
            }
          });
        return;
      };
    }
  }
  diffReportToExcel() {
    let countReport = [];
    let headRow1 = {
      A: null,
      B: null,
      C: null,
      D: 'פארפארם בע"מ רחוב העמל 17 אזור התעשיה אפק, ראש העין, 4809256',
      E: null,
      F: null,
      G: null,
      H: null,
      I: null,
    };
    countReport.push(headRow1);
    let headRow2 = {
      A: null,
      B: null,
      C: null,
      D: "דף ספירת מלאי לסוף שנת הכספים 2021",
      E: null,
      F: null,
      G: null,
      H: null,
      I: null,
    };

    countReport.push(headRow2);
    let headRow3 = {
      A: "",
      B: "שם הסופר:",
      C: this.allCountShelves[0].countedBy,
      D: `דו"ח הפרשים`,
      E: "תאריך:",
      F: this.allCountShelves[0].countDate,
      G: null,
      H: null,
      I: null,
    };
    countReport.push(headRow3);
    let headRow4 = {
      A: null,
      B: null,
      C: null,
      D: null,
      E: null,
      F: null,
      G: null,
      H: null,
      I: null,
    };
    countReport.push(headRow4);
    let headRow5 = {
      A: "",
      B: "שם הבקר:",
      C: this.allCountShelves[0].supervisedBy,
      D: "שם המקליד/ה:",
      E: null,
      F: null,
      G: null,
      H: null,
      I: null,
    };
    countReport.push(headRow5);
    let headRow6 = {
      A: null,
      B: null,
      C: null,
      D: this.allCountShelves[0].typedBy,
      E: null,
      F: null,
      G: null,
      H: null,
      I: null,
    };

    countReport.push(headRow6);
    let headRow7 = {
      A: "",
      B: "שם המחסן:",
      C: null,
      D: this.whareHouse + "-" + this.itemType + "s",
      E: null,
      F: null,
      G: null,
      H: null,
      I: null,
    };
    countReport.push(headRow7);

    let headRow8 = {
      A: "מס.",
      B: "איתור",
      C: 'מק"ט',
      D: "תאור הפריט",
      E: "'יח",
      F: "מלאי נוכחי",
      G: "ספירה נוכחית",
      H: "ספירה חוזרת",
      I: "הפרש בכמות",
      J: "מחיר",
      K: "מטבע",
      L: "הפרש במחיר",
      M: "פריט חברה",
      N: "הערות",
      O: "אצווה",
    };
    countReport.push(headRow8);
    let counter = 1;
    for (let row of this.allCountShelves) {
      let bodyRow = {
        A: counter,
        B: row.itemPosition,
        C: row.itemNumber,
        D: row.itemName,
        E: row.itemUnit,
        F: row.prevQty,
        G: row.itemQty,
        H: row.repeatCount,
        I: row.diffQty,
        J: row.itemPrice,
        K: row.itemCoin,
        L: row.itemPrice * row.diffQty,
        M: row.companyOwned,
        N: row.itemRemark,
        O: row.itemBatch,
      };
      countReport.push(bodyRow);
      counter++;
    }
    this.xlSrv.exportAsExcelFile(
      countReport,
      `ספירת מלאי ${this.lastYearCount.serialNumber + 1}, ${
        this.whareHouse
      } - ${this.itemType}s, 2021`,
      null
    );
  }
  saveEdit(i) {
    console.log(this.EditRow);
    console.log(i);
    console.log(this.allCountShelves[i]);
    console.log(this.reapeatCount.nativeElement.value);
    this.allCountShelves[i].repeatCount = this.reapeatCount.nativeElement.value;
    this.allCountShelves[i].diffQty =
      this.allCountShelves[i].repeatCount - this.allCountShelves[i].prevQty;
    setTimeout(() => (this.EditRow = -1), 500);
  }
  sendDataToDB() {
    this.loadingDataToDB = true;
    console.log(this.allCountShelves);
    console.log(this.whareHouse);

    let wh = { wh: this.whareHouse, type: this.itemType, userName: this.user };

    this.inventorySrv
      .loadCounts({ counts: this.allCountShelves, wh })
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastSrv.error(data.msg);
          this.loadingDataToDB = false;
        } else if (data.length > 0) {
          this.toastSrv.success("הנתונים נשמרו במערכת והם זמינים לצפייה.");
          this.loadingDataToDB = false;
        } else if (data) {
          this.toastSrv.error("No data returned");
          this.loadingDataToDB = false;
        }
      });
  }

  updateYearCount() {
    //*** Backup the current wharehouse */
    console.log(this.whareHouse);
    console.log(this.itemType);
    console.log(this.fileDate);
    let confirmUpdate = confirm(
      "אתה עומד לעדכן את המערכת בספירת המלאי למחסן זה, האם להמשיך? "
    );
    if (confirmUpdate && this.allowedYearUpdate) {
      this.loadingDataToDB = true;
      this.inventorySrv
        .updateYearCount(this.whareHouse, this.itemType, this.fileDate)
        .subscribe((data) => {
          console.log(data);
          this.loadingDataToDB = false;
          if (data.msg) {
            this.toastSrv.error(data.msg);
          } else if (data) {
            this.toastSrv.success("עדכון מלאי בוצע בהצלחה");
          }
        });
    }
  }
  exportEmptyFileView() {
    if (!this.exportEmptyFile) {
      this.whareHouse = null;
      this.allShelfs = [];
    }
    this.actionLogsUpdate = false;
    this.exportEmptyFile = true;
    this.importExcelFile = false;
    this.saveTheExcelToDb = false;
    this.viewSavedExcel = false;
    this.stockUpdateByFile = false;
    this.showFile = false;
    this.diffReport = false;
  }
  importExcelFileView() {
    if (!this.importExcelFile) {
      this.whareHouse = null;
      this.allShelfs = [];
      this.allCountShelves = [];
    }
    this.actionLogsUpdate = false;
    this.showFile = true;
    this.exportEmptyFile = false;
    this.importExcelFile = true;
    this.saveTheExcelToDb = false;
    this.viewSavedExcel = false;
    this.stockUpdateByFile = false;
    this.readOnly = false;
    this.diffReport = false;
  }
  saveTheExcelToDbView() {
    this.actionLogsUpdate = false;
    this.exportEmptyFile = false;
    this.importExcelFile = false;
    this.saveTheExcelToDb = true;
    this.viewSavedExcel = false;
    this.stockUpdateByFile = false;
    this.readOnly = false;
    this.diffReport = false;
  }

  viewSavedExcelView() {
    if (!this.viewSavedExcel) {
      this.whareHouse = null;
      this.allShelfs = [];
      this.allCountShelves = [];
    }
    this.diffReport = false;
    this.actionLogsUpdate = false;
    this.exportEmptyFile = false;
    this.importExcelFile = false;
    this.saveTheExcelToDb = false;
    this.viewSavedExcel = true;
    this.stockUpdateByFile = false;
    this.readOnly = true;
  }

  stockUpdateByFileView() {
    if (this.allowedYearUpdate) {
      this.actionLogsUpdate = false;
      this.exportEmptyFile = false;
      this.importExcelFile = false;
      this.saveTheExcelToDb = false;
      this.viewSavedExcel = false;
      this.stockUpdateByFile = true;
      this.readOnly = true;
      this.diffReport = false;
    } else {
      alert("אין לך הרשאה מתאימה לביצוע הפעולה");
    }
  }
  actionLogsUpdateView() {
    if (this.allowedYearUpdate) {
      this.actionLogsUpdate = true;
      this.exportEmptyFile = false;
      this.importExcelFile = false;
      this.saveTheExcelToDb = false;
      this.viewSavedExcel = false;
      this.stockUpdateByFile = false;
      this.readOnly = true;
      this.showFile = false;
      this.diffReport = false;
    } else {
      alert("אין לך הרשאה מתאימה לביצוע הפעולה");
    }
  }
  updateItemshells() {
    let confRetro = confirm("אתה עומד לשנות מלאי קיים, האם להמשיך?");
    console.log(this.retroactiveUpdate.controls);
    let formValue = this.retroactiveUpdate.controls;
    let updateValues = {
      fromTime: formValue.fromDate.value + " " + formValue.fromHour.value,
      toTime: formValue.toDate.value + " " + formValue.toHour.value,
      warehouseId: formValue.warehouseName.value,
      db: "real",
    };
    console.log(updateValues);
    if (confRetro)
      this.inventorySrv.updateActionlogs(updateValues).subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastSrv.error(data.msg);
          return;
        } else if (data.savedResults.length == data.whActions.length) {
          let filtered = data.savedResults.filter((item) => {
            return item.ok == 1 && item.nModified == 1 && item.n == 1;
          });
          if (filtered.length == data.savedResults.length) {
            this.toastSrv.success("עדכון המלאי עבר בהצלה", "הצלחה");
          }
        }
      });
  }
}
