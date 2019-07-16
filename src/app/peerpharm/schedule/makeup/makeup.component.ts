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
  styleUrls: ['./makeup.component.css']
})
export class MakeupComponent implements OnInit {

  powdersData:any[];
  wetItemsData:any[];
  lipstickData:any[];
 
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

  constructor(private makeupService:MakeupService, private scheduleService:ScheduleService, private itemSer: ItemsService,private orderSer: OrdersService,private toastSrv:ToastrService ) { }

  ngOnInit() {
    this.makeup.productionDate = new Date();
    this.makeup.productionDate = moment(this.makeup.productionDate).format('YYYY-MM-DD');
    
    this.getAllPowders();
    this.getAllWetItems();
    this.getAllLipsticks();

  }

  setType(type) {

    switch (type) {
      case 'powder':
        this.tableType = "powder";
      
        break;
      case 'wet':
        this.tableType = "wet";
    
        break;
      case 'lipstick':
        this.tableType = "lipstick";
     
        break;
    }
  }
  // Powder Section adding and getting all powders // 

  addNewPowder() { 
    debugger;
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

  getAllPowders() { 
    debugger;
    this.makeupService.getAllPowders().subscribe(data =>{
      this.powdersData = data;
    })
  }

  // end of powder section //


  // Wet Section adding and getting all wet items production

  addWetItem() { 
    debugger;
    this.makeup.itemType = "Wet"
    this.makeupService.addWetItemReport(this.makeup).subscribe(res =>{
      this.wetItemsData.push(res)
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

getAllWetItems() { 
  debugger;
  this.makeupService.getAllWetItems().subscribe(data =>{
    this.wetItemsData = data;
  })
}

// end of wet section // 


// Lipstick section adding and getting all items // 

addLipstick() { 
  debugger;
  this.makeup.itemType = "Lipstick"
  this.makeupService.addLipstickItem(this.makeup).subscribe(res =>{
    this.lipstickData.push(res)
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

getAllLipsticks() { 
  debugger;
  this.makeupService.getAllLipsticks().subscribe(data =>{
    this.lipstickData = data;
  })
}

// end of lipstick section //
}