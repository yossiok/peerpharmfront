import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Integer } from "aws-sdk/clients/pi";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { InventoryService } from "src/app/services/inventory.service";
import * as moment from "moment";
import { InventoryRequestService } from "src/app/services/inventory-request.service";
import { map } from "rxjs-compat/operator/map";
//import { last } from '../../../../../node_modules/@angular/router/src/utils/collection';
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Procurementservice } from "src/app/services/procurement.service";

@Component({
  selector: "app-wharehouse",
  templateUrl: "./wharehouse.component.html",
  styleUrls: ["./wharehouse.component.scss"],
})
export class WharehouseComponent implements OnInit {
  // new ----------------------
  newReqNumber: number;
  inventoryReqForm: FormGroup;
  itemLine: FormGroup;
  inventoryUpdateList: Array<any> = []; // to show added items to request
  itemNumber: String = "";
  currImageComp: String = "";
  amount: Number;
  relatedOrder: String = "";
  today: Date = new Date();
  stickerItem: any;
  stickerQty: any;
  stickerRemarks: any;
  certificateReception: number;

  currItemShelfs: Array<any>;
  multiInputLines: Boolean = false;
  multiLinesArr: Array<any>;
  //  -------------------------
  StkMngNavBtnColor: String = "#1affa3";
  WhMngNavBtnColor: String = "";
  ItemsOnShelf: Array<any>;
  listToPrint: Array<any> = [];
  printAgain: Array<any> = [];
  closeResult: string;

  packingMaterialCheck = {
    orderCompareIfFalse: "",
    orderCompareTrue: "",
    packageQuantityIfFalse: "",
    packageQuantityTrue: "",
    packageCompleteIfFalse: "",
    packageCompleteTrue: "",
    packageSealedIfFalse: "",
    packageSealedTrue: "",
    printingCompleteIfFalse: "",
    printingCompleteTrue: "",
    remarks: "",
    signature: "",
    itemNumber: "",
  };

  @ViewChild("container")
  @ViewChild("lineqnt")
  @ViewChild("wh")
  wh: ElementRef;
  @ViewChild("shelfSearch") shelfSearch: ElementRef;
  @ViewChild("printBtn") printBtn: ElementRef;
  @ViewChild("printBtn2") printBtn2: ElementRef;
  @ViewChild("printBtn3") printBtn3: ElementRef;

  private container: ElementRef;
  mainDivArr: any = [];
  whareHouses: any = []; // user allowed whs
  allWhareHouses: any = []; // all whs
  whareHouseId: string = ""; //wharehouse id for shelf update
  curentWhareHouseId: string = ""; //wharehouse id for qty update
  curentWhareHouseName: string = ""; //wharehouse id to show
  changeWh: boolean = false;
  shelfs: any = [];
  itemPurchaseOrders: any = [];
  shelfsCopy: any = [];
  dir: string = "in";
  screen: String = "stkManagment";
  response = { color: "", body: "" };
  i: Integer = 0;
  currTab: string = "";
  loadingToTable: boolean = false;
  editWharehouses: Boolean = false;
  loadShelfs: boolean = false;
  isJew: boolean = true;
  allowNewRequest: boolean = false;
  showNewReq: boolean = false;

  shelves: Array<any>;

  constructor(
    private procurementSrv: Procurementservice,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private inventoryReqService: InventoryRequestService,
    private toastSrv: ToastrService
  ) {
    // new ----------------------
    this.itemLine = fb.group({
      itemNumber: ["", Validators.required],
      amount: [0, Validators.required],
      position: ["", Validators.required],
      relatedOrder: [""],
      arrivalDate: [Date],
      packingMaterialCheck: [[]],
      destShelf: [""],
      destShelfId: [""],
      deliveryNote: [""],
    });
    //  -------------------------
  }

  ngOnInit() {
    // let todayStr=moment(this.today).format("YYYY-MM-DD");
    // this.itemLine.controls.arrivalDate.setValue(todayStr);
    this.getUserWhs();
    this.getAllWhs();
    if (this.authService.loggedInUser.screenPermission == "6")
      this.isJew = false;
    this.allowNewRequest =
      Number(this.authService.loggedInUser.screenPermission) < 4;
  }

  // sortShelves(){
  //   this.multiLinesArr.map((item)=>{
  //   })
  // }

  getAllWhs() {
    this.inventoryService.getWhareHousesList().subscribe((whs) => {
      this.allWhareHouses = whs;

      console.log(this.allWhareHouses);
      // this.allWhareHouses = whs.filter((wh) => wh.name != "Rosh HaAyin");
    });
  }

  getUserWhs() {
    this.inventoryService.getWhareHousesList().subscribe(async (res) => {
      let displayAllowedWH = [];
      // for (const wh of res) {
      await res.forEach((wh) => {
        if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
          displayAllowedWH.push(wh);
        }
      });
      // this.whareHouses = displayAllowedWH.filter(
      //   (wh) => wh.name != "Rosh HaAyin"
      // );
      this.whareHouses = displayAllowedWH;

      this.curentWhareHouseId = displayAllowedWH[0]._id;
      this.curentWhareHouseName = displayAllowedWH[0].name;

      if (this.authService.loggedInUser.authorization) {
        if (this.authService.loggedInUser.authorization.includes("system")) {
          this.editWharehouses = true;
        }
      }
    });
  }

  printCertifAgain() {
    this.listToPrint = this.printAgain;
    this.printBtn.nativeElement.click();
  }
  printBeforeChange() {
    this.printBtn3.nativeElement.click();
  }

  dirSet(action, direction) {
    if (direction != "production") this.multiInputLines = false;
    this.inventoryUpdateList = []; //reseting list before direction change
    this.multiLinesArr = [];
    this.currItemShelfs = [];
    this.itemLine.reset();
    this.screen = action;
    if (action == "whManagment") {
      this.WhMngNavBtnColor = "#1affa3";
      this.StkMngNavBtnColor = "";

      this.dir = "managment";
    } else if (action == "stkManagment") {
      //change active navbar colors
      this.WhMngNavBtnColor = "";
      this.StkMngNavBtnColor = "#1affa3";
      this.dir = direction;
      // empty unrelevant fields if changing direction
      if (this.dir != "in") this.itemLine.controls.arrivalDate.setValue(null);
      if (this.dir == "in") this.itemLine.controls.relatedOrder.setValue("");
      if (this.dir == "production") this.multiInputLines = true;
    }
  }

  // getFormData() {
  //   let div = this.container.nativeElement;
  //   this.mainDivArr = [];
  //   let divArr = [];
  //   //  for (let innerDiv of div.getElementsByTagName('input')) {
  //   for (let innerDiv of div.getElementsByClassName('dataInput')) {

  //     console.log(innerDiv.value);
  //     if (innerDiv.value.length > 0) {
  //       divArr.push(innerDiv.value);
  //     }
  //     else {
  //       // temp fix
  //       if(this.dir!="production" && this.mainDivArr.length==0){
  //         divArr.splice(0,1);
  //       }
  //       let itemData = {
  //         item: divArr[0],
  //         shell: divArr[1],
  //         amount: divArr[2],
  //         newShelf: "",
  //         demandOrderId: "",
  //         actionType: this.dir,
  //         whareHouse: this.curentWhareHouseId,
  //       }

  //       if (this.dir == "shellChange") { // if it's for shellChange
  //         //   Object.assign({newShelf:divArr[3]}, itemData);
  //         itemData.newShelf = divArr[3];
  //       }
  //       if (this.dir == "production") { // if it's for production - add demandOrderId for server update
  //         // Object.assign({demandOrderId:divArr[3]}, itemData);
  //         itemData.demandOrderId = divArr[3];
  //       }
  //       this.mainDivArr.push(itemData);
  //           divArr = [];
  //     }
  //   }
  //   console.log(this.mainDivArr);
  //   this.inventoryService.updateInventoryChanges(this.mainDivArr).subscribe(res => {
  //     console.log("updateInventoryChanges res: "+res);
  //       if (res != null) {

  //     }else{
  //       ;
  //     }
  //   });
  // }

  resetForm() {
    const childElements = this.container.nativeElement.children;
    for (let child of childElements) {
      this.renderer.removeChild(this.container.nativeElement, child);
    }
  }
  getShelfsList(whname) {
    let i = this.whareHouses.findIndex((wh) => wh.name == whname);
    this.whareHouseId = this.whareHouses[i]._id;
    this.shelfs = [];
    this.loadShelfs = true;
    this.inventoryService
      .getWhareHouseShelfList(this.whareHouseId)
      .subscribe((res) => {
        this.loadShelfs = false;
        this.shelfs = res;
        this.shelfsCopy = res;
        console.log(this.whareHouses);
      });
  }

  // addNewShelf(position) { //OLD!!!
  //   //to upper case and remove spaces
  //   position = position.toUpperCase();
  //   position = position.replace(/\s/g, '');
  //   if (this.whareHouseId == "") {
  //     this.response.body = "Pleae choose wharehose- נא לבחור מחסן"
  //     this.response.color = "red"
  //   } else
  //     if (position == "") {
  //       this.response.body = "Pleae enter shelf - נא להקליד מדף"
  //       this.response.color = "red"
  //     }
  //     else {
  //       let shellObj = { whareHouseId: this.whareHouseId, position: position }
  //       this.inventoryService.addNewShelf(shellObj).subscribe(res => {
  //         console.log(res)
  //         if (res._id.length > 0) {
  //           this.shelfs.push(res)
  //           this.response.body = "Shelf Added- מדף התווסף"
  //           this.response.color = 'Aquamarine'
  //         } else {
  //           this.response.body = "Shelf is already exist - מדף קיים כבר"
  //           this.response.color = 'red'
  //         }
  //       })
  //     }
  // }

  // addNewWhareHouse(whareHouseName) { //OLD!!!
  //   this.inventoryService.addNewWhareHouse(whareHouseName).subscribe(res => {
  //     console.log(res)
  //     if (res != "faild") {
  //       this.whareHouses.push(res)
  //     }
  //   })
  // }
  addNewWhareHouse(whareHouseName) {
    this.inventoryService.addNewWhareHouse(whareHouseName).subscribe((res) => {
      console.log(res);
      if (res.name) {
        this.toastSrv.success("מחסן נוצר בהצלחה !");
        this.whareHouses.push(res);
      }
    });
  }

  setWhareHouse(whname) {
    let i = this.whareHouses.findIndex((wh) => wh.name == whname);
    this.curentWhareHouseId = this.whareHouses[i]._id;
    this.curentWhareHouseName = this.whareHouses[i].name;
    // this.changeWh = false;
  }

  // changeCurentWh() {
  //   this.changeWh = true;
  // }

  searchShelf(shelf) {
    shelf = shelf.toUpperCase();
    console.log(shelf);
    if (shelf == "") {
      this.shelfs = this.shelfsCopy.slice();
    } else {
      this.shelfs = this.shelfsCopy.filter(
        (x) => x.position.toLowerCase() == shelf.toLowerCase()
      );
      if (this.shelfs.length == 0)
        this.toastSrv.error("לא קיים מדף כזה במחסן הזה");
      else {
        for (let shelf of this.shelfs) {
          this.inventoryService
            .getShelfByShelfId(shelf._id)
            .subscribe((data) => {
              let tempArr = [];
              data.forEach((shelf) => {
                let obj = {
                  item: shelf.item,
                  amount: shelf.amount,
                };
                tempArr.push(obj);
              });
              shelf.itemsArr = tempArr;
              console.log(this.shelfs);
            });
        }
      }
    }
  }

  getItemWhShelfsList(itemNumber, shelfsDiv) {
    let a = this.inventoryService;
    let b = this.curentWhareHouseName;
    return new Promise(function (resolve, reject) {
      a.getShelfListForItemInWhareHouse(itemNumber, b).subscribe((res) => {
        if (res.length > 0) {
          console.log(res);
          resolve(res);
        } else resolve([]);
      });
    });
  }

  // ********************************************************************************************************************
  // NEW - insted of all the rendering
  // ********************************************************************************************************************
  async searchItemShelfs(ev) {
    if (!this.multiInputLines && ev != "") {
      await this.inventoryService
        .getShelfListForItemInWhareHouse(
          ev.target.value,
          this.curentWhareHouseId
        )
        .subscribe(async (res) => {
          console.log(res);
          if (res.length > 0) {
            this.currItemShelfs = res;
          } else {
            this.currItemShelfs = [];
            this.currItemShelfs.push(
              "NO SHELFS WITH ITEM # " + ev.target.value
            );
          }
        });

      this.procurementSrv
        .getAllItemPurchases(ev.target.value)
        .subscribe((data) => {
          this.itemPurchaseOrders = data;
        });
    } else if (this.multiInputLines) {
      this.multiLinesArr.forEach(async (element) => {
        element.currItemShelfs = [];
        await this.inventoryService
          .getShelfListForItemInWhareHouse(
            element.itemNumber,
            this.curentWhareHouseId
          )
          .subscribe(async (res) => {
            console.log(res);
            if (res.length > 0) {
              element.currItemShelfs = res;
            } else {
              element.currItemShelfs = [];
              element.currItemShelfs.push(
                "NO SHELFS WITH ITEM # " + element.itemNumber
              );
            }
          });
      });
    }
    if (ev.target.value != "") {
      this.inventoryService
        .getCmptByNumber(ev.target.value, "component")
        .subscribe((data) => {
          this.currImageComp = data[0].img;
        });
    } else {
      this.currImageComp = "";
    }
  }

  sendPackingMaterialCheck() {
    let DetailsToPush = { ...this.packingMaterialCheck };
    this.itemLine.value.packingMaterialCheck.push(DetailsToPush);
  }

  loadShelfToInput(position, ev) {
    if (!this.multiInputLines) {
      if (!position.includes("NO SHELFS")) {
        this.itemLine.controls.position.setValue(position);
      }
    } else if (this.multiInputLines) {
      this.multiLinesArr.forEach((x, index) => {
        if (!position.includes("NO SHELFS")) {
          if (index == ev.target.dataset.lineid) {
            x.position = position;
            x.requsetedQnt = x.amount;
            // x.amount=0;
          }
        }
      });
    }
  }

  async getChildArr(arrSent) {
    console.log(arrSent);
    this.multiInputLines = true;
    await this.dirSet("stkManagment", "production");

    if (arrSent.length > 0) {
      this.dir = "production";
      await arrSent.forEach((i) => {
        i.qnt = 0;
        i.amount = i.amount;
        i.qntSupplied = i.qntSupplied;
        i.position = "";
        i.currItemShelfs = [];
        i.currItemShelfs.push({ position: "" });
      });
    }
    // let loadItems=confirm("טעינת פריטים מבקשת מלאי");
    // if(loadItems){
    this.multiLinesArr = arrSent;
    console.log(this.multiLinesArr);
    arrSent.forEach((itemFromInvReq) => {
      this.searchItemShelfs("");
      console.log(itemFromInvReq);
    });
    // }
  }

  async getAllGeneralDemands() {
    await this.inventoryReqService
      .getOpenInventoryRequestsList()
      .subscribe((res) => {
        console.log(res);

        //res= allorders from itemsDemands table
        res.forEach((invRequest) => {
          invRequest.reqList.map((item) => {
            //   item.cmptN="0";
            item.isSelected = false;
            //Object.assign({ isSelected: false }, item);
          });
        });

        this.getChildArr(res);
      });
  }

  deleteLine(itemFromInvReq, index, ev) {
    this.multiLinesArr.splice(index, 1);
    if (this.multiLinesArr.length == 0) this.multiInputLines = false;
  }

  deleteRow(index) {
    this.inventoryUpdateList.splice(index, 1);
    this.listToPrint.splice(index, 1);
    this.printAgain.splice(index, 1);
  }

  cleanList() {
    let cleanConfirm = confirm("מחיקת כל הפריטים מהרשימה");
    if (cleanConfirm) this.inventoryUpdateList = [];
  }

  updateFivePercentToStickers(inventoryUpdateList) {
    inventoryUpdateList.forEach((element) => {
      if (element.componentType == "sticker" && this.dir == "out") {
        element.amount += (5 / 100) * element.amount;
      }
    });

    return inventoryUpdateList;
  }

  async sendList() {
    let fixedArr;

    let sendConfirm = confirm("עדכון שינויים במלאי");
    if (sendConfirm && this.inventoryUpdateList.length > 0) {
      fixedArr = await this.updateFivePercentToStickers(
        this.inventoryUpdateList
      );
      this.inventoryUpdateList = fixedArr;

      await this.inventoryService
        .updateInventoryChangesTest(
          this.inventoryUpdateList,
          this.inventoryUpdateList[0].itemType,
          this.dir
        )
        .subscribe(async (res) => {
          if (res == "all updated" || (res.msg && res.msg == "all updated")) {
            if (res.reception) this.certificateReception = res.reception;
            this.toastSrv.success("שינויים בוצעו בהצלחה");
            let actionLogObj = {
              certNum: this.certificateReception,
              dateAndTime: new Date(),
              logs: this.inventoryUpdateList,
              userName:
                this.authService.loggedInUser.firstName +
                " " +
                this.authService.loggedInUser.lastName,
              movementType: this.dir,
              deliveryNote: res.reception,
            };

            this.inventoryService
              .addToWHActionLogs(actionLogObj)
              .subscribe((res) => {
                console.log(res);
                this.toastSrv.success("פעולות מחסנאי נשמרו");
              });
            this.inventoryService.deleteZeroStockAmounts().subscribe((x) => {
              console.log(x.n + " items with amount=0 deleted");
            });

            //PRINT !!!
            if (
              this.dir == "production" ||
              this.dir == "out" ||
              this.dir == "in"
            ) {
              // this.listToPrint = await this.inventoryUpdateList.filter((i) => {
              //   if (i.amount < 0) i.amount = Math.abs(i.amount);
              //   return i;
              // });
              this.printStockTransferCertificate();
            }

            if (this.dir != "shelfChange") this.itemLine.reset();
            this.inventoryUpdateList = [];
          } else {
            this.toastSrv.error("שגיאה- לא התבצע עדכון");
          }
        });
    }
  }

  async printStockTransferCertificate() {
    if (this.dir == "production" || this.dir == "out") {
      this.printBtn.nativeElement.click();

      this.listToPrint = [];
    }
    if (this.dir == "in") {
      setTimeout(() => {
        this.printBtn2.nativeElement.click();
        this.listToPrint = [];
      }, 500);
    }
  }

  getItemLineQnt(i, ev) {
    this.multiLinesArr[i].amount = ev.target.value;
  }

  async checkLineValidation(itemLine) {
    console.log(itemLine.amount);
    itemLine.qnt = itemLine.amount;
    let stockType;

    if (
      this.curentWhareHouseName == "Rosh HaAyin" ||
      this.curentWhareHouseName == "Kasem" ||
      this.curentWhareHouseName == "Filling" ||
      this.curentWhareHouseName == "Stickers" ||
      this.curentWhareHouseName == "NEW KASEM" ||
      this.curentWhareHouseName == "Labels"
    ) {
      stockType = "component";
    }
    if (this.curentWhareHouseName == "Rosh HaAyin products")
      stockType = "product";

    console.log(itemLine.amount);
    var itemLineToAdd = JSON.parse(JSON.stringify(itemLine));
    console.log(itemLineToAdd.amount);
    if (this.multiInputLines) itemLineToAdd.amount = itemLineToAdd.qnt;
    console.log(itemLineToAdd);

    this.loadingToTable = true;
    var position;
    var currItemShelfs;

    // multiLineQntInput
    if (this.multiInputLines) {
      itemLineToAdd.amount = itemLineToAdd.requsetedQnt;
      currItemShelfs = itemLineToAdd.currItemShelfs;
    } else {
      currItemShelfs = this.currItemShelfs;
      // position=itemLineToAdd.controls.position.value.toUpperCase();
    }

    if (
      (itemLineToAdd.itemNumber != "" && this.dir == "in") ||
      (itemLineToAdd.itemNumber != "" &&
        currItemShelfs[0]._id &&
        this.dir != "in")
    ) {
      //VALID AMOUT
      position = itemLineToAdd.position.toUpperCase().trim();

      if (
        (this.dir != "in" &&
          parseInt(currItemShelfs[0].amount) != NaN &&
          currItemShelfs[0].amount != undefined) ||
        (this.dir == "in" && itemLine.amount != "")
      ) {
        await this.inventoryService
          .getCmptByNumber(itemLineToAdd.itemNumber, stockType)
          .subscribe(async (itemRes) => {
            if (itemRes.length > 0) {
              this.inventoryService
                .checkIfShelfExist(position, this.curentWhareHouseId)
                .subscribe(async (shelfRes) => {
                  console.log(shelfRes);
                  if (shelfRes.position) {
                    var itemShelfCurrAmounts = [];
                    await currItemShelfs.forEach((x) => {
                      if (x.position == shelfRes.position) {
                        itemShelfCurrAmounts.push(x.amount);
                      }
                    });
                    if (
                      (this.dir != "in" && itemShelfCurrAmounts.length > 0) ||
                      this.dir == "in"
                    ) {
                      let enoughAmount =
                        itemShelfCurrAmounts[0] >= itemLineToAdd.amount;
                      if (
                        (this.dir != "in" && enoughAmount) ||
                        this.dir == "in"
                      ) {
                        let destQntBefore = 0;
                        if (this.dir == "shelfChange") {
                          itemLineToAdd.destShelf =
                            itemLineToAdd.destShelf.toUpperCase();
                          this.inventoryService
                            .checkIfShelfExist(
                              itemLineToAdd.destShelf,
                              this.curentWhareHouseId
                            )
                            .subscribe(async (destShelfRes) => {
                              if (destShelfRes.ShelfId) {
                                itemLineToAdd.destShelfId =
                                  destShelfRes.ShelfId;
                                if (destShelfRes.stock.length > 0) {
                                  destShelfRes.stock.map((shl) => {
                                    if (shl.item == itemLineToAdd.itemNumber) {
                                      destQntBefore = shl.amount;
                                    }
                                  });
                                }
                                this.addObjToList(
                                  itemLineToAdd,
                                  itemRes[0],
                                  shelfRes,
                                  itemShelfCurrAmounts[0],
                                  destQntBefore
                                );
                              } else {
                                this.toastSrv.error(
                                  "אין מדף כזה במחסן: " +
                                    this.curentWhareHouseName
                                );
                                this.loadingToTable = false;
                              }
                            });
                        } else {
                          this.addObjToList(
                            itemLineToAdd,
                            itemRes[0],
                            shelfRes,
                            itemShelfCurrAmounts[0],
                            null
                          );
                        }
                      } else {
                        this.toastSrv.error(
                          "אין מספיק כמות על המדף!\n  כמות נוכחית על המדף: " +
                            shelfRes.stock[0].amount
                        );
                        this.loadingToTable = false;
                      }
                    } else {
                      this.toastSrv.error(
                        "פריט: " +
                          itemLineToAdd.itemNumber +
                          "\n לא נמצא על מדף: " +
                          position
                      );
                      this.loadingToTable = false;
                    }
                  } else {
                    this.toastSrv.error("אין מדף כזה במחסן: " + position);
                    this.loadingToTable = false;
                  }
                });
            } else {
              this.toastSrv.error(
                "אין פריט כזה במלאי " + itemLineToAdd.itemNumber + " "
              );
              this.loadingToTable = false;
            }
          });
      } else {
        this.toastSrv.error("חסרה כמות");
        this.loadingToTable = false;
      }
    } else {
      this.toastSrv.error("מספר פריט לא קיים");
      this.loadingToTable = false;
    }
  }

  addObjToList(
    itemLine,
    itemRes,
    shelfRes,
    originShelfQntBefore,
    destShelfQntBefore
  ) {
    if (!(this.inventoryUpdateList.length == 1 && this.dir == "shelfChange")) {
      let itemNumExistInList = false;
      this.inventoryUpdateList.map((i) => {
        if (i.item == itemLine.itemNumber && i.position == itemLine.position)
          itemNumExistInList = true;
      });

      //we have an issue processing stock change with same itemShelfs in the same sended list
      if (!itemNumExistInList) {
        let obj = {
          amount: itemLine.amount,
          item: itemLine.itemNumber,
          supplierItemNumber: "",
          supplierName: "",
          itemName: itemRes.componentName,
          shell_id_in_whareHouse: shelfRes.ShelfId,
          position: shelfRes.position,
          inventoryReqNum: "", //INVENTORY RERQUEST ID
          arrivalDate: null, // for components stock
          expirationDate: null, // for products stock
          productionDate: null, // for products stock
          barcode: "",
          componentType: itemRes.componentType,
          itemType: itemRes.itemType,
          relatedOrderNum: itemLine.relatedOrder,
          deliveryNoteNum: itemLine.deliveryNote,
          actionType: this.dir,
          WH_originId: this.curentWhareHouseId,
          WH_originName: this.curentWhareHouseName,
          shell_id_in_whareHouse_Dest:
            this.dir == "production" ? "5eeb38b616fd280900c4e922" : "",
          shell_position_in_whareHouse_Dest:
            this.dir == "production" ? "FLOOR" : "",
          WH_destId:
            this.dir == "production"
              ? "5e9c132ce6f70d12984343d0"
              : this.curentWhareHouseId,
          WH_destName:
            this.dir == "production" ? "Filling" : this.curentWhareHouseName,
          originShelfQntBefore: originShelfQntBefore,
          destShelfQntBefore: originShelfQntBefore,
          userName:
            this.authService.loggedInUser.firstName +
            " " +
            this.authService.loggedInUser.lastName,
        };
        if (this.dir != "in") obj.amount *= -1;
        if (itemLine.reqNum) obj.inventoryReqNum = itemLine.reqNum;
        if (typeof itemLine.arrivalDate == "string")
          obj.arrivalDate = itemLine.arrivalDate;
        if (itemRes.itemType == "product") {
          obj.expirationDate = itemRes.expirationDate;
          obj.productionDate = itemRes.productionDate;
        }
        if (itemRes.itemType == "component") {
          obj.supplierItemNumber = itemRes.suplierN;
          obj.supplierName = itemRes.suplierName;
        }
        if (this.dir == "shelfChange") {
          obj.shell_id_in_whareHouse_Dest = itemLine.destShelfId;
          obj.shell_position_in_whareHouse_Dest =
            itemLine.destShelf.toUpperCase();
        }

        //נסיון
        // if(this.dir == "production") obj.actionType = "shelfChange"

        this.inventoryUpdateList.push(obj);

        if (this.dir == "production" || this.dir == "out" || this.dir == "in") {
          let tempObj = Object.assign({}, obj);
          tempObj.amount = Math.abs(tempObj.amount);
          this.listToPrint.push(tempObj);
          this.printAgain.push(tempObj);
          // this.listToPrint[this.listToPrint.length-1].qnt=  Math.abs(this.listToPrint[this.listToPrint.length-1].amount);
        }
        this.loadingToTable = false;
        this.itemLine.reset();
        this.multiLinesArr;
        this.multiLinesArr.map((line, key) => {
          if (
            line.itemNumber == obj.item &&
            line.position == obj.position &&
            line.qnt == Math.abs(obj.amount)
          ) {
            this.multiLinesArr.splice(key, 1);
            if (this.multiLinesArr.length == 0) {
              this.multiLinesArr;
            }
          }
        });
      } else {
        alert(
          " מספר פריט " +
            itemLine.itemNumber +
            " במדף " +
            itemLine.position +
            "\nכבר קיים ברשימה"
        );
      }
    } else {
      alert("יש לשלוח קודם את שינוי המדף ברשימה");
      this.loadingToTable = false;
    }
  }

  open(packMaterialForm) {
    this.modalService
      .open(packMaterialForm, {
        size: "lg",
        ariaLabelledBy: "modal-basic-title",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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

  searchItemsOnShelf(event) {
    this.ItemsOnShelf = [];
    // let shelf = event.target.value;
    let shelfPosiotion = this.shelfSearch.nativeElement.value
      .toUpperCase()
      .trim();

    let whId = this.curentWhareHouseId;
    let stockType;
    if (
      this.curentWhareHouseName == "Rosh HaAyin" ||
      this.curentWhareHouseName == "Kasem"
    )
      stockType = "component";
    if (this.curentWhareHouseName == "Rosh HaAyin products")
      stockType = "product";
    if (shelfPosiotion != "") {
      this.inventoryService
        .getItemsOnShelf(shelfPosiotion, whId, stockType)
        .subscribe((res) => {
          if (res == "shelfMissing") {
            this.toastSrv.error("מדף לא קיים במחסן");
          } else if (res == "noItemsOnShelf") {
            this.toastSrv.error("אין פריטים על המדף");
          } else {
            this.ItemsOnShelf = res;
            console.log(this.ItemsOnShelf);
          }
        });
    } else {
      this.toastSrv.error("נא להכניס מדף");
    }
  }

  addNewShelf(position) {
    //to upper case and remove spaces
    position = position.toUpperCase();
    position = position.trim();

    if (this.whareHouseId == "") {
      this.toastSrv.error("לא נבחר מחסן");
    } else if (position == "") {
      this.toastSrv.error("לא הוכנס מיקום מדף חדש");
    } else {
      if (confirm(" הקמת מדף חדש " + position)) {
        let shellObj = { whareHouseId: this.whareHouseId, position: position };
        this.inventoryService.addNewShelf(shellObj).subscribe((res) => {
          console.log(res);
          if (res.position) {
            this.shelfs.push(res);
            this.toastSrv.success("הוקם מדף חדש בהצלחה!");
          } else {
            this.toastSrv.error("לא הוכנס מיקום מדף חדש");
          }
        });
      }
    }
  }

  initTabByName(name) {
    this.dirSet("stkManagment", name);
  }
}
