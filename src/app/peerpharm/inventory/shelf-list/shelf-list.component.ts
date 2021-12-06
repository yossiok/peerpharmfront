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
  showCurrent: boolean = false;
  fileName: string = "";
  fileDate: Date = null;

  @ViewChild("shelfPosition") shelfPosition: ElementRef;
  @ViewChild("shelfAmount") shelfAmount: ElementRef;
  @ViewChild("countInput") countInput: ElementRef;
  @ViewChild("updatesModal") updatesModal: ElementRef;
  @ViewChild("printStocktake") printStocktake: ElementRef;
  @ViewChild("uploadExFile") uploadExFile: ElementRef;
  @ViewChild("selectWh") selectWh: ElementRef;

  updatingAmount: boolean;
  fetchingShelfs: boolean;

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
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getLastYearCount();
    this.getAllCostumers();
    this.allowedWHS = this.authService.loggedInUser.allowedWH;
    this.allowedCountYear =
      this.authService.loggedInUser.authorization.includes("allowedCountYear");
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
        this.fetchingShelfs = false;
        if (data) {
          let allShelfsWithOrWithoutItems = data.emptyShells.concat(data.itemShells)
          allShelfsWithOrWithoutItems.sort((a, b) => (a._id.position > b._id.position ? 1 : -1));
          let emptyLines = []
          for(let i = 0; i < 50; i++) {
            emptyLines.push({ _id: { } })
          }
          allShelfsWithOrWithoutItems = allShelfsWithOrWithoutItems.concat(emptyLines)
          this.allShelfs = allShelfsWithOrWithoutItems;
          this.allShelfsCopy = allShelfsWithOrWithoutItems;
          console.log(data);
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
    let shelfs = [];
    let whName: string = this.whareHouse + "-" + this.itemType;
    for (let shelf of this.allShelfs) {
      shelfs.push({
        'מק"ט': shelf._id.item,
        "תיאור הפריט": shelf._id.name[0],
        איתור: shelf._id.position,
        "יח' מידה": "",
        כמות: "",
        "פריט חברה": "",
        הערות: "",
      });
    }

    this.xlSrv.exportAsExcelFile(
      shelfs,
      `ספירת מלאי ${this.lastYearCount.serialNumber + 1}, ${
        this.whareHouse
      } - ${this.itemType}s, 2021`,
      null,
      whName
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
    console.log(ev.target.files[0]);
    console.log(ev.target.files[0].lastModified);
    console.log(ev.target.files[0].lastModifiedDate);
    console.log(ev.target.files[0].name);
    if (confirm("האם אתה בטוח שבחרת בקובץ הנכון ?") == true) {
      const target: DataTransfer = <DataTransfer>ev.target;
      //
      if (target.files.length > 1) {
        alert("ניתן לבחור קובץ אחד בלבד");
        this.uploadExFile.nativeElement.value = "";
        return;
      }
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

        const workSheetName: string = workBook.SheetNames[0];
        const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetName];
        let wsJson = XLSX.utils.sheet_to_json(workSheet);
        console.log(wsJson);
        if (wsJson) {
          this.allCountShelves = [];

          let names = workSheetName.split("-");
          this.whareHouse = names[0];
          this.itemType = names[1];
          this.selectWh.nativeElement.value = this.whareHouse;
          this.fileName = target.files[0].name;
          this.fileDate = ev.target.files[0].lastModified;
          for (let item of wsJson) {
            let shelf = {
              itemNumber: item['מק"ט'],
              itemName: item["תיאור הפריט"],
              itemPosition: item["איתור"],
              itemUnit: item["יח' מידה"],
              prevQty: 0,
              itemQty: item["כמות"],
              companyOwned: item["פריט חברה"],
              itemRemark: item["הערות"],
            };
            this.allCountShelves.push(shelf);
          }
          console.log(this.allCountShelves);
          this.inventorySrv
            .shelfListByWH(this.whareHouse, this.itemType)
            .subscribe((data) => {
              console.log(data);
              if (data) {
                for (let item of this.allCountShelves) {
                  let index = data.findIndex((shelf) => {
                    return (
                      shelf._id.item == item.itemNumber &&
                      shelf._id.position == item.itemPosition
                    );
                  });
                  console.log(index);
                  if (index != -1) {
                    item.prevQty = data[index].total;
                  }
                }
                this.fetchingShelfs = false;
                console.log(this.allCountShelves);
              } else {
                this.toastSrv.error("No data found");
                this.fetchingShelfs = false;
              }
            });
        } else {
          this.fetchingShelfs = false;
          this.toastSrv.error("No Shelfs in Wharehouse");
        }
      };
    }
  }
}
