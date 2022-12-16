import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ColDef,
  GetDataPath,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import { OrdersService } from "src/app/services/orders.service";
import "ag-grid-enterprise";
import { groupBy } from "lodash";
import { ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";
import { getAutoGroupColumnDef, getOrdersColumns } from "../utils/grid";
import { NgxSelectOptions } from "../../../interfaces/general";

export interface OrdersGroupbyCustomersForm {
  customers: string[];
  startOrderDate: string;
  endOrderDate: string;
}

@Component({
  selector: "app-orders-report-grouped-by-clients",
  templateUrl: "./orders-report-grouped-by-clients.component.html",
  styleUrls: ["./orders-report-grouped-by-clients.component.scss"],
})
export class OrdersReportGroupedByClientsComponent implements OnInit {
  form: FormGroup;
  customers: NgxSelectOptions[] = [{ id: "all", text: "All" }];
  submitted: boolean = false;

  private gridApi!: GridApi;
  columnDefs: ColDef[] = getOrdersColumns();
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
  };
  autoGroupColumnDef: ColDef = getAutoGroupColumnDef("Customer");
  rowData: any[] | null = [];
  groupDefaultExpanded = 0;
  getDataPath: GetDataPath = (data: any) => {
    return data.costumer;
  };

  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [];

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      customers: this.fb.control(["all"], Validators.required),
      startOrderDate: this.fb.control("", Validators.required),
      endOrderDate: this.fb.control("", Validators.required),
    });

    this.ordersService.getOrdersCustomers().subscribe((customers) => {
      customers.forEach((customer) => {
        this.customers.push({ id: customer._id, text: customer._id });
      });
    });
  }

  getPrintStyle = () => {
    const b = { border: "1px solid #babfc7", padding: "10px" };
    return {
      ".ag-header-cell": b,
      ".ag-cell": b,
      body: { height: "max-content", "overflow-y": "visible !important" },
    };
  };

  onSubmit = () => {
    this.submitted = true;
    if (this.form.valid) {
      this.ordersService
        .getOrdersGroupByClient(this.form.value)
        .subscribe((orders) => {
          const chartData: { [key: string]: number } = {};
          const groupedByOrder = groupBy(orders, "costumer");
          this.rowData = [];
          for (var i in groupedByOrder) {
            const orders = groupedByOrder[i];

            orders.forEach((or, index) => {
              if (index === 0) {
                const total = orders.length;
                chartData[or.costumer] = total;
                this.rowData.push({
                  costumer: [or.costumer],
                  numberOfOrders: total,
                });
              }
              this.rowData.push({
                ...or,
                costumer: [or.costumer, or.orderNumber],
              });
            });
          }
          this.barChartLabels = Object.keys(chartData);
          this.barChartData = [
            { data: Object.values(chartData), label: "Orders" },
          ];
        });
    }
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  handleExport($event) {
    $event.preventDefault();
    this.gridApi.exportDataAsCsv({fileName: 'orders-report-grouped-by-clients.csv'});
  }

  handleChart($event, content) {
    $event.preventDefault();
    this.modalService.open(content, { size: "lg", backdrop: "static" });
  }
}
