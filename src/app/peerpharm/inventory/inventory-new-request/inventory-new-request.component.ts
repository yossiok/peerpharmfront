import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import * as moment from 'moment';

@Component({
  selector: 'app-inventory-new-request',
  templateUrl: './inventory-new-request.component.html',
  styleUrls: ['./inventory-new-request.component.css'],

})
export class InventoryNewRequestComponent implements OnInit {
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
      reqNum: [Number, Validators.required],
      fromWH: ['', Validators.required],
      toWH: ['', Validators.required],
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

    // let newDate = new Date().toString();
    // newDate =moment().format("YYYY/MM/DD"); 
    // console.log(newDate);
    // this.invReq.currDate=newDate;

    // this.inventoryReqService.getLastRequsetId().subscribe(res => {
    //   debugger;
    //   console.log(res)
    // });
  }

  addNewRequest(form){
    
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

    console.log(this.invReq);
    debugger;
    this.inventoryReqService.addNewRequest(this.invReq).subscribe(res => {
      debugger;
      console.log(res)
    });
  }


  addToRequsetList(reqItemLine){
    // this.itemLine.value;
    // this.itemNumInput;
    reqItemLine;
    debugger;
    if(reqItemLine.itemNumInput!=""&&reqItemLine.itemAmount!=""){
      let reqListItem={
        itemNumber:reqItemLine.itemNumInput,
        itemName:"TBD",
        amount:reqItemLine.itemAmount,
        relatedOrder:reqItemLine.relatedOrder,
      }
      this.reqList.push(reqListItem);
      debugger;
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
