import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import * as moment from 'moment';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-inventory-new-request',
  templateUrl: './inventory-new-request.component.html',
  styleUrls: ['./inventory-new-request.component.css'],

})
export class InventoryNewRequestComponent implements OnInit {
  newReqNumber:Number;
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

  constructor(private fb: FormBuilder, private inventoryReqService: InventoryRequestService) { 

    this.inventoryReqForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      reqNum: [{value: Number, disabled: true}, Validators.required],
      fromWH: ["", Validators.required],
      toWH: ["", Validators.required],
      currDate: [Date, Validators.required],
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
    debugger
    if(this.inventoryReqForm.valid){
      this.invReq={
        reqNum: form.reqNum,
        fromWH:form.fromWH,
        toWH: form.toWH,
        currDate: form.currDate,   
        deliveryDate: form.deliveryDate,   
        reqList:this.reqList,
        itemsType: 'components', 
        reqStatus:'open',
      }
      this.inventoryReqService.addNewRequest(this.invReq).subscribe(res => {
        debugger;
        console.log(res);
      });
    }

  }


  async addItemToRequsetList(reqItemLine){

    //validating order number
    let validOrderN=false;
    if(reqItemLine.relatedOrder!=""){
      await this.inventoryReqService.checkIfOrderNumExist(reqItemLine.relatedOrder).subscribe(res => { 
        if(res){
          validOrderN=true;
        }
      });
    }else{
      validOrderN=true;
    }
    //validating item number
    if(reqItemLine.itemNumInput!=""  &&  reqItemLine.itemAmount!="" && validOrderN ){
       await this.inventoryReqService.checkIfComptNumExist(reqItemLine.itemNumInput).subscribe(res => {
      console.log("checkIfComptNumExist res:"+res);
      debugger;
      typeof(res);
      if(res){
          let reqListItem={
            itemNumber:reqItemLine.itemNumInput,
            itemName:res.componentName,
            amount:reqItemLine.itemAmount,
            relatedOrder:reqItemLine.relatedOrder,
          }
          debugger;
          this.reqList.push(reqListItem);
          debugger;
          this.itemLine.controls.itemNumInput.setValue('');
          this.itemLine.controls.itemAmount.setValue('');
          this.itemLine.controls.relatedOrder.setValue('');
        }
      });
    }
  }

  deleteRow(itemNum,itemAmout){
    this.reqList.forEach(function(item, index, object){
      if (item.itemNumber==itemNum && item.amount==itemAmout ) {
        object.splice(index, 1)
      }
    });

  }

}



