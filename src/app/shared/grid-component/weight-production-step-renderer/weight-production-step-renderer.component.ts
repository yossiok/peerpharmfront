// Author: T4professor

import { Component, ViewChild } from "@angular/core";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, IAfterGuiAttachedParams, ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-weight-production-step-renderer",
  templateUrl: "./weight-production-step-renderer.component.html",
  styleUrls: ["./weight-production-step-renderer.component.scss"],
})
export class WeightProductionStepRendererComponent
  implements ICellRendererAngularComp
{
  public rowIndex:number;
  public show:boolean;
  public api:GridApi;
  public rowData: any;
  public actualItemNumber: string;
  public actualKgProd: string;
  public completed: boolean = false;
  public isValid: boolean = false;
  public itemNumberValidated: boolean =  false;
  public showCancel: boolean = false;

  @ViewChild('actualKgProdElement') actualKgProdElement;

  agInit(params: ICellRendererParams): void {
    if (!params.data) return;
    const rows = this.getAllRow(params.api)
    this.api = params.api;
    this.rowData = params.data;
    this.rowIndex = params.rowIndex;
    this.show = this.rowIndex === 0 || !!rows[this.rowIndex - 1]?.completed;
    this.actualItemNumber = params.data.actualItemNumber || "";
    this.actualKgProd = params.data.actualKgProd || "";
    this.completed = !!params.data.completed;
    this.showCancel = params.data.completed && (params.rowIndex === rows.length - 1 || !rows[params.rowIndex + 1].completed)
  }


  getAllRow(api: GridApi){
    let items: any[] = [];
    api.forEachNode(function(node) { 
        items.push(node.data);
    });
    return items;
  }

  refresh = (params?: any): boolean =>{
    return true;
  }

  setActualItemNumber = () => {
    if (!this.actualItemNumber || this.actualItemNumber !== this.rowData.itemNumber) return false;
    this.itemNumberValidated = true;
    setTimeout(() => {
      this.actualKgProdElement.nativeElement.focus();
    },0);
  }

  onActualKgProdChange = () => {
    this.isValid = this.validate();
  }

  validate = () =>{
    if (!this.actualItemNumber || !this.actualKgProd){
      return false;
    }

    if (this.actualItemNumber !== this.rowData.itemNumber){
      return false;
    }

    const actualKgProd = parseFloat(this.actualKgProd).toFixed(2);
    const kgProd = parseFloat(this.rowData.kgProd).toFixed(2);
    if (actualKgProd !== kgProd){
      return false;
    }

    return true;
  }

  completeStep = () => {
    const rows = this.getAllRow(this.api);
    this.rowData.actualKgProd = this.actualKgProd;
    this.rowData.actualItemNumber = this.actualItemNumber;
    this.rowData.completed = true;
    rows.splice(this.rowIndex, 1, this.rowData);
    this.api.setRowData(rows);
  }

  cancelStep = () => {
    const rows = this.getAllRow(this.api);
    this.rowData.actualKgProd = "";
    this.rowData.actualItemNumber = "";
    this.rowData.completed = false;
    rows.splice(this.rowIndex, 1, this.rowData);
    this.api.setRowData(rows);
  }

}
