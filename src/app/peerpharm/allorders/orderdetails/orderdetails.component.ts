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
  ordersItems;
  item: any;
  number; orderDate; deliveryDate; costumer; remarks; orderId;
  chosenType: string;
  detailsArr: any[];
  components: any[];
  multi: boolean = false;
  itemData: any = {
    itemNumber: '',
    discription: '',
    unitMeasure: '',
    quantity: '',
    qtyKg: '',
    orderId: '',
    orderNumber:''
  };
  show: boolean;
  EditRowId: any = "";
  EditRowId2nd: any = "";
  expand: boolean = false;
  type = { type: '' };
  ordersToCheck = [];
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

  constructor(private route: ActivatedRoute,  private router:Router, private orderService: OrdersService, private scheduleService: ScheduleService, private location: Location, private toastSrv: ToastrService) { }

  ngOnInit() {
    console.log('hi');

    this.orderService.ordersArr.subscribe(res => {
      console.log(res)
      if (res.length > 0) {
        this.orderService.getMultiOrdersIds(res).subscribe(orderItems => {
          this.ordersItems = orderItems;
          this.ordersItems = this.ordersItems.map(elem => Object.assign({ expand: false }, elem));
          this.getComponents(this.ordersItems[0].orderNumber);
          this.multi = true;
          console.log(orderItems)
        });
      }
      else {
        this.getOrderDetails();
        this.getOrderItems();
        this.show = true;
        this.multi = false;
      }
    });
  }

  getOrderDetails(){
    this.number = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderByNumber(this.number).subscribe(res=>{
        this.number = res[0].orderNumber;
        this.costumer = res[0].costumer;
        this.orderDate = res[0].orderDate;
        this.deliveryDate = res[0].deliveryDate;
        this.remarks = res[0].orderRemarks;
        this.orderId = res[0]._id;
    });

  }
  getOrderItems(): void {
    this.number = this.route.snapshot.paramMap.get('id');
    document.title = "Order " +this.number;
    // const id = this.route.snapshot.paramMap.get('id');
    //this.orderService.getOrderById(id).subscribe(orderItems => {
    this.orderService.getOrderItemsByNumber(this.number).subscribe(orderItems => {
      debugger
      orderItems.map(item => {
        if (item.fillingStatus != null) {
          if (item.fillingStatus.toLowerCase() == 'filled' || item.fillingStatus.toLowerCase() == 'partfilled') item.color = '#CE90FF';
          if (item.fillingStatus.toLowerCase() == 'beingfilled' || item.fillingStatus.toLowerCase().includes("scheduled") || item.fillingStatus.toLowerCase() == 'formula porduced') item.color = 'yellow';
          if (item.fillingStatus.toLowerCase() == 'problem') item.color = 'red';
          if (item.quantityProduced != "" && item.quantityProduced != null && item.quantityProduced != undefined) {
            if (parseInt(item.quantity) >= parseInt(item.quantityProduced)) {
              let lackAmount = parseInt(item.quantity) - parseInt(item.quantityProduced);
              item.fillingStatus += ", " + lackAmount + " lack";
              item.infoColor = 'red';
            }
            else item.color = '#CE90FF';
          }
          if (item.fillingStatus == 'packed') item.color = '#FFC058';
        }

      });
      this.ordersItems = orderItems;
      this.getComponents(this.ordersItems[0].orderNumber);
      console.log(orderItems)
    });
  }

  getComponents(orderNumber): void {
    this.orderService.getComponentsSum(orderNumber).subscribe(components => {
      this.components = components;
      console.log("a" + components);
    })
  }


  getDetails(itemNumber, itemId): void {
    this.EditRowId2nd = itemId;
    // if (this.expand === true) {this.expand = false;}
    //else {this.expand = true;}

    /* this.ordersItems.forEach(element => {
       element.expand=false;
     });
     this.ordersItems.filter(elem=>elem.itemNumber==itemNumber).map(elem=>elem.expand=true);
     
     console.log(this.ordersItems.filter(elem=>elem.itemNumber==itemNumber));
     this.ordersItems.forEach(element => {
       console.log(element.itemNumber + " , "  + element.expand);
     });*/
    console.log(itemNumber + " , " + itemId);
    this.orderService.getItemByNumber(itemNumber).subscribe(
      itemDetais => {
        console.log(itemDetais);
        this.detailsArr = [];
        itemDetais.forEach(element => {
          if (element.bottleNumber != null && element.bottleNumber != "") this.detailsArr.push({ type: "bottle", number: element.bottleNumber });
          if (element.capNumber != null && element.capNumber != "") this.detailsArr.push({ type: "cap", number: element.capNumber });
          console.log(this.detailsArr);
        });
        if (this.expand === true) { this.expand = false; }
        else { this.expand = true; }
      })
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
      }

    });
  }

  deleteItem(item) {
    console.log(item._id);
    this.orderService.deleteOrderItem(item._id).subscribe(res => {
      this.toastSrv.error(item.itemN, "Item Has Been Deleted");
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
    let scheduleLine = {
      positionN: '',
      orderN: item.orderNumber,
      item: item.itemNumber,
      costumer: '',
      productName: item.discription,
      batch: item.batch,
      packageP: '',
      qty: item.quantity,
      qtyRdy: '',
      date: this.date.nativeElement.value,
      marks: this.marks.nativeElement.value,
      shift: this.shift.nativeElement.value,
      mkp: this.chosenType,
      status: 'open'
    }
    debugger
    this.scheduleService.setNewProductionSchedule(scheduleLine).subscribe(res => console.log(res));
    console.log(scheduleLine);
  }


  setBatch(item, batch) {
    let batchObj = { orderItemId: item._id, batch: batch };
    console.log(batchObj);
    this.orderService.editItemOrder(batchObj).subscribe(res => {
      console.log(res);
    })
  }


  searchItem(itemNumber) {
      this.orderService.getItemByNumber(itemNumber).subscribe(res => {
      this.itemData.discription=res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
      this.itemData.unitMeasure= res[0].volumeKey;
    })
  }

  closeOrder() {
    if (confirm("Close Order?")) {
      let orderToUpdate = {};
      orderToUpdate = { status: 'close', orderId: this.orderId }
      console.log(orderToUpdate);
      this.orderService.editOrder(orderToUpdate).subscribe(res => {
        console.log(res);
        this.router.navigate([ '/' ]); 
      });
    }
  }
}

