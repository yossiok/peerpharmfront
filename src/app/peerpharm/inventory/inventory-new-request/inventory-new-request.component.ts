import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import * as moment from 'moment';
import { DISABLED } from '@angular/forms/src/model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-inventory-new-request',
  templateUrl: './inventory-new-request.component.html',
  styleUrls: ['./inventory-new-request.component.css'],

})
export class InventoryNewRequestComponent implements OnInit {
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
  }

  constructor(private fb: FormBuilder, private inventoryReqService: InventoryRequestService, private toastSrv: ToastrService) { 

    this.inventoryReqForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      reqNum: [{value:Number}],
      fromWH: ["", Validators.required],
      toWH: ["", Validators.required],
      currDate: [this.currentDate(), Date, Validators.required],
      deliveryDate: [Date, Validators.required],
      reqList: [Array],
    });
    this.itemLine = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      itemNumInput: ['', Validators.required],
      itemAmount: [Number, Validators.required],
      relatedOrder: [''],
    });

  }


  ngOnInit() {
    this.inventoryReqService.getLastRequsetId().subscribe(res => {
      this.newReqNumber=res.reqNum+1;
      this.inventoryReqForm.controls.reqNum.setValue(this.newReqNumber);
      debugger;
    });

    // let newDate = new Date().toString();
    // newDate =moment().format("YYYY/MM/DD");
    // debugger; 
    // this.inventoryReqForm.controls.currDate.setValue(newDate);
  }

  addNewRequest(form){
    //setValue(this.newReqNumber);

    // this.inventoryReqForm.controls.reqNum.setValue(this.newReqNumber);
    // form.reqNum.setValue(this.newReqNumber);
    // form.controls.reqNum.setValue(this.newReqNumber);
    debugger
    this.inventoryReqForm.value.reqNum;
    if(this.inventoryReqForm.valid){
      this.invReq={
        reqNum: this.inventoryReqForm.value.reqNum,
        fromWH:this.inventoryReqForm.value.fromWH,
        toWH: this.inventoryReqForm.value.toWH,
        currDate: this.inventoryReqForm.value.currDate,   
        deliveryDate: this.inventoryReqForm.value.deliveryDate,   
        reqList:this.inventoryReqForm.value.reqList,
        itemsType: 'components', 
        reqStatus:'open',
      }
      this.inventoryReqService.addNewRequest(this.invReq).subscribe(res => {
        debugger;
        if(res){
          this.toastSrv.success("Request sent to "+ this.inventoryReqForm.value.fromWH +" wharehouse.");
          //error("Failed pleae finish filling the form");
          console.log(res);
        }
      });
    }else{
      this.toastSrv.error("Failed pleae finish filling the form");
    }

  }


  async addItemToRequsetList(reqItemLine){

    //validating order number
    let validOrderN=false;
    if(reqItemLine.relatedOrder!=""){
      await this.inventoryReqService.checkIfOrderNumExist(reqItemLine.relatedOrder).subscribe( async res => { 
        if(res.length>0){
          validOrderN=true;
          debugger
           //validating item number
          if(reqItemLine.itemNumInput!=""  &&  reqItemLine.itemAmount!="" && validOrderN ){
            debugger
             this.inventoryReqService.checkIfComptNumExist(reqItemLine.itemNumInput).subscribe(res => {
            console.log("checkIfComptNumExist res:"+res[0]);
            debugger;
            if(res.length>0){
                let reqListItem={
                  itemNumber:reqItemLine.itemNumInput,
                  itemName:res[0].componentName,
                  amount:reqItemLine.itemAmount,
                  relatedOrder:reqItemLine.relatedOrder,
                }
                debugger;
                this.reqList.push(reqListItem);
                debugger;
                this.itemLine.controls.itemNumInput.setValue('');
                this.itemLine.controls.itemAmount.setValue('');
                this.itemLine.controls.relatedOrder.setValue('');
              }else{
                validOrderN=false;
                this.toastSrv.error("Failed wrong item number");
              }
            });
          }

        }else{
          validOrderN=false;
          this.toastSrv.error("Failed wrong order number");
        }
      });
    }
debugger  

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

}