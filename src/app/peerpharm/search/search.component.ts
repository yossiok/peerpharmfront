import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { ColDef } from "ag-grid-community";
import { LoaderService } from "src/app/services/loader.service";
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
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    cellStyle: {
      cursor: "pointer",
    }
  };
  defaultColDefWithoutStyle: ColDef = {
    ...this.defaultColDef,
    cellStyle: {}
  };
  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      this.resultView = "";
      const searchterm = data.search;
      this.loaderService.add();
      this.searchService.searchByText(searchterm).subscribe((data) => {
        this.loaderService.remove();
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
    this.viewChange();
  };

  viewChange = () => {
    const searchTerm = this.route.snapshot.queryParams.search;
    if (!this.resultView || !searchTerm) {
      if(this.items.length > 4) this.items = this.items.slice(0, 4);
      if(this.orderItems.length > 4) this.orderItems = this.orderItems.slice(0, 4);
      if(this.customers.length > 4) this.customers = this.customers.slice(0, 4);
      if(this.customerOrders.length > 4) this.customerOrders = this.customerOrders.slice(0, 4);
      if(this.orders.length > 4) this.orders = this.orders.slice(0, 4);
      if(this.purchaseOrders.length > 4) this.purchaseOrders = this.purchaseOrders.slice(0, 4);
      return;
    }
    this.loading = true;
    this.loaderService.add();
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
      .add(() => {
        this.loading = false;
        this.loaderService.remove();
      });
  };

  rowClicked(event, type) {
    switch (type) {
      case "item":
        if(event.data.itemNumber) window.open(`#/peerpharm/items/itemDetails/${event.data.itemNumber}`, '_blank');
        break;
      case "order":
        if(event.data.orderNumber) window.open(`#/peerpharm/allorders/orderitems/${event.data.orderNumber}`, '_blank');
        break;
      case "customer":
        if(event.data.costumerId){
          localStorage.setItem("_customer_id", event.data.costumerId);
          window.open(`#/peerpharm/costumers/costumers_list`, '_blank');
        }
        break;
      case "purchase-order":
        if(event.data.orderNumber){
          localStorage.setItem("_purchase_order_id", event.data.orderNumber);
          window.open(`#/peerpharm/procurement/procurementOrders`, '_blank');
        }
        break;
      default:
        break;
    }
  }

  cellClicked(event) {
    if(event.colDef.field === "itemNumber"){
      if(event.data.itemNumber) window.open(`#/peerpharm/items/itemDetails/${event.data.itemNumber}`, '_blank');
    }else if(event.colDef.field === "orderNumber"){
      if(event.data.orderNumber) window.open(`#/peerpharm/allorders/orderitems/${event.data.orderNumber}`, '_blank');
    }
  }
}
