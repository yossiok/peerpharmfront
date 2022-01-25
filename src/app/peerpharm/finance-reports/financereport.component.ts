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
import { ItemsService } from "src/app/services/items.service";
import { FormulesService } from "src/app/services/formules.service";
import { InventoryService } from "src/app/services/inventory.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { Currencies } from "../procurement/Currencies";
import { ExcelService } from "src/app/services/excel.service";
import { filter } from "lodash";
import { ConsoleLogger } from "@aws-amplify/core";
import { FinanceService } from "src/app/services/finance.service";

@Component({
  selector: "app-finance-report",
  templateUrl: "./financereport.component.html",
  styleUrls: ["./financereport.component.scss"],
})
export class FinanceReportComponent implements OnInit {
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private toastr: ToastrService,
    private itemService: ItemsService,
    private authService: AuthService,
    private formService: FormsService,
    private formuleService: FormulesService,
    private invtSer: InventoryService,
    private procuremetnService: Procurementservice,
    private excelService: ExcelService,
    private financeService: FinanceService
  ) {}
  orders: any[];
  ordersCopy: any[];
  EditRowId: any = "";
  today: any;
  sortCurrType: String = "OrderNumber";
  numberSortDir: string = "oldFirst";
  // stageSortDir:string="done";
  getAllOrders: boolean = false;
  financeReport: any[];
  filteredOrders: any[];
  item: any;
  itemComponents: any[];
  customersForItem: any[] = [];
  selectedComponent: any;
  totalItemPrice: number = 0;
  totalShippingPrice: number = 0;
  calculating: boolean = false;
  loadingCustomers: boolean = false;
  showOrders: boolean;
  showSuppliers: boolean;
  showCustomers: boolean;
  selectedStatus: string = "open";
  allItemNames: any[];
  currentNames: any[] = [];
  allowed: boolean = false;
  allComponents: any;
  waitingText: string = "Getting item data...";
  currencies: Currencies;
  excelData: any[];
  allSalesByCMX: any[];
  itemCounter: number = 0;
  itemGroupOne: any[];
  itemGroupTwo: any[];
  itemGroupThree: any[];
  itemGroupFour: any[];
  itemGroupFive: any[];
  itemGroupSix: any[];
  end: number = 0;
  salescostreports: any[] = [];
  loader: boolean = false;
  itemType: string;
  itemsList: any[];

  async ngOnInit() {
    this.today = new Date();
    this.today = moment(this.today).format("DD/MM/YYYY");

    // this.getAllOrdersFinance();
    this.getCurrencies();
    // this.getAllSalesByCMX();
  }
  getCurrencies() {
    this.procuremetnService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      console.log(this.currencies);
    });
  }

  getAllOrdersFinance() {
    this.getAllOrders = false;
    this.ordersService
      .getAllOrders()
      .pipe(finalize(() => this.getAllPackedBills()))
      .subscribe((orders) => {
        // console.log(orders);

        const thisYear = new RegExp("2021");
        let currentYearOrders = orders.filter((order) => {
          // console.log(order.deliveryDate);
          // console.log(thisYear.test(order.deliveryDate));
          // if (thisYear.test(order.deliveryDate) && order.status == "close")
          if (thisYear.test(order.deliveryDate)) return order;
        });
        this.financeReport = currentYearOrders;
        for (let order of this.financeReport) {
          // console.log("Status: " + order.status);
          // console.log("Stage: " + order.Stage);
          // console.log("DeliveryDate: " + order.deliveryDate);
          // console.log("Order Number: " + order.orderNumber);
          // console.log("Object ID: " + order._id);
          // console.log("Delivery Date: " + order.deliveryDate);
        }
        console.log(this.financeReport);
      });
  }

  getAllPackedBills() {
    this.formService
      .getAllReadyBills()
      .pipe(finalize(() => this.getItemComponents()))
      .subscribe((data) => {
        console.log(data);
        let i = 1;
        let orderItems = [];
        for (let item of data) {
          // console.log(item);
          for (let customer of item.pallets) {
            // console.log("customer of data.pallets");
            // console.log(customer);
            if (customer.lines) {
              for (let line of customer.lines) {
                // console.log("Start of line number: " + i);
                // console.log("Item number: " + line.itemNumber);
                // console.log("Item Name: " + line.itemName);
                // console.log("Order Number: " + line.orderNumber);
                // console.log("Order Amount: " + line.orderAmount);
                // console.log("Units supplied: " + line.unitsToCombine);
                // console.log("End of line number: " + i);

                let orderItem = {
                  orderNumber: line.orderNumber,
                  itemNumber: line.itemNumber,
                  orderAmount: line.orderAmount,
                  quantitySupplied: line.unitsToCombine
                    ? line.unitsToCombine
                    : 0,
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
              // console.log("No lines were found");
              // console.log("Start of customer number: " + i);
              // console.log("Item number: " + customer.itemNumber);
              // console.log("Item Name: " + customer.itemName);
              // console.log("Order Number: " + customer.orderNumber);
              // console.log("Order Amount: " + customer.orderAmount);
              // console.log("Units supplied: " + customer.unitsToCombine);
              // console.log("End of customer number: " + i);

              let orderItem = {
                orderNumber: customer.orderNumber,
                itemNumber: customer.itemNumber,
                orderAmount: customer.orderAmount,
                quantitySupplied: customer.unitsToCombine
                  ? customer.unitsToCombine
                  : 0,
                quantityRemained:
                  customer.orderAmount - customer.unitsToCombine,
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
                orderItems[index].quantitySupplied +=
                  orderItem.quantitySupplied;
                orderItems[index].quantityRemained -=
                  orderItem.quantityRemained;
                console.log(orderItems[index]);
              }
              i++;
              console.log("Iteration no.: " + i);
            }
          }
        }
        // console.log("orderItems: ");
        // console.log(orderItems);
        this.filteredOrders = [];

        for (let item of orderItems) {
          for (let order of this.financeReport) {
            if (item.orderNumber == order.orderNumber) {
              item.deliveryDate = order.deliveryDate;
              this.filteredOrders.push(item);
              console.log(item);
            }
          }
        }

        console.log(this.filteredOrders);
      });
  }

  getAllSalesByCMX(group) {
    this.loader = true;
    this.filteredOrders = [];
    this.ordersService
      .getAllSalesByCMX()
      .pipe(finalize(() => this.getItemComponents()))
      .subscribe((data) => {
        this.end = Number(group);
        this.itemsList = [...data];
        this.filteredOrders = [...data];
        this.loader = false;
      });
  }
  getAllItems() {
    console.log("Started loading items");
    this.loader = true;
    this.filteredOrders = [];
    this.ordersService
      .getAllItems()
      .pipe(finalize(() => this.getItemComponents()))
      .subscribe((data) => {
        this.end = data.length;
        this.itemsList = [...data];
        this.filteredOrders = [...data];
        this.loader = false;
      });
  }

  // Get all item's components
  getItemComponents() {
    this.loader = true;
    this.waitingText = "Getting components data...";
    this.itemCounter = 0;
    confirm(
      "This task may take more than an hour, are you sure you want to preceed?"
    );
    // let start = this.end - 500;
    // let start = this.end < 500 ? 0 : this.end - 500;
    let start = 0;
    console.log("start: ", start);
    console.log("End: ", this.end);

    // for (let i = 0; i < this.filteredOrders.length; i++) {
    for (let i = start; i < this.end; i++) {
      // To continue from here on sunday
      console.log(this.filteredOrders[i]);
      this.item = this.filteredOrders[i];
      console.log(this.item);
      this.itemService
        .getComponentsForItem(this.item.itemNumber)
        .subscribe((allComponents) => {
          // console.log(allComponents);
          this.filteredOrders[i].componentsCost = [];
          for (let component of allComponents) {
            let obj = {
              componentN: component.componentN,
              price: component.price,
              componentType: component.componentType,
              componentName: component.componentName,
              alternativeSuppliers: component.alternativeSuppliers,
              coin: component.coin,
              shippingPrice: component.shippingPrice,
            };
            this.filteredOrders[i].componentsCost.push(obj);
          }
          // this.allComponents = allComponents;
          console.log(this.filteredOrders[i]);
          this.waitingText = "Getting components purchase data...";
          this.waitingText = "Getting Formule data...";
          this.getFormulePrice(this.filteredOrders[i].itemNumber).then(
            (formulePrice) => {
              console.log(formulePrice);
              this.waitingText = "Calculating product price...";

              this.filteredOrders[i].materialsCost = formulePrice;
              console.log(this.filteredOrders[i]);
              this.calculateProductPricing(
                this.filteredOrders[i].componentsCost
              )
                .then((result) => {
                  console.log(result);
                  this.filteredOrders[i].componentsTotalCost = result.itemPrice;
                  this.filteredOrders[i].shippingCost = result.shippingPrice;
                  console.log(this.filteredOrders[i]);
                  this.financeService
                    .addSalesCost(this.filteredOrders[i])
                    .subscribe((data) => {
                      console.log(data);
                      if (data.msg) {
                        this.toastr.error(data.msg);
                      } else {
                        console.log(this.filteredOrders[i]);
                        this.filteredOrders[i].componentsTotalCost =
                          result.itemPrice ? result.itemPrice : 0;
                        this.filteredOrders[i].shippingCost =
                          result.shippingPrice ? result.shippingPrice : 0;
                        console.log("End of calculation round no.: " + i);
                        this.calculating = false;
                        this.loadingCustomers = true;
                      }
                    });

                  // this.filteredOrders[i].totalItemCost = this.filteredOrders[i]
                  //   .materialsCost
                  //   ? result.itemPrice + this.filteredOrders[i].materialsCost
                  //   : result.itemPrice;
                  // this.filteredOrders[i].totalShippingCost =
                  //   result.shippingPrice;

                  // this.getCustomersForItem(this.item.itemNumber);
                  // this.getSuppliersForComponents();
                  // this.getStockAmounts();
                })
                .then(() => {
                  this.itemCounter++;
                  console.log("Counter no.: " + this.itemCounter);
                  if (this.itemCounter == this.filteredOrders.length - 1)
                    // if (this.itemCounter == this.filteredOrders.length - 1)
                    this.exportStockExcel(this.filteredOrders);
                  if (this.itemCounter == this.end - start - 1) {
                    this.toastr.success("Loading data to the DB started");
                  }
                })
                .catch((error) => {
                  console.log(error.message);
                  this.toastr.error(error.message);
                });
            }
          );
        });
      this.toastr.success("Loading data finished");
      this.getAllOrders = true;
      this.loader = false;
    }
  }

  exportToExcel() {
    let num = 0;
    this.excelData = [];
    this.loader = true;
    this.financeService.getAllItemsSales().subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastr.error(data.msg);
      } else {
        let reportData = data;
        this.filteredOrders = data;

        for (let item of reportData) {
          num++;
          let index = this.itemsList.findIndex(
            (li) => item.itemNumber == li.itemNumber
          );
          console.log("Index is: " + index);
          if (index > -1) {
            //continue on Mondy from here. Remove the NaN for the excel.
            item.componentsTotalCost = item.componentsTotalCost
              ? item.componentsTotalCost
              : 0;
            item.shippingCost = item.shippingCost ? item.shippingCost : 0;
            item.materialsCost = item.materialsCost ? item.materialsCost : 0;

            let created = new Date(item.createdAt);
            // let createdAt = created.toLocaleDateString();
            let createdAt = moment(created).format("DD/MM/YYYY");
            console.log(item);
            let exportData = {
              "No.": num,
              "Calc. Date": createdAt,
              "Product Cat.": item.itemNumber,
              "Product Name": item.itemName,
              "Product cost(components)": item.componentsTotalCost.toFixed(4),
              "Product cost (materials)": item.materialsCost.toFixed(4),
              "Product cost (shipping)": item.shippingCost.toFixed(4),
              "Total cost per product": (
                item.materialsCost +
                item.componentsTotalCost +
                item.shippingCost
              ).toFixed(4),
              "Quantity supplied": item.quantitySupplied,
              "Total cost": (
                (item.materialsCost +
                  item.componentsTotalCost +
                  item.shippingCost) *
                item.quantitySupplied
              ).toFixed(2),
            };
            this.excelData.push(exportData);
            // console.log(this.excelData.length);
            console.log("Round number: " + num);
            // console.log(exportData);
            // console.log(this.excelData);
          }
          if (num >= reportData.length) {
            this.loader = false;
            console.log("excel is exported");
            this.excelService.exportAsExcelFile(this.excelData, "finance");
            this.toastr.success("Report exported to Excel");
          }
        }
      }
    });

    // console.log(this.excelData);
    // if (this.excelData.length > 0) {
    //   console.log("excel is exported");
    //   // if (this.excelData.length == this.filteredOrders.length) {
    //   this.excelService.exportAsExcelFile(this.excelData, "finance");
    // }
  }

  // Get formule price for item
  async getFormulePrice(itemNumber) {
    return new Promise((resolve, reject) => {
      this.formuleService
        .getFormulePriceByNumber(itemNumber)
        .subscribe((response) => {
          if (response.msg) this.toastr.error(response.msg);
          this.item.formulePrice = response.formulePrice
            ? response.formulePrice * (this.item.netWeightK / 1000)
            : null;
          // console.log(response);
          resolve(response.formulePrice);
        });
    });
  }

  // Calculate product price by components
  async calculateProductPricing(componentsCost) {
    return new Promise<any>((resolve, reject) => {
      try {
        let itemPrice = 0;
        let shippingPrice = 0;
        this.itemComponents = [];
        this.totalItemPrice = 0;
        // For each component, create a componentPricing object
        this.createComponentsPrice(componentsCost)
          .then((itemComponents) => {
            // console.log(itemComponents);
            this.itemComponents = itemComponents;
            console.log(this.itemComponents);
            // Calculate total item price
            for (let component of this.itemComponents) {
              if (typeof Number(component.price) == typeof 0)
                if (!isNaN(Number(component.price))) {
                  itemPrice += Number(component.price);
                }
              if (typeof Number(component.shippingPrice) == typeof 0) {
                if (!isNaN(Number(component.shippingPrice))) {
                  shippingPrice += Number(component.shippingPrice);
                }
              }
            }
            console.log({ itemPrice, shippingPrice });
            resolve({ itemPrice, shippingPrice });
          })
          .catch((e) => {
            this.toastr.error(e, `יש לעדכן מטבע`);
            this.calculating = false;
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  createComponentsPrice(components) {
    return new Promise<any>((resolve, reject) => {
      let itemComponents = [];
      for (let component of components) {
        // console.log(component);
        let componentPricing = {
          price: 0,
          shippingPrice: "",
          componentNumber: component.componentN,
          componentName: component.componentName,
          imgUrl: "",
        };
        let coin;
        //Calculate component pricing
        if (component.manualPrice) {
          componentPricing.price = Number(component.manualPrice);
          coin = component.manualCoin;
        } else if (component.price) {
          componentPricing.price = Number(component.price);
          coin = component.coin;
        } else {
          let suppliers = component.alternativeSuppliers;
          if (!suppliers || suppliers.length == 0) componentPricing.price = NaN;
          else {
            for (let i = 0; i < suppliers.length; i++) {
              if (
                suppliers[i].price != "" &&
                suppliers[i].price != null &&
                suppliers[i].price != undefined
              ) {
                componentPricing.price = Number(suppliers[i].price);
                coin = suppliers[i].coin;
                i = suppliers.length;
              } else {
                componentPricing.price = NaN;
              }
            }
          }
        }
        // if(!coin) reject(`Item ${component.componentN}`) // crashing table, removed
        if (!isNaN(componentPricing.price)) {
          coin = coin.toLowerCase() == "nis" ? "ILS" : coin;
          console.log("coin is:" + coin);
          componentPricing.price =
            componentPricing.price * this.currencies[0][coin.toUpperCase()];
          if (component.componentType == "master_carton") {
            if (component.componentN == this.item.cartonNumber) {
              componentPricing.price =
                componentPricing.price / Number(this.item.PcsCarton);
            } else if (component.componentN == this.item.cartonNumber2)
              componentPricing.price =
                componentPricing.price / Number(this.item.PcsCarton2);
          }
        }
        componentPricing.shippingPrice = component.shippingPrice
          ? component.shippingPrice
          : "No shipping Price";
        componentPricing.imgUrl = component.img;
        console.log(componentPricing);
        itemComponents.push(componentPricing);
      }
      resolve(itemComponents);
    });
  }

  //filter the items that were not inserted ito the salescostreports

  getAllItemsSales() {
    this.financeService
      .getAllItemsSales()
      .pipe(finalize(() => this.getNonInserted()))
      .subscribe((data) => {
        if (data.msg) {
          console.log(data.msg);
          this.toastr.error(data.msg);
        } else {
          this.salescostreports = data;
        }
      });
  }

  getNonInserted() {
    this.ordersService.getAllSalesByCMX().subscribe((data) => {
      if (data.msg) {
        this.toastr.error(data.msg);
      } else {
        this.filteredOrders = data;

        for (let item of this.salescostreports) {
          let index = this.filteredOrders.findIndex(
            (sr) => sr.itemNumber == item.itemNumber
          );
          if (index > -1) {
            this.filteredOrders.splice(index, 1);
          }
        }
        console.log(this.filteredOrders);
        let exportToExcel = [];
        for (let item of this.filteredOrders) {
          let exportItem = {
            "Product Number": item.itemNumber,
            "Product Name": item.ItemName,
            "Quantity sold": item.quantitySupplied,
          };
          exportToExcel.push(exportItem);
        }
        this.excelService.exportAsExcelFile(exportToExcel, "orfenItems");
        this.toastr.success("Items exported to Excel");
        this.end = this.filteredOrders.length;
        this.getItemComponents();
      }
    });
  }

  getInvRepCosts(type) {
    this.itemType = type;
    let sortOrder;
    this.loader = true;
    this.filteredOrders = [];
    this.excelData = [];
    this.invtSer.getInvRepCosts(type).subscribe((data) => {
      this.loader = false;
      console.log(data);
      this.excelData = [];
      this.filteredOrders = [];

      let createdAt = moment(this.today).format("DD/MM/YYYY");
      for (let item of data) {
        let itemObj = {
          "Item Type": item.itemType,
          "Item Number": item.itemNumber,
          "Item Name": item.itemName,
          "Item Cost": item.actualPrice,
          "Item Coin": item.actualCoin,
          "Amount in Stock": item.totalAmount,
          "Owner ID": item.ownerId,
          Date: createdAt,
        };
        this.excelData.push(itemObj);
        this.filteredOrders.push(item);
      }

      sortOrder = [
        "Date",
        "Item Type",
        "Item Number",
        "Item Name",
        "Item Cost",
        "Item Coin",
        "Amount in Stock",
      ];

      this.getAllOrders = true;
      this.loader = false;
      this.excelService.exportAsExcelFile(
        this.excelData,
        "Inventory Report",
        sortOrder
      );
    });
  }
  getInvRepProdCosts() {
    let sortOrder;
    this.loader = true;
    this.filteredOrders = [];
    this.excelData = [];
    this.invtSer.getProductsStock().subscribe((data) => {
      if (data.msg) {
        this.toastr.error(data.msg);
      } else {
        console.log(data);
        this.end = data.length;
        for (let item of data) {
          item.itemName = item.itemName[0];
          item.quantitySupplied = item.totalAmount;
        }
        this.filteredOrders = data;
        setTimeout(() => {
          this.getItemComponents();
        }, 500);

        this.itemsList = data;

        this.loader = false;
      }
    });
  }

  exportStockExcel(data) {
    let createdAt = moment(this.today).format("DD/MM/YYYY");
    let sortOrder;
    this.excelData = [];
    for (let item of data) {
      let itemObj = {
        "Item Type": item.itemType,
        "Item Number": item.itemNumber,
        "Item Name": item.itemName,
        "Product cost(components)": item.componentsTotalCost,
        "Product cost (materials)": item.materialsCost,
        "Product cost (shipping)": item.shippingCost,
        "Stock Amount": item.quantitySupplied,
      };
      this.excelData.push(itemObj);
      // this.filteredOrders.push(item);
    }

    sortOrder = [
      "Date",
      "Item Type",
      "Item Number",
      "Item Name",
      "Product cost(components)",
      "Product cost (materials)",
      "Product cost (shipping)",
      "Stock Amount",
    ];

    this.excelService.exportAsExcelFile(
      this.excelData,
      "Inventory Report",
      sortOrder
    );
  }
}
