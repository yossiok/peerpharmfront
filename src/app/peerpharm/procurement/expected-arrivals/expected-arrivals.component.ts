import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
  EditJobN: String = null;
  lineToUpdate:any;
  multiItemsToUpdateView: Array<any>;
  userName:String;
  jobNumberList:Array<any>;
  items:FormArray; 
  objToUpdate:any;
  dateStr:String;
  dateJNStr:string;
  updateJobN:any;
  changedLine:any={
    componentN:null,
    componentName:null,
    componentNs:null,
    cmxComponentN:null,
    suplierN:null,
    suplierName:null,
    procurmentOrderNumber:null,
    jobNumber:null,
    expectedDate:null,
    suppliedDate:null,
    quantity:null,
    quantityRecived:null,
    remarks:null,
    lastUpdateDate:null,
    lastUpdateUser:null,
    status:null,
  }
  changedJobNumber:any={} //??? used?
  newJN:Boolean=false;

  @Input() componentData: any;
  @Output() outPutItemsExpectedData = new EventEmitter();
  @ViewChild('singleBtn') singleBtn: ElementRef;
  @ViewChild('multiBtn') multiBtn: ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    
    if(this.EditJobN!=null){
    this.editJN(null);
    }else{
    // this.editJN(null);
    this.edit('');
    }
    // console.log(event);
    // this.edit('');
    // this.editJN(null);
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
      transporterName: ["", ],// מספר הזמנת רכש
      expectedDate: [Date, null ],// מספר הזמנת רכש
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
      expectedDate: [Date, ],// מספר הזמנת רכש
      suppliedDate: [Date, ],// מספר הזמנת רכש
      transportationItems: this.fb.array([ ]),// מספר הזמנות רכש
      shippingMethod: ["", Validators.required],
      remarks: ["", ],
      lastUpdateDate: [Date, Validators.nullValidator],
      lastUpdateUser: ["", Validators.nullValidator],
      status: ["", Validators.nullValidator],
    });
    // this.transportationItem = fb.group({
    //   componentN: ["", Validators.required],// מספר הזמנת רכש
    //   componentNs: ["", ],// מספר הזמנת רכש
    //   cmxComponentN: ["", Validators.required],// מספר הזמנת רכש
    //   procurmentOrderNumber: ["", Validators.required],// מספר הזמנת רכש
    //   quantity: [Number, Validators.required],// מספר הזמנת רכש
    //   quantityRecived: [Number, Validators.required],
    // });
    
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

  updateNewTransportItems(obj){
    this.items = this.newTransportDetails.get('transportationItems') as FormArray;
    this.items.push(this.createItem(obj));
  }
    createItem(obj): FormGroup {
      if(obj.componentN){
        return this.fb.group({
          componentN:obj.componentN,// מספר הזמנת רכש
          componentNs:obj.componentNs,// מספר הזמנת רכש
          cmxComponentN: obj.cmxComponentN,// מספר הזמנת רכש
          procurmentOrderNumber: obj.procurmentOrderNumber,// מספר הזמנת רכש
          quantity: obj.quantity,// מספר הזמנת רכש
          quantityRecived: obj.quantityRecived,
          });  
      }
    }

    resetUpdateLine(){
      //reset after push to arr
      this.newItemProcurmentDetails.controls.componentNs.setValue('');
      this.newItemProcurmentDetails.controls.remarks.setValue('');
      this.newItemProcurmentDetails.controls.quantity.setValue('');
      // this.transportationItem.reset();
}


  adjustObj(){
    //default of new data   
    this.newItemProcurmentDetails.controls.lastUpdateDate.setValue(new Date());
    this.newItemProcurmentDetails.controls.lastUpdateUser.setValue(this.userName);
    this.newItemProcurmentDetails.controls.status.setValue('open');

    if(this.updateTransportaion){

      this.newTransportDetails.controls.lastUpdateDate.setValue(new Date());
      this.newTransportDetails.controls.lastUpdateUser.setValue(this.userName);
      this.newTransportDetails.controls.status.setValue('open');

      if(this.newTransportDetails.valid){
        this.newItemProcurmentDetails.controls.jobNumber.setValue(this.newTransportDetails.value.jobNumber);
        this.newItemProcurmentDetails.controls.transporterName.setValue(this.newTransportDetails.value.transporterName);
        this.newItemProcurmentDetails.controls.expectedDate.setValue(this.newTransportDetails.value.expectedDate);
      }else{
        this.toastSrv.error("חסרים נתוני שינוע");
      }
    }else{
      this.newItemProcurmentDetails.controls.jobNumber.setValue('');
      this.newItemProcurmentDetails.controls.transporterName.setValue('');
    }
    
    let obj=
      {
        componentN: this.newItemProcurmentDetails.value.componentN.trim(),
        componentName: this.newItemProcurmentDetails.value.componentName.trim(),
        componentNs: this.newItemProcurmentDetails.value.componentNs.trim(),
        cmxComponentN: this.newItemProcurmentDetails.value.cmxComponentN.trim(),
        suplierN: this.newItemProcurmentDetails.value.suplierN.trim(),
        suplierName: this.newItemProcurmentDetails.value.suplierName.trim(),
        procurmentOrderNumber: this.newItemProcurmentDetails.value.procurmentOrderNumber.trim(),
        jobNumber: this.newItemProcurmentDetails.value.jobNumber.trim(),
        transporterName: this.newItemProcurmentDetails.value.transporterName.trim(),
        expectedDate: this.newItemProcurmentDetails.value.expectedDate,
        suppliedDate: this.newItemProcurmentDetails.value.suppliedDate,
        quantity: this.newItemProcurmentDetails.value.quantity,
        quantityRecived: this.newItemProcurmentDetails.value.quantityRecived,
        remarks: this.newItemProcurmentDetails.value.remarks.trim(),
        lastUpdateDate: this.newItemProcurmentDetails.value.lastUpdateDate,
        lastUpdateUser: this.userName,
        status: 'open',
      }
      this.objToUpdate = obj;
      if(this.updateTransportaion && this.newTransportDetails.valid){
        this.addTransportationItem(this.objToUpdate);
      }
      return obj;
    
  }
adjustTransportObj(){
  this.newTransportDetails.controls.lastUpdateDate.setValue(new Date());
  this.newTransportDetails.controls.lastUpdateUser.setValue(this.userName);
  this.newTransportDetails.controls.status.setValue('open');

  if(this.newTransportDetails.valid){
    this.newItemProcurmentDetails.controls.jobNumber.setValue(this.newTransportDetails.value.jobNumber);
    this.newItemProcurmentDetails.controls.expectedDate.setValue(this.newTransportDetails.value.expectedDate);
    this.newItemProcurmentDetails.controls.transporterName.setValue(this.newTransportDetails.value.transporterName);
  }else{
    this.toastSrv.error("חסרים נתוני שינוע");
  }

}
  addTransportationItem(obj){
    // this.transportationItem.reset();
    // this.transportationItem.controls.componentN.setValue(this.newItemProcurmentDetails.value.componentN); 
    // this.transportationItem.controls.componentNs.setValue(this.newItemProcurmentDetails.value.componentNs); 
    // this.transportationItem.controls.cmxComponentN.setValue(this.newItemProcurmentDetails.value.cmxComponentN); 
    // this.transportationItem.controls.procurmentOrderNumber.setValue(this.newItemProcurmentDetails.value.procurmentOrderNumber); 
    // this.transportationItem.controls.quantity.setValue(this.newItemProcurmentDetails.value.quantity); 
    // this.transportationItem.controls.quantityRecived.setValue(this.newItemProcurmentDetails.value.quantityRecived); 
    this.updateNewTransportItems(obj);
    console.log(this.newTransportDetails.value);
  }

  saveMultiUpdates(){
    if(this.updateTypeView=="singleItem"){
      this.addItem();
    }
    if(this.updateTransportaion){
      for (let i = 0; i < this.arrToUpdate.length; i++) {
        let item = this.arrToUpdate[i];
        if(item.jobNumber ==''){
          item.jobNumber = this.newTransportDetails.value.jobNumber;
          let existAtList =this.newTransportDetails.value.transportationItems.filter(i=>{
            if(item.cmxComponentN== i.cmxComponentN && item.procurmentOrderNumber==i.procurmentOrderNumber){
              return true;
            }
          });
          if(!existAtList){
            this.addTransportationItem(item);
          }
        }
      }        
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
        this.arrToUpdate=[];
      }else{
        this.toastSrv.error("שינויים לא נשמרו");      
      }  
      this.outPutItemsExpectedData.emit('stockLineChanged');    
      this.getItemExpectedArrivalsData();
      console.log('objToSend',objToSend);
    });  
  }
}
deleteItem(item, i){
  this.arrToUpdate.splice(i,1);
  if(this.updateTransportaion){
    this.newTransportDetails.value.transportationItems.splice(i,1)
  }
}
transporterChecked(ev){
  if(ev.target.checked){
    this.newTransportDetails.reset();
    // this.transportationItem.reset();

  }
}
resetDate(form){
  form.controls.expectedDate.setValue(null);
}

// copyOldData(){
//   
//   this.procuretServ.copyOldData().subscribe(res=>{
//     
//     console.log(res);
//   });
// }

  edit(id) {
    this.EditRowId = id;
    if(id!='') {
      this.changedLine=  this.itemExpectedArrivals.filter(i=>i._id==id)[0];
      this.lineToUpdate=  this.itemExpectedArrivals.filter(i=>i._id==id);
      

      this.dateStr;
      if(this.changedLine.expectedDate != null && this.changedLine.expectedDate != undefined ){
        this.dateStr=this.changedLine.expectedDate.slice(0,10);
      }else{
        this.dateStr="";
      }
    }
  }
  editJN(exptArrvl) {
    if(exptArrvl!=null){
      if(this.EditRowId == exptArrvl._id ){
        this.EditJobN = exptArrvl.jobNumber;
         
        this.dateJNStr=this.changedLine.expectedDate.slice(0,10);
        this.changedJobNumber={};
        if(exptArrvl.jobNumber!='') {
           
          this.procuretServ.findOneJobNumber(exptArrvl.jobNumber).subscribe(res=>{
            if(res.length>0){
              this.newJN=false;
              
              this.dateJNStr=res[0].expectedDate.slice(0,10);
              this.changedJobNumber=  {
                jobNumber:res[0].jobNumber,
                transporterName:res[0].transporterName,
                expectedDate:this.dateJNStr,
                shippingMethod:res[0].shippingMethod,
                remarks:res[0].remarks,
                transportationItems:res[0].transportationItems,
              }
              this.changedJobNumber = res[0];
            }else{
              
              this.newJN=true;
              this.changedJobNumber=  {
                jobNumber:this.changedLine.jobNumber,
                transporterName:this.changedLine.transporterName,
                expectedDate:this.dateJNStr,
                shippingMethod:'land',
                remarks:this.changedLine.remarks,
                transportationItems:[],
              }
            }
            });
          }else if(exptArrvl.jobNumber==''){
            this.changedJobNumber=  {
              jobNumber:this.changedLine.jobNumber,
              transporterName:this.changedLine.transporterName,
              expectedDate:this.dateJNStr,
              shippingMethod:'land',
              remarks:this.changedLine.remarks,
              transportationItems:[],
            }
            this.newJN=true;
          }
        }  
    }else {
      this.EditJobN=null;
    }
  }

JNumChange(ev){
  this.procuretServ.findOneJobNumber(ev.target.value).subscribe(res=>{
    if(res.length>0){
      this.newJN=false;
      this.changedJobNumber=res[0];
      this.changedJobNumber.expectedDate=res[0]
      
      this.dateJNStr=res[0].expectedDate.slice(0,10);;

      this.toastSrv.warning("#JobNumber זה כבר מקושר לפריטי רכש\n שינוי נתונים ישפיע על כל הפריטים המקושרים.");
    //load data to this.changedJobNumber
    }else{
      this.newJN=true;

    }
  });
}
saveLineJobNChanges(expectedArrival){
   
  let item={
    componentN:expectedArrival.componentN,// מספר הזמנת רכש
    componentNs:expectedArrival.componentNs,// מספר הזמנת רכש
    cmxComponentN: expectedArrival.cmxComponentN,// מספר הזמנת רכש
    procurmentOrderNumber: expectedArrival.procurmentOrderNumber,// מספר הזמנת רכש
    quantity: expectedArrival.quantity,// מספר הזמנת רכש
    quantityRecived: expectedArrival.quantityRecived,
    };
    this.changedJobNumber.lastUpdateDate=new Date();  
    this.changedJobNumber.lastUpdateUser=this.userName;  
    this.changedJobNumber.status='open';      
    this.changedJobNumber.expectedDate=new Date(Date.parse(this.dateJNStr)).toISOString();  
    
  
    if(this.newJN){
      this.changedJobNumber.transportationItems.push(item);
      
      this.procuretServ.addNewJobNumber(this.changedJobNumber).subscribe(res=>{
        if(res.id){
          this.toastSrv.success('נתוני שינוע עודכנו בהצלחה')
          this.changedLine.jobNumber=res.trans.jobNumber;
          this.changedLine.expectedDate=res.trans.expectedDate;
          this.changedLine.transporterName=res.trans.transporterName;
          this.EditJobN=null;
          this.changedJobNumber={};
          this.dateStr=this.dateJNStr;
        }
    });
  }else{
    let inTransportationItems= this.changedJobNumber.transportationItems.filter(i=>{
      if(expectedArrival.cmxComponentN== i.cmxComponentN && expectedArrival.procurmentOrderNumber==i.procurmentOrderNumber){
        return true;
      }
    });
    if(!inTransportationItems){
      this.changedJobNumber.transportationItems.push(item)
    };
    
    this.procuretServ.updateTransformationArrival(this.changedJobNumber).subscribe(res=>{
      if(res.trans.jobNumber){
        this.toastSrv.success('נתוני שינוע עודכנו בהצלחה')
        this.changedLine.jobNumber=res.trans.jobNumber;
        this.changedLine.expectedDate=res.trans.expectedDate;
        this.changedLine.transporterName=res.trans.transporterName;
        this.EditJobN=null;
        this.changedJobNumber={};
        this.dateStr=this.dateJNStr;
      }
    });
  }
}

  editExistingTransportationData(expectedArrival, index){
    this.changedLine
  }



  // searchTransportaionOpenJobNumber(){
  //   //updatingJobNumberView= 'existing'/'new'
  //   // if new create new trans obj with itemsArr=[item]
  //   //if existing find trans obj and push item to itemsArr and upadte data
  //   //server side: updating or creating
  //   // updating : find all expected arrivals and upate by jobNumber- expectedDate
  //   // update transExpected
  //   this.procuretServ.findOpenJobNumbers().subscribe(res=>{
  //     this.jobNumberList;
  //   });
  // }

  
    saveSingleLineUpdate(expectedArrival, i){

      //dont forget they can update arrival 
      // this.newItemProcurmentDetails.controls.suppliedDate.setValue('');
      // this.newItemProcurmentDetails.controls.quantity.setValue('');
      // this.newItemProcurmentDetails.controls.quantityRecived.setValue('');

      this.lineToUpdate;
      this.changedLine;
      this.dateStr;
      if(this.dateStr!=null && this.dateStr!=undefined && this.dateStr!=""){
        this.changedLine.expectedDate =  new Date(this.dateStr+"");
      }
        let conf=confirm("לשמור שינויים בצפי הגעה של פריט "+ expectedArrival.componentN+" ?");
      if(conf){
        this.procuretServ.updateExpectedArrival(this.changedLine).subscribe(res=>{
          if(res.componentN){
            this.toastSrv.success('שינויים בוצעו בהצלחה');
            this.edit('');
            this.changedLine={};
            this.outPutItemsExpectedData.emit('stockLineChanged');
          }
        });
      }
    }
    suppliedSingleLineUpdate(expectedArrival, ev){
      let objToSend={
        _id: expectedArrival._id,
        suppliedDate: new Date(),
        quantityRecived: expectedArrival.quantity,
        lastUpdateDate: new Date(),
        lastUpdateUser: this.userName,
        status: "close",
      }
      let conf=confirm("עדכון הגעת פריט "+ expectedArrival.componentN+"\nכמות: "+expectedArrival.quantity+"\nהזמנת רכש: "+expectedArrival.procurmentOrderNumber );
      if(conf){
        
        this.procuretServ.suppliedExpectedArrival(objToSend).subscribe(res=>{
          if(res._id){
            this.toastSrv.success('שינויים בוצעו בהצלחה');
            this.edit('');
            this.outPutItemsExpectedData.emit('stockLineChanged');
            this.itemExpectedArrivals
            ev.target;
            
            
          }
        });
      }
    }
    





emitTpParentComponent(){

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




