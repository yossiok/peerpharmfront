import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'
import { ActivatedRoute } from '@angular/router'
import { UploadFileService } from 'src/app/services/helpers/upload-file.service';
import { HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { DEC } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { toDate } from '@angular/common/src/i18n/format_date';
import { fstat } from 'fs';
import { BatchesService } from 'src/app/services/batches.service';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
 // resCmpt: any;
 itemmoveBtnTitle:string="Item Movements";
 showItemDetails:boolean=true;
 itemMovements:any=[];
  resCmpt:any = {
    componentN:'',
    componentName:'',
    componentNs:'',
    suplierN: '',
    suplierName: '',
    componentType:'',
    componentCategory:'',
    img: '',
    importFrom: '',
    lastModified:'',
    minimumStock:'',
    needPrint:'',
    packageType: '',
    packageWeight: '',
    remarks: '',
    componentItems:[],
    input_actualMlCapacity:0,
  }
  buttonColor: string = 'white';
  buttonColor2: string = '#B8ECF1';
  buttonColor3: string = '#B8ECF1';
  openModal: boolean = false;
  openAmountsModal: boolean = false;
  openModalHeader:string;
  components: any[];
  filteredComponents: any[];
  componentsUnFiltered:any[];
  componentsAmount: any[];
  tempHiddenImgSrc:any;
  procurmentQnt:Number;
  amountsModalData:any;
  itemAmountsData:any[];
  itemAmountsWh:any[];
  newAllocationOrderNum:string;
  newAllocationAmount:Number;
  itemIdForAllocation:String;
  EditRowId: any = "";
  procurementInputEvent:any;
  stockType:String="component";
  newItem:String='';
  //var's to edit itemshelf in allowed wh for user
  user: UserInfo;
  whareHouses:Array<any>;
  curentWhareHouseId:String;
  curentWhareHouseName:String;
  //adding Stock amounts
  newItemShelfQnt:number;
  newItemShelfBatchNumber:number;
  newItemShelfArrivalDate:number;
  newItemShelfPosition:String;
  newItemShelfWH:String;
  cmptTypeList:Array<any>;
  cmptCategoryList:Array<any>;
  emptyFilterArr:Boolean=true;
  currItemShelfs:Array<any>;
  stockAdmin:Boolean=false;
  destShelfId:String;
  destShelf:String;
  amountChangeDir:String;
  sehlfChangeNavBtnColor:String="";
  amountChangeNavBtnColor:String="#1affa3";
  ItemBatchArr:Array<any>;
  filterVal:String='';
  // filterbyNumVal:String;
  // filterByTypeVal:String;
  // filterByCategoryVal:String;
  @ViewChild('filterByType') filterByType: ElementRef;//this.filterByType.nativeElement.value
  @ViewChild('filterByCategory') filterByCategory: ElementRef;//this.filterByCategory.nativeElement.value

  @ViewChild('filterbyNum') filterbyNum: ElementRef; //this.filterbyNum.nativeElement.value
  @ViewChild('suppliedAlloc') suppliedAlloc: ElementRef;
  // @ViewChild('procurmentInput') procurmentInput: ElementRef;

  // currentFileUpload: File; //for img upload creating new component

  constructor(private excelService:ExcelService, private route: ActivatedRoute, private inventoryService: InventoryService, private uploadService: UploadFileService, private authService: AuthService,private toastSrv: ToastrService , private batchService: BatchesService) { }

  async ngOnInit() {
    let url = this.route.snapshot;
    debugger      
    this.components=[]; 
    await this.getUserAllowedWH();
    this.getAllComponents();
  }
//************************************************* */
  exportAsXLSX(data, title) {
    this.excelService.exportAsExcelFile(data, title);
 }
  getDoubleItemShelfs(){
    this.inventoryService.getDoubleItemShelfs().subscribe(res=>{
      this.exportAsXLSX(res, "DoubleItemShelfs");
    })}
  getDoubleStockItems(){
    this.inventoryService.getDoubleStockItems().subscribe(res=>{
      this.exportAsXLSX(res, "DoubleStockItems");

    })}
    deleteDoubleStockItemsProducts(){
      this.inventoryService.deleteDoubleStockItemsProducts().subscribe(res=>{
        console.log(res);
    })}
    
//************************************************/

getUserAllowedWH(){
  this.inventoryService.getWhareHousesList().subscribe(res => {
    if(res){
      let displayAllowedWH = [];
      for (const wh of res) {
        if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
          displayAllowedWH.push(wh);
        }
      }
      if (this.authService.loggedInUser.authorization.includes("stockAdmin")){
        this.stockAdmin=true;
        debugger
      }
      this.whareHouses = displayAllowedWH;
      this.curentWhareHouseId = displayAllowedWH[0]._id;
      this.curentWhareHouseName = displayAllowedWH[0].name;
      
    console.log(res);
    }
  });
}

loadComponentItems(){
  this.inventoryService.getItemsByCmpt(this.resCmpt.componentN , this.resCmpt.componentType).subscribe(res=>{
    if(res.length>0){
      this.resCmpt.componentItems=res;
    }else
    this.resCmpt.componentItems=[]
    
  });
}


async updateItemStockShelfChange(direction){
  // this.newItemShelfPosition
  // this.newItemShelfQnt
  // this.destShelf
  await this.inventoryService.checkIfShelfExist(this.destShelf,this.newItemShelfWH).subscribe( async shelfRes=>{
    if(shelfRes.ShelfId){
      this.destShelfId=shelfRes.ShelfId;
      this.updateItemStock(direction);
    }else{
      this.toastSrv.error("מדף יעד לא קיים")
    }

  });
  /* we need to send two objects with negitive and positive amounts 
  both with dir="shelfchange",
 and make sure server side will deal with this dir and update movments 

  */
}


dirSet(direction){
  if(direction=="shelfChange"){
    this.amountChangeDir= 'shelfChange';
    this.sehlfChangeNavBtnColor="#1affa3";
    this.amountChangeNavBtnColor="";
  }else{
    this.amountChangeDir= '';
    this.sehlfChangeNavBtnColor="";
    this.amountChangeNavBtnColor="#1affa3";
  }
}


async updateItemStock(direction){
  
  //check enough amount for "out"
  this.newItemShelfPosition=this.newItemShelfPosition.toUpperCase().trim();
  var shelfExsit=false;
  let itemShelfCurrAmounts =[]
  await this.currItemShelfs.forEach(x=>{
    if(x.position==this.newItemShelfPosition)  {
      itemShelfCurrAmounts.push(x.amount);
      shelfExsit=true;
    };
  });
    await this.inventoryService.checkIfShelfExist(this.newItemShelfPosition,this.newItemShelfWH).subscribe( async shelfRes=>{
      
      if(shelfRes.ShelfId){
        shelfExsit=true;
        if((direction!="in" && itemShelfCurrAmounts.length>0) || direction=="in"){
          let enoughAmount =(itemShelfCurrAmounts[0]>=this.newItemShelfQnt);
          if((direction!="in" && enoughAmount) || direction=="in"){
        
            if(direction!="in") this.newItemShelfQnt*=(-1);
      
            if(this.newItemShelfWH!=""){
              let ObjToUpdate=[{
                amount: this.newItemShelfQnt,
                item: this.resCmpt.componentN,
                itemName: this.resCmpt.componentName,
                shell_id_in_whareHouse:shelfRes.ShelfId,
                position:this.newItemShelfPosition,
                arrivalDate:null, // only for "in"
                expirationDate:null, // for products stock
                productionDate:null, // for products stock
                barcode:"",
                itemType: this.stockType,
                // relatedOrderNum:itemLine.relatedOrder,
                // deliveryNoteNum:itemLine.deliveryNote,  
                actionType: direction,
                WH_originId: this.curentWhareHouseId,
                WH_originName : this.curentWhareHouseName,
                shell_id_in_whareHouse_Dest:this.destShelfId,
                shell_position_in_whareHouse_Dest:this.destShelf,
                WH_destId:this.curentWhareHouseId,
                WH_destName:this.curentWhareHouseName,

                }];

                if(direction="in") {
                  //   this.batchService.getAllBatchesByNumber(this.newItemShelfBatchNumber).subscribe(batchExist=>{       
                  //   });
                  ObjToUpdate[0].arrivalDate= new Date()
                };
               if(direction!="in") ObjToUpdate[0].amount*=(-1);
              //  if(itemLine.reqNum) ObjToUpdate.inventoryReqNum=itemLine.reqNum;
              //  if(typeof(itemLine.arrivalDate)=='string') ObjToUpdate.arrivalDate=itemLine.arrivalDate;
               if(this.stockType=="product") {
                //  ObjToUpdate.expirationDate=itemRes.expirationDate ;ObjToUpdate.productionDate=itemRes.productionDate 
                };
               if(direction=="shelfChange"){
                ObjToUpdate[0].shell_id_in_whareHouse_Dest= this.destShelfId;
                ObjToUpdate[0].shell_position_in_whareHouse_Dest= this.destShelf;
               }

        
                //  READY!
                await this.inventoryService.updateInventoryChangesTest(ObjToUpdate,this.stockType).subscribe(res => {
                  if(res=="all updated"){
                    this.toastSrv.success("Changes Saved");
                    this.newItemShelfQnt=null
                    this.destShelf=""
                    this.destShelfId=""
                  }
                });
            }else{
              this.toastSrv.error("Choose wharehouse");
            }
          }else{
            this.toastSrv.error("Not enough stock on shelf!\n Item Number "+this.resCmpt.componentN+"\n Amount on shelf: "+itemShelfCurrAmounts[0]);
          }
        }
      }else{
        this.toastSrv.error("No Such Shelf: "+this.newItemShelfPosition);
      } 
    });
      
  }









  getUserInfo() {
    
      this.authService.userEventEmitter.subscribe(user => {
      this.user=user.loggedInUser;
    })
    
    if (!this.authService.loggedInUser) {
      this.authService.userEventEmitter.subscribe(user => {
        if (user.userName) {
          this.user = user;
        }
      });
    }
    else {
      this.user = this.authService.loggedInUser;
    }
  }

  setType(type, elem) {
    console.log("hi " + type);
    console.log("hi " + elem.style);
    switch (type) {
      case 'component':
        this.buttonColor = "white";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        break;
      case 'material':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "white";
        this.buttonColor3 = "#B8ECF1";
        break;
      case 'product':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "white";
        break;
    }
    if(this.stockType!=type){
      this.filterbyNum.nativeElement.value="";
    }
    this.stockType=type;
 
    this.components=this.componentsUnFiltered.filter(x=> x.itemType==type);
  }

  filterRowsByItemNumber(event){
    this.filterVal='';
    this.filterVal=event.target.value;
    this.components=this.componentsUnFiltered.filter(x=> x.componentN.includes(this.filterVal));
    
  }

  filterRowsByCmptTypeanCategory(event){
    
    this.emptyFilterArr=true;
    let type=this.filterByType.nativeElement.value
    let category= this.filterByCategory.nativeElement.value
    if(type!="" || category!=""){
      if(category!=""&&type!="" ){
        this.components=this.components.filter(x=> x.componentType.includes(type) && x.componentType.includes(category) );
      }else if(category=="" && type!=""){
        this.components=this.components.filter(x=> x.componentType.includes(type));
      }else if(category!="" && type==""){
        this.components=this.components.filter(x=> x.componentType.includes(category));
      }
    }
    if(this.components.length==0){
      this.emptyFilterArr=false;
      this.components=this.componentsUnFiltered;
    }

    // if(category!=""){
    //   this.components=this.components.filter(x=> x.componentCategory.includes(category));
    // }
    // let filterVal=event.target.value;
    // this.components=this.componentsUnFiltered.filter(x=> x.componentN.includes(filterVal));
    
  }



  getAllComponents() {
    this.inventoryService.getAllComponents().subscribe(components => {

      this.componentsUnFiltered=   components.splice(0);
      this.components = components;
      //why are we using set time out and not async await??
      setTimeout( ()=> {
        
        this.inventoryService.getComponentsAmounts().subscribe(res => {
          this.componentsAmount = res;
          // console.log(res);
          this.componentsUnFiltered.forEach(cmpt => {
         //  adding amounts to all components
            let result = this.componentsAmount.find(elem => elem._id == cmpt.componentN)
            if(result!=undefined){
              // console.log(result._id + " , " + cmpt.componentN);
              cmpt.amount = result.total;
            }

            if(cmpt.allocations.length>0){
              let itemAllocSum=0;
              cmpt.allocations.forEach(alloc=>{
                itemAllocSum= itemAllocSum+alloc.amount;
                itemAllocSum= itemAllocSum-alloc.supplied;
              });
              cmpt.allocAmount=itemAllocSum;
              
            }
            
            if(cmpt.actualMlCapacity=='undefined') cmpt.actualMlCapacity=0; 

          });
          this.components=this.componentsUnFiltered.filter(x=> x.itemType=="component");
          this.getAllCmptTypesAndCategories();

        });

      }, 1000);

    });
    // console.log(this.components);
    ;
  }

  getAllCmptTypesAndCategories(){
    this.cmptTypeList=[];
    this.cmptCategoryList=[];
    this.components.forEach(cmpt=>{
      if(cmpt.componentType!=""&&cmpt.componentType!=null&&cmpt.componentType!=undefined){
        if(!this.cmptTypeList.includes(cmpt.componentType)){
          return this.cmptTypeList.push(cmpt.componentType);
        }
      }
      if(cmpt.componentCategory!=""&&cmpt.componentCategory!=null&&cmpt.componentCategory!=undefined){
        if(!this.cmptCategoryList.includes(cmpt.componentCategory)){
          return this.cmptCategoryList.push(cmpt.componentCategory);
        }
      }
    });    
  }


  searchItemShelfs(){
  if(this.newItemShelfWH!=''){  
    this.inventoryService.getShelfListForItemInWhareHouse(this.resCmpt.componentN, this.newItemShelfWH).subscribe(async res => {
      if(res.length>0){
        this.currItemShelfs=res;
        
      }else{
        this.currItemShelfs=[];
        this.currItemShelfs.push("NO SHELFS WITH ITEM # "+this.resCmpt.componentN);
      }
    });    
  }else{
    this.toastSrv.error("Choose Wharhouse");
  }
 }


 loadShelfToInput(position, ev){
    if(!position.includes("NO SHELFS")){
      this.newItemShelfPosition=position;
    }
}


  openData(cmptNumber) {
    this.openModalHeader="פריט במלאי  "+ cmptNumber;
    this.openModal = true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber);
    
  }
  openAmountsData(cmptNumber, cmptId) {
    this.openModalHeader="כמויות פריט במלאי  "+ cmptNumber;
    this.openAmountsModal = true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber);
    this.itemIdForAllocation=cmptId;  
    //get product (and TBD materials) batchs for select
    //??? this.resCmpt has mkp category
    debugger
    if(this.stockType!="components"){
      this.batchService.getBatchesByItemNumber(cmptNumber+"").subscribe(data=>{
        this.ItemBatchArr=data;
        debugger
      });  
    }
  }
  closeAmountsData(){
    this.openAmountsModal = false;
    this.itemAmountsData=[];
    this.newItemShelfPosition='';
    this.newItemShelfQnt=null;
    this.destShelf='';
  }

  newCmpt(newItem){
    this.newItem=newItem;
    this.resCmpt = {
      componentN:'',
      componentName:'',
      componentNs:'',
      suplierN: '',
      suplierName: '',
      componentType:'',
      componentCategory:'',
      img: '',
      importFrom: '',
      lastModified:'',
      minimumStock:'',
      needPrint:'',
      packageType: '',
      packageWeight: '',
      remarks: '',
      itemType:'',
      actualMlCapacity:0,
    }


    this.openModalHeader="יצירת פריט חדש";
    this.openModal = true;
  }

  writeNewComponent(){
    this.resCmpt.itemType=this.stockType;
    console.log(this.resCmpt);
     this.inventoryService.addNewCmpt(this.resCmpt).subscribe(res=>{
       console.log("res from front: "+res)
       if(res=="itemExist"){
        alert("לא ניתן ליצור פריט חדש- מספר "+this.resCmpt.componentN+" פריט כבר קיים במלאי");
      }
      this.newItem='';

   })

  }

  editStockItemDetails(){
    this.resCmpt;
    if(confirm("לעדכן פריט?")){
      this.inventoryService.updateCompt(this.resCmpt).subscribe(res=>{
        if(res.n!=0){
          this.toastSrv.success("פריט עודכן בהצלחה");
        } else{
          this.toastSrv.error("עדכון פריט נכשל");
        }
      });
    }

  }



  uploadImg(fileInputEvent){
    let file  = fileInputEvent.target.files[0];
    console.log(file);
 
    this.uploadService.uploadFileToS3Storage(file).subscribe(data=>{
      if(data.partialText)
      {
      // this.tempHiddenImgSrc=data.partialText;
      this.resCmpt.img = data.partialText;
      console.log(" this.resCmpt.img "+  this.resCmpt.img);
      }
 
    })
}
async getCmptAmounts(cmptN, cmptId){
  debugger
  await this.inventoryService.getAmountOnShelfs(cmptN).subscribe(res=>{

    debugger
    this.itemAmountsData=res.data;
    this.itemAmountsWh=res.whList;

    this.openAmountsData(cmptN, cmptId);

  });

  ;
}




inputProcurment(event: any) { // without type info
  this.procurementInputEvent=event;
  this.procurmentQnt = event.target.value;
  ;
}
updateProcurment(componentId,componentNum,status){
  
  if(status=="false"){
    this.procurmentQnt=null;
  }
  let objToUpdate={
    _id:componentId,
    componentN:componentNum,
    procurementSent:status,//האם בוצעה הזמנת רכש
    procurementAmount:this.procurmentQnt,//כמות בהזמנת רכש
  } 
  this.inventoryService.updateComptProcurement(objToUpdate).subscribe(res=>{
    if(res.ok!=0 && res.n!=0){
      console.log("res updateComptProcurement: "+res);
          this.components.map(item=>{
          if(item._id==componentId){
            item.procurementAmount=objToUpdate.procurementAmount;
            if(this.procurmentQnt==null){
              item.procurementSent=false;
              }else{
                this.procurementInputEvent.target.value='';
                item.procurementSent=true;
              }
          }
        });
    }
  });
}

addItemStockAllocation(componentNum){
  if(this.newAllocationOrderNum!=null && this.newAllocationAmount!=null){
    let objToUpdate={
      _id: this.itemIdForAllocation,
      componentN:componentNum,
      allocations:[{
        relatedOrderN:this.newAllocationOrderNum,
        amount:this.newAllocationAmount,
        supplied:0
        }
      ],
    }
    this.inventoryService.updateComptAllocations(objToUpdate).subscribe(res=>{
      if(res.ok!=0 && res.n!=0){
        ;
        console.log("res updateComptAllocations: "+res);
        this.resCmpt.allocations.push(objToUpdate.allocations[0]);
        this.resCmpt.allocAmount+=objToUpdate.allocations[0].amount;
      }
    });
  }
  this.newAllocationOrderNum=null;
  this.newAllocationAmount=null;
  ;
}
edit(index) {
  this.EditRowId = index;
}
saveAllocEdit(cmptId,rowIndex) {
  //not in use now
  ;
  // "suppliedAlloc": this.suppliedAlloc.nativeElement.value,

}
editItemStockAllocationSupplied(cmptId,rowIndex){
  ;
  let oldAllocationsArr=this.resCmpt.allocations;
  let newSupplied=this.suppliedAlloc.nativeElement.value;
  oldAllocationsArr[this.EditRowId].supplied=newSupplied;
  let newAllocationsArr=oldAllocationsArr;
  let objToUpdate={
    _id: this.itemIdForAllocation,
    allocations:newAllocationsArr,
    }
  ;
  this.inventoryService.updateCompt(objToUpdate).subscribe(res=>{
    if(res.ok!=0 && res.n!=0){
      ;
      console.log("res updateCompt: "+res);
      this.EditRowId='';
      this.resCmpt.allocations=newAllocationsArr;
        let itemAllocSum=0;
        this.resCmpt.allocations.forEach(alloc=>{
          itemAllocSum= itemAllocSum+alloc.amount;
          itemAllocSum= itemAllocSum-alloc.supplied;

        });
        this.resCmpt.allocAmount=itemAllocSum;
        
      }
  });
}



deleteItemStockAllocation(cmptId,rowIndex) {
  

  if (confirm("מחיקת הקצאה")) {
    let amountDeleted=this.resCmpt.allocations[rowIndex].amount;
    let newAllocationsArr=this.resCmpt.allocations.splice(rowIndex-1, 1);
    let objToUpdate={
      _id: this.itemIdForAllocation,
      allocations:newAllocationsArr,
      }
    this.inventoryService.updateCompt(objToUpdate).subscribe(res=>{
      if(res.ok!=0 && res.nModified==1 ){
        ;
        console.log("res updateCompt: "+res);
        this.resCmpt.allocAmount-=amountDeleted;
      }
    });
  }
}

procurementRecommendations(){
  if(this.stockType!="product"){
    let recommendList=this.components.filter(cmpt=> cmpt.minimumStock <= cmpt.amountKasem+cmpt.amountRH);
    this.components=recommendList;  
  }
}

  
  upload(src) {

    // const number = this.route.snapshot.paramMap.get('itemNumber');
    // this.progress.percentage = 0;
    // this.currentFileUpload = this.selectedFiles.item(0);
    // this.uploadService.pushFileToStorage(this.currentFileUpload, src, number).subscribe(event => {
    //   console.log(event);

    //   if (event.type === HttpEventType.UploadProgress) {
    //     this.progress.percentage = Math.round(100 * event.loaded / event.total);
    //   } else if (event instanceof HttpResponse) {
    //     console.log('File is completely uploaded!');
    //     console.log(event.body);        
    //   }
    // });

    // this.selectedFiles = undefined;
  }





  showDialog() {
  }

  switchModalView()
  {
    this.inventoryService.getItemMovements(this.resCmpt.componentN).subscribe(data=>
      {
        this.itemMovements=data;
      });
      
    if(!this.showItemDetails)
    {
      this.showItemDetails=true;
      this.itemmoveBtnTitle="Item movements";
     
    }
    else
    {
      this.showItemDetails=false;
      this.itemmoveBtnTitle="Back to item details";

    }
  }



  
}// END OF CMPT CLASS
