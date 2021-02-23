import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ScheduleService } from '../../../services/schedule.service';
import { ItemsService } from 'src/app/services/items.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MakeupService } from 'src/app/services/makeup.service';
import { log } from 'util';
import { CostumersService } from 'src/app/services/costumers.service';


@Component({
  selector: 'app-makeup',
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.scss']
})
export class MakeupComponent implements OnInit {

allCustomers:any[];
allMkpSchedules:any[];
addScheduleModal:Boolean = false;

mkpSchedule = {
  date:'',
  costumer:'',
  productName:'',
}
 
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    
}

  constructor(private customerService:CostumersService,private ordersService:OrdersService,private makeupService:MakeupService, private scheduleService:ScheduleService, private itemSer: ItemsService,private orderSer: OrdersService,private toastSrv:ToastrService ) { }

  ngOnInit() {
    this.getAllCustomers();
    this.getAllMkpSchedules();

  }



  getAllCustomers(){
  this.customerService.getAllCostumers().subscribe(data=>{
    ;
  this.allCustomers = data;
  })
  }

  getAllMkpSchedules(){
    this.scheduleService.getOpenMkpSchedule().subscribe(data=>{
      if(data){
        this.allMkpSchedules = data;
      }
    })
  }


  addNewMkpSchedule(){

    this.scheduleService.setNewMkpProductionSchedule(this.mkpSchedule).subscribe(data=>{
      if(data){
        this.allMkpSchedules.push(data);
        this.addScheduleModal = false;
        this.toastSrv.success('לוז מייקאפ נוסף בהצלחה!')
      }
    })
  }


}