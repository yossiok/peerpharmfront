import { Component, OnInit } from '@angular/core';
import {ItemsService} from '../../../services/items.service'

@Component({
  selector: 'app-itemslist',
  templateUrl: './itemslist.component.html',
  styleUrls: ['./itemslist.component.css']
})
export class ItemslistComponent implements OnInit {

  items:any[];
  constructor(private itemsService:ItemsService) { }

  ngOnInit() {
    this.getAllItems();
  }

  getAllItems(){

    this.itemsService.getAllItems().subscribe(items => this.items=items);
  }
}
