import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss']
})
export class PackingListComponent implements OnInit {

  allPLs:any[];
  allPLsCopy:any[];

  constructor(private formsService:FormsService) { }

  ngOnInit() {
    this.getAllPackingLists();
  }


  getAllPackingLists(){
    ;
    this.formsService.getAllPLs().subscribe(data=>{
    ;
    this.allPLs = data;
    this.allPLsCopy = data;
    
    })
  }

  filterByOrder(ev){
    ;
    var orderNumber = ev.target.value;
    if(orderNumber != "") {
        
    let tempArr = this.allPLs.filter(pl=>pl.orderNumber == orderNumber) 
    this.allPLs = tempArr;
    } else { 
      this.allPLs = this.allPLsCopy
    }

    
  }
  filterByItem(ev){
    ;
    var itemNumber = ev.target.value;
    if(itemNumber != "") {
        
    let tempArr = this.allPLs.filter(pl=>pl.itemNumber == itemNumber) 
    this.allPLs = tempArr;
    } else { 
      this.allPLs = this.allPLsCopy
    }

    
  }
}
