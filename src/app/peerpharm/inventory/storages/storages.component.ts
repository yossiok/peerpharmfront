import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ArrayServiceService } from 'src/app/utils/array-service.service';

@Component({
  selector: 'app-storages',
  templateUrl: './storages.component.html',
  styleUrls: ['./storages.component.scss']
})
export class StoragesComponent implements OnInit {

  user:any;
  currItem:any;
  currRequest:any;
  componentNumber:any;
  componentName:any;
  currentCertif:any;
  printCertif:Boolean = false;
  amount:any;
  editRow:String = ''
  allowCheckArrived:Boolean = false;
  printDocument:Boolean = false;
  allFillingStorage:any[];
  allFillingStorageCopy:any[];


  @ViewChild('toDate') toDate: ElementRef;
  @ViewChild('fromDate') fromDate: ElementRef;
  @ViewChild('arrivedQuantity') arrivedQuantity: ElementRef;
  @ViewChild('arrivalDate') arrivalDate: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);


  }

  ReceiveComponents = {
    items:[],
    amount:'',
    date:'',
    certificate:'',
    storageType:'filling',
    orderNumber:'',
    status:'open'
  }


  constructor(private arrayService:ArrayServiceService,private inventorySrv:InventoryService,private authService:AuthService,private toastSrv:ToastrService,private inventoryReqService:InventoryRequestService) { }

  ngOnInit() {
    this.getUser();
    this.getAllFillingStorage();
  }

  openPrintDocument(request){
    this.currRequest = request;
    this.printDocument = true;
  }


  fillItemName(ev){
    ;
    let itemNumber = ev.target.value;
    this.inventorySrv.getCmptByitemNumber(itemNumber).subscribe(data=>{
    if(data){
        this.componentName = data[0].componentName

    } else {
      this.toastSrv.error('פריט לא קיים במערכת')
    }
    })
  }

  addToReceiveComponents(){
    this.ReceiveComponents.items.push({componentNumber:this.componentNumber,componentName:this.componentName,amount:this.amount})
    this.componentName = ''
    this.componentNumber = ''
    this.amount = ''
    this.toastSrv.success('פריט הוסף בהצלחה !')
  }

  sendToFilling(){
    this.inventorySrv.addToFillingStorage(this.ReceiveComponents).subscribe(data=>{
    if(data){
    this.printDocument = true
    this.toastSrv.success('תעודה התקבלה בהצלחה')
    this.allFillingStorage = data;
    }
    })
  }

  clearFields(){
    this.ReceiveComponents.items = []
    this.ReceiveComponents.amount = ''
    this.ReceiveComponents.date = ''
    this.ReceiveComponents.certificate = ''
    this.ReceiveComponents.orderNumber = ''
  }

  getAllFillingStorage(){
    this.inventorySrv.getAllFillingStorage().subscribe(data=>{
      this.allFillingStorage = data;
      this.allFillingStorageCopy = data;
    })
  }

  printMoveToKasem(certif){
    ;
    this.currentCertif = certif
    this.printCertif = true; 
  }

  removeItemFromReceivedComps(compNumber){
  var items = this.ReceiveComponents.items;
  for (var i =0; i < items.length; i++)
   if (items[i].componentNumber === compNumber) {
    items.splice(i,1);
   }
  }

  filterTable(ev,type){
    ;
    var tempArr = []
    if(ev.target.value != ''){
      switch(type) {
        case 'itemNumber':
          let itemNumber = ev.target.value;
            this.allFillingStorage.forEach(certif => {
            certif.items.forEach(item => {
              if(item.componentNumber == itemNumber){
                tempArr.push(certif)
              }
            });
          });
          this.allFillingStorage = tempArr
          break;
        case 'orderNumber':
          let orderNumber = ev.target.value;
          this.allFillingStorage = this.allFillingStorage.filter(c=>c.orderNumber == orderNumber)
          break;
      }
    } else {
    this.allFillingStorage = this.allFillingStorageCopy
    }
  
  }



  async getUser() {
    await this.authService.userEventEmitter.subscribe(user => {
      this.user=user;
      if (this.user.authorization){
        if (this.authService.loggedInUser.authorization.includes("updateStock")){
          this.allowCheckArrived = true;
        }
      }

    });

  }
}
