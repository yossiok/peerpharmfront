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
  componentsPrices = [];
  materialsPrices = [];
  productsPrices = [];
  pageForm = [];
  formNum: string = "";
  shelvesArr: any[] = [];

  @ViewChild("shelfPosition") shelfPosition: ElementRef;
  @ViewChild("shelfAmount") shelfAmount: ElementRef;
  @ViewChild("countInput") countInput: ElementRef;
  @ViewChild("updatesModal") updatesModal: ElementRef;
  @ViewChild("printStocktake") printStocktake: ElementRef;
  @ViewChild("uploadExFile") uploadExFile: ElementRef;
  @ViewChild("selectWh") selectWh: ElementRef;
  @ViewChild("repeatCount") reapeatCount: ElementRef;
  @ViewChild("printPages") printPages: ElementRef;

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
    this.getInvRepCosts();
    this.allowedWHS = this.authService.loggedInUser.allowedWH;
    this.allowedCountYear =
      this.authService.loggedInUser.authorization.includes("allowedCountYear");
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

  getShelfsByWH(ev) {
    this.fetchingShelfs = true;
    let whareHouse = ev.target ? ev.target.value : ev;
    // this.whareHouse = ev.target.value;
    console.log(whareHouse);
    this.getAllWhShelfs();
    switch (whareHouse) {
      case "material":
        this.itemType = whareHouse;
        this.whareHouse = "Rosh HaAyin";
        break;
      case "component":
        this.itemType = whareHouse;
        this.whareHouse = "Rosh HaAyin";
        break;
      case "Rosh HaAyin products":
        this.itemType = "product";
        this.whareHouse = whareHouse;
        break;
      case "NEW KASEM":
        this.itemType = "component";
        this.whareHouse = whareHouse;
        break;
      case "Kasem":
        this.itemType = "component";
        this.whareHouse = whareHouse;
        break;
      case "Labels":
        this.itemType = "component";
        this.whareHouse = whareHouse;
    }
    this.inventorySrv
      .shelfListByWH(this.whareHouse, this.itemType)
      .subscribe((data) => {
        if (data.msg) {
          this.toastSrv.error(data.msg);
          this.fetchingShelfs = false;
        } else if (data) {
          console.log(data);
          let allShelfsWithOrWithoutItems = data.emptyShells.concat(
            data.itemShells
          );
          allShelfsWithOrWithoutItems.forEach((shelf) => {
            console.log(shelf);
            let firstPart = shelf._id.position.substring(0, 2);
            console.log(firstPart);
            let secondPart = shelf._id.position.substring(2);
            console.log(secondPart);
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
            console.log(shelf);
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
          console.log(data);
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
    let totalForms = Math.ceil(this.allShelfs.length / 20);
    let i = 0;
    let page = 20;
    let order = [];
    while (i < this.allShelfs.length) {
      console.log(i);
      console.log(this.allShelfs[i]);
      console.log(this.allShelfs[i]._id);

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
        E: null,
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
        console.log("J: " + j);
        console.log(this.allShelfs[i]._id.position);
        console.log(this.allShelfs[i]._id.item);
        console.log(this.allShelfs[i]._id.name);
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
      console.log("Form number: " + formNum);
      formNum++;
      page = formNum == totalForms ? this.allShelfs.length - i : page;
      console.log(shelfs);
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
        for (let workSheetName of sheetNames) {
          const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetName];
          let wsJson = XLSX.utils.sheet_to_json(workSheet);
          console.log(wsJson);

          if (wsJson) {
            let names = workSheetName.split("-");
            this.whareHouse = names[0];
            this.itemType = names[1];

            this.selectWh.nativeElement.value = this.whareHouse;
            this.fileName = target.files[0].name;
            this.fileDate = ev.target.files[0].lastModified;

            this.showFile = true;
            // for (let item of wsJson) {
            for (let i = 8; i < wsJson.length; i++) {
              let shelf = {
                itemNumber: wsJson[i]["C"]
                  ? wsJson[i]["C"].toString().trim()
                  : "",
                itemName: wsJson[i]["D"] ? wsJson[i]["D"].trim() : "",
                itemPosition: wsJson[i]["B"]
                  ? wsJson[i]["B"].trim().toUpperCase()
                  : "",
                itemUnit: wsJson[i]["E"]
                  ? wsJson[i]["E"].trim().toUpperCase()
                  : "",
                prevQty: 0,
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
                  ? wsJson[i]["I"].trim().toUpperCase()
                  : "",
              };
              // let shelf = {
              //   itemNumber: item['מק"ט'] ? item['מק"ט'].trim() : "",
              //   itemName: item["תיאור הפריט"]
              //     ? item["תיאור הפריט"].trim().toLowerCase()
              //     : "",
              //   itemPosition: item["איתור"]
              //     ? item["איתור"].trim().toUpperCase()
              //     : "",
              //   itemUnit: item["יח' מידה"]
              //     ? item["יח' מידה"].trim().toUpperCase()
              //     : "",
              //   prevQty: 0,
              //   repeatCount: null,
              //   diffQty: 0,
              //   itemPrice: null,
              //   itemCoin: "",
              //   itemQty: item["כמות"] ? item["כמות"] : 0,
              //   companyOwned: item["פריט חברה"]
              //     ? item["פריט חברה"].trim().toUpperCase()
              //     : "",
              //   itemRemark: item["הערות"],
              //   itemBatch: item["Batch"]
              //     ? item["Batch"].trim().toUpperCase()
              //     : "",
              // };
              console.log(shelf);
              this.allCountShelves.push(shelf);
            }
            console.log(this.allCountShelves);
            this.inventorySrv
              .shelfListByWH(this.whareHouse, this.itemType)
              .subscribe((data) => {
                console.log(data);
                console.log(data.itemShells);
                if (data.msg) {
                  this.toastSrv.error(data.msg);
                  return;
                } else if (data) {
                  let itemShells = data.itemShells;
                  console.log(this.allCountShelves);

                  for (let item of this.allCountShelves) {
                    let indCS = -1;
                    let indP = -1;
                    let indMS = -1;

                    if (this.itemType == "component") {
                      indCS = itemShells.findIndex((shelf) => {
                        return (
                          shelf._id.item.trim() == item.itemNumber &&
                          shelf._id.position.trim().toUpperCase() ==
                            item.itemPosition
                        );
                      });
                      indP = this.componentsPrices.findIndex(
                        (cp) => cp.itemNumber == item.itemNumber
                      );
                    } else if (this.itemType == "material") {
                      indCS = itemShells.findIndex((shelf) => {
                        return (
                          shelf._id.item == item.itemNumber &&
                          shelf._id.position.trim().toUpperCase() ==
                            item.itemPosition &&
                          shelf._id.supplierBatchNumber.trim().toUpperCase() ==
                            item.itemBatch
                        );
                      });
                      indMS = this.materialsPrices.findIndex(
                        (mp) => mp.itemNumber == item.itemNumber
                      );
                    }

                    console.log(indCS);
                    if (indCS > -1) {
                      console.log(itemShells[indCS].total);
                      item.prevQty = parseInt(itemShells[indCS].total).toFixed(
                        2
                      );
                      item.diffQty = item.itemQty - item.prevQty;
                      indCS = -1;
                    }
                    console.log(indP);
                    if (indP > -1) {
                      console.log(this.componentsPrices[indP].actualPrice);
                      item.itemPrice =
                        0 || null
                          ? null
                          : parseFloat(
                              this.componentsPrices[indP].actualPrice
                            ).toFixed(2);
                      item.itemCoin = this.componentsPrices[indP].actualCoin;
                      indP = -1;
                    }
                    console.log(indMS);
                    if (indMS > -1) {
                      console.log(this.materialsPrices[indMS].actualPrice);
                      item.itemPrice =
                        0 || null
                          ? null
                          : parseFloat(
                              this.materialsPrices[indMS].actualPrice
                            ).toFixed(2);
                      item.itemCoin = this.materialsPrices[indMS].actualCoin;
                      indMS = -1;
                    }
                  }

                  console.log(this.allCountShelves);
                  this.uploadExFile.nativeElement.value = "";
                } else {
                  this.toastSrv.error("No data found");
                  this.fetchingShelfs = false;
                }
                this.fetchingShelfs = false;
              });
          } else {
            this.showFile = false;
            this.fetchingShelfs = false;
            this.toastSrv.error("No Shelfs in Wharehouse");
          }
        }
      };
    }
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

    // this.inventorySrv.loadCounts(this.allShelfs);

    this.loadingDataToDB = false;
  }
}
