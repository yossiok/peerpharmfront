import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { NgbModal, NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MaterialArrivalCertif, MaterialArrivalLine } from './MaterialArrivalCertif';

const defaultLine = {
  itemInternalNumber: '',
  itemName: '',
  itemSupplierNumber: '',
  purchaseOrderNumber: 0,
  wareHouse: '',
  position: '',
  amount: 0,
  unitsAmount: 0,
  remarks: ''
}

@Component({
  selector: 'app-material-arrival',
  templateUrl: './material-arrival.component.html',
  styleUrls: ['./material-arrival.component.scss']
})
export class MaterialArrivalComponent implements OnInit {
  position: any;
  submittingForm: boolean;

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
  @ViewChild('printBtn2') printBtn2: ElementRef;

  today: Date = new Date()
  materialsLocations: any[];
  allExpired: any[];
  karantineitemShells: any[];
  shellPosition: string;
  shellExist: boolean = true;
  shellCheckMessage: string = 'אנא הכנס שם מדף'
  shellMessageClass: string = "alert alert-primary"
  itemShellID: string;
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
  materialStockAllowed: boolean = false;
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
  lastOrders: any[] = [];

  smallText: Boolean = false;

  bcValue: Array<any> = [];
  elementType = 'svg';
  format = 'CODE128';
  lineColor = '#000000';
  width = 2;
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

  materialArrivalCertif: MaterialArrivalCertif = {
    certifNumber: 0,
    userName: this.authService.loggedInUser.userName,
    date: this.today,
    materialArrivalLines: [],
    supplierCertifNumber: '',
    supplierName: '',
    supplierNumber: '',
    supplierOrderNumber: '',
    sumAmount: 0,
    sumUnits: 0
  }

  materialArrivalLine: MaterialArrivalLine = { ...defaultLine }



  constructor(private fb: FormBuilder,
    private invtSer: InventoryService,
    private procuretServ: Procurementservice,
    private toastSrv: ToastrService,
    private authService: AuthService,
    private modalService: NgbModal,) {

    this.newMaterialArrival = fb.group({
      arrivalDate: [this.today, Validators.required],
      user: ["", Validators.required],
      internalNumber: ["", Validators.required],
      materialName: ["", Validators.required],

      lotNumber: ["", Validators.required],
      expiryDate: [Date, Validators.nullValidator],
      productionDate: [Date,],

      supplierName: [this.materialArrivalCertif.supplierName, Validators.required],
      supplierNumber: [this.materialArrivalCertif.supplierNumber, Validators.required],
      supplierOrderNumber: [this.materialArrivalCertif.supplierOrderNumber],
      analysisApproval: [Boolean, false,],

      totalQnt: [null, Validators.required],
      mesureType: ['kg', Validators.required],
      remarks: ["",],
      cmxOrderN: [null],
      packageType: ["", Validators.required], //select 
      packageQnt: [1, Validators.min(1)],
      unitsInPack: [null, Validators.min(1)],
      // unitVolume: [0, ],    
      // unitMesureType: [0, ],    

      warehouse: ["", Validators.required], //select 
      position: ["", Validators.required], //select 
      barcode: [""],
      deliveryNoteNumber: [this.materialArrivalCertif.supplierCertifNumber, Validators.required],
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
    this.getkarantineitemShells();
    // this.user =   this.authService.loggedInUser;
    this.authService.userEventEmitter.subscribe(data => {
      this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
      this.newMaterialArrival.controls.user.setValue(this.user)
    });

    if (this.authService.loggedInUser.authorization.includes("materialStock") || this.authService.loggedInUser.authorization.includes("stockAdmin")) this.materialStockAllowed = true
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

  getLatestOrders() {
    this.procuretServ.getLastOrdersForItem(this.newMaterialArrival.value.internalNumber, 10).subscribe(orders => {
      this.lastOrders = orders
    })
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

  getkarantineitemShells() {
    this.invtSer.getAllKarantine().subscribe(itemShells => {
      this.karantineitemShells = itemShells
    })
  }

  karantineitemShellsToInventory(karToInv, itemShellID) {
    this.itemShellID = itemShellID;
    this.modalService.open(karToInv, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
  }

  checkShell() {
    this.invtSer.checkIfShelfExist(this.shellPosition, '5c1124ef2db99c4434914a0e').subscribe(res => {
      this.shellExist = res == 'shelfMissing' ? false : true;
      this.shellCheckMessage = res == 'shelfMissing' ? 'מדף זה לא קיים במחסן ראשי! אנא הקם מדף' : 'עודכן בהצלחה'
      this.shellMessageClass = res == 'shelfMissing' ? 'alert alert-danger' : 'alert alert-success'

      if (res != 'shelfMissing') {
        this.invtSer.updateShelfPosition(this.itemShellID, res.ShelfId, this.shellPosition)
          .subscribe(updatedShell => console.log('updated shell: ', updatedShell))
      }
    })
  }

  deleteLineFromCert(i: number) {
    if (confirm(`line ${i} will be erased.`)) this.materialArrivalCertif.materialArrivalLines.splice(i, 1)
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
    ;
    var supplierName = this.supplierNameInput.nativeElement.value;

    var supplier = this.suppliers.find(s => s.suplierName == supplierName)
    this.newMaterialArrival.controls.supplierNumber.setValue(supplier.suplierNumber)

  }

  filterSupplierItems(input) {
    ;


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
    ;
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
      ;
      if (data) {
        this.newMaterialArrival.controls.position.setValue(data[data.length - 1].position)
      }
    })

  }

  searchInternalNumber() {
    if (this.newMaterialArrival.value.internalNumber != "") {
      this.invtSer.getMaterialStockItemByNum(this.newMaterialArrival.value.internalNumber).subscribe(item => {
        console.log(item);
        if (item.length == 0) {
          this.toastSrv.error("Can't find item number")
        } else if (item.length == 1) {
          if (item[0].permissionDangerMaterials) this.toastSrv.info('לחומר גלם זה מסומן היתר רעלים והכמות המותרת לאחסון הינה' + ' ' + item[0].allowQtyInStock, 'הערה חשובה!')
          this.newMaterialArrival.controls.materialName.setValue(item[0].componentName);
          this.fillLastArrivalPosition(this.newMaterialArrival.value.internalNumber)
          if (item[0].unit != "" && item[0].unit != undefined && item[0].unit != null) {
            // console.log(this.newMaterialArrival.value.mesureType)
            this.newMaterialArrival.controls.mesureType.setValue(item[0].unit);
          }
          this.suppliersList = [];
        } else if (item.length > 1) {
          this.toastSrv.error("multi items with the same number")
        }
      });
    }
  }

  submitForm() {
    // shelf general position
    this.submittingForm = true;

    this.materialNum = this.newMaterialArrival.value.internalNumber;
    this.materialName = this.newMaterialArrival.value.materialName;
    this.lotNumber = this.newMaterialArrival.value.lotNumber;
    this.productionDate = this.newMaterialArrival.value.productionDate;
    this.arrivalDate = this.newMaterialArrival.value.arrivalDate;
    this.expiryDate = this.newMaterialArrival.value.expiryDate;
    this.position = this.newMaterialArrival.value.position;
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
        }).catch(e => {
          this.toastSrv.error(e);
          this.submittingForm = false
        })

      }
    }

    if (!continueSend || !this.newMaterialArrival.valid) {
      this.toastSrv.error("Fill all required fields")
      this.fieldsColor();
      this.submittingForm = false
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
    if (whareHouse == 'Karantine') {
      whareHouseId = '5cf64e77e32883115c39dc56'
    } else {
      whareHouseId = '5c1124ef2db99c4434914a0e'
    }
    if (shelf != '') {
      ;
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
    ;
    let formToSend = this.newMaterialArrival.value;
    formToSend.lastUpdate = new Date();
    formToSend.lastUpdateUser = this.user;
    this.invtSer.newMatrialArrival(formToSend).subscribe(res => {
      this.submittingForm = false
      if (res == -1) {
        this.toastSrv.error('Shelf Position Doesnt Match Wharehouse!!!')
        this.toastSrv.error('Material Arrival NOt Saved!')
      }
      else if (res.msg == 'no material with number') {
        this.toastSrv.error("Item number wrong")
      }
      else {

        // certificate - general
        if (this.materialArrivalCertif.materialArrivalLines.length == 0) { // new certif
          this.materialArrivalCertif.supplierCertifNumber = res.saved.deliveryNoteNumber
          this.materialArrivalCertif.supplierName = res.saved.supplierName
          this.materialArrivalCertif.supplierOrderNumber = res.saved.supplierOrderNumber
        }

        //certificate - line
        this.materialArrivalLine.itemInternalNumber = res.saved.internalNumber
        this.materialArrivalLine.itemSupplierNumber = res.saved.supplierNumber
        this.materialArrivalLine.itemName = res.saved.materialName
        this.materialArrivalLine.purchaseOrderNumber = res.saved.cmxOrderN
        this.materialArrivalLine.wareHouse = res.saved.warehouse
        this.materialArrivalLine.position = res.saved.position
        this.materialArrivalLine.amount = Number(res.saved.totalQnt)
        this.materialArrivalLine.unitsAmount = Number(res.saved.packageQnt)
        this.materialArrivalLine.remarks = res.saved.remarks

        this.materialArrivalCertif.materialArrivalLines.push(this.materialArrivalLine)
        this.materialArrivalCertif.sumAmount += this.materialArrivalLine.amount
        this.materialArrivalCertif.sumUnits += this.materialArrivalLine.unitsAmount



        this.materialArrivalLine = { ...defaultLine }
        // setTimeout(()=>this.printBtn2.nativeElement.click(), 500)

        this.toastSrv.success("New material arrival saved!");
        this.requiresFromFull = !this.requiresFromFull

        this.bcValue = [res.saved.reqNum];
        this.materialNum = res.saved.internalNumber;
        this.materialName = res.saved.materialName;
        this.lotNumber = res.saved.lotNumber;
        this.productionDate = res.saved.productionDate;
        this.arrivalDate = res.saved.arrivalDate;
        this.expiryDate = res.saved.expiryDate;

        this.smallText = (this.materialName.length > 80) ? true : false;

        this.printBarcode(res.saved._id, res.internalNumber);// we might need to change the value to numbers
        this.toastSrv.success("New material arrival saved!");
        this.resetForm();
        this.analysisFlag.nativeElement.checked = false;
        //print barcode;
      }
    });

  }

  saveCertif() {
    this.invtSer.arrivalsCertificate(this.materialArrivalCertif).subscribe(response => {
      if (response.materialArrivalCertifToSave) {
        this.materialArrivalCertif.certifNumber = response.materialArrivalCertifToSave.certNum
        this.toastSrv.success(response.msg)
        setTimeout(() => this.printBtn2.nativeElement.click(), 500)
      }
      else if (response.msg) this.toastSrv.error(response.msg)
    })
  }

  resetCertificate() {
    this.materialArrivalCertif = {
      certifNumber: 0,
      userName: this.authService.loggedInUser.userName,
      date: this.today,
      materialArrivalLines: [],
      supplierCertifNumber: '',
      supplierName: '',
      supplierNumber: '',
      supplierOrderNumber: '',
      sumAmount: 0,
      sumUnits: 0
    }
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

  open(modal) {
    this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
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


