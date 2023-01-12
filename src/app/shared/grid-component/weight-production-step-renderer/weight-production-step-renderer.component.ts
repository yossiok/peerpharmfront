// Author: T4professor

import { Component, ElementRef, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import {
  GridApi,
  ICellRendererParams,
} from "ag-grid-community";
import { ToastrService } from "ngx-toastr";
import { forkJoin, of } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { ItemsService } from "src/app/services/items.service";
import { LoaderService } from "src/app/services/loader.service";
import { ShellsService } from "src/app/services/shells.service";
import { WarehouseService } from "src/app/services/warehouse.service";

@Component({
  selector: "app-weight-production-step-renderer",
  templateUrl: "./weight-production-step-renderer.component.html",
  styleUrls: ["./weight-production-step-renderer.component.scss"],
})
export class WeightProductionStepRendererComponent
  implements ICellRendererAngularComp
{
  @ViewChild("itemModal") itemModal: ElementRef;
  @ViewChild("actualKgProdElement") actualKgProdElement;
  @ViewChild("actualItemNumberElement") actualItemNumberElement;
  public rowIndex: number;
  public show: boolean;
  public api: GridApi;
  public rowData: any;
  public actualItemNumber: string;
  public actualKgProd: string;
  public completed: boolean = false;
  public isValid: boolean = false;
  public itemNumberValidated: boolean = false;
  public itemNumberConfirmed: boolean = false;
  public showCancel: boolean = false;
  public item: any = {};
  public results: any[] = [];

  constructor(
    private itemsService: ItemsService,
    private shellService: ShellsService,
    private warehouseService: WarehouseService,
    private toaster: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private translateService: TranslateService
  ) {}

  agInit(params: ICellRendererParams): void {
    if (!params.data) return;
    const rows = this.getAllRow(params.api);
    this.api = params.api;
    this.rowData = params.data;
    this.rowIndex = params.rowIndex;
    this.show = this.rowIndex === 0 || !!rows[this.rowIndex - 1]?.completed;
    this.actualItemNumber = params.data.actualItemNumber || "";
    this.actualKgProd = params.data.actualKgProd || "";
    this.completed = !!params.data.completed;
    this.showCancel =
      params.data.completed &&
      (params.rowIndex === rows.length - 1 ||
        !rows[params.rowIndex + 1].completed);
  }

  getAllRow(api: GridApi) {
    let items: any[] = [];
    api.forEachNode(function (node) {
      items.push(node.data);
    });
    return items;
  }

  refresh = (params?: any): boolean => {
    return true;
  };

  validateItemNumber = async () => {
    if (this.actualItemNumber.length < 24) return false;
    this.loaderService.add();
    const itemShell = await this.itemsService
      .getItemShellById(this.actualItemNumber)
      .pipe(
        catchError(() => of(null)),
        tap(() => this.loaderService.remove())
      )
      .toPromise();

    if (!itemShell || itemShell.item != this.rowData.itemNumber) {
      this.toaster.error(this.translateService.instant("formule.messages.INCORRECT-ITEM"));
      return;
    }

    this.item = itemShell;
    this.loaderService.add();
    this.results = await this.itemsService
      .getItemShellByItem(itemShell.item)
      .pipe(
        mergeMap((items: any[]) =>
          forkJoin(
            items.map((itemShell) =>
              this.shellService
                .getShellById(itemShell.shell_id_in_whareHouse)
                .pipe(
                  catchError(() => of(null)),
                  map((shell) => {
                    return { itemShell, shell };
                  })
                )
            )
          )
        ),
        mergeMap((results: { itemShell: any; shell: any }[]) =>
          forkJoin(
            results.map(({ itemShell, shell }) =>
              !shell
                ? of({ itemShell, shell, warehouse: null })
                : this.warehouseService
                    .getWarehouseById(shell.whareHouseId)
                    .pipe(
                      catchError(() => of(null)),
                      map((warehouse) => {
                        return { itemShell, shell, warehouse };
                      })
                    )
            )
          )
        ),
        tap(() => this.loaderService.remove())
      )
      .toPromise();
    this.modalService.open(this.itemModal, {windowClass: "modal-dialog-centered"}).result.then(
      () => {
        this.itemNumberConfirmed = true;
      },
      () => {
        this.itemNumberConfirmed = false;
        this.actualItemNumber = "";
        setTimeout(() => {
          this.actualItemNumberElement.nativeElement.focus();
        }, 0);
      }
    );
  };

  setActualItemNumber = () => {
    if (!this.actualItemNumber || this.actualItemNumber !== this.item._id)
      return false;
    this.itemNumberValidated = true;
    setTimeout(() => {
      this.actualKgProdElement.nativeElement.focus();
    }, 0);
  };

  onActualKgProdChange = () => {
    this.isValid = this.validate();
  };

  validate = () => {
    if (!this.actualItemNumber || !this.actualKgProd) {
      return false;
    }

    if (
      this.actualItemNumber !== this.item._id ||
      this.item.item !== this.rowData.itemNumber
    ) {
      return false;
    }

    const actualKgProd = parseFloat(this.actualKgProd).toFixed(2);
    const kgProd = parseFloat(this.rowData.kgProd).toFixed(2);
    if (actualKgProd !== kgProd) {
      return false;
    }

    return true;
  };

  completeStep = () => {
    const rows = this.getAllRow(this.api);
    this.rowData.actualKgProd = this.actualKgProd;
    this.rowData.actualItemNumber = this.actualItemNumber;
    this.rowData.completed = true;
    rows.splice(this.rowIndex, 1, this.rowData);
    this.api.setRowData(rows);
  };

  cancelStep = () => {
    const rows = this.getAllRow(this.api);
    this.rowData.actualKgProd = "";
    this.rowData.actualItemNumber = "";
    this.rowData.completed = false;
    rows.splice(this.rowIndex, 1, this.rowData);
    this.api.setRowData(rows);
  };

  confirmItemNumber = () => {
    this.itemNumberConfirmed = true;
  };
}
