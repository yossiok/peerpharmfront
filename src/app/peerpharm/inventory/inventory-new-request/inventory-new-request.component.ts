import { Component, OnInit ,Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import * as moment from 'moment';
import { DISABLED } from '@angular/forms/src/model';
import { ToastrService } from 'ngx-toastr';
import {inventoryReqItem} from "../models/inventoryReqItem"
import { Http, Response } from "@angular/http";
import { AuthService } from 'src/app/services/auth.service';


// @Injectable({
//   providedIn: "root"
// })

@Component({
  selector: 'app-inventory-new-request',
  templateUrl: './inventory-new-request.component.html',
  styleUrls: ['./inventory-new-request.component.css'],

})
export class InventoryNewRequestComponent implements OnInit {
  // private socket: any;
  // newInventoryReqEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  reqItemToAdd= new inventoryReqItem;
  userName: any;
  newReqNumber:number;
  inventoryReqForm: FormGroup;
  itemLine: FormGroup;
  reqList:Array<any>=[];// to show added items to request
  itemNumInput:String='';
  itemAmount:Number;
  relatedOrder:String='';
  today:Date=new Date;

  invReq={
    reqNum: 0,
    fromWH:"",
    toWH: "",
    currDate: "",   
    deliveryDate: "",   
    reqList:[],// itemId,requiredAmount ,suppliedAmount, relatedOrderNum, itemStatus, itemType
    itemsType: "", 
    reqStatus:'',
    qntSupplied:0,
    userName:'',
  }

  constructor(private authService: AuthService, private http: Http, private fb: FormBuilder, private inventoryReqService: InventoryRequestService, private toastSrv: ToastrService) { 
  //  this.socket = io(`http://127.0.0.1:8200`); Localhost
  // this.socket = io(`http://18.221.58.99:8200`);
  // this.socket.on("connect", () => {
  //   this.socket.on("newInventoryReq", data => {
  //     this.newInventoryReqEventEmitter.emit(data);
  //   });
  // });
    this.inventoryReqForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      reqNum: [{value:Number}, Validators.required],
      fromWH: ["", Validators.required],
      toWH: ["", Validators.required],
      currDate: [this.currentDate(), String ],
      deliveryDate: [String, Validators.required],
      reqList:  [this.reqList, Validators.required]
    });
    this.itemLine = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      itemNumInput: ['', Validators.required],
      itemAmount: [Number, Validators.required],
      relatedOrder: [''],
      remarks: [''],
    });

  }


  ngOnInit() {
    // this.getNewReqNumber();
    this.getUserInfo();
    this.inventoryReqService.getLastRequsetId().subscribe(res => {
      this.newReqNumber=res.reqNum+1;
      this.inventoryReqForm.controls.reqNum.setValue(this.newReqNumber);
    });
    this.inventoryReqForm.controls.currDate.setValidators([]);
    this.inventoryReqForm.controls.reqList.setValidators([]);
  }

  getUserInfo() {
        this.authService.userEventEmitter.subscribe(user => {
        this.userName=user.firstName+" "+user.lastName;
      });


}

  async addNewRequest(form){
    // await this.getNewReqNumber();
    // this.inventoryReqForm.value.reqNum;

    //IN CASE OF MORE THAN ONE USER SENDS REQ AT THE SAME TIME
    this.inventoryReqService.getLastRequsetId().subscribe(res => {

      this.newReqNumber=res.reqNum+1; // for cases more than one user create invReq at the same time - we need an updated reqNum
      this.inventoryReqForm.controls.reqNum.setValue(this.newReqNumber);

      if(this.inventoryReqForm.valid && this.reqList.length>0){
        this.invReq={
          reqNum: this.newReqNumber,
          fromWH:this.inventoryReqForm.value.fromWH,
          toWH: this.inventoryReqForm.value.toWH,
          currDate: this.inventoryReqForm.value.currDate,   
          deliveryDate: this.inventoryReqForm.value.deliveryDate,   
          reqList:this.inventoryReqForm.value.reqList,
          itemsType: 'components', 
          reqStatus:'open',
          qntSupplied: 0,
          userName: this.userName,
        }
        this.inventoryReqService.addNewRequest(this.invReq).subscribe(res => {
          if(res){
            this.toastSrv.success("Request sent to "+ this.inventoryReqForm.value.fromWH +" warehouse.");
            //error("Failed pleae finish filling the form");
            this.reqList=[];
            this.inventoryReqForm.controls['deliveryDate'].reset();
            this.inventoryReqForm.controls['fromWH'].reset();
            this.inventoryReqForm.controls['toWH'].reset();
            this.inventoryReqForm.controls['reqList'].reset();
            console.log('this.inventoryReqForm.value.reqList\n',this.inventoryReqForm.value.reqList);

          }
        });
      }else if(this.reqList.length==0){
        this.toastSrv.error("Failed pleaes items to form");
      }else {
        this.toastSrv.error("Failed pleaes finish filling the form");
      }
    });

    
  }


  async addItemToRequsetList(reqItemLine){

    //validating order number
    let validOrderN=false;

    if(reqItemLine.itemNumInput!=""  &&  reqItemLine.itemAmount!="" ){
            
      await this.inventoryReqService.checkIfComptNumExist(reqItemLine.itemNumInput).subscribe(async res => {
        if(res.length>0){
          let reqListItem={
            itemNumber:reqItemLine.itemNumInput,
            itemName:res[0].componentName,
            amount:reqItemLine.itemAmount,
            relatedOrder:reqItemLine.relatedOrder,
            qntSupplied:0,
            remarks: reqItemLine.remarks,
          }
          this.reqItemToAdd= reqListItem; // class inventoryReqItem
          if(reqItemLine.relatedOrder!=""){
            await this.inventoryReqService.checkIfOrderNumExist(reqItemLine.relatedOrder).subscribe( async res => { 
              debugger
              if(res.length>0){
                validOrderN=true;
                 //validating item number
                  //add to req list
                  this.reqList.push( this.reqItemToAdd);
                  this.itemLine.controls.itemNumInput.setValue('');
                  this.itemLine.controls.itemAmount.setValue('');
                  this.itemLine.controls.relatedOrder.setValue('');
                  this.itemLine.controls.remarks.setValue('');
      
              }else{
                validOrderN=false;
                this.toastSrv.error("Failed wrong order number");
              }
            });
          }else{
            //add to req list
            this.reqList.push( this.reqItemToAdd);
            this.itemLine.controls.itemNumInput.setValue('');
            this.itemLine.controls.itemAmount.setValue('');
            this.itemLine.controls.relatedOrder.setValue('');
            this.itemLine.controls.remarks.setValue('');
          }
       }else{
         validOrderN=false;
         this.toastSrv.error("Failed wrong item number");
       }
     });
   }

    // if(reqItemLine.relatedOrder!=""){
    //   await this.inventoryReqService.checkIfOrderNumExist(reqItemLine.relatedOrder).subscribe( async res => { 
    //     debugger
    //     if(res.length>0){
    //       validOrderN=true;
    //        //validating item number


    //     }else{
    //       validOrderN=false;
    //       this.toastSrv.error("Failed wrong order number");
    //     }
    //   });
    // }
  }

  deleteRow(itemNum,itemAmout){
    this.reqList.forEach(function(item, index, object){
      if (item.itemNumber==itemNum && item.amount==itemAmout ) {
        object.splice(index, 1)
      }
    });
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }
  compareTwoDates(){}

}