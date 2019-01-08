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
    });

  }


  ngOnInit() {
    this.inventoryReqService.getLastRequsetId().subscribe(res => {
      this.newReqNumber=res.reqNum+1;
      this.inventoryReqForm.controls.reqNum.setValue(this.newReqNumber);
    });
    this.inventoryReqForm.controls.currDate.setValidators([]);
    this.inventoryReqForm.controls.reqList.setValidators([]);
  }

  addNewRequest(form){
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

    if(reqItemLine.itemNumInput!=""  &&  reqItemLine.itemAmount!="" ){
            
      await this.inventoryReqService.checkIfComptNumExist(reqItemLine.itemNumInput).subscribe(async res => {
        if(res.length>0){
          let reqListItem={
            itemNumber:reqItemLine.itemNumInput,
            itemName:res[0].componentName,
            amount:reqItemLine.itemAmount,
            relatedOrder:reqItemLine.relatedOrder,
          }

          if(reqItemLine.relatedOrder!=""){
            await this.inventoryReqService.checkIfOrderNumExist(reqItemLine.relatedOrder).subscribe( async res => { 
              debugger
              if(res.length>0){
                validOrderN=true;
                 //validating item number
                  //add to req list
                  this.reqList.push(reqListItem);
                  this.itemLine.controls.itemNumInput.setValue('');
                  this.itemLine.controls.itemAmount.setValue('');
                  this.itemLine.controls.relatedOrder.setValue('');
      
              }else{
                validOrderN=false;
                this.toastSrv.error("Failed wrong order number");
              }
            });
          }else{
            //add to req list
            this.reqList.push(reqListItem);
            this.itemLine.controls.itemNumInput.setValue('');
            this.itemLine.controls.itemAmount.setValue('');
            this.itemLine.controls.relatedOrder.setValue('');
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