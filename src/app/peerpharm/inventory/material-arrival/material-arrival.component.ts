import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { NgbModal, NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-material-arrival',
  templateUrl: './material-arrival.component.html',
  styleUrls: ['./material-arrival.component.css']
})
export class MaterialArrivalComponent implements OnInit {
  public beforeChange($event: NgbTabChangeEvent) {
    
    this.activeTabId = $event.activeId;
    // if ($event.activeId === 'tab-preventchange2') {
    //   $event.preventDefault();
    // }
  }
  @ViewChild('modal1') modal1: ElementRef;
  @ViewChild('supplierNameInput') supplierNameInput: ElementRef;
  @ViewChild('supplierItemNameInput') supplierItemNameInput: ElementRef;
  @ViewChild('printBtn') printBtn: ElementRef;
  @ViewChild('tabset') tabset: NgbTabset ;
  @ViewChild('analysisFlag') analysisFlag: ElementRef ;
 
  screenHeight: number;
  activeTabId: String ;
  dateStr: String ;
  user: String ;
  suppliers: Array<any> ;
  suppliersList: Array<any> ;
  supplierItemsList: Array<any> ;
  supplierItemsListCopy: Array<any> ;
  userObj: String ;
  // analysisFlag: Boolean = false;
  borderColor: String = '#36bea6';
  newMaterialArrival: FormGroup;
  barcodeData: any;
  choosenOrderItem: any;
  chosenItem: any;
  openOrders: Array<any>;

  supplierModal:Boolean= false;
  supplierModalHeader:String= "";
  supplierModalInfo:any;

// barcode vars //
materialNum: String ;
materialName: String ;
lotNumber: String ;
productionDate: String ;
arrivalDate: String ;
expiryDate: String ;

smallText: Boolean=false;

bcValue: Array<any>=[ ];
elementType = 'svg';
format = 'CODE128';
lineColor = '#000000';
width = 1;
height = 150;
displayValue = false; // true=display bcValue under barcode
fontOptions = '';
font = 'monospace';
textAlign = 'center';
textPosition = 'bottom';
textMargin = 1.5;
fontSize = 30;
background = '#ffffff';
margin = 10;
marginTop = 20;
marginBottom = 10;
marginLeft = 10;
marginRight = 10;

requirementsForm: FormGroup;
requiresFromFull:Boolean=false;

batchNumRemarksInput: Boolean=false;
orderedQntRemarksInput: Boolean=false;
approvedPackgeRemarksInput: Boolean=false;



  constructor(private fb: FormBuilder, 
    private invtSer:InventoryService, 
    private procuretServ: Procurementservice, 
    private toastSrv: ToastrService, 
    private authService: AuthService,
    private modalService: NgbModal,    ) {
      
    this.newMaterialArrival = fb.group({
      arrivalDate: [Date, Validators.required],
      user: ["", Validators.required],
      internalNumber: ["", Validators.required],
      materialName: ["", Validators.required], 

      lotNumber: ["", Validators.required], 
      expiryDate: [Date, Validators.nullValidator],
      productionDate: [Date, ],

      supplierName: ["", Validators.required], 
      supplierNumber: ["", Validators.required],
      analysisApproval: [Boolean, false, ], 
      
      totalQnt: [null, Validators.required], 
      mesureType: [ 'kg', Validators.required],           
      remarks: ["", ],
      cmxOrderN: ["", ],
      packageType: ["", Validators.required], //select 
      packageQnt: [1, Validators.min(1)],    
      unitsInPack: [null, Validators.min(1)],    
      // unitVolume: [0, ],    
      // unitMesureType: [0, ],    
      
      warehouse: [""], //select 
      position: ["GENERAL"], //select 
      barcode:[""],
      deliveryNoteNumber:["", Validators.required],
    });

    
    this.requirementsForm = fb.group({

      date: ["", Validators.required],
      user: ["", ],
      signature: ["", Validators.required],
      itemNumber: ["", Validators.required],
      itemName: ["", Validators.required], 
      orderItemNum: [ false, Validators.required], 
      approvedSupplier: [ false, Validators.required], 
      batchNum: [ false, Validators.required], 
      batchNumRemarks: ["", ], 
      orderedQnt: [ false, Validators.required], 
      orderedQntRemarks: ["", ], 
      approvedPackge: [ false, Validators.required], 
      approvedPackgeRemarks: ["", ], 
      approvedDocs: [ false, Validators.required], 
      approvedDocsRemarks: ["", ], 
      cocBatchNum: [ false, Validators.required], 
      cocBatchNumRemarks: ["", ], 
      labReport: [ false, Validators.required], 
      labReportRemarks: ["", ], 
      moreDocs: [ false, Validators.required], 
      moreDocsRemarks: ["", ], 
      sds: [ false, Validators.required], 
      sdsRemarks: ["", ], 
      approvedAndStocked: [ false, Validators.required], 
      approvedAndStockedRemarks: ["", ], 

    });


   }
  ngOnInit() {
    // this.user =   this.authService.loggedInUser;
    this.authService.userEventEmitter.subscribe(data => { 
      this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
      this.newMaterialArrival.controls.user.setValue(this.user)
    });
    this.invtSer.getAllSuppliers().subscribe(data => {
      this.suppliers=data;   
      this.suppliersList=data;   
    });
    let tmpD=new Date();
    this.dateStr= tmpD.toISOString().slice(0,10);
    this.newMaterialArrival.controls.arrivalDate.setValue(tmpD);
    //setting form to screen height
    this.screenHeight = window.innerHeight*(0.8);
    console.log('screenHeight: '+this.screenHeight)
    // two displays "tab-selectbyid1" OR "tab-selectbyid2"
    this.activeTabId="tab-selectbyid1"
  }
  
  // analysisFlagChange(ev){
  //   if(ev.target.checked){
  //     this.newMaterialArrival.value.analysisApproval= true;
  //   }else{
  //     this.newMaterialArrival.value.analysisApproval= false;
  //   }
  //   
  // }
  saveMaterialRequirementsForm(){
    this.authService.userEventEmitter.subscribe(data => { 
      this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
      this.requirementsForm.controls.user.setValue(this.user)
    });
    debugger
    if(this.requirementsForm.valid){
      this.invtSer.newMaterialRequirementsForm(this.requirementsForm.value).subscribe(doc=>{
        if(doc._id){
          this.toastSrv.success('Material Requirements Form saved')
          this.requiresFromFull=true;
        }
      })
    }else{
      this.requiresFromFull=false;
      this.toastSrv.error('Please fill all the fields')
    }
  }
  resetMaterialRequirementsForm(){
    this.requirementsForm.reset();
    this.authService.userEventEmitter.subscribe(data => { 
      this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
      this.requirementsForm.controls.user.setValue(this.user)
    });
  }

  checkRadio(ev, flag){
    let formField=ev.target.name;
    debugger
    this.requirementsForm.controls[formField].setValue(flag)
    if(!this.requirementsForm.value.batchNum){
      this.batchNumRemarksInput= true;
    }else{
      this.batchNumRemarksInput= false;
      this.requirementsForm.controls.batchNumRemarks.setValue('')
    }
    if(!this.requirementsForm.value.orderedQnt){
      this.orderedQntRemarksInput= true;
    }else{
      this.orderedQntRemarksInput= false;
      this.requirementsForm.controls.orderedQntRemarks.setValue('')

    }
    if(!this.requirementsForm.value.approvedPackge){
      this.approvedPackgeRemarksInput= true;
    }else{
      this.approvedPackgeRemarksInput= false;
      this.requirementsForm.controls.approvedPackgeRemarks.setValue('')

    }
  }

  changeFields(ev, flag){
    let formField=ev.target.name;
    let formFieldValue=ev.target.value;
    debugger
    this.requirementsForm.controls[formField].setValue(formFieldValue)
  }
  findMaterialBtNumber(){
    
  }

  filterSuppliers(input){
    if(input !=""){
      let inputVal= input.toLowerCase();
      this.suppliersList= this.suppliers.filter(sup=> {
          if(sup.suplierName.toLowerCase().includes(inputVal)) {
            return sup;
          } 
        });
      }    
  }

  filterSupplierItems(input){
    if(input !=""){
      let inputVal= input.toLowerCase();
      this.supplierItemsList= this.supplierItemsListCopy.filter(item=> { 
          if(item.componentName.toLowerCase().includes(inputVal)) {
            return item;
          } 
        });
      }    
  }

  chooseOnlySupplier(){
    this.newMaterialArrival.controls.supplierNumber.setValue(this.supplierModalInfo.suplierNumber);
    this.newMaterialArrival.controls.supplierName.setValue(this.supplierModalInfo.suplierName);
    this.suppliersList=[];
  }

  chooseSupplierFromList(sup){
    this.supplierModalHeader= "פריטים של ספק "+sup.suplierNumber+"\n";
    this.supplierModalInfo=sup;
    this.chooseOnlySupplier();
    this.invtSer.getItemsBySupplierNum(sup.suplierNumber).subscribe(stockItems=>{
      if(stockItems.length>0){  
        this.supplierItemsList= stockItems;
        this.supplierItemsListCopy= stockItems;
        //open modal to choose item
        this.openSearch(this.modal1);
      } else{
          this.toastSrv.error("supplier don't have items")
      }
    });
  }
  

  createBarcode(){
    // waiting for yossi
  }
  searchInternalNumber(){
    if(this.newMaterialArrival.value.internalNumber !=""){
      this.invtSer.getMaterialStockItemByNum(this.newMaterialArrival.value.internalNumber).subscribe(item => {
        console.log(item);
        if(item.length==0){
          this.toastSrv.error("Can't find item number")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        }else if(item.length ==1){
          this.newMaterialArrival.controls.materialName.setValue(item[0].componentName);
          this.newMaterialArrival.controls.supplierNumber.setValue(item[0].suplierN);
          this.newMaterialArrival.controls.supplierName.setValue(item[0].suplierName);
          if(item[0].unit!="" && item[0].unit!=undefined && item[0].unit!=null ){
            // console.log(this.newMaterialArrival.value.mesureType)
            this.newMaterialArrival.controls.mesureType.setValue(item[0].unit);


          } 
          this.suppliersList=[];
        }else if(item.length>1){
          this.toastSrv.error("umlti items with the same number")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          }
        
      });
  
    }
  }




  // searchSupplierName(){
  //   // take name from input 
  //   let name= this.newMaterialArrival.value.supplierName;
  //   if(name!=""){

  //   }
  // }

  submitForm(){
    // shelf general position
    this.newMaterialArrival.controls.position.setValue('GENERAL');
    this.materialNum= this.newMaterialArrival.value.internalNumber;
    this.materialName= this.newMaterialArrival.value.materialName;
    this.lotNumber= this.newMaterialArrival.value.lotNumber;
    this.productionDate= this.newMaterialArrival.value.productionDate;
    this.arrivalDate= this.newMaterialArrival.value.arrivalDate;
    this.expiryDate= this.newMaterialArrival.value.expiryDate;
    this.newMaterialArrival.value.deliveryNoteNumber.trim();
    

    if(this.newMaterialArrival.value.user == ""){
      this.authService.userEventEmitter.subscribe(data => {
        this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
        this.newMaterialArrival.controls.user.setValue(this.user);
      });
    }
    let continueSend= false;
    this.newMaterialArrival.controls.analysisApproval.setValue(this.analysisFlag.nativeElement.checked);
    // this.newMaterialArrival.value.analysisApproval= (this.analysisFlag ) ? true : false ;
    if(this.newMaterialArrival.value.productionDate!=""){ this.adjustDate(this.newMaterialArrival.controls.productionDate)  }
    if(this.newMaterialArrival.value.expiryDate!=""){ this.adjustDate(this.newMaterialArrival.controls.expiryDate) }
    if(this.newMaterialArrival.valid){
      if( !this.analysisFlag.nativeElement.checked ){
        if(confirm('אנליזה לא תקינה , האם להמשיך?')){
          continueSend= true;
        }else{
          continueSend= false;          
        }
      }else{
        continueSend= true;
      }

      if(this.newMaterialArrival.value.expiryDate=""){
        if(confirm('תאריך תפוגה חסר , האם להמשיך?')){
          continueSend= true;  
        }else{
          continueSend= false;
        }
      }else if(continueSend){
        continueSend= true;
      }

      if(continueSend){
        
        
        this.newMaterialArrival.value.productionDate = new Date(this.newMaterialArrival.value.productionDate)
        this.newMaterialArrival.controls.barcode.setValue("WAITING FOR BARCODE STRING"); // shpuld be this.barcodeData
        this.checkLotNumber().then(ok=> {
          //CREATE BARCODE
          // we can also save all the form value obj = this.newMaterialArrival.value
          // this.barcodeData={
          //   internalNumber: this.newMaterialArrival.value.internalNumber,
          //   materialName: this.newMaterialArrival.value.materialName,
          //   barcode: this.newMaterialArrival.value.barcode,
          //   expiryDate: this.newMaterialArrival.value.expiryDate,
          //   lotNumber: this.newMaterialArrival.value.lotNumber,
          // }
          ;          
          this.addMaterialToStock();    
          });

      }
    }

    if (!continueSend || !this.newMaterialArrival.valid){
      this.toastSrv.error("Fill all required fields")
      this.fieldsColor();
    }
  }


  checkLotNumber(){
    var form= this.newMaterialArrival;
    var inventoryService = this.invtSer; 
    return new Promise(function (resolve, reject) {
      // let itemN= form.value.internalNumber;
      let suppNumber= form.value.supplierNumber;
      let lotN= form.value.lotNumber;
      let breakeLoop=false;
      inventoryService.getLotNumber(suppNumber, lotN).subscribe(arrivalForms=>{
        if (arrivalForms.length>0){
          // wont save same lot numbers with different expiry date
          arrivalForms.forEach((f, key) => {
            if(form.value.expiryDate != f.expiryDate && !breakeLoop ){
              let date= f.expiryDate.slice(0,10)
              if(confirm("מספר לוט כבר קיים במערכת עם תאריך תפוגה \n"+date)){
                form.controls.expiryDate.setValue(date);
                breakeLoop=true;
              } 
            }
            if(key+1 == arrivalForms.length)  resolve('lot number checked');
          });
        }else{
          resolve('lot number new')
        }
      })  
    });

  }


  addMaterialToStock(){
    let formToSend= this.newMaterialArrival.value;
    formToSend.lastUpdate= new Date();
    formToSend.lastUpdateUser= this.user;
    this.invtSer.newMatrialArrival(formToSend).subscribe( res=>{
      if(res.savedDoc ){
        this.bcValue= [ res.savedDoc._id ] ;
        this.materialNum= res.savedDoc.internalNumber;
        this.materialName= res.savedDoc.materialName;
        this.lotNumber= res.savedDoc.lotNumber;
        this.productionDate= res.savedDoc.productionDate;
        this.arrivalDate= res.savedDoc.arrivalDate;
        this.expiryDate= res.savedDoc.expiryDate;

        this.smallText = (this.materialName.length> 80) ? true : false;

        this.printBarcode(res.savedDoc._id , res.savedDoc.internalNumber);// we might need to change the value to numbers
        this.toastSrv.success("New material arrival saved!");
          this.resetForm();
          this.analysisFlag.nativeElement.checked = false;
          //print barcode;
      }else if(res == 'no material with number'){
        this.toastSrv.error("Item number wrong")
      }else{
        this.toastSrv.error("Something went wrong, saving faild")
      }
    });         

  }

  printBarcode(id , number){
    if(id!=""){
      setTimeout(() => {
        this.printBtn.nativeElement.click();          
      }, 500);
    }else{
      this.toastSrv.error("Can't print sticker");
    }

  }

  fieldsColor(){
    // var inputArr = document.getElementsByTagName('input');
    var inputArr = $('.form-row input, .form-row select');
    for (const [key, value] of Object.entries(this.newMaterialArrival.controls)) { 
      var tag =document.getElementsByName(key)[0];  
      if(tag!= undefined){
        if(value.status=='INVALID'){
          tag.style.borderColor= 'red';
          
        }else{
          tag.style.borderColor= '#36bea6';
        }  
      }    

      // for (let index = 0; index < inputArr.length; index++) {
      //   var element = inputArr[index];
      //   
      //   if(element.name != '' && value.status == 'INVALID'  ){}
      //   element.style.borderColor = (value.status == 'VALID') ? 'red' : '#36bea6';
      // }  

    }
  }
  resetForm(){
    this.newMaterialArrival.reset();
    this.newMaterialArrival.controls.arrivalDate.setValue(new Date());
    this.newMaterialArrival.controls.user.setValue(this.user);
  }
  adjustDate(formField){
    formField.setValue(new Date(formField.value));
  }
  resetDate(date){
    switch (date) {
      case 'expiryDate': {
        this.newMaterialArrival.controls.expiryDate.setValue(null);
        break;
      }
      case 'productionDate': {
        this.newMaterialArrival.controls.productionDate.setValue(null);

        break;
      }
    }
  }


  openSearch(content) {
    
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          console.log(result);

          if (result == "chosen") {
            this.newMaterialArrival.controls.internalNumber.setValue(this.chosenItem.componentN);
            this.searchInternalNumber();
            // this.newMaterialArrival.controls.supplierNumber.setValue(this.choosenOrderItem.supplierNumber)
            // this.newMaterialArrival.controls.supplierName.setValue(this.choosenOrderItem.supplierName)
            // this.newMaterialArrival.controls.cmxOrderN.setValue(this.choosenOrderItem.orderNumber)
            
            // this.chooseCostumer();
          }
          // this.closeResult = `Closed with: ${result}`;
          // console.log(this.closeResult);
        },
        reason => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }


}






































// GET ALL PURCHASE OPEN BALANCE FOR ITEM
      // this.invtSer.findByItemNumber(this.newMaterialArrival.value.internalNumber).subscribe(item => {
      //   console.log(item);
      //   if(item == "noItemInCmx"){
      //     this.toastSrv.error("Can't find item number")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
      //   }else if(item.length ==1){
      //     this.newMaterialArrival.controls.materialName.setValue(item[0].itemName)
      //     this.newMaterialArrival.controls.supplierNumber.setValue(item[0].supplierNumber)
      //     this.newMaterialArrival.controls.supplierName.setValue(item[0].supplierName)
      //   }else if(item.openbalance){
      //     if(item.openbalance.length == 1){
      //       this.newMaterialArrival.controls.materialName.setValue(item.openbalance[0].itemName)
      //       this.newMaterialArrival.controls.supplierNumber.setValue(item.openbalance[0].supplierNumber)
      //       this.newMaterialArrival.controls.supplierName.setValue(item.openbalance[0].supplierName)
      //       this.newMaterialArrival.controls.cmxOrderN.setValue(item.openbalance[0].orderNumber)
      //     }else{
            
      //       this.openOrders= item.openbalance.map(i=>i) // show modal to user - make him choose  
      //       
      //       this.openSearch(this.modal1);

      //     }
      //   }
      // });


