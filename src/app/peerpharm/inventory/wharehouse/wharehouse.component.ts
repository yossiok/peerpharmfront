import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Integer } from 'aws-sdk/clients/pi';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import * as moment from 'moment';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { map } from 'rxjs-compat/operator/map';


@Component({
  selector: 'app-wharehouse',
  templateUrl: './wharehouse.component.html',
  styleUrls: ['./wharehouse.component.css']
})
export class WharehouseComponent implements OnInit {

// new ----------------------
newReqNumber:number;
inventoryReqForm: FormGroup;
itemLine: FormGroup;
inventoryUpdateList:Array<any>=[];// to show added items to request
itemNumber:String='';
amount:Number;
relatedOrder:String='';
today:Date=new Date;

currItemShelfs:Array<any>;
multiInputLines:Boolean=false;
multiLinesArr:Array<any>;
//  -------------------------
StkMngNavBtnColor:String ="#1affa3";
WhMngNavBtnColor:String ="";
ItemsOnShelf:Array<any>;



  @ViewChild('container')
  @ViewChild('lineqnt')
  @ViewChild('wh') wh: ElementRef;
  @ViewChild('shelfSearch') shelfSearch: ElementRef;

  private container: ElementRef;
  mainDivArr: any = [];
  whareHouses: any = [];
  whareHouseId: string = ""; //wharehouse id for shelf update
  curentWhareHouseId: string = ""  //wharehouse id for qty update
  curentWhareHouseName: string = ""  //wharehouse id to show
  changeWh: boolean = false;
  shelfs: any = [];
  shelfsCopy: any = [];
  dir: string = "in";
  screen: String = "stkManagment";
  response = { color: '', body: '' }
  i: Integer = 0;
  currTab: string = '';
  loadingToTable:boolean=false;
  editWharehouses: Boolean=false;
  constructor(private fb: FormBuilder,private renderer: Renderer2, private authService: AuthService, private inventoryService: InventoryService , private inventoryReqService: InventoryRequestService ,private toastSrv: ToastrService, ) { 

// new ----------------------
    this.itemLine = fb.group({
      itemNumber: ['', Validators.required],
      amount: [0, Validators.required],
      position: ['', Validators.required],
      relatedOrder: [''],
      arrivalDate: [Date],
      destShelf:[''],
      destShelfId:[''],
      deliveryNote:[''],
    });
//  -------------------------



  }

  async ngOnInit() {
    // let todayStr=moment(this.today).format("YYYY-MM-DD");
    // this.itemLine.controls.arrivalDate.setValue(todayStr);
    await this.inventoryService.getWhareHousesList().subscribe( res => {
      let displayAllowedWH = [];
        for (const wh of res) {
          if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
            displayAllowedWH.push(wh);
          }
        }
        this.whareHouses = displayAllowedWH;
        this.curentWhareHouseId = displayAllowedWH[0]._id;
        this.curentWhareHouseName = displayAllowedWH[0].name;
        
        if (this.authService.loggedInUser.authorization) {
          if (this.authService.loggedInUser.authorization.includes("system")) {
            this.editWharehouses=true;
          }
        }

        })
  }


  dirSet(action, direction) {
    let dirChange= confirm("מעבר למסך אחר יאפס את הרשימה")
    if(dirChange){
      if(direction!="production") this.multiInputLines=false;
      this.inventoryUpdateList=[] //reseting list before direction change
      this.multiLinesArr=[]
      this.currItemShelfs=[]
      this.itemLine.reset();
      this.screen = action;
      if (action == 'whManagment') {
        this.WhMngNavBtnColor="#1affa3";
        this.StkMngNavBtnColor="";
  
        this.dir = 'managment';
        const childElements = this.container.nativeElement.children;
          for (let child of childElements) {
          const elemnts = child.children;
          for (let elm of elemnts) {
            const mnts = elm.children;
            for (let e of mnts) {
              console.log(e.getAttribute("name"))
              if (e.getAttribute("name")) {
                if (direction == "shellChange" && e.getAttribute("name") == "newShelfName") {
                  e.style.display = 'inline';
                  e.className = "dataInput";
                }
                else if (direction == "production" && e.getAttribute("name") == "newDemandId") {
                  e.style.display = 'inline';
                  e.className = "dataInput";
                  // e.style.visibility = "hidden";
                }
                else {
                  e.style.display = 'none';
                  e.className = "no";
                  e.value = "";
                }
              }
            }
          }
        }
      } else if (action == 'stkManagment') {
        //change active navbar colors 
        this.WhMngNavBtnColor="";
        this.StkMngNavBtnColor="#1affa3";
        this.dir = direction;
        // empty unrelevant fields if changing direction
        if(this.dir!="in")   this.itemLine.controls.arrivalDate.setValue(null);
        if(this.dir=="in")   this.itemLine.controls.relatedOrder.setValue("");
        if(this.dir=="production")   this.multiInputLines=true;
      }
  
    }

  }

  getFormData() {
    let div = this.container.nativeElement;
    this.mainDivArr = [];
    let divArr = [];
    //  for (let innerDiv of div.getElementsByTagName('input')) {
    for (let innerDiv of div.getElementsByClassName('dataInput')) {

      console.log(innerDiv.value);
      if (innerDiv.value.length > 0) {
        divArr.push(innerDiv.value);
      }
      else {
        // temp fix
        if(this.dir!="production" && this.mainDivArr.length==0){
          divArr.splice(0,1);
        }
        let itemData = {
          item: divArr[0],
          shell: divArr[1],
          amount: divArr[2],
          newShelf: "",
          demandOrderId: "",
          actionType: this.dir,
          whareHouse: this.curentWhareHouseId,
        }
        
        if (this.dir == "shellChange") { // if it's for shellChange
          //   Object.assign({newShelf:divArr[3]}, itemData);
          itemData.newShelf = divArr[3];
        }
        if (this.dir == "production") { // if it's for production - add demandOrderId for server update
          // Object.assign({demandOrderId:divArr[3]}, itemData);
          itemData.demandOrderId = divArr[3];
        }
        this.mainDivArr.push(itemData);
            divArr = [];
      }
    }
    console.log(this.mainDivArr);
    this.inventoryService.updateInventoryChanges(this.mainDivArr).subscribe(res => {
      console.log("updateInventoryChanges res: "+res);
        if (res != null) {
          
      }else{
        ;
      }
    });
  }

  resetForm() {
    const childElements = this.container.nativeElement.children;
    for (let child of childElements) {
      this.renderer.removeChild(this.container.nativeElement, child);
    }
  }
  getShelfsList(whname) {
    let i = this.whareHouses.findIndex(wh => wh.name == whname);
    this.whareHouseId = this.whareHouses[i]._id;
    this.shelfs = [];
    this.inventoryService.getWhareHouseShelfList(this.whareHouseId).subscribe(res => {
      this.shelfs = res;
      this.shelfsCopy = res;
      console.log(this.whareHouses);
    })
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
    this.inventoryService.addNewWhareHouse(whareHouseName).subscribe(res => {
      console.log(res)
      if (res.name) {
        this.whareHouses.push(res)
      }
    })
  }

  setWhareHouse(whname) {
    let i = this.whareHouses.findIndex(wh => wh.name == whname);
    this.curentWhareHouseId = this.whareHouses[i]._id;
    this.curentWhareHouseName = this.whareHouses[i].name;
    // this.changeWh = false;
  }

  // changeCurentWh() {
  //   this.changeWh = true;
  // }

  searchShelf(shelf) {
    shelf = shelf.toUpperCase();
    console.log(shelf)
    if (shelf == "") {
      this.shelfs = this.shelfsCopy.slice();
    }
    else {
      this.shelfs = this.shelfs.filter(x => x.position.toLowerCase().includes(shelf.toLowerCase()));
    }
  }


  getItemWhShelfsList(itemNumber, shelfsDiv) {
    let a = this.inventoryService;
    let b = this.curentWhareHouseId;
    return new Promise(function (resolve, reject) {
      a.getShelfListForItemInWhareHouse(itemNumber, b).subscribe(res => {
        if (res.length > 0) {
          console.log(res)
          resolve(res);
        } else resolve([])
      });
    });
  }

  // async getChildArr(event) {
  //   await this.dirSet('stkManagment', 'production');
    
  //   console.log(event)
  //   if (event.length > 0) {
  //     this.dir = "production";
  //   }
  //   alert(event);
  //   event.forEach(item => {
  //     this.appendItems(item.number, item.orderDemandId)
  //   });
  // }













// ********************************************************************************************************************
// NEW - insted of all the rendering
// ********************************************************************************************************************
  async searchItemShelfs(ev){
    if(!this.multiInputLines && ev!=""){
      await this.inventoryService.getShelfListForItemInWhareHouse(ev.target.value, this.curentWhareHouseId).subscribe(async res => {
        if(res.length>0){
          this.currItemShelfs=res;
          debugger
        }else{
          this.currItemShelfs=[];
          this.currItemShelfs.push("NO SHELFS WITH ITEM # "+ev.target.value);
        }
      });  
    }
    else if(this.multiInputLines){
      this.multiLinesArr.forEach(async element => {
        element.currItemShelfs=[];
        await this.inventoryService.getShelfListForItemInWhareHouse(element.itemNumber, this.curentWhareHouseId).subscribe(async res => {
          if(res.length>0){
            element.currItemShelfs=res;
          }else{
            element.currItemShelfs=[];
            element.currItemShelfs.push("NO SHELFS WITH ITEM # "+element.itemNumber);
          }
        });
      });
    }
    debugger
 }



 loadShelfToInput(position, ev){
  if(!this.multiInputLines){
    if(!position.includes("NO SHELFS")){
      this.itemLine.controls.position.setValue(position);
    }  
  }else if(this.multiInputLines){
    this.multiLinesArr.forEach((x, index)=> {
      if(!position.includes("NO SHELFS")){
        if(index==ev.target.dataset.lineid)  {
          debugger
          x.position=position;
          x.requsetedQnt=x.amount;
          // x.amount=0;
        };
      }
    });

  }  
}



 async getChildArr(arrSent) {
  this.multiInputLines=true;
  await this.dirSet('stkManagment', 'production');
  
  console.log(event)
  if (arrSent.length > 0) {
    this.dir = "production";  
    await arrSent.forEach(i=>{
      i.qnt=0;
      // i.currInpQnt=0;
      // amount: 500
      i.amount=i.amount;
      i.qntSupplied=i.qntSupplied
      // isSelected: true
      // itemName: "Screw bottle NY 150ml transperent 24/415"
      // itemNumber: "12185"
      // qntSupplied: 50
      // relatedOrder: "1938"
      // reqNum: 1
      i.position='';  
      // i.requsetedQnt=i.amount;
      i.currItemShelfs=[];
      i.currItemShelfs.push({position:""});
    });

  }
  let loadItems=confirm("טעינת פריטים מבקשת מלאי");
  if(loadItems){
    this.multiLinesArr=arrSent;
    arrSent.forEach(itemFromInvReq => {
      this.searchItemShelfs("");
    });  
  }
}

async getAllGeneralDemands(){
  await this.inventoryReqService.getOpenInventoryRequestsList().subscribe(res=>{
      console.log(res);
      debugger
      //res= allorders from itemsDemands table
      res.forEach(invRequest => {
        debugger
       invRequest.reqList.map(item => {
     //   item.cmptN="0";
          item.isSelected=false;
          //Object.assign({ isSelected: false }, item);
        })
      });
      debugger
      this.getChildArr(res);
  })

}


deleteLine(itemFromInvReq,index,ev){
  this.multiLinesArr.splice(index, 1);
  if(this.multiLinesArr.length==0) this.multiInputLines=false;
}

  deleteRow(index){
    this.inventoryUpdateList.splice(index, 1);
  }

  cleanList(){
    let cleanConfirm=confirm("מחיקת כל הפריטים מהרשימה");
    if(cleanConfirm) this.inventoryUpdateList=[];
  }

  async sendList(){
    let ObjToUpdate;
    let sendConfirm=confirm("עדכון שינויים במלאי");
    if(sendConfirm && this.inventoryUpdateList.length>0) {
      debugger
      await this.inventoryService.updateInventoryChangesTest(this.inventoryUpdateList,this.inventoryUpdateList[0].itemType).subscribe(res => {
        // res = [itemNumber,itemNumber,itemNumber...]
        if(res=="all updated"){
          this.toastSrv.success("שינויים בוצעו בהצלחה");
          let actionLogObj={
            dateAndTime: new Date(),
            logs: this.inventoryUpdateList,
            userName: this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName,
            movementType: this.dir,
          }

          debugger
          this.inventoryService.addToWHActionLogs(actionLogObj).subscribe(res => {
            this.toastSrv.success("פעולות מחסנאי נשמרו");
          });
          this.inventoryService.deleteZeroStockAmounts().subscribe(x=> {
            console.log(x.n+" items with amount=0 deleted");
          });
          if(this.dir!='shelfChange') this.itemLine.reset();
          this.inventoryUpdateList=[];
        }else{
          this.toastSrv.error("שגיאה- לא התבצע עדכון");
        }
      });
    }
  }

  getItemLineQnt(i,ev){
    this.multiLinesArr[i].amount=ev.target.value;
    debugger
  }

  async checkLineValidation(itemLine,index,ev:any, lineqnt){
    let stockType;
    if(this.curentWhareHouseName == "Rosh HaAyin" || this.curentWhareHouseName == "Kasem")  stockType="component";
    if(this.curentWhareHouseName == "Rosh HaAyin products")  stockType="product";
    
    var itemLineToAdd= JSON.parse(JSON.stringify(itemLine)) 
    if(this.multiInputLines) itemLineToAdd.amount=itemLineToAdd.qnt;

    this.loadingToTable=true;
    var position;
    var currItemShelfs;

    // multiLineQntInput
    if(this.multiInputLines){
      itemLineToAdd.amount=itemLineToAdd.qnt;
      currItemShelfs=itemLineToAdd.currItemShelfs;

    }else{
      currItemShelfs=this.currItemShelfs;
      // position=itemLineToAdd.controls.position.value.toUpperCase();
    }

    if( (itemLineToAdd.itemNumber!=""  && this.dir=='in') || (itemLineToAdd.itemNumber!=""  && currItemShelfs[0]._id && this.dir!='in')){
      //VALID AMOUT
      position=itemLineToAdd.position.toUpperCase().trim();
      debugger
      if(((this.dir!='in'  && parseInt(currItemShelfs[0].amount)!=NaN  && currItemShelfs[0].amount!= undefined ) || (this.dir=='in' && itemLine.amount!="")) ){
        await this.inventoryService.getCmptByNumber(itemLineToAdd.itemNumber , stockType).subscribe(async itemRes => {
          if( itemRes.length>0){

            this.inventoryService.checkIfShelfExist(position,this.curentWhareHouseId).subscribe(async shelfRes=>{

              if(shelfRes.ShelfId){
                
                var itemShelfCurrAmounts =[]
                await currItemShelfs.forEach(x=>{
                  if(x.shell_id_in_whareHouse==shelfRes.ShelfId) {
                    itemShelfCurrAmounts.push(x.amount);
                  }
                });
                if((this.dir!="in" && itemShelfCurrAmounts.length>0) || this.dir=="in"){

                  let enoughAmount =(itemShelfCurrAmounts[0] >= itemLineToAdd.amount);
                  if((this.dir!="in" && enoughAmount) || this.dir=="in"){
                    let destQntBefore=0;
                    if(this.dir=='shelfChange'){
                      itemLineToAdd.destShelf= itemLineToAdd.destShelf.toUpperCase();
                      this.inventoryService.checkIfShelfExist(itemLineToAdd.destShelf,this.curentWhareHouseId).subscribe(async destShelfRes=>{
                        debugger
                        if(destShelfRes.ShelfId){
                          itemLineToAdd.destShelfId=destShelfRes.ShelfId;
                          if(destShelfRes.stock.length>0){
                            destQntBefore=destShelfRes.stock.filter(shl=>shl.item==itemLineToAdd.itemNumber)[0].amount;
                          }
                          this.addObjToList(itemLineToAdd,itemRes[0],shelfRes , itemShelfCurrAmounts[0], destQntBefore);
                        }else{
                          this.toastSrv.error("אין מדף כזה במחסן: "+this.curentWhareHouseName);
                          this.loadingToTable=false;
                        }
                      });
                    } else{
                      this.addObjToList(itemLineToAdd,itemRes[0],shelfRes , itemShelfCurrAmounts[0], null);
                    }
                  }else{
                    this.toastSrv.error("אין מספיק כמות על המדף!\n  כמות נוכחית על המדף: "+shelfRes.stock[0].amount );
                    this.loadingToTable=false;
                  }  
                }else{
                  this.toastSrv.error("פריט: "+itemLineToAdd.itemNumber+"\n לא נמצא על מדף: "+position);
                  this.loadingToTable=false;
                }
              }else{
                debugger
                this.toastSrv.error("אין מדף כזה במחסן: "+position);
                this.loadingToTable=false;
              }  
            });
          }else{
            this.toastSrv.error("אין פריט כזה במלאי "+itemLineToAdd.itemNumber +" ");
            this.loadingToTable=false;
          }
        });
      }else{
        this.toastSrv.error("חסרה כמות");
        this.loadingToTable=false;
      }
    }else{
      this.toastSrv.error("מספר פריט לא קיים");
      this.loadingToTable=false;
    }
  }




addObjToList(itemLine,itemRes,shelfRes , originShelfQntBefore, destShelfQntBefore){

if( !(this.inventoryUpdateList.length==1 && this.dir=="shelfChange")){

  let itemNumExistInList=false;
  this.inventoryUpdateList.map(i=> {if(i.item == itemLine.itemNumber && i.position == itemLine.position )  itemNumExistInList=true });

  //we have an issue processing stock change with same itemShelfs in the same sended list
  if(!itemNumExistInList){
    let obj={ 
      amount: itemLine.amount,
      item: itemLine.itemNumber,
      itemName: itemRes.componentName,
      shell_id_in_whareHouse: shelfRes.ShelfId,
      position:shelfRes.position,
      inventoryReqNum:"",//INVENTORY RERQUEST ID  
      arrivalDate:null, // for components stock
      expirationDate:null, // for products stock
      productionDate:null, // for products stock
      barcode:"",
      itemType:itemRes.itemType,
      relatedOrderNum:itemLine.relatedOrder,
      deliveryNoteNum:itemLine.deliveryNote,  
      actionType:this.dir,
      WH_originId:this.curentWhareHouseId,
      WH_originName:this.curentWhareHouseName,
      shell_id_in_whareHouse_Dest:'',
      shell_position_in_whareHouse_Dest:'',
      WH_destId:this.curentWhareHouseId,
      WH_destName:this.curentWhareHouseName,
      originShelfQntBefore: originShelfQntBefore,
      destShelfQntBefore: originShelfQntBefore,
      userName: this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName,
   }
   if(this.dir!="in") obj.amount*=(-1);
   if(itemLine.reqNum) obj.inventoryReqNum=itemLine.reqNum;
   if(typeof(itemLine.arrivalDate)=='string') obj.arrivalDate=itemLine.arrivalDate;
   if(itemRes.itemType=="product") {
     obj.expirationDate=itemRes.expirationDate ;obj.productionDate=itemRes.productionDate 
    };
   if(this.dir=="shelfChange"){
    obj.shell_id_in_whareHouse_Dest= itemLine.destShelfId;
    obj.shell_position_in_whareHouse_Dest= itemLine.destShelf.toUpperCase();
   }
  
   this.inventoryUpdateList.push(obj);
   this.loadingToTable=false;
   this.itemLine.reset();

  }else{
    alert(" מספר פריט "+itemLine.itemNumber+" במדף "+itemLine.position+"\nכבר קיים ברשימה");
  }


}else{
  alert("יש לשלוח קודם את שינוי המדף ברשימה");
  this.loadingToTable=false;
}

}





searchItemsOnShelf(event){
  this.ItemsOnShelf=[];
  // let shelf = event.target.value;
  let shelfPosiotion = this.shelfSearch.nativeElement.value.toUpperCase().trim();
  
  let whId= this.curentWhareHouseId;
  let stockType;
  if(this.curentWhareHouseName == "Rosh HaAyin" || this.curentWhareHouseName == "Kasem")  stockType="component";
  if(this.curentWhareHouseName == "Rosh HaAyin products")  stockType="product";
  if(shelfPosiotion!=''){
    this.inventoryService.getItemsOnShelf(shelfPosiotion, whId, stockType).subscribe(res => {
      if(res=="shelfMissing"){
        this.toastSrv.error("מדף לא קיים במחסן");
      }
      else if(res=="noItemsOnShelf"){
        this.toastSrv.error("אין פריטים על המדף");
      }else{
        debugger
        this.ItemsOnShelf=res;
        console.log(this.ItemsOnShelf)
      }
    });
  }else{
    this.toastSrv.error('נא להכניס מדף');
  }
}





addNewShelf(position) {
  //to upper case and remove spaces
  position = position.toUpperCase();
  position = position.trim();
  debugger

  if (this.whareHouseId == "") {
    this.toastSrv.error("לא נבחר מחסן")
  } else if (position == "") {
      this.toastSrv.error("לא הוכנס מיקום מדף חדש")
  }
  else {
    if(confirm(" הקמת מדף חדש " + position)){
      let shellObj = { whareHouseId: this.whareHouseId, position: position }
      this.inventoryService.addNewShelf(shellObj).subscribe(res => {
        console.log(res)
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
































// ***************************************************************************************
  appendItems(number, demandOrderId) {
    let shelfsArr;

    const rowDiv = this.renderer.createElement('div');
    const inputItem = this.renderer.createElement('input');
    const inputShelf = this.renderer.createElement('input');
    const inputQunatity = this.renderer.createElement('input');
    const inputNewShelf = this.renderer.createElement('input');
    const inputDemandId = this.renderer.createElement('input');
    const inputEmpty = this.renderer.createElement('input');
    const btnAdd = this.renderer.createElement('img');
    const btnShelf = this.renderer.createElement('img');
    const btnRemove = this.renderer.createElement('img');
    const shelfsDiv = this.renderer.createElement('div');

    this.renderer.setProperty(inputItem, "value", number);
    this.renderer.setProperty(inputDemandId, "value", demandOrderId);
    this.renderer.setProperty(btnAdd, "src", "assets/images/add.png");
    this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png");
    this.renderer.setProperty(btnRemove, "src", "assets/images/delete.png");
    this.renderer.setProperty(inputShelf, "placeholder", "מדף");
    this.renderer.setProperty(inputQunatity, "placeholder", "כמות");
    this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש");
    this.renderer.setProperty(inputNewShelf, "name", "newShelfName");
    this.renderer.setProperty(inputDemandId, "name", "newDemandId");
    this.renderer.setAttribute(inputDemandId, "disabled", "true");

    // this.renderer.setStyle(inputDemandId, 'visibility', 'hidden');
    this.renderer.setStyle(btnAdd, 'width', '30px');
    this.renderer.setStyle(btnShelf, 'width', '30px');
    this.renderer.setStyle(btnRemove, 'width', '30px');
    this.renderer.setStyle(shelfsDiv, "display", "inline-table")

    this.i = this.i + 1;
    this.renderer.setStyle(inputShelf, 'display', 'none');
    this.renderer.setStyle(inputQunatity, 'display', 'none');
    this.renderer.setStyle(inputNewShelf, 'display', 'none');
   // this.renderer.setStyle(inputEmpty, 'display', 'none');
    this.renderer.setProperty(inputItem, "id", "id_" + this.i)

    let q = this.renderer;
    this.renderer.listen(inputItem, 'focusout', () => {
      this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result => {
        console.log(result)
        if (result[0] != "") {
          q.setProperty(shelfsDiv, "innerText", result.toString())
          q.appendChild(rowDiv, shelfsDiv);
        } else {
          q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
          q.appendChild(rowDiv, shelfsDiv);
        }
      })
    });

    this.renderer.listen(btnAdd, 'click', () => {
      this.createInventoryRow("item", btnAdd, demandOrderId);
    });
    this.renderer.listen(btnRemove, 'click', () => {
      this.deleteInventoryRow("item", btnRemove, rowDiv);
    });
    this.renderer.listen(btnShelf, 'click', () => {
      this.createInventoryRow("amount", btnShelf, demandOrderId)
    });



    this.renderer.appendChild(rowDiv, btnAdd);
    this.renderer.appendChild(rowDiv, inputItem);
    this.renderer.appendChild(rowDiv, inputShelf);
    this.renderer.appendChild(rowDiv, inputQunatity);
    this.renderer.appendChild(rowDiv, inputNewShelf);
    this.renderer.appendChild(rowDiv, inputEmpty); // for the array
    this.renderer.appendChild(rowDiv, btnShelf);
    this.renderer.appendChild(rowDiv, inputDemandId);
    this.renderer.setStyle(inputEmpty, 'display', 'none');
    this.renderer.appendChild(rowDiv, btnRemove);


    this.renderer.appendChild(this.container.nativeElement, rowDiv);
  }
// ***************************************************************************************


// ***************************************************************************************
  //pressing the add item icon
  createInventoryRow(type, a, demandOrderId) {
    // let shelfsArr;
    //checking if there is an item number
    if (type == "amount" && this.renderer.parentNode(a).getElementsByTagName("input")[0].value == "") {
      alert("נא להכניס מק``ט")
    } else {
        //creating elements to variables
      const rowDiv = this.renderer.createElement('div');
      const inputItem = this.renderer.createElement('input');
      const inputShelf = this.renderer.createElement('input');
      const inputQunatity = this.renderer.createElement('input');
      const inputNewShelf = this.renderer.createElement('input');
      const inputEmpty = this.renderer.createElement('input');
      const inputDemandId = this.renderer.createElement('input');
      const btnAdd = this.renderer.createElement('img');
      const btnShelf = this.renderer.createElement('img');
      const btnRemove = this.renderer.createElement('img');
      const shelfsDiv = this.renderer.createElement('div');
      //stting attributes to rendered elements
      this.renderer.setProperty(inputDemandId, "value", demandOrderId);
      this.renderer.setProperty(btnAdd, "src", "assets/images/add.png");
      this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png");
      this.renderer.setProperty(btnRemove, "src", "assets/images/delete.png");
      this.renderer.setProperty(inputItem, "placeholder", 'מק"ט פריט');
      this.renderer.setProperty(inputShelf, "placeholder", "מדף");
      this.renderer.setProperty(inputQunatity, "placeholder", "כמות");
      this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש");
      this.renderer.setProperty(inputNewShelf, "name", "newShelfName");
      this.renderer.setProperty(inputDemandId,"name", "newDemandId");
      this.renderer.setAttribute(inputDemandId, "class", "dataInput");
      this.renderer.setAttribute(inputDemandId, "disabled", "true");


      //setting style to rendered elements
      // this.renderer.setStyle(inputDemandId, 'visibility', 'hidden');
      this.renderer.setStyle(btnAdd, 'width', '30px');
      this.renderer.setStyle(btnShelf, 'width', '30px');
      this.renderer.setStyle(btnRemove, 'width', '30px');
      this.renderer.setStyle(shelfsDiv, "display", "inline-table");

      if (type == "item") {
        this.i = this.i + 1;
        this.renderer.setStyle(inputShelf, 'display', 'none');
        this.renderer.setStyle(inputQunatity, 'display', 'none');
        this.renderer.setStyle(inputNewShelf, 'display', 'none');
        this.renderer.setStyle(inputEmpty, 'display', 'none');
        this.renderer.setProperty(inputItem, "id", "id_" + this.i)

      }
      else if (type == "amount") {
        this.renderer.setProperty(btnShelf, "id", this.i)
        this.renderer.setStyle(btnShelf, 'display', 'none');
        this.renderer.setStyle(btnAdd, 'display', 'none');
        this.renderer.setStyle(shelfsDiv, 'display', 'none');
        this.renderer.setAttribute(inputItem, "class", "dataInput");
        this.renderer.setAttribute(inputShelf, "class", "dataInput");
        this.renderer.setAttribute(inputQunatity, "class", "dataInput");
        this.renderer.setAttribute(inputEmpty, "class", "dataInput");
        if (this.dir == "shellChange") {
          this.renderer.setAttribute(inputNewShelf, "class", "dataInput");
        } else {
          this.renderer.setAttribute(inputNewShelf, "class", "no");
          this.renderer.setStyle(inputNewShelf, 'display', 'none');
        }
        this.renderer.setStyle(inputItem, 'visibility', 'hidden');
        this.renderer.setProperty(inputItem, "value", this.renderer.parentNode(a).getElementsByTagName("input")[0].value)
        console.log(this.renderer.parentNode(a).getElementsByTagName("input")[0].value);
      }
      let q = this.renderer;
      this.renderer.listen(inputItem, 'focusout', () => {
        this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result => {
          console.log(result)
          if (result[0] != "") {
            q.setProperty(shelfsDiv, "innerText", result.toString())
            q.appendChild(rowDiv, shelfsDiv);
          } else {
            q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
            q.appendChild(rowDiv, shelfsDiv);
          }
        })
      });

      this.renderer.listen(btnAdd, 'click', () => {
        this.createInventoryRow("item", btnAdd, demandOrderId);
      });
      this.renderer.listen(btnRemove, 'click', () => {
        this.deleteInventoryRow("item", btnRemove, rowDiv);
      });
      this.renderer.listen(btnShelf, 'click', () => {
        this.createInventoryRow("amount", btnShelf, demandOrderId)

      });

      this.renderer.appendChild(rowDiv, btnAdd);
      this.renderer.appendChild(rowDiv, inputItem);
      this.renderer.appendChild(rowDiv, inputShelf);
      this.renderer.appendChild(rowDiv, inputQunatity);
      this.renderer.appendChild(rowDiv, inputNewShelf);
      this.renderer.appendChild(rowDiv, inputDemandId);
      this.renderer.appendChild(rowDiv, inputEmpty); // for the array
      this.renderer.appendChild(rowDiv, btnShelf);
      this.renderer.setStyle(inputEmpty, 'display', 'none');
      this.renderer.appendChild(rowDiv, btnRemove);

      if (type == "amount") {
        this.renderer.appendChild(this.renderer.parentNode(a), rowDiv);
      } else {
                //creating elements to variables
          const rowDiv = this.renderer.createElement('div');
          const inputItem = this.renderer.createElement('input');
          const inputShelf = this.renderer.createElement('input');
          const inputQunatity = this.renderer.createElement('input');
          const inputNewShelf = this.renderer.createElement('input');
          const inputEmpty = this.renderer.createElement('input');
          const inputDemandId = this.renderer.createElement('input');
          const btnAdd = this.renderer.createElement('img');
          const btnShelf = this.renderer.createElement('img');
          const btnRemove = this.renderer.createElement('img');
          const shelfsDiv = this.renderer.createElement('div');
          //stting attributes to rendered elements
          this.renderer.setProperty(inputDemandId, "value", demandOrderId);
          this.renderer.setProperty(btnAdd, "src", "assets/images/add.png");
          this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png");
          this.renderer.setProperty(btnRemove, "src", "assets/images/delete.png");
          this.renderer.setProperty(inputItem, "placeholder", 'מק"ט פריט');
          this.renderer.setProperty(inputShelf, "placeholder", "מדף");
          this.renderer.setProperty(inputQunatity, "placeholder", "כמות");
          this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש");
          this.renderer.setProperty(inputNewShelf, "name", "newShelfName");
          this.renderer.setProperty(inputDemandId, "name", "newDemandId");
          this.renderer.setAttribute(inputDemandId, "class", "dataInput");
          this.renderer.setAttribute(inputDemandId, "disabled", "true");

          //setting style to rendered elements
          // this.renderer.setStyle(inputDemandId, 'visibility', 'hidden');
          this.renderer.setStyle(btnAdd, 'width', '30px');
          this.renderer.setStyle(btnShelf, 'width', '30px');
          this.renderer.setStyle(btnRemove, 'width', '30px');
          this.renderer.setStyle(shelfsDiv, "display", "inline-table");

          if (type == "item") {
            this.i = this.i + 1;
            this.renderer.setStyle(inputShelf, 'display', 'none');
            this.renderer.setStyle(inputQunatity, 'display', 'none');
            this.renderer.setStyle(inputNewShelf, 'display', 'none');
            this.renderer.setStyle(inputEmpty, 'display', 'none');
            this.renderer.setProperty(inputItem, "id", "id_" + this.i)
    
          }
          else if (type == "amount") {
            this.renderer.setProperty(btnShelf, "id", this.i)
            this.renderer.setStyle(btnShelf, 'display', 'none');
            this.renderer.setStyle(btnAdd, 'display', 'none');
            this.renderer.setStyle(shelfsDiv, 'display', 'none');
            this.renderer.setAttribute(inputItem, "class", "dataInput");
            this.renderer.setAttribute(inputShelf, "class", "dataInput");
            this.renderer.setAttribute(inputQunatity, "class", "dataInput");
            this.renderer.setAttribute(inputEmpty, "class", "dataInput");
            if (this.dir == "shellChange") {
              this.renderer.setAttribute(inputNewShelf, "class", "dataInput");
            } else {
              this.renderer.setAttribute(inputNewShelf, "class", "no");
              this.renderer.setStyle(inputNewShelf, 'display', 'none');
            }
            this.renderer.setStyle(inputItem, 'visibility', 'hidden');
            this.renderer.setProperty(inputItem, "value", this.renderer.parentNode(a).getElementsByTagName("input")[0].value)
            console.log(this.renderer.parentNode(a).getElementsByTagName("input")[0].value);
          }
          let q = this.renderer;
          this.renderer.listen(inputItem, 'focusout', () => {
            this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result=>{
              console.log(result)
              if(result[0]!=""){
                q.setProperty(shelfsDiv, "innerText", result.toString())
                q.appendChild(rowDiv, shelfsDiv);
              }else {
                q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
                q.appendChild(rowDiv, shelfsDiv);
              }
            })
          });
    
          this.renderer.listen(btnAdd, 'click', () => {
            this.createInventoryRow("item", btnAdd, demandOrderId);
          });
          this.renderer.listen(btnRemove, 'click', () => {
            this.deleteInventoryRow("item", btnRemove, rowDiv);
          });
          this.renderer.listen(btnShelf, 'click', () => {
            this.createInventoryRow("amount", btnShelf, demandOrderId)
          });
  
          this.renderer.appendChild(rowDiv, btnAdd);
          this.renderer.appendChild(rowDiv, inputItem);
          this.renderer.appendChild(rowDiv, inputShelf);
          this.renderer.appendChild(rowDiv, inputQunatity);
          this.renderer.appendChild(rowDiv, inputNewShelf);
          this.renderer.appendChild(rowDiv, inputDemandId);
          this.renderer.appendChild(rowDiv, inputEmpty); // for the array
          this.renderer.appendChild(rowDiv, btnShelf);
          this.renderer.setStyle(inputEmpty, 'display', 'none');
          this.renderer.appendChild(rowDiv, btnRemove);

          if (type == "amount") {
            this.renderer.appendChild(this.renderer.parentNode(a), rowDiv);
          } else {
            this.renderer.appendChild(this.container.nativeElement, rowDiv);
          }
      }
    }
  }
// ***************************************************************************************


    deleteInventoryRow(type, a, rowDiv){
      this.renderer.removeChild(this.renderer.parentNode(a), rowDiv);

  }



}
