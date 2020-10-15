import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrls: ['./shelf-list.component.scss']
})
export class ShelfListComponent implements OnInit {


  shelfDetails:any[];

  constructor(private itemService:ItemsService) { }

  ngOnInit() {
  }


  getAllItemShelfs(ev){
  var shelfNumber = ev.target.value;
  if(shelfNumber != ''){
    this.itemService.shelfDetailsByNumber(shelfNumber).subscribe(data=>{
      this.shelfDetails = data;
      })
  } else {
    this.shelfDetails = []
  }
 
  }
}
