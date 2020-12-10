import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { OrdersService } from '../../../services/orders.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IfStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { log } from 'util';
import { ChatService } from 'src/app/shared/chat.service';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(private chat:ChatService,private ordersService: OrdersService, private router: Router, private toastSrv: ToastrService) { }
  orders: any[];
  ordersCopy: any[];
  EditRowId: any = "";
  today: any;
  selectAllOrders: boolean = false;
  newOrderModal: boolean = false;
  onHoldStrDate: String;
  stageSortDir: string = "done";
  numberSortDir: string = "oldFirst";
  sortCurrType: String = "OrderNumber";
  stagesCount = {
    new: 0,
    partialCmpt: 0,
    allCmpt: 0,
    production: 0,
    prodFinish: 0,
    done: 0,
  }
  //private orderSrc = new BehaviorSubject<Array<string>>(["3","4","5"]);
  //private orderSrc = new BehaviorSubject<string>("");

  @ViewChild('orderRemarks') orderRemarks: ElementRef;
  @ViewChild('orderType') orderType: ElementRef;
  @ViewChild('deliveryDate') deliveryDate: ElementRef;
  @ViewChild('orderDate') orderDate: ElementRef;
  @ViewChild('customerOrderNum') customerOrderNum: ElementRef;
  @ViewChild('costumer') costumer: ElementRef;
  @ViewChild('orderNumber') orderNumber: ElementRef;
  @ViewChild('id') id: ElementRef;
  @ViewChild('stage') stage: ElementRef;
  @ViewChild('onHoldDate') onHoldDate: ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent): void {

    if (event.key === 'F2') {
      if (this.newOrderModal == true) {
        this.newOrderModal = false;
      } else {
        this.newOrderModal = true;
      }
    }

  }
  
  ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format("DD/MM/YYYY");
    this.getOrders();
    this.checkfunc();
    this.chat.joinroom("orders");
    this.chat.messages.subscribe(data => {
      console.log(data);
      if (data.msg == "order_refresh" && data.to == "allusers") {
     this.getOrders();
      } 
    })
  }

  checkfunc(){ 
    this.ordersService.refreshOrders.subscribe(order=>{
    
      this.orders.push(order)
    })
  }


  getOrders() {
    this.ordersService.getOrders()
      .subscribe(orders => {
        orders.map(order => {
          order.color = 'white'
          let deliveryDateArr;
          if (order.deliveryDate.includes("/")) {
            deliveryDateArr = order.deliveryDate.split("/");
            if (deliveryDateArr[0].split() == 1) {
              deliveryDateArr[0] = "0" + deliveryDateArr[0]
            }
            if (deliveryDateArr[1].split() == 1) {
              deliveryDateArr[1] = "0" + deliveryDateArr[1]
            }
          } else {
            deliveryDateArr = order.deliveryDate.split("-");
            let tempV = deliveryDateArr[0];
            deliveryDateArr[0] = deliveryDateArr[2];
            deliveryDateArr[2] = tempV;

            order.deliveryDate = deliveryDateArr[0] + "/" + deliveryDateArr[1] + "/" + deliveryDateArr[2];
          }
          let todayDateArr = this.today.split("/");
          if (parseInt(deliveryDateArr[2]) < parseInt(todayDateArr[2])) {
            //RED
            order.color = '#ff9999';
          } else {
            if (parseInt(deliveryDateArr[1]) < parseInt(todayDateArr[1])
              && parseInt(deliveryDateArr[2]) == parseInt(todayDateArr[2])) {
              //RED
              order.color = '#ff9999';
            } else if (parseInt(deliveryDateArr[0]) < parseInt(todayDateArr[0])
              && parseInt(deliveryDateArr[1]) == parseInt(todayDateArr[1])) {
              //RED
              order.color = '#ff9999';
            }
          }

          this.returnStageColor(order);
          Object.assign({ isSelected: false }, order);
          order.NumberCostumer = order.orderNumber + " " + order.costumer;

        });
        this.orders = orders;
        this.ordersCopy = orders;
      })
  }


  returnStageColor(order) {
    if (order.stage == "new") {
      order.stageColor = "white";
      this.stagesCount.new++;
    } else if (order.stage == "partialCmpt") {
      order.stageColor = "#ffa64d";
      this.stagesCount.partialCmpt++;
    } else if (order.stage == "allCmpt") {
      order.stageColor = "#ffff80";
      this.stagesCount.allCmpt++;
    } else if (order.stage == "production") {
      order.stageColor = "#b3ecff";
      this.stagesCount.production++;
    } else if (order.stage == "prodFinish") {
      order.stageColor = "#d9b3ff";
      this.stagesCount.prodFinish++;
    } else if (order.stage == "done") {
      order.stageColor = "#9ae59a";
      this.stagesCount.done++;
    }
  }

  edit(id) {
    this.EditRowId = id;
 
    if (id != '') {
      let i = this.orders.findIndex(elemnt => elemnt._id == id);
      if (this.orders[i].onHoldDate != null && this.orders[i].onHoldDate != "" && this.orders[i].onHoldDate != undefined) {
        this.onHoldStrDate = moment(this.orders[i]).format('YYYY-MM-DD');
      }
    }
  }


  saveEdit(closedOrder, orderId) {
  debugger;
    // a - is if the request is to set order - ready
    if (!closedOrder) {
      let orderToUpdate = {
        orderId: this.id.nativeElement.value,
        orderNumber: this.orderNumber.nativeElement.value,
        orderDate: this.orderDate.nativeElement.value,
        costumer: this.costumer.nativeElement.value,
        deliveryDate: this.deliveryDate.nativeElement.value,
        orderRemarks: this.orderRemarks.nativeElement.value,
        orderType: this.orderType.nativeElement.value,
        stage: this.stage.nativeElement.value,
        customerOrderNum:this.customerOrderNum.nativeElement.value
        
        
      }
  

      this.ordersService.editOrder(orderToUpdate).subscribe(res => {
        if (res != "order missing") {


          let i = this.orders.findIndex(elemnt => elemnt._id == orderId);
          // orderToUpdate['status'] = this.orders[i].status;
          orderToUpdate['color'] = this.orders[i].color;
          orderToUpdate['stageColor'] = this.orders[i].stageColor;
          orderToUpdate['NumberCostumer'] = this.orders[i].NumberCostumer;
          orderToUpdate['isSelected'] = this.orders[i].isSelected;
          this.orders[i] = res[0];
          this.orders[i].color = orderToUpdate['color'];
          this.returnStageColor(this.orders[i]);
          this.orders[i].NumberCostumer = orderToUpdate['NumberCostumer'];
          this.orders[i].isSelected = orderToUpdate['isSelected'];
          this.EditRowId = '';
          this.toastSrv.success("Changes Saved!")

          console.log(res);
        } else {
          this.toastSrv.error("Changes Not Saved")
        }
      });
    }
    else {
      if (orderId.id != '') {
        console.log('this.orders before', this.orders)
        let orderToUpdate = { status: 'close', orderId: orderId, stage: 'done' }
        if (confirm("Close Order?")) {
          console.log(orderToUpdate);
          this.ordersService.editOrder(orderToUpdate).subscribe(res => {
            if (res != "order missing") {
              let i = this.orders.findIndex(elemnt => elemnt._id == orderId);
              orderToUpdate['status'] = "";
              orderToUpdate['stage'] = "done";
              // this.orders[i] = orderToUpdate;
           
              this.orders.splice(i, 1);
              console.log('this.orders after', this.orders)

              // this.orders[i] = res;
              this.EditRowId = '';
              this.toastSrv.success("Order Closed!");
              console.log(res)
            }

          });
        }
      } else {
        if (confirm('לא נשמרו שינויים להזמנה')) {
          this.EditRowId = '';
        }
      }

    }
  }


  deleteOrder(order) {
  
    if (confirm("Delete Order?")) {
      this.ordersService.deleteOrder(order).subscribe(res => {
        //  let i = this.orders.findIndex(elemnt => elemnt._id == order._id);
        //  delete this.orders[i];
        this.orders = this.orders.filter(elem => elem._id != order._id);
      });
    }
  }

  loadOrders() {
    console.log(this.orders);
    // let tempArr = this.orders.filter(e => e.isSelected == true).map(e => e = e._id);
    let tempArr = this.orders.filter(e => e.isSelected == true).map(e => e = e.orderNumber);
    if (tempArr.length > 0) {
      this.ordersService.sendOrderData(tempArr);
      this.ordersService.getAllOpenOrdersItems(false);
      let tempArrStr = "";
      tempArr.forEach(number => {
        tempArrStr = tempArrStr + "," + number;
      });

      let urlPrefixIndex = window.location.href.indexOf("#");
      let urlPrefix = window.location.href.substring(0, urlPrefixIndex)
  
      window.open(urlPrefix + "#/peerpharm/allorders/orderitems/" + tempArrStr);
      // this.router.navigate(["/peerpharm/allorders/orderitems/"+tempArrStr]); // working good but in the same tab
    } else {
      this.toastSrv.error("0 Orders selected");
    }

  }

  loadOrdersItems() {
    this.ordersService.getAllOpenOrdersItems(true);
    let urlPrefixIndex = window.location.href.indexOf("#");
    let urlPrefix = window.location.href.substring(0, urlPrefixIndex);
    window.open(urlPrefix + "#/peerpharm/allorders/orderitems/00");
    // this.router.navigate(["/peerpharm/allorders/orderitems/00"]);
  }

  changeText(ev) {
 
    let word = ev.target.value;
    let wordsArr = word.split(" ");
    wordsArr = wordsArr.filter(x => x != "");
    if (wordsArr.length > 0) {
      let tempArr = [];
      this.ordersCopy.filter(x => {
        var check = false;
        var matchAllArr = 0;
        wordsArr.forEach(w => {
          if (x.NumberCostumer.toLowerCase().includes(w.toLowerCase())) {
            matchAllArr++
          }
          (matchAllArr == wordsArr.length) ? check = true : check = false;
        });

        if (!tempArr.includes(x) && check) tempArr.push(x);
      });
      this.orders = tempArr;
    } else {
      this.orders = this.ordersCopy.slice();
    }
  }
  
  filterOrdersByArea(ev){ 
  let orderArea = ev.target.value
  this.ordersService.getOrdersByArea(orderArea).subscribe(data=>{
  this.orders = data;
  })

  }
  searchByType(ev) { 
    debugger;
    let word = ev.target.value;
    if (word != "") {
  
      if (word == "Cosmetic") {
        this.orders = this.ordersCopy
        var tempArr = this.orders.filter(x => x.type == "Cosmetic")
        this.orders = tempArr
      }

      if (word == "Make Up") {
        this.orders = this.ordersCopy
        var tempArr = this.orders.filter(x => x.type == "Make Up")
        this.orders = tempArr
      }

      if (word == "Cosmetic & MakeUp") {
        this.orders = this.ordersCopy
        var tempArr = this.orders.filter(x => x.type == "Cosmetic & Make Up")
        this.orders = tempArr
      }

    } else {
      this.orders = this.ordersCopy
    }



  }


  checkboxAllOrders(ev) {
    this.orders.filter(e => e.isSelected = ev.target.checked)
  }

  sortOrdersByStage() {

    var tempArr = [], stageNewArr = [], stagePartialCmptArr = [], stageAllCmptArr = [], stageProductionArr = [], stageProdFinishArr = [], stageDoneArr = [];

    this.orders.forEach((order, key) => {
      if (order.stage == "new") {
        stageNewArr.push(order);
      } else if (order.stage == "partialCmpt") {
        stagePartialCmptArr.push(order);
      } else if (order.stage == "allCmpt") {
        stageAllCmptArr.push(order);
      } else if (order.stage == "production") {
        stageProductionArr.push(order);
      } else if (order.stage == "prodFinish") {
        stageProdFinishArr.push(order);
      } else if (order.stage == "done") {
        stageDoneArr.push(order);
      } else {
     
      }

      if (key + 1 == this.orders.length) {
   
      }
      if ((stageNewArr.length + stagePartialCmptArr.length + stageAllCmptArr.length + stageProductionArr.length + stageProdFinishArr.length + stageDoneArr.length) == this.orders.length) {
      
        if (this.stageSortDir == "new") {
          stageDoneArr.map(order => tempArr.push(order))
          stageProdFinishArr.map(order => tempArr.push(order))
          stageProductionArr.map(order => tempArr.push(order))
          stageAllCmptArr.map(order => tempArr.push(order))
          stagePartialCmptArr.map(order => tempArr.push(order))
          stageNewArr.map(order => tempArr.push(order))
          this.stageSortDir = "done";
        }
        else if (this.stageSortDir == "done") {
          stageNewArr.map(order => tempArr.push(order))
          stagePartialCmptArr.map(order => tempArr.push(order))
          stageAllCmptArr.map(order => tempArr.push(order))
          stageProductionArr.map(order => tempArr.push(order))
          stageProdFinishArr.map(order => tempArr.push(order))
          stageDoneArr.map(order => tempArr.push(order))
          this.stageSortDir = "new";
        }
        this.orders = tempArr;
        this.sortCurrType = "stage"
      }
    });
  }

  sortOrdersByOrderNumber() {
    if (this.sortCurrType != "orderNumber") this.orders = this.ordersCopy;
    if (this.numberSortDir == "oldFirst") {
      this.orders = this.orders.reverse();
      this.numberSortDir = "newFirst";
    } else if (this.numberSortDir == "newFirst") {
      this.orders = this.orders.reverse();
      this.numberSortDir = "oldFirst";
    }
    this.sortCurrType = "orderNumber"

  }


}
