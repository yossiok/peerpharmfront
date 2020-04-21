import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts } from '@angular/router'
import { ItemsService } from '../../../services/items.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadFileService } from 'src/app/services/helpers/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import * as moment from 'moment';
import { InventoryService } from 'src/app/services/inventory.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BatchesService } from 'src/app/services/batches.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-itemdetais',
  templateUrl: './itemdetais.component.html',
  styleUrls: ['./itemdetais.component.css']
})
export class ItemdetaisComponent implements OnInit {

  @ViewChild('rows') rows: ElementRef;
  @ViewChild('colums') colums: ElementRef;
  @ViewChild('container')
  private container: ElementRef;
  // New Item Tree // 
  itemBatches:any[];
  ordersItem:any[];
  allCostumers:any[]; 
  allCostumersCopy:any[]; 

  mainLanguage: Boolean = true;
  mainLanguageTwo: Boolean = true;
  mainLanguageThree: Boolean = true;
  mainLanguageFour: Boolean = true;
  department: Boolean = true;
  production: Boolean = false
  productionTwo: Boolean = false
  productionThree: Boolean = false
  productionFour: Boolean = false
  productionFive: Boolean = false
  productionSix: Boolean = false
  productionSeven: Boolean = false
  productionEight: Boolean = false
  volumeMl: Boolean = true
  netWeightK: Boolean = true
  grossWeightUnit: Boolean = true
  peerPharmTone: Boolean = true
  laserAndExp: Boolean = true;
  remarksAlert: Boolean = false;
  notActiveAlert:Boolean = false;
  editSpecTable:Boolean = false;

  productionType: '';
  productionTwoType: '';
  productionThreeType: '';
  productionFourType: '';
  productionFiveType: '';
  productionSixType: '';
  productionSevenType: '';
  productionEightType: '';

  productionImage:'';
  productionTwoImage:'';
  productionThreeImage:'';
  productionFourImage:'';
  productionFiveImage:'';
  productionSixImage:'';
  productionSevenImage:'';
  productionEightImage:'';

  // End of New Item Tree //
  alowUserEditItemTree: Boolean = false;
  allowEditSpecTable: Boolean = false;
  mainDivArr: any = [];
  dataDiv: any = [];
  newItem: FormGroup;
  item: any = {};
  itemCopy: any = {};
  licsensDateToSend: Date;
  user: UserInfo;
  userName = ""
  itemShown = {
    itemNumber: '',
    name: '',
    subName: '',
    discriptionK: '',
    proRemarks: '',
    impRemarks: '',

    typeOfComponent:'',
    typeOfComponentTwo:'',
    typeOfComponentThree:'',
    typeOfComponentFour:'',
    typeOfComponentFive:'',
    typeOfComponentSix:'',
    typeOfComponentSeven:'',
    typeOfComponentEight:'',

    numberOfPcs:'',
    numberOfPcsTwo:'',
    numberOfPcsThree:'',
    numberOfPcsFour:'',
    numberOfPcsFive:'',
    numberOfPcsSix:'',
    numberOfPcsSeven:'',
    numberOfPcsEight:'',

    laserYear:'',
    laserPP:'',
    laserMonth:'',
    expMonth:'',
    expYear:'',
    laserLocation:'',


    updateDate: '',
    nameOfupdating: '',
    versionNumber: '',
    scheduleRemark:'',

    status:'',
    department:'',
    stickerNumber: '',
    stickerTypeK: '',
    boxNumber: '',
    boxTypeK: '',
    barcodeK: '',
    StickerLanguageK: '',
    StickerLanguageKTwo:'',
    StickerLanguageKThree:'',
    StickerLanguageKFour:'',
    volumeKey: '',
    netWeightK: '',
    grossUnitWeightK: '',
    peerPharmTone:'',

    productionInput:'',
    productionTwoInput:'',
    productionThreeInput:'',
    productionFourInput:'',
    productionFiveInput:'',
    productionSixInput:'',
    productionSevenInput:'',
    productionEightInput:'',

    productionImage:'',
    productionTwoImage:'',
    productionThreeImage:'',
    productionFourImage:'',
    productionFiveImage:'',
    productionSixImage:'',
    productionSevenImage:'',
    productionEightImage:'',

    productionType:'',
    productionTwoType:'',
    productionThreeType:'',
    productionFourType:'',
    productionFiveType:'',
    productionSixType:'',
    productionSevenType:'',
    productionEightType:'',



    licsensNumber: '',
    licsensDate: '',
    yearsUntillExpired: '',
    country: '',

    netCtnWeightK: '',
    grossCtnWeightK: '',

    cartonNumber: '',
    PcsCarton: '',
    pumpDirection: '',
    paletteType: '',
    st1layerCarton: '',
    totalCartonPalette: '',

    brand:'',
    costumerId:'',
    costumerName:'',

    cbm: '',
    motherP: '',
    itemType: '',

    item1w: '',
    item1s: '',
    item2w: '',
    item2s: '',
    item3w: '',
    item3s: '',
    item4w: '',
    item4s: '',
    itemStickerW: '',
    itemStickerS: '',
    itemBoxS: '',
    itemBoxW: '',
    itemCtnW: '',
    itemCtnS: '',

    euPallet: '',
    usPallet: '',

    euSt1layerCarton:'',
    usSt1layerCarton:'',
    euTotalCartonPalette:'',
    usTotalCartonPalette:'',
    usCbm:'',
    euCbm:'',
    
    bottleNumber: '',
    capNumber: '',
    pumpNumber: '',
    sealNumber: '',

    bottleTube: '',
    capTube: '',
    pumpTube: '',
    sealTube: '',

    extraText1: '',
    extraText2: '',

    componentType:'',
    componentTwoType:'',
    componentThreeType:'',
    componentFourType:'',
    componentFiveType:'',

    bottleImage: '',
    capImage: '',
    pumpImage: '',
    laserImage1: '',
    laserImage2: '',
    imgMain1: '',
    imgMain2: '',
    imgMain3: '',
    imgMain4: '',

    extraImage1: '',
    extraImage2: '',
    sealImage: '',

    pallet: '',
    pallet1x: '',
    pallet1y: '',
    pallet2: '',
    pallet2x: '',
    pallet2y: '',
    pallet3: '',
    pallet3x: '',
    pallet3y: '',

    goddetShape: '',

    msdsFileLink: '',
    licenceFileLink: '',
    plateFileLink: '',
    labelFileLink: '',
    wordLabelFileLink: '',
    coaFileLink: '',

    phRemarks:'',
    phLimitsMin:'',
    phLimitsMax:'',
    densityRemarks:'',
    densityLimitsMin:'',
    densityLimitsMax:'',
    viscosityRemarks:'',
    viscosityLimitsMin:'',
    viscosityLimitsMax:'',
    spinFieldNum:'',
    modelType:'',
    spinSpeed:'',
    percentageResult:'',
    testTemp:'',
    colorRemarks:'',
    color:'',
    textureRemarks:'',
    textureSpec:'',
    scentRemarks:'',
    scentSpec:'',

  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    
  }


  constructor(private excelService:ExcelService,private orderService:OrdersService,private batchService:BatchesService ,private modalService:NgbModal,private costumersService: CostumersService,private route: ActivatedRoute, private itemsService: ItemsService, private fb: FormBuilder, private renderer: Renderer2, private invtSer: InventoryService,
    private uploadService: UploadFileService, private toastr: ToastrService, private authService: AuthService) {
    this.itemCopy = Object.assign({}, this.itemShown);
    this.newItem = fb.group({
      itemNumber: [null, Validators.required],
      name: [null, Validators.required],
      subName: [null, Validators.required],
      discriptionK: [null, Validators.required],
      proRemarks: [null, Validators.required],
      impRemarks: [null, Validators.required],

      updateDate: [null, Validators.required],
      nameOfupdating: [null, Validators.required],
      versionNumber: [null, Validators.required],

      stickerNumber: [null, Validators.required],
      stickerTypeK: [null, Validators.required],
      boxNumber: [null, Validators.required],
      boxTypeK: [null, Validators.required],
      barcodeK: [null, Validators.required],
      StickerLanguageK: [null, Validators.required],
      volumeKey: [null, Validators.required],
      netWeightK: [null, Validators.required],
      grossUnitWeightK: [null, Validators.required],

      licsensNumber: [null, Validators.required],
      licsensDate: [Date, Validators.required],
      yearsUntillExpired: [null, Validators.required],
      country: [null, Validators.required],

      netCtnWeightK: [null, Validators.required],
      grossCtnWeightK: [null, Validators.required],

      cartonNumber: [null, Validators.required],
      PcsCarton: [null, Validators.required],
      pumpDirection: [null, Validators.required],
      paletteType: [null, Validators.required],
      st1layerCarton: [null, Validators.required],
      totalCartonPalette: [null, Validators.required],

      cbm: [null, Validators.required],
      motherP: [null, Validators.required],
      itemType: [null, Validators.required],
      scheduleRemark: [null, Validators.required],
     

      item1w: [null, Validators.required],
      item1s: [null, Validators.required],
      item2s: [null, Validators.required],
      item2w: [null, Validators.required],
      item3s: [null, Validators.required],
      item3w: [null, Validators.required],
      item4s: [null, Validators.required],
      item4w: [null, Validators.required],
      itemStickerW: [null, Validators.required],
      itemStickerS: [null, Validators.required],
      itemBoxS: [null, Validators.required],
      itemBoxW: [null, Validators.required],
      itemCtnW: [null, Validators.required],
      itemCtnS: [null, Validators.required],

      bottleNumber: [null, Validators.required],
      capNumber: [null, Validators.required],
      pumpNumber: [null, Validators.required],
      sealNumber: [null, Validators.required],

      bottleTube: [null, Validators.required],
      capTube: [null, Validators.required],
      pumpTube: [null, Validators.required],
      sealTube: [null, Validators.required],

      extraText1: [null, Validators.required],
      extraText2: [null, Validators.required],

      bottleImage: [null, Validators.required],
      capImage: [null, Validators.required],
      pumpImage: [null, Validators.required],
      laserImage1: [null, Validators.required],
      laserImage2: [null, Validators.required],
      imgMain1: [null, Validators.required],
      imgMain2: [null, Validators.required],
      imgMain3: [null, Validators.required],

      extraImage1: [null, Validators.required],
      extraImage2: [null, Validators.required],
      sealImage: [null, Validators.required],

      pallet: [null, Validators.required],
      pallet1x: [null, Validators.required],
      pallet1y: [null, Validators.required],
      pallet2: [null, Validators.required],
      pallet2x: [null, Validators.required],
      pallet2y: [null, Validators.required],
      pallet3: [null, Validators.required],
      pallet3x: [null, Validators.required],
      pallet3y: [null, Validators.required],
    });
  }

  showGoddet() {
    // this.container.nativeElement.removeChild();


    const childElements = this.container.nativeElement.children;
    for (let child of childElements) {
      this.renderer.removeChild(this.container.nativeElement, child);
    }

    const r = this.rows.nativeElement.value;
    const c = this.colums.nativeElement.value;

    for (let i = 0; i < r; i++) {
      const rowDiv = this.renderer.createElement('div');
      this.renderer.setStyle(rowDiv, 'display', 'block');
      this.renderer.appendChild(this.container.nativeElement, rowDiv);
      for (let j = 1; j <= c; j++) {
        let cell = j + c * i;
        const columnDiv = this.renderer.createElement('div');
        const text = this.renderer.createText('[' + cell + ']');
        this.renderer.appendChild(columnDiv, text);
        this, this.renderer.setAttribute(columnDiv, "class", "cellDiv");
        /*this.renderer.setStyle(columnDiv, 'color', 'blue');*/
        this.renderer.listen(columnDiv, 'click', () => {
          let color;
          let setColor = prompt("Enter Color", "");
          if (setColor == null || setColor == "") {
            color = "N/A";
          } else {
            color = setColor;
          }
          console.log(color);
          console.log(cell);
          columnDiv.innerHTML = color;
        });
        this.renderer.appendChild(this.container.nativeElement, columnDiv);
      }
    }
  }


  exportAsXLSX() {
       debugger
    this.excelService.exportAsExcelFile([this.itemShown], 'data');
 }




  fillBottle(ev) {
    debugger
    var bottleNumber = ev.target.value;

    if (bottleNumber != "---" || "") {
      this.invtSer.getCmptByNumber(bottleNumber, "component").subscribe(data => {
        this.itemShown.bottleTube = data[0].componentName
        this.itemShown.bottleImage = data[0].img
        this.itemShown.componentType = data[0].componentType
      })
    } else if (bottleNumber == "---") {
      this.itemShown.bottleTube = ""
      this.itemShown.bottleImage = ""
    }
  }

  fillCap(ev) {
    debugger;
    var capNumber = ev.target.value;

    if (capNumber != "---" || "") {
      this.invtSer.getCmptByNumber(capNumber, "component").subscribe(data => {
        this.itemShown.capTube = data[0].componentName
        this.itemShown.capImage = data[0].img
        this.itemShown.componentTwoType = data[0].componentType
      })
    } else if (capNumber == "---") {
      this.itemShown.capTube = ""
      this.itemShown.capImage = ""
    }
  }

  fillPump(ev) {
    debugger;
    var pumpNumber = ev.target.value;

    if (pumpNumber != "---" || "") {
      this.invtSer.getCmptByNumber(pumpNumber, "component").subscribe(data => {
        this.itemShown.pumpTube = data[0].componentName
        this.itemShown.pumpImage = data[0].img
        this.itemShown.componentThreeType = data[0].componentType
      })
    } else if (pumpNumber == "---") {
      this.itemShown.pumpTube = ""
      this.itemShown.pumpImage = ""
    }
  }

  fillSeal(ev) {
    var sealNumber = ev.target.value;

    if (sealNumber != "---" || "") {
      this.invtSer.getCmptByNumber(sealNumber, "component").subscribe(data => {
        this.itemShown.sealTube = data[0].componentName
        this.item.sealImage = data[0].img
        this.itemShown.componentFourType = data[0].componentType
      })
    } else if (sealNumber == "---") {
      this.itemShown.sealTube = ""
      this.item.sealImage = ""

    }
  }

  openBatchModal(batches) {
    debugger;
    var itemNumber = this.itemShown.itemNumber
    this.batchService.getBatchesByItemNumber(itemNumber).subscribe(data=>{
      this.itemBatches = data;
    })
    // this.contact = this.costumers[i].contact[0];
    this.modalService.open(batches).result.then((result) => {
      console.log(result);
    
    })
  }


  openOrderModal(orders){
    var itemNumber = this.itemShown.itemNumber
  
    this.orderService.getOrderItemsByitemNumber(itemNumber).subscribe(data=>{
      debugger;
      this.ordersItem = data;
    })
    this.modalService.open(orders).result.then((result) => {
      console.log(result);
    })
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

  findInInventory(componentN) {


window.open('http://peerpharmsystem.com/#/peerpharm/inventory/stock?componentN='+componentN)
  }


  getAllCostumers(){
    this.costumersService.getAllCostumers().subscribe(data=>{
      this.allCostumers = data;
      this.allCostumersCopy = data;
    })
  }

  fillCostumerDetails(ev){
    debugger;

    ev.target.value;
    var costumerName = ev.target.value;

   var costumer = this.allCostumers.find(costumer=>costumer.costumerName == costumerName )

   this.itemShown.costumerId = costumer.costumerId
   
   
  }

  searchCompNumberByComp(compNumber, src)
  {
    var itemType = "component";
  
    switch (src) {
      case 'productionInput':
        if (compNumber != "") {
          this.invtSer.getCmptByitemNumber(compNumber).subscribe(data => {
            data
            this.itemShown.productionType = data[0].componentType
            this.itemShown.productionImage = data[0].img

          })

        } else {
          this.productionType = "";
        }
        break;
      case 'productionTwoInput':
        if (compNumber != "") {
          this.invtSer.getCmptByNumber(compNumber, itemType).subscribe(data => {
            data
            this.itemShown.productionTwoType = data[0].componentType
            this.itemShown.productionTwoImage = data[0].img

          })

        } else {
          this.productionTwoType = "";
        }
        break;
      case 'productionThreeInput':
        if (compNumber != "") {
          this.invtSer.getCmptByNumber(compNumber, itemType).subscribe(data => {
            data
            this.itemShown.productionThreeType = data[0].componentType
            this.itemShown.productionThreeImage = data[0].img

          })

        } else {
          this.itemShown.productionThreeType = "";
        }
        break;
      case 'productionFourInput':
        if (compNumber != "") {
          this.invtSer.getCmptByNumber(compNumber, itemType).subscribe(data => {
            data
            this.itemShown.productionFourType = data[0].componentType
            this.itemShown.productionFourImage = data[0].img

          })

        } else {
          this.itemShown.productionFourType = "";
        }
        break;
      case 'productionFiveInput':
        if (compNumber != "") {
          this.invtSer.getCmptByNumber(compNumber, itemType).subscribe(data => {
            data
            this.itemShown.productionFiveType = data[0].componentType
            this.itemShown.productionFiveImage = data[0].img  
          })

        } else {
          this.productionFiveType = "";
        }
        break;
      case 'productionSixInput':
        if (compNumber != "") {
          this.invtSer.getCmptByNumber(compNumber, itemType).subscribe(data => {
            data
            this.itemShown.productionSixType = data[0].componentType
            this.itemShown.productionSixImage = data[0].img  
          })

        } else {
          this.itemShown.productionSixType = "";
        }
        break;
      case 'productionSevenInput':
        if (compNumber != "") {
          this.invtSer.getCmptByNumber(compNumber, itemType).subscribe(data => {
            data
            this.itemShown.productionSevenType = data[0].componentType
            this.itemShown.productionSevenImage = data[0].img

          })

        } else {
          this.productionSevenType = "";
        }
        break;
      case 'productionEightInput':
        if (compNumber != "") {
          this.invtSer.getCmptByNumber(compNumber, itemType).subscribe(data => {
            data
            this.itemShown.productionEightType = data[0].componentType
            this.itemShown.productionEightImage = data[0].img

          })

        } else {
          this.itemShown.productionEightType = "";
        }
        break;
    }
  }


  searchCompNumber(ev, src) {
    var compNumber = ev.target.value;
    this.searchCompNumberByComp(compNumber, src);

  }

  saveSpecTable(){
    debugger;

    this.editSpecTable = false;

    this.itemsService.saveSpecSettings(this.itemShown).subscribe(data=>{
      if(data){
        this.toastr.success('עודכן בהצלחה !')
      }
    })
  }

  getGoddetData() {
    
    let div = this.container.nativeElement;
    this.mainDivArr = [];
    let divArr = [];
    for (let innerDiv of div.getElementsByTagName('div')) {
      if (innerDiv.innerHTML) {
        divArr.push(innerDiv.innerHTML);
      }
      else {
        this.mainDivArr.push(divArr);
        divArr = [];
      }
    }
    this.mainDivArr.push(divArr);
    this.mainDivArr.shift();
    console.log(this.mainDivArr);
    this.itemShown['goddet'] = this.mainDivArr;
  }

  showGoddetData() {
    const r = this.dataDiv.length;
    const c = this.dataDiv[0].length;
    for (let i = 0; i < r; i++) {
      const rowDiv = this.renderer.createElement('div');
      this.renderer.setStyle(rowDiv, 'display', 'block');
      this.renderer.appendChild(this.container.nativeElement, rowDiv);
      for (let j = 0; j < c; j++) {
        let cell = j + c * i;
        const columnDiv = this.renderer.createElement('div');
        const text = this.renderer.createText(this.dataDiv[i][j]);
        this.renderer.appendChild(columnDiv, text);
        this, this.renderer.setAttribute(columnDiv, "class", "cellDiv");
        if (this.itemShown.goddetShape == 'sqaure' || this.itemShown.goddetShape == 'rectangle') {
          this.renderer.setStyle(columnDiv, 'border-radius', '0px');
          if (this.itemShown.goddetShape == 'rectangle') {
            this.renderer.setStyle(columnDiv, 'height', '83px');
            this.renderer.setStyle(columnDiv, 'width', '47px');
            this.renderer.setStyle(columnDiv, 'text-align', 'left');
            this.renderer.setStyle(columnDiv, 'padding', '0px');
          }
        }
        this.renderer.listen(columnDiv, 'click', () => {
          let color;
          let setColor = prompt("Enter Color", "");
          if (setColor == null || setColor == "") {
            color = "N/A";
          } else {
            color = setColor;
          }
          console.log(color);
          console.log(cell);
          columnDiv.innerHTML = color;
        });
        this.renderer.appendChild(this.container.nativeElement, columnDiv);
      }
    }
  }
  ngOnInit() {
    this.getAllCostumers()
    this.getUserInfo();
    this.getItemData();

   
    //  this.showGoddetData();
  }


  jumpingRemark(){
    debugger;
    if(this.itemShown.proRemarks != "" && this.itemShown.proRemarks != undefined && this.itemShown.proRemarks != null) {
      if(this.remarksAlert == true){
        this.remarksAlert = false;
      } 
      else { 
        this.remarksAlert = true;
      }
      
   
    }
  }
  notActive(){
    debugger;
    if(this.itemShown.status == "notActive") {
      if(this.notActiveAlert == true){
        this.notActiveAlert = false;
      } 
      else { 
        this.notActiveAlert = true;
      }
      
   
    }
  }

  checkItemStatus()
  {
    
      if(this.itemShown.status === 'perfect') {
       
        return "green";
      
      } if (this.itemShown.status === 'notActive') {

        return "red"
      } if (this.itemShown.status === 'active'){
        return "red"
      }

  }

  itemBackgroundByStatus() { 
    if(this.itemShown.status === 'notActive'){
      return "backgroundRed"
    }
  }

  getItemData() {
    debugger;
   this.route.params.subscribe(data=>
      {
        let number=data.itemNumber;
        if (number) {
          this.itemsService.getItemData(number).subscribe(res => {
            console.log(res);
            
            this.item = res[0];
            this.itemShown = res[0];
            this.itemShown.updateDate = moment(this.itemShown.updateDate).format("YYYY-MM-DD");
            if (this.itemShown.licsensDate != null) {
              this.itemShown.licsensDate = moment(this.itemShown.licsensDate).format("YYYY-MM-DD");
            }
            
            
            this.searchForItem(data.itemNumber)
            debugger
            this.dataDiv = res[0].goddet;
            this.showGoddetData();
          
          });
        }
      })
 
 
  }
  search(event, item) {
    if (event.key === "Enter") {
      this.searchForItem(item)
    }
  }
  searchForItem(item) {

    
    this.itemsService.getItemData(item).subscribe(res => {
      debugger;
      console.log(res.length)
     
      if (res.length == 0) {
        this.toastr.error(item, "Item Not found");
        this.itemShown = Object.assign({}, this.itemCopy);
        this.dataDiv = ["", ""];
        this.showGoddet();
      }
      else { 
        
        this.item = res[0];
        this.itemShown = res[0];
       
 
        this.searchCompNumberByComp(this.itemShown.bottleNumber,'productionInput')
        this.searchCompNumberByComp(this.itemShown.capNumber,'productionTwoInput')
        this.searchCompNumberByComp(this.itemShown.pumpNumber,'productionThreeInput')
        this.searchCompNumberByComp(this.itemShown.sealNumber,'productionFourInput')
        this.itemShown.productionInput = this.itemShown.bottleNumber
        this.itemShown.productionTwoInput = this.itemShown.capNumber
        this.itemShown.productionThreeInput = this.itemShown.pumpNumber
        this.itemShown.productionFourInput = this.itemShown.sealNumber
      
        var costumer = this.allCostumersCopy.filter(costumer=>costumer.brand == this.itemShown.name);
        this.allCostumers = costumer
        
        this.itemShown.updateDate = moment(this.itemShown.updateDate).format("YYYY-MM-DD");
        //null as moment format returns="invalid date"
        if (this.itemShown.licsensDate != null) {
          this.itemShown.licsensDate = moment(this.itemShown.licsensDate).format("YYYY-MM-DD");
        };
        this.checkIfTrueOrFalse();
        console.log(res[0]);
        this.dataDiv = res[0].goddet;
        // this.showGoddetData();
        this.jumpingRemark();
        this.notActive();
      }
    })
  }

  checkIfTrueOrFalse(){

    if(this.itemShown.StickerLanguageK == '' || this.itemShown.StickerLanguageK == '---' || this.itemShown.StickerLanguageK == undefined ) {
      this.mainLanguage = false
     
    } else {
      this.mainLanguage = true
    }

    if(this.itemShown.StickerLanguageKTwo == '' || this.itemShown.StickerLanguageKTwo == '---' || this.itemShown.StickerLanguageKTwo == undefined) {
      this.mainLanguageTwo = false
    } else {
      this.mainLanguageTwo = true
    }

    if(this.itemShown.StickerLanguageKThree == '' || this.itemShown.StickerLanguageKThree == '---' || this.itemShown.StickerLanguageKThree == undefined) {
      this.mainLanguageThree = false
    } else {
      this.mainLanguageThree = true
    }
    if(this.itemShown.StickerLanguageKFour == '' || this.itemShown.StickerLanguageKFour == '---' || this.itemShown.StickerLanguageKFour == undefined) {
      this.mainLanguageFour = false
    } else {
      this.mainLanguageFour = true
    }

    if(this.itemShown.department == '' || this.itemShown.department == '---' || this.itemShown.department == undefined) {
      this.department = false
    } else {
      this.department = true
    }

    if(this.itemShown.volumeKey == '' || this.itemShown.volumeKey == '---' || this.itemShown.volumeKey == undefined) {
      this.volumeMl = false
    } else {
      this.volumeMl = true
    }

    if(this.itemShown.netWeightK == '' || this.itemShown.netWeightK == '---' || this.itemShown.netWeightK == undefined) {
      this.netWeightK = false
    } else {
      this.netWeightK = true
    }

    if(this.itemShown.grossUnitWeightK == '' || this.itemShown.grossUnitWeightK == '---' || this.itemShown.grossUnitWeightK == undefined) {
      this.grossWeightUnit = false
    } else {
      this.grossWeightUnit = true
    }

    if(this.itemShown.peerPharmTone == '' || this.itemShown.peerPharmTone == '---' || this.itemShown.peerPharmTone == undefined) {
      this.peerPharmTone = false
    } else {
      this.peerPharmTone = true
    }

    if(this.itemShown.productionInput == '' || this.itemShown.productionInput == '---' || this.itemShown.productionInput == undefined) {
      this.production = false
      this.productionType = ''
      this.productionImage = ''
    } else {
      this.production = true
    }
    
    if(this.itemShown.productionTwoInput == '' || this.itemShown.productionTwoInput == '---' || this.itemShown.productionTwoInput == undefined) {
      this.productionTwo = false
      this.productionTwoType = ''
      this.productionTwoImage = ''
    } else {
      this.productionTwo = true
    }

    if(this.itemShown.productionThreeInput == '' || this.itemShown.productionThreeInput == '---' || this.itemShown.productionThreeInput == undefined) {
      this.productionThree = false
      this.productionThreeType = ''
      this.productionThreeImage = ''
      
    } else {
      this.productionThree = true
    }

    if(this.itemShown.productionFourInput == '' || this.itemShown.productionFourInput == '---' || this.itemShown.productionFourInput == undefined) {
      this.productionFour = false
      this.productionFourType = ''
      this.productionFourImage = ''
    } else {
      this.productionFour = true
    }

    if(this.itemShown.productionFiveInput == '' || this.itemShown.productionFiveInput == '---' || this.itemShown.productionFiveInput == undefined) {
      this.productionFive = false
      this.productionFiveType = ''
      this.productionFiveImage = ''
    } else {
      this.productionFive = true
    }

    if(this.itemShown.productionSixInput == '' || this.itemShown.productionSixInput == '---' || this.itemShown.productionSixInput == undefined) {
      this.productionSix = false
      this.productionSixType = ''
      this.productionSixImage = ''
    } else {
      this.productionSix = true
    }

    if(this.itemShown.productionSevenInput == '' || this.itemShown.productionSevenInput == '---' || this.itemShown.productionSevenInput == undefined) {
      this.productionSeven = false
      this.productionSevenType = ''
      this.productionSevenImage = ''
    } else {
      this.productionSeven = true
    }

    if(this.itemShown.productionEightInput == '' || this.itemShown.productionEightInput == '---' || this.itemShown.productionEightInput == undefined) {
      this.productionEight = false
      this.productionEightType = ''
      this.productionEightImage = ''
    } else {
      this.productionEight = true
    }


  }

  async writeItemData() {
    debugger;
    this.editSpecTable = false;
    if(this.itemShown.status == "production") {
      if(this.authService.loggedInUser.userName == "Sigi" || this.authService.loggedInUser.userName == 'akiva'){
        
        if (this.itemShown.itemNumber != "") {
          if (confirm("Save changes?")) {
            await this.itemsService.getItemData(this.itemShown.itemNumber).subscribe(itemNumRes => {
              if (itemNumRes.length > 0) {
                if (confirm("Item alerady exist!\nDo you want to update item number: " + this.itemShown.itemNumber + " ?")) {
                  this.updateItemTree();
                }
              } else {
                if (confirm("Create New item number : " + this.itemShown.itemNumber + " ?")) {
                  this.updateItemTree();
                }
              }
            });
          }
        }
    
      } else {
        this.toastr.error("Only Sigalit & Akiva can change this item Status")
      }
    } else { 
      if (this.itemShown.itemNumber != "") {
        if (confirm("Save changes?")) {
          await this.itemsService.getItemData(this.itemShown.itemNumber).subscribe(itemNumRes => {
            if (itemNumRes.length > 0) {
              if (confirm("Item alerady exist!\nDo you want to update item number: " + this.itemShown.itemNumber + " ?")) {
                this.updateItemTree();
              }
            } else {
              if (confirm("Create New item number : " + this.itemShown.itemNumber + " ?")) {
                this.updateItemTree();
              }
            }
          });
        }
      }
    }

  }

  updateItemTree() {
   
    if(this.itemShown.status == 'production') {
      if(confirm('שים לב , אתה מנסה לעדכן מוצר עם סטטוס פיתוח')){
         if (this.itemShown.itemNumber != "") {
      this.itemShown.nameOfupdating = this.user.userName;
      // this.getGoddetData();
      // this.itemShown.updateDate;
      this.itemsService.addorUpdateItem(this.itemShown).subscribe(res => {
        console.log(res)
        this.toastr.success("Saved", "Changes Saved fot item number: " + this.itemShown.itemNumber);
        this.editSpecTable = false;
      });
    } else {
      this.toastr.error("No item number!");
    } 
      } 
    } else {
      if (this.itemShown.itemNumber != "") {
        this.itemShown.nameOfupdating = this.user.userName;
        // this.getGoddetData();
        // this.itemShown.updateDate;
        this.itemsService.addorUpdateItem(this.itemShown).subscribe(res => {
          console.log(res)
          this.toastr.success("Saved", "Changes Saved fot item number: " + this.itemShown.itemNumber);
        });
      } else {
        this.toastr.error("No item number!");
      } 
    }
       
    
 
  }

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  docPath;
  bottleFile: boolean = false;
  pumpFile: boolean = false;
  sealFile: boolean = false;
  capFile: boolean = false;


  extra1File: boolean = false;
  extra2File: boolean = false;
  laser1File: boolean = false;
  laser2File: boolean = false;

  main1File: boolean = false;
  main2File: boolean = false;
  main3File: boolean = false;
  main4File: boolean = false;

  labelText: boolean = false;
  plateText: boolean = false;



  selectFile(event, src) {
    switch (src) {
      case 'bottle':
        this.bottleFile = true;
        break;
      case 'pump':
        this.pumpFile = true;
        break;
      case 'seal':
        this.sealFile = true;
        break;
      case 'cap':
        this.capFile = true;
        break;
      case 'extra1':
        this.extra1File = true;
        break;
      case 'extra2':
        this.extra2File = true;
        break;
      case 'laser1':
        this.laser1File = true;
        break;
      case 'laser2':
        this.laser2File = true;
        break;
      case 'main1':
        this.main1File = true;
        break;
      case 'main2':
        this.main2File = true;
        break;
      case 'main3':
        this.main3File = true;
        break;
      case 'main4':
        this.main4File = true;
        break;
      default:
        break;
    }
    console.log(event.target.value);
    let path = event.target.value;
    let indexFileName = path.lastIndexOf("\\") + 1;
    console.log(indexFileName);
    let fileName = path.substring(indexFileName, 999);
    this.docPath = fileName;
    console.log(fileName);
    this.selectedFiles = event.target.files;
  }

  addRemoveInputs(type) {
    debugger;
    switch (type) {
      case 'mainLang':
        if (this.mainLanguage == true) {
          this.mainLanguage = false;
          this.itemShown.StickerLanguageK = '---'
        }
        else {
          this.mainLanguage = true
        }
        break;

      case 'mainLangTwo':
        if (this.mainLanguageTwo == true) {
          this.mainLanguageTwo = false;
          this.itemShown.StickerLanguageKTwo = '---'
        } else {
          this.mainLanguageTwo = true
        }
        break;

      case 'mainLangThree':
        if (this.mainLanguageThree == true) {
          this.mainLanguageThree = false;
          this.itemShown.StickerLanguageKThree = '---'
        } else {
          this.mainLanguageThree = true
        }
        break;

      case 'mainLangFour':
        if (this.mainLanguageFour == true) {
          this.mainLanguageFour = false;
          this.itemShown.StickerLanguageKFour = '---'
        } else {
          this.mainLanguageFour = true
        }
        break;

      case 'department':
        if (this.department == true) {
          this.department = false;
          this.itemShown.department = '---'
        } else {
          this.department = true
        }
        break;

      case 'production':
        if (this.production == true) {
          this.production = false;
          this.itemShown.productionInput = '---'
        } else {
          this.production = true
        }
        break;

      case 'productionTwo':
        if (this.productionTwo == true) {
          this.productionTwo = false;
          this.itemShown.productionTwoInput = '---'
        } else {
          this.productionTwo = true
        }
        break;

      case 'productionThree':
        if (this.productionThree == true) {
          this.productionThree = false;
          this.itemShown.productionThreeInput = '---'
        } else {
          this.productionThree = true
        }
        break;

      case 'productionFour':
        if (this.productionFour == true) {
          this.productionFour = false;
          this.itemShown.productionFourInput = '---'
        } else {
          this.productionFour = true
        }
        break;

      case 'productionFive':
        if (this.productionFive == true) {
          this.productionFive = false;
          this.itemShown.productionFiveInput = '---'
        } else {
          this.productionFive = true
        }
        break;

      case 'productionSix':
        if (this.productionSix == true) {
          this.productionSix = false;
          this.itemShown.productionSixInput = '---'
        } else {
          this.productionSix = true
        }
        break;
      case 'productionSeven':
        if (this.productionSeven == true) {
          this.productionSeven = false;
          this.itemShown.productionSevenInput = '---'
        } else {
          this.productionSeven = true
        }
        break;
      case 'productionEight':
        if (this.productionEight == true) {
          this.productionEight = false;
          this.itemShown.productionEightInput = '---'
        } else {
          this.productionEight = true
        }
        break;

      case 'volumeMl':
        if (this.volumeMl == true) {
          this.volumeMl = false;
          this.itemShown.volumeKey = '---'
        } else {
          this.volumeMl = true
        }
        break;

      case 'netWeightK':
        if (this.netWeightK == true) {
          this.netWeightK = false;
          this.itemShown.netWeightK = '---'
        } else {
          this.netWeightK = true
        }
        break;

      case 'grossWeightUnit':
        if (this.grossWeightUnit == true) {
          this.grossWeightUnit = false;
          this.itemShown.grossUnitWeightK = '---'
        } else {
          this.grossWeightUnit = true
        }
        break;

      case 'peerPharmTone':
        if (this.peerPharmTone == true) {
          this.peerPharmTone = false;
          this.itemShown.peerPharmTone = '---'
        } else {
          this.peerPharmTone = true
        }
        break;

      case 'laserAndExp':
        if (this.laserAndExp == true) {
          this.laserAndExp = false;
          
        } else {
          this.laserAndExp = true
        }
        break;

    }


  }


  upload(src) {

    const number = this.route.snapshot.paramMap.get('itemNumber');
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload, src, number).subscribe(event => {
      console.log(event);

      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        console.log(event.body);
        this.showSuccess();
        switch (src) {
          case 'bottle':
            this.bottleFile = false;
            this.item.bottleImage = '' + event.body;
            this.itemShown.bottleImage = '' + event.body;
            break;
          case 'cap':
            this.capFile = false;
            this.item.capImage = '' + event.body;
            this.itemShown.capImage = '' + event.body;
            break;
          case 'pump':
            this.pumpFile = false;
            this.item.pumpImage = '' + event.body;
            this.itemShown.pumpImage = '' + event.body;
            break;
          case 'seal':
            this.sealFile = false;
            this.item.sealImage = '' + event.body;
            this.itemShown.sealImage = '' + event.body;
            break;
          case 'extra1':
            this.extra1File = false;
            this.item.extraImage1 = '' + event.body;
            this.itemShown.extraImage1 = '' + event.body;
            break;
          case 'extra2':
            this.extra2File = false;
            this.item.extraImage2 = '' + event.body;
            this.itemShown.extraImage2 = '' + event.body;
            break;
          case 'laser1':
            this.laser1File = false;
            this.item.laserImage1 = '' + event.body;
            this.itemShown.laserImage1 = '' + event.body;
            break;
          case 'laser2':
            this.laser2File = false;
            this.item.laserImage2 = '' + event.body;
            this.itemShown.laserImage2 = '' + event.body;
            break;
          case 'main1':
            this.main1File = false;
            this.item.imgMain1 = '' + event.body;
            this.itemShown.imgMain1 = '' + event.body;
            break;
          case 'main2':
            this.main2File = false;
            this.item.imgMain2 = '' + event.body;
            this.itemShown.imgMain2 = '' + event.body;
            break;
          case 'main3':
            this.main3File = false;
            this.item.imgMain3 = '' + event.body;
            this.itemShown.imgMain3 = '' + event.body;
            break;
          case 'main4':
            this.main4File = false;
            this.item.imgMain4 = '' + event.body;
            this.itemShown.imgMain4 = '' + event.body;
            break;
          default:
            break;
        }
      }
    });

    this.selectedFiles = undefined;
  }


  showSuccess() {
    this.toastr.info('Successful upload!');
  }


  loadPackagDetails(number, src) {
    this.invtSer.getCmptByNumber(number, 'product').subscribe(res => {
      switch (src) {
        case 'bottle':
          this.itemShown.item1w = res[0].packageWeight;
          this.itemShown.item1s = res[0].packageType;
          break;
        case 'cap':
          this.itemShown.item2w = res[0].packageWeight;
          this.itemShown.item2s = res[0].packageType;
          break;
        case 'pump':
          this.itemShown.item3w = res[0].packageWeight;
          this.itemShown.item3s = res[0].packageType;
          break;
        case 'seal':
          this.itemShown.item4w = res[0].packageWeight;
          this.itemShown.item4s = res[0].packageType;
          break;
        case 'carton':
          this.itemShown.itemCtnW = res[0].packageWeight;
          break;
      }
    })
  }

   getUserInfo() {
    debugger

    if(this.authService.loggedInUser) {
        this.user = this.authService.loggedInUser
      if (this.user.authorization) {
        if (this.authService.loggedInUser.authorization.includes("updateItemTree")) {
          this.alowUserEditItemTree = true;
         
        }
        if (this.authService.loggedInUser.authorization.includes("updateItemSpecs")) {
        
          this.allowEditSpecTable = true
        }


      }

     } else { 
      this.authService.userEventEmitter.subscribe(user => {
        this.user = user;
        if (this.user.authorization) {
          if (this.authService.loggedInUser.authorization.includes("updateItemTree")) {
            this.alowUserEditItemTree = true;
          }
          if (this.authService.loggedInUser.authorization.includes("updateItemSpecs")) {
        
            this.allowEditSpecTable = true
          }
        }
      });
  
    }
  
  }
}