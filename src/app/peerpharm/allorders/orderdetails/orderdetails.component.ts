import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { ScheduleService } from '../../../services/schedule.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PlateService } from 'src/app/services/plate.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { ExcelService } from '../../../services/excel.service';
import { AuthService } from '../../../services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { FormulesService } from 'src/app/services/formules.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { FormsService } from 'src/app/services/forms.service';




@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])]
})
export class OrderdetailsComponent implements OnInit {
  materialsForFormules: any[];
  allForms: any[];
  productionRequirements: any[];
  selectedArr: any[] = [];
  user: UserInfo
  openFormule: boolean = false;
  showMaterialsForFormules: boolean = false;
  currItems: any[];
  currFormule: any[];
  currItem: any;
  currPhase: any[];
  bottleInStock: boolean;
  pumpInStock: boolean;
  sealInStock: boolean;
  capInStock: boolean;
  cartonInStock: boolean;
  totalOrderAmounts: any[];
  allMaterials: any[];
  formuleCheck: boolean;
  itemDetails: any;
  newProductionNetWeightGr: any;
  newProductionQuantity: any;
  componentStatus: any;
  capDetails: any;
  sealDetails: any;
  pumpDetails: any;
  cartonDetails: any;
  allItems: any[];
  statusColor: String;
  closeResult: string;
  printingStatus: boolean = false;
  plateImg = "";


  componentsAmounts: any = {

    bottleQuantity: 0,
    pumpQuantity: 0,
    sealQuantity: 0,
    capQuantity: 0,
    cartonQuantity: 0,

  }

  printSchedule: any = {
    position: '',
    orderN: '',
    itemN: '',
    itemName: '',
    costumer: '',
    cmptName: '',
    block: '',
    qty: '',
    qtyProduced: '',
    color: '',
    printType: '',
    nextStation: '',
    marks: '',
    date: '',
    scheduleDate: '',
    dateRdy: '',
    palletN: '',
    status: '',
  }

  documentationBeforeSend = {
    costumerNumber: '',
    costumerName: '',
    date: '',
    itemNumber: '',
    batchNumber: '',
    cartonsNumber: '',
    unitCartonNumber: '',
    partCartonNumber: '',
    sum: '',
  }

  allComponents: any[];
  stockItems: any;
  ordersItems;
  ordersItemsCopy;
  item: any;
  number; orderDate; deliveryDate; costumer; costumerInternalId; remarks; orderId; orderStage; stageColor;
  chosenType: string;
  chosenMkpType: string;
  detailsArr: any[];
  components: any[];
  multi: boolean = false;
  loadData: boolean = false;
  itemData: any = {
    itemNumber: '',
    discription: '',
    netWeightGr: null,
    quantity: '',
    qtyKg: '',
    orderId: '',
    orderNumber: '',
    batch: '',
    itemRemarks: '',
    invoice: '',
    formuleCheck: '',
    componentCheck: '',
    compiled: [],
    actionTime: [],
  };
  show: boolean;
  EditRowId: any = "";
  EditRowId2nd: any = "";
  expand: boolean = false;
  type = { type: '' };
  ordersToCheck = [];
  internalNumArr = [];
  packingModal = false;
  cmptModal = false;
  packingItemN = "";
  packingOrderN = "";
  openOrderPackingModalHeader = "";
  openItemPackingModalHeader = "";
  itemPackingList: Array<any> = [];
  itemPackingPalletsArr: Array<any> = [];
  orderPalletsArr: Array<any> = [];
  orderPalletsNumArr: Array<any> = [];
  palletsData: Array<any> = [];
  showingOneOrder: Boolean;
  showingAllOrders: Boolean;
  orderPackingList: Array<any> = [];
  orderItemsComponents: Array<any> = [];
  orderItemsStock;

  bottleList: Array<any> = [];
  capList: Array<any> = [];
  pumpList: Array<any> = [];
  sealList: Array<any> = [];
  stickerList: Array<any> = [];
  boxList: Array<any> = [];
  cartonList: Array<any> = [];
  platesList: Array<any> = [];
  itemTreeRemarks: Array<any> = [];
  ordersData: Array<any> = [];
  costumersNumbers: Array<any> = [];
  costumerImpRemark: String;
  multiCostumerImpRemark: Array<any> = [];
  editBatchN: Boolean = false;
  formDetailsAmounts: Array<any>;

  @ViewChild('weight') weight: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;
  @ViewChild('quantity') quantity: ElementRef;
  @ViewChild('netWeightGr') netWeightGr: ElementRef;
  @ViewChild('itemname') itemName: ElementRef;
  @ViewChild('itemNumber') itemN: ElementRef;
  @ViewChild('id') id: ElementRef;
  @ViewChild('inputBatch') inputBatch: ElementRef;
  @ViewChild('componentCheck') componentCheck: ElementRef;
  @ViewChild('mkpProdInvoice') mkpProdInvoice: ElementRef;
  @ViewChild('componentRemarks') componentRemarks: ElementRef;
  @ViewChild('stickerRemarks') stickerRemarks: ElementRef;
  @ViewChild('cartonRemarks') cartonRemarks: ElementRef;
  @ViewChild('packageRemarks') packageRemarks: ElementRef;

  @ViewChild('date') date: ElementRef;
  @ViewChild('shift') shift: ElementRef;
  @ViewChild('marks') marks: ElementRef;
  // @ViewChild('type') type:ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }
  constructor(private formService: FormsService, private formuleService: FormulesService, private inventoryService: InventoryService, private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private orderService: OrdersService, private itemSer: ItemsService,
    private scheduleService: ScheduleService, private location: Location, private plateSer: PlateService, private toastSrv: ToastrService,
    private costumerSrevice: CostumersService, private excelService: ExcelService, private authService: AuthService) { }


  exportAsXLSXOrders(data) {

    this.excelService.exportAsExcelFile(this.ordersItems, 'data');
  }

  exportAsXLSX(data) {

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < this.ordersItems.length; j++) {
        if (data[i].itemNumber == this.ordersItems[j].itemNumber) {

          data[i].netWeightGr = this.ordersItems[j].netWeightGr
        }

      }

    }
    this.excelService.exportAsExcelFile(data, 'Order ' + this.ordersItems[0].orderNumber + ' Explode');
  }

  async ngOnInit() {
    this.getAllFormsDetails()
    this.getUserInfo();
    this.getAllComponents();
    this.getAllMaterialsFormules();





    this.orderService.openOrdersValidate.subscribe(res => {
      this.number = this.route.snapshot.paramMap.get('id');

      if (res == true || this.number == "00") {
        // Getting All OrderItems!
        this.showingAllOrders = true;
        this.loadData = true;
        this.orderService.getOpenOrdersItems().subscribe(async orders => {
          this.loadData = false;
          this.multi = true;
          orders.orderItems.forEach(item => {
            item.isExpand = '+';
            item.colorBtn = '#33FFE0';


          });
          this.ordersData = orders.ordersData;
          await this.colorOrderItemsLines(orders.orderItems).then(data => { });
          this.ordersItems = orders.orderItems;
          this.productionRequirements = orders.orderItems;


          this.ordersItemsCopy = orders.orderItems;
          this.ordersItems.map(item => {
            item.itemFullName = item.itemNumber + " " + item.discription;
          })
          //this.ordersItems = this.ordersItems.map(elem => Object.assign({ expand: false }, elem));
          //this.getComponents(this.ordersItems[0].orderNumber);
          this.multi = true;
          console.log(orders.orderItems)
        });

      }
      else {
        this.showingAllOrders = false;
        this.orderService.ordersArr.subscribe(async res => {
          console.log(res)
          var numArr = this.number.split(",").filter(x => x != "");
          if (numArr.length > 1) { //multi orders:  came through load button
            this.orderService.getOrdersIdsByNumbers(numArr).subscribe(async orders => {
              if (orders.ordersIds.length > 1) {
                this.ordersData = orders.ordersData;
                this.ordersData.map(order => {
                  if (order.costumerImpRemark != undefined && order.costumerImpRemark != "") {
                    this.multiCostumerImpRemark.push(order.costumerImpRemark)
                  }
                })
                this.checkCostumersImportantRemarks(this.ordersData);
                this.orderService.getMultiOrdersIds(orders.ordersIds).subscribe(async orderItems => {
                  orderItems.forEach(item => {
                    item.isExpand = '+';
                    item.colorBtn = '#33FFE0';
                  });

                  await this.colorOrderItemsLines(orderItems).then(data => { });
                  this.ordersItems = orderItems;
                  this.productionRequirements = orderItems;
                  this.ordersItemsCopy = orderItems;

                  this.multi = true;
                  console.log(orderItems);
                });
              } else {  //one order: but came through load button
                await this.getOrderDetails();
                await this.getOrderItems(false);

                this.show = true;
                this.multi = false;

              }

            });
          } else {  //one order:
            await this.getOrderDetails();
            await this.getOrderItems(false);

            this.show = true;
            this.multi = false;
          }
        });
      }
    });

    this.ordersItems

  }

  getAllFormsDetails() {
    this.formService.getAllForms().subscribe(data => {
      this.allForms = data;

    });
  }

  open(contentTwo) {
    debugger;
    var allForms = this.allForms;
    var orderItems = this.ordersItems;

    orderItems.forEach(o => {

      let allImp = this.allForms.filter(x => x.orderNumber == o.orderNumber && x.itemN == o.itemNumber);
      let sum = 0;
      allImp.forEach(f => {
        sum += Number(f.quantity_Produced)
      });
      o.quantityProduced = sum;

    })

    orderItems.forEach(o => {

      let allImp = this.allForms.filter(x => x.orderNumber == o.orderNumber && x.itemN == o.itemNumber);
      let sum = 0;
      allImp.forEach(f => {
        if (f.totalUnits) {
          sum += Number(f.totalUnits)
        }

      });
      o.totalUnits = sum;

    })






    // for (let i = 0; i < allForms.length; i++) {
    //   for (let j = 0; j < orderItems.length; j++) {
    //    if(allForms[i].itemN == orderItems[j].itemNumber) {
    //      orderItems[j].totalUnits = allForms[i].totalUnits
    //    }

    //   }

    // }



    this.ordersItems = orderItems

    this.modalService.open(contentTwo, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  checkIfAvailable(componentNumber, quantity) {

    this.inventoryService.getCmptByitemNumber(componentNumber)

  }

  saveItemRemarks(id){
    debugger;
    this.componentRemarks.nativeElement.value;
    var obj = {
      componentRemarks:this.componentRemarks.nativeElement.value,
      packageRemarks:this.packageRemarks.nativeElement.value,
      stickerRemarks:this.stickerRemarks.nativeElement.value,
      cartonRemarks:this.cartonRemarks.nativeElement.value,
      orderItemId:id
    }
    this.orderService.saveOrderItemRemarks(obj).subscribe(data=>{
debugger;
if(data){
  for (let i = 0; i < this.productionRequirements.length; i++) {
  if(this.productionRequirements[i]._id == data._id){
    this.productionRequirements[i].componentRemarks = data.componentRemarks
    this.productionRequirements[i].packageRemarks = data.packageRemarks
    this.productionRequirements[i].stickerRemarks = data.stickerRemarks
    this.productionRequirements[i].cartonRemarks = data.cartonRemarks
    this.edit('');
    this.toastSrv.success("עודכן בהצלחה !")
  }
    
  }
}
    })
  }

  openComponentsStatus(components, itemNumber, itemQuantity, orderNumber) {


    debugger
    this.itemSer.getComponentsAmountByCmptNumber(itemNumber, itemQuantity).subscribe(data => {
      debugger;
      data;

      this.itemDetails = data;

    });



    this.modalService.open(components, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  isSelected(ev, item) {
    debugger
    if (ev.target.checked == true) {
      var isSelected = this.selectedArr
      isSelected.push({ ...item });
      this.selectedArr = isSelected
    }

    if (ev.target.checked == false) {
      var isSelected = this.selectedArr
      var tempArr = isSelected.filter(x => x.itemNumber != item.itemNumber)
      this.selectedArr = tempArr
    }


  }

  // getAllOrdersItems() { 
  //   debugger;
  //   this.orderService.getOpenOrdersItems().subscribe(data=>{
  //     this.orderItemsStock = data;


  //   })
  // }

  // getAllItems() { 
  //   this.itemSer.getAllItems().subscribe(data=>{
  //     this.allItems = data;
  //   })
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  saveProductDoc() {

    this.orderService.addNewProductDoc(this.documentationBeforeSend).subscribe(data => {
      console.log(data);

    })
  }

  addItemOrder() {
    debugger;
    this.itemData.formuleCheck = this.formuleCheck
    this.itemData.orderId = this.orderId;
    var userName = this.authService.loggedInUser.firstName
    var timeNow = new Date().getTime();
    this.itemData.actionTime = []
    this.itemData.actionTime.push({ user: userName, time: timeNow })

    if (!this.multi) this.itemData.orderNumber = this.number;
    let newItemImpRemark = this.itemData.itemImpRemark;

    this.orderService.addNewOrderItem(this.itemData).subscribe(item => {
      if (item.itemNumber == this.itemData.itemNumber) {

        item.itemImpRemark = newItemImpRemark;
        item.isExpand = '+';
        item.colorBtn = '#33FFE0';
        item.compiled = [];
        this.ordersItems.push(item);
        this.itemData = { itemNumber: '', discription: '', netWeightGr: '', quantity: '', qtyKg: '', orderId: '', orderNumber: '', batch: '', itemRemarks: '', formuleCheck: '', componentCheck: '', compiled: [] }
        this.getOrderItems(true);

        this.toastSrv.success('item ' + item.itemNumber + ' added');
      } else if (item == 'error') {
        this.toastSrv.error('Adding item faild');
      }
    });
  }

  updateSingleOrderStage(ev) {
    if (confirm("שינוי שלב של הזמנה")) {
      let newStageValue = ev.target.value;
      this.orderStage;
      this.stageColor;

      this.orderService.editOrderStage(this.ordersItems[0], newStageValue).subscribe(order => {

        this.orderStage = newStageValue;
        this.returnStageColor(this.orderStage);

      });
    } else {
      ev.target.value = this.orderStage;
    }

  }
  async checkCostumersImportantRemarks(orders) {

    this.costumersNumbers = []
    await orders.forEach((o, key) => {
      if (o.costumerImpRemark != undefined && o.costumerImpRemark != "") {
        if (!this.multiCostumerImpRemark.includes(o.costumerImpRemark)) {
          this.multiCostumerImpRemark.push(o.costumerImpRemark)
        }

      }
      if (o.costumerInternalId != undefined && o.costumerInternalId != "" && o.costumerInternalId != null) {
        if (!this.costumersNumbers.includes(o.costumerInternalId)) {
          this.costumersNumbers.push(o.costumerInternalId);
        }
      } else {
        this.costumersNumbers.push(o.costumerName);
      }

      if (key + 1 == orders.length) {
        if (this.costumersNumbers.length == 1 && this.multiCostumerImpRemark.length > 1) this.costumerImpRemark = this.multiCostumerImpRemark[0]
        console.log("this.costumersNumbers", this.costumersNumbers)
        console.log("this.multiCostumerImpRemark", this.multiCostumerImpRemark)
        console.log("this.costumerImpRemark", this.costumerImpRemark)
      }
    });

  }

  async getOrderDetails() {
    this.number = this.route.snapshot.paramMap.get('id');
    //if someone loaded just one item in orders screen through "Load" button
    if (this.number.includes(',')) this.number = this.number.split(",").filter(x => x != "");

    await this.orderService.getOrderByNumber(this.number).subscribe(res => {
      this.number = res[0].orderNumber;
      this.costumer = res[0].costumer;
      this.costumerInternalId = res[0].costumerInternalId;
      // this.costumerSrevice.getCostumerData(CostumerNumber).subscribe(res => {});
      this.orderDate = res[0].orderDate;
      this.deliveryDate = res[0].deliveryDate;
      this.remarks = res[0].orderRemarks;
      this.orderId = res[0]._id;
      this.documentationBeforeSend.costumerNumber = res[0].costumerInternalId
      this.documentationBeforeSend.costumerName = res[0].costumer
      this.costumerImpRemark = res[0].costumerImpRemark;
      this.ordersData = res;
      this.checkCostumersImportantRemarks(res);
      if (!this.multi) {
        this.orderStage = res[0].stage;
        this.returnStageColor(this.orderStage);
      }
    });
  }

  // getItemAmounts() { 

  //   this.orderService.getOrderAmounts().subscribe( data => {
  //     this.formDetailsAmounts = data;

  //   });

  // }

  getAllMaterialsFormules() {
    this.inventoryService.getAllMaterialsForFormules().subscribe(data => {
      this.allMaterials = data;
    })
  }

  showFormule(item,itemNumber, formuleByItem) {
  debugger;
 
    this.currItem = item;
    this.formuleService.getFormuleByNumber(itemNumber).subscribe(data => {

      if (data == null) {
        this.toastSrv.error("There is no formule yet")
      } else {
        this.modalService.open(formuleByItem, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        this.currFormule = [data];
        console.log(this.currFormule)
        // this.currPhase = data.phases
        // var items = []
        // for (let i = 0; i < data.phases.length; i++) {

        //   items.push(data.phases[i].items)

        // }
        // this.currItems = items

      }

    })
  }

  checkboxAllOrders(ev) {
    debugger;
    this.ordersItems.filter(e => e.isSelected = ev.target.checked)
  }

  createProdRequirements() {
    for (let i = 0; i < this.productionRequirements.length; i++) {
      this.itemSer.getItemData(this.productionRequirements[i].itemNumber).subscribe(data => {
        debugger;
        data
        this.productionRequirements[i].bottleNumber = data[0].bottleNumber
        this.productionRequirements[i].pumpNumber = data[0].pumpNumber
        this.productionRequirements[i].sealNumber = data[0].sealNumber
        this.productionRequirements[i].capNumber = data[0].capNumber
        this.productionRequirements[i].stickerNumber = data[0].stickerNumber
        this.productionRequirements[i].cartonNumber = data[0].cartonNumber
        this.productionRequirements[i].PcsCarton = data[0].PcsCarton
        this.productionRequirements[i].boxNumber = data[0].boxNumber


      })

    }
  }

  changeReqStatus(ev, id, type) {
    debugger;
    var status = ev.target.value
    switch (type) {
      case 'component':
        this.orderService.changeReqStatus(status, id,type).subscribe(data => {
          if (data) {
            for (let i = 0; i < this.productionRequirements.length; i++) {
              if (this.productionRequirements[i]._id == data._id) {
                this.productionRequirements[i].componentStatus = data.componentStatus
               
              }

            }
          }
        })
        break;
      case 'package':
        this.orderService.changeReqStatus(status, id,type).subscribe(data => {
          if (data) {
            for (let i = 0; i < this.productionRequirements.length; i++) {
              if (this.productionRequirements[i]._id == data._id) {
                this.productionRequirements[i].packageStatus = data.packageStatus
           
              }

            }
          }
        })
        break;
      case 'carton':
        this.orderService.changeReqStatus(status, id,type).subscribe(data => {
          if (data) {
            for (let i = 0; i < this.productionRequirements.length; i++) {
              if (this.productionRequirements[i]._id == data._id) {
                this.productionRequirements[i].cartonStatus = data.cartonStatus
              }

            }
          }
        })
        break;
      case 'sticker':
        this.orderService.changeReqStatus(status, id,type).subscribe(data => {
          if (data) {
            for (let i = 0; i < this.productionRequirements.length; i++) {
              if (this.productionRequirements[i]._id == data._id) {
                this.productionRequirements[i].stickerStatus = data.stickerStatus
              }

            }
          }
        })
        break;
    }

    }

    loadMaterialsForFormule(){
      debugger
      this.selectedArr

      this.inventoryService.getMaterialsForFormules(this.selectedArr).subscribe(data => {
        debugger
        if (data.msg == "לא קיימת פורמולה") {
          this.toastSrv.error("לא קיימת פורמולה לאחד מהפריטים")
        } else {
          this.materialsForFormules = data;
          this.showMaterialsForFormules = true;
        }

      })
    }

    changeItemQuantity(itemNumber){
      debugger;
      var updatedQuantity = prompt('הזן כמות');
      updatedQuantity
      itemNumber;
      var tempArr = [...this.selectedArr];
      var item = tempArr.find(i => i.itemNumber == itemNumber);
      item.calculatedAmount = updatedQuantity
      this.inventoryService.getMaterialsForFormules(tempArr).subscribe(data => {
        debugger
        if (data.msg == "לא קיימת פורמולה") {
          this.toastSrv.error("לא קיימת פורמולה לאחד מהפריטים")
        } else {
          this.materialsForFormules = data;
          this.showMaterialsForFormules = true;
        }

      })
    }



    getOrderItems(singleLine): void {
      var orderNum;
      this.number = this.route.snapshot.paramMap.get('id');
      if(this.number.includes(',')) this.number = this.number.split(",").filter(x => x != "");
      if(singleLine) {
        orderNum = this.itemData.orderNumber.trim();
      }else{
        orderNum = this.number;
      }
    //if someone loaded just one item in orders screen through "Load" button

    document.title = "Order " + this.number;
      this.orderService.getOrderItemsByNumber(orderNum).subscribe(orderItems => {
        orderItems.map(item => {
          if (item.fillingStatus != null) {
            if (item.status != 'done') {
              if (item.fillingStatus.toLowerCase() == 'filled'
                || item.fillingStatus.toLowerCase() == 'partfilled') {
                item.color = '#CE90FF';
              }
              else if (item.fillingStatus.toLowerCase() == 'beingfilled'
                || item.fillingStatus.toLowerCase().includes("scheduled")
                || item.fillingStatus.toLowerCase().includes('formula porduced')
                || item.fillingStatus.toLowerCase().includes('batch exist')) {
                item.color = 'yellow';
              }
              else if (item.fillingStatus.toLowerCase() == 'problem') item.color = 'red';
              else if (item.quantityProduced != "" && item.quantityProduced != null && item.quantityProduced != undefined) {
                if (parseInt(item.quantity) >= parseInt(item.quantityProduced)) {
                  let lackAmount = parseInt(item.quantity) - parseInt(item.quantityProduced);
                  item.fillingStatus += ", " + lackAmount + " lack";
                  item.infoColor = '#ff7272';
                }
                else item.color = '#CE90FF';
              }
              else if (item.fillingStatus == 'packed') item.color = '#FFC058';
              else item.color = 'none';

            } else {
              item.color = 'aquamarine';
            }
          } else if (item.fillingStatus == undefined && item.status == 'done') {
            item.color = 'aquamarine';
          }


          item.isExpand = '+';
          item.colorBtn = '#33FFE0';
        });

        if (singleLine) {
          this.ordersItems.filter(item => {
            if (item.itemNumber == orderItems[0].itemNumber) {
              item = orderItems[0];

            }
          });
        } else {
          this.ordersItems = orderItems;
          this.productionRequirements = orderItems;
          this.ordersItemsCopy = orderItems;
        }

        this.getComponents(this.ordersItems[0].orderNumber);

      });
    }

    colorOrderItemsLines(orderItems){

      return new Promise(async function (resolve, reject) {
        await orderItems.map(item => {
          if (item.fillingStatus != null) {
            if (item.status != 'done') {
              if (item.fillingStatus.toLowerCase() == 'filled' || item.fillingStatus.toLowerCase() == 'partfilled') item.color = '#CE90FF';
              else if (item.fillingStatus.toLowerCase() == 'beingfilled' || item.fillingStatus.toLowerCase().includes("scheduled") || item.fillingStatus.toLowerCase().includes('formula porduced') || item.fillingStatus.toLowerCase().includes('batch exist')) item.color = 'yellow';
              else if (item.fillingStatus.toLowerCase() == 'problem') item.color = 'red';
              else if (item.quantityProduced != "" && item.quantityProduced != null && item.quantityProduced != undefined) {
                if (parseInt(item.quantity) >= parseInt(item.quantityProduced)) {
                  let lackAmount = parseInt(item.quantity) - parseInt(item.quantityProduced);
                  item.fillingStatus += ", " + lackAmount + " lack";
                  item.infoColor = '#ff7272';
                }
                else item.color = '#CE90FF';
              }
              else if (item.fillingStatus == 'packed') item.color = '#FFC058';
              else item.color = 'none';

            } else {
              item.color = 'aquamarine';
            }
          } else if (item.fillingStatus == undefined && item.status == 'done') {
            item.color = 'aquamarine';
          }
          item.isExpand = '+';
          item.colorBtn = '#33FFE0';
        });

        resolve(orderItems);
      });

    }

    // OrderCompileData(orderNumber){
    //   this.orderService.getOrderCompileData(orderNumber).subscribe(itemPackingList => {
    //     // this. = components;
    //     this.ordersItems.map(item=>{
    //       item.compiled=[] ;

    //       itemPackingList.map(packedItemData=> {
    //         if(packedItemData._id==item.itemNumber){
    //           item.compiled.push(packedItemData);
    //         }
    //       });
    //     });
    //     console.log(this.ordersItems);
    //   });
    // }
    //not in use at this moments
    getComponents(orderNumber): void {
      this.orderService.getComponentsSum(orderNumber).subscribe(components => {
        this.components = components;
        console.log("a" + components);
      })
    }

    editBatch(batch){
      this.editBatchN = true;
      setTimeout(() => {
        this.inputBatch.nativeElement.value = batch;
      }, 100);
    }

    getDetails(itemNumber, itemId): void {

      // if(this.inputBatch.nativeElement.value !=undefined){
      //   this.inputBatch.nativeElement.value='';
      // }
      this.editBatchN = false;
      this.EditRowId2nd = itemId;
      console.log(itemNumber + " , " + itemId);
      this.orderService.getItemByNumber(itemNumber).subscribe(
        itemDetais => {

          console.log(itemDetais);
          this.detailsArr = [];
          itemDetais.forEach(element => {
            if (element.bottleNumber != null && element.bottleNumber != "") this.detailsArr.push({ type: "Bottle", number: element.bottleNumber, discription: element.bottleTube });
            if (element.capNumber != null && element.capNumber != "") this.detailsArr.push({ type: "Cap", number: element.capNumber, discription: element.capTube });
            console.log(this.detailsArr);
          });
          if (this.expand === true) { this.expand = false; }
          else { this.expand = true; }

        });


      this.ordersItems.filter(item => item.itemNumber == itemNumber).map(item => {
        this.EditRowId = '';

        this.documentationBeforeSend.itemNumber = item.itemNumber;
        this.documentationBeforeSend.batchNumber = item.batch;
        if (item.isExpand == "+") {
          item.isExpand = "-";
          item.colorBtn = '#F7866A';
        }
        else {
          item.isExpand = "+";
          item.colorBtn = '#33FFE0';
        }
      });
      setTimeout(() => {
      this.inputBatch.nativeElement.value = '';
      this.editBatchN = false;
    }, 100);
  }



  edit(id) {
debugger;
    if (id != '') {
      this.EditRowId = id;
    } else {
      this.EditRowId = '';
    }
  }

  calculateAllUnits() {
    var cartons = this.documentationBeforeSend.cartonsNumber
    var units = this.documentationBeforeSend.unitCartonNumber
    var partCarton = this.documentationBeforeSend.partCartonNumber

    var sum = (Number(cartons) * Number(units) + Number(partCarton));

    this.documentationBeforeSend.sum = JSON.stringify(sum);
  }



  isChecked(ev, id) {
    debugger;
    var formuleStatus = ev.target.checked
    if (ev.target.checked == true) {

      this.formuleCheck = ev.target.checked
      this.orderService.editFormuleCheck(formuleStatus, id).subscribe(data => {
        data
      })

        ;
    }

    else {
      var formuleStatus = ev.target.checked
      this.formuleCheck = ev.target.checked
      this.orderService.editFormuleCheck(formuleStatus, id).subscribe(data => {
        data
      })
    }

  }

  saveEdit() {

    let itemToUpdate = {

      'orderItemId': this.id.nativeElement.value,
      'itemNumber': this.itemN.nativeElement.value,
      "netWeightGr": this.netWeightGr.nativeElement.value,
      "discription": this.itemName.nativeElement.value,
      "quantity": this.quantity.nativeElement.value,
      // "qtyKg": this.weight.nativeElement.value,
      "itemRemarks": this.itemRemarks.nativeElement.value,
      lastUpdated: [{ user: this.user.firstName, time: new Date() }]

    }
    console.log(itemToUpdate);
    // console.log("edit " + itemToUpdate.orderItemId );

    this.orderService.editItemOrder(itemToUpdate).subscribe(res => {

      console.log(res)
      if (res != "error") {
        this.toastSrv.success(itemToUpdate.itemNumber, "Changes Saved");
        this.EditRowId = "";
        let index = this.ordersItems.findIndex(order => order._id == itemToUpdate.orderItemId);
        // this.ordersItems[index] = itemToUpdate;
        this.ordersItems[index]._id = itemToUpdate.orderItemId;
        this.ordersItems[index].itemRemarks = itemToUpdate.itemRemarks;
        this.ordersItems[index].discription = itemToUpdate.discription;
        // this.ordersItems[index].qtyKg = itemToUpdate.qtyKg;
        this.ordersItems[index].quantity = itemToUpdate.quantity;
        // this.ordersItems[index].qtyKg = itemToUpdate.qtyKg;
        this.ordersItems[index].netWeightGr = itemToUpdate.netWeightGr;



      } else {
      }

    });


  }



  fillTotalUnits() {

    this.ordersItems
  }

  deleteItem(item) {
    console.log(item._id);
    this.orderService.deleteOrderItem(item._id).subscribe(res => {
      this.toastSrv.error("Item Has Been Deleted", item.itemNumber);
      this.ordersItems = this.ordersItems.filter(elem => elem._id != item._id);
      console.log(res)
    });
  }

  setMkpSchedule(item, date, remarks, invoice) {
    debugger;
    // we should check what about type = '' 
    if (date != '') {


      let costumer = this.ordersData.map(order => {
        if (order.orderNumber == item.orderNumber) {
          return { costumerName: order.costumer, costumerId: order.costumerInternalId }
        }
      })[0];
      if (costumer.costumerId == undefined) costumer.costumerId = '';

      let obj = {
        itemFullName: item.discription,
        itemNumber: item.itemNumber,
        orderItemId: item._id,
        orderId: item.orderId,
        orderNumber: item.orderNumber,
        quantity: item.quantity,
        batch: item.batch,
        quantityProduced: item.quantityProduced,
        date: new Date(date),
        invoiceNumber: invoice,
        orderItemRemarks: remarks,
        userName: this.authService.loggedInUser.firstName + ' ' + this.authService.loggedInUser.lastName,
        costumerName: costumer.costumerName,
        costumerId: costumer.costumerId,
      }
      if (obj.quantityProduced == '') obj.quantityProduced = 0;
      this.scheduleService.setNewMkpProductionSchedule(obj).subscribe(res => {

        if (res.item) {
          this.toastSrv.success('Item sent barcode print');
        } else if (res == 'No netWeightK') {
          alert('לפריט מספר ' + obj.itemNumber + '\nאין משקל נטו בעץ פריט.\nלא ניתן לפתוח פק"ע לפריט');
        }
        else {
          this.toastSrv.error("Something went wrong!\nCan't set item to makeup production schedule.");
        }
      });
      // set obj to send
      //send to mkp.schedule.controller.js 

    } else {
      this.toastSrv.error('Invalid Date');
    }
  }


  async setSchedule(item, type) {

    console.log(item);
    console.log(this.chosenType);
    console.log(this.date.nativeElement.value + " , " + this.shift.nativeElement.value + " , " + this.marks.nativeElement.value);
    if (this.date.nativeElement.value != "") {
      var packageP = "";
      var impremark = "";
      if (item.itemNumber != "") {
        await this.itemSer.getItemData(item.itemNumber).subscribe(res => {

          // whats the use of packageP ??? its also in server side router.post('/addSchedule'....
          if (res[0]._id) {
            packageP = res[0].bottleTube + " " + res[0].capTube + " " + res[0].pumpTube + " " + res[0].sealTube + " " + res[0].extraText1 + " " + res[0].extraText2;
            impremark = res[0].impRemarks;
          }
          let scheduleLine = {
            positionN: '',
            orderN: item.orderNumber,
            item: item.itemNumber,
            costumer: this.costumer,
            productName: item.discription,
            batch: item.batch,
            packageP: packageP,
            qty: item.quantity,
            qtyRdy: '',
            date: this.date.nativeElement.value,
            marks: this.marks.nativeElement.value, //marks needs to br issued - setSchedule() && setBatch() updating this value and destroy the last orderItems remarks
            shift: this.shift.nativeElement.value,
            mkp: this.chosenType,
            status: 'open',
            productionLine: '',
            pLinePositionN: 999,
            itemImpRemark: impremark,
          }
          if (scheduleLine.mkp == "sachet") scheduleLine.productionLine = "10";
          if (scheduleLine.mkp == "mkp") scheduleLine.productionLine = "11";
          if (scheduleLine.mkp == "tube") scheduleLine.productionLine = "12";
          if (scheduleLine.mkp == "laser") scheduleLine.productionLine = "13";
          if (scheduleLine.mkp == "stickers") scheduleLine.productionLine = "14";
      

          this.scheduleService.setNewProductionSchedule(scheduleLine).subscribe(res => console.log(res));
          let dateSced = this.date.nativeElement.value;
          dateSced = moment(dateSced).format("DD/MM/YYYY");
          let orderObj = { orderItemId: item._id, fillingStatus: "Scheduled to " + dateSced };
          this.orderService.editItemOrder(orderObj).subscribe(res => {
            console.log(res);
            this.toastSrv.success(dateSced, "Schedule Saved");

          });
          console.log(scheduleLine);
        });

      } else {
        this.toastSrv.error("Item number missing");
      }

    } else {
      this.toastSrv.error("Invalid Date!");
    }
  }


  setBatch(item, batch, existBatch) {
    if (this.inputBatch.nativeElement.value != undefined) { }
    this.inputBatch.nativeElement.value;
    let updatedBatch = this.inputBatch.nativeElement.value.toLowerCase();
    updatedBatch = updatedBatch.trim();
    // batch=batch.toLowerCase();
    // batch=batch.trim();
    let cont = true;
    if (item.batch != "" && updatedBatch == '') {
      cont = confirm('למחוק אצווה?')
    }


    // if(existBatch!=null && existBatch!=undefined && existBatch!=""){
    //   //adding to exist batch number to oreder item
    //   updatedBatch=batch + "+" + existBatch;
    // }else{
    //   //adding new batch number to oreder item
    //   updatedBatch=batch;
    // }
    // let batchObj = { orderItemId: item._id, batch: updatedBatch, fillingStatus: "formula porduced " + updatedBatch };
    if (cont) {
      let batchObj = { orderItemId: item._id, batch: updatedBatch, fillingStatus: "formula porduced " + updatedBatch };
      console.log(batchObj);
      this.orderService.editItemOrder(batchObj).subscribe(res => {
        console.log(res);
        this.ordersItems.map(orderItem => {
          if (orderItem._id == item._id) {
            orderItem.batch = updatedBatch;
            orderItem.fillingStatus = "formula porduced " + updatedBatch;
          }
        });
        this.toastSrv.success(updatedBatch, "Changes Saved");
        this.inputBatch.nativeElement.value = "";
        this.editBatchN = false;
      });

    }

  }

  updateBatchExist(item, batch) {
    batch = batch.toLowerCase();
    if (!batch) {
      let batchObj = { orderItemId: item._id, fillingStatus: "mkp batch exist" };
      console.log(batchObj);
      this.orderService.editItemOrder(batchObj).subscribe(res => {
        console.log(res);
        // this.toastSrv.success(updatedBatch , "Changes Saved");
      });

    }

  }

  sendToProduction(){
    debugger;

    var production = {
      orderNumber:this.currItem.orderNumber,
      formuleNumber:this.currItem.itemNumber,
      formuleName:'',
      quantity:this.currItem.quantity,
      netWeightGr:this.currItem.netWeightGr,
      formuleId:this.currFormule[0]._id,
      user:this.user.userName
    }

    if(this.newProductionNetWeightGr != ''){
      production.netWeightGr = Number(this.newProductionNetWeightGr)
    }
    if(this.newProductionQuantity != ''){
      production.quantity = Number(this.newProductionQuantity)
    }

    this.orderService.sendFormuleToProduction(production).subscribe(data=>{
      debugger;
      if(data.msg == "sentToProduction"){
        this.toastSrv.success('Formule Sent To Production')
        this.newProductionNetWeightGr = ''
        this.newProductionQuantity = ''
        
      }
    })
  }


  searchItem(itemNumber) {
    if (itemNumber != "") {
      this.orderService.getItemByNumber(itemNumber).subscribe(res => {
        if (res.length == 1) {
          this.itemData.discription = res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
          this.itemData.netWeightGr = res[0].netWeightK;
          if (res[0].netWeightK != null && res[0].netWeightK != undefined && res[0].netWeightK != '') {
            this.itemData.netWeightGr = res[0].netWeightK;
          }
          this.itemData.itemImpRemark = res[0].impRemarks;
        }
      });

    }
  }

  closeOrder() {
    if (confirm("Close Order?")) {
      let orderToUpdate = {};
      orderToUpdate = { status: 'close', orderId: this.orderId }
      console.log(orderToUpdate);
      this.orderService.editOrder(orderToUpdate).subscribe(res => {
        console.log(res);
        this.router.navigate(['/']);
      });
    }
  }
  setOrderItemDone(item) {
    if (confirm("Item " + item.itemNumber + "\n From order " + item.orderNumber + "\n Is ready?")) {
      this.orderService.editItemOrderStatus(item).subscribe(res => {
        if (res._id) {
          this.ordersItems.filter(i => {
            if (i._id == res._id) {

              i.status = "done";
              i.color = "aquamarine";
              this.toastSrv.success('Item ' + i.itemNumber + ' set to Done');
            }
          });
        }
        console.log(res);
      });
    }

  }
  setPrintSced(orderItemId) {

    // this.printSchedule.date.setHours(2,0,0,0);
    let dateToUpdate = new Date(this.printSchedule.date);
    dateToUpdate.setHours(2, 0, 0, 0);
    console.log(this.printSchedule);
    this.printSchedule.orderN = this.number;
    this.printSchedule.costumer = this.costumer;
    this.printSchedule.date = dateToUpdate;
    // this.printSchedule.date=moment(this.printSchedule.date).format("YYYY-MM-DD");
    // this.printSchedule.date=moment(this.printSchedule.date.format());

    this.scheduleService.setNewPrintSchedule(this.printSchedule).subscribe(res => {
      if (res.itemN) {
        this.toastSrv.success("Saved", this.printSchedule.cmptN);
        console.log(res)
        // let dateSced= res.date.slice(0,10); // could also used for date string
        let dateSced = res.date.split('T')[0];
        let orderObj = { orderItemId: orderItemId, fillingStatus: "Sent to print " + dateSced };

        this.orderService.editItemOrder(orderObj).subscribe(res => {
          console.log(res);
          if (res.n > 0) {
            this.ordersItems.map(i => {
              if (i._id == orderItemId) i.fillingStatus = orderObj.fillingStatus;
            })
          }
          // this.toastSrv.success(dateSced , "Schedule Saved");
        });
      } else {
        this.toastSrv.error("Error - not sent to print schedule");
      }
    });

  }

  setToPrintDetails(content, item, cmpt) {

    this.itemSer.getPlateImg(item.itemNumber).subscribe(data => {

      this.plateImg = data.palletImg;
      this.printSchedule.block = data.palletNumber;
      this.printSchedule.blockImg = data.palletImg;
    });
    console.log(item.itemNumber + " , " + item.discription + " , " + cmpt.number);
    this.printSchedule.cmptN = cmpt.number;
    this.printSchedule.itemN = item.itemNumber;
    this.printSchedule.itemName = item.name + " " + item.subName + " " + item.discriptionK;
    this.printSchedule.cmptName = cmpt.discription;
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if (result == 'Saved') {
        if (confirm('שליחת פק"ע ללו"ז הדפסה תשנה את סטטוס הפריט בהזמנה.')) {
          this.setPrintSced(item._id);
        }
      }
    })
  }



  // changeText(ev)
  // {
  //   let word= ev.target.value;
  //   if(word=="")
  //   {
  //     this.ordersItems=this.ordersItemsCopy.slice();
  //   }
  //   else
  //   {
  //     this.ordersItems= this.ordersItems.filter(x=>x.itemFullName.toLowerCase().includes(word.toLowerCase()));
  //   }
  // }
  changeText(ev) {
    let word = ev.target.value;
    let wordsArr = word.split(" ");
    wordsArr = wordsArr.filter(x => x != "");
    if (wordsArr.length > 0) {
      let tempArr = [];
      this.ordersItemsCopy.filter(x => {
        var check = false;
        var matchAllArr = 0;
        wordsArr.forEach(w => {
          if ((x.itemFullName && x.itemFullName.toLowerCase().includes(w.toLowerCase())) || (x.discription && x.discription.toLowerCase().includes(w.toLowerCase()))) {
            matchAllArr++
          }
          (matchAllArr == wordsArr.length) ? check = true : check = false;
        });

        if (!tempArr.includes(x) && check) tempArr.push(x);
      });
      this.ordersItems = tempArr;
    } else {
      this.ordersItems = this.ordersItemsCopy.slice();
      // this.ordersItems= this.ordersItems.filter(x=>x.itemFullName.toLowerCase().includes(word.toLowerCase()));
    }
  }


  async openPackingModal(itemNumber, orderNumber, index) {
    this.packingItemN = itemNumber;
    this.packingOrderN = orderNumber;
    this.palletsData = [];

    await this.orderService.getItemPackingList(itemNumber, this.packingOrderN).subscribe(async itemPackingList => {
      this.itemPackingList = itemPackingList;

    });

    //   await this.orderService.getPalletsDataByOrderNumber(orderNumber).subscribe(orderPallets=>{
    //     this.palletsData = orderPallets
    //  });

    await this.orderService.getOrderPackingList(this.number).subscribe(async orderPackingList => {
      debugger;
      for (let i = 0; i < orderPackingList.length; i++) {
      orderPackingList[i].totalAmount = orderPackingList[i].pcsCtn*orderPackingList[i].ctnPallet
        
      }
      this.orderPackingList = orderPackingList;
    
      await this.orderPackingList.forEach(item => {
        let obj = { palletId: item.palletId, palletNumber: item.palletNumber, palletWeight: item.palletWeight, palletMesures: item.palletMesures }
        let palletId = item.palletId;
        if (!this.orderPalletsNumArr.includes(palletId)) {
          this.orderPalletsNumArr.push(palletId);
          this.orderPalletsArr.push(obj);
        }
      });

      await this.ordersItems.forEach(async (orderItem, key) => {
        let packedQnt = 0;
        let packedItemsOnPallet = 0;
        await this.orderPackingList.filter(packedItem => {
          if (orderItem.itemNumber == packedItem.itemNumber) {
            debugger;
            packedItemsOnPallet = packedItem.pcsCtn * packedItem.ctnPallet;
            packedQnt = packedQnt + packedItemsOnPallet
            packedItem.totalPackedQnt = packedQnt;

            if (orderItem.quantity == packedItem.totalPackedQnt) {
              packedItem.lineColor = "rgb(204, 255, 204)";
            } else {
              packedItem.lineColor = "rgb(255, 255, 204)";
            }
          }
        });
      });


    });
    this.openOrderPackingModalHeader = "אריזת הזמנה מספר  " + this.packingOrderN;
    this.openItemPackingModalHeader = "אריזת פריט מספר  " + this.packingItemN;
    // this.openOrderPackingModalHeader="אריזת הזמנה מספר  "+ this.packingItemN;
    this.packingModal = true;


  }


  // checkboxAllOrders(ev){
  //   this.ordersItems.filter(e => e.isSelected = ev.target.checked)
  // }


  returnStageColor(stage) {
    if (stage == "new") {
      this.stageColor = "white";
    } else if (stage == "partialCmpt") {
      this.stageColor = "#ffa64d";
    } else if (stage == "allCmpt") {
      this.stageColor = "#ffff80";
    } else if (stage == "production") {
      this.stageColor = "#b3ecff";
    } else if (stage == "prodFinish") {
      this.stageColor = "#d9b3ff";
    } else if (stage == "done") {
      this.stageColor = "#9ae59a";
    }
  }





  // getOrderItemsFromArray(){
  //   this.orderService.getOrderItemsFromArray().subscribe(data=>{
  //       this.excelService.exportAsExcelFile(data.docs, 'OrderItems');
  //       this.excelService.exportAsExcelFile(data.noResult, 'NoOrderItems');
  //   });
  // }


  getAllComponents() {
    this.inventoryService.getAllComponents().subscribe(components => {
      this.allComponents = components;


    });
  }

  async getUserInfo() {
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

        if (this.authService.loggedInUser.authorization.includes("showFormule")) {
          this.openFormule = true;
        }
      }

    });

  }










  async openCmptDemandsModal() {

    this.bottleList = [];
    this.capList = [];
    this.pumpList = [];
    this.sealList = [];
    this.stickerList = [];
    this.boxList = [];
    this.cartonList = [];
    this.itemTreeRemarks = [];
    if (this.ordersItems.length > 0) {
      ;
      this.internalNumArr = [];
      this.ordersItems.map(i => this.internalNumArr.push(i.itemNumber.trim()));
      await this.orderService.getOrderComponents(this.internalNumArr).subscribe(async res => {
        await res.forEach(async item => {

          let i = this.ordersItems.filter(x => x.itemNumber == item.itemNumber)[0];
          item.quantity = parseInt(i.quantity);
          item.itemName = i.discription;

          console.log("i from orderItems ", i)
          console.log("i.quantity", i.quantity);
          console.log("item.quantity", item.quantity);


          if (item.bottleNumber != '' && item.bottleNumber != '---') {

            let newCmpt = true;
            if (this.bottleList.map(function (el) { return el.bottleNumber; }).includes(item.bottleNumber)) {
              this.bottleList.map(i => {
                if (i.bottleNumber == item.bottleNumber) {
                  newCmpt = false;
                  i.qnt += parseInt(item.quantity);
                }

              });
            } else {
              if (newCmpt) {

                let bottleAmount = []
                bottleAmount = this.allComponents.filter(x => x.componentN == item.bottleNumber)
                this.bottleList.push({ bottleNumber: item.bottleNumber, qnt: item.quantity, amount: (bottleAmount[0].amountKasem + bottleAmount[0].amountRH) });
                newCmpt = false;

              }
            }
          }

          if (item.capNumber != '' && item.capNumber != '---') {
            let newCmpt = true;
            if (this.capList.map(function (el) { return el.capNumber; }).includes(item.capNumber)) {
              this.capList.map(i => {
                if (i.capNumber == item.capNumber) {
                  newCmpt = false;
                  i.qnt += parseInt(item.quantity);
                }
              });
            } else {
              if (newCmpt) {
                let capAmount = []
                capAmount = this.allComponents.filter(x => x.componentN == item.capNumber)
                this.capList.push({ capNumber: item.capNumber, qnt: item.quantity, amount: (capAmount[0].amountKasem + capAmount[0].amountRH) });
                newCmpt = false;
              }
            }
          }

          if (item.pumpNumber != '' && item.pumpNumber != '---') {
            let newCmpt = true;
            if (this.pumpList.map(function (el) { return el.pumpNumber; }).includes(item.pumpNumber)) {
              this.pumpList.map(i => {
                if (i.pumpNumber == item.pumpNumber) {
                  newCmpt = false;
                  // i= Object.assign(i, {qnt: i.qnt+parseInt(item.quantity) });
                  i.qnt += parseInt(item.quantity);
                }
              });
            } else {
              if (newCmpt) {
                let pumpAmount = []
                pumpAmount = this.allComponents.filter(x => x.componentN == item.pumpNumber)
                this.pumpList.push({ pumpNumber: item.pumpNumber, qnt: item.quantity, amount: (pumpAmount[0].amountKasem + pumpAmount[0].amountRH) });
                newCmpt = false;
              }
            }
          }

          if (item.sealNumber != '' && item.sealNumber != '---') {
            let newCmpt = true;
            if (this.sealList.map(function (el) { return el.sealNumber; }).includes(item.sealNumber)) {
              this.sealList.map(i => {
                if (i.sealNumber == item.sealNumber) {
                  newCmpt = false;
                  i.qnt += parseInt(item.quantity);
                }
              });
            } else {
              if (newCmpt) {
                let sealAmount = []
                sealAmount = this.allComponents.filter(x => x.componentN == item.sealNumber)
                this.sealList.push({ sealNumber: item.sealNumber, qnt: item.quantity, amount: (sealAmount[0].amountKasem + sealAmount[0].amountRH) });
                newCmpt = false;
              }
            }
          }

          if (item.stickerNumber != '' && item.stickerNumber != '---') {
            let newCmpt = true;
            if (this.stickerList.map(function (el) { return el.stickerNumber; }).includes(item.stickerNumber)) {
              this.stickerList.map(i => {
                if (i.stickerNumber == item.stickerNumber) {
                  newCmpt = false;
                  i.qnt += parseInt(item.quantity);
                }
              });
            } else {
              if (newCmpt) {

                this.stickerList.push({ stickerNumber: item.stickerNumber, qnt: item.quantity });
                newCmpt = false;
              }
            }
          }
          if (item.stickerTypeK != '' && item.stickerTypeK != '---') {
            let newCmpt = true;
            if (this.stickerList.map(function (el) { return el.stickerNumber; }).includes(item.stickerTypeK)) {
              this.stickerList.map(i => {
                if (i.stickerNumber == item.stickerTypeK) {
                  newCmpt = false;
                  i.qnt += parseInt(item.quantity);
                }
              });
            } else {
              if (newCmpt) {
                this.stickerList.push({ stickerNumber: item.stickerTypeK, qnt: item.quantity });
                newCmpt = false;
              }
            }
          }

          if (item.boxNumber != '' && item.boxNumber != '---') {
            let newCmpt = true;
            if (this.boxList.map(function (el) { return el.boxNumber; }).includes(item.boxNumber)) {
              this.boxList.map(i => {
                if (i.boxNumber == item.boxNumber) {
                  newCmpt = false;
                  i.qnt += parseInt(item.quantity);
                }
              });
            } else {
              if (newCmpt) {
                let boxAmount = []
                boxAmount = this.allComponents.filter(x => x.componentN == item.boxNumber)
                this.boxList.push({ boxNumber: item.boxNumber, qnt: item.quantity, amount: (boxAmount[0].amountKasem + boxAmount[0].amountRH) });
                newCmpt = false;
              }
            }
          }
          if (item.boxTypeK != '' && item.boxTypeK != '---') {
            let newCmpt = true;
            if (this.boxList.map(function (el) { return el.boxNumber; }).includes(item.boxTypeK)) {
              this.boxList.map(i => {
                if (i.boxNumber == item.boxTypeK) {
                  newCmpt = false;
                  i.qnt += parseInt(item.quantity);
                }
              });
            } else {
              if (newCmpt) {
                this.boxList.push({ boxNumber: item.boxTypeK, qnt: item.quantity });
                newCmpt = false;
              }
            }
          }

          if (item.cartonNumber != '' && item.cartonNumber != '---') {
            let newCmpt = true;
            if (this.cartonList.map(function (el) { return el.cartonNumber; }).includes(item.cartonNumber)) {
              this.cartonList.map(i => {
                if (i.cartonNumber == item.cartonNumber) {
                  newCmpt = false;
                  i.qnt = i.qnt + (item.quantity / parseInt(item.PcsCarton));
                }
              });
            } else {
              if (newCmpt) {
                let cartonAmount = []
                cartonAmount = this.allComponents.filter(x => x.componentN == item.cartonNumber)
                this.cartonList.push({ cartonNumber: item.cartonNumber, qnt: (item.quantity / parseInt(item.PcsCarton)), amount: (cartonAmount[0].amountKasem + cartonAmount[0].amountRH) });
                newCmpt = false;
              }
            }
          }

          if (item.pallet != '' && item.pallet != '---') {
            let newCmpt = true;
            if (this.platesList.map(function (el) { return el.palletNumber; }).includes(item.pallet)) {
              this.platesList.map(i => {
                if (i.palletNumber == item.pallet) {
                  newCmpt = false;
                }
              });
            } else {
              if (newCmpt) {
                this.platesList.push({ palletNumber: item.pallet });
                newCmpt = false;
              }
            }
          }
          if (item.pallet2 != '' && item.pallet2 != '---') {
            let newCmpt = true;
            if (this.platesList.map(function (el) { return el.palletNumber; }).includes(item.pallet2)) {
              this.platesList.map(i => {
                if (i.palletNumber == item.pallet2) {
                  newCmpt = false;
                }
              });
            } else {
              if (newCmpt) {
                this.platesList.push({ palletNumber: item.pallet2 });
                newCmpt = false;
              }
            }
          }
          if (item.pallet3 != '' && item.pallet3 != '---') {
            let newCmpt = true;
            if (this.platesList.map(function (el) { return el.palletNumber; }).includes(item.pallet3)) {
              this.platesList.map(i => {
                if (i.palletNumber == item.pallet3) {
                  newCmpt = false;
                }
              });
            } else {
              if (newCmpt) {
                this.platesList.push({ palletNumber: item.pallet3 });
                newCmpt = false;
              }
            }
          }

          if (item.impRemarks != '' || item.proRemarks != '') {
            this.itemTreeRemarks.push(item);
          }

        });

        this.orderItemsComponents = res;
        this.cmptModal = true;
      });
    }




    /*
    FIELDS WE WANT TO GET FOR EACH ORDER_ITEM FROM ITEMS COLLECTION

    itemNumber

    stickerNumber: String,
    stickerTypeK: String,
    StickerLanguageK: String,

    boxNumber: String,
    boxTypeK: String,

    cartonNumber: String,
    PcsCarton: String,
    *** cartonNumberQnt:  =Qnt/PcsCarton: ***

    bottleNumber: String,
    capNumber: String,
    pumpNumber: String,
    sealNumber: String,
    goddet: ???


    */
  }


}

  // getItemWhShelfsList(orderItemsCmptArr) {

  //   return new Promise(function (resolve, reject) {
  //       if () {
  //         resolve(res);
  //       } else resolve([])
  //   });
  // }






