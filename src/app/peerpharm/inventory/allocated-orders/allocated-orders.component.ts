import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-allocated-orders',
  templateUrl: './allocated-orders.component.html',
  styleUrls: ['./allocated-orders.component.scss']
})
export class AllocatedOrdersComponent implements OnInit {


  orderItems:any[];
  orderItemsCopy:any[];
  allItems:any[];
  loader:Boolean = false;

  constructor(private orderService:OrdersService,private itemService:ItemsService) { }

  ngOnInit() {
    this.getAllOpenOrders();
    this.getAllItems();
  }


  getAllOpenOrders() {
    this.orderService.getAllOpenOrderItems().subscribe(data=>{
    this.orderItems = data;  
    this.orderItemsCopy = data;
    })
  }

  getAllItems(){
    this.itemService.getAllItemsTwo().subscribe(data=>{
      ;
      if(data.length > 5000) {
        this.loader = true;
      if(data){

        for (let i = 0; i < this.orderItems.length; i++) {
          for (let j = 0; j < data.length; j++) {
           if(this.orderItems[i].itemNumber == data[j].itemNumber) {
             this.orderItems[i].bottleNumber = data[j].bottleNumber
             this.orderItems[i].capNumber = data[j].capNumber
             this.orderItems[i].pumpNumber = data[j].pumpNumber
             this.orderItems[i].sealNumber = data[j].sealNumber
             this.orderItems[i].cartonNumber = data[j].cartonNumber
             this.orderItems[i].PcsCarton = data[j].PcsCarton
            
           }
            
          }
          
        }
      }
    }
      
    })
  }

  markAsDone(id,index){
    
    if (confirm("האם סיימת ?") == true) {
    this.orderService.allocatedDone(id).subscribe(data=>{
      ;
      if(data) {
        for (let i = 0; i < this.orderItems.length; i++) {
         if(this.orderItems[i]._id == id) {
           this.orderItems[i].status = 'lightgreen'
         }
          
        }
      }

    })
  
  }
}

filterByItemNumber(ev) {
  ;
  var itemNumber = ev.target.value;

if(itemNumber != "") {
  var tempArr =  this.orderItems.filter(item => item.itemNumber == itemNumber)
  this.orderItems = tempArr;
  
} else {
  this.orderItems = this.orderItemsCopy
}

}
  checkIfDone(itemNumber,i)
  {
    
    for (let i = 0; i < this.orderItems.length; i++) {
      if(this.orderItems[i].status === 'done' && this.orderItems[i].itemNumber == itemNumber) {
       
        return "green";
      
      } else {

        return "red"
      }
    }
  

  }


}
