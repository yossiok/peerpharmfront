import { Component, OnInit } from '@angular/core';
import {ItemsService} from '../../../services/items.service'

@Component({
  selector: 'app-itemslist',
  templateUrl: './itemslist.component.html',
  styleUrls: ['./itemslist.component.css']
})
export class ItemslistComponent implements OnInit {
  itemsCopy:any=[];

  items:any[];
  constructor(private itemsService:ItemsService) { }

  ngOnInit() {
    this.getAllItems();
  }

  getAllItems(){

    this.itemsService.getAllItems().subscribe(items => {
      
      this.items=items;
      this.itemsCopy=items;
      this.items.map(item=>{
        item.itemFullName = item.name + " "  +item.subName + " "  +item.discriptionK
      })
      
    });
  
  }

  changeText(ev)
  {
    let word= ev.target.value;
    if(word=="")
    {
      this.items=this.itemsCopy.slice();
    }
    else
    { 
      this.items= this.items.filter(x=>x.itemFullName.toLowerCase().includes(word.toLowerCase())); 
    }
  }
}
