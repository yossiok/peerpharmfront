import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ColDef,
  GetDataPath,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import { ChartDataSets } from "chart.js";
import { groupBy } from "lodash";
import { Label } from "ng2-charts";
import { Procurementservice } from "src/app/services/procurement.service";
import { SuppliersService } from "src/app/services/suppliers.service";
import { getAutoGroupColumnDef, getPurchaseColumns } from "../utils/grid";
import { NgxSelectOptions } from "../../../interfaces/general";
import { LoaderService } from "src/app/services/loader.service";

export interface PurchaseOrdersGroupedBySupplierForm {
  suppliers: string[];
  from: string;
  to: string;
  items: string[];
}

@Component({
  selector: "app-purchase-orders-grouped-by-supplier",
  templateUrl: "./purchase-orders-grouped-by-supplier.component.html",
  styleUrls: ["./purchase-orders-grouped-by-supplier.component.scss"],
})
export class PurchaseOrdersGroupedBySupplierComponent implements OnInit {
  form: FormGroup;
  suppliers: NgxSelectOptions[] = [{ id: "all", text: "All" }];
  items: NgxSelectOptions[] = [];
  submitted: boolean = false;

  private gridApi!: GridApi;
  columnDefs: ColDef[] = getPurchaseColumns();
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
  };
  autoGroupColumnDef: ColDef = getAutoGroupColumnDef("Supplier");
  rowData: any[] | null = [];
  groupDefaultExpanded = 0;
  getDataPath: GetDataPath = (data: any) => {
    return data.supplier;
  };

  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private supplierService: SuppliersService,
    private procurementService: Procurementservice,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.add();
    this.form = this.fb.group({
      suppliers: this.fb.control(["all"], Validators.required),
      items: this.fb.control([]),
      from: this.fb.control("", Validators.required),
      to: this.fb.control("", Validators.required),
    });
    this.getSuppliers();
    this.getItems();
  }

  getSuppliers = () => {
    this.supplierService.getAllSuppliers().subscribe((suppliers) => {
      suppliers.forEach((supplier) => {
        this.suppliers.push({
          id: supplier.suplierNumber,
          text: `${supplier.suplierNumber} - ${supplier.suplierName}`,
        });
      });
      this.loaderService.remove();
    });
  };

  getItems = () => {
    this.procurementService.getStockItems().subscribe((items) => {
      items.forEach((item) => {
        this.items.push({ id: item._id, text: `${item._id} - ${item.name}` });
      });
      this.loaderService.remove();
    });
  };

  onSubmit = () => {
    this.submitted = true;
    if (this.form.valid) {
      this.loaderService.add();
      this.procurementService
        .getOrdersGroupBySupplier(this.form.value)
        .subscribe((orders) => {
          this.processData(orders);
          this.loaderService.remove();
        });
    }
  };

  processData = (orders) => {
    const chartData: { [key: string]: number } = {};
    const groupedByOrder = groupBy(orders, "supplier");
    this.rowData = [];
    for (var i in groupedByOrder) {
      const orders = groupedByOrder[i];

      orders.forEach((or, index) => {
        if (index === 0) {
          const total = orders.length;
          chartData[or.supplier] = total;
          this.rowData.push({
            supplier: [or.supplier],
            numberOfOrders: total,
          });
        }
        this.rowData.push({
          ...or,
          supplier: [or.supplier, or.orderNumber],
        });
      });
    }
    this.barChartLabels = Object.keys(chartData);
    this.barChartData = [
      { data: Object.values(chartData), label: "Purchase Orders" },
    ];
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  handleExport($event) {
    $event.preventDefault();
    this.gridApi.exportDataAsCsv({fileName: 'purchase-orders-grouped-by-supplier.csv'});
  }

  handleChart($event, content) {
    $event.preventDefault();
    this.modalService.open(content, { size: "lg", backdrop: "static" });
  }
}
