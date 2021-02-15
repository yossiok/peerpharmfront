import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input, ViewEncapsulation, HostListener } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'
import { ActivatedRoute } from '@angular/router'
import { UploadFileService } from 'src/app/services/helpers/upload-file.service';
import { HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
//import { DEC } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
//import { toDate } from '@angular/common/src/i18n/format_date';
import { fstat } from 'fs';

import { BatchesService } from 'src/app/services/batches.service';
import { ItemsService } from 'src/app/services/items.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
//import { Console } from '@angular/core/src/console';
import { Procurementservice } from 'src/app/services/procurement.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from 'src/app/services/orders.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { upperFirst } from 'lodash';
import { FormsService } from 'src/app/services/forms.service';



@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']

})
export class StockComponent implements OnInit {
  // resCmpt: any;
  itemmoveBtnTitle: string = "Item Movements";
  loadingMovements: boolean = false;
  showItemDetails: boolean = true;
  showLoader: boolean = false;
  smallLoader: boolean = false;
  openOrderRecommendModal: boolean = false;
  customersModal: boolean = false;
  showDeleteBtn: boolean = false;
  inventoryNewReqModal: boolean = false;
  itemsMovementModal: boolean = false;
  invRequestsModal: boolean = false;
  itemMovements: any = [];
  materialPurchases: any[]
  allCustomers: any[]
  componentSuppliers: any[]
  itemShell: any[];
  components: any[];
  componentsCopy: any[];
  materialArrivals: any[];
  subscription: any
  materialFilterType: any
  materialFilterValue: any
  filterMaterialOption: String;
  materialLocations: any[];
  items: any[];
  compositionName: any;
  currItem: any;
  compositionPercentage: any;
  recieveItemType: any;
  allComponentsPurchases: any[];
  allMaterialsPurchases: any[];
  expirationBatchDate: any;
  totalQuantity: String;
  sixMonth: number = 0;
  oneYear: number = 0
  threeYears: number = 0
  allowUserEditItem = false;
  updateSupplier = false;
  check = false;
  resCmpt: any = {
    whoPays: '',
    payingCustomersList: [],
    componentN: '',
    componentName: '',
    componentNs: '',
    suplierN: '',
    suplierName: '',
    componentType: '',
    componentCategory: '',
    img: '',
    importFrom: '',
    lastModified: '',
    minimumStock: '',
    needPrint: '',
    packageType: '',
    packageWeight: '',
    remarks: '',
    jumpRemark: '',
    componentItems: [],
    input_actualMlCapacity: 0,
    alternativeComponent: '',
    comaxName: '',
    alternativeSuppliers: [],
    price: ''

  }
  alternativeSupplier: any = {
    name: '',
    material: '',
    price: ''
  }

  newQApallet: any = {
    customerName:'',
    allUnits:'',
    shelf:'',
    qaStatus:'מוכן לשליחה',
    itemNumber:'',
    palletStatus:'open',
    isPersonalPackage:false,
    kartonQuantity:'',
    lastFloorQuantity:'',
    orderNumber:'',
    unitsInKarton:'',
    unitsQuantityPartKarton:'',
    floorNumber:''


  }
  alterSuppliers: any[];
  buttonColor: string = '#2962FF';
  buttonColor2: string = 'white';
  buttonColor3: string = 'white';
  fontColor:string = 'white';
  fontColor2:string = 'black';
  fontColor3:string = 'black';
  openModal: boolean = false;
  openImgModal: boolean = false;
  openAmountsModal: boolean = false;
  openProcurementModal: boolean = false;
  openOrderAmountsModal: boolean = false;
  openProductAmountModal: boolean = false;
  procurementModalHeader: string;
  openModalHeader: string; 
  filteredComponents: any[];
  componentsUnFiltered: any[];
  componentsAmount: any[];
  tempHiddenImgSrc: any;
  procurmentQnt: Number;
  allocatedOrders: any[];
  allocatedProducts: any[];
  amountsModalData: any;
  itemAmountsData: any[];
  itemAmountsWh: any[];
  newAllocationOrderNum: string;
  newAllocationAmount: Number;
  itemIdForAllocation: String;
  EditRowId: any = "";
  orderItems: any;
  procurementInputEvent: any;

  stockType: String = "component";
  newItem: String = '';
  newItemBtn: String = 'new';
  today: Date = new Date()
  //var's to edit itemshelf in allowed wh for user
  user: UserInfo;
  whareHouses: Array<any>;
  curentWhareHouseId: String;
  curentWhareHouseName: String;
  relatedOrderNum: String = '';
  //adding Stock amounts
  ordersAllocatedAmount: any[];
  newItemShelfQnt: number;
  newItemShelfBatchNumber: string = '';
  newItemShelfArrivalDate: number;
  newItemShelfPosition: String;
  newItemShelfWH: String;
  cmptTypeList: Array<any>;
  cmptCategoryList: Array<any> = [
'Sacara','Mineralium','Arganicare','Spa Pharma','Olive','Vitamin C','Quinoa','Andrea Milano','Dermalosophy',
'Kreogen','Careline','Frulatte','Mediskin','4Ever','Adah Lazorgan','Avalanche','Abyssian','Jahshan',
'Mika','Hyalunol','Hemp','Kiss','Rose','Collagen','Gaya',
  ]
  emptyFilterArr: Boolean = true;
  currItemShelfs: Array<any>;
  updateStockItem: Boolean = false;
  stockAdmin: Boolean = false;
  destShelfId: String;
  destShelf: String;
  destShelfQntBefore: Number = 0;
  originShelfQntBefore: Number = 0;
  amountChangeDir: String;
  sehlfChangeNavBtnColor: String = "";
  amountForPalletBtnColor: String = "";
  amountChangeNavBtnColor: String = "#1affa3";
  ItemBatchArr: Array<any>;
  filterVal: String = '';
  currModalImgSrc: String = '';
  productToFind: String = '';
  materialToFind: String = "";
  productResponse: any = {};
  linkDownload: String = "";
  mixMaterial: String;
  mixMaterialPercentage: String;
  arrivalDateExpired = true;
  newItemProcurmentDetails: FormGroup;
  newOrderProcurmentDetails: FormGroup;
  newTransportDetails: FormGroup;
  transportationItem: FormGroup;
  loadingExcel: Boolean = false;
  allSuppliers: any[];
  allPurchases: any[];
  totalComponentsValue: number = 0;

  @ViewChild('filterByType') filterByType: ElementRef;//this.filterByType.nativeElement.value
  @ViewChild('filterByCategory') filterByCategory: ElementRef;//this.filterByCategory.nativeElement.value
  @ViewChild('filterBySupplierN') filterBySupplierN: ElementRef; //this.filterBySupplierN.nativeElement.value
  @ViewChild('filterByItem') filterByItem: ElementRef; //this.filterBySupplierN.nativeElement.value
  @ViewChild('filterByCmptName') filterByCmptName: ElementRef; //this.filterByCmptName.nativeElement.value
  @ViewChild('filterbyNum') filterbyNum: ElementRef; //this.filterbyNum.nativeElement.value
  @ViewChild('filterBySupplier') filterBySupplier: ElementRef; //this.filterbyNum.nativeElement.value

  @ViewChild('suppliedAlloc') suppliedAlloc: ElementRef;
  @ViewChild('newProcurmentQnt') newProcurmentQnt: ElementRef;
  @ViewChild('newProcurmentOrderNum') newProcurmentOrderNum: ElementRef;
  @ViewChild('newProcurmentExceptedDate') newProcurmentExceptedDate: ElementRef;

  @ViewChild('supplierName') supplierName: ElementRef;
  @ViewChild('manufacturer') manufacturer: ElementRef;
  @ViewChild('alterName') alterName: ElementRef;
  @ViewChild('alternativeMaterial') alternativeMaterial: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('coin') coin: ElementRef;
  @ViewChild('packageWeight') packageWeight: ElementRef;
  @ViewChild('priceLoading') priceLoading: ElementRef;
  @ViewChild('coinLoading') coinLoading: ElementRef;
  @ViewChild('expectedArrival') expectedArrival: ElementRef;
  @ViewChild('country') country: ElementRef;

  @ViewChild('materialToSearch') materialToSearch: ElementRef;




  // material array // 
  materials: any[];
  allMaterialArrivals: any[];
  recommandPurchase: any = {
    remarks: '',
    amount: '',
    componentNumber: '',
    date: this.formatDate(new Date()),
    user: '',
    type: '',
    supplier: '',
    componentName:''
  }

  supplier: any = {
    supplierName: '',
    price: "",
    coin: "",
    coinLoading: "",
    priceLoading: "",
    manufacturer: "",
    alternativeMaterial: "",
    alterName: "",
    subGroup: "",
    packageWeight: "",
  }
  resMaterial: any = {

    componentN: "",
    componentName: "",
    remarks: "",
    img: "",
    minimumStock: "",
    packageWeight: "",
    itemType: "",
    barcode: "",
    actualMlCapacity: "",
    unitOfMeasure: "",
    group: "",
    subGroup2: "",
    alternativeSuppliers: [],
    status: "",
    threatment: "",
    monthTillExp: "",
    monthAvgPcs: "",
    msds: "",
    coaMaster: "",
    function: '',
    measurement: "",
    notInStock: false,
    inciName: "",
    casNumber: "",
    composition: [],
    umNumber: "",
    imerCode: "",
    imerTreatment: "",
    allowQtyInStock: "",
    expiredQty: "",
    permissionDangerMaterials: "",
    storageTemp: "",
    storageDirections: "",
    frameQuantity: "",
    frameSupplier: "",
    location: "",
    quantityInStock: "",
    mixedMaterial: [],
    formuleRemarks: ''

  }
  itemExpectedArrivals: any;
  closeResult: string;

  // currentFileUpload: File; //for img upload creating new component

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.editSuppliers('');
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent): void {

    if (event.key === 'F2') {
      if (this.openModal == true) {
        this.openModal = false;
      } else {
        this.newCmpt('new')
      }
    }
    if (event.key === 'F4') {
      if (this.inventoryNewReqModal == true) {
        this.inventoryNewReqModal = false;
      } else {
        this.inventoryNewReqModal = true;
      }
    }

    if (event.key === 'F7') {
      this.procurementRecommendations('minimumStock');
    }
    if (event.key === 'F8') {
      if (this.itemsMovementModal == true) {
        this.itemsMovementModal = false;
      } else {
        this.itemsMovementModal = true;
      }
    }
    if (event.key === 'F9') {
      if (this.itemsMovementModal == true) {
        this.itemsMovementModal = false;
      } else {
        this.itemsMovementModal = true;
      }
    }

  }



  constructor(private formService:FormsService,private customerSrv: CostumersService, private supplierService: SuppliersService, private orderService: OrdersService, private modalService: NgbModal, private procuretServ: Procurementservice, private excelService: ExcelService, private route: ActivatedRoute, private inventoryService: InventoryService, private uploadService: UploadFileService,
    private authService: AuthService, private toastSrv: ToastrService, private batchService: BatchesService, private itemService: ItemsService,
    private fb: FormBuilder,) {
  }
  @Output() sendDataToExpectedArrivalsModal = new EventEmitter();
  @Input() expectedArrivalItemData: any;

  //expected Arrivals modal
  getNewExpectedArrivalsData(outputeEvent) {


    console.log('getting new updated expected arrivals data')
    console.log(outputeEvent)
    if (outputeEvent == 'closeModal') {
      this.openProcurementModal = false;
      this.resCmpt = {}

      //update expected arrivals info for item 
    } else if (outputeEvent == 'stockLineChanged') {
      console.log('this.resCmpt', this.resCmpt)
      this.inventoryService.getSingleComponentData(this.resCmpt._id).subscribe(res => {

        console.log('res[0]', res[0])
        // this.componentsUnFiltered.filter(c=>{
        //   if(c._id==res[0]._id){
        //     
        //     c.procurementArr= res[0].procurementArr;
        //   }  
        //  });
        this.components.forEach(c => {

          if (c._id == res[0]._id) {
            c.procurementArr = res[0].procurementArr;


          }
        });
        this.componentsUnFiltered.forEach(c => {

          if (c._id == res[0]._id) {
            c.procurementArr = res[0].procurementArr;
          }
        });
      });
    }
  }

  fillSupplierDetails() {
    if (this.resCmpt.suplierN != '') {
      this.supplierService.getSuppliersByNumber(this.resCmpt.suplierN).subscribe(data => {

        if (data) {
          this.resCmpt.suplierName = data[0].suplierName;
        }
      })

    }
  }



  addSupplierToMaterial() {

    this.resMaterial.alternativeSuppliers.push(this.supplier)
    this.toastSrv.success('ספק נוסף בהצלחה , לא לשכוח לעדכן מידע !')
    this.supplier = {
      supplierName: '',
      price: "",
      coin: "",
      coinLoading: "",
      priceLoading: "",
      manufacturer: "",
      alternativeMaterial: "",
      alterName: "",
      subGroup: "",
      packageWeight: "",
      expectedArrival:"",
      country:"",
    }
  }
  addSupplierToComponent() {

    this.resCmpt.alternativeSuppliers.push(this.supplier)
    this.toastSrv.success('ספק נוסף בהצלחה , לא לשכוח לעדכן מידע !')
    this.supplier = {
      supplierName: '',
      price: "",
      coin: "",
      coinLoading: "",
      priceLoading: "",
      manufacturer: "",
      alternativeMaterial: "",
      alterName: "",
      subGroup: "",
      packageWeight: "",
    }
  }
  // getProcurementData(){
  //   this.inventoryService.getProcurementData().subscribe(data=>{

  //   })
  // }

  updateExpectedProcurment(stockItem) {
    this.resCmpt = stockItem;
    this.openProcurementModal = true;
  }

  async ngOnInit() {

    this.getUser();
    this.getAllSuppliers();
    this.getAllCustomers();
    if(this.filterbyNum) this.filterbyNum.nativeElement.value = '';
   
    let url = this.route.snapshot;
    this.components = [];
    await this.getUserAllowedWH();
    this.getAllComponents();

    if (this.route.queryParams) {
      this.filterByComponentN(this.route.snapshot.queryParams.componentN)
    }
    this.getColor(new Date);
  
  
  }

  getAllPurchases(){

      this.procuretServ.getAllPurchases().subscribe(data=>{
        debugger;
        this.components.forEach(comp => {
      
        let allPurchases = data.filter(x=>x.item.filter(x=>x.itemNumber== comp.componentN).length>0)
        comp.purchaseOrders = allPurchases
        if(comp.purchaseOrders.length > 0){
          debugger;
        }
       });
      })
    
    
  }


  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe(data => {
      this.allSuppliers = data;
    })
  }

  getAllItemShell() {
    this.itemService.getAllItemShells().subscribe(data => {
      this.itemShell = data;
    })
  }

  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(this.itemShell, 'itemShell');
  }

  exportCurrTable() {

    this.loadingExcel = true;

    this.makeFileForExcelDownload().then((data: any[]) => {
      console.log(data)


      // var anyArr: any[]=data;
      switch (this.stockType) {
        case 'component':
          this.excelService.exportAsExcelFile(data, "component stock table");
          break;
        case 'product':
          this.excelService.exportAsExcelFile(data, "product stock table");
          break;
        case 'material':
          this.excelService.exportAsExcelFile(data, "material stock table");
          break;
        case 'sticker':
          this.excelService.exportAsExcelFile(data, "sticker stock table");
          break;
      }
      this.loadingExcel = false;
      // switch case;
    }).catch(errMsg => {
      this.toastSrv.error(errMsg);
    });

  }
  makeFileForExcelDownload() {

    var that = this;
    var arr: any[] = []
    return new Promise(function (resolve, reject) {
      var line = {}
      if (that.stockType == 'component') {

        for (let i = 0; i < that.components.length; i++) {

          line = {
            'מספר פריט': that.components[i].componentN,
            'מק"ט פריט אצל הספק': that.components[i].componentNs,
            'שם הפריט': that.components[i].componentName,
            'סוג פריט': that.components[i].componentType,
            'כמות': that.components[i].amount,
            'כמות מוקצת': that.components[i].alloAmount,

          }
          arr.push(line)
        }
        resolve(arr);
      } else if (that.stockType == 'product') {
        for (let i = 0; i < that.components.length; i++) {
          line = {
            'מספר פריט': that.components[i].componentN,
            'שם המוצר': that.components[i].componentName,
            'כמות Kasem': that.components[i].amountKasem,
            'כמות Rosh-HaAyin': that.components[i].amountRH,
          }
          arr.push(line)
        }
        resolve(arr);
      } else if (that.stockType == 'material') {
        for (let i = 0; i < that.components.length; i++) {
          for (let j = 0; j < that.components[i].alternativeSuppliers.length; j++) {
            line = {
              'מספר פריט': that.components[i].componentN,
              'שם החו"ג': that.components[i].componentName,
              'כמות ': that.components[i].amount,
              'מחיר ': that.components[i].alternativeSuppliers[j].price,
              'מחיר 2': that.components[i].price,

            }
            arr.push(line)
          }
        }
        resolve(arr);
      }
    });
  }

  updateSupplierDetails() {

  debugger;

    var obj = {
      id: this.resMaterial._id,
      supplierName: this.supplierName.nativeElement.value,
      price: this.price.nativeElement.value,
      coin: this.coin.nativeElement.value,
      // coinLoading: this.coinLoading.nativeElement.value,
      priceLoading: this.priceLoading.nativeElement.value,
      manufacturer: this.manufacturer.nativeElement.value,
      alternativeMaterial: this.alternativeMaterial.nativeElement.value,
      alterName: this.alterName.nativeElement.value,
      packageWeight: this.packageWeight.nativeElement.value,
      country:'',
      expectedArrival:''
    }
    if(this.resMaterial._id != undefined){
      obj.country = this.country.nativeElement.value;
      obj.expectedArrival = this.expectedArrival.nativeElement.value;
    }

    if (obj.id == undefined || obj.id == null || obj.id == '') {
      obj.id = this.resCmpt._id
    }
    this.inventoryService.updateSupplier(obj).subscribe(data => {

      if (data) {
        var updatedSupplier = data.alternativeSuppliers.find(s => s.supplierName == obj.supplierName);
        var supplier = this.resMaterial.alternativeSuppliers.find(s => s.supplierName == obj.supplierName);
        if (supplier == undefined || supplier == null) {
          var supplier = this.resCmpt.alternativeSuppliers.find(s => s.supplierName == obj.supplierName);
        }
        supplier.supplierName = updatedSupplier.supplierName
        supplier.price = updatedSupplier.price
        supplier.coin = updatedSupplier.coin
        // supplier.coinLoading = updatedSupplier.coinLoading
        supplier.priceLoading = updatedSupplier.priceLoading
        supplier.country = updatedSupplier.country
        supplier.expectedArrival = updatedSupplier.expectedArrival
        supplier.manufacturer = updatedSupplier.manufacturer
        supplier.alternativeMaterial = updatedSupplier.alternativeMaterial
        supplier.alterName = updatedSupplier.alterName
        supplier.packageWeight = updatedSupplier.packageWeight
        this.updateSupplier = false;
        this.editSuppliers('')
        this.toastSrv.success('ספק עודכן בהצלחה !')

      }

    })
  }


  getAllCustomers() {
    this.customerSrv.getAllCostumers().subscribe(data => {
      this.allCustomers = data;
    })
  }

  addCustomerToPayingList(ev) {

    if (confirm('האם להוסיף לקוח זה לרשית לקוחות משלמים ?')) {
      if (this.resCmpt.payingCustomersList == undefined) this.resCmpt.payingCustomersList = [];
      this.resCmpt.payingCustomersList.push(ev.target.value)
      this.toastSrv.success('לקוח נוסף בהצלחה , לא לשכוח לעדכן פריט !')
    } else {
      console.log('no');

    }


  }
  filterMaterials(ev) {

    var nameToSearch = ev.target.value;

    this.materialToSearch.nativeElement.value;

  }

  // devExcelExport(){

  //   this.inventoryService.getOldProcurementAmount().subscribe(data=>{
  //     this.excelService.exportAsExcelFile(data, "oldProcurementAmounts");
  //       });
  // }
  // ExportAllCmpts() {
  //   this.inventoryService.getAllComponentsByType('component').subscribe(data=>{
  //     
  //     this.excelService.exportAsExcelFile(data.items, "stock components");
  //       });
  //  }
  // ExportKasemAllCmptsOnShelfs() {
  //   this.inventoryService.getKasemAllCmptsOnShelfs().subscribe(data=>{
  //     this.excelService.exportAsExcelFile(data, "kasemItemsOnShelfs");
  //       });
  //  }
  //   exportAsXLSX(data, title) {
  //     this.excelService.exportAsExcelFile(data, title);
  //  }
  // getDoubleItemShelfs(){
  //   this.inventoryService.getDoubleItemShelfs().subscribe(res=>{
  //     this.exportAsXLSX(res, "DoubleItemShelfs");
  //   })}
  // getDoubleStockItems(){
  //   this.inventoryService.getDoubleStockItems().subscribe(res=>{
  //     this.exportAsXLSX(res, "DoubleStockItems");

  //   })}
  //   deleteDoubleStockItemsProducts(){
  //     this.inventoryService.deleteDoubleStockItemsProducts().subscribe(res=>{
  //       console.log(res);
  //   })}

  //************************************************/

  getUserAllowedWH() {
    this.inventoryService.getWhareHousesList().subscribe(res => {
      if (res) {
        let displayAllowedWH = [];
        for (const wh of res) {
          if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
            displayAllowedWH.push(wh);
          }
        }
        if (this.authService.loggedInUser.authorization) {
          if (this.authService.loggedInUser.authorization.includes("updateStockItem")) {
            this.updateStockItem = true;
          }
          if (this.authService.loggedInUser.authorization.includes("stockAdmin")) {
            this.stockAdmin = true;
          }
        }

        this.whareHouses = displayAllowedWH;
        this.curentWhareHouseId = displayAllowedWH[0]._id;
        this.curentWhareHouseName = displayAllowedWH[0].name;
        if (this.curentWhareHouseName.includes('product')) {
          // this.setType("product");
          this.stockType = "product";
        } else {
          this.stockType = "component";
        }

        // this.getAllComponentsByType();

      }
      console.log(res);

    });
  }
  // printInventoryValue, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

  open(modal) {
    if (Object.keys(modal._def.references)[0] = 'printInventoryValue') {
      this.getTotalComponentsValue();
    }
    this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  getAllPurchaseOrders() {
    return new Promise((resolve, reject) => {
      this.procuretServ.getAllComponentsPurchase().subscribe(data => {
        this.allComponentsPurchases = data;
        resolve('');
      })
    });


  }
  getAllPurchaseOrdersMaterial() {

    this.procuretServ.getAllMaterialsPurchase().subscribe(data => {
      this.allMaterialsPurchases = data;
    })
  }

  purchaseRecommend(component) {
    this.currItem = component;
    this.componentSuppliers = component.alternativeSuppliers
    this.recommandPurchase.componentName = this.currItem.componentName
    if (component.itemType == 'material') {
      this.recommandPurchase.type = 'material'
    }
    if (component.itemType == 'component') {
      this.recommandPurchase.type = 'component'
    }
    this.recommandPurchase.componentNumber = component.componentN
    this.openOrderRecommendModal = true;
  }

  sendRecommandation() {
      debugger;
    if(this.recommandPurchase.amount == '' || this.recommandPurchase.date == '') {
      this.toastSrv.error('חובה למלא כמות ותאריך')
    } else {
      this.recommandPurchase.user = this.authService.loggedInUser.userName;
      this.inventoryService.addNewRecommendation(this.recommandPurchase).subscribe(data => {
      // this.inventoryService.onNewRecommend(this.recommandPurchase);
        if (data) {
          data = JSON.parse(data._body)
          this.toastSrv.success("המלצת רכש נשלחה בהצלחה !")
          this.openOrderRecommendModal = false;
          this.recommandPurchase.remarks = ""
          this.recommandPurchase.amount = ""
          this.recommandPurchase.componentNumber = ""
          this.recommandPurchase.supplier = ""
  
        }
      })
    }
  
  }


  createMixedMaterial() {
    this.mixMaterial;
    let obj = {
      materialName: this.mixMaterial,
      materialPercentage: this.mixMaterialPercentage
    }
    if (this.mixMaterial == "" || this.mixMaterialPercentage == "") {
      this.toastSrv.error("אנא תמלא את השם והאחוזים בכדי להוסיף")
    } else {
      this.resMaterial.mixedMaterial.push(obj);
      this.mixMaterial = "";
      this.mixMaterialPercentage = "";
      this.toastSrv.success("חומר גלם נוסף בהצלחה!")
    }



  }


  calculateMaterialArrival() {
    for (let i = 0; i < this.allMaterialArrivals.length; i++) {
      for (let j = 0; j < this.componentsUnFiltered.length; j++) {
        if (this.allMaterialArrivals[i].internalNumber == this.componentsUnFiltered[j].componentN) {
          this.componentsUnFiltered[j].measureType = this.allMaterialArrivals[i].mesureType;

          if (this.componentsUnFiltered[j].totalQnt) {
            this.componentsUnFiltered[j].totalQnt = Number(this.componentsUnFiltered[j].totalQnt) + this.allMaterialArrivals[i].totalQnt
            if (this.route.snapshot.queryParams.componentN) {
              this.filterByComponentN(this.route.snapshot.queryParams.componentN)
            }

          } else {
            this.componentsUnFiltered[j].totalQnt = this.allMaterialArrivals[i].totalQnt;
            if (this.route.snapshot.queryParams.componentN) {
              this.filterByComponentN(this.route.snapshot.queryParams.componentN)
            }
          }
        }
      }
    }
  }


  getAllComponents() {

      // this.startDownloadingInventory();
  
  }

  startDownloadingInventory() {
    debugger;
    this.inventoryService.startNewItemObservable().subscribe((components) => {
      debugger;
      components.forEach(comp => {
        if(comp.alternativeSuppliers) {
          comp.alternativeSuppliers.forEach(supplier => {
            if(supplier.country == undefined){
              supplier.country = ''
            }
            if(supplier.expectedArrival == undefined){
              supplier.expectedArrival = ''
            }
          });
        }
      });

      if(components.length < 1500) {
        this.smallLoader = false;
        // this.getAllPurchases();
      }
      if (components.length > 0) {
        this.showLoader = false;
        this.components= this.components.concat([...components]);
        if (!this.componentsUnFiltered) {
          this.componentsUnFiltered = [];
        }
        this.componentsUnFiltered= this.componentsUnFiltered.concat([...components]);
        // this.calculateMaterialArrival();
        this.getAmountsFromShelfs();
      }
    });
  }
  getAmountsFromShelfs() {

    debugger;
    var self = this;

      self.inventoryService.getComponentsAmounts().subscribe(res => {
        self.componentsAmount = res;
        // console.log(res);
        self.components.forEach(cmpt => {
          //  adding amounts to all components
          let result = self.componentsAmount.find(elem => elem._id == cmpt.componentN)
          if (result != undefined) {
            cmpt.amount = result.total;
          }
          if (cmpt.actualMlCapacity == 'undefined') cmpt.actualMlCapacity = 0;

        })

      });

  }



  getAllExpectedArrivalsData() {
    this.procuretServ.getAllExpectedArrivals().subscribe(res => {

      this.itemExpectedArrivals = res;

    });
  }

  calcIfLowThenMin(component) {
    if (component.minimumStock && component.alloAmount) {
      if ((component.amount - component.alloAmount) > component.minimumStock) {
        return "manyleft";
      }
      else {
        return "notmanyleft";
      }
    }
    return "";
  }

  dangerColor(threatment) {
    console.log("threatment:"+threatment);
    if (threatment == 'flammableLiquid' || threatment == 'flammableSolid' || threatment == 'flammable') {
      return "flame";
    }
    else if (threatment == 'acid') {
      return "acid";
    }
    else if (threatment == ' oxidizer') {
      return 'oxidizer'
    }
    else if (threatment == 'toxic') {
      return "toxic"
    } 
    else if (threatment == 'base'){
      return 'base'
    }
  


  }

  createNewQAPallet(){
  debugger;
 
  this.formService.createNewQaPallet(this.newQApallet).subscribe(data=>{

  })
  }

  getAllCmptTypesAndCategories() {
    this.cmptTypeList = [];
    this.cmptCategoryList = [];
    this.components.forEach(cmpt => {
      if (cmpt.componentType != "" && cmpt.componentType != null && cmpt.componentType != undefined) {
        if (!this.cmptTypeList.includes(cmpt.componentType)) {
          return this.cmptTypeList.push(cmpt.componentType);
        }
      }
      if (cmpt.componentCategory != "" && cmpt.componentCategory != null && cmpt.componentCategory != undefined) {
        if (!this.cmptCategoryList.includes(cmpt.componentCategory)) {
          return this.cmptCategoryList.push(cmpt.componentCategory);
        }
      }
    });
    this.cmptCategoryList.sort();
    console.log(this.cmptCategoryList)
  }


  loadComponentItems() {

    // this.resCmpt.componentType=  this.stockType;
    if (this.resCmpt.itemType != '') {
      this.inventoryService.getItemsByCmpt(this.resCmpt.componentN, this.resCmpt.itemType).subscribe(res => {
        if (res.length > 0) {

          this.resCmpt.componentItems = res;
        } else
          this.resCmpt.componentItems = []

      });
    } else {
      this.toastSrv.error('Item type error \nPlease refresh screen.');
    }
  }

  loadMaterialItems() {

    this.inventoryService.updateMaterial(this.resMaterial).subscribe(data => {
      this.components.map(doc => {

        if (doc.id == this.resMaterial._id) {
          doc = data;
        }
        else {
          this.toastSrv.error('Item type error \nPlease refresh screen.');
        }

      });
    });
  }

  async updateItemStockShelfChange(direction) {
    // this.newItemShelfPosition
    // this.newItemShelfQnt
    // this.destShelf
    this.destShelf = this.destShelf.toLocaleUpperCase();
    //destination shelf
    await this.inventoryService.checkIfShelfExist(this.destShelf, this.newItemShelfWH).subscribe(async shelfRes => {
      if (shelfRes.ShelfId) {
        this.destShelfId = shelfRes.ShelfId;
        this.destShelfQntBefore = 0;
        if (shelfRes.stock.length > 0) {
          shelfRes.stock.map(shl => {
            if (shl.item == this.resCmpt.componentN) {

              this.destShelfQntBefore = shl.amount;
            }
          });
        }

        this.updateItemStock(direction);
      } else {
        this.toastSrv.error("מדף יעד לא קיים")
      }

    });
    /* we need to send two objects with negitive and positive amounts
    both with dir="shelfchange",
   and make sure server side will deal with this dir and update movments
  
    */
  }


  dirSet(direction) {
    if (direction == "shelfChange") {
      this.amountChangeDir = 'shelfChange';
      this.sehlfChangeNavBtnColor = "#1affa3";
      this.amountChangeNavBtnColor = "";
      this.amountForPalletBtnColor = "";
    } 
    else if(direction == 'withdrawForPallet'){
      this.amountChangeDir = 'withdrawForPallet';
      this.sehlfChangeNavBtnColor = "";
      this.amountForPalletBtnColor = "#1affa3";
      this.amountChangeNavBtnColor = "";
    }
    else {
      this.amountChangeDir = '';
      this.sehlfChangeNavBtnColor = "";
      this.amountForPalletBtnColor = "";
      this.amountChangeNavBtnColor = "#1affa3";
    }
  }


  checkTwo() {

  }

  async updateItemStock(direction) {
  debugger;
    //check enough amount for "out"
    this.newItemShelfPosition = this.newItemShelfPosition.toUpperCase().trim();
    var shelfExsit = false;
    let itemShelfCurrAmounts = []
    await this.currItemShelfs.forEach(x => {
      if (x.position == this.newItemShelfPosition) {
        itemShelfCurrAmounts.push(x.amount);
        shelfExsit = true;
      };
    });
    await this.inventoryService.checkIfShelfExist(this.newItemShelfPosition, this.newItemShelfWH).subscribe(async shelfRes => {

      if (shelfRes.ShelfId) {
        if (shelfRes.stock.length > 0) {
          let temp = shelfRes.stock.map(shl => shl.item == this.resCmpt.componentN);
          this.originShelfQntBefore = temp[0].amount;

        }
        shelfExsit = true;

        if ((direction != "in" && itemShelfCurrAmounts.length > 0) || direction == "in") {
          let enoughAmount = (itemShelfCurrAmounts[0] >= this.newItemShelfQnt);
          if ((direction != "in" && enoughAmount) || direction == "in") {

            if (direction != "in") this.newItemShelfQnt *= (-1);

            if (this.newItemShelfWH != "") {
              let relatedOrderNum = this.relatedOrderNum.toUpperCase();
              let ObjToUpdate = [{
                amount: this.newItemShelfQnt,
                item: this.resCmpt.componentN,
                itemName: this.resCmpt.componentName,
                shell_id_in_whareHouse: shelfRes.ShelfId,
                position: this.newItemShelfPosition,
                arrivalDate: null, // only for "in"
                expirationDate: null, // for products stock
                productionDate: null, // for products stock
                barcode: "",
                itemType: this.stockType,
                // relatedOrderNum:itemLine.relatedOrder,
                // deliveryNoteNum:itemLine.deliveryNote,
                actionType: direction,
                WH_originId: this.curentWhareHouseId,
                WH_originName: this.curentWhareHouseName,
                shell_id_in_whareHouse_Dest: this.destShelfId,
                shell_position_in_whareHouse_Dest: this.destShelf,
                WH_destId: this.curentWhareHouseId,
                WH_destName: this.curentWhareHouseName,
                batchNumber: '',
                relatedOrderNum: relatedOrderNum,
                originShelfQntBefore: this.originShelfQntBefore,
                destShelfQntBefore: this.destShelfQntBefore,
                userName: this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName,
              }];

              if (direction == "in") {
                ObjToUpdate[0].arrivalDate = new Date()
              };
              if (direction != "in") {

                // ObjToUpdate[0].amount=ObjToUpdate[0].amount*(-1);
              };
              //  if(itemLine.reqNum) ObjToUpdate.inventoryReqNum=itemLine.reqNum;
              //  if(typeof(itemLine.arrivalDate)=='string') ObjToUpdate.arrivalDate=itemLine.arrivalDate;
              if (this.stockType == "product") {
                ObjToUpdate[0].batchNumber = this.newItemShelfBatchNumber;
                if (this.newItemShelfBatchNumber != "") {
                  let itemBatch = this.ItemBatchArr.filter(b => b.batchNumber == this.newItemShelfBatchNumber);
                  //fix date format 
                  let dateArr = itemBatch[0].expration.split('/');
                  let dateArrToJoin = [];
                  dateArrToJoin[0] = dateArr[2];
                  dateArrToJoin[1] = dateArr[1];
                  dateArrToJoin[2] = dateArr[0];
                  let dateToUpdate = dateArrToJoin.join('-');

                  let expDate = new Date(itemBatch[0].expration);
                  ObjToUpdate[0].expirationDate = expDate;
                } else {
                  ObjToUpdate[0].expirationDate = null;
                }

                //  ObjToUpdate.expirationDate=itemRes.expirationDate ;ObjToUpdate.productionDate=itemRes.productionDate
              };
              if (direction == "shelfChange") {
                ObjToUpdate[0].shell_id_in_whareHouse_Dest = this.destShelfId;
                ObjToUpdate[0].shell_position_in_whareHouse_Dest = this.destShelf;
              }


              //  READY!

              await this.inventoryService.updateInventoryChangesTest(ObjToUpdate, this.stockType).subscribe(res => {
                console.log('ObjToUpdate', ObjToUpdate);
                if (res == "all updated") {
                  this.toastSrv.success("Changes Saved");

                  this.inventoryService.getAmountOnShelfs(this.resCmpt.componentN).subscribe(async res => {

                    this.itemAmountsData = res.data;
                    this.itemAmountsWh = res.whList;

                  });

                  this.inventoryService.deleteZeroStockAmounts().subscribe(x => {
                    console.log(x.n + " items with amount=0 deleted");
                  });
                  let actionLogObj = {
                    dateAndTime: new Date(),
                    logs: ObjToUpdate,
                    userName: this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName,
                    movementType: ObjToUpdate[0].actionType,
                  }

                  this.inventoryService.addToWHActionLogs(actionLogObj).subscribe(res => {
                    this.toastSrv.success("פעולות מחסנאי נשמרו");
                  });
                  this.components.forEach(stkItem => { if (stkItem.componentN == ObjToUpdate[0].item) { stkItem.amount = stkItem.amount + ObjToUpdate[0].amount } });
                  this.newItemShelfQnt = null;
                  this.destShelf = "";
                  this.destShelfId = "";
                  this.newItemShelfPosition = '';
                  this.originShelfQntBefore = 0;
                  this.destShelfQntBefore = 0;
                } else {
                  this.toastSrv.error("Error - Changes not saved");
                }
              });
            } else {
              this.toastSrv.error("Choose warehouse");
            }
          } else {
            this.toastSrv.error("Not enough stock on shelf!\n Item Number " + this.resCmpt.componentN + "\n Amount on shelf: " + itemShelfCurrAmounts[0]);
          }
        } else {
          this.toastSrv.error("No Item Amounts On Shelf: " + this.newItemShelfPosition);
        }
      } else {
        this.toastSrv.error("No Such Shelf: " + this.newItemShelfPosition);
      }
    });

  }


  deleteSupplier(index, componentN) {
    ;
    if (confirm('האם למחוק ספק ?')) {
      var material = this.components.find(c => c.componentN == componentN);
      material.alternativeSuppliers.splice(index, 1);
      this.toastSrv.success('ספק הוסר בהצלחה , לא לשכוח לעדכן מידע !')
    }
  }



  filterByComponentN(componentN) {
    let comp = this.components.find(c=>c.componentN == componentN);
    if (this.componentsUnFiltered)

      this.stockType = comp.itemType
      this.components = this.componentsUnFiltered.filter(c => c.componentN == componentN);
  }



  getUserInfo() {
    debugger;
    this.authService.userEventEmitter.subscribe(user => {
      this.user = user.loggedInUser;
    })

    if (!this.authService.loggedInUser) {
      this.authService.userEventEmitter.subscribe(user => {
        if (user.userName) {
          this.user = user;
        }
      });
    }
    else {
      this.user = this.authService.loggedInUser;
    }
  }

  setType(type) {
    this.components = []
    switch (type) {
      case 'component':
        this.buttonColor = "#2962FF";
        this.buttonColor2 = "white";
        this.buttonColor3 = "white";
        this.fontColor = 'white'
        this.fontColor2 = 'black'
        this.fontColor3 = 'black'

        break;
      case 'material':
        this.buttonColor = "white";
        this.buttonColor2 = "#ffaf0e";
        this.buttonColor3 = "white";
        this.fontColor = 'black'
        this.fontColor2 = 'white'
        this.fontColor3 = 'black'

        break;
      case 'product':
        this.buttonColor = "white";
        this.buttonColor2 = "white";
        this.buttonColor3 = "#36bea6";
        this.fontColor = 'black'
        this.fontColor2 = 'black'
        this.fontColor3 = 'white'

        break;
   
    }
    if (this.stockType != type) {
      this.filterbyNum.nativeElement.value = "";
    }
    this.stockType = type;
    if (this.stockType == 'cartons') {
      this.components = this.componentsUnFiltered.filter(x => x.componentType == 'master_carton');
    } else if (this.stockType == 'sticker') {
      this.components = this.componentsUnFiltered.filter(x => x.componentType == 'sticker');
    } else {
      this.components = this.componentsUnFiltered.filter(x => x.itemType == type);
    }



  }

  searchBy(ev,type){

  debugger;

  let value;
  if(ev.target.value != '') value = ev.target.value;
  this.smallLoader = true;
    switch (type) {
      case 'number':
        this.inventoryService.getStockItemByNumber(value).subscribe(stockitem=>{
        if(stockitem){
          this.smallLoader = false
          this.components = stockitem.filter(s=>s.itemType == this.stockType)
          if(this.components.length > 0)
          {
            this.getAmountsFromShelfs();
          } else 
          {
            this.toastSrv.error('Item does not exist')
          }
         
        }
        })
        break;
      case 'name':
        this.inventoryService.getStockItemByName(value).subscribe(stockitem=>{
        if(stockitem){
          this.smallLoader = false
          this.components = stockitem.filter(s=>s.itemType == this.stockType)
          if(this.components.length > 0)
          {
            this.getAmountsFromShelfs();
          } else 
          {
            this.toastSrv.error('Item does not exist')
          }
        }
        })
        break;
      case 'type':
        this.inventoryService.getStockItemByType(value).subscribe(stockitem=>{
        if(stockitem){
          this.smallLoader = false
          this.components = stockitem.filter(s=>s.itemType == this.stockType)
          this.getAmountsFromShelfs();
        }
        })
        break;
      case 'category':
        this.inventoryService.getStockItemByCategory(value).subscribe(stockitem=>{
        if(stockitem){
          this.smallLoader = false
          this.components = stockitem.filter(s=>s.itemType == this.stockType)
          this.getAmountsFromShelfs();
        }
        })
        break;
    
      default:
        break;
    }
  }


  filterRows(event, filterType) {
  debugger;
    this.emptyFilterArr = true;
    this.components = this.componentsUnFiltered.filter(x => x.itemType == this.stockType);
    this.filterVal = '';
    this.filterVal = event.target.value;
    if (this.route.snapshot.queryParams.componentN) {
      this.filterVal = this.route.snapshot.queryParams.componentN
    }
    if (this.stockType != 'product') {
      if (this.filterByType != undefined) {
        if (this.filterByType.nativeElement.value != "" && this.filterByType.nativeElement.value != 'בחר סוג' ) {
          let CmptType = this.filterByType.nativeElement.value;
          this.components = this.components.filter(x => (x.componentType == CmptType));
          this.components
        }
      }
      if (this.filterByCategory != undefined) {
        if (this.filterByCategory.nativeElement.value != "" && this.filterByCategory != undefined) {
          let category = this.filterByCategory.nativeElement.value;
          this.components = this.components.filter(x => (x.componentCategory == category && x.itemType.includes(this.stockType)));

        }
      }
      if (this.filterBySupplierN != undefined) {
        if (this.filterBySupplierN.nativeElement.value != "" && this.filterBySupplierN != undefined) {
          let supplierN = this.filterBySupplierN.nativeElement.value;

          this.components = this.components.filter(x => (x.componentNs.includes(supplierN) && x.itemType.includes(this.stockType)));
        }
      }
      if (this.filterBySupplier != undefined) {
        if (this.filterBySupplier.nativeElement.value != "" && this.filterBySupplier != undefined) {
          let supplierName = this.filterBySupplier.nativeElement.value;

          this.components = this.components.filter(x => (x.suplierName.includes(supplierName) && x.itemType.includes(this.stockType)));
        }
      }
    }
    if (this.filterbyNum.nativeElement.value != "" && this.filterbyNum != undefined) {
      let itemNum = this.filterbyNum.nativeElement.value;
      this.components = this.components.filter(x => (x.componentN == itemNum && x.itemType == this.stockType));
    }

    if (this.filterByItem.nativeElement.value != '' && this.filterByItem != undefined) {

      let itemNumber = this.filterByItem.nativeElement.value;
      this.itemService.getItemData(itemNumber).subscribe(data => {
        this.components = this.components.filter(x => x.componentN == data[0].bottleNumber || x.componentN == data[0].sealNumber || x.componentN == data[0].tubeNumber || x.componentN == data[0].capNumber
          || x.componentN == data[0].boxNumber || x.componentN == data[0].stickerNumber)
      })
    }

    if (this.filterByCmptName.nativeElement.value != "") {
      let word = event.target.value;
      let wordsArr = word.split(" ");
      wordsArr = wordsArr.filter(x => x != "");
      if (wordsArr.length > 0) {
        let tempArr = [];
        this.components.filter(stk => {
          var check = false;
          var matchAllArr = 0;
          wordsArr.forEach(w => {
            if (stk.componentName.toLowerCase().includes(w.toLowerCase()) && stk.itemType == this.stockType) {
              matchAllArr++
            }
            if (stk.inciName && stk.inciName.toLowerCase().includes(w.toLowerCase()) && stk.itemType == this.stockType) {
              matchAllArr++
            }
            (matchAllArr == wordsArr.length) ? check = true : check = false;
          });

          if (!tempArr.includes(stk) && check) tempArr.push(stk);
        });
        this.components = tempArr;

      }
    }

    if (this.components.length == 0) {
      this.emptyFilterArr = false;
      this.components = this.componentsUnFiltered.filter(x => x.itemType == this.stockType);
    }

  }







  searchItemShelfs() {
    debugger;
    if (this.newItemShelfWH != '') {
      this.inventoryService.getShelfListForItemInWhareHouse(this.resCmpt.componentN, this.newItemShelfWH).subscribe(async res => {
        if (res.length > 0) {
          this.currItemShelfs = res;

        } else {
          this.currItemShelfs = [];
          this.currItemShelfs.push("NO SHELFS WITH ITEM # " + this.resCmpt.componentN);
        }
      });
    } else {
      this.toastSrv.error("Choose Wharhouse");
    }
  }


  loadShelfToInput(position, ev) {
    if (!position.includes("NO SHELFS")) {
      this.newItemShelfPosition = position;
    }
  }


  async openData(cmptNumber) {


    this.sixMonth = 0;
    this.switchModalView(cmptNumber)
    this.showItemDetails = true;
    this.itemmoveBtnTitle = "Item movements";
    this.itemMovements = [];
    this.openModalHeader = "פריט במלאי  " + cmptNumber;
    this.openModal = true;
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber);
    this.loadComponentItems();
    debugger;
    if (this.resCmpt.jumpRemark == "" || this.resCmpt.jumpRemark == undefined) {
      console.log("ok")
    } else {
      alert("Jumping Remark: " + this.resCmpt.jumpRemark)
    }
  }

  async openImg(componentImg) {
    this.openImgModal = true;
    this.currModalImgSrc = componentImg;
  }
  async openAmountsData(cmptNumber, cmptId) {
    
    this.openModalHeader = "כמויות פריט במלאי  " + cmptNumber;
    this.openAmountsModal = true;
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber);
    this.itemIdForAllocation = cmptId;
    //get product (and TBD materials) batchs for select
    //??? this.resCmpt has mkp category
    if (this.stockType != "components") {
      await this.batchService.getBatchesByItemNumber(cmptNumber + "").subscribe(data => {

        this.ItemBatchArr = data;

      });
    }
  }

  showBatchExpDate(ev) {

    var batch = ev.target.value;
    if (batch != "") {
      for (let i = 0; i < this.ItemBatchArr.length; i++) {
        if (this.ItemBatchArr[i].batchNumber == batch) {
          this.expirationBatchDate = this.ItemBatchArr[i].expration
        }
      }
    }
    else {
      this.expirationBatchDate = ""
    }

  }

  addComposition() {


    var obj = {
      compName: this.compositionName,
      compPercentage: this.compositionPercentage,
    }

    this.resMaterial.composition.push(obj)

  }

  moveToSuppliers(supplierName) {



    window.open('http://peerpharmsystem.com/#/peerpharm/inventory/suppliers?supplierName=' + supplierName)


  }

  async openDataMaterial(materNum) {


    this.materialArrivals = []

    this.materialArrivals = []
    this.inventoryService.getMaterialArrivalByNumber(materNum).subscribe(data => {
      if (data) {
        this.materialArrivals = []
        var dateFrom = new Date('01/01/2019')
        var dateTo = new Date('01/01/2020')
        var totalQnt = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].arrivalDate >= dateFrom.toISOString() && data[i].arrivalDate <= dateTo.toISOString()) {
            totalQnt += data[i].totalQnt
          }

        }
        if (totalQnt + data[0].mesureType != null || totalQnt + data[0].mesureType != undefined) {
          this.totalQuantity = totalQnt + data[0].mesureType
        }
        this.materialArrivals = data;
      }

    })

    this.showItemDetails = true;
    this.itemmoveBtnTitle = "Item movements";
    this.itemMovements = [];
    this.openModalHeader = "פריט במלאי  " + materNum;
    this.openModal = true;
    this.resMaterial = this.components.find(mat => mat.componentN == materNum);

    this.linkDownload = "http://peerpharmsystem.com/material/getpdf?_id=" + this.resMaterial._id;
    this.loadComponentItems();
  }

  async openAllocatedOrders(componentN) {


    this.openModalHeader = "הקצאות מלאי"
    this.openOrderAmountsModal = true;
    this.inventoryService.getAllocatedOrdersByNumber(componentN).subscribe(data => {

      this.allocatedOrders = data[0].allAllocatedOrders
    });



  }
  async openAllocatedProducts(componentN) {


    this.openModalHeader = "הקצאות מלאי"
    this.openProductAmountModal = true;
    this.inventoryService.getAllocatedOrdersByNumber(componentN).subscribe(data => {

      this.allocatedProducts = data[0].productAllocation
    });



  }

  searchProduct() {
    if (this.productToFind != "") {
      // check the stock item is really new
      this.inventoryService.getCmptByNumber(this.productToFind, 'product').subscribe(res => {
        if (res.length == 0) {
          // get item data from item tree
          this.itemService.getItemData(this.productToFind).subscribe(data => {


            this.resCmpt = {
              actualMlCapacity: 0,
              componentCategory: "",
              componentN: data[0].itemNumber,
              componentName: data[0].name + " " + data[0].subName + " " + data[0].discriptionK,
              componentNs: "",
              componentType: data[0].itemType,
              img: data[0].imgMain1,
              importFrom: "",
              itemType: "product",
              lastModified: "",
              minimumStock: "",
              needPrint: "",
              packageType: "",
              packageWeight: "",
              remarks: "",
              suplierN: "",
              suplierName: "",
            };


          });
        } else {
          this.toastSrv.error("Stock Item alredy exist");
        }
      });

    } else {
      this.toastSrv.error("Please enter product number");
      this.resetResCmptData();
    }


  }

  getColor(date) {

    switch (date) {
      case "date < new Date()":
        return "red";
      case "date > new Date()":
        return "black"
    }
  }


  checkIfItemExist(ev) {

    var itemNumber = ev.target.value;
    if (itemNumber != '') {
      this.inventoryService.getCmptByitemNumber(itemNumber).subscribe(data => {
        if (data.length > 0) {
          this.toastSrv.error('שים לב ! מספר זה קיים במערכת')
        } else {
          console.log('ok')
        }
      })
    }
  }


  closeAmountsData() {
    this.openAmountsModal = false;
    this.itemAmountsData = [];
    this.newItemShelfPosition = '';
    this.newItemShelfQnt = null;
    this.destShelf = '';
  }

  newCmpt(newItem) {


    this.newItem = newItem;
    this.resCmpt = {
      componentN: '',
      componentName: '',
      componentNs: '',
      suplierN: '',
      suplierName: '',
      componentType: '',
      componentCategory: '',
      img: '',
      importFrom: '',
      lastModified: '',
      minimumStock: '',
      needPrint: '',
      packageType: '',
      packageWeight: '',
      remarks: '',
      itemType: '',
      actualMlCapacity: 0,
    }

    this.openModalHeader = "יצירת פריט חדש";
    this.openModal = true;
  }

  writeNewComponent() {

    if (this.resCmpt.componentN != "") {
      this.resCmpt.itemType = this.stockType;
      console.log(this.resCmpt);
      this.inventoryService.addNewCmpt(this.resCmpt).subscribe(res => {
        console.log("res from front: " + res)
        if (res == "itemExist") {
          this.toastSrv.error('פריט קיים במלאי')
        } else if (res.componentN) {
          this.toastSrv.success("New stock item created");
          this.componentsUnFiltered.push(res);
          this.components.push(res);

          // this.getAllComponents();
          this.resetResCmptData();
          this.filterbyNum.nativeElement.value = '';


        }
        this.newItem = '';

      });

    } else {
      this.toastSrv.error("Can't create new stock item without number")
    }
  }

  writeNewMaterial() {

    //this.stockType = "material"/"component"/"product"
    this.resMaterial.itemType = "material"
    if (this.resMaterial.componentN != "") {


      this.inventoryService.addNewMaterial(this.resMaterial).subscribe(res => {


        if (res == "פריט קיים במערכת !") {
          this.toastSrv.error("פריט קיים במערכת !")
        } else {

          this.toastSrv.success("New material item created");
          this.components.push(res);

        }

      });

    }

  }

  checkIfExist(ev) {

    if (ev.target.value != "") {
      this.inventoryService.getMaterialtByNumber(ev.target.value).subscribe(data => {
        if (data.length > 0) {
          this.toastSrv.error("שים לב , הפריט כבר קיים במערכת !")
        } else {

        }
      })
    }
  }

  clearSearchFields() {

    this.filterbyNum.nativeElement.value = ''
    this.filterByCategory.nativeElement.value = ''
    this.filterByCmptName.nativeElement.value = ''
    this.filterByType.nativeElement.value = ''
    this.filterBySupplierN.nativeElement.value = ''
    this.filterByItem.nativeElement.value = ''

  }

  clearFields() {

    this.resMaterial = {

      componentN: "",
      componentName: "",
      remarks: "",
      img: "",
      minimumStock: "",
      packageWeight: "",
      itemType: "",
      barcode: "",
      actualMlCapacity: "",
      unitOfMeasure: "",
      group: "",
      subGroup2: "",
      alternativeSuppliers: [],
      status: "",
      threatment: "",
      monthTillExp: "",
      monthAvgPcs: "",
      msds: "",
      coaMaster: "",
      function: '',
      measurement: "",
      notInStock: false,
      inciName: "",
      casNumber: "",
      composition: [],
      umNumber: "",
      imerCode: "",
      imerTreatment: "",
      allowQtyInStock: "",
      expiredQty: "",
      permissionDangerMaterials: "",
      storageTemp: "",
      storageDirections: "",
      frameQuantity: "",
      frameSupplier: "",
      location: "",
      quantityInStock: "",
      mixedMaterial: [],
      formuleRemarks: ''


    }

    this.supplier = {
      supplierName: '',
      price: "",
      coin: "",
      coinLoading: "",
      priceLoading: "",
      manufacturer: "",
      alternativeMaterial: "",
      alterName: "",
      subGroup: "",
      packageWeight: "",
    }
  }
  onSelectMsds(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed

        this.resMaterial.msds = event.target["result"]
        this.resMaterial.msds = this.resMaterial.msds.replace("data:application/pdf;base64,", "");
      }
    }
  }

  onSelectCoaMaster(event) {

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed

        this.resMaterial.coaMaster = event.target["result"]
        this.resMaterial.coaMaster = this.resMaterial.coaMaster.replace("data:application/pdf;base64,", "");
      }
    }
  }


  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.resMaterial.img = event.target["result"]
      }
    }
  }


  editSuppliers(supplierName) {

    if (supplierName != '') {
      this.EditRowId = supplierName
      this.updateSupplier = true;
    } else {
      this.EditRowId = ''
      this.updateSupplier = false;
    }
  }


  editStockItemDetails() {

    this.resCmpt;
    if (confirm("לעדכן פריט?")) {

      this.inventoryService.updateCompt(this.resCmpt).subscribe(res => {
        if (res._id) {
          this.getAllMaterialLocations()
          this.toastSrv.success("פריט עודכן בהצלחה");
        } else {
          this.toastSrv.error("עדכון פריט נכשל");
        }
      });
    }

  }


  editMaterialItemDetails() {

    this.resMaterial;


    if (confirm("לעדכן פריט?")) {

      this.inventoryService.updateMaterial(this.resMaterial).subscribe(res => {
        if(res.msg == 'noUpdate'){
          this.toastSrv.error('עדכון פריט נכשל')
        } else {
          if (res._id) {
            this.toastSrv.success("פריט עודכן בהצלחה");
          } else {
            this.toastSrv.error("עדכון פריט נכשל");
          }
        }
      });
    }

  }

  deleteComponent(id){
    this.inventoryService.deleteComponentById(id).subscribe(data=>{
    if(data.msg == 'deleted'){
      this.toastSrv.success('Component Deleted !')
     this.components= this.components.filter(c=>c._id != id)
    }
    })
  }

  async getUser() {
    debugger;

    if(this.authService.loggedInUser.userName == 'SHARK' || this.authService.loggedInUser.userName == 'sima' || this.authService.loggedInUser.userName == 'martha'){
      this.showDeleteBtn = true
    }
    await this.authService.userEventEmitter.subscribe(user => {
      this.user = user;
      // this.user=user.loggedInUser;
      // if (!this.authService.loggedInUser) {
      //   this.authService.userEventEmitter.subscribe(user => {
      //     if (user.userName) {
      //       this.user = user;

      //     }
      //   });
      // }
      // else {
      //   this.user = this.authService.loggedInUser;
      // }
      if (this.user.authorization) {
        if (this.authService.loggedInUser.authorization.includes("updateStock")) {
          this.allowUserEditItem = true;
        }
      }

    });

  }


  resetResCmptData() {

    this.resCmpt = {
      whoPays: '',
      payingCustomersList: [],
      componentN: '',
      componentName: '',
      componentNs: '',
      suplierN: '',
      suplierName: '',
      componentType: '',
      componentCategory: '',
      img: '',
      importFrom: '',
      lastModified: '',
      minimumStock: '',
      needPrint: '',
      packageType: '',
      packageWeight: '',
      remarks: '',
      componentItems: [],
      input_actualMlCapacity: 0,
    }

  }

  uploadMsds(fileInputEvent) {

    let file = fileInputEvent.target.files[0];
    console.log(file);

    this.uploadService.uploadFileToS3Storage(file).subscribe(data => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.resCmpt.msds = data.partialText;
        console.log(" this.resCmpt.img " + this.resCmpt.img);
      }

    })
  }

  uploadCoaMaster(fileInputEvent) {

    let file = fileInputEvent.target.files[0];
    console.log(file);

    this.uploadService.uploadFileToS3Storage(file).subscribe(data => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.resCmpt.coaMaster = data.partialText;
        console.log(" this.resCmpt.img " + this.resCmpt.img);
      }

    })
  }


  uploadImg(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    console.log(file);

    this.uploadService.uploadFileToS3Storage(file).subscribe(data => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.resCmpt.img = data.partialText;
        console.log(" this.resCmpt.img " + this.resCmpt.img);
      }

    })
  }
  async getCmptAmounts(cmptN, cmptId) {
    debugger;
    // this.currItemShelfs=[];
    this.newItemShelfPosition = '';
    this.newItemShelfQnt = 0;
    this.destShelf = '';
    await this.inventoryService.getAmountOnShelfs(cmptN).subscribe(async res => {


      this.itemAmountsData = res.data;
      this.itemAmountsWh = res.whList;
      this.currItemShelfs = [];
      this.newItemShelfWH = "";



      await this.openAmountsData(cmptN, cmptId);

    });

    ;
  }
  getAllOrderItems(componentN) {

    this.orderService.getOrderItemsByNumber(componentN).subscribe(data => {

      this.orderItems = data;
    })
  }

  // getAllItems() { 
  //   
  //   this.itemService.getAllItemsTwo().subscribe(data=>{
  //     
  //     this.items = data;
  //   })
  // }





  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  inputProcurment(event: any) { // without type info
    this.procurementInputEvent = event;
    this.procurmentQnt = event.target.value;
    ;
  }


  getAllMaterialLocations() {
    this.inventoryService.getAllMaterialLocations().subscribe(data => {
      this.materialLocations = data;
    })
  }


  updateProcurment(componentId, componentNum, status) {

    if (status == "false") {
      this.procurmentQnt = null;
    }
    let objToUpdate = {
      _id: componentId,
      componentN: componentNum,
      procurementSent: status,//האם בוצעה הזמנת רכש
      procurementAmount: this.procurmentQnt,//כמות בהזמנת רכש
    }
    this.inventoryService.updateComptProcurement(objToUpdate).subscribe(res => {
      if (res.ok != 0 && res.n != 0) {
        console.log("res updateComptProcurement: " + res);
        this.components.map(item => {
          if (item._id == componentId) {
            item.procurementAmount = objToUpdate.procurementAmount;
            if (this.procurmentQnt == null) {
              item.procurementSent = false;
            } else {
              this.procurementInputEvent.target.value = '';
              item.procurementSent = true;
            }
          }
        });
      }
    });
  }

  addItemStockAllocation(componentNum) {
    if (this.newAllocationOrderNum != null && this.newAllocationAmount != null) {
      let objToUpdate = {
        _id: this.itemIdForAllocation,
        componentN: componentNum,
        allocations: [{
          relatedOrderN: this.newAllocationOrderNum,
          amount: this.newAllocationAmount,
          supplied: 0
        }
        ],
      }
      this.inventoryService.updateComptAllocations(objToUpdate).subscribe(res => {
        if (res.ok != 0 && res.n != 0) {
          ;
          console.log("res updateComptAllocations: " + res);
          this.resCmpt.allocations.push(objToUpdate.allocations[0]);
          this.resCmpt.allocAmount += objToUpdate.allocations[0].amount;
        }
      });
    }
    this.newAllocationOrderNum = null;
    this.newAllocationAmount = null;
    ;
  }
  edit(index) {
    this.EditRowId = index;
  }
  saveAllocEdit(cmptId, rowIndex) {
    //not in use now
    ;
    // "suppliedAlloc": this.suppliedAlloc.nativeElement.value,

  }
  editItemStockAllocationSupplied(cmptId, rowIndex) {
    ;
    let oldAllocationsArr = this.resCmpt.allocations;
    let newSupplied = this.suppliedAlloc.nativeElement.value;
    oldAllocationsArr[this.EditRowId].supplied = newSupplied;
    let newAllocationsArr = oldAllocationsArr;
    let objToUpdate = {
      _id: this.itemIdForAllocation,
      allocations: newAllocationsArr,
    }
      ;
    this.inventoryService.updateCompt(objToUpdate).subscribe(res => {
      if (res._id) {
        console.log("res updateCompt: " + res);
        this.EditRowId = '';
        this.resCmpt.allocations = newAllocationsArr;
        let itemAllocSum = 0;
        this.resCmpt.allocations.forEach(alloc => {
          itemAllocSum = itemAllocSum + alloc.amount;
          itemAllocSum = itemAllocSum - alloc.supplied;

        });
        this.resCmpt.allocAmount = itemAllocSum;

      }
    });
  }

  deleteStockItemValidation(stockItemNumber) {
    let ItemToDelete = this.components.filter(i => i.componentN == stockItemNumber && i.itemType == this.stockType).slice()[0];
    if (confirm("האם אתה רוצה למחוק את פריט ?\n מספר פריט: " + ItemToDelete.componentN + "\n שם פריט: " + ItemToDelete.componentName)) {
      if (this.stockType == 'component') {
        this.inventoryService.getItemsByCmpt(ItemToDelete.componentN, ItemToDelete.componentType).subscribe(resp => {
          if (resp.length > 0) {
            alert("יש מוצרים מקושרים לפריט - לא ניתן למחוק");
          } else {
            this.deleteStockItem(ItemToDelete);
          }
        });
      } else if (this.stockType == 'product') {
        this.deleteStockItem(ItemToDelete);

      } else if (this.stockType == 'material') {

      }
    }
  }
  deleteStockItem(ItemToDelete) {
    this.inventoryService.deleteStockItemAndItemShelfs(ItemToDelete.componentN, ItemToDelete.itemType).subscribe(res => {
      if (res.componentN) {
        this.toastSrv.success("item deleted!\n" + res.componentN);
        this.componentsUnFiltered.filter((c, key) => {
          if (c.componentN == res.componentN && c.itemType == res.itemType) {
            this.componentsUnFiltered.splice(key, 1);//remove from array

            if (this.components.length > 1) {

              this.components.filter((c, key) => {
                if (c.componentN == res.componentN && c.itemType == res.itemType) {
                  this.components.splice(key, 1);//remove from array
                }
              });
            } else {
              this.setType(this.stockType);
            }
          }
        });
      }
    });
  }

  deleteItemStockAllocation(cmptId, rowIndex) {

    if (confirm("מחיקת הקצאה")) {
      let amountDeleted = this.resCmpt.allocations[rowIndex].amount;
      let newAllocationsArr = this.resCmpt.allocations.splice(rowIndex - 1, 1);
      let objToUpdate = {
        _id: this.itemIdForAllocation,
        allocations: newAllocationsArr,
      }
      this.inventoryService.updateCompt(objToUpdate).subscribe(res => {
        console.log("res updateCompt: " + res);
        if (res._id) {
          this.resCmpt.allocAmount -= amountDeleted;
        }
      });
    }
  }

  procurementRecommendations(filterType) {

    this.components = this.componentsUnFiltered;
    if (filterType == "minimumStock") {
      if (this.stockType != "product") {
        let recommendList = this.components.filter(cmpt => cmpt.minimumStock >= cmpt.amount);
        this.components = recommendList;
      }
    } else if (filterType == "haveRecommendation") {
      if (this.stockType != "product") {
        let recommendList = this.components.filter(cmpt => cmpt.purchaseRecommendations.length > 0);
        this.components = recommendList;
      }
    }
  }

  filterMaterialsTable() {

    this.components = this.componentsUnFiltered;
    let type = this.materialFilterType;
    let value = this.materialFilterValue;
    if (type == 'location') {
      let filteredArray = this.components.filter(m => m.location == value);
      this.components = filteredArray;
    }
    if (type == 'permissionDangerMaterials') {
      let filteredArray = this.components.filter(m => m.permissionDangerMaterials == 'true');
      this.components = filteredArray;
    }
    if (type == 'threatment') {
      let filteredArray = this.components.filter(m => m.threatment == value);
      this.components = filteredArray;
    }
    if (type == 'function') {

      let filteredArray = this.components.filter(m => m.function && m.function.includes(value))
      this.components = filteredArray;
    }
    if (type == 'stateOfMatter') {
      let filteredArray = this.components.filter(m => m.stateOfMatter == value);
      this.components = filteredArray;
    }
    if (type == "") {
      this.components = this.componentsUnFiltered.filter(x => x.itemType == 'material');
    }


  }

  getTotalComponentsValue() {
    for (let component of this.components) {
      if (component.itemType == 'component') {
        for (let i=0; i<3; i++) {
          if(component.alternativeSuppliers[i] && component.alternativeSuppliers[i].price) {
            if(component.alternativeSuppliers[i].price != "") {
              this.totalComponentsValue +=  parseInt(component.alternativeSuppliers[i].price)*parseInt(component.amount);
            }
            break;
          } 
        }
      }
    }
  }


  upload(src) {

    // const number = this.route.snapshot.paramMap.get('itemNumber');
    // this.progress.percentage = 0;
    // this.currentFileUpload = this.selectedFiles.item(0);
    // this.uploadService.pushFileToStorage(this.currentFileUpload, src, number).subscribe(event => {
    //   console.log(event);

    //   if (event.type === HttpEventType.UploadProgress) {
    //     this.progress.percentage = Math.round(100 * event.loaded / event.total);
    //   } else if (event instanceof HttpResponse) {
    //     console.log('File is completely uploaded!');
    //     console.log(event.body);
    //   }
    // });

    // this.selectedFiles = undefined;
  }


  deleteFromComposition(materialId, compositionName) {

    let material = this.components.find(m => m._id == materialId);
    for (let i = 0; i < material.composition.length; i++) {
      if (material.composition[i].compName == compositionName) {
        material.composition.splice(i, 1)
        this.toastSrv.success('Composition Deleted')
      }

    }
  }

  checkIfInciNameExist(ev) {


    let inciName = ev.target.value;
    if (inciName != '') {
      let material = this.components.filter(m => m.inciName == inciName);
      if (material.length > 0) {

        material.forEach(m => {
          this.toastSrv.error(m.componentN)
        });
        this.toastSrv.error('שים לב שם זה קיים בחומרי גלם :')
      }
    }

  }



  showDialog() {
  }

  switchModalView(componentN) {

    this.loadingMovements = true;

    if (componentN == '' || componentN == undefined) {
      componentN = this.resCmpt.componentN
    }
    this.inventoryService.getItemMovements(componentN).subscribe(data => {
      if (data) {

        //  for (let i = 0; i < data.length; i++) {
        //    if(data[i].movementType != 'in'){
        //     data[i].originShelfQntBefore = data[i].originShelfQntBefore + Math.abs(data[i].amount)
        //    }
        //  }
        data.forEach(component => {
          if (component.movementType) {
            component.originShelfQntBefore = component.originShelfQntBefore - Math.abs(component.amount)
          }
        });
        this.itemMovements = data;
        this.loadingMovements = false;
      }

    });

    if (!this.showItemDetails) {
      this.showItemDetails = true;
      this.itemmoveBtnTitle = "Item movements";

    }
    else {
      this.showItemDetails = false;
      this.itemmoveBtnTitle = "Back to item details";
      this.loadingMovements = false;
    }
  }

  // ********************ENLARGE TABLE IMAGE BY CLICK************


  // ************************************************************




}// END OF CMPT CLASS



