import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { SearchService } from "src/app/services/search.service";
import {
  getCustomerSearchColumns,
  getItemSearchColumns,
  getOrderItemSearchColumns,
  getOrderSearchColumns,
  getPurchaseOrderSearchColumns,
} from "../reports/utils/grid";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  orderItems = [];
  items = [];
  customers = [];
  orders = [];
  purchaseOrders = [];
  customerOrders = [];
  customerSearchColumns = getCustomerSearchColumns();
  itemSearchColumns = getItemSearchColumns();
  orderItemColumns = getOrderItemSearchColumns();
  orderSearchColumns = getOrderSearchColumns();
  purchaseOrderSearchColumns = getPurchaseOrderSearchColumns();
  selectedIndex = 0;
  @ViewChild("tabs", { static: false }) tabGroup: MatTabGroup;
  activeTab: MatTab = null;
  resultView = "";
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      this.resultView = "";
      const searchterm = data.search;
      this.searchService.searchByText(searchterm).subscribe((data) => {
        this.items = data[0];
        this.orderItems = data[1];
        this.customers = data[2];
        this.customerOrders = data[3];
        this.orders = data[4];
        this.purchaseOrders = data[5];
      });
    });
  }

  setView = (view: string) => {
    this.resultView = view;
  };

  viewChange = () => {
    const searchTerm = this.route.snapshot.queryParams.search;
    if (!this.resultView || !searchTerm) return;
    this.loading = true;
    this.searchService
      .search(this.resultView, searchTerm)
      .subscribe((result) => {
        switch (this.resultView) {
          case "items":
            this.items = result;
            break;
          case "order-items":
            this.orderItems = result;
            break;
          case "customers":
            this.customers = result;
            break;
          case "customer-orders":
            this.customerOrders = result;
            break;
          case "orders":
            this.orders = result;
            break;
          case "purchase-orders":
            this.purchaseOrders = result;
            break;
        }
      })
      .add(() => (this.loading = false));
  };
}
