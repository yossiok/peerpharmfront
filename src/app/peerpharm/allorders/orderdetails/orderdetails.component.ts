import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import {ScheduleService} from '../../../services/schedule.service'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {
  ordersItems;
  chosenType:string;
  detailsArr:any[];
  components:any[];
  itemData:any={
    itemNumber:'',
    discription:'',
    unitMeasure:'',
    quantity:'',
    qtyKg:'',
    orderId:''
  };
  show:boolean;
  EditRowId:any="";
  EditRowId2nd:any="";
  expand:boolean=false;
  type={type:''};
  @ViewChild('weight') weight:ElementRef; 
  @ViewChild('itemRemarks') itemRemarks:ElementRef; 
  @ViewChild('quantity') quantity:ElementRef; 
  @ViewChild('unitmeasure') unitMeasure:ElementRef; 
  @ViewChild('itemname') itemName:ElementRef; 
  @ViewChild('itemnumber') itemN:ElementRef; 
  @ViewChild('id') id:ElementRef; 
  
  @ViewChild('date') date:ElementRef; 
  @ViewChild('shift') shift:ElementRef; 
  @ViewChild('marks') marks:ElementRef; 
 // @ViewChild('type') type:ElementRef; 

  constructor(private route: ActivatedRoute, private orderService: OrdersService, private scheduleService:ScheduleService, private location: Location) { }

  ngOnInit() {
    console.log('hi');
    this.getOrderItems();
    this.show=true;
  }
  
  
  getOrderItems(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderById(id).subscribe(orderItems => {
      this.ordersItems = orderItems;
      this.getComponents(this.ordersItems[0].orderNumber);
      console.log(orderItems)
    });
  }

  getComponents(orderNumber):void{
   // debugger;
    this.orderService.getComponentsSum(orderNumber).subscribe(components=>
      {
    //    debugger;
        this.components=components;
        console.log("a" + components);
      })
  }

  getDetails(itemNumber, itemId):void{
    this.EditRowId2nd=itemId;
    console.log(itemNumber +  " , " + itemId);
    this.orderService.getItemByNumber(itemNumber).subscribe(
      itemDetais=>{
        console.log(itemDetais);
        this.detailsArr=[];
        itemDetais.forEach(element => {
          if(element.bottleNumber!=null && element.bottleNumber!="") this.detailsArr.push(element.bottleNumber);
          if(element.capNumber!=null && element.capNumber!="") this.detailsArr.push(element.capNumber);
            console.log(this.detailsArr);
        });
      })
      if(this.expand===true)this.expand=false;
      else this.expand=true;
  }

  edit(id){
      this.EditRowId=id;
  }

  saveEdit(a){
    let itemToUpdate={
      'orderItemId':this.id.nativeElement.value,
      'itemN':this.itemN.nativeElement.value,
      "unitMeasure":this.unitMeasure.nativeElement.value,
      "discription":this.itemName.nativeElement.value,
      "quantity":this.quantity.nativeElement.value,
      "qtyKg":this.weight.nativeElement.value,
      "itemRemarks":this.itemRemarks.nativeElement.value,
    }
    console.log(a);
   // console.log("edit " + itemToUpdate.orderItemId );

    this.orderService.editItemOrder(itemToUpdate).subscribe(res=>console.log(res));
    
  }

  deleteItem(item){
    console.log(item._id);
    this.orderService.deleteOrderItem(item._id).subscribe(res=>console.log(res));
  }

  addItemOrder(){

    console.log(1 + " , "  +this.itemData.qtyKg);
    this.itemData.orderId = this.route.snapshot.paramMap.get('id');
    console.log(this.itemData.orderId);
    this.orderService.addNewOrderItem(this.itemData).subscribe(item=>this.ordersItems.push(item));
  }

  setSchedule(item, type){
    console.log(item);
    console.log(this.chosenType);
    console.log(this.date.nativeElement.value + " , "  + this.shift.nativeElement.value + " , " + this.marks.nativeElement.value);
    let scheduleLine = {
      positionN:'',
      orderN:item.orderNumber,
      item:item.itemNumber,
      costumer:'',
      productName:item.discription,
      batch:item.batch,
      packageP:'',
      qty:item.quantity,
      qtyRdy:'',
      date:this.date.nativeElement.value,
      marks:this.marks.nativeElement.value,
      shift:this.shift.nativeElement.value,
      mkp:this.chosenType,
      status:'open'
    }
    this.scheduleService.setNewProductionSchedule(scheduleLine).subscribe(res=>console.log(res));
    console.log(scheduleLine);
  }
}
