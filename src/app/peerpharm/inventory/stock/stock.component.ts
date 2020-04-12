import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input,ViewEncapsulation } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'
import { ActivatedRoute } from '@angular/router'
import { UploadFileService } from 'src/app/services/helpers/upload-file.service';
import { HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { DEC } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { toDate } from '@angular/common/src/i18n/format_date';
import { fstat } from 'fs';

import { BatchesService } from 'src/app/services/batches.service';
import { ItemsService } from 'src/app/services/items.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Console } from '@angular/core/src/console';
import { Procurementservice } from 'src/app/services/procurement.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from 'src/app/services/orders.service';
import { SuppliersService } from 'src/app/services/suppliers.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']

})
export class StockComponent implements OnInit {
  // resCmpt: any;
  itemmoveBtnTitle: string = "Item Movements";
  loadingMovements: boolean = false;
  showItemDetails: boolean = true;
  openOrderRecommendModal: boolean = false;
  itemMovements: any = [];
  materialPurchases: any[] = [];
  componentPurchases: any[] = [];
  itemShell:any[];
  componentsCopy:any[];
  subscription:any
  materialLocations: any[];
  items:any[];
  allComponentsPurchases:any[];
  allMaterialsPurchases:any[];
  expirationBatchDate:any;
  allowUserEditItem = false;
  check = false;
  resCmpt: any = {
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
    jumpRemark:'',
    componentItems: [],
    input_actualMlCapacity: 0,
    alternativeComponent:'',
    comaxName:'',
    alternativeSupplier:[],
    price:''

  }
  alternativeSupplier: any = {
    name:'',
    material:'',
    price:''
  }
  alterSuppliers: any[];
  buttonColor: string = 'white';
  buttonColor2: string = '#B8ECF1';
  buttonColor3: string = '#B8ECF1';
  buttonColor4: string = '#B8ECF1';
  openModal: boolean = false;
  openImgModal: boolean = false;
  openAmountsModal: boolean = false;
  openProcurementModal: boolean = false;
  openOrderAmountsModal: boolean = false;
  openProductAmountModal: boolean = false;
  procurementModalHeader: string;
  openModalHeader: string;
  components: any[];
  filteredComponents: any[];
  componentsUnFiltered: any[];
  componentsAmount: any[];
  tempHiddenImgSrc: any;
  procurmentQnt: Number;
  allocatedOrders:any[];
  allocatedProducts:any[];
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
  ordersAllocatedAmount:any[];
  newItemShelfQnt: number;
  newItemShelfBatchNumber: string = '';
  newItemShelfArrivalDate: number;
  newItemShelfPosition: String;
  newItemShelfWH: String;
  cmptTypeList: Array<any>;
  cmptCategoryList: Array<any>;
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
  amountChangeNavBtnColor: String = "#1affa3";
  ItemBatchArr: Array<any>;
  filterVal: String = '';
  currModalImgSrc: String = '';
  productToFind: String = '';
  materialToFind: String = "";
  productResponse: any = {};
  linkDownload:String = "";
  mixMaterial:String;
  mixMaterialPercentage:String;
  arrivalDateExpired = true;
  newItemProcurmentDetails: FormGroup;
  newOrderProcurmentDetails: FormGroup;
  newTransportDetails: FormGroup;
  transportationItem: FormGroup;
  loadingExcel: Boolean = false;
  allSuppliers:any[];

  @ViewChild('filterByType') filterByType: ElementRef;//this.filterByType.nativeElement.value
  @ViewChild('filterByCategory') filterByCategory: ElementRef;//this.filterByCategory.nativeElement.value
  @ViewChild('filterBySupplierN') filterBySupplierN: ElementRef; //this.filterBySupplierN.nativeElement.value
  @ViewChild('filterByCmptName') filterByCmptName: ElementRef; //this.filterByCmptName.nativeElement.value
  @ViewChild('filterbyNum') filterbyNum: ElementRef; //this.filterbyNum.nativeElement.value

  @ViewChild('suppliedAlloc') suppliedAlloc: ElementRef;
  @ViewChild('newProcurmentQnt') newProcurmentQnt: ElementRef;
  @ViewChild('newProcurmentOrderNum') newProcurmentOrderNum: ElementRef;
  @ViewChild('newProcurmentExceptedDate') newProcurmentExceptedDate: ElementRef;

  // material array // 
  materials: any[];

  recommandPurchase: any = {
    remarks:'',
    amount:'',
    componentNumber:'',
    requestNumber:'',
    date:this.formatDate(new Date()),
    user:'',
    type:''
  }

  supplier:any = {
    supplierName:'',
    price:"",
    coin:"",
    coinLoading:"",
    priceLoading:"",
    manufacturer:"",
    alternativeMaterial:"",
    alterName:"",
    subGroup: "",
    packageWeight:"",
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
    alternativeSuppliers:[],
    status: "",
    threatment: "",
    monthTillExp: "",
    monthAvgPcs: "",
    msds: "",
    coaMaster: "",
    measurement:"",
    notInStock:false,
    inciName:"",
    casNumber:"",
 
    umNumber:"",
    imerCode:"",
    imerTreatment:"",
    allowQtyInStock:"",
    expiredQty:"",
    permissionDangerMaterials:"",
    storageTemp:"",
    storageDirections:"",
    frameQuantity:"",
    frameSupplier:"",
    location:"",
    quantityInStock:"",
    mixedMaterial:[]

  }
  itemExpectedArrivals: any;
  closeResult: string;
  // currentFileUpload: File; //for img upload creating new component

  constructor(private supplierService:SuppliersService,private orderService:OrdersService,private modalService: NgbModal,private procuretServ: Procurementservice,private excelService: ExcelService, private route: ActivatedRoute, private inventoryService: InventoryService, private uploadService: UploadFileService,
    private authService: AuthService, private toastSrv: ToastrService, private batchService: BatchesService, private itemService: ItemsService,
    private fb: FormBuilder, ) {
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

  fillSupplierDetails(){
    if(this.resCmpt.suplierN != ''){
      this.supplierService.getSuppliersByNumber(this.resCmpt.suplierN).subscribe(data=>{
        debugger;
        if(data){
          this.resCmpt.suplierName = data[0].suplierName;
        }
      })
    
    }
  }
  
  addSupplierToMaterial(){
  debugger;
   this.resMaterial.alternativeSuppliers.push(this.supplier)
   this.toastSrv.success('ספק נוסף בהצלחה , לא לשכוח לעדכן מידע !')
   this.supplier = {
    supplierName:'',
    price:"",
    coin:"",
    coinLoading:"",
    priceLoading:"",
    manufacturer:"",
    alternativeMaterial:"",
    alterName:"",
    subGroup: "",
    packageWeight:"",
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
    this.getAllPurchaseOrders();
    this.getAllPurchaseOrdersMaterial();
    this.getAllItemShell();
    this.getUser();
    this.getAllSuppliers()
    this.getAllMaterialLocations();
    this.filterbyNum.nativeElement.value = '';
    // this.filterByType.nativeElement='';
    // this.filterByCategory.nativeElement='';
    let url = this.route.snapshot;
    this.components = [];
    // this.getAllMaterial();
    console.log(this.materials)
 
    await this.getUserAllowedWH();
    this.getAllComponents();
    // this.getAllComps();
    if(this.route.queryParams){
      this.filterByComponentN(this.route.snapshot.queryParams.componentN)
    }
    // this.exportMovementsAsXLSX();
    // this.getAllExpectedArrivalsData();
    this.getColor(new Date);
    debugger;
    
  

  }
  

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe(data=>{
      this.allSuppliers = data;
    })
  }

  getAllItemShell(){
    this.itemService.getAllItemShells().subscribe(data=>{
      this.itemShell = data;
    })
  }

  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(this.itemShell, 'itemShell');
  }

  //************************************************* */
  //   exportMovementsAsXLSX() {
  //     this.inventoryService.getAllMovements().subscribe(data=>{
  //          
  //       this.excelService.exportAsExcelFile(data, "movements");
  //         });
  //  }
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
          line = {
            'מספר פריט': that.components[i].componentN,
            'שם החו"ג': that.components[i].componentName,
            'כמות ': that.components[i].amount,
           
          }
          arr.push(line)
        }
        resolve(arr);
      }
    });
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

  addSupplierToArray() { 
    
    var detailsToPush = {...this.alternativeSupplier}
    this.resMaterial.alternativeSuppliers.push(detailsToPush);
    this.toastSrv.success("הוספת ספק בהצלחה , אנא לא לשכוח לשמור !")

  }


  open(supplierList) {
    
    this.modalService.open(supplierList, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  // openOrderAmounts(orderAmounts) {
  //   
  //   this.modalService.open(orderAmounts, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  // getAllComponentsByType(){
  //   this.stockType;
  //   this.inventoryService.getAllComponentsByType(this.stockType).subscribe(components => {
  //     this.componentsUnFiltered=   components.items.splice(0);
  //     this.components = components.items.splice(0);

  //     this.componentsAmount = components.componentsAmount.splice(0);;
  //     // console.log(res);
  //     this.componentsUnFiltered.forEach(cmpt => {
  //    //  adding amounts to all components
  //       let result = this.componentsAmount.find(elem => elem._id == cmpt.componentN)
  //       if(result!=undefined){
  //         cmpt.amount = result.total;
  //       }
  //       if(cmpt.actualMlCapacity=='undefined') cmpt.actualMlCapacity=0;

  //     });
  //     this.setType(this.stockType);
  //     this.getAllCmptTypesAndCategories();
  //     
  //   });
  // }

  // getAllItems() {
  //   
  //   this.itemService.getAllItemsTwo().subscribe(res => {
  //     
  //     this.items = res
      
  //   });
    
  // }

  getAllPurchaseOrders(){
 
    this.procuretServ.getAllComponentsPurchase().subscribe(data=>{
      this.allComponentsPurchases = data;
    })
  }
  getAllPurchaseOrdersMaterial(){
 
    this.procuretServ.getAllMaterialsPurchase().subscribe(data=>{
      this.allMaterialsPurchases = data;
    })
  }

  purchaseRecommend(component){
    debugger;
    if(component.itemType == 'material'){
      this.recommandPurchase.type = 'material'
    } 
    if(component.itemType == 'component'){
      this.recommandPurchase.type = 'component'
    } 
    this.recommandPurchase.componentNumber = component.componentN
    this.openOrderRecommendModal = true;
  }

  sendRecommandation(){
    debugger
    this.recommandPurchase.user = this.authService.loggedInUser.userName;
    this.inventoryService.addNewRecommendation(this.recommandPurchase).subscribe(data=>{
    debugger;
    if(data){
      this.toastSrv.success("המלצת רכש נשלחה בהצלחה !")
      this.openOrderRecommendModal = false;
      this.recommandPurchase.remarks = ""
      this.recommandPurchase.amount = ""
      this.recommandPurchase.componentNumber = ""

    }
    })
  }


  createMixedMaterial(){
    this.mixMaterial;
    let obj = {
      materialName:this.mixMaterial,
      materialPercentage:this.mixMaterialPercentage
    }
    if(this.mixMaterial == "" || this.mixMaterialPercentage == ""){
      this.toastSrv.error("אנא תמלא את השם והאחוזים בכדי להוסיף")
    } else {
      this.resMaterial.mixedMaterial.push(obj);
      this.mixMaterial = "";
      this.mixMaterialPercentage = "";
      this.toastSrv.success("חומר גלם נוסף בהצלחה!")
    }
  


  }

  // getAllComps(){
    
  //   this.subscription = this.inventoryService.startNewItemObservable().subscribe((components) => {
  //     debugger;
      
  //     this.inventoryService.getAllMaterialsArrivals().subscribe(data=>{
  //       debugger;
  //       data;
  //       var count = 0;
  //       for (let i = 0; i < data.length; i++) {
  //        for (let j = 0; j < this.componentsUnFiltered.length; j++) {
  //         if(data[i].internalNumber == this.componentsUnFiltered[j].componentN) {
  //             this.componentsUnFiltered[j].measureType = data[i].mesureType
  
  //             if(this.componentsUnFiltered[j].totalQnt) {
  //               this.componentsUnFiltered[j].totalQnt = Number(this.componentsUnFiltered[j].totalQnt) + data[i].totalQnt
  //               if(this.route.snapshot.queryParams.componentN){
  //                 this.filterByComponentN(this.route.snapshot.queryParams.componentN)
  //               }
               
  //             } else {
  //               this.componentsUnFiltered[j].totalQnt = data[i].totalQnt
  //               if(this.route.snapshot.queryParams.componentN){
  //                 this.filterByComponentN(this.route.snapshot.queryParams.componentN)
  //               }
  //             }
             
            
  //         }
           
  //        }
          
  //       }
  //     })
  //     var allPurchases = this.allComponentsPurchases.filter(order=>order.status != 'canceled');
  //     debugger;
  //     for (let i = 0; i < allPurchases.length; i++) {
  //     for (let j = 0; j < allPurchases[i].item.length; j++) {
  //      for (let k = 0; k < components.length; k++) {
  //       if(components[k].componentN == allPurchases[i].item[j].itemNumber){
  //         var obj = {
  //           purchaseOrder:'',
  //           purchaseAmount:'',
  //           purchaseArrival:'',
  //           purchaseStatus:''
  //         }
  //         obj.purchaseAmount = allPurchases[i].item[j].supplierAmount
  //         obj.purchaseOrder = allPurchases[i].item[j].orderNumber
  //         obj.purchaseArrival = allPurchases[i].item[j].arrivals
  //         obj.purchaseStatus = allPurchases[i].status
  //         components[k].purchaseOrders.push(obj)
  //       }
         
  //      }
        
  //     } 
        
  //     }

  //     this.components.push(...components); 
  //     if(components.length<500)
  //     {
        
  //     }
  //     this.componentsCopy=this.components.slice();
  //   } );
  
  // }


  getAllComponents() {
    
    debugger;
    this.inventoryService.getAllComponents().subscribe(components => {
      debugger;
      console.log(components[0]);

      this.inventoryService.getAllMaterialsArrivals().subscribe(data=>{
        debugger;
        data;
        var count = 0;
        for (let i = 0; i < data.length; i++) {
         for (let j = 0; j < this.componentsUnFiltered.length; j++) {
          if(data[i].internalNumber == this.componentsUnFiltered[j].componentN) {
              this.componentsUnFiltered[j].measureType = data[i].mesureType
  
              if(this.componentsUnFiltered[j].totalQnt) {
                this.componentsUnFiltered[j].totalQnt = Number(this.componentsUnFiltered[j].totalQnt) + data[i].totalQnt
                if(this.route.snapshot.queryParams.componentN){
                  this.filterByComponentN(this.route.snapshot.queryParams.componentN)
                }
               
              } else {
                this.componentsUnFiltered[j].totalQnt = data[i].totalQnt
                if(this.route.snapshot.queryParams.componentN){
                  this.filterByComponentN(this.route.snapshot.queryParams.componentN)
                }
              }
             
            
          }
           
         }
          
        }
      })
      var allPurchases = this.allComponentsPurchases.filter(order=>order.status != 'canceled');
      debugger;
      for (let i = 0; i < allPurchases.length; i++) {
      for (let j = 0; j < allPurchases[i].item.length; j++) {
       for (let k = 0; k < components.length; k++) {
        if(components[k].componentN == allPurchases[i].item[j].itemNumber){
          var obj = {
            purchaseOrder:'',
            purchaseAmount:'',
            purchaseArrival:'',
            purchaseStatus:''
          }
          obj.purchaseAmount = allPurchases[i].item[j].supplierAmount
          obj.purchaseOrder = allPurchases[i].item[j].orderNumber
          obj.purchaseArrival = allPurchases[i].item[j].arrivals
          obj.purchaseStatus = allPurchases[i].status
          components[k].purchaseOrders.push(obj)
        }
         
       }
        
      } 
        
      }

      this.componentsUnFiltered = components.splice(0)
      this.components = components.splice(0)
  
  
    //   this.components.forEach(c => {
    //     
    //      let element= this.itemExpectedArrivals.find(x=>x._id==c._id )
         
 
    //      c.remarks= element.remarks;
 
    //  });
      //why are we using set time out and not async await??
      setTimeout(() => {
    
        this.inventoryService.getComponentsAmounts().subscribe(res => {
          this.componentsAmount = res;
          // console.log(res);
          this.componentsUnFiltered.forEach(cmpt => {
            //  adding amounts to all components
            let result = this.componentsAmount.find(elem => elem._id == cmpt.componentN)
            if (result != undefined) {
              // console.log(result._id + " , " + cmpt.componentN);
              cmpt.amount = result.total;
            }
            if (cmpt.actualMlCapacity == 'undefined') cmpt.actualMlCapacity = 0;

          });
          this.components = this.componentsUnFiltered.filter(x => x.itemType == this.stockType);
        //   this.components.forEach(c => {
        //     debugger;
        //      let element= this.itemExpectedArrivals.find(x=>x.componentN==c.componentN )
             
     
        //      c.procurementArr.push(element.remarks)
     
        //  });
        
          this.setType(this.stockType);
          this.getAllCmptTypesAndCategories();

        });

      }, 100);

    });
    // console.log(this.components);
    ;
  }

  // getAllMaterial() { 
  //   
  //   this.inventoryService.getAllMaterials().subscribe(data => {
  //     this.materials = data;
  //   })
  // }


  getAllExpectedArrivalsData(){
    this.procuretServ.getAllExpectedArrivals().subscribe(res=>{
     
        this.itemExpectedArrivals=res;

   
      
    });
  }

  calcIfLowThenMin(component)
  {
    if(component.minimumStock && component.alloAmount)
    {
      if((component.amount-component.alloAmount)> component.minimumStock)
      {
        return "manyleft";
      }
      else
      {
        return "notmanyleft";
      }
    }
    return ""; 
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
    
    this.inventoryService.updateMaterial(this.resMaterial).subscribe(data =>{
      this.components.map(doc=>{
       
        if(doc.id == this.resMaterial._id){
          doc=data;
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
    } else {
      this.amountChangeDir = '';
      this.sehlfChangeNavBtnColor = "";
      this.amountChangeNavBtnColor = "#1affa3";
    }
  }


  async updateItemStock(direction) {

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





  filterByComponentN(componentN){
    this.components = this.componentsUnFiltered.filter(c => c.componentN == componentN);
  }



  getUserInfo() {

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

    switch (type) {
      case 'component':
        this.buttonColor = "white";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        break;
      case 'material':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "white";
        this.buttonColor3 = "#B8ECF1";
        this.buttonColor4 = "#B8ECF1";
        break;
      case 'product':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "white";
        this.buttonColor4 = "#B8ECF1";
        break;
        case 'cartons':
          this.buttonColor = "#B8ECF1";
          this.buttonColor2 = "#B8ECF1";
          this.buttonColor3 = "#B8ECF1";
          this.buttonColor4 = "white";
          break;
    }
    if (this.stockType != type) {
      this.filterbyNum.nativeElement.value = "";
    }
    this.stockType = type;
    if(this.stockType == 'cartons'){
      this.components = this.componentsUnFiltered.filter(x => x.componentType == 'master_carton');
    } else {
      this.components = this.componentsUnFiltered.filter(x => x.itemType == type);
    }
    


  }


  filterRows(event, filterType) {
    debugger;
    this.emptyFilterArr = true;
    this.components = this.componentsUnFiltered.filter(x => x.itemType == this.stockType);
    this.filterVal = '';
    this.filterVal = event.target.value;
    if(this.route.snapshot.queryParams.componentN){
      this.filterVal = this.route.snapshot.queryParams.componentN
    }
    if (this.stockType != 'product') {
      if(this.filterByType != undefined){
      if (this.filterByType.nativeElement.value != "") {
        let CmptType = this.filterByType.nativeElement.value;
        this.components = this.components.filter(x => (x.componentType.includes(CmptType) && x.itemType.includes(this.stockType)));
      }
      }
      if(this.filterByCategory != undefined){
      if (this.filterByCategory.nativeElement.value != "" && this.filterByCategory != undefined) {
        let category = this.filterByCategory.nativeElement.value;
        this.components = this.components.filter(x => (x.componentCategory.includes(category) && x.itemType.includes(this.stockType)));
      }
    }
    if(this.filterBySupplierN != undefined){
      if (this.filterBySupplierN.nativeElement.value != "" && this.filterBySupplierN != undefined) {
        let supplierN = this.filterBySupplierN.nativeElement.value;

        this.components = this.components.filter(x => (x.componentNs.includes(supplierN) && x.itemType.includes(this.stockType)));
      }
    }
    }
    if (this.filterbyNum.nativeElement.value != "" && this.filterbyNum != undefined) {
      let itemNum = this.filterbyNum.nativeElement.value;
      this.components = this.components.filter(x => (x.componentN.includes(itemNum) && x.itemType.includes(this.stockType)));
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
    debugger;
    this.componentPurchases = [];
    for (let i = 0; i < this.allComponentsPurchases.length; i++) {
      for (let j = 0; j < this.allComponentsPurchases[i].item.length; j++) {
       if(this.allComponentsPurchases[i].item[j].itemNumber == cmptNumber){
         this.componentPurchases.push(this.allComponentsPurchases[i].item[j])
       }
        
      }
     }
   
    this.switchModalView()
    this.showItemDetails = true;
    this.itemmoveBtnTitle = "Item movements";
    this.itemMovements = [];
    this.openModalHeader = "פריט במלאי  " + cmptNumber;
    this.openModal = true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber);
    this.loadComponentItems();

    if(this.resCmpt.jumpRemark == "" || this.resCmpt.jumpRemark == undefined) {
      console.log("ok")
    }else { 
      alert("Jumping Remark: "+this.resCmpt.jumpRemark)
    }
  }

  async openImg(componentImg) {
    this.openImgModal = true;
    this.currModalImgSrc = componentImg;
  }
  async openAmountsData(cmptNumber, cmptId) {
    
    this.openModalHeader = "כמויות פריט במלאי  " + cmptNumber;
    this.openAmountsModal = true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
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

  showBatchExpDate(ev){
  
    var batch = ev.target.value;
    if(batch != "") {
      for (let i = 0; i < this.ItemBatchArr.length; i++) {
        if(this.ItemBatchArr[i].batchNumber == batch) {
         this.expirationBatchDate =  this.ItemBatchArr[i].expration
        }
        }
    } 
    else {
      this.expirationBatchDate = ""
    }
  
  }

  async openDataMaterial(materNum) {
    debugger;
    this.materialPurchases = []
    for (let i = 0; i < this.allMaterialsPurchases.length; i++) {
     for (let j = 0; j < this.allMaterialsPurchases[i].item.length; j++) {
      if(this.allMaterialsPurchases[i].item[j].itemNumber == materNum){
        this.materialPurchases.push(this.allMaterialsPurchases[i].item[j])
      }
       
     }
    }

    this.showItemDetails = true;
    this.itemmoveBtnTitle = "Item movements";
    this.itemMovements = [];
    this.openModalHeader = "פריט במלאי  " + materNum;
    this.openModal = true;
    this.resMaterial = this.components.find(mat => mat.componentN == materNum);
    
    this.linkDownload="http://localhost/material/getpdf?_id="+this.resMaterial._id;
    this.loadComponentItems();
  }

  async openAllocatedOrders(componentN) {
    

    this.openModalHeader = "הקצאות מלאי"
     this.openOrderAmountsModal = true; 
    this.inventoryService.getAllocatedOrdersByNumber(componentN).subscribe(data=>{
     
      this.allocatedOrders = data[0].allAllocatedOrders
  });
    
 

  }
  async openAllocatedProducts(componentN) {


    this.openModalHeader = "הקצאות מלאי"
     this.openProductAmountModal = true; 
    this.inventoryService.getAllocatedOrdersByNumber(componentN).subscribe(data=>{
     
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
          alert("לא ניתן ליצור פריט חדש- מספר " + this.resCmpt.componentN + " פריט כבר קיים במלאי");
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
    debugger;
    //this.stockType = "material"/"component"/"product"
    this.resMaterial.itemType = "material"
    if (this.resMaterial.componentN != "") {

      
      this.inventoryService.addNewMaterial(this.resMaterial).subscribe(res => {
        

        if(res == "פריט קיים במערכת !") { 
          this.toastSrv.error("פריט קיים במערכת !")
        } else { 

          this.toastSrv.success("New material item created");
          this.components.push(res);
  
        }
     
      });

    }

  }

  checkIfExist(ev) {
    
   if(ev.target.value !="") { 
     this.inventoryService.getMaterialtByNumber(ev.target.value).subscribe(data=>{
       if(data.length > 0) { 
         this.toastSrv.error("שים לב , הפריט כבר קיים במערכת !")
       } else { 

       }
     })
   }
    }

  clearFields() { 

    this.resMaterial  = {

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
      subGroup: "",
      subGroup2: "",
      suplierName: "",
      status: "",
      threatment: "",
      monthTillExp: "",
      monthAvgPcs: "",
      msds: "",
      coaMaster: "",
      alternativeMaterial:"",
      notInStock:false,
      inciName:"",
      casNumber:"",
      manufacturer:"",
      umNumber:"",
      imerCode:"",
      imerTreatment:"",
      allowQtyInStock:"",
      expiredQty:"",
      storageTemp:"",
      storageDirections:"",
      permissionDangerMaterials:"",
      frameQuantity:"",
      frameSupplier:"",
      riskSentence:'',
      stateOfMatter:'',
      dangerMaterials:'',
  
  
    }
  }
  onSelectMsds(event) { 
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        
        this.resMaterial.msds = event.target["result"]
        this.resMaterial.msds=this.resMaterial.msds.replace("data:application/pdf;base64,","");
      }
    }
  }

    onSelectCoaMaster(event) { 
      
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
       
        this.resMaterial.coaMaster = event.target["result"]
        this.resMaterial.coaMaster=this.resMaterial.coaMaster.replace("data:application/pdf;base64,","");
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
        if (res._id) {
          this.toastSrv.success("פריט עודכן בהצלחה");
        } else {
          this.toastSrv.error("עדכון פריט נכשל");
        }
      });
    }

  }

  async getUser() {
    await this.authService.userEventEmitter.subscribe(user => {
      this.user=user;
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
      if (this.user.authorization){
        if (this.authService.loggedInUser.authorization.includes("updateStock")){
          this.allowUserEditItem=true;
        }
      }

    });





  }


  resetResCmptData() {
    
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
      componentItems: [],
      input_actualMlCapacity: 0,
    }

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
    
    this.orderService.getOrderItemsByNumber(componentN).subscribe(data=>{
      
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


  getAllMaterialLocations(){
    this.inventoryService.getAllMaterialLocations().subscribe(data=>{
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
        let recommendList = this.components.filter(cmpt => cmpt.procurementArr.length > 0);
        this.components = recommendList;
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





  showDialog() {
  }

  switchModalView() {
    debugger;
    this.loadingMovements = true;
    this.inventoryService.getItemMovements(this.resCmpt.componentN).subscribe(data => {
      this.itemMovements = data;
      this.loadingMovements = false;
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



