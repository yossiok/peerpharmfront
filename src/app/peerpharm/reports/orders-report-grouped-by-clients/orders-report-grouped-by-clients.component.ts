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
import * as moment from "moment";
import { groupBy } from "lodash";

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
  customers: { id: string; text: string }[] = [{ id: "all", text: "All" }];
  submitted: boolean = false;

  private gridApi!: GridApi;
  public columnDefs: ColDef[] = [
    { field: "orderNumber" },
    {
      field: "orderDate",
      valueGetter: (params) => {
        return (
          params.data.orderDate &&
          moment(params.data.orderDate).format("DD/MM/yyyy")
        );
      },
    },
    {
      field: "deliveryDate",
      valueGetter: (params) => {
        return (
          params.data.deliveryDate &&
          moment(params.data.deliveryDate).format("DD/MM/yyyy")
        );
      },
    },
    { field: "orderRemarks" },
    { field: "type" },
    { field: "status" },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
  };
  public autoGroupColumnDef: ColDef = {
    headerName: "Customer",
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
    },
  };
  public rowData: any[] | null = [];
  public groupDefaultExpanded = 0;
  public getDataPath: GetDataPath = (data: any) => {
    return data.costumer;
  };

  constructor(private fb: FormBuilder, private ordersService: OrdersService) {}

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

  onSubmit = () => {
    this.submitted = true;
    if (this.form.valid) {
      this.ordersService
        .getOrdersGroupByClient(this.form.value)
        .subscribe((orders) => {
          const groupedByOrder = groupBy(orders, "costumer");
          this.rowData = [];
          for (var i in groupedByOrder) {
            const orders = groupedByOrder[i];
            orders.forEach((or, index) => {
              if (index === 0) {
                this.rowData.push({ costumer: [or.costumer] });
              }
              this.rowData.push({
                ...or,
                costumer: [or.costumer, or.orderNumber],
              });
            });
          }
        });
    }
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  handleExport($event) {
    $event.preventDefault();
    this.gridApi.exportDataAsCsv();
  }
}
