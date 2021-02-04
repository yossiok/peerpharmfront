import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { NgbModal, NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-material-arrival',
  templateUrl: './material-arrival.component.html',
  styleUrls: ['./material-arrival.component.scss']
})
export class MaterialArrivalComponent implements OnInit {
  public beforeChange($event: NgbNavChangeEvent) {

    this.activeTabId = $event.activeId;
    // if ($event.activeId === 'tab-preventchange2') {
    //   $event.preventDefault();
    // }
  }
  @ViewChild('modal1') modal1: ElementRef;
  @ViewChild('supplierNameInput') supplierNameInput: ElementRef;
  @ViewChild('supplierItemNameInput') supplierItemNameInput: ElementRef;
  @ViewChild('printBtn') printBtn: ElementRef;
  @ViewChild('tabset') tabset: NgbNav;
  @ViewChild('analysisFlag') analysisFlag: ElementRef;
  @ViewChild('requirementsFormDate') requirementsFormDate: ElementRef;


  materialsLocations: any[];
  allExpired: any[];
  karantineMaterials: any[];
  screenHeight: number;
  activeTabId: String;
  dateStr: String;
  user: String;
  suppliers: Array<any>;
  suppliersList: Array<any>;
  supplierItemsList: Array<any>;
  supplierItemsListCopy: Array<any>;
  userObj: String;
  // analysisFlag: Boolean = false;
  borderColor: String = '#36bea6';
  newMaterialArrival: FormGroup;
  barcodeData: any;
  choosenOrderItem: any;
  chosenItem: any;
  whareHouses: any;
  curentWhareHouseId: any;
  curentWhareHouseName: any;
  currentComaxOrder: any[];
  comaxOrderExist: Boolean = false;
  editWharehouses: Boolean = false;
  openOrders: Array<any>;

  supplierModal: Boolean = false;
  supplierModalHeader: String = "";
  supplierModalInfo: any;

  // barcode vars //
  materialNum: String;
  materialName: String;
  lotNumber: String;
  productionDate: String;
  arrivalDate: String;
  expiryDate: String;

  smallText: Boolean = false;

  bcValue: Array<any> = [];
  elementType = 'svg';
  format = 'CODE128';
  lineColor = '#000000';
  width = 0.5;
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
  requiresFromFull: Boolean = false;

  batchNumRemarksInput: Boolean = false;
  orderedQntRemarksInput: Boolean = false;
  approvedPackgeRemarksInput: Boolean = false;



  constructor(private fb: FormBuilder,
    private invtSer: InventoryService,
    private procuretServ: Procurementservice,
    private toastSrv: ToastrService,
    private authService: AuthService,
    private modalService: NgbModal,) {

    this.newMaterialArrival = fb.group({
      arrivalDate: [Date, Validators.required],
      user: ["", Validators.required],
      internalNumber: ["", Validators.required],
      materialName: ["", Validators.required],

      lotNumber: ["", Validators.required],
      expiryDate: [Date, Validators.nullValidator],
      productionDate: [Date,],

      supplierName: ["", Validators.required],
      supplierNumber: ["", Validators.required],
      analysisApproval: [Boolean, false,],

      totalQnt: [null, Validators.required],
      mesureType: ['kg', Validators.required],
      remarks: ["",],
      cmxOrderN: ["",],
      packageType: ["", Validators.required], //select 
      packageQnt: [1, Validators.min(1)],
      unitsInPack: [null, Validators.min(1)],
      // unitVolume: [0, ],    
      // unitMesureType: [0, ],    

      warehouse: ["",Validators.required], //select 
      position: ["",Validators.required], //select 
      barcode: [""],
      deliveryNoteNumber: ["", Validators.required],
    });


    this.requirementsForm = fb.group({

      date: ["", Validators.required],
      user: ["",],
      signature: ["", Validators.required],
      itemNumber: ["", Validators.required],
      itemName: ["", Validators.required],
      orderItemNum: [true, Validators.required],
      approvedSupplier: [true, Validators.required],
      batchNum: [true, Validators.required],
      batchNumRemarks: ["",],
      orderedQnt: [true, Validators.required],
      orderedQntRemarks: ["",],
      approvedPackge: [true, Validators.required],
      approvedPackgeRemarks: ["",],
      approvedDocs: [true, Validators.required],
      approvedDocsRemarks: ["",],
      cocBatchNum: [true, Validators.required],
      cocBatchNumRemarks: ["",],
      labReport: [true, Validators.required],
      labReportRemarks: ["",],
      moreDocs: [true, Validators.required],
      moreDocsRemarks: ["",],
      sds: [true, Validators.required],
      sdsRemarks: ["",],
      approvedAndStocked: [true, Validators.required],
      approvedAndStockedRemarks: ["",],

    });


  }
  ngOnInit() {


    this.getAllExpiredMaterials();
    this.getAllMaterialsLocations();
    this.getKarantineMaterials();
    // this.user =   this.authService.loggedInUser;
    this.authService.userEventEmitter.subscribe(data => {
      this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
      this.newMaterialArrival.controls.user.setValue(this.user)
    });
    this.invtSer.getAllSuppliers().subscribe(data => {
      this.suppliers = data;
      this.suppliersList = data;
    });
    let tmpD = new Date();
    this.dateStr = tmpD.toISOString().slice(0, 10);
    this.newMaterialArrival.controls.arrivalDate.setValue(tmpD);
    this.requirementsForm.controls.date.setValue(this.dateStr);

    //setting form to screen height
    this.screenHeight = window.innerHeight * (0.8);
    console.log('screenHeight: ' + this.screenHeight)
    // two displays "tab-selectbyid1" OR "tab-selectbyid2"
    this.activeTabId = "tab-selectbyid1"
  }


  getUserWhs() {
    this.invtSer.getWhareHousesList().subscribe(async res => {
      let displayAllowedWH = [];
      // for (const wh of res) {
      await res.forEach((wh) => {
        if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
          displayAllowedWH.push(wh);
        }
      });
      this.whareHouses = displayAllowedWH;
      this.curentWhareHouseId = displayAllowedWH[0]._id;
      this.curentWhareHouseName = displayAllowedWH[0].name;

      if (this.authService.loggedInUser.authorization) {
        if (this.authService.loggedInUser.authorization.includes("system")) {
          this.editWharehouses = true;
        }
      }

    });
  }
  // analysisFlagChange(ev){
  //   if(ev.target.checked){
  //     this.newMaterialArrival.value.analysisApproval= true;
  //   }else{
  //     this.newMaterialArrival.value.analysisApproval= false;
  //   }
  //   
  // }
  saveMaterialRequirementsForm() {
    this.authService.userEventEmitter.subscribe(data => {
      this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
      this.requirementsForm.controls.user.setValue(this.user)
    });
    if (this.requirementsForm.valid) {
      this.invtSer.newMaterialRequirementsForm(this.requirementsForm.value).subscribe(doc => {
        if (doc._id) {
          this.toastSrv.success('Material Requirements Form saved')
          this.requiresFromFull = true;
        }
      })
    } else {
      this.requiresFromFull = false;
      this.toastSrv.error('Please fill all the fields')
    }
  }
  resetMaterialRequirementsForm() {
    this.requirementsForm.reset();
    this.authService.userEventEmitter.subscribe(data => {
      this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
      this.requirementsForm.controls.user.setValue(this.user)
    });
  }

  checkRadio(ev, flag) {
    let formField = ev.target.name;

    this.requirementsForm.controls[formField].setValue(flag)
    if (!this.requirementsForm.value.batchNum) {
      this.batchNumRemarksInput = true;
    } else {
      this.batchNumRemarksInput = false;
      this.requirementsForm.controls.batchNumRemarks.setValue('')
    }
    if (!this.requirementsForm.value.orderedQnt) {
      this.orderedQntRemarksInput = true;
    } else {
      this.orderedQntRemarksInput = false;
      this.requirementsForm.controls.orderedQntRemarks.setValue('')

    }
    if (!this.requirementsForm.value.approvedPackge) {
      this.approvedPackgeRemarksInput = true;
    } else {
      this.approvedPackgeRemarksInput = false;
      this.requirementsForm.controls.approvedPackgeRemarks.setValue('')
    }
  }

  getAllExpiredMaterials() {
    this.invtSer.getAllExpiredArrivals().subscribe(data => {
      this.allExpired = data;
    })
  }

  getAllMaterialsLocations() {
    this.invtSer.getAllMaterialLocations().subscribe(data => {
      this.materialsLocations = data;
    })
  }

  getKarantineMaterials() {
    this.invtSer.getAllKarantine().subscribe(materials => {
      console.log('karantine materials: ',materials)
      this.karantineMaterials = materials
    })
  }

  changeFields(ev, flag) {
    let formField = ev.target.name;
    let formFieldValue = ev.target.value;
    this.requirementsForm.controls[formField].setValue(formFieldValue)
  }

  findMaterialBtNumber() {

    if (this.requirementsForm.value.itemNumber != "") {
      this.invtSer.getMaterialStockItemByNum(this.requirementsForm.value.itemNumber).subscribe(stockItem => {
        let elem = document.getElementsByName('itemName')[0];
        elem.setAttribute('value', stockItem[0].componentName);
        this.requirementsForm.controls.itemNumber.setValue(stockItem[0].componentN);
        this.requirementsForm.controls.itemName.setValue(stockItem[0].componentName);
      });
    } else {
      this.toastSrv.error("No item number");
    }
  }
  getUserName() {

    this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
    this.newMaterialArrival.controls.user.setValue(this.user)
  }

  filterSuppliers() {
    debugger;
    var supplierName = this.supplierNameInput.nativeElement.value;

    var supplier = this.suppliers.find(s => s.suplierName == supplierName)
    this.newMaterialArrival.controls.supplierNumber.setValue(supplier.suplierNumber)

  }

  filterSupplierItems(input) {
    debugger;


    if (input != "") {
      let inputVal = input.toLowerCase();
      this.supplierItemsList = this.supplierItemsListCopy.filter(item => {
        if (item.componentName.toLowerCase().includes(inputVal)) {
          return item;
        }
      });
    }
  }

  // chooseOnlySupplier(){
  //   this.newMaterialArrival.controls.supplierNumber.setValue(this.supplierModalInfo.suplierNumber);
  //   this.newMaterialArrival.controls.supplierName.setValue(this.supplierModalInfo.suplierName);
  //   this.suppliersList=[];
  // }

  // chooseSupplierFromList(sup){

  //   this.supplierModalHeader= "פריטים של ספק "+sup.suplierNumber+"\n";
  //   this.supplierModalInfo=sup;
  //   this.chooseOnlySupplier();
  //   this.invtSer.getItemsBySupplierNum(sup.suplierNumber).subscribe(stockItems=>{
  //     if(stockItems.length>0){  
  //       this.supplierItemsList= stockItems;
  //       this.supplierItemsListCopy= stockItems;

  //       this.openSearch(this.modal1);
  //     } else{
  //         this.toastSrv.error("supplier don't have items")
  //     }
  //   });
  // }


  createBarcode() {
    // waiting for yossi
  }

  checkIfIOrderExist(ev) {
    debugger;
    var orderNumber = ev.target.value
    if (orderNumber != '') {
      this.procuretServ.findIfOrderExist(orderNumber).subscribe(data => {
        if (data.length > 0) {
          this.currentComaxOrder = data;
          this.comaxOrderExist = true;

        } else {
          this.toastSrv.error('מספר הזמנה לא קיים במערכת')
          this.comaxOrderExist = false;
        }
      })
    }
  }

  fillLastArrivalPosition(materialNumber) {

    this.invtSer.getMaterialArrivalByNumber(materialNumber).subscribe(data => {
      debugger;
      if (data) {
        this.newMaterialArrival.controls.position.setValue(data[data.length - 1].position)
      }
    })

  }

  searchInternalNumber() {
    if (this.newMaterialArrival.value.internalNumber != "") {
      this.invtSer.getMaterialStockItemByNum(this.newMaterialArrival.value.internalNumber).subscribe(item => {
        debugger
        console.log(item);
        if (item.length == 0) {
          this.toastSrv.error("Can't find item number")
        } else if (item.length == 1) {
          if (confirm('שים לב , לחומר גלם זה מסומן היתר רעלים והכמות המותרת לאחסון הינה' + ' ' + item[0].allowQtyInStock)) {
            this.newMaterialArrival.controls.materialName.setValue(item[0].componentName);
            this.fillLastArrivalPosition(this.newMaterialArrival.value.internalNumber)
            if (item[0].unit != "" && item[0].unit != undefined && item[0].unit != null) {
              // console.log(this.newMaterialArrival.value.mesureType)
              this.newMaterialArrival.controls.mesureType.setValue(item[0].unit);


            }
            this.suppliersList = [];
          }

        } else if (item.length > 1) {
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

  submitForm() {

    // shelf general position

    this.materialNum = this.newMaterialArrival.value.internalNumber;
    this.materialName = this.newMaterialArrival.value.materialName;
    this.lotNumber = this.newMaterialArrival.value.lotNumber;
    this.productionDate = this.newMaterialArrival.value.productionDate;
    this.arrivalDate = this.newMaterialArrival.value.arrivalDate;
    this.expiryDate = this.newMaterialArrival.value.expiryDate;
    this.newMaterialArrival.value.deliveryNoteNumber.trim();


    if (this.newMaterialArrival.value.user == "") {
      this.authService.userEventEmitter.subscribe(data => {
        this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
        this.newMaterialArrival.controls.user.setValue(this.user);
      });
    }
    let continueSend = false;
    this.newMaterialArrival.controls.analysisApproval.setValue(this.analysisFlag.nativeElement.checked);
    // this.newMaterialArrival.value.analysisApproval= (this.analysisFlag ) ? true : false ;
    if (this.newMaterialArrival.value.productionDate != "") { this.adjustDate(this.newMaterialArrival.controls.productionDate) }
    if (this.newMaterialArrival.value.expiryDate != "") { this.adjustDate(this.newMaterialArrival.controls.expiryDate) }
    if (this.newMaterialArrival.valid) {
      if (!this.analysisFlag.nativeElement.checked) {
        if (confirm('אנליזה לא תקינה , האם להמשיך?')) {
          continueSend = true;
        } else {
          continueSend = false;
        }
      } else {
        continueSend = true;
      }

      if (this.newMaterialArrival.value.expiryDate = "") {
        if (confirm('תאריך תפוגה חסר , האם להמשיך?')) {
          continueSend = true;
        } else {
          continueSend = false;
        }
      } else if (continueSend) {
        continueSend = true;
      }

      if (continueSend) {


        this.newMaterialArrival.value.productionDate = new Date(this.newMaterialArrival.value.productionDate)
        this.newMaterialArrival.controls.barcode.setValue("WAITING FOR BARCODE STRING"); // shpuld be this.barcodeData
        this.checkLotNumber().then(ok => {
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

    if (!continueSend || !this.newMaterialArrival.valid) {
      this.toastSrv.error("Fill all required fields")
      this.fieldsColor();
    }
  }


  checkLotNumber() {

    var form = this.newMaterialArrival;
    var inventoryService = this.invtSer;
    return new Promise(function (resolve, reject) {
      // let itemN= form.value.internalNumber;
      let suppNumber = form.value.supplierNumber;
      let lotN = form.value.lotNumber;
      let breakeLoop = false;
      inventoryService.getLotNumber(suppNumber, lotN).subscribe(arrivalForms => {
        if (arrivalForms.length > 0) {
          // wont save same lot numbers with different expiry date
          arrivalForms.forEach((f, key) => {
            if (form.value.expiryDate != f.expiryDate && !breakeLoop) {
              let date = f.expiryDate.slice(0, 10)
              if (confirm("מספר לוט כבר קיים במערכת עם תאריך תפוגה \n" + date)) {
                form.controls.expiryDate.setValue(date);
                breakeLoop = true;
              }
            }
            if (key + 1 == arrivalForms.length) resolve('lot number checked');
          });
        } else {
          resolve('lot number new')
        }
      })
    });

  }

  checkIfShelfExist(ev) {

    let shelf = ev.target.value;
    let whareHouseId;
    let whareHouse = this.newMaterialArrival.controls.warehouse.value;
    if(whareHouse == 'Karantine'){
      whareHouseId = '5cf64e77e32883115c39dc56'
    } else {
      whareHouseId = '5c1124ef2db99c4434914a0e'
    }
    if (shelf != '') {
      debugger;
      this.invtSer.checkIfShelfExist(shelf, whareHouseId).subscribe(data => {
        if (data == 'shelfMissing') {
          this.toastSrv.error('מדף אינו קיים , אנא הקם מדף בניהול מחסן')
          this.newMaterialArrival.controls.position.setValue('')
        } else {

          this.toastSrv.success('נבחר מדף')
        }
      })
    }

  }

  addMaterialToStock() {
    debugger;
    let formToSend = this.newMaterialArrival.value;
    formToSend.lastUpdate = new Date();
    formToSend.lastUpdateUser = this.user;
    this.invtSer.newMatrialArrival(formToSend).subscribe(res => {
      debugger
      this.toastSrv.success("New material arrival saved!");
      this.resetForm();
      if (res) {
        this.bcValue = [res._id];
        this.materialNum = res.internalNumber;
        this.materialName = res.materialName;
        this.lotNumber = res.lotNumber;
        this.productionDate = res.productionDate;
        this.arrivalDate = res.arrivalDate;
        this.expiryDate = res.expiryDate;

        this.smallText = (this.materialName.length > 80) ? true : false;

        this.printBarcode(res._id, res.internalNumber);// we might need to change the value to numbers
        this.toastSrv.success("New material arrival saved!");
        this.resetForm();
        this.analysisFlag.nativeElement.checked = false;
        //print barcode;
      } else if (res == 'no material with number') {
        this.toastSrv.error("Item number wrong")
      } else {
        this.toastSrv.error("Something went wrong, saving faild")
      }
    });

  }

  printBarcode(id, number) {
    if (id != "") {
      setTimeout(() => {
        this.printBtn.nativeElement.click();
      }, 500);
    } else {
      this.toastSrv.error("Can't print sticker");
    }

  }

  fieldsColor() {
    // var inputArr = document.getElementsByTagName('input');
    var inputArr = $('.form-row input, .form-row select');
    for (const [key, value] of Object.entries(this.newMaterialArrival.controls)) {
      var tag = document.getElementsByName(key)[0];
      if (tag != undefined) {
        if (value.status == 'INVALID') {
          tag.style.borderColor = 'red';

        } else {
          tag.style.borderColor = '#36bea6';
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
  resetForm() {
    this.newMaterialArrival.reset();
    this.newMaterialArrival.controls.arrivalDate.setValue(new Date());
    this.newMaterialArrival.controls.user.setValue(this.user);
  }
  adjustDate(formField) {
    formField.setValue(new Date(formField.value));
  }
  resetDate(date) {
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


