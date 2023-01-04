import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { ColDef, GridOptions } from "ag-grid-community";
import { LoaderService } from "src/app/services/loader.service";
import { SearchService } from "src/app/services/search.service";
import { RouterLinkRendererComponent } from "src/app/shared/grid/router-link-renderer/router-link-renderer.component";
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
  customerSearchColumns =
    [
      {
        field: "costumerId",
        cellRenderer: RouterLinkRendererComponent,
        cellRendererParams: {
          'color': 'green'
        }
      },
      { field: "costumerName" },
      { field: "fax" },
      { field: "invoice" },
      { field: "delivery" },
      { field: "country" },
      { field: "pallet" },
      { field: "marks" },
      { field: "impRemark" },
      { field: "brand" },
      { field: "area" },
    ];
  gridOptions: GridOptions = {
    frameworkComponents: {
      'routerLink': RouterLinkRendererComponent
    }
  }
  itemSearchColumns = getItemSearchColumns();
  orderItemColumns = getOrderItemSearchColumns();
  orderSearchColumns = getOrderSearchColumns();
  purchaseOrderSearchColumns = getPurchaseOrderSearchColumns();
  selectedIndex = 0;
  @ViewChild("tabs", { static: false }) tabGroup: MatTabGroup;
  activeTab: MatTab = null;
  resultView = "";
  loading = false;
  components = {
    "routerLink": RouterLinkRendererComponent
  }
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
  };
  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private loaderService: LoaderService,
    private router: Router,
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
  };

  viewChange = () => {
    const searchTerm = this.route.snapshot.queryParams.search;
    if (!this.resultView || !searchTerm) return;
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
    if(type === "item"){
      this.router.navigate([`/peerpharm/items/itemDetails/${event.data.itemNumber}`]);
    } else if(type === "order"){
      this.router.navigate([`/peerpharm/items/itemDetails/${event.data.orderNumber}`]);
    }
  }

  onSortChanged(params) {
    console.log('params', params);
  }
}
