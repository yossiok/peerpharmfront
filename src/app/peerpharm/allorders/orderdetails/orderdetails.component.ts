import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { ScheduleService } from '../../../services/schedule.service'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';
import { Observable, of } from 'rxjs';


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
export class OrderdetailsComponent implements OnInit  {
  ordersItems;
  item: any;
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
    orderId: ''
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
  @ViewChild('itemnumber') itemN: ElementRef;
  @ViewChild('id') id: ElementRef;

  @ViewChild('date') date: ElementRef;
  @ViewChild('shift') shift: ElementRef;
  @ViewChild('marks') marks: ElementRef;
  // @ViewChild('type') type:ElementRef; 

  constructor(private route: ActivatedRoute, private orderService: OrdersService, private scheduleService: ScheduleService, private location: Location) { }

  ngOnInit() {
    console.log('hi');

    this.orderService.ordersArr.subscribe(res => {
      console.log(res)
      if (res.length > 0) {
        this.orderService.getMultiOrdersIds(res).subscribe(orderItems => {
          this.ordersItems = orderItems;
          this.ordersItems=this.ordersItems.map(elem=> Object.assign({ expand: false }, elem));
          this.getComponents(this.ordersItems[0].orderNumber);
          this.multi = true;
          console.log(orderItems)
        });
      }
      else {
        this.getOrderItems();
        this.show = true;
        this.multi = false;
      }
    });
  }


  getOrderItems(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderById(id).subscribe(orderItems => {
      this.ordersItems = orderItems;
      this.ordersItems=this.ordersItems.map(elem=> Object.assign({ expand: false }, elem));
      this.getComponents(this.ordersItems[0].orderNumber);
      console.log(orderItems)
    });
  }

  getComponents(orderNumber): void {
    debugger;
    this.orderService.getComponentsSum(orderNumber).subscribe(components => {
      //    debugger;
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
          if (element.bottleNumber != null && element.bottleNumber != "") this.detailsArr.push({type:"bottle", number:element.bottleNumber});
          if (element.capNumber != null && element.capNumber != "") this.detailsArr.push({type:"cap", number:element.capNumber});
          console.log(this.detailsArr);
        });
          if (this.expand === true) {this.expand = false;}
          else {this.expand = true;}
      })
  }

  edit(id) {
    this.EditRowId = id;
  }

  saveEdit(a) {
    let itemToUpdate = {

      'orderItemId': this.id.nativeElement.value,
      'itemN': this.itemN.nativeElement.value,
      "unitMeasure": this.unitMeasure.nativeElement.value,
      "discription": this.itemName.nativeElement.value,
      "quantity": this.quantity.nativeElement.value,
      "qtyKg": this.weight.nativeElement.value,
      "itemRemarks": this.itemRemarks.nativeElement.value,
    }
    console.log(a);
    // console.log("edit " + itemToUpdate.orderItemId );

    this.orderService.editItemOrder(itemToUpdate).subscribe(res => console.log(res));

  }

  deleteItem(item) {
    console.log(item._id);
    this.orderService.deleteOrderItem(item._id).subscribe(res => console.log(res));
  }

  addItemOrder() {

    console.log(1 + " , " + this.itemData.qtyKg);
    this.itemData.orderId = this.route.snapshot.paramMap.get('id');
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
    this.scheduleService.setNewProductionSchedule(scheduleLine).subscribe(res => console.log(res));
    console.log(scheduleLine);
  }

} /*
displayedColumns = ['position', 'name', 'weight'];
dataSource = new ExampleDataSource();

isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
expandedElement: any;
}

export interface Element {
name: string;
position: number;
weight: number;
symbol: string;
}

const data: Element[] = [
{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
{ position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
{ position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
{ position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
{ position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
{ position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
{ position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
{ position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
{ position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
{ position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
{ position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
{ position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
{ position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
{ position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
{ position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
{ position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
{ position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
{ position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];



export class ExampleDataSource extends DataSource<any> {
connect(): Observable<Element[]> {
  const rows = [];
  data.forEach(element => rows.push(element, { detailRow: true, element }));
  console.log(rows);
  return of(rows);
}

disconnect() { }
}
*/

