import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventory-new-request',
  templateUrl: './inventory-new-request.component.html',
  styleUrls: ['./inventory-new-request.component.css']
})
export class InventoryNewRequestComponent implements OnInit {

  constructor() { }
  inventoryReqForm: FormGroup;
  reqList:Array<any>=[];

  ngOnInit() {
  }

  addNewRequest(formValues){}
}
