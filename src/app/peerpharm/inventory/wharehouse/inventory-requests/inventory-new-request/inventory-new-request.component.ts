import { Component, OnInit, Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import * as moment from 'moment';
//import { DISABLED } from '@angular/forms/src/model';
import { ToastrService } from 'ngx-toastr';
import { inventoryReqItem } from "../../../models/inventoryReqItem"
import { Http, Response } from "@angular/http";
import { AuthService } from 'src/app/services/auth.service';


// @Injectable({
//   providedIn: "root"
// })

@Component({
  selector: 'app-inventory-new-request',
  templateUrl: './inventory-new-request.component.html',
  styleUrls: ['./inventory-new-request.component.scss'],

})
export class InventoryNewRequestComponent implements OnInit {


  invReq = {
    reqNum: 0,
    fromWH: "",
    toWH: "",
    toDepartment: "",
    currDate: "",
    deliveryDate: "",
    ergent: false,
    reqList: [],// itemId,requiredAmount ,suppliedAmount, relatedOrderNum, itemStatus, itemType
    itemsType: "",
    reqStatus: '',
    qntSupplied: 0,
    userName: '',
  }
  inventoryReqForm: FormGroup;
  itemLine: FormGroup;
  reqList: Array<any> = [];// to show added items to request
  departments: string[] = ["Filling", "Packaging", "Make up", "Printing"]
  reqItemToAdd = new inventoryReqItem;
  today: Date = new Date;
  itemNumInput: String = '';
  relatedOrder: String = '';
  userName: any;
  newReqNumber: number;
  itemAmount: Number;
  showNewReq: boolean = false
  sendingForm: boolean = false


  constructor(private authService: AuthService, private http: Http, private fb: FormBuilder, private inventoryReqService: InventoryRequestService, private toastSrv: ToastrService) {

    this.inventoryReqForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      reqNum: [{ value: Number }, Validators.required],
      fromWH: ["Kasem", Validators.required],
      toWH: ["Filling", Validators.required],
      toDepartment: [""],
      currDate: [this.currentDate(), String],
      deliveryDate: [this.currentDate(), Validators.required],
      reqList: [this.reqList, Validators.required],
      ergent: [false]
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
      this.newReqNumber = res.reqNum + 1;
      this.inventoryReqForm.controls.reqNum.setValue(this.newReqNumber);
    });
    this.inventoryReqForm.controls.currDate.setValidators([]);
    this.inventoryReqForm.controls.reqList.setValidators([]);
  }

  getUserInfo() {
    this.authService.userEventEmitter.subscribe(user => {
      this.userName = user.firstName + " " + user.lastName;
    });


  }

  async addNewRequest() {
    // await this.getNewReqNumber();
    // this.inventoryReqForm.value.reqNum;

    //IN CASE OF MORE THAN ONE USER SENDS REQ AT THE SAME TIME
    if (this.inventoryReqForm.valid && this.reqList.length > 0) {
      this.sendingForm = true
      this.inventoryReqService.getLastRequsetId().subscribe(res => {

        this.newReqNumber = res.reqNum + 1; // for cases more than one user create invReq at the same time - we need an updated reqNum
        this.inventoryReqForm.controls.reqNum.setValue(this.newReqNumber);

        this.invReq = {
          reqNum: this.newReqNumber,
          fromWH: this.inventoryReqForm.value.fromWH,
          toWH: this.inventoryReqForm.value.toWH,
          toDepartment: this.inventoryReqForm.value.toDepartment,
          currDate: this.inventoryReqForm.value.currDate,
          deliveryDate: this.inventoryReqForm.value.deliveryDate,
          ergent: this.inventoryReqForm.value.ergent,
          reqList: this.inventoryReqForm.value.reqList,
          itemsType: 'components',
          reqStatus: 'open',
          qntSupplied: 0,
          userName: this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName,
        }
        this.inventoryReqService.addNewRequest(this.invReq).subscribe(res => {
          if (res != 'reqListNull') {
            this.toastSrv.success("Request sent to " + this.inventoryReqForm.value.fromWH + " warehouse.");
            //error("Failed pleae finish filling the form");
            this.reqList = [];
            this.inventoryReqForm.controls['deliveryDate'].reset(this.currentDate());
            this.inventoryReqForm.controls['currDate'].reset(this.currentDate());
            this.inventoryReqForm.controls['fromWH'].setValue('Kasem');
            this.inventoryReqForm.controls['toWH'].setValue('Filling');
            this.inventoryReqForm.controls['reqList'].setValue(this.reqList);
            console.log('this.inventoryReqForm.value.reqList\n', this.inventoryReqForm.value.reqList);
            this.sendingForm = false
          } else {
            this.sendingForm = false
            this.toastSrv.error("Something went wrong! \nPlease send request again.");
          }
        });
      });
    } else if (this.reqList.length == 0) {
      this.toastSrv.error("Failed please add items");
    } else {
      this.toastSrv.error("Failed please finish filling the form");
    }


  }


  async addItemToRequsetList(reqItemLine) {
    ;
    reqItemLine.itemNumInput = reqItemLine.itemNumInput.trim();
    console.log('reqItemLine.itemNumInput: ' + reqItemLine.itemNumInput);
    reqItemLine.relatedOrder = reqItemLine.relatedOrder.trim();
    console.log('reqItemLine.relatedOrder: ' + reqItemLine.relatedOrder);

    //validating order number
    let validOrderN = false;
    if (reqItemLine.relatedOrder == '') {
      this.toastSrv.error('חובה להזין מספר הזמנה')
    } else {
      if (reqItemLine.itemNumInput != "" && reqItemLine.itemAmount != "") {

        await this.inventoryReqService.checkIfComptNumExist(reqItemLine.itemNumInput).subscribe(async res => {
          if (res.length > 0) {
            let reqListItem = {
              itemNumber: reqItemLine.itemNumInput,
              itemName: res[0].componentName,
              amount: reqItemLine.itemAmount,
              relatedOrder: reqItemLine.relatedOrder,
              qntSupplied: 0,
              remarks: reqItemLine.remarks,
            }
            this.reqItemToAdd = reqListItem; // class inventoryReqItem
            if (reqItemLine.relatedOrder != "") {
              await this.inventoryReqService.checkIfOrderNumExist(reqItemLine.relatedOrder).subscribe(async res => {
                if (res.length > 0) {
                  validOrderN = true;
                  //validating item number
                  //add to req list
                  this.reqList.push(this.reqItemToAdd);
                  this.itemLine.controls.itemNumInput.setValue('');
                  this.itemLine.controls.itemAmount.setValue('');
                  this.itemLine.controls.relatedOrder.setValue('');
                  this.itemLine.controls.remarks.setValue('');

                } else {
                  validOrderN = false;
                  this.toastSrv.error("Failed wrong order number");
                }
              });
            } else {
              //add to req list
              this.reqList.push(this.reqItemToAdd);
              this.itemLine.controls.itemNumInput.setValue('');
              this.itemLine.controls.itemAmount.setValue('');
              this.itemLine.controls.relatedOrder.setValue('');
              this.itemLine.controls.remarks.setValue('');
            }
          } else {
            validOrderN = false;
            this.toastSrv.error("Failed wrong item number");
          }
        });
      }
    }


  }

  deleteRow(itemNum, itemAmout) {
    this.reqList.forEach(function (item, index, object) {
      if (item.itemNumber == itemNum && item.amount == itemAmout) {
        object.splice(index, 1)
      }
    });
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }
  compareTwoDates() { }

}