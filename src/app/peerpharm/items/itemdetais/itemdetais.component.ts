import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import {ItemsService} from '../../../services/items.service'

@Component({
  selector: 'app-itemdetais',
  templateUrl: './itemdetais.component.html',
  styleUrls: ['./itemdetais.component.css']
})
export class ItemdetaisComponent implements OnInit {

  item:any={};
  constructor(private route: ActivatedRoute, private itemsService:ItemsService ) { }
  
  ngOnInit() {
    this.getItemData();
  }

  getItemData(){
    const number = this.route.snapshot.paramMap.get('itemNumber');
    this.itemsService.getItemData(number).subscribe(res=>{
      console.log(res);
      this.item=res[0];
    });
  }
}
