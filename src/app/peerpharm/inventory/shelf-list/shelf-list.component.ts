import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrls: ['./shelf-list.component.scss']
})
export class ShelfListComponent implements OnInit {


  allShelfs:any;
  allShelfsCopy:any;
  itemType:any;

  constructor(private itemService:ItemsService,private inventorySrv:InventoryService) { }

  ngOnInit() {
  }

  
  getShelfsByWH(ev){
    debugger;
    let whareHouse = ev.target.value;
    if(whareHouse == 'materials' || whareHouse == 'components'){
      this.itemType = whareHouse
      whareHouse = '5c1124ef2db99c4434914a0e'
      
    }
    this.inventorySrv.shelfListByWH(whareHouse).subscribe(data=>{
    if(data){
      data.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
      if(this.itemType == 'components') data = data.filter(s=>s.itemType == 'component')
      if(this.itemType == 'materials') data = data.filter(s=>s.itemType == 'material')
      this.allShelfs = data;
      this.allShelfsCopy = data;

      
    }
    })
  }

  filterByShelf(ev){
    debugger;
    this.allShelfs = this.allShelfsCopy
    let position = ev.target.value;

    if(position != ''){
      this.allShelfs = this.allShelfs.filter(s=>s.position == position)
    } else {
      this.allShelfs = this.allShelfsCopy
    }
    

  }
    

}
