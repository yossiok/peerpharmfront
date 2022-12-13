import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ColDef, GetDataPath } from "ag-grid-community";
import { CostumersService } from "src/app/services/costumers.service";
import { OrdersService } from "src/app/services/orders.service";
import "ag-grid-enterprise";
import * as moment from "moment";

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

  public columnDefs: ColDef[] = [
    { field: "orderNumber" },
    { field: "costumer" },
    {
      field: "orderDate",
      valueGetter: (params) => {
        return (
          params.data.orderDate &&
          moment(params.data.orderDate).format("dd/MM/yyyy")
        );
      },
    },
    { field: "deliveryDate" },
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

  constructor(
    private fb: FormBuilder,
    private customersService: CostumersService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      customers: this.fb.control(["all"], Validators.required),
      startOrderDate: this.fb.control("", Validators.required),
      endOrderDate: this.fb.control("", Validators.required),
    });

    // this.customersService.getAllCostumers().subscribe((customers) => {
    //   customers.forEach((customer) => {
    //     this.customers.push({ id: customer._id, text: customer.costumerName })
    //   })
    // });
  }

  onSubmit = () => {
    this.submitted = true;
    if (this.form.valid) {
      this.ordersService
        .getOrdersGroupByClient(this.form.value)
        .subscribe((orders) => {
          this.rowData = orders.map((o) => ({
            ...o,
            costumer: [o.costumer],
          }));
        });
    }
  };
}
