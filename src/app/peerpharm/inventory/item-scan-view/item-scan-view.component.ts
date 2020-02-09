import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-material-scan-view',
  templateUrl: './item-scan-view.component.html',
  styleUrls: ['./item-scan-view.component.css']
})
export class ItemScanViewComponent implements OnInit {
  components: any[];
  newAllocationAmount: Number;
  itemIdForAllocation: String;
  EditRowId: any = "";
  orderItems: any;
  procurementInputEvent: any;
  stockType: String = "component";
  newItem: String = '';
  newItemBtn: String = 'new';
  today: Date = new Date()
  //var's to edit itemshelf in allowed wh for user
  user: UserInfo;
  whareHouses: Array<any>;
  curentWhareHouseId: String;
  curentWhareHouseName: String;
  relatedOrderNum: String = '';
  //adding Stock amounts
  ordersAllocatedAmount:any[];
  newItemShelfQnt: number;
  newItemShelfBatchNumber: string = '';
  newItemShelfArrivalDate: number;
  newItemShelfPosition: String;
  newItemShelfWH: String;
  cmptTypeList: Array<any>;
  cmptCategoryList: Array<any>;
  emptyFilterArr: Boolean = true;
  currItemShelfs: Array<any>;
  updateStockItem: Boolean = false;
  stockAdmin: Boolean = false;
  destShelfId: String;
  destShelf: String;
  destShelfQntBefore: Number = 0;
  originShelfQntBefore: Number = 0;
  amountChangeDir: String;
  sehlfChangeNavBtnColor: String = "";
  amountChangeNavBtnColor: String = "#1affa3";
  ItemBatchArr: Array<any>;
  filterVal: String = '';
  currModalImgSrc: String = '';
  productToFind: String = '';
  materialToFind: String = "";
  productResponse: any = {};
  linkDownload:String = "";
  arrivalDateExpired = true; 
  loadingExcel: Boolean = false;

  itemAmountsData: any[];
  itemAmountsWh: any[]; 

  resCmpt: any = {
    componentN: '',
    componentName: '',
    componentNs: '',
    suplierN: '',
    suplierName: '',
    componentType: '',
    componentCategory: '',
    img: '',
    importFrom: '',
    lastModified: '',
    minimumStock: '',
    needPrint: '',
    packageType: '',
    packageWeight: '',
    remarks: '',
    jumpRemark:'',
    componentItems: [],
    input_actualMlCapacity: 0,
    alternativeComponent:'',
    alternativeSupplier:[],

  }


  params:String;
  currMaterial: any={ // MaterialArrivalForm- server side schema
      arrivalDate: Date,
      user: String,
      internalNumber: String,
      materialName: String,
      lotNumber: String,
      expiryDate: Date,
      productionDate: Date,
      supplierName: String,
      supplierNumber: String,
      analysisApproval: Boolean,
      totalQnt: Number,
      mesureType: String,
      remarks: String,
      cmxOrderN: String,
      packageType: String,
      packageQnt: Number,
      unitsInPack: Number,
      warehouse: String,
      position: String,
      barcode: String,
      lastUpdate:Date,
      lastUpdateUser:String,
  
  };
  constructor(    private authService: AuthService,private toastSrv: ToastrService,private activatedRoute:ActivatedRoute , private inventoryService:InventoryService , ) { }

  ngOnInit() {
    this.getUserAllowedWH();
      this.activatedRoute.queryParams.subscribe(params => {
        if(params.id){
             
            this.resCmpt.componentN=params.id;
            this.inventoryService.getAmountOnShelfs(this.resCmpt.componentN).subscribe(async res => {
              this.itemAmountsData = res.data;
              this.itemAmountsWh = res.whList;
      
            }); 
         
        }
      });

    
  }



  searchItemShelfs() {
    if (this.newItemShelfWH != '') {
      this.inventoryService.getShelfListForItemInWhareHouse(this.resCmpt.componentN, this.newItemShelfWH).subscribe(async res => {
        if (res.length > 0) {
          this.currItemShelfs = res;

        } else {
          this.currItemShelfs = [];
          this.currItemShelfs.push("NO SHELFS WITH ITEM # " + this.resCmpt.componentN);
        }
      });
    } else {
      this.toastSrv.error("Choose Wharhouse");
    }
  }
  
 


  

  dirSet(direction) {
    if (direction == "shelfChange") {
      this.amountChangeDir = 'shelfChange';
      this.sehlfChangeNavBtnColor = "#1affa3";
      this.amountChangeNavBtnColor = "";
    } else {
      this.amountChangeDir = '';
      this.sehlfChangeNavBtnColor = "";
      this.amountChangeNavBtnColor = "#1affa3";
    }
  }


  getUserAllowedWH() {
    this.inventoryService.getWhareHousesList().subscribe(res => {
      if (res) {
        let displayAllowedWH = [];
        for (const wh of res) {
          if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
            displayAllowedWH.push(wh);
          }
        }
        if (this.authService.loggedInUser.authorization) {
          if (this.authService.loggedInUser.authorization.includes("updateStockItem")) {
            this.updateStockItem = true;
          }
          if (this.authService.loggedInUser.authorization.includes("stockAdmin")) {
            this.stockAdmin = true;
          }
        }

        this.whareHouses = displayAllowedWH;
        this.curentWhareHouseId = displayAllowedWH[0]._id;
        this.curentWhareHouseName = displayAllowedWH[0].name;
        if (this.curentWhareHouseName.includes('product')) {
          // this.setType("product");
          this.stockType = "product";
        } else {
          this.stockType = "component";
        }

        // this.getAllComponentsByType();

      }
      console.log(res);

    });
  }

  
  async updateItemStockShelfChange(direction) {
    // this.newItemShelfPosition
    // this.newItemShelfQnt
    // this.destShelf
    this.destShelf = this.destShelf.toLocaleUpperCase();
    //destination shelf
    await this.inventoryService.checkIfShelfExist(this.destShelf, this.newItemShelfWH).subscribe(async shelfRes => {
      if (shelfRes.ShelfId) {
        this.destShelfId = shelfRes.ShelfId;
        this.destShelfQntBefore = 0;
        if (shelfRes.stock.length > 0) {
          shelfRes.stock.map(shl => {
            if (shl.item == this.resCmpt.componentN) {

              this.destShelfQntBefore = shl.amount;
            }
          });
        }

        this.updateItemStock(direction);
      } else {
        this.toastSrv.error("מדף יעד לא קיים")
      }

    });
    /* we need to send two objects with negitive and positive amounts
    both with dir="shelfchange",
   and make sure server side will deal with this dir and update movments
  
    */
  }

  async updateItemStock(direction) {

    //check enough amount for "out"
    this.newItemShelfPosition = this.newItemShelfPosition.toUpperCase().trim();
    var shelfExsit = false;
    let itemShelfCurrAmounts = []
    await this.currItemShelfs.forEach(x => {
      if (x.position == this.newItemShelfPosition) {
        itemShelfCurrAmounts.push(x.amount);
        shelfExsit = true;
      };
    });
    await this.inventoryService.checkIfShelfExist(this.newItemShelfPosition, this.newItemShelfWH).subscribe(async shelfRes => {

      if (shelfRes.ShelfId) {
        if (shelfRes.stock.length > 0) {
          let temp = shelfRes.stock.map(shl => shl.item == this.resCmpt.componentN);
          this.originShelfQntBefore = temp[0].amount;

        }
        shelfExsit = true;

        if ((direction != "in" && itemShelfCurrAmounts.length > 0) || direction == "in") {
          let enoughAmount = (itemShelfCurrAmounts[0] >= this.newItemShelfQnt);
          if ((direction != "in" && enoughAmount) || direction == "in") {

            if (direction != "in") this.newItemShelfQnt *= (-1);

            if (this.newItemShelfWH != "") {
              let relatedOrderNum = this.relatedOrderNum.toUpperCase();
              let ObjToUpdate = [{
                amount: this.newItemShelfQnt,
                item: this.resCmpt.componentN,
                itemName: this.resCmpt.componentName,
                shell_id_in_whareHouse: shelfRes.ShelfId,
                position: this.newItemShelfPosition,
                arrivalDate: null, // only for "in"
                expirationDate: null, // for products stock
                productionDate: null, // for products stock
                barcode: "",
                itemType: this.stockType,
                // relatedOrderNum:itemLine.relatedOrder,
                // deliveryNoteNum:itemLine.deliveryNote,
                actionType: direction,
                WH_originId: this.curentWhareHouseId,
                WH_originName: this.curentWhareHouseName,
                shell_id_in_whareHouse_Dest: this.destShelfId,
                shell_position_in_whareHouse_Dest: this.destShelf,
                WH_destId: this.curentWhareHouseId,
                WH_destName: this.curentWhareHouseName,
                batchNumber: '',
                relatedOrderNum: relatedOrderNum,
                originShelfQntBefore: this.originShelfQntBefore,
                destShelfQntBefore: this.destShelfQntBefore,
                userName: this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName,
              }];

              if (direction == "in") {
                ObjToUpdate[0].arrivalDate = new Date()
              };
              if (direction != "in") {

                // ObjToUpdate[0].amount=ObjToUpdate[0].amount*(-1);
              };
              //  if(itemLine.reqNum) ObjToUpdate.inventoryReqNum=itemLine.reqNum;
              //  if(typeof(itemLine.arrivalDate)=='string') ObjToUpdate.arrivalDate=itemLine.arrivalDate;
              if (this.stockType == "product") {
                ObjToUpdate[0].batchNumber = this.newItemShelfBatchNumber;
                if (this.newItemShelfBatchNumber != "") {
                  let itemBatch = this.ItemBatchArr.filter(b => b.batchNumber == this.newItemShelfBatchNumber);
                  //fix date format 
                  let dateArr = itemBatch[0].expration.split('/');
                  let dateArrToJoin = [];
                  dateArrToJoin[0] = dateArr[2];
                  dateArrToJoin[1] = dateArr[1];
                  dateArrToJoin[2] = dateArr[0];
                  let dateToUpdate = dateArrToJoin.join('-');

                  let expDate = new Date(itemBatch[0].expration);
                  ObjToUpdate[0].expirationDate = expDate;
                } else {
                  ObjToUpdate[0].expirationDate = null;
                }

                //  ObjToUpdate.expirationDate=itemRes.expirationDate ;ObjToUpdate.productionDate=itemRes.productionDate
              };
              if (direction == "shelfChange") {
                ObjToUpdate[0].shell_id_in_whareHouse_Dest = this.destShelfId;
                ObjToUpdate[0].shell_position_in_whareHouse_Dest = this.destShelf;
              }


              //  READY!

              await this.inventoryService.updateInventoryChangesTest(ObjToUpdate, this.stockType).subscribe(res => {
                console.log('ObjToUpdate', ObjToUpdate);
                if (res == "all updated") {
                  this.toastSrv.success("Changes Saved");

                  this.inventoryService.getAmountOnShelfs(this.resCmpt.componentN).subscribe(async res => {
                    this.itemAmountsData = res.data;
                    this.itemAmountsWh = res.whList;

                  });

                  this.inventoryService.deleteZeroStockAmounts().subscribe(x => {
                    console.log(x.n + " items with amount=0 deleted");
                  });
                  let actionLogObj = {
                    dateAndTime: new Date(),
                    logs: ObjToUpdate,
                    userName: this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName,
                    movementType: ObjToUpdate[0].actionType,
                  }

                  this.inventoryService.addToWHActionLogs(actionLogObj).subscribe(res => {
                    this.toastSrv.success("פעולות מחסנאי נשמרו");
                  });
                  this.components.forEach(stkItem => { if (stkItem.componentN == ObjToUpdate[0].item) { stkItem.amount = stkItem.amount + ObjToUpdate[0].amount } });
                  this.newItemShelfQnt = null;
                  this.destShelf = "";
                  this.destShelfId = "";
                  this.newItemShelfPosition = '';
                  this.originShelfQntBefore = 0;
                  this.destShelfQntBefore = 0;
                } else {
                  this.toastSrv.error("Error - Changes not saved");
                }
              });
            } else {
              this.toastSrv.error("Choose warehouse");
            }
          } else {
            this.toastSrv.error("Not enough stock on shelf!\n Item Number " + this.resCmpt.componentN + "\n Amount on shelf: " + itemShelfCurrAmounts[0]);
          }
        } else {
          this.toastSrv.error("No Item Amounts On Shelf: " + this.newItemShelfPosition);
        }
      } else {
        this.toastSrv.error("No Such Shelf: " + this.newItemShelfPosition);
      }
    });

  }


}






