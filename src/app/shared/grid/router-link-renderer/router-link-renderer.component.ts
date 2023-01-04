import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
@Component({
  selector: 'colour-cell',
  template: `<a [style.colour]="params.color">{{params.value}}</a>`
})
export class RouterLinkRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams) {
      this.params = params;
  }

  refresh(params: ICellRendererParams) {
      this.params = params;
      // As we have updated the params we return true to let AG Grid know we have handled the refresh.
      // So AG Grid will not recreate the cell renderer from scratch.
      return true;
  }
}