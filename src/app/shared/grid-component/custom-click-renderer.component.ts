// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-click-renderer',
  template: `
    <a href="#" (click)="onClick($event)">{{ label }}</a>
    `
})

export class CustomClickRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;
  visible: boolean;


  agInit(params): void {
    this.params = params;
    this.label = this.params.data[this.params.field] || null;
  }

  refresh(params?: any): boolean {
    return true;
  }


  onClick($event) {
    $event.preventDefault();
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onClick(params);

    }
  }
}
