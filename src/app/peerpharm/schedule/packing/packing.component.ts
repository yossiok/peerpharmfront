import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {
data:Array<any>;
  constructor(private itemsService:ItemsService ) { }

  ngOnInit() {
    
    this.itemsService.getAllItems().subscribe((items) => {
      this.data=items;
      
      
    } );  }



}








// let formDetailsObj=
// {
//   _id:Schema.Types.ObjectId,
//   formHeaderId:String,
//   itemN:String,
//   productName:String,
//   cartonUnitNumber:String,
//   batchN:String,
//   fillingDate:String,
//   costumerName:String,
//   status:String,

//   scheduleId:String,
  
//   cleanFillMachineSignature:String,
//   checkSignature:String,
//   directorFrontSignature:String,
//   directorBackSignature:String,

//   visualIndentCheck:Boolean,
//   containeMatchAndClean:Boolean,
//   presentOfTheLabels:Boolean,
//   presentOfPackageComponent:Boolean,
//   confSetupeClean:Boolean,

//   confrimOfCleaning:Boolean,

//   drumsAmount:String,
//   endTimeWork:String,
//   expirationDate:String,
//   fillStartTime:String,
//   dateN:String,

//   batchStatus:String,
//   leftBatchNumber:String, // this field is to know witch batch to update in the batches tables
//   leftBatchWeight:String,

//   filledBy:String,
//   grossWeight:String,
//   labeledBy:String,
//   masterCartonN:String,
//   netWeight:String,
//   orderNumber:String,
//   orderQuantity:String,
//   packageBy:String,
//   packageStartTime:String,
//   packageStatus:String,
//   packagerName:String,
//   packgeEndTime:String,
//   personalPackageN:String,
//   personalPackage:Boolean,

//   productaionDate:String,
//   backRemarks:String,
//   quantity_Produced:String,
//   frontRemarks:String,
//   totalCartons:String,
//   totalUnits:String,
//   weightRange:String,




//   checkTime1:String,
//   checkTime2:String,
//   checkTime3:String,
//   checkTime4:String,
//   checkBox_clean1:Boolean,
//   checkBox_clean2:Boolean,
//   checkBox_clean3:Boolean,
//   checkBox_clean4:Boolean,
//   checkBox_closedWaterProof1:Boolean,
//   checkBox_closedWaterProof2:Boolean,
//   checkBox_closedWaterProof3:Boolean,
//   checkBox_closedWaterProof4:Boolean,
//   checkBox_correctFinalPacking1:Boolean,
//   checkBox_correctFinalPacking2:Boolean,
//   checkBox_correctFinalPacking3:Boolean,
//   checkBox_correctFinalPacking4:Boolean,
//   checkBox_lotNumberPrinting1:Boolean,
//   checkBox_lotNumberPrinting2:Boolean,
//   checkBox_lotNumberPrinting3:Boolean,
//   checkBox_lotNumberPrinting4:Boolean,
//   checkBox_stickerPrinting1:Boolean,
//   checkBox_stickerPrinting2:Boolean,
//   checkBox_stickerPrinting3:Boolean,
//   checkBox_stickerPrinting4:Boolean,
//   checkNetoWeight1:String,
//   checkNetoWeight2:String,
//   checkNetoWeight3:String,
//   checkNetoWeight4:String,
//   }