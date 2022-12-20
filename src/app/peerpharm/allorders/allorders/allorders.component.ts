import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { OrdersService } from "../../../services/orders.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router } from "@angular/router";
import * as moment from "moment-timezone";
import { ToastrService } from "ngx-toastr";
import { ChatService } from "src/app/shared/chat.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-allorders",
  templateUrl: "./allorders.component.html",
  styleUrls: ["./allorders.component.scss"],
})
export class AllordersComponent implements OnInit {
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private toastSrv: ToastrService,
    private chat: ChatService,
    private authService: AuthService
  ) {}

  orders: any[];
  ordersCopy: any[];
  EditRowId: any = "";
  today: any;
  sortCurrType: String = "OrderNumber";
  numberSortDir: string = "oldFirst";
  // stageSortDir:string="done";
  selectAllOrders: boolean = false;
  limit: Number = 1000;

  //private orderSrc = new BehaviorSubject<Array<string>>(["3","4","5"]);
  //private orderSrc = new BehaviorSubject<string>("");

  @ViewChild("orderRemarks") orderRemarks: ElementRef;
  @ViewChild("orderType") orderType: ElementRef;
  @ViewChild("deliveryDate") deliveryDate: ElementRef;
  @ViewChild("orderDate") orderDate: ElementRef;
  @ViewChild("costumer") costumer: ElementRef;
  @ViewChild("orderNumber") orderNumber: ElementRef;
  @ViewChild("id") id: ElementRef;
  @ViewChild("filterSatatus") filterStatus: ElementRef;
  @ViewChild("orderFilter") orderFilter: ElementRef;
  @ViewChild("itemFilter") itemFilter: ElementRef;
  @ViewChild("orderNum") orderNum: ElementRef;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.edit("");
  }

  ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format("DD/MM/YYYY");
    this.getAllOrders();
    this.chat.joinroom("orders");
    this.chat.messages.subscribe((data) => {
      console.log(data);

      if (data.msg == "order_refresh" && data.to == "allusers") {
        this.getAllOrders();
      }
    });
  }

  checkPermission() {
    return this.authService.loggedInUser.screenPermission == "5";
  }

  getAllOrders() {
    this.ordersService.getLastAllOrders(this.limit).subscribe((orders) => {
      orders.map((order) => {
        if (order.msg) {
          this.toastSrv.error(order.msg);
          return;
        }
        order.color = "white";
        if (this.today > order.deliveryDate) {
          order.color = "#ff9999";
        }
        Object.assign({ isSelected: false }, order);
        order.NumberCostumer = order.orderNumber + " " + order.costumer;
      });
      this.orders = orders;
      this.ordersCopy = orders;
      console.log(this.orders);
    });
  }

  edit(id) {
    this.EditRowId = id;
  }

  saveEdit(a, orderId) {
    let orderToUpdate = {};
    // a - is if the request is to set order - ready
    if (!a) {
      orderToUpdate = {
        orderId: this.id.nativeElement.value,
        orderNumber: this.orderNumber.nativeElement.value,
        orderDate: this.orderDate.nativeElement.value,
        orderDateConverted: this.orderDate.nativeElement.value,
        costumer: this.costumer.nativeElement.value,
        deliveryDate: this.deliveryDate.nativeElement.value,
        deliveryDateConverted: this.deliveryDate.nativeElement.value,
        orderRemarks: this.orderRemarks.nativeElement.value,
        orderType: this.orderType.nativeElement.value,
      };
      this.ordersService.editOrder(orderToUpdate).subscribe((res) => {
        let i = this.orders.findIndex((elemnt) => elemnt._id == orderId);
        orderToUpdate["status"] = "";
        this.orders[i] = orderToUpdate;
        this.EditRowId = "";
        console.log(res);
      });
    } else {
      orderToUpdate = { status: "close", orderId: orderId };
      if (confirm("Close Order?")) {
        console.log(orderToUpdate);
        this.ordersService.editOrder(orderToUpdate).subscribe((res) => {
          let i = this.orders.findIndex((elemnt) => elemnt._id == orderId);
          orderToUpdate["status"] = "";
          this.orders[i] = orderToUpdate;
          this.EditRowId = "";
          console.log(res);
        });
      }
    }
  }

  deleteOrder(order) {
    if (confirm("Delete Order?")) {
      this.ordersService.deleteOrder(order).subscribe((res) => {
        //  let i = this.orders.findIndex(elemnt => elemnt._id == order._id);
        //  delete this.orders[i];
        this.orders = this.orders.filter((elem) => elem._id != order._id);
      });
    }
  }

  // loadOrders() {
  //   console.log(this.orders);
  //   let tempArr = this.orders.filter(e => e.isSelected == true).map(e => e = e._id);
  //   this.ordersService.sendOrderData(tempArr);
  //   this.ordersService.getAllOpenOrdersItems(false);
  //   this.router.navigate(["/peerpharm/allorders/orderitems/43"]);
  //   console.log(tempArr);
  //   //this.ordersService.getMultiOrdersIds(tempArr).subscribe(res=>console.log(res));
  // }

  changeText(ev) {
    let word = ev.target.value;
    if (word == "") {
      this.orders = this.ordersCopy.slice();
    } else {
      this.orders = this.orders.filter((x) =>
        x.NumberCostumer.toLowerCase().includes(word.toLowerCase())
      );
    }
  }

  checkboxAllOrders(ev) {
    this.orders.filter((e) => (e.isSelected = ev.target.checked));
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
    this.sortCurrType = "orderNumber";
  }

  loadCheckedOrders() {
    console.log(this.orders);
    // let tempArr = this.orders.filter(e => e.isSelected == true).map(e => e = e._id);
    let tempArr = this.orders
      .filter((e) => e.isSelected == true)
      .map((e) => (e = e.orderNumber));
    if (tempArr.length > 0) {
      this.ordersService.sendOrderData(tempArr);
      this.ordersService.getAllOpenOrdersItems(false);
      let tempArrStr = "";
      tempArr.forEach((number) => {
        tempArrStr = tempArrStr + "," + number;
      });

      let urlPrefixIndex = window.location.href.indexOf("#");
      let urlPrefix = window.location.href.substring(0, urlPrefixIndex);

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

  filterByStatus(value) {
    value = value.toLowerCase();
    console.log(value);
    if (value != "all") {
      this.orders = this.ordersCopy.filter((o) => o.status == value);
      console.log(this.orders);
    } else if (value == "all") {
      this.clearFilter();
    }
  }
  filterByOrder() {
    this.itemFilter.nativeElement.value = "";
    this.orderNum.nativeElement.value = "";
    let value = this.orderFilter.nativeElement.value.toLowerCase().trim();
    console.log(value);
    if (value.length > 0) {
      this.orders = this.orders.filter((o) =>
        o.NumberCostumer.toLowerCase().includes(value)
      );
    }
  }
  filterByItem() {
    this.orderFilter.nativeElement.value = "";
    this.orderNum.nativeElement.value = "";
    let value = this.itemFilter.nativeElement.value.toLowerCase().trim();
    console.log(value);

    //////// add the
    this.ordersService.getOrdersByItemNumber(value).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
        return;
      } else if (data) {
        data.map((oi) => {
          oi.costumer = oi.customerName;

          oi.color = "white";
          if (this.today > oi.deliveryDate) {
            oi.color = "#ff9999";
          }
          oi.isSelected = false;
          oi.NumberCostumer = oi.orderNumber + " " + oi.customerName;
        });
        this.orders = data;
      } else {
        this.toastSrv.error("הפריט לא נמצא בהזמנות");
        return;
      }
    });
  }

  findByOrder() {
    this.orderFilter.nativeElement.value = "";
    this.itemFilter.nativeElement.value = "";
    let orderNumber = this.orderNum.nativeElement.value;
    this.ordersService.getOrderByNumber(orderNumber).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
        return;
      } else if (data.length > 0) {
        data.map((oi) => {
          oi.costumer = oi.customerName;

          oi.color = "white";
          if (this.today > oi.deliveryDate) {
            oi.color = "#ff9999";
          }
          oi.isSelected = false;
          oi.NumberCostumer = oi.orderNumber + " " + oi.customerName;
        });
        this.orders = data;
      } else if (data.length == 0) {
        this.toastSrv.error("מספר הזמנה לא קיים");
        return;
      }
    });
  }

  clearFilter() {
    this.orders = this.ordersCopy;
    this.orderFilter.nativeElement.value = "";
    this.itemFilter.nativeElement.value = "";
    this.orderNum.nativeElement.value = "";
  }

  getValue = (date: string | Date | null | undefined) => {
    return date ? moment(date).tz("utc").format("YYYY-MM-DD") : null;
  }
}
