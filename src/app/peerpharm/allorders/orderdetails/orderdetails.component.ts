import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { ScheduleService } from '../../../services/schedule.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PlateService } from 'src/app/services/plate.service';
import { CostumersService } from 'src/app/services/costumers.service';
import {ExcelService} from '../../../services/excel.service';



@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])]
})
export class OrderdetailsComponent implements OnInit {
  closeResult: string;
  plateImg="";
  printSchedule:any ={
    position:'',
    orderN:'',
    itemN:'',
    itemName:'',
    costumer:'',
    cmptName:'',
    block:'',
    qty:'',
    qtyProduced:'',
    color: '',
    printType: '',
    nextStation: '',
    marks: '',
    date: '',
    dateRdy: '',
    palletN:'',
    status:  '',
  }



  ordersItems;
  ordersItemsCopy;
  item: any;
  number; orderDate; deliveryDate; costumer; costumerInternalId; remarks; orderId;
  chosenType: string;
  detailsArr: any[];
  components: any[];
  multi: boolean = false;
  loadData: boolean = false;
  itemData: any = {
    itemNumber: '',
    discription: '',
    unitMeasure: '',
    quantity: '',
    qtyKg: '',
    orderId: '',
    orderNumber: '',
    batch:'',
    itemRemarks:'',
    compiled: [],
  };
  show: boolean;
  EditRowId: any = "";
  EditRowId2nd: any = "";
  expand: boolean = false;
  type = { type: '' };
  ordersToCheck = [];
  internalNumArr=[];
  packingModal=false;
  cmptModal=false;
  packingItemN="";
  packingOrderN="";
  openOrderPackingModalHeader="";
  openItemPackingModalHeader="";
  itemPackingList:Array<any>=[];
  itemPackingPalletsArr:Array<any>=[];
  orderPalletsArr:Array<any>=[];
  orderPalletsNumArr:Array<any>=[];
  palletsData:Array<any>=[];
  showingOneOrder:Boolean;
  showingAllOrders:Boolean;
  orderPackingList:Array<any>=[];
  orderItemsComponents:Array<any>=[];

  bottleList: Array<any>=[];
  capList: Array<any>=[];
  pumpList: Array<any>=[];
  sealList: Array<any>=[];
  stickerList: Array<any>=[];
  boxList: Array<any>=[];
  cartonList: Array<any>=[];
  platesList: Array<any>=[];
  itemTreeRemarks: Array<any>=[];

  @ViewChild('weight') weight: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;
  @ViewChild('quantity') quantity: ElementRef;
  @ViewChild('unitmeasure') unitMeasure: ElementRef;
  @ViewChild('itemname') itemName: ElementRef;
  @ViewChild('itemNumber') itemN: ElementRef;
  @ViewChild('id') id: ElementRef;

  @ViewChild('date') date: ElementRef;
  @ViewChild('shift') shift: ElementRef;
  @ViewChild('marks') marks: ElementRef;
  // @ViewChild('type') type:ElementRef;

  constructor(private modalService: NgbModal,private route: ActivatedRoute, private router: Router, private orderService: OrdersService, private itemSer: ItemsService,
     private scheduleService: ScheduleService, private location: Location, private plateSer:PlateService,  private toastSrv: ToastrService, 
     private costumerSrevice: CostumersService, private excelService:ExcelService ) { }


    exportAsXLSX(data) {
      debugger
      this.excelService.exportAsExcelFile(data, 'Order '+this.ordersItems[0].orderNumber+' Explode');
   }

  ngOnInit() {
    console.log('hi');
    this.orderService.openOrdersValidate.subscribe(res=>{
      this.number = this.route.snapshot.paramMap.get('id');

      if(res==true || this.number=="00"){
        this.showingAllOrders=true;
        this.loadData=true;
        this.orderService.getOpenOrdersItems().subscribe(orderItems=>{
          this.loadData=false;
          this.multi = true;
          orderItems.forEach(item => {
            item.isExpand = '+';
            item.colorBtn = '#33FFE0';
          });
          this.ordersItems = orderItems;
          this.ordersItemsCopy = orderItems;
          this.ordersItems.map(item=>{
            item.itemFullName = item.itemNumber + " "  +item.discription;
          })
          //this.ordersItems = this.ordersItems.map(elem => Object.assign({ expand: false }, elem));
          //this.getComponents(this.ordersItems[0].orderNumber);
          this.multi = true;
          console.log(orderItems)
        });

      }
      else{
        this.showingAllOrders=false;
          this.orderService.ordersArr.subscribe(async res => {
            console.log(res)
            var numArr = this.number.split(",").filter(x=>x!="");
            if(numArr.length>1){ //multi orders:  came through load button
              this.orderService.getOrdersIdsByNumbers(numArr).subscribe(async ordersIds => {
                if(ordersIds.length>1){
                  this.orderService.getMultiOrdersIds(ordersIds).subscribe(orderItems => {
                    orderItems.forEach(item => {
                      item.isExpand = '+';
                      item.colorBtn = '#33FFE0';
                    });
                    this.ordersItems = orderItems;
                    this.ordersItemsCopy = orderItems;
                    this.multi = true;
                    console.log(orderItems);
                  });
                }else {  //one order: but came through load button
                  await this.getOrderDetails();
                  await this.getOrderItems(false);
                  this.show = true;
                  this.multi = false;

                }

              });
            } else {  //one order:
              await this.getOrderDetails();
              await this.getOrderItems(false);
              this.show = true;
              this.multi = false;
            }
          });
      }
    });

  }

  addItemOrder() {
     
    this.itemData.orderId = this.orderId;
    if(!this.multi) this.itemData.orderNumber = this.number;
    let newItemImpRemark= this.itemData.itemImpRemark;
     
    this.orderService.addNewOrderItem(this.itemData).subscribe(item => {
      if(item.itemNumber==this.itemData.itemNumber ){
         
        item.itemImpRemark= newItemImpRemark;
        item.isExpand = '+';
        item.colorBtn = '#33FFE0';
        this.ordersItems.push(item);
        this.itemData = { itemNumber: '', discription: '', unitMeasure: '', quantity: '', qtyKg: '', orderId: '', orderNumber: '', batch:'', itemRemarks:'', compiled: []}
        this.getOrderItems(true);

        this.toastSrv.success('item '+item.itemNumber+' added');
      }else if (item=='error'){
          this.toastSrv.error('Adding item faild');        
      }
    });
  }



  async getOrderDetails() {
    this.number = this.route.snapshot.paramMap.get('id');
    //if someone loaded just one item in orders screen through "Load" button
    if(this.number.includes(',')) this.number=this.number.split(",").filter(x=>x!="");

    await this.orderService.getOrderByNumber(this.number).subscribe(res => {
      this.number = res[0].orderNumber;
      this.costumer = res[0].costumer;
      this.costumerInternalId = res[0].costumerInternalId;
      // this.costumerSrevice.getCostumerData(CostumerNumber).subscribe(res => {});
      this.orderDate = res[0].orderDate;
      this.deliveryDate = res[0].deliveryDate;
      this.remarks = res[0].orderRemarks;
      this.orderId = res[0]._id;
    });
  }
  getOrderItems(singleLine): void {
    var orderNum;
     
    this.number = this.route.snapshot.paramMap.get('id');
    if(this.number.includes(',')) this.number=this.number.split(",").filter(x=>x!="");
    if(singleLine){
      orderNum = this.itemData.orderNumber.trim(); 
    }else{
      orderNum = this.number; 
    }
    //if someone loaded just one item in orders screen through "Load" button

    document.title = "Order " + this.number;
    this.orderService.getOrderItemsByNumber(orderNum).subscribe( orderItems => {
      orderItems.map( item => {
        if (item.fillingStatus != null) {
          if (item.fillingStatus.toLowerCase() == 'filled' || item.fillingStatus.toLowerCase() == 'partfilled') item.color = '#CE90FF';
          else if (item.fillingStatus.toLowerCase() == 'beingfilled' || item.fillingStatus.toLowerCase().includes("scheduled") || item.fillingStatus.toLowerCase().includes('formula porduced') || item.fillingStatus.toLowerCase().includes('batch exist')) item.color = 'yellow';
          else if (item.fillingStatus.toLowerCase() == 'problem') item.color = 'red';
          else if (item.quantityProduced != "" && item.quantityProduced != null && item.quantityProduced != undefined) {
            if (parseInt(item.quantity) >= parseInt(item.quantityProduced)) {
              let lackAmount = parseInt(item.quantity) - parseInt(item.quantityProduced);
              item.fillingStatus += ", " + lackAmount + " lack";
              item.infoColor = 'red';
            }
            else item.color = '#CE90FF';
          }
          else if (item.fillingStatus == 'packed') item.color = '#FFC058';
          else item.color = 'white';
        }
        item.isExpand = '+';
        item.colorBtn = '#33FFE0';
      });

      if(singleLine){
        this.ordersItems.filter(item=> {
          if(item.itemNumber == orderItems[0].itemNumber){
             
            item =orderItems[0];
          }
        });
      }else{
        this.ordersItems = orderItems;
        this.ordersItemsCopy = orderItems;
      }
       
      this.getComponents(this.ordersItems[0].orderNumber);

    });
  }

  // OrderCompileData(orderNumber){
  //   this.orderService.getOrderCompileData(orderNumber).subscribe(itemPackingList => {
  //     // this. = components;
  //     this.ordersItems.map(item=>{
  //       item.compiled=[] ;

  //       itemPackingList.map(packedItemData=> {
  //         if(packedItemData._id==item.itemNumber){
  //           item.compiled.push(packedItemData);
  //         }
  //       });
  //     });
  //     console.log(this.ordersItems);
  //   });
  // }
  //not in use at this moments
  getComponents(orderNumber): void {
    this.orderService.getComponentsSum(orderNumber).subscribe(components => {
      this.components = components;
      console.log("a" + components);
    })
  }


  getDetails(itemNumber, itemId): void {
    this.EditRowId2nd = itemId;
    console.log(itemNumber + " , " + itemId);
    this.orderService.getItemByNumber(itemNumber).subscribe(
      itemDetais => {

        console.log(itemDetais);
        this.detailsArr = [];
        itemDetais.forEach(element => {
          if (element.bottleNumber != null && element.bottleNumber != "") this.detailsArr.push({ type: "Bottle", number: element.bottleNumber, discription : element.bottleTube });
          if (element.capNumber != null && element.capNumber != "") this.detailsArr.push({ type: "Cap", number: element.capNumber, discription : element.capTube  });
          console.log(this.detailsArr);
        });
        if (this.expand === true) { this.expand = false; }
        else { this.expand = true; }

      });


    this.ordersItems.filter(item => item.itemNumber == itemNumber).map(item => {
      this.EditRowId='';
      if (item.isExpand == "+") {
        item.isExpand = "-";
        item.colorBtn = '#F7866A';
      }
      else {
        item.isExpand = "+";
        item.colorBtn = '#33FFE0';
      }
    });
  }

  edit(id) {

    if(id!=''){
      this.EditRowId = id;
    } else{
      this.EditRowId = '';
    }
  }

  saveEdit() {
      let itemToUpdate = {

        'orderItemId': this.id.nativeElement.value,
        'itemNumber': this.itemN.nativeElement.value,
        "unitMeasure": this.unitMeasure.nativeElement.value,
        "discription": this.itemName.nativeElement.value,
        "quantity": this.quantity.nativeElement.value,
        "qtyKg": this.weight.nativeElement.value,
        "itemRemarks": this.itemRemarks.nativeElement.value,
      }
      console.log(itemToUpdate);
      // console.log("edit " + itemToUpdate.orderItemId );
  
      this.orderService.editItemOrder(itemToUpdate).subscribe(res => {
  
        console.log(res)
        if (res != "error") {
          this.toastSrv.success(itemToUpdate.itemNumber, "Changes Saved");
          this.EditRowId = "";
          let index = this.ordersItems.findIndex(order => order._id == itemToUpdate.orderItemId);
          // this.ordersItems[index] = itemToUpdate;
          this.ordersItems[index]._id = itemToUpdate.orderItemId;
          this.ordersItems[index].itemRemarks = itemToUpdate.itemRemarks;
          this.ordersItems[index].discription = itemToUpdate.discription;
          this.ordersItems[index].qtyKg = itemToUpdate.qtyKg;
          this.ordersItems[index].quantity = itemToUpdate.quantity;
          this.ordersItems[index].qtyKg = itemToUpdate.qtyKg;
          this.ordersItems[index].unitMeasure = itemToUpdate.unitMeasure;

           
        }else{
        }
  
      });


  }

  deleteItem(item) {
    console.log(item._id);
    this.orderService.deleteOrderItem(item._id).subscribe(res => {
      this.toastSrv.error("Item Has Been Deleted", item.itemNumber);
      this.ordersItems = this.ordersItems.filter(elem=>elem._id!=item._id);
      console.log(res)
    });
  }



  setSchedule(item, type) {
    console.log(item);
    console.log(this.chosenType);
    console.log(this.date.nativeElement.value + " , " + this.shift.nativeElement.value + " , " + this.marks.nativeElement.value);
    if(this.date.nativeElement.value!=""){
      this.itemSer.getItemData(item.itemNumber).subscribe(res => {
        // whats the use of packageP ??? its also in server side router.post('/addSchedule'....
        let packageP = res[0].bottleTube + " " + res[0].capTube + " " + res[0].pumpTube + " " + res[0].sealTube + " " + res[0].extraText1 + " " + res[0].extraText2;


      });
      let scheduleLine = {
        positionN: '',
        orderN: item.orderNumber,
        item: item.itemNumber,
        costumer: this.costumer,
        productName: item.discription,
        batch: item.batch,
        packageP: '',
        qty: item.quantity,
        qtyRdy: '',
        date: this.date.nativeElement.value,
        marks: this.marks.nativeElement.value, //marks needs to br issued - setSchedule() && setBatch() updating this value and destroy the last orderItems remarks
        shift: this.shift.nativeElement.value,
        mkp: this.chosenType,
        status: 'open',
        productionLine:'',
        pLinePositionN:999
      }
      if(scheduleLine.mkp=="mkp") scheduleLine.productionLine="6";
      if(scheduleLine.mkp=="tube") scheduleLine.productionLine="5";

      this.scheduleService.setNewProductionSchedule(scheduleLine).subscribe(res => console.log(res));
      let dateSced = this.date.nativeElement.value;
      dateSced = moment(dateSced).format("DD/MM/YYYY");
      let orderObj = { orderItemId: item._id, fillingStatus: "Scheduled to " +  dateSced};
      this.orderService.editItemOrder(orderObj).subscribe(res=>{
          console.log(res);
          this.toastSrv.success(dateSced , "Schedule Saved");
      })
      console.log(scheduleLine);

    }else{
      this.toastSrv.error("Invalid Date!");
    }
  }


  setBatch(item, batch, existBatch) {
    let updatedBatch;
    batch=batch.toLowerCase();
    if(existBatch!=null && existBatch!=undefined && existBatch!=""){
      //adding to exist batch number to oreder item
      updatedBatch=batch + "+" + existBatch;
    }else{
      //adding new batch number to oreder item
      updatedBatch=batch;
    }
    let batchObj = { orderItemId: item._id, batch: updatedBatch, fillingStatus: "formula porduced " + updatedBatch };
    console.log(batchObj);
    this.orderService.editItemOrder(batchObj).subscribe(res => {
      console.log(res);
      this.ordersItems.map(orderItem=>{
        if(orderItem._id == item._id){
          orderItem.batch= updatedBatch;
          orderItem.fillingStatus= "formula porduced " + updatedBatch;
        }
      });
      this.toastSrv.success(updatedBatch , "Changes Saved");
    });

  }

  updateBatchExist(item , batch){
    batch=batch.toLowerCase();
    if(!batch){
      let batchObj = { orderItemId: item._id, fillingStatus: "mkp batch exist"};
      console.log(batchObj);
      this.orderService.editItemOrder(batchObj).subscribe(res => {
        console.log(res);

        // this.toastSrv.success(updatedBatch , "Changes Saved");
      });

    }

  }


  searchItem(itemNumber) {
    if(itemNumber!=""){
      this.orderService.getItemByNumber(itemNumber).subscribe(res => {
        if(res.length==1){
          this.itemData.discription = res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
          this.itemData.unitMeasure = res[0].volumeKey;
          this.itemData.itemImpRemark = res[0].impRemarks;
        }
      });

    }
  }

  closeOrder() {
    if (confirm("Close Order?")) {
      let orderToUpdate = {};
      orderToUpdate = { status: 'close', orderId: this.orderId }
      console.log(orderToUpdate);
      this.orderService.editOrder(orderToUpdate).subscribe(res => {
        console.log(res);
        this.router.navigate(['/']);
      });
    }
  }

  setPrintSced(){
    // this.printSchedule.date.setHours(2,0,0,0);
    let dateToUpdate=new Date(this.printSchedule.date)
    dateToUpdate.setHours(2,0,0,0)
    console.log(this.printSchedule);
    this.printSchedule.orderN = this.number;
    this.printSchedule.costumer = this.costumer;
    this.printSchedule.date=dateToUpdate;
    // this.printSchedule.date=moment(this.printSchedule.date).format("YYYY-MM-DD");
    // this.printSchedule.date=moment(this.printSchedule.date.format());

      this.scheduleService.setNewPrintSchedule(this.printSchedule).subscribe(res=>{
        if(res.itemN){
          this.toastSrv.success("Saved", this.printSchedule.cmptN);
        }else{
          this.toastSrv.error("Error - not sent to print schedule");
        }
      });

  }

  openDetails(content, item, cmpt) {
    this.itemSer.getPlateImg(item.itemNumber).subscribe(data=>{
       this.plateImg = data.palletImg;
       this.printSchedule.block = data.palletNumber;
       this.printSchedule.blockImg = data.palletImg;
    });
    console.log(item.itemNumber + " , "  +item.discription + " , "  +  cmpt.number);
    this.printSchedule.cmptN = cmpt.number;
    this.printSchedule.itemN = item.itemNumber;
    this.printSchedule.cmptName = cmpt.discription;
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if (result == 'Saved') {
        this.setPrintSced();
      }
    })
  }



  // changeText(ev)
  // {
  //   let word= ev.target.value;
  //   if(word=="")
  //   {
  //     this.ordersItems=this.ordersItemsCopy.slice();
  //   }
  //   else
  //   {
  //     this.ordersItems= this.ordersItems.filter(x=>x.itemFullName.toLowerCase().includes(word.toLowerCase()));
  //   }
  // }
  changeText(ev)
  {
    let word= ev.target.value;
    let wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      let tempArr=[];
      this.ordersItemsCopy.filter(x=>{
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
            if( (x.itemFullName&&x.itemFullName.toLowerCase().includes(w.toLowerCase())) || (x.discription&&x.discription.toLowerCase().includes(w.toLowerCase())) ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ;
        });

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.ordersItems= tempArr;
    }else{
      this.ordersItems=this.ordersItemsCopy.slice();
      // this.ordersItems= this.ordersItems.filter(x=>x.itemFullName.toLowerCase().includes(word.toLowerCase()));
    }
  }


  async openPackingModal(itemNumber,orderNumber, index){
    this.packingItemN=itemNumber;
    this.packingOrderN=orderNumber;
    this.palletsData=[];

    await this.orderService.getItemPackingList(itemNumber,this.packingOrderN).subscribe(async itemPackingList=>{
        this.itemPackingList=itemPackingList;

     });

  //   await this.orderService.getPalletsDataByOrderNumber(orderNumber).subscribe(orderPallets=>{
  //     this.palletsData = orderPallets
  //  });

   await this.orderService.getOrderPackingList(this.number).subscribe(async orderPackingList=>{
        this.orderPackingList=orderPackingList;
        await this.orderPackingList.forEach(item => {
          let obj = {palletId: item.palletId , palletNumber:item.palletNumber , palletWeight:item.palletWeight , palletMesures:item.palletMesures}
          let palletId = item.palletId ;
          if(!this.orderPalletsNumArr.includes(palletId)){
            this.orderPalletsNumArr.push(palletId);
            this.orderPalletsArr.push(obj);
          }
        });

        await this.ordersItems.forEach(async (orderItem, key) => {
          let packedQnt=0;
          let packedItemsOnPallet=0;
          await this.orderPackingList.filter(packedItem=>{
            if(orderItem.itemNumber == packedItem.itemNumber ){
              packedItemsOnPallet = packedItem.pcsCtn*packedItem.ctnPallet;
              packedQnt = packedQnt+packedItemsOnPallet
              packedItem.totalPackedQnt = packedQnt;

              if(orderItem.quantity == packedItem.totalPackedQnt ){
                packedItem.lineColor="rgb(204, 255, 204)";
              } else{
                packedItem.lineColor="rgb(255, 255, 204)";
              }
            }
          });
        });


     });
    this.openOrderPackingModalHeader="אריזת הזמנה מספר  "+ this.packingOrderN;
    this.openItemPackingModalHeader="אריזת פריט מספר  "+ this.packingItemN;
    // this.openOrderPackingModalHeader="אריזת הזמנה מספר  "+ this.packingItemN;
    this.packingModal=true;


  }


  // checkboxAllOrders(ev){
  //   this.ordersItems.filter(e => e.isSelected = ev.target.checked)
  // }






















  async openCmptDemandsModal(){

    this.bottleList= [];
    this.capList= [];
    this.pumpList= [];
    this.sealList= [];
    this.stickerList= [];
    this.boxList= [];
    this.cartonList= [];
    this.itemTreeRemarks= [];
    if(this.ordersItems.length>0){
      this.internalNumArr=[];
      this.ordersItems.map(i=> this.internalNumArr.push(i.itemNumber.trim()) );
      await this.orderService.getOrderComponents(this.internalNumArr).subscribe( async res=>{
        await res.forEach(async item=> {
          let i=this.ordersItems.filter(x=> x.itemNumber==item.itemNumber)[0];
          item.quantity = parseInt(i.quantity);
          item.itemName = i.discription;

          console.log("i from orderItems ", i)
          console.log("i.quantity",i.quantity);
          console.log("item.quantity",item.quantity);


          if (item.bottleNumber!='' && item.bottleNumber!='---' ) {
            let newCmpt= true;
            if( this.bottleList.map(function (el) { return el.bottleNumber; }).includes(item.bottleNumber) ){
              this.bottleList.map(i=>{
                if(i.bottleNumber==item.bottleNumber){
                  newCmpt=false;
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.bottleList.push({bottleNumber:item.bottleNumber , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }

          if (item.capNumber!='' && item.capNumber!='---' ) {
            let newCmpt= true;
            if( this.capList.map(function (el) { return el.capNumber; }).includes(item.capNumber) ){
              this.capList.map(i=>{
                if(i.capNumber==item.capNumber){
                  newCmpt=false;
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.capList.push({capNumber:item.capNumber , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }

          if (item.pumpNumber!='' && item.pumpNumber!='---' ) {
            let newCmpt= true;
            if( this.pumpList.map(function (el) { return el.pumpNumber; }).includes(item.pumpNumber) ){
              this.pumpList.map(i=>{
                if(i.pumpNumber==item.pumpNumber){
                  newCmpt=false;
                  // i= Object.assign(i, {qnt: i.qnt+parseInt(item.quantity) });
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.pumpList.push({pumpNumber:item.pumpNumber , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }

          if (item.sealNumber!='' && item.sealNumber!='---' ) {
            let newCmpt= true;
            if( this.sealList.map(function (el) { return el.sealNumber; }).includes(item.sealNumber) ){
              this.sealList.map(i=>{
                if(i.sealNumber==item.sealNumber){
                  newCmpt=false;
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.sealList.push({sealNumber:item.sealNumber , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }
           
          if (item.stickerNumber!='' && item.stickerNumber!='---' ) {
            let newCmpt= true;
            if( this.stickerList.map(function (el) { return el.stickerNumber; }).includes(item.stickerNumber)  ){
              this.stickerList.map(i=>{
                if(i.stickerNumber==item.stickerNumber){
                  newCmpt=false;
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.stickerList.push({stickerNumber:item.stickerNumber , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }
          if (item.stickerTypeK!='' && item.stickerTypeK!='---' ) {
            let newCmpt= true;
            if( this.stickerList.map(function (el) { return el.stickerNumber; }).includes(item.stickerTypeK)  ){
              this.stickerList.map(i=>{
                if(i.stickerNumber==item.stickerTypeK){
                  newCmpt=false;
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.stickerList.push({stickerNumber:item.stickerTypeK , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }

          if (item.boxNumber!='' && item.boxNumber!='---' ) {
            let newCmpt= true;
            if( this.boxList.map(function (el) { return el.boxNumber; }).includes(item.boxNumber) ){
              this.boxList.map(i=>{
                if(i.boxNumber==item.boxNumber){
                  newCmpt=false;
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.boxList.push({boxNumber:item.boxNumber , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }
          if (item.boxTypeK!='' && item.boxTypeK!='---' ) {
            let newCmpt= true;
            if( this.boxList.map(function (el) { return el.boxNumber; }).includes(item.boxTypeK) ){
              this.boxList.map(i=>{
                if(i.boxNumber==item.boxTypeK){
                  newCmpt=false;
                  i.qnt+=parseInt(item.quantity);
                }
              });
            }else{
              if(newCmpt){
                this.boxList.push({boxNumber:item.boxTypeK , qnt:item.quantity});
                newCmpt=false;
              }
            }
          }

          if (item.cartonNumber!='' && item.cartonNumber!='---' ) {
            let newCmpt= true;
            if( this.cartonList.map(function (el) { return el.cartonNumber; }).includes(item.cartonNumber) ){
              this.cartonList.map(i=>{
                if(i.cartonNumber==item.cartonNumber){
                  newCmpt=false;
                  i.qnt= i.qnt+(item.quantity/parseInt(item.PcsCarton));
                }
              });
            }else{
              if(newCmpt){
                this.cartonList.push({cartonNumber:item.cartonNumber , qnt: (item.quantity/parseInt(item.PcsCarton)) });
                newCmpt=false;
              }
            }
          }
          
          if (item.pallet!='' && item.pallet!='---' ) {
            let newCmpt= true;
            if( this.platesList.map(function (el) { return el.palletNumber; }).includes(item.pallet) ){
              this.platesList.map(i=>{
                if(i.palletNumber==item.pallet){
                  newCmpt=false;
                }
              });
            }else{
              if(newCmpt){
                this.platesList.push({palletNumber:item.pallet });
                newCmpt=false;
              }
            }
          }
          if (item.pallet2!='' && item.pallet2!='---' ) {
            let newCmpt= true;
            if( this.platesList.map(function (el) { return el.palletNumber; }).includes(item.pallet2) ){
              this.platesList.map(i=>{
                if(i.palletNumber==item.pallet2){
                  newCmpt=false;
                }
              });
            }else{
              if(newCmpt){
                this.platesList.push({palletNumber:item.pallet2 });
                newCmpt=false;
              }
            }
          }
          if (item.pallet3!='' && item.pallet3!='---' ) {
            let newCmpt= true;
            if( this.platesList.map(function (el) { return el.palletNumber; }).includes(item.pallet3) ){
              this.platesList.map(i=>{
                if(i.palletNumber==item.pallet3){
                  newCmpt=false;
                }
              });
            }else{
              if(newCmpt){
                this.platesList.push({palletNumber:item.pallet3 });
                newCmpt=false;
              }
            }
          }

          if (item.impRemarks!='' || item.proRemarks!='' ) {
            this.itemTreeRemarks.push(item);
          }

          // if (item.cartonNumber!='' && item.cartonNumber!='---' ) {
          //   let newCmpt= true;
          //   await this.cartonList.forEach(b=>{
          //     if(b.cartonNumber==item.cartonNumber) {
          //       newCmpt=false;
          //       b.qnt+=item.quantity/parseInt(item.PcsCarton);
          //     }
          //   });
          //   if(newCmpt){
          //     this.cartonList.push({cartonNumber:item.cartonNumber , qnt:(item.quantity/parseInt(item.PcsCarton))});
          //     newCmpt=false;
          //   }
          // }
          console.log(this.bottleList);
        });
         debugger
        this.orderItemsComponents= res;
        this.cmptModal=true;
        console.log(res);
      })
    }




    /*
    FIELDS WE WANT TO GET FOR EACH ORDER_ITEM FROM ITEMS COLLECTION

    itemNumber

    stickerNumber: String,
    stickerTypeK: String,
    StickerLanguageK: String,

    boxNumber: String,
    boxTypeK: String,

    cartonNumber: String,
    PcsCarton: String,
    *** cartonNumberQnt:  =Qnt/PcsCarton: ***

    bottleNumber: String,
    capNumber: String,
    pumpNumber: String,
    sealNumber: String,
    goddet: ???


    */
  }


  // getItemWhShelfsList(orderItemsCmptArr) {

  //   return new Promise(function (resolve, reject) {
  //       if () {
  //         resolve(res);
  //       } else resolve([])
  //   });
  // }



}


