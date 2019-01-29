import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';

@Component({
  selector: 'app-inventory-requests',
  templateUrl: './inventory-requests.component.html',
  styleUrls: ['./inventory-requests.component.css']
})
export class InventoryRequestsComponent implements OnInit {

  constructor(private inventoryService:InventoryService, private inventoryReqService: InventoryRequestService) { }
  ordersDemands:any=[];
  EditRowId2nd: any = "";
  expand: boolean = false;
  openOrder:string="";
  @Output() outPutItemsArray = new EventEmitter();

  ngOnInit() {
    this.getAllGeneralDemands();
  }

  getAllGeneralDemands(){
    this.inventoryReqService.getOpenInventoryRequestsList().subscribe(res=>{
        console.log(res);
        debugger
        //res= allorders from itemsDemands table
        res.forEach(InvRequest => {
          debugger
         InvRequest.reqList.map(item => {
       //   item.cmptN="0";
            item.isSelected=false;
            //Object.assign({ isSelected: false }, item);
          })
        });
        debugger
        this.ordersDemands=res;
    })
  
  }

  getDetails(reqId, orderNumber): void {
    debugger 
    this.EditRowId2nd = reqId;
    if (this.expand === true) {
       this.expand = false;
        this.openOrder="";
      }
    else { this.expand = true;
          this.openOrder=orderNumber;
    }
  }

  
  loadItems() {
    console.log(this.ordersDemands);
   // let demandObj =this.ordersDemands.filter(orderObj=>orderObj.order==this.openOrder)
    let demandObj =this.ordersDemands.filter(orderObj=>orderObj.reqNum==this.openOrder);
    // console.log(demandObj);
    // console.log(demandObj[0].components);
    debugger;

    let tempArr = demandObj[0].reqList.filter(e => e.isSelected == true).map(elmnt => {
      elmnt.reqNum=demandObj[0].reqNum;
      return elmnt
    } );
    //let tempArr = demandObj[0].components.filter(e => e.isSelected == true).map(e => e = {"item":e.cmptN, "demandId":e._id});
    if(tempArr.length>0) {
      this.outPutItemsArray.emit(tempArr);  
    }
    console.log(tempArr);
    }
}
