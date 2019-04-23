import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expected-arrivals',
  templateUrl: './expected-arrivals.component.html',
  styleUrls: ['./expected-arrivals.component.css']
})
export class ExpectedArrivalsComponent implements OnInit {

  newItemProcurmentDetails: FormGroup;
  newOrderProcurmentDetails: FormGroup;
  newTransportDetails: FormGroup;
  transportationItem: FormGroup;
  procurementModalHeader:String;
  updateTypeView:String;
  arrToUpdate: Array<any>;
  updateTransportaion: Boolean=false;

  itemExpectedArrivals: Array<any>=[];

  @Input() componentData: any;
  @Output() outPutItemsExpectedData = new EventEmitter();
  @ViewChild('singleBtn') singleBtn: ElementRef;
  @ViewChild('multiBtn') multiBtn: ElementRef;
  // @ViewChild('orderBtn') orderBtn: ElementRef;
  singleBtnStyle:String;
  multiBtnStyle:String;
  orderBtnStyle:String;
  constructor(private fb: FormBuilder) {

    this.newItemProcurmentDetails = fb.group({
      componentN: ["", Validators.required],// מספר פריט 
      componentNs: ["", ],// מספר מק"ט אצל הספק
      suplierN: ["", Validators.required],// מספר הזמנת רכש
      suplierName: ["", Validators.required],// מספר הזמנת רכש
      procurmentOrderNumber: [Number, Validators.required],// מספר הזמנת רכש
      jobNumber: ["", Validators.required],// מספר הזמנת רכש
      expectedDate: [Date, Validators.required],// מספר הזמנת רכש
      suppliedDate: [Date, Validators.required],// מספר הזמנת רכש
      quantity: [Number, Validators.required],// מספר הזמנת רכש
      quantityRecived: [Number, Validators.required],
      remarks: ["", ],
      lastUpdateDate: [Date, Validators.nullValidator],
      lastUpdateUser: ["", Validators.nullValidator],
      status: ["", Validators.nullValidator],
    });

    this.newTransportDetails = fb.group({
      jobNumber: ["", Validators.required],// מספר הזמנת רכש
      transporterName: ["", Validators.required],// מספר הזמנת רכש
      expectedDate: [Date, Validators.required],// מספר הזמנת רכש
      suppliedDate: [Date, Validators.required],// מספר הזמנת רכש
      transportationItems: [[], Validators.required],// מספר הזמנות רכש
      shippingMethod: ["", Validators.required],
      remarks: ["", ],
      lastUpdateDate: [Date, Validators.nullValidator],
      lastUpdateUser: ["", Validators.nullValidator],
      status: ["", Validators.nullValidator],
    });
    this.transportationItem = fb.group({
      componentN: ["", Validators.required],// מספר הזמנת רכש
      componentNs: ["", Validators.required],// מספר הזמנת רכש
      procurmentOrderNumber: ["", Validators.required],// מספר הזמנת רכש
      quantity: [Number, Validators.required],// מספר הזמנת רכש
      quantityRecived: [Number, Validators.required],
    });
    
   }



   getComponentsDataFromStockTb(componentEvent){
    console.log('Got me some component data here from stock-tb')
    console.log(componentEvent)

    debugger
   }


   ngOnInit() {
    this.procurementModalHeader= "צפי הגעה של הזמנות רכש - פריט "+this.componentData.componentN;      

    console.log('this is the  data recived in Input  ')
    console.log(this.componentData)
    debugger
    this.itemExpectedArrivals=[
      {
        componentN: "12185",  
        componentNs: "16411000", 
        suplierN: "34301", 
        suplierName: "Sanwa",
        procurmentOrderNumber: "121212",
        jobNumber: "111111",
        transporterName: "someTramsporter",
        expectedDate: new Date(),
        suppliedDate: null,
        quantity: 10000,
        quantityRecived: 0, 
        remarks: "some text", 
        lastUpdateDate: new Date(), 
        lastUpdateUser: "noa seri", 
        status: "open", 
      }
    ]
  }

  closeMadal(){
    
    this.outPutItemsExpectedData.emit('closeModal');  
    this.componentData={};
    this.procurementModalHeader='';
  }

  chooseExpectedDateUpdateType(updateType, event){
    this.setBtnColor(updateType, event);
    this.updateTypeView=updateType;
    this.loadDataToUpdateRow();


  }

  loadDataToUpdateRow(){
    this.newItemProcurmentDetails.controls.componentNs.setValue(this.componentData.componentNs);
    this.newItemProcurmentDetails.controls.suplierN.setValue(this.componentData.suplierN);
    this.newItemProcurmentDetails.controls.suplierName.setValue(this.componentData.suplierName);
    this.newItemProcurmentDetails.controls.procurmentOrderNumber.setValue(this.componentData.procurmentOrderNumber);
    this.newItemProcurmentDetails.controls.quantity.setValue(null);
  }

  addItem(){
    this.newItemProcurmentDetails;
    this.newTransportDetails;
  
    this.arrToUpdate;
  }
  saveUpdates(){

  }
  setBtnColor(updateType, ev){
  switch (updateType) {

      case 'singleItem': {
        this.singleBtn.nativeElement.style.backgroundColor='blue'
        this.singleBtn.nativeElement.style.color='white'
        this.multiBtn.nativeElement.style.backgroundColor='white'
        this.multiBtn.nativeElement.style.color='black'
        // this.orderBtn.nativeElement.style.backgroundColor='white'
        // this.orderBtn.nativeElement.style.color='black'

        break;
      }
      case 'multiItems': {
        this.singleBtn.nativeElement.style.backgroundColor='white'
        this.singleBtn.nativeElement.style.color='black'
        this.multiBtn.nativeElement.style.backgroundColor='blue'
        this.multiBtn.nativeElement.style.color='white'
        // this.orderBtn.nativeElement.style.backgroundColor='white'
        // this.orderBtn.nativeElement.style.color='black'
        break;
      }
      case 'order': {
        this.singleBtn.nativeElement.style.backgroundColor='white'
        this.singleBtn.nativeElement.style.color='black'
        this.multiBtn.nativeElement.style.backgroundColor='white'
        this.multiBtn.nativeElement.style.color='black'
        // this.orderBtn.nativeElement.style.backgroundColor='blue'
        // this.orderBtn.nativeElement.style.color='white'
        break;
      }
    }
    this.updateTypeView=updateType;
  }
}




