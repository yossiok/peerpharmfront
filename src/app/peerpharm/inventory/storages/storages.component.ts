import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-storages',
  templateUrl: './storages.component.html',
  styleUrls: ['./storages.component.css']
})
export class StoragesComponent implements OnInit {

  allFillingRequests:any[]
  allFillingRequestsCopy:any[]
  user:any;
  allowCheckArrived:Boolean = false;


  @ViewChild('toDate') toDate: ElementRef;
  @ViewChild('fromDate') fromDate: ElementRef;

  constructor(private authService:AuthService,private toastSrv:ToastrService,private inventoryReqService:InventoryRequestService) { }

  ngOnInit() {
    this.getAllFillingRequests()
    this.getUser();
  }


  getAllFillingRequests(){
    this.inventoryReqService.getFillingRequestsList().subscribe(data=>{
    if(data){
      debugger;
      this.allFillingRequests = data
      this.allFillingRequestsCopy = data
    }
    })
  }

  filterByNumber(ev){
    var itemNumber = ev.target.value;
    var tempArr = [];

    if(itemNumber != ''){
    for (let i = 0; i < this.allFillingRequests.length; i++) {
     for (let j = 0; j < this.allFillingRequests[i].reqList.length; j++) {
      if(this.allFillingRequests[i].reqList[j].itemNumber == itemNumber) {
        tempArr.push(this.allFillingRequests[i])
      }
       
     }
      
    }
    this.allFillingRequests = tempArr
    } else {
      this.allFillingRequests = this.allFillingRequestsCopy
    }
  }
  filterByOrder(ev){
    var orderNumber = ev.target.value;
    var tempArr = [];

    if(orderNumber != ''){
    for (let i = 0; i < this.allFillingRequests.length; i++) {
     for (let j = 0; j < this.allFillingRequests[i].reqList.length; j++) {
      if(this.allFillingRequests[i].reqList[j].orderNumber == orderNumber) {
        tempArr.push(this.allFillingRequests[i])
      }
       
     }
      
    }
    this.allFillingRequests = tempArr
    } else {
      this.allFillingRequests = this.allFillingRequestsCopy
    }
  }

  
  filterByDate(){
    debugger;
    this.inventoryReqService.filterByDate(this.fromDate.nativeElement.value,this.toDate.nativeElement.value).subscribe(data=>{
    if(data){
      this.allFillingRequests = data;
    }
    
    })
  }

  
  getUserInfo() {
  
    this.authService.userEventEmitter.subscribe(user => {
      this.user = user.loggedInUser;
    })

    if (!this.authService.loggedInUser) {
      this.authService.userEventEmitter.subscribe(user => {
        if (user.userName) {
          this.user = user;
        }
      });
    }
    else {
      this.user = this.authService.loggedInUser;
    }
  }

  clickIfArrived(reqId,itemNumber,orders){
    debugger;
    // if(this.user.userName == undefined) {
    //   this.getUser();
    //   this.clickIfArrived(reqId,itemNumber);
    // }  else {
      if(this.user.userName == 'tomer' || this.user.userName == 'SHARK'  || this.user.userName == 'sima'){
        var obj = {
          itemN:itemNumber,
          requestId:reqId,
          orders:orders
        }
        this.inventoryReqService.checkArrived(obj).subscribe(data=>{
          if(data){
            this.allFillingRequests = data;
            this.toastSrv.success('עודכן בהצלחה !')
          }
    
        })
      } else {
        this.toastSrv.error('רק משתמש מורשה רשאי לעדכן')
      }
  // }
   
   
  }

  async getUser() {
    await this.authService.userEventEmitter.subscribe(user => {
      this.user=user;
      // this.user=user.loggedInUser;
      // if (!this.authService.loggedInUser) {
      //   this.authService.userEventEmitter.subscribe(user => {
      //     if (user.userName) {
      //       this.user = user;
            
      //     }
      //   });
      // }
      // else {
      //   this.user = this.authService.loggedInUser;
      // }
      if (this.user.authorization){
        if (this.authService.loggedInUser.authorization.includes("updateStock")){
          this.allowCheckArrived = true;
        }
      }

    });

  }
}
