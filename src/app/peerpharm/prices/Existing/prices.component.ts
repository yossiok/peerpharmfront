import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { CostumersService } from "src/app/services/costumers.service";
import { FormulesService } from "src/app/services/formules.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ItemsService } from "src/app/services/items.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { Currencies } from "../../procurement/Currencies";

@Component({
  selector: "app-prices",
  templateUrl: "./prices.component.html",
  styleUrls: ["./prices.component.scss"],
})
export class PricesComponent implements OnInit {
  @ViewChild("productNumber") productNumber: ElementRef;

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
  partialFormulePrice: boolean;
  itemsMissingPrice: string[] = [];
  notPricedComponents: any[] = [];
  formulePriceProblem: string = "";

  constructor(
    private itemService: ItemsService,
    private toastr: ToastrService,
    private invtSer: InventoryService,
    private procuremetnService: Procurementservice,
    private costumerService: CostumersService,
    private authService: AuthService,
    private formuleService: FormulesService
  ) {}

  // GOOD LUCK!

  ngOnInit(): void {
    setTimeout(() => this.productNumber.nativeElement.focus(), 500);
    this.allowed =
      this.authService.loggedInUser.authorization.includes("formulePrice");
    this.getCurrencies();
  }

  getCurrencies() {
    this.procuremetnService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
    });
  }

  // Get item data for item
  getItemData(itemNumber) {
    if (itemNumber == 0 || itemNumber.value == "" || !itemNumber)
      this.toastr.error("Enter a valid product number");
    else {
      this.calculating = true;
      this.itemService.getItemData(itemNumber.value).subscribe((data) => {
        console.log(data);
        if (data.length == 0) {
          this.toastr.error("Item Not Found.");
          this.calculating = false;
        } else {
          this.item = data[0];
          this.getItemComponents();
        }
      });
    }
  }

  // Get all item's components
  getItemComponents() {
    this.waitingText = "Getting components data...";
    this.itemService
      .getComponentsForItem(this.item.itemNumber)
      .subscribe((allComponents) => {
        this.allComponents = allComponents;
        this.waitingText = "Getting components purchase data...";
        this.waitingText = "Getting Formule data...";
        this.getFormulePrice().then((formulePrice) => {
          console.log(formulePrice);
          this.waitingText = "Calculating product price...";
          this.calculateProductPricing().then((result) => {
            this.totalItemPrice = this.item.formulePrice
              ? result.itemPrice + this.item.formulePrice
              : result.itemPrice;
            this.totalShippingPrice = result.shippingPrice;
            this.calculating = false;
            this.loadingCustomers = true;
            this.getCustomersForItem(this.item.itemNumber);
            this.getSuppliersForComponents();
            this.getStockAmounts();
          });
        });
      });
  }

  // Get formule price for item
  async getFormulePrice() {
    this.partialFormulePrice = false;
    return new Promise((resolve, reject) => {
      this.formuleService
        .getFormulePriceByNumber(this.item.itemNumber)
        .subscribe((response) => {
          console.log(response);
          if (response.msg) this.toastr.error(response.msg);
          for (let item of response.formulePrices) {
            if (!item.price) {
              this.partialFormulePrice = true;
              this.itemsMissingPrice.push(item.itemNumber);
            }
          }
          if (this.item.netWeightK) {
            this.item.formulePrice = response.formulePrice
              ? response.formulePrice * (this.item.netWeightK / 1000)
              : null;
          } else {
            this.formulePriceProblem =
              "משקל המוצר לא מוגדר ולכן אין חישוב עלות. יש להכניס את המשקל בעץ המוצר.";
            this.toastr.warning(
              "The weight of the product is not defiened. Please update in the product tree."
            );
          }
          resolve(this.item.formulePrice);
        });
    });
  }
  // Calculate product price by components
  async calculateProductPricing() {
    return new Promise<any>((resolve, reject) => {
      try {
        let itemPrice = 0;
        let shippingPrice = 0;
        this.itemComponents = [];
        this.totalItemPrice = 0;
        // For each component, create a componentPricing object
        this.createComponentsPrice(this.allComponents)
          .then((itemComponents) => {
            this.itemComponents = itemComponents;
            // Calculate total item price
            for (let component of this.itemComponents) {
              if (typeof component.price == typeof 0)
                itemPrice += Number(component.price);
              if (typeof Number(component.shippingPrice) == typeof 0) {
                if (!isNaN(Number(component.shippingPrice))) {
                  shippingPrice += Number(component.shippingPrice);
                }
              }
            }
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
        console.log(component);
        let componentPricing = {
          price: 0,
          shippingPrice: "",
          componentNumber: component.componentN,
          componentName: component.componentName,
          imgUrl: "",
        };
        let coin;
        //Calculate component pricing
        if (component.manualPrice && component.manualCoin) {
          componentPricing.price = Number(component.manualPrice);
          coin = component.manualCoin;
        } else if (component.price && component.manualCoin) {
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
        console.log(coin);
        if (!coin || !componentPricing.price) {
          console.log("Coin or Price is not defined", componentPricing);
          this.notPricedComponents.push(componentPricing.componentNumber);
        }
        if (componentPricing.price && coin) {
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
        itemComponents.push(componentPricing);
      }
      if (this.notPricedComponents.length > 0) {
        let warnings =
          "הפריטים הבאים ללא תמחור, יש להוסיף מחיר באינדקס פריטים: ";
        for (let item of this.notPricedComponents) {
          this.toastr.warning(
            `Item number ${item} is not priced. Add the price in the index menu`
          );
          warnings = warnings + ", " + item;
        }
        alert(warnings);
      }
      resolve(itemComponents);
    });
  }

  getStockAmounts() {
    let allNumbers = this.itemComponents.map((ic) => ic.componentNumber);
    this.invtSer.getAmountsForMulti(allNumbers).subscribe((totalsPerItem) => {
      this.itemComponents.map((ic) => {
        ic.stockAmount = totalsPerItem.find(
          (item) => item._id == ic.componentNumber
        ).total;
      });
    });
  }

  changeView(component) {
    this.selectedComponent = component;
    this.showOrders = true;
  }

  async getSuppliersForComponents() {
    await this.itemComponents.map((component) => {
      this.procuremetnService
        .getLastOrdersForItem(component.componentNumber, 20)
        .subscribe((data) => {
          component.lastOrders = data;
          return component;
        });
    });
    this.calculating = false;
  }

  getCustomersForItem(itemNumber) {
    this.costumerService.getAllCustomersOfItem(itemNumber).subscribe((data) => {
      data.forEach((customer) => {
        if (customer) this.customersForItem.push(customer);
      });
      this.loadingCustomers = false;
    });
  }
}
