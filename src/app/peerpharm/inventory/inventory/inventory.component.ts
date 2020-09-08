import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  
  itemType:string;
  
  constructor() { }

  ngOnInit() {
  }


  setItemType(ev){
  let itemType = ev.target.value;
  this.itemType = itemType
  }
}
