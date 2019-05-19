import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-material-arrival',
  templateUrl: './material-arrival.component.html',
  styleUrls: ['./material-arrival.component.css']
})
export class MaterialArrivalComponent implements OnInit {
  
  @ViewChild('modal1') modal1: ElementRef;
  @ViewChild('supplierNameInput') supplierNameInput: ElementRef;
  @ViewChild('supplierItemNameInput') supplierItemNameInput: ElementRef;
  screenHeight: number;
  dateStr: String ;
  user: String ;
  suppliers: Array<any> ;
  suppliersList: Array<any> ;
  supplierItemsList: Array<any> ;
  supplierItemsListCopy: Array<any> ;
  userObj: String ;
  analysisFlag: Boolean = false;
  borderColor: String = '#36bea6';
  newMaterialArrival: FormGroup;
  barcodeData: any;
  choosenOrderItem: any;
  chosenItem: any;
  openOrders: Array<any>;
  supplierModal:Boolean= false;

  constructor(private fb: FormBuilder, 
    private invtSer:InventoryService, 
    private procuretServ: Procurementservice, 
    private toastSrv: ToastrService, 
    private authService: AuthService,
    private modalService: NgbModal,    ) {
      
    this.newMaterialArrival = fb.group({
      arrivalDate: [Date, Validators.nullValidator],
      user: ["", Validators.nullValidator],
      internalNumber: ["", Validators.required],
      materialName: ["", Validators.required], 

      lotNumber: ["", Validators.required], 
      expiryDate: [Date, Validators.nullValidator],
      productionDate: [Date, ],

      supplierName: ["", Validators.required], 
      supplierNumber: ["", Validators.required],
      analysisApproval: [Boolean, ], 
      
      totalQnt: [0, Validators.required], 
      mesureType: [ 'kg', Validators.required],           
      remarks: ["", ],
      cmxOrderN: ["", ],
      packageType: ["", Validators.required], //select 
      packageQnt: [0, ],    
      unitsInPack: [0, ],    
      // unitVolume: [0, ],    
      // unitMesureType: [0, ],    
      
      warehouse: [""], //select 
      position: ["GENERAL"], //select 
      barcode:[""]
    });

   }

  ngOnInit() {
    // this.user =   this.authService.loggedInUser;
    this.invtSer.getAllSuppliers().subscribe(data => {
      this.suppliers=data;   
      this.suppliersList=data;   
    });

    this.authService.userEventEmitter.subscribe(data => {
      this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
    });

    let tmpD=new Date();
    this.dateStr= tmpD.toISOString().slice(0,10);
    //setting form to screen height
    this.screenHeight = window.innerHeight*(0.8);
    console.log('screenHeight: '+this.screenHeight)
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

  chooseSupplierFromList(sup){
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
            // console.log(this.newMaterialArrival.value.mesureType)
            // this.newMaterialArrival.value.mesureType= item[0].unit;
            // console.log(this.newMaterialArrival.value.mesureType)

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
    this.newMaterialArrival.value.analysisApproval= (this.analysisFlag ) ? true : false ;
    if(this.newMaterialArrival.valid){
      //CREATE BARCODE
      //CREATE BARCODE
      // we can also save all the form value obj = this.newMaterialArrival.value
      this.barcodeData={
        internalNumber: this.newMaterialArrival.value.internalNumber,
        materialName: this.newMaterialArrival.value.materialName,
        barcode: this.newMaterialArrival.value.barcode,
        expiryDate: this.newMaterialArrival.value.expiryDate,
        lotNumber: this.newMaterialArrival.value.lotNumber,
      }
    this.newMaterialArrival.controls.barcode.setValue("WAITING FOR BARCODE STRING"); // shpuld be this.barcodeData
    this.checkLotNumber().then(ok=> {
      this.addMaterialToStock();    
      });
    }else{
      this.toastSrv.error("Fill all required fields")
      this.fieldsColor();
    }
  }


  checkLotNumber(){
    var form= this.newMaterialArrival;
    var inventoryService = this.invtSer; 
    return new Promise(function (resolve, reject) {
      let itemN= form.value.internalNumber;
      let lotN= form.value.lotNumber;

      inventoryService.getLotNumber(itemN, lotN).subscribe(itemShelfs=>{
        if (itemShelfs.length>0){
          itemShelfs.forEach((itemShl, key) => {
            if(form.value.expiryDate != itemShl.expirationDate ){
              if(confirm("מספר לוט כבר קיים במערכת עם תאריך תפוגה \n"+itemShl.expirationDate)){
                form.controls.expiryDate.setValue(itemShl.expirationDate);
              } 
            }
            if(key+1 == itemShelfs.length)  resolve('lot number checked');
          });
        }else{
          resolve('lot number new')
        }
      })  
    });

  }

  addMaterialToStock(){
    let formToSend= this.newMaterialArrival.value;
    this.invtSer.newMatrialArrival(formToSend).subscribe( res=>{
      console.log(res);
      debugger
    });         

  }

  fieldsColor(){
    // var inputArr = document.getElementsByTagName('input');
    var inputArr = $('.form-row input, .form-row select');
    for (const [key, value] of Object.entries(this.newMaterialArrival.controls)) { 
      var tag =document.getElementsByName(key)[0];  
      if(tag!= undefined){
        if(value.status=='INVALID'){
          tag.style.borderColor= 'red';
          debugger
        }else{
          tag.style.borderColor= '#36bea6';
        }  
      }    

      // for (let index = 0; index < inputArr.length; index++) {
      //   var element = inputArr[index];
      //   debugger
      //   if(element.name != '' && value.status == 'INVALID'  ){}
      //   element.style.borderColor = (value.status == 'VALID') ? 'red' : '#36bea6';
      // }  

    }
  }
  resetForm(){
    this.newMaterialArrival.reset();
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
            debugger
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
      //       debugger
      //       this.openSearch(this.modal1);

      //     }
      //   }
      // });


