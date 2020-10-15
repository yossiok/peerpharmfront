import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ScheduleService } from '../../../services/schedule.service';
import { ItemsService } from 'src/app/services/items.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MakeupService } from 'src/app/services/makeup.service';
import { log } from 'util';


@Component({
  selector: 'app-makeup',
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.scss']
})
export class MakeupComponent implements OnInit {

  powdersData:any[];
  allMakeUps:any[];
  lipstickData:any[];
  orders:any[];
  ordersCopy:any[];
  now: Date = new Date()
  today: any;
  tableType: String = "powder"

  makeup = {
    itemType: '',
    itemName: '',
    production:'',
    pushToGodets: '',
    packingClient: '',
    printing: '',
    productionDate:'',
    tray:'',
    packing:'',
  }
 
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    
}

  constructor(private ordersService:OrdersService,private makeupService:MakeupService, private scheduleService:ScheduleService, private itemSer: ItemsService,private orderSer: OrdersService,private toastSrv:ToastrService ) { }

  ngOnInit() {

    this.now.setDate(this.now.getDate() - 30);
   this.now.toISOString().split('T')[0];
   
    this.today = new Date();
    this.today = moment(this.today).format("DD/MM/YYYY");

    this.makeup.productionDate = moment(new Date()).format('YYYY-MM-DD');
    
    this.getAllmakeUps();
    this.getAllOrdersByType();

  }

  getAllOrdersByType() {
    
    this.ordersService.getOrderByType()
      .subscribe(orders => {
        orders.map(order => {
          order.color='white'
          if(this.today>order.deliveryDate){
            order.color = '#ff9999';
          }
        })
        this.orders = orders;
        this.ordersCopy = orders;
      })
  }

  checkIfPastDue(){
    
  }

  setType(type) {

    switch (type) {
      case 'powder':
        this.tableType = "powder";
      
        break;
      case 'wet':
        this.tableType = "wet";
    
        break;
    }
  }
  // Powder Section adding and getting all powders // 

  addNewPowder() { 
    
    this.makeup.itemType = "powder"
    
    this.makeupService.addNewPowderReport(this.makeup).subscribe(res =>{
      
      this.powdersData.push(res)
    })

    this.makeup.itemType=''
    this.makeup.itemName=''
    this.makeup.production=''
    this.makeup.pushToGodets=''
    this.makeup.packingClient=''
    this.makeup.printing=''
    this.makeup.tray=''
    this.makeup.packing=''
    
    
  }



getAllmakeUps() { 
  
  this.makeupService.getAllmakeUp().subscribe(data =>{
    
    this.allMakeUps = data;
  })
}

}