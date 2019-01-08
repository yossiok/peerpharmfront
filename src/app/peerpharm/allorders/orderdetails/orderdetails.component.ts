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
  number; orderDate; deliveryDate; costumer; remarks; orderId;
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
  packingItemN="";
  openPackingModalHeader="";
  itemPackingList:Array<any>=[];
  itemPackingPalletsArr:Array<any>=[];
  orderPalletsArr:Array<any>=[];
  orderPackingList:Array<any>=[];

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
     private scheduleService: ScheduleService, private location: Location, private plateSer:PlateService,  private toastSrv: ToastrService) { }

     openPackingModal(itemNumber, index){
      this.packingItemN=itemNumber;
       this.orderService.getItemPackingList(itemNumber).subscribe(itemPackingList=>{
          this.itemPackingList=itemPackingList;

       });
       this.orderService.getOrderPackingList(this.number).subscribe(orderPackingList=>{
          this.orderPackingList=orderPackingList;
          
          this.orderPackingList.forEach(element => {
            if(!this.orderPalletsArr.includes(element.palletNumber)){
              this.orderPalletsArr.push(element.palletNumber);
            }            
          });
          
          debugger
       });
      this.openPackingModalHeader="אריזת פריט מספר  "+ this.packingItemN;
      this.packingModal=true;


    }

    
  ngOnInit() {
    console.log('hi');
    this.orderService.openOrdersValidate.subscribe(res=>{
      this.number = this.route.snapshot.paramMap.get('id');

      if(res==true || this.number=="00"){
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

          this.orderService.ordersArr.subscribe(res => {
            console.log(res)
            var numArr = this.number.split(",").filter(x=>x!="");
            if(numArr.length>0){
              this.orderService.getOrdersIdsByNumbers(numArr).subscribe(ordersIds => {
                debugger
                if(ordersIds.length>1){
                  this.orderService.getMultiOrdersIds(ordersIds).subscribe(orderItems => {
                    orderItems.forEach(item => {
                      item.isExpand = '+';
                      item.colorBtn = '#33FFE0';
                    });
                    this.ordersItems = orderItems;
                    this.multi = false;
                    console.log(orderItems);
                  });
                }else {  //one order:
                  debugger
                  this.getOrderDetails();
                  this.getOrderItems();
                  this.show = true;
                  this.multi = false;
                }

              });
            } else {  //one order:
              debugger
              this.getOrderDetails();
              this.getOrderItems();
              this.show = true;
              this.multi = false;
            }

            // if (res.length > 0) { // if the request is for few orders:
            //   this.orderService.getMultiOrdersIds(res).subscribe(orderItems => {
            //     this.ordersItems = orderItems;
            //    // this.ordersItems = this.ordersItems.map(elem => Object.assign({ expand: false }, elem));
            //    // this.getComponents(this.ordersItems[0].orderNumber);
            //     this.multi = true;
            //     console.log(orderItems)
            //   });
            // } 

          });
      }
    })

    
  }

  getOrderDetails() {
    this.number = this.route.snapshot.paramMap.get('id');
    debugger
    this.orderService.getOrderByNumber(this.number).subscribe(res => {
      this.number = res[0].orderNumber;
      this.costumer = res[0].costumer;
      this.orderDate = res[0].orderDate;
      this.deliveryDate = res[0].deliveryDate;
      this.remarks = res[0].orderRemarks;
      this.orderId = res[0]._id;
      debugger
    });

  }
  getOrderItems(): void {
    this.number = this.route.snapshot.paramMap.get('id');
    document.title = "Order " + this.number;
    // const id = this.route.snapshot.paramMap.get('id');
    //this.orderService.getOrderById(id).subscribe(orderItems => {    
    this.orderService.getOrderItemsByNumber(this.number).subscribe( orderItems => {
      orderItems.map( item => {

            //add license to item
      //////////////////CHECK IF ITEM HAVE LICENSE////////////////////////////
           
            // this.orderService.getItemByNumber(item.itemNumber).subscribe(
            //   itemDetais => { 
            //     debugger;
            //       item.licsensNumber=itemDetais.licsensNumber;
            //       item.licsensExp=itemDetais.licsensDate;
            //   });
      //////////////////////////////////////////////
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

      this.ordersItems = orderItems;
      // this.OrderCompileData(this.number);
      this.getComponents(this.ordersItems[0].orderNumber);
      console.log(orderItems)
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
    if (this.EditRowId == id) this.EditRowId = '';
    else this.EditRowId = id;

  }

  saveEdit(a) {
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
        debugger
        this.toastSrv.success(itemToUpdate.itemNumber, "Changes Saved");
        this.EditRowId = "";
        let index = this.ordersItems.findIndex(order => order._id == itemToUpdate.orderItemId);
        this.ordersItems[index] = itemToUpdate;
        this.ordersItems[index]._id = itemToUpdate.orderItemId;
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

  addItemOrder() {

    // console.log(1 + " , " + this.itemData.qtyKg);
    this.itemData.orderId = this.orderId;
    this.itemData.orderNumber = this.number;
    console.log(this.itemData.orderId);
    this.orderService.addNewOrderItem(this.itemData).subscribe(item => this.ordersItems.push(item));
  }

  setSchedule(item, type) {
    console.log(item);
    console.log(this.chosenType);
    console.log(this.date.nativeElement.value + " , " + this.shift.nativeElement.value + " , " + this.marks.nativeElement.value);
    this.itemSer.getItemData(item.itemNumber).subscribe(res => {
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
      marks: this.marks.nativeElement.value,
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
  }


  setBatch(item, batch, existBatch) {
    let updatedBatch;
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
      this.toastSrv.success(updatedBatch , "Changes Saved");
    });

  }

  updateBatchExist(item , batch){
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
    this.orderService.getItemByNumber(itemNumber).subscribe(res => {
      this.itemData.discription = res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
      this.itemData.unitMeasure = res[0].volumeKey;
    })
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
    console.log(this.printSchedule);
    this.printSchedule.orderN = this.number;
    this.printSchedule.costumer = this.costumer;
    this.scheduleService.setNewPrintSchedule(this.printSchedule).subscribe(res=>{
      this.toastSrv.success("Saved", this.printSchedule.cmptN);
    })

  }

  openDetails(content, item, cmpt) {
    this.itemSer.getPlateImg(item.itemNumber).subscribe(data=>{
       this.plateImg = data.palletImg;
       this.printSchedule.block = data.palletNumber;
       this.printSchedule.blockImg = data.palletImg;
    })
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



  changeText(ev)
  {
    let word= ev.target.value;
    if(word=="")
    {
      this.ordersItems=this.ordersItemsCopy.slice();
    }
    else
    { 
      this.ordersItems= this.ordersItems.filter(x=>x.itemFullName.toLowerCase().includes(word.toLowerCase())); 
    }
  }
}


