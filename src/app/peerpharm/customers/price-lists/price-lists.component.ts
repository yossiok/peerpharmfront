import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SalesService } from "src/app/services/sales.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-price-lists",
  templateUrl: "./price-lists.component.html",
  styleUrls: ["./price-lists.component.scss"],
})
export class PriceListsComponent implements OnInit {
  @Input("allCustomersList") allCustomersList: any[];

  currentCustomer: any;
  comaxCustomer: any;
  priceList: any[] = [];
  priceListCopy: any[] = [];
  filteredCustomersList: any[] = [];
  user: any;
  userName: string = "";
  authorized: boolean = false;
  loading: boolean = false;
  sortItemNumber: number = 1;
  sortItemName: number = 1;
  sortBarcode: number = 1;
  sortSize: number = 1;
  sortPrice: number = 1;
  isPriceList: boolean = false;

  searchForm: FormGroup = new FormGroup({
    customerName: new FormControl(""),
    customerId: new FormControl(""),
    priceListId: new FormControl(""),
  });
  filterForm: FormGroup = new FormGroup({
    itemNumber: new FormControl(""),
    itemName: new FormControl(""),
    barcode: new FormControl(""),
  });

  constructor(
    private salesService: SalesService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.allCustomersList);
    this.getUser();
  }
  get customerName() {
    return this.searchForm.controls["customerName"];
  }
  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized = this.user.authorization.includes("newProposal");
    console.log(this.user.authorization);
    console.log(this.user.userName);
    console.log(this.authorized);
  }
  getCustomerByNumber() {
    let cusNum = this.searchForm.controls.customerId.value;
    let customer = this.allCustomersList.find(
      (cus) => cus.costumerId == cusNum
    );
    console.log(customer);
    if (!customer) {
      this.searchForm.controls.customerName.reset();
      return;
    } else {
      this.searchForm.controls.customerName.setValue(customer.costumerName);
      this.getPriceList(customer.costumerId);
    }
  }

  getCustomerByName() {
    let cusName = this.searchForm.controls.customerName.value;
    console.log(cusName);
    let customer = this.allCustomersList.find((cus) => {
      return cus.costumerName == cusName;
    });
    if (customer) {
      this.searchForm.controls.customerId.setValue(customer.costumerId);
      this.getPriceList(customer.costumerId);
    }
  }

  getPriceList(priceListId) {
    this.priceList = [];
    this.priceListCopy = [];
    this.filterForm.reset();
    this.isPriceList = false;
    if (!priceListId || isNaN(priceListId)) {
      alert("Valid Customer ID wasn't provided");
      return;
    }
    this.salesService.getCustomerById(priceListId).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data) {
        this.comaxCustomer = data;
        this.comaxCustomer.Currency =
          data.Currency == "אירו"
            ? "EUR"
            : data.Currency == "ש''ח"
            ? "ILS"
            : data.Currency == "דולר אמריקאי"
            ? "USD"
            : data.Currency;
      }
    });
    this.loading = true;
    this.salesService.getItemsByPriceList(priceListId).subscribe((data) => {
      console.log(data);
      this.loading = false;
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data && data.length > 0 && data[0].itemNumber) {
        this.priceList = data;
        this.priceListCopy = data;
        this.isPriceList = true;
        return;
      } else {
        this.toastr.error("Price List wasn't found");
        return;
      }
    });
  }
  sortByItemNumber() {
    this.priceList = this.priceList.sort((a, b) =>
      a.itemNumber > b.itemNumber ? this.sortItemNumber : -this.sortItemNumber
    );
    this.sortItemNumber *= -1;
  }
  sortByItemName() {
    this.priceList = this.priceList.sort((a, b) =>
      a.itemName > b.itemName ? this.sortItemName : -this.sortItemName
    );
    this.sortItemName *= -1;
  }
  sortByBarcode() {
    this.priceList = this.priceList.sort((a, b) =>
      a.barcode > b.barcode ? this.sortBarcode : -this.sortBarcode
    );
    this.sortBarcode *= -1;
  }
  sortBySize() {
    this.priceList = this.priceList.sort((a, b) =>
      a.size > b.size ? this.sortSize : -this.sortSize
    );
    this.sortSize *= -1;
  }
  sortByPrice() {
    this.priceList = this.priceList.sort((a, b) =>
      Number(a.price) > Number(b.price) ? this.sortPrice : -this.sortPrice
    );
    this.sortPrice *= -1;
  }

  filterByItem() {
    let itemNumber = this.filterForm.value.itemNumber;
    this.priceList = this.priceList.filter((item) =>
      item.itemNumber.includes(itemNumber)
    );
  }
  filterByName() {
    let itemName = this.filterForm.value.itemName;
    if (itemName) {
      itemName = itemName.trim().toLowerCase();
    }
    this.priceList = this.priceList.filter((item) =>
      item.itemName.toLowerCase().includes(itemName)
    );
  }
  filterByBarcode() {
    let barcode = this.filterForm.value.barcode;
    this.priceList = this.priceList.filter((item) =>
      item.barcode.includes(barcode)
    );
  }

  cancelFilter() {
    this.filterForm.reset();
    this.priceList = [...this.priceListCopy];
  }
}
