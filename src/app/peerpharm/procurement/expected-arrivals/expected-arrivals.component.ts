import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

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
  EditRowId: String = "";
  lineToUpdate:any;
  multiItemsToUpdateView: Array<any>;
  userName:String;
  jobNumberList:Array<any>;


  @Input() componentData: any;
  @Output() outPutItemsExpectedData = new EventEmitter();
  @ViewChild('singleBtn') singleBtn: ElementRef;
  @ViewChild('multiBtn') multiBtn: ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
}
  // @ViewChild('orderBtn') orderBtn: ElementRef;
  singleBtnStyle:String;
  multiBtnStyle:String;
  orderBtnStyle:String;
  constructor(private fb: FormBuilder, private invtSer:InventoryService, private procuretServ: Procurementservice, private toastSrv: ToastrService, 
    private authService: AuthService,) {

    this.newItemProcurmentDetails = fb.group({
      componentN: ["", Validators.required],// מספר פריט 
      componentName: ["", Validators.required],// מספר פריט 
      componentNs: ["", ],// מספר מק"ט אצל הספק
      cmxComponentN: ["", Validators.required],// מספר מק"ט אצל הספק
      suplierN: ["", Validators.required],// מספר הזמנת רכש
      suplierName: ["", Validators.required],// מספר הזמנת רכש
      procurmentOrderNumber: ["", Validators.required],// מספר הזמנת רכש
      jobNumber: ["", ],// מספר הזמנת רכש
      expectedDate: [Date, Validators.required],// מספר הזמנת רכש
      suppliedDate: [Date, Validators.required],// מספר הזמנת רכש
      quantity: [Number, Validators.required,],// מספר הזמנת רכש
      quantityRecived: [0, Validators.required],
      remarks: ["", ],
      lastUpdateDate: [Date, Validators.nullValidator],
      lastUpdateUser: ["", Validators.nullValidator],
      status: ["", Validators.nullValidator],
    });

    this.newTransportDetails = fb.group({
      jobNumber: ["", Validators.required],// מספר הזמנת רכש
      transporterName: ["", Validators.required],// מספר הזמנת רכש
      expectedDate: [Date, Validators.required],// מספר הזמנת רכש
      suppliedDate: [Date, ],// מספר הזמנת רכש
      transportationItems: [[], Validators.required],// מספר הזמנות רכש
      shippingMethod: ["", Validators.required],
      remarks: ["", ],
      lastUpdateDate: [Date, Validators.nullValidator],
      lastUpdateUser: ["", Validators.nullValidator],
      status: ["", Validators.nullValidator],
    });
    this.transportationItem = fb.group({
      componentN: ["", Validators.required],// מספר הזמנת רכש
      componentNs: ["", ],// מספר הזמנת רכש
      cmxComponentN: ["", Validators.required],// מספר הזמנת רכש
      procurmentOrderNumber: ["", Validators.required],// מספר הזמנת רכש
      quantity: [Number, Validators.required],// מספר הזמנת רכש
      quantityRecived: [Number, Validators.required],
    });
    
   }



  //  getComponentsDataFromStockTb(componentEvent){
  //   console.log('Got me some component data here from stock-tb')
  //   console.log(componentEvent)
  //  }


   ngOnInit() {
    this.userName= this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName
    this.procurementModalHeader= "צפי הגעה של הזמנות רכש - פריט "+this.componentData.componentN;      
    this.arrToUpdate=[];  
    this.getItemExpectedArrivalsData();
    console.log('this is the  data recived in @Input  ')
    console.log(this.componentData)
  }

  getItemExpectedArrivalsData(){
    this.procuretServ.getItemExpectedArrivals(this.componentData.componentN).subscribe(res=>{
      if(res.length>0){
        this.itemExpectedArrivals=res;
      }
    });
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
    this.newItemProcurmentDetails.controls.componentN.setValue(this.componentData.componentN);
    this.newItemProcurmentDetails.controls.componentName.setValue(this.componentData.componentName);
    this.newItemProcurmentDetails.controls.componentNs.setValue(this.componentData.componentNs);
    this.newItemProcurmentDetails.controls.cmxComponentN.setValue(this.componentData.componentN);
    this.newItemProcurmentDetails.controls.suplierN.setValue(this.componentData.suplierN);
    this.newItemProcurmentDetails.controls.suplierName.setValue(this.componentData.suplierName);
    this.newItemProcurmentDetails.controls.procurmentOrderNumber.setValue(this.componentData.procurmentOrderNumber);
    this.newItemProcurmentDetails.controls.quantity.setValue(null);
  }

  addItem(){
    let objToAdd= this.adjustObj();

    if(this.newItemProcurmentDetails.valid){
      if(this.newItemProcurmentDetails.value.componentN != this.componentData.componentN){
        //check if stock item exist stockType= this.componentData.
        this.invtSer.getCmptByNumber(objToAdd.componentN, this.componentData.itemType).subscribe(res=>{
          if(res.length>0){
            this.arrToUpdate.push(objToAdd);
            this.resetUpdateLine();
            //continue
          }else{
            this.toastSrv.error('מספר מק"ט פנימי שגוי');
          }
        })
      }else{
        this.arrToUpdate.push(objToAdd);
        this.resetUpdateLine();
      }

    }else{
      this.toastSrv.error("חסר מידע - לא ניתן לשמור");
    }
  
  }

resetUpdateLine(){
      //reset after push to arr
      this.newItemProcurmentDetails.controls.componentNs.setValue('');
      this.newItemProcurmentDetails.controls.remarks.setValue('');
      this.newItemProcurmentDetails.controls.quantity.setValue('');
      this.transportationItem.reset();
}


  adjustObj(){
    //default of new data
    this.newItemProcurmentDetails.controls.lastUpdateDate.setValue(new Date());
    this.newItemProcurmentDetails.controls.lastUpdateUser.setValue(this.userName);
    this.newItemProcurmentDetails.controls.status.setValue('open');
    
    if(this.updateTransportaion){
      debugger
      
      this.addTransportationItem();
      this.newTransportDetails.controls.lastUpdateDate.setValue(new Date());
      this.newTransportDetails.controls.lastUpdateUser.setValue(this.userName);
      this.newItemProcurmentDetails.controls.status.setValue('open');
      if(this.newTransportDetails.valid){
        this.newItemProcurmentDetails.controls.jobNumber.setValue(this.newTransportDetails.value.jobNumber);
        this.newItemProcurmentDetails.controls.expectedDate.setValue(this.newTransportDetails.value.expectedDate);
      }else{
        this.toastSrv.error("חסרים נתוני שינוע");
      }
    }else{
      this.newItemProcurmentDetails.controls.jobNumber.setValue('');
    }
    let obj=
      {
        componentN: this.newItemProcurmentDetails.value.componentN.trim(),
        componentName: this.newItemProcurmentDetails.value.componentName.trim(),
        componentNs: this.newItemProcurmentDetails.value.componentNs.trim(),
        cmxComponentNs: this.newItemProcurmentDetails.value.cmxComponentN.trim(),
        suplierN: this.newItemProcurmentDetails.value.suplierN.trim(),
        suplierName: this.newItemProcurmentDetails.value.suplierName.trim(),
        procurmentOrderNumber: this.newItemProcurmentDetails.value.procurmentOrderNumber.trim(),
        jobNumber: this.newItemProcurmentDetails.value.jobNumber.trim(),
        expectedDate: this.newItemProcurmentDetails.value.expectedDate,
        suppliedDate: this.newItemProcurmentDetails.value.suppliedDate,
        quantity: this.newItemProcurmentDetails.value.quantity,
        quantityRecived: this.newItemProcurmentDetails.value.quantityRecived,
        remarks: this.newItemProcurmentDetails.value.remarks.trim(),
        lastUpdateDate: this.newItemProcurmentDetails.value.lastUpdateDate,
        lastUpdateUser: this.userName,
        status: 'open',
      }
      return obj;
    
  }

  addTransportationItem(){
    this.transportationItem.reset();
    this.transportationItem.controls.componentN.setValue(this.newItemProcurmentDetails.value.componentN); 
    this.transportationItem.controls.componentNs.setValue(this.newItemProcurmentDetails.value.componentNs); 
    this.transportationItem.controls.cmxComponentN.setValue(this.newItemProcurmentDetails.value.cmxComponentN); 
    this.transportationItem.controls.procurmentOrderNumber.setValue(this.newItemProcurmentDetails.value.procurmentOrderNumber); 
    this.transportationItem.controls.quantity.setValue(this.newItemProcurmentDetails.value.quantity); 
    this.transportationItem.controls.quantityRecived.setValue(this.newItemProcurmentDetails.value.quantityRecived); 

    this.newTransportDetails.value.transportationItems.push(this.transportationItem.value);
    console.log(this.newTransportDetails.value);
    debugger
  }

  saveMultiUpdates(){
    if(this.updateTypeView=="singleItem"){
      this.addItem();
    }
      this.sendUpdates();        

  }

  // saveSingleNewUpdate(){
  // }
sendUpdates(){
  let objToSend={
    expectedArrivals:this.arrToUpdate,
    expectedTransport:this.newTransportDetails.value,
  }

  if(confirm("שליחת נתונים לעדכון?")){
    debugger
    this.procuretServ.addExpectedArrivals(objToSend).subscribe(res=>{
      if(res.transDoc){
        //existiong transportation data changed
        this.toastSrv.success("שינויים נשמרו בהצלחה");
        this.toastSrv.success("נתוני שינוע עודכנו");
        this.arrToUpdate=[];
      }else if(res.newtransDoc){
        this.toastSrv.success("שינויים נשמרו בהצלחה");
        this.toastSrv.success("נתוני שינוע חדשים עודכנו");
        this.arrToUpdate=[];
      }else if(res.length > 0){
        this.toastSrv.success("שינויים נשמרו בהצלחה");
      }else{
        this.toastSrv.error("שינויים לא נשמרו");      
      }  
      this.getItemExpectedArrivalsData();

    });  
  }
}

transporterChecked(ev){
  if(ev.target.checked){
    this.newTransportDetails.reset();
    this.transportationItem.reset();

  }
}
  edit(index) {
    this.EditRowId = index;
    if(index!='') {
      this.lineToUpdate=  this.itemExpectedArrivals[index];
      //get the line data
    }
  }
  searchTransportaionJobNumber(){
    this.procuretServ.findOpenJobNumbers().subscribe(res=>{
      this.jobNumberList;
    });
  }
  editExistingTransportationData(expectedArrival, index){

  }
  
    saveSingleLineUpdate(expectedArrival, i){

      //dont forget they can update arrival 
      // this.newItemProcurmentDetails.controls.suppliedDate.setValue('');
      // this.newItemProcurmentDetails.controls.quantity.setValue('');
      // this.newItemProcurmentDetails.controls.quantityRecived.setValue('');

      this.lineToUpdate;
      let conf=confirm("לשמור שינויים בצפי הגעה של פריט "+ expectedArrival.componentN+" ?");
      if(conf){
        let objToUpdate=this.itemExpectedArrivals.filter(expt=> {
          if(expt.componentN==expectedArrival.componentN && expt.componentNs==expectedArrival.componentN ){

          }
        });
      }
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




// this.itemExpectedArrivals=[
//   {
//     componentN: "12185",  
//     componentNs: "16411000", 
//     suplierN: "34301", 
//     suplierName: "Sanwa",
//     procurmentOrderNumber: "121212",
//     jobNumber: "111111",
//     transporterName: "someTramsporter",
//     expectedDate: new Date(),
//     suppliedDate: null,
//     quantity: 10000,
//     quantityRecived: 0, 
//     remarks: "some text", 
//     lastUpdateDate: new Date(), 
//     lastUpdateUser: "noa seri", 
//     status: "open", 
//   }
// ]


    // if(this.updateTransportaion){
    //   debugger
    //   if(this.newTransportDetails.valid){
    //     this.arrToUpdate.forEach(p=>{
    //       p.jobNumber = this.newTransportDetails.value.jobNumber;
    //       p.expectedDate = this.newTransportDetails.value.expectedDate;
    //     });
    //     this.sendUpdates();        
    //   }else{
    //     this.toastSrv.error("נתוני שינוע חסרים");
    //   }      
    // }else{
    //   this.sendUpdates();        
    // }