import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-inventory-requests',
  templateUrl: './inventory-requests.component.html',
  styleUrls: ['./inventory-requests.component.scss']
})
export class InventoryRequestsComponent implements OnInit {

  constructor(private inventoryService:InventoryService, private inventoryReqService: InventoryRequestService, 
    private notificationService: NotificationService) { }
  ordersDemands:any=[];
  EditRowId2nd: any = "";
  expand: boolean = false;
  openOrder:string="";
  newReqIncoming:boolean=false;
  allRequests: Array<any>
  @Output() outPutItemsArray = new EventEmitter();

  ngOnInit() {
    this.getAllHistoryRequests();
    ;
    this.notificationService.newInventoryReqEventEmitter.subscribe(data=>{
      
      if(data=='newInventoryReq'){
        this.newReqIncoming=true;
      }else{
        this.getAllGeneralDemands();
      }
    });
    

    this.getAllGeneralDemands();
}

  getAllHistoryRequests() { 

    this.inventoryReqService.getInventoryRequestsListWeek().subscribe(data =>{
      ;
      this.allRequests = data;
      ;
      console.log(this.allRequests)
  });

  }
  getNewIncomingInventoryReq(){
    this.getAllGeneralDemands();        
  }

  getAllGeneralDemands(){
    this.inventoryReqService.getOpenInventoryRequestsList().subscribe(res=>{
      ;
        console.log(res);
        res.forEach(InvRequest => {
          if(InvRequest.reqList!=null && InvRequest.reqList!=undefined){
            InvRequest.reqList.map(item => {
              item.isSelected=false;
              if(item.amount <= item.qntSupplied) item.cmptLineColor= 'lightgreen';
              if(item.amount > item.qntSupplied && item.qntSupplied>0) item.cmptLineColor= 'LemonChiffon';
            });
          }
        });
        this.ordersDemands=res;
        this.newReqIncoming=false;
    });
  
  }

  getDetails(reqId, orderNumber): void {
      debugger;
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
    debugger;
    console.log(this.ordersDemands);
   // let demandObj =this.ordersDemands.filter(orderObj=>orderObj.order==this.openOrder)
    let demandObj =this.ordersDemands.filter(orderObj=>orderObj.reqNum==this.openOrder);
    // console.log(demandObj);
    // console.log(demandObj[0].components);
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

  closeInventoryReqManually(invReqId){
      if(confirm('לא כל הכמויות סופקו לבקשת מלאי\nהאם לסגור בקשת מלאי?')){
        this.inventoryReqService.closeRequest({id:invReqId}).subscribe(res=>{
          
          if(res._id){  
              this.getAllGeneralDemands();
            }
        });
      }  
    }


}
