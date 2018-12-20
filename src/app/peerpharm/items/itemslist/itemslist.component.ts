import { Component, OnInit } from '@angular/core';
import {ItemsService} from '../../../services/items.service'
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-itemslist',
  templateUrl: './itemslist.component.html',
  styleUrls: ['./itemslist.component.css']
})
export class ItemslistComponent implements OnInit {
  itemsCopy:any=[];
  hasMoreItemsToload:boolean=true;
  subscription: any;
 

  items:any[]=[];
  constructor(private itemsService:ItemsService) { }

  ngOnInit() {
    this.getAllItems();
  }

  onDestroy(){
    this.subscription.unsubscribe();
  }


  getAllItems(){
    
    this.subscription = this.itemsService.startNewItemObservable().subscribe((items) => {
      debugger;
    items.map(item=>{
        item.itemFullName = item.name + " "  +item.subName + " "  +item.discriptionK
        item.licsensDate  = moment(item.licsensDate).format("DD/MM/YYYY");
      })
      this.items.push(...items); 
      if(items.length<500)
      {
        this.hasMoreItemsToload=false;
      }
      this.itemsCopy=this.items.slice();
    } );
  
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
