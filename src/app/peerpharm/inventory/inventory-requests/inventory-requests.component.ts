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
    this.inventoryReqService.getInventoryDemandsList().subscribe(res=>{
        console.log(res);
        debugger;
        //res= allorders from itemsDemands table
        res.forEach(element => {
         element.components.map(item => {
       //   item.cmptN="0";
          item.isSelected=false;
          //Object.assign({ isSelected: false }, item);
        })
          console.log(element.components);
        });
        
        this.ordersDemands=res;
        console.log( this.ordersDemands)
    })
  }
  // getAllGeneralDemands(){
  //   this.inventoryReqService.getInventoryRequestsList().subscribe(res=>{
  //       console.log(res);
  //       debugger;
  //       //res= allorders from itemsDemands table
  //       res.forEach(InvRequest => {
  //        InvRequest.reqList.map(item => {
  //      //   item.cmptN="0";
  //         item.isSelected=false;
  //         //Object.assign({ isSelected: false }, item);
  //       })
  //         console.log(InvRequest.reqList);
  //       });
        
  //       this.ordersDemands=res;
  //       console.log( this.ordersDemands);
  //   })
  // }

  getDetails(itemId, orderNumber): void {
    this.EditRowId2nd = itemId;
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
    let demandObj =this.ordersDemands.filter(orderObj=>orderObj.order==this.openOrder)
    console.log(demandObj);
    console.log(demandObj[0].components);
    let tempArr = demandObj[0].components.filter(e => e.isSelected == true).map(elmnt => elmnt = {"number":elmnt.cmptN, "orderDemandId":demandObj[0]._id});
    //let tempArr = demandObj[0].components.filter(e => e.isSelected == true).map(e => e = {"item":e.cmptN, "demandId":e._id});
    debugger
    if(tempArr.length>0) {
      this.outPutItemsArray.emit(tempArr);
    }
    console.log(tempArr);
    }
}
