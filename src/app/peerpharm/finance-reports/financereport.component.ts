import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { OrdersService } from "../../services/orders.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { ChatService } from "src/app/shared/chat.service";
import { AuthService } from "src/app/services/auth.service";
import { FormsService } from "src/app/services/forms.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-finance-report",
  templateUrl: "./financereport.component.html",
  styleUrls: ["./financereport.component.scss"],
})
export class FinanceReportComponent implements OnInit {
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private toastSrv: ToastrService,
    private chat: ChatService,
    private authService: AuthService,
    private formService: FormsService
  ) {}
  orders: any[];
  ordersCopy: any[];
  EditRowId: any = "";
  today: any;
  sortCurrType: String = "OrderNumber";
  numberSortDir: string = "oldFirst";
  // stageSortDir:string="done";
  selectAllOrders: boolean = false;
  financeReport: any[];
  filteredOrders: any[];

  async ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format("DD/MM/YYYY");

    this.getAllOrdersFinance();
  }

  getAllOrdersFinance() {
    this.ordersService
      .getAllOrders()
      .pipe(finalize(() => this.getAllPackedBills()))
      .subscribe((orders) => {
        // console.log(orders);
        const thisYear = new RegExp("2021");
        let currentYearOrders = orders.filter((order) => {
          console.log(order.deliveryDate);
          console.log(thisYear.test(order.deliveryDate));
          if (thisYear.test(order.deliveryDate) && order.status == "close")
            return order;
        });
        this.financeReport = currentYearOrders;
        for (let order of this.financeReport) {
          console.log("Status: " + order.status);
          console.log("Stage: " + order.Stage);
          console.log("DeliveryDate: " + order.deliveryDate);
          console.log("Order Number: " + order.orderNumber);
          console.log("Object ID: " + order._id);
          console.log("Delivery Date: " + order.deliveryDate);
        }
        console.log(this.financeReport);
      });
  }

  getAllPackedBills() {
    this.formService.getAllReadyBills().subscribe((data) => {
      console.log(data);
      let i = 1;
      let orderItems = [];
      for (let item of data) {
        console.log(item);
        for (let customer of item.pallets) {
          console.log("customer of data.pallets");
          console.log(customer);
          if (customer.lines) {
            for (let line of customer.lines) {
              console.log("Start of line number: " + i);
              console.log("Item number: " + line.itemNumber);
              console.log("Item Name: " + line.itemName);
              console.log("Order Number: " + line.orderNumber);
              console.log("Order Amount: " + line.orderAmount);
              console.log("Units supplied: " + line.unitsToCombine);
              console.log("End of line number: " + i);

              let orderItem = {
                orderNumber: line.orderNumber,
                itemNumber: line.itemNumber,
                orderAmount: line.orderAmount,
                quantitySupplied: line.unitsToCombine ? line.unitsToCombine : 0,
                quantityRemained: line.orderAmount - line.unitsToCombine,
              };

              let index = orderItems.findIndex((o) => {
                return (
                  o.orderNumber == orderItem.orderNumber &&
                  o.itemNumber == orderItem.itemNumber
                );
              });
              console.log(index);
              if (index == -1) {
                orderItems.push(orderItem);
                console.log(i + ": Pushed");
              } else {
                orderItems[index].quantitySupplied +=
                  orderItem.quantitySupplied;
                orderItems[index].quantityRemained -=
                  orderItem.quantityRemained;
                console.log(orderItems[index]);
              }
              i++;
              console.log("Iteration no.: " + i);
            }
          } else {
            console.log("No lines were found");
            console.log("Start of customer number: " + i);
            console.log("Item number: " + customer.itemNumber);
            console.log("Item Name: " + customer.itemName);
            console.log("Order Number: " + customer.orderNumber);
            console.log("Order Amount: " + customer.orderAmount);
            console.log("Units supplied: " + customer.unitsToCombine);
            console.log("End of customer number: " + i);

            let orderItem = {
              orderNumber: customer.orderNumber,
              itemNumber: customer.itemNumber,
              orderAmount: customer.orderAmount,
              quantitySupplied: customer.unitsToCombine
                ? customer.unitsToCombine
                : 0,
              quantityRemained: customer.orderAmount - customer.unitsToCombine,
            };

            let index = orderItems.findIndex((o) => {
              o.orderNumber == orderItem.orderNumber &&
                o.itemNumber == orderItem.itemNumber;
            });
            console.log(index);
            if (index == -1) {
              orderItems.push(orderItem);
              console.log(i + ": Pushed");
            } else {
              orderItems[index].quantitySupplied += orderItem.quantitySupplied;
              orderItems[index].quantityRemained -= orderItem.quantityRemained;
              console.log(orderItems[index]);
            }
            i++;
            console.log("Iteration no.: " + i);
          }
        }
      }
      console.log("orderItems: ");
      console.log(orderItems);
      this.filteredOrders = [];

      for (let item of orderItems) {
        for (let order of this.financeReport) {
          if (item.orderNumber == order.orderNumber) {
            item.deliveryDate = order.deliveryDate;
            this.filteredOrders.push(item);
          }
        }
      }

      console.log(this.filteredOrders);
    });
  }
}
