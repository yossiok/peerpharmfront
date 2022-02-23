import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
} from "@angular/core";
import {
  ActivatedRoute,
  ChildrenOutletContexts,
  Router,
} from "@angular/router";
import { ItemsService } from "../../../services/items.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UploadFileService } from "src/app/services/helpers/upload-file.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UserInfo } from "../../taskboard/models/UserInfo";
import * as moment from "moment";
import { InventoryService } from "src/app/services/inventory.service";
import { CostumersService } from "src/app/services/costumers.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { BatchesService } from "src/app/services/batches.service";
import { OrdersService } from "src/app/services/orders.service";
import { ExcelService } from "src/app/services/excel.service";
import { TranslateService } from "@ngx-translate/core";
import { PlateService } from "src/app/services/plate.service";
import { log } from "console";
import { Procurementservice } from "src/app/services/procurement.service";

@Component({
  selector: "app-itemdetais",
  templateUrl: "./itemdetais.component.html",
  styleUrls: ["./itemdetais.component.scss"],
})
export class ItemdetaisComponent implements OnInit {
  @ViewChild("rows") rows: ElementRef;
  @ViewChild("colums") colums: ElementRef;
  @ViewChild("container")
  private container: ElementRef;
  @ViewChild("itemNum") itemNum: ElementRef;
  @ViewChild("editItemModal")
  editItemModal: ElementRef;
  @Input() formDetailsItemNum: string;

  loadingItem: boolean = false;
  isDisabled = true;
  // New Item Tree //
  itemBatches: any[];
  itemPrice: any[] = [];
  ordersItem: any[];
  allCostumers: any[];
  allCostumersCopy: any[];
  productionLines: any = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7M",
    "7M2",
    "8",
    "9",
    "T",
    "S",
  ];
  totalItemPrice: number = 0;
  totalPriceLoading: number = 0;

  mainLanguage: Boolean = true;
  mainLanguageTwo: Boolean = true;
  mainLanguageThree: Boolean = true;
  mainLanguageFour: Boolean = true;
  englishLang: Boolean = false;
  hebrewLang: Boolean = true;
  department: Boolean = true;
  production: Boolean = false;
  productionTwo: Boolean = false;
  productionThree: Boolean = false;
  productionFour: Boolean = false;
  productionFive: Boolean = false;
  productionSix: Boolean = false;
  productionSeven: Boolean = false;
  productionEight: Boolean = false;
  volumeMl: Boolean = true;
  netWeightK: Boolean = true;
  grossWeightUnit: Boolean = true;
  peerPharmTone: Boolean = true;
  laserAndExp: Boolean = true;
  remarksAlert: Boolean = false;
  notActiveAlert: Boolean = false;
  editSpecTable: Boolean = false;
  productPriceModal: Boolean = false;

  itemLockedForEdit: Boolean = false;
  productionType: "";
  productionTwoType: "";
  productionThreeType: "";
  productionFourType: "";
  productionFiveType: "";
  productionSixType: "";
  productionSevenType: "";
  productionEightType: "";

  productionImage: "";
  productionTwoImage: "";
  productionThreeImage: "";
  productionFourImage: "";
  productionFiveImage: "";
  productionSixImage: "";
  productionSevenImage: "";
  productionEightImage: "";

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
  userName = "";

  itemShown = {
    itemNumber: "",
    name: "",
    subName: "",
    discriptionK: "",
    fillingOnly: false,
    proRemarks: "",
    batchN: "",
    impRemarks: "",
    boxImage: "",
    stickerImage: "",
    palletImage: "",
    palletImage2: "",
    palletImage3: "",

    typeOfComponent: "",
    typeOfComponentTwo: "",
    typeOfComponentThree: "",
    typeOfComponentFour: "",
    typeOfComponentFive: "",
    typeOfComponentSix: "",
    typeOfComponentSeven: "",
    typeOfComponentEight: "",

    numberOfPcs: "",
    numberOfPcsTwo: "",
    numberOfPcsThree: "",
    numberOfPcsFour: "",
    numberOfPcsFive: "",
    numberOfPcsSix: "",
    numberOfPcsSeven: "",
    numberOfPcsEight: "",

    laserYear: "",
    laserPP: "",
    laserMonth: "",
    expMonth: "",
    expYear: "",
    laserLocation: "",

    updateDate: "",
    nameOfupdating: "",
    versionNumber: "",
    scheduleRemark: "",

    status: "",
    department: "",
    stickerNumber: "",
    stickerVersion: null,
    stickerTypeK: "",
    sticker2Number: "",
    sticker2Version: null,
    sticker2TypeK: "",
    boxNumber: "",
    boxName: "",
    boxVersion: null,
    boxTypeK: "",
    barcodeK: "",
    StickerLanguageK: "",
    StickerLanguageKTwo: "",
    StickerLanguageKThree: "",
    StickerLanguageKFour: "",
    volumeKey: "",
    netWeightK: "",
    grossUnitWeightK: "",
    peerPharmTone: "",

    productionInput: "",
    productionTwoInput: "",
    productionThreeInput: "",
    productionFourInput: "",
    productionFiveInput: "",
    productionSixInput: "",
    productionSevenInput: "",
    productionEightInput: "",

    productionImage: "",
    productionTwoImage: "",
    productionThreeImage: "",
    productionFourImage: "",
    productionFiveImage: "",
    productionSixImage: "",
    productionSevenImage: "",
    productionEightImage: "",

    productionType: "",
    productionTwoType: "",
    productionThreeType: "",
    productionFourType: "",
    productionFiveType: "",
    productionSixType: "",
    productionSevenType: "",
    productionEightType: "",

    licsensNumber: "",
    licsensDate: "",
    yearsUntillExpired: "",
    country: "",

    netCtnWeightK: "",
    grossCtnWeightK: "",

    cartonNumber: "",
    cartonName: "",
    PcsCarton: "",

    cartonNumber2: "",
    cartonName2: "",
    PcsCarton2: "",

    pumpDirection: "",
    paletteType: "",
    st1layerCarton: "",
    totalCartonPalette: "",

    brand: "",
    costumerId: "",
    costumerName: "",

    cbm: "",
    motherP: "",
    itemType: "",

    item1w: "",
    item1s: "",
    item2w: "",
    item2s: "",
    item3w: "",
    item3s: "",
    item4w: "",
    item4s: "",
    itemStickerW: "",
    itemStickerS: "",
    itemBoxS: "",
    itemBoxW: "",
    itemCtnW: "",
    itemCtnS: "",

    euPallet: "",
    usPallet: "",

    euSt1layerCarton: "",
    usSt1layerCarton: "",
    euTotalCartonPalette: "",
    usTotalCartonPalette: "",
    usCbm: "",
    euCbm: "",

    bottleNumber: "",
    capNumber: "",
    pumpNumber: "",
    sealNumber: "",

    bottleAmount: 0,
    bottlePurchases: [],
    bottleOrderedAmount: 0,
    bottleAllocations: 0,
    bottleExpected: 0,
    bottleVersion: null,

    capAmount: 0,
    capPurchases: [],
    capOrderedAmount: 0,
    capAllocations: 0,
    capExpected: 0,

    pumpAmount: 0,
    pumpPurchases: [],
    pumpOrderedAmount: 0,
    pumpAllocations: 0,
    pumpExpected: 0,

    sealAmount: 0,
    sealPurchases: [],
    sealOrderedAmount: 0,
    sealAllocations: 0,
    sealExpected: 0,

    boxAmount: 0,
    boxPurchases: [],
    boxOrderedAmount: 0,
    boxAllocations: 0,
    boxExpected: 0,

    cartonImage: "",
    cartonAllocations: [],
    cartonAmount: 0,
    cartonPurchases: [],
    cartonOrderedAmount: 0,
    cartonExpected: 0,

    carton2Image: "",
    carton2Allocations: [],
    carton2Amount: 0,
    carton2Purchases: [],
    carton2OrderedAmount: 0,
    carton2Expected: 0,

    bottleTube: "",
    capTube: "",
    pumpTube: "",
    sealTube: "",

    extraText1: "",
    extraText2: "",

    componentType: "",
    componentTwoType: "",
    componentThreeType: "",
    componentFourType: "",
    componentFiveType: "",
    componentSixType: "",
    componentSevenType: "",

    bottleImage: "",
    capImage: "",
    pumpImage: "",
    laserImage1: "",
    laserImage2: "",
    imgMain1: "",
    imgMain2: "",
    imgMain3: "",
    imgMain4: "",

    extraImage1: "",
    extraImage2: "",
    sealImage: "",

    pallet: "",
    pallet1x: "",
    pallet1y: "",
    pallet2: "",
    pallet2x: "",
    pallet2y: "",
    pallet3: "",
    pallet3x: "",
    pallet3y: "",

    goddetShape: "",

    msdsFileLink: "",
    licenceFileLink: "",
    plateFileLink: "",
    labelFileLink: "",
    wordLabelFileLink: "",
    coaFileLink: "",

    phRemarks: "",
    phLimitsMin: "",
    phLimitsMax: "",
    densityRemarks: "",
    densityLimitsMin: "",
    densityLimitsMax: "",
    viscosityRemarks: "",
    viscosityLimitsMin: "",
    viscosityLimitsMax: "",
    spinFieldNum: "",
    modelType: "",
    spinSpeed: "",
    percentageResult: "",
    testTemp: "",
    colorRemarks: "",
    color: "",
    textureRemarks: "",
    textureSpec: "",
    scentRemarks: "",
    scentSpec: "",
  };

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

  editOrAdd: string = "Add";
  lookingForItem: boolean = false;
  itemExist: boolean = false;
  updateConfirmModal: boolean = false;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
  }

  constructor(
    private plateService: PlateService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private orderService: OrdersService,
    private batchService: BatchesService,
    private modalService: NgbModal,
    private costumersService: CostumersService,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private invtSer: InventoryService,
    private uploadService: UploadFileService,
    private toastr: ToastrService,
    private authService: AuthService,
    private purchaseService: Procurementservice,
    private router: Router
  ) {
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

  ngOnInit() {
    if (location.href.endsWith("itemDetails")) {
      //no item selected
      // textbox not disabled for new
      this.isDisabled = false;
    }
    if (this.formDetailsItemNum) this.searchForItem(this.formDetailsItemNum);

    this.getAllCostumers();
    this.getUserInfo();
    this.getItemData();
    //  this.showGoddetData();
    setTimeout(() => this.itemNum.nativeElement.focus(), 300);
  }

  checkPermission() {
    return this.authService.loggedInUser.screenPermission == "5";
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
      const rowDiv = this.renderer.createElement("div");
      this.renderer.setStyle(rowDiv, "display", "block");
      this.renderer.appendChild(this.container.nativeElement, rowDiv);
      for (let j = 1; j <= c; j++) {
        let cell = j + c * i;
        const columnDiv = this.renderer.createElement("div");
        const text = this.renderer.createText("[" + cell + "]");
        this.renderer.appendChild(columnDiv, text);
        this, this.renderer.setAttribute(columnDiv, "class", "cellDiv");
        /*this.renderer.setStyle(columnDiv, 'color', 'blue');*/
        this.renderer.listen(columnDiv, "click", () => {
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
    this.excelService.exportAsExcelFile([this.itemShown], "data");
  }

  changeLanguage(type) {
    switch (type) {
      case "english":
        this.translate.use("en");
        this.hebrewLang = true;
        this.englishLang = false;
        break;
      case "hebrew":
        this.translate.use("he");
        this.englishLang = true;
        this.hebrewLang = false;
        break;
    }
  }

  fillBottle(bottleNumber) {
    bottleNumber = this.itemShown.bottleNumber;
    if (bottleNumber != "---" && bottleNumber != "") {
      // debugger;
      this.invtSer.getCmptPPCDetails(bottleNumber).subscribe((data) => {
        // debugger;
        this.itemShown.bottleTube = data.stock[0].componentName;
        this.itemShown.bottleImage = data.stock[0].img;
        this.itemShown.bottleVersion = data.stock[0].versionNumber;
        this.itemShown.componentType = data.stock[0].componentType;
        this.itemShown.bottleAllocations = data.allocationsAmount;
        this.itemShown.bottleAmount = data.stock[0].stock;
        this.itemShown.bottlePurchases = data.purchases;
        this.itemShown.bottleOrderedAmount = data.purchaseAmount;
        this.itemShown.bottleExpected = data.realAmount;
      });
    } else if (bottleNumber == "---") {
      this.itemShown.bottleTube = "";
      this.itemShown.bottleImage = "";
    }
  }

  fillCap(capNumber) {
    capNumber = this.itemShown.capNumber;
    if (capNumber != "---" && capNumber != "") {
      this.invtSer.getCmptPPCDetails(capNumber).subscribe((data) => {
        this.itemShown.capTube = data.stock[0].componentName;
        this.itemShown.capImage = data.stock[0].img;
        this.itemShown.componentTwoType = data.stock[0].componentType;
        this.itemShown.capAllocations = data.allocationsAmount;
        this.itemShown.capAmount = data.stock[0].stock;
        this.itemShown.capPurchases = data.purchases;
        this.itemShown.capOrderedAmount = data.purchaseAmount;
        this.itemShown.capExpected = data.realAmount;
      });
    } else if (capNumber == "---") {
      this.itemShown.capTube = "";
      this.itemShown.capImage = "";
    }
  }

  fillPump(pumpNumber) {
    pumpNumber = this.itemShown.pumpNumber;
    if (pumpNumber != "---" && pumpNumber != "") {
      this.invtSer.getCmptPPCDetails(pumpNumber).subscribe((data) => {
        this.itemShown.pumpTube = data.stock[0].componentName;
        this.itemShown.pumpImage = data.stock[0].img;
        this.itemShown.componentThreeType = data.stock[0].componentType;
        this.itemShown.pumpAllocations = data.allocationsAmount;
        this.itemShown.pumpAmount = data.stock[0].stock;
        this.itemShown.pumpPurchases = data.purchases;
        this.itemShown.pumpOrderedAmount = data.purchaseAmount;
        this.itemShown.pumpExpected = data.realAmount;
      });
    } else if (pumpNumber == "---") {
      this.itemShown.pumpTube = "";
      this.itemShown.pumpImage = "";
    }
  }

  fillSeal(sealNumber) {
    sealNumber = this.itemShown.sealNumber;
    if (sealNumber != "---" && sealNumber != "") {
      this.invtSer.getCmptPPCDetails(sealNumber).subscribe((data) => {
        this.itemShown.sealTube = data.stock[0].componentName;
        this.itemShown.sealImage = data.stock[0].img;
        this.itemShown.componentFourType = data.stock[0].componentType;
        this.itemShown.sealAllocations = data.allocationsAmount;
        this.itemShown.sealAmount = data.stock[0].stock;
        this.itemShown.sealPurchases = data.purchases;
        this.itemShown.sealOrderedAmount = data.purchaseAmount;
        this.itemShown.sealExpected = data.realAmount;
      });
    } else if (sealNumber == "---") {
      this.itemShown.sealTube = "";
      this.item.sealImage = "";
    }
  }

  fillCarton(cartonNumber) {
    cartonNumber = this.itemShown.cartonNumber;
    if (cartonNumber != "---" && cartonNumber != "") {
      this.invtSer.getCmptPPCDetails(cartonNumber).subscribe((data) => {
        this.itemShown.cartonName = data.stock[0].componentName;
        this.itemShown.cartonImage = data.stock[0].img;
        this.itemShown.cartonAllocations = data.allocationsAmount;
        this.itemShown.cartonAmount = data.stock[0].stock;
        this.itemShown.cartonPurchases = data.purchases;
        this.itemShown.cartonOrderedAmount = data.purchaseAmount;
        this.itemShown.cartonExpected = data.realAmount;
      });
    } else if (cartonNumber == "---") {
      this.itemShown.cartonName = "";
      this.item.cartonImage = "";
    }
  }

  fillCarton2(cartonNumber) {
    cartonNumber = this.itemShown.cartonNumber2;
    if (cartonNumber != "---" && cartonNumber != "") {
      this.invtSer.getCmptPPCDetails(cartonNumber).subscribe((data) => {
        this.itemShown.cartonName2 = data.stock[0].componentName;
        this.itemShown.carton2Image = data.stock[0].img;
        this.itemShown.carton2Allocations = data.allocationsAmount;
        this.itemShown.carton2Amount = data.stock[0].stock;
        this.itemShown.carton2Purchases = data.purchases;
        this.itemShown.carton2OrderedAmount = data.purchaseAmount;
        this.itemShown.carton2Expected = data.realAmount;
      });
    } else if (cartonNumber == "---") {
      this.itemShown.cartonName2 = "";
      this.item.carton2Image = "";
    }
  }

  fillBox(boxNumber) {
    boxNumber = this.itemShown.boxNumber;
    if (boxNumber != "---" && boxNumber != "") {
      this.invtSer.getCmptPPCDetails(boxNumber).subscribe((data) => {
        this.itemShown.boxName = data.stock[0].componentName;
        this.itemShown.boxImage = data.stock[0].img;
        this.itemShown.boxAllocations = data.allocationsAmount;
        this.itemShown.boxAmount = data.stock[0].stock;
        this.itemShown.boxPurchases = data.purchases;
        this.itemShown.boxOrderedAmount = data.purchaseAmount;
        this.itemShown.boxExpected = data.realAmount;
      });
    } else if (boxNumber == "---") {
      this.itemShown.boxName = "";
      this.item.boxImage = "";
    }
  }

  openBatchModal(batches) {
    var itemNumber = this.itemShown.itemNumber;
    this.batchService.getBatchesByItemNumber(itemNumber).subscribe((data) => {
      this.itemBatches = data;
    });
    // this.contact = this.costumers[i].contact[0];
    this.modalService.open(batches).result.then((result) => {
      console.log(result);
    });
  }

  openOrderModal(orders) {
    var itemNumber = this.itemShown.itemNumber;

    this.orderService
      .getOrderItemsByitemNumber(itemNumber)
      .subscribe((data) => {
        this.ordersItem = data;
      });
    this.modalService.open(orders).result.then((result) => {
      console.log(result);
    });
  }

  createPriceObj(data) {
    let objToPush = {
      price: "",
      priceLoading: "",
      componentNumber: data[0].componentN,
      componentName: data[0].componentName,
    };
    let price = 0;
    let suppliers = data[0].alternativeSuppliers;
    for (let i = 0; i < suppliers.length; i++) {
      if (
        suppliers[0].price != "" &&
        suppliers[0].price != null &&
        suppliers[0].price != undefined
      ) {
        objToPush.price = suppliers[0].price;
      } else if (
        suppliers[1].price != "" &&
        suppliers[1].price != null &&
        suppliers[1].price != undefined
      ) {
        objToPush.price = suppliers[1].price;
      } else {
        objToPush.price = "Update Supplier Price";
      }
      if (
        suppliers[0].priceLoading != "" &&
        suppliers[0].priceLoading != null &&
        suppliers[0].priceLoading != undefined
      ) {
        objToPush.priceLoading = suppliers[0].priceLoading;
      } else if (
        suppliers[1].priceLoading != "" &&
        suppliers[1].priceLoading != null &&
        suppliers[1].priceLoading != undefined
      ) {
        objToPush.priceLoading = suppliers[1].priceLoading;
      } else {
        objToPush.priceLoading = "Update Load Price";
      }
    }
    this.totalItemPrice = this.totalItemPrice + Number(objToPush.price);
    if (typeof Number(objToPush.priceLoading) == typeof 0) {
      if (!isNaN(Number(objToPush.priceLoading))) {
        this.totalPriceLoading =
          this.totalPriceLoading + Number(objToPush.priceLoading);
      }
    }

    return objToPush;
  }

  openProdctPriceModal() {
    this.itemPrice = [];
    this.totalItemPrice = 0;
    if (
      this.itemShown.bottleNumber != "" &&
      this.itemShown.bottleNumber != "---"
    ) {
      this.invtSer
        .getCmptByitemNumber(this.itemShown.bottleNumber)
        .subscribe((data) => {
          if (data) {
            this.itemPrice.push(this.createPriceObj(data));
          }
        });
    }
    if (this.itemShown.capNumber != "" && this.itemShown.capNumber != "---") {
      this.invtSer
        .getCmptByitemNumber(this.itemShown.capNumber)
        .subscribe((data) => {
          this.itemPrice.push(this.createPriceObj(data));
        });
    }
    if (this.itemShown.boxNumber != "" && this.itemShown.boxNumber != "---") {
      this.invtSer
        .getCmptByitemNumber(this.itemShown.boxNumber)
        .subscribe((data) => {
          this.itemPrice.push(this.createPriceObj(data));
        });
    }
    if (this.itemShown.pumpNumber != "" && this.itemShown.pumpNumber != "---") {
      this.invtSer
        .getCmptByitemNumber(this.itemShown.pumpNumber)
        .subscribe((data) => {
          this.itemPrice.push(this.createPriceObj(data));
        });
    }
    if (this.itemShown.sealNumber != "" && this.itemShown.sealNumber != "---") {
      this.invtSer
        .getCmptByitemNumber(this.itemShown.sealNumber)
        .subscribe((data) => {
          this.itemPrice.push(this.createPriceObj(data));
        });
    }
    if (
      this.itemShown.stickerNumber != "" &&
      this.itemShown.stickerNumber != "---"
    ) {
      this.invtSer
        .getCmptByitemNumber(this.itemShown.stickerNumber)
        .subscribe((data) => {
          this.itemPrice.push(this.createPriceObj(data));
        });
    }
    if (
      this.itemShown.cartonNumber != "" &&
      this.itemShown.cartonNumber != "---"
    ) {
      this.invtSer
        .getCmptByitemNumber(this.itemShown.cartonNumber)
        .subscribe((data) => {
          this.itemPrice.push(this.createPriceObj(data));
        });
    }

    this.productPriceModal = true;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  findInInventory(componentN) {
    window.open(
      "http://peerpharmsystem.com/#/peerpharm/inventory/stock?componentN=" +
        componentN
    );
  }

  getAllCostumers() {
    this.costumersService.getAllCostumers().subscribe((data) => {
      this.allCostumers = data;
      this.allCostumersCopy = data;
    });
  }

  fillCostumerDetails(ev) {
    ev.target.value;
    var costumerName = ev.target.value;

    var costumer = this.allCostumers.find(
      (costumer) => costumer.costumerName == costumerName
    );

    this.itemShown.costumerId = costumer.costumerId;
  }

  searchPlateByNumber(plateNumber, type) {
    switch (type) {
      case "pallet":
        if (plateNumber != "") {
          this.plateService.getPlatesByNumber(plateNumber).subscribe((data) => {
            if (data) {
              this.itemShown.palletImage = data[0].palletImg;
            }
          });
        }

        break;
      case "pallet2":
        if (plateNumber != "") {
          this.plateService.getPlatesByNumber(plateNumber).subscribe((data) => {
            if (data) {
              this.itemShown.palletImage2 = data[0].palletImg;
            }
          });
        }
        break;
      case "pallet3":
        if (plateNumber != "") {
          this.plateService.getPlatesByNumber(plateNumber).subscribe((data) => {
            if (data) {
              this.itemShown.palletImage3 = data[0].palletImg;
            }
          });
        }
        break;
    }
  }

  searchCompNumberByComp(compNumber, src) {
    var itemType = "component";
    switch (src) {
      case "sticker":
        if (compNumber != "") {
          this.invtSer.getCmptByitemNumber(compNumber).subscribe((data) => {
            this.itemShown.stickerImage = data[0].img;
            this.itemShown.stickerVersion = data[0].versionNumber;
            this.itemsService
              .updateStickerImage(this.itemShown)
              .subscribe((data) => {
                if (data) {
                  console.log("sticker image updated");
                }
              });
          });
        } else {
          this.productionType = "";
        }
        break;
      case "box":
        if (compNumber != "") {
          this.invtSer.getCmptByitemNumber(compNumber).subscribe((data) => {
            this.itemShown.boxImage = data[0].img;
            this.itemShown.boxVersion = data[0].versionNumber;
          });
        } else {
          this.productionType = "";
        }
        break;
      case "productionInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer.getCmptByitemNumber(compNumber).subscribe((data) => {
            if (data.length > 0) {
              this.itemShown.productionType = data[0].componentType;
              this.itemShown.productionImage = data[0].img;
            } else {
              this.itemShown.productionType = "";
              this.itemShown.productionImage = "";
            }
          });
        } else {
          this.productionType = "";
        }
        break;
      case "productionTwoInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer
            .getCmptByNumber(compNumber, itemType)
            .subscribe((data) => {
              data;
              this.itemShown.productionTwoType = data[0].componentType;
              this.itemShown.productionTwoImage = data[0].img;
            });
        } else {
          this.productionTwoType = "";
        }
        break;
      case "productionThreeInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer
            .getCmptByNumber(compNumber, itemType)
            .subscribe((data) => {
              data;
              this.itemShown.productionThreeType = data[0].componentType;
              this.itemShown.productionThreeImage = data[0].img;
            });
        } else {
          this.itemShown.productionThreeType = "";
        }
        break;
      case "productionFourInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer
            .getCmptByNumber(compNumber, itemType)
            .subscribe((data) => {
              data;
              this.itemShown.productionFourType = data[0].componentType;
              this.itemShown.productionFourImage = data[0].img;
            });
        } else {
          this.itemShown.productionFourType = "";
        }
        break;
      case "productionFiveInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer
            .getCmptByNumber(compNumber, itemType)
            .subscribe((data) => {
              data;
              this.itemShown.productionFiveType = data[0].componentType;
              this.itemShown.productionFiveImage = data[0].img;
            });
        } else {
          this.productionFiveType = "";
        }
        break;
      case "productionSixInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer
            .getCmptByNumber(compNumber, itemType)
            .subscribe((data) => {
              data;
              this.itemShown.productionSixType = data[0].componentType;
              this.itemShown.productionSixImage = data[0].img;
            });
        } else {
          this.itemShown.productionSixType = "";
        }
        break;
      case "productionSevenInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer
            .getCmptByNumber(compNumber, itemType)
            .subscribe((data) => {
              data;
              this.itemShown.productionSevenType = data[0].componentType;
              this.itemShown.productionSevenImage = data[0].img;
            });
        } else {
          this.productionSevenType = "";
        }
        break;
      case "productionEightInput":
        if (compNumber != "" && compNumber != "---") {
          this.invtSer
            .getCmptByNumber(compNumber, itemType)
            .subscribe((data) => {
              data;
              this.itemShown.productionEightType = data[0].componentType;
              this.itemShown.productionEightImage = data[0].img;
            });
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

  saveSpecTable() {
    this.editSpecTable = false;

    this.itemsService.saveSpecSettings(this.itemShown).subscribe((data) => {
      if (data) {
        this.toastr.success("עודכן בהצלחה !");
      }
    });
  }

  getGoddetData() {
    let div = this.container.nativeElement;
    this.mainDivArr = [];
    let divArr = [];
    for (let innerDiv of div.getElementsByTagName("div")) {
      if (innerDiv.innerHTML) {
        divArr.push(innerDiv.innerHTML);
      } else {
        this.mainDivArr.push(divArr);
        divArr = [];
      }
    }
    this.mainDivArr.push(divArr);
    this.mainDivArr.shift();
    console.log(this.mainDivArr);
    this.itemShown["goddet"] = this.mainDivArr;
  }

  showGoddetData() {
    const r = this.dataDiv.length;
    const c = this.dataDiv[0].length;
    for (let i = 0; i < r; i++) {
      const rowDiv = this.renderer.createElement("div");
      this.renderer.setStyle(rowDiv, "display", "block");
      this.renderer.appendChild(this.container.nativeElement, rowDiv);
      for (let j = 0; j < c; j++) {
        let cell = j + c * i;
        const columnDiv = this.renderer.createElement("div");
        const text = this.renderer.createText(this.dataDiv[i][j]);
        this.renderer.appendChild(columnDiv, text);
        this, this.renderer.setAttribute(columnDiv, "class", "cellDiv");
        if (
          this.itemShown.goddetShape == "sqaure" ||
          this.itemShown.goddetShape == "rectangle"
        ) {
          this.renderer.setStyle(columnDiv, "border-radius", "0px");
          if (this.itemShown.goddetShape == "rectangle") {
            this.renderer.setStyle(columnDiv, "height", "83px");
            this.renderer.setStyle(columnDiv, "width", "47px");
            this.renderer.setStyle(columnDiv, "text-align", "left");
            this.renderer.setStyle(columnDiv, "padding", "0px");
          }
        }
        this.renderer.listen(columnDiv, "click", () => {
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

  jumpingRemark() {
    if (
      this.itemShown.proRemarks != "" &&
      this.itemShown.proRemarks != undefined &&
      this.itemShown.proRemarks != null
    ) {
      if (this.remarksAlert == true) {
        this.remarksAlert = false;
      } else {
        this.remarksAlert = true;
      }
    }
  }
  notActive() {
    if (this.itemShown.status == "notActive") {
      if (this.notActiveAlert == true) {
        this.notActiveAlert = false;
      } else {
        this.notActiveAlert = true;
      }
    }
  }

  checkItemStatus() {
    if (this.itemShown.status === "perfect") {
      return "green";
    }
    if (this.itemShown.status === "notActive") {
      return "red";
    }
    if (this.itemShown.status === "active") {
      return "red";
    }
  }

  itemBackgroundByStatus() {
    if (this.itemShown.status === "notActive") {
      return "backgroundRed";
    }
  }

  getItemData() {
    // debugger;
    this.route.params.subscribe((data) => {
      let number = data.itemNumber;
      if (number) {
        this.editOrAdd = "Edit";
        this.itemsService.getItemData(number).subscribe((res) => {
          console.log(res);
          this.itemExist = true;
          this.item = res[0];
          this.itemShown = res[0];

          this.itemShown.updateDate = moment(this.itemShown.updateDate).format(
            "YYYY-MM-DD"
          );
          if (this.itemShown.licsensDate != null) {
            this.itemShown.licsensDate = moment(
              this.itemShown.licsensDate
            ).format("YYYY-MM-DD");
          }

          this.searchForItem(data.itemNumber);

          this.dataDiv = res[0].goddet;
          this.showGoddetData();
        });
      }
    });
  }

  searchForItem(item) {
    let itemtosearch = item;
    if (!item) {
      alert("no item number");
      return;
      //  if(itemtosearch)
      //   {
      //location.href="/#/peerpharm/items/itemDetails/"+itemtosearch;
      //   this.router.navigate([ "/peerpharm/items/itemDetails/"+itemtosearch ]);
      // return;
      //   }
      //return;
    }

    this.itemShown.itemNumber = itemtosearch;

    //check if open orders exist for item
    //getAllOpenOrdersByItemNumber
    //Yossi 16.01.22- cancelled by haviv's request
    /*
    this.itemsService.getOpenOrdersForItem( itemtosearch ).subscribe(data => {
      //if open orders exist lock item update or edit!
   if (data.length > 0) {
        this.itemLockedForEdit = true;
      } 
    });*/

    this.loadingItem = true;
    this.editOrAdd = "Edit";
    // debugger;
    this.itemsService.getItemData(item).subscribe((res) => {
      // debugger;

      this.loadingItem = false;
      if (res.length == 0) {
        this.toastr.error(item, "Item Not found");
        this.itemShown = Object.assign({}, this.itemCopy);
        this.dataDiv = ["", ""];
        this.showGoddet();
      } else if (res.msg == "noItem") {
        this.toastr.error("No such ITEM !!!!!!");
      } else {
        this.item = res[0];
        this.itemShown = res[0];
        if (this.itemShown.bottleNumber != "") {
          this.fillBottle(this.itemShown.bottleNumber);
          this.searchCompNumberByComp(
            this.itemShown.bottleNumber,
            "productionInput"
          ); // תמונה וסוג קומפוננט
        } else {
          this.itemShown.bottleImage = "";
          this.itemShown.bottleNumber = "";
          this.itemShown.bottleTube = "";
          this.itemShown.componentType = "";
        }

        if (this.itemShown.capNumber != "") {
          this.fillCap(this.itemShown.capNumber);
          this.searchCompNumberByComp(
            this.itemShown.capNumber,
            "productionTwoInput"
          );
          if (this.itemShown.itemNumber == "6876")
            setTimeout(() => this.addRemoveInputs("productionTwo"), 100); //ugly bug fix
          if (this.itemShown.itemNumber == "5479")
            setTimeout(() => {
              this.addRemoveInputs("production"); //ugly bug fix
              this.addRemoveInputs("productionTwo"); //ugly bug fix
            }, 100);
        } else {
          this.itemShown.capImage = "";
          this.itemShown.capNumber = "";
          this.itemShown.capTube = "";
          this.itemShown.componentTwoType = "";
        }

        if (this.itemShown.pumpNumber != "") {
          this.fillPump(this.itemShown.pumpNumber);
          this.searchCompNumberByComp(
            this.itemShown.pumpNumber,
            "productionThreeInput"
          );
        } else {
          this.itemShown.pumpImage = "";
          this.itemShown.pumpNumber = "";
          this.itemShown.pumpTube = "";
          this.itemShown.componentThreeType = "";
        }

        if (this.itemShown.sealNumber != "") {
          this.fillSeal(this.itemShown.sealNumber);
          this.searchCompNumberByComp(
            this.itemShown.sealNumber,
            "productionFourInput"
          );
        } else {
          this.itemShown.sealImage = "";
          this.itemShown.sealNumber = "";
          this.itemShown.sealTube = "";
          this.itemShown.componentFourType = "";
        }

        if (this.itemShown.cartonNumber != "") {
          this.fillCarton(this.itemShown.cartonNumber);
          this.searchCompNumberByComp(
            this.itemShown.cartonNumber,
            "productionFiveInput"
          );
        } else {
          this.itemShown.cartonImage = "";
          this.itemShown.cartonNumber = "";
          this.itemShown.cartonName = "";
          this.itemShown.componentFiveType = "";
        }

        if (this.itemShown.cartonNumber2 != "") {
          this.fillCarton2(this.itemShown.cartonNumber2);
          this.searchCompNumberByComp(
            this.itemShown.cartonNumber2,
            "productionSixInput"
          );
        } else {
          this.itemShown.carton2Image = "";
          this.itemShown.cartonNumber2 = "";
          this.itemShown.cartonName2 = "";
          this.itemShown.componentSixType = "";
        }

        if (this.itemShown.boxNumber != "") {
          this.fillBox(this.itemShown.boxNumber);
          this.searchCompNumberByComp(
            this.itemShown.boxNumber,
            "productionSevenInput"
          );
        } else {
          this.itemShown.boxImage = "";
          this.itemShown.boxNumber = "";
          this.itemShown.boxName = "";
          this.itemShown.componentFourType = "";
        }

        this.searchCompNumberByComp(this.itemShown.boxNumber, "box");
        this.searchCompNumberByComp(this.itemShown.stickerNumber, "sticker");
        this.searchPlateByNumber(this.itemShown.pallet, "pallet");
        this.searchPlateByNumber(this.itemShown.pallet2, "pallet2");
        this.searchPlateByNumber(this.itemShown.pallet3, "pallet3");

        // var costumer = this.allCostumersCopy.filter(costumer=>costumer.brand == this.itemShown.name);
        // this.allCostumers = costumer

        this.itemShown.updateDate = moment(this.itemShown.updateDate).format(
          "YYYY-MM-DD"
        );
        //null as moment format returns="invalid date"
        if (this.itemShown.licsensDate != null) {
          this.itemShown.licsensDate = moment(
            this.itemShown.licsensDate
          ).format("YYYY-MM-DD");
        }
        this.checkIfTrueOrFalse(); // check the plus if true or false
        console.log(res[0]);
        this.dataDiv = res[0].goddet;
        // this.showGoddetData();
        this.jumpingRemark();
        this.notActive();
      }
    });
  }

  checkIfTrueOrFalse() {
    if (
      this.itemShown.StickerLanguageK == "" ||
      this.itemShown.StickerLanguageK == "---" ||
      this.itemShown.StickerLanguageK == undefined
    ) {
      this.mainLanguage = false;
    } else {
      this.mainLanguage = true;
    }

    if (
      this.itemShown.StickerLanguageKTwo == "" ||
      this.itemShown.StickerLanguageKTwo == "---" ||
      this.itemShown.StickerLanguageKTwo == undefined
    ) {
      this.mainLanguageTwo = false;
    } else {
      this.mainLanguageTwo = true;
    }

    if (
      this.itemShown.StickerLanguageKThree == "" ||
      this.itemShown.StickerLanguageKThree == "---" ||
      this.itemShown.StickerLanguageKThree == undefined
    ) {
      this.mainLanguageThree = false;
    } else {
      this.mainLanguageThree = true;
    }
    if (
      this.itemShown.StickerLanguageKFour == "" ||
      this.itemShown.StickerLanguageKFour == "---" ||
      this.itemShown.StickerLanguageKFour == undefined
    ) {
      this.mainLanguageFour = false;
    } else {
      this.mainLanguageFour = true;
    }

    if (
      this.itemShown.department == "" ||
      this.itemShown.department == "---" ||
      this.itemShown.department == undefined
    ) {
      this.department = false;
    } else {
      this.department = true;
    }

    if (
      this.itemShown.volumeKey == "" ||
      this.itemShown.volumeKey == "---" ||
      this.itemShown.volumeKey == undefined
    ) {
      this.volumeMl = false;
    } else {
      this.volumeMl = true;
    }

    if (
      this.itemShown.netWeightK == "" ||
      this.itemShown.netWeightK == "---" ||
      this.itemShown.netWeightK == undefined
    ) {
      this.netWeightK = false;
    } else {
      this.netWeightK = true;
    }

    if (
      this.itemShown.grossUnitWeightK == "" ||
      this.itemShown.grossUnitWeightK == "---" ||
      this.itemShown.grossUnitWeightK == undefined
    ) {
      this.grossWeightUnit = false;
    } else {
      this.grossWeightUnit = true;
    }

    if (
      this.itemShown.peerPharmTone == "" ||
      this.itemShown.peerPharmTone == "---" ||
      this.itemShown.peerPharmTone == undefined
    ) {
      this.peerPharmTone = false;
    } else {
      this.peerPharmTone = true;
    }

    if (
      this.itemShown.productionInput == "" ||
      this.itemShown.productionInput == "---" ||
      this.itemShown.productionInput == undefined
    ) {
      this.production = false;
      this.productionType = "";
      this.productionImage = "";
    } else {
      this.production = true;
    }

    if (
      this.itemShown.productionTwoInput == "" ||
      this.itemShown.productionTwoInput == "---" ||
      this.itemShown.productionTwoInput == undefined
    ) {
      this.productionTwo = false;
      this.productionTwoType = "";
      this.productionTwoImage = "";
    } else {
      this.productionTwo = true;
    }

    if (
      this.itemShown.productionThreeInput == "" ||
      this.itemShown.productionThreeInput == "---" ||
      this.itemShown.productionThreeInput == undefined
    ) {
      this.productionThree = false;
      this.productionThreeType = "";
      this.productionThreeImage = "";
    } else {
      this.productionThree = true;
    }

    if (
      this.itemShown.productionFourInput == "" ||
      this.itemShown.productionFourInput == "---" ||
      this.itemShown.productionFourInput == undefined
    ) {
      this.productionFour = false;
      this.productionFourType = "";
      this.productionFourImage = "";
    } else {
      this.productionFour = true;
    }

    if (
      this.itemShown.productionFiveInput == "" ||
      this.itemShown.productionFiveInput == "---" ||
      this.itemShown.productionFiveInput == undefined
    ) {
      this.productionFive = false;
      this.productionFiveType = "";
      this.productionFiveImage = "";
    } else {
      this.productionFive = true;
    }

    if (
      this.itemShown.productionSixInput == "" ||
      this.itemShown.productionSixInput == "---" ||
      this.itemShown.productionSixInput == undefined
    ) {
      this.productionSix = false;
      this.productionSixType = "";
      this.productionSixImage = "";
    } else {
      this.productionSix = true;
    }

    if (
      this.itemShown.productionSevenInput == "" ||
      this.itemShown.productionSevenInput == "---" ||
      this.itemShown.productionSevenInput == undefined
    ) {
      this.productionSeven = false;
      this.productionSevenType = "";
      this.productionSevenImage = "";
    } else {
      this.productionSeven = true;
    }

    if (
      this.itemShown.productionEightInput == "" ||
      this.itemShown.productionEightInput == "---" ||
      this.itemShown.productionEightInput == undefined
    ) {
      this.productionEight = false;
      this.productionEightType = "";
      this.productionEightImage = "";
    } else {
      this.productionEight = true;
    }
  }

  checkIfItemExist(itemNumber) {
    if (itemNumber != "") {
      this.itemsService.getItemData(itemNumber).subscribe((data) => {
        if (data.length > 0) this.itemExist = true;
        else this.itemExist = false;
      });
    }
  }

  async addNewItem() {
    if (
      confirm(
        `You are going to create a new Item Tree num. ${this.itemShown.itemNumber} . Continue?`
      )
    ) {
      this.editSpecTable = false; // specification auth
      if (this.itemShown.itemNumber != "") {
        this.itemsService.addItem(this.itemShown).subscribe((data) => {
          this.toastr.success("" + data.message);
          location.reload();
        });
      }
    }
  }

  updateBtn() {
    if (!this.itemShown.netWeightK) {
      alert("Net Weight Gr must have a value. Fill the unit net weight");

      return;
    }
    this.modalService.open(this.editItemModal);
  }

  updateItem() {
    if (this.itemLockedForEdit) {
      alert("item is used in open ordres! cant edit. contact system admin!");
      return;
    }
    this.lookingForItem = true;
    if (this.itemShown.itemNumber != "") {
      this.itemShown.nameOfupdating = this.user.userName;
      console.log(this.itemShown);
      if (!this.itemShown.netWeightK) {
        this.toastr.error(
          "Net Weight Gr must have a value. Fill the unit net weight"
        );
        alert("Net Weight Gr must have a value. Fill the unit net weight");

        return;
      }
      this.itemsService.updateItem(this.itemShown).subscribe((res) => {
        console.log(res);

        if (res.msg) {
          this.toastr.error(res.msg);
        } else if (res) {
          if (
            res.WPresult &&
            res.WPresult.n > 0 &&
            res.WPresult.nModified == res.WPresult.n &&
            res.WPresult.ok == 1
          ) {
            this.toastr.success(
              "Workplans contaning this item were updated successfully"
            );
          }
          if (
            res.itemResult &&
            res.itemResult.nModified == 1 &&
            res.itemResult.ok == 1
          ) {
            this.toastr.success(
              `Item ${this.itemShown.itemNumber} updated successfully!`
            );
            location.reload();
          }
        } else {
          this.toastr.error("Operation failed, no item was updated");
        }
        this.editSpecTable = false;
        this.lookingForItem = false;
        this.modalService.dismissAll();
      });
    } else {
      this.toastr.error("No item number!");
      this.lookingForItem = false;
      this.modalService.dismissAll();
    }
  }

  selectFile(event, src) {
    switch (src) {
      case "bottle":
        this.bottleFile = true;
        break;
      case "pump":
        this.pumpFile = true;
        break;
      case "seal":
        this.sealFile = true;
        break;
      case "cap":
        this.capFile = true;
        break;
      case "extra1":
        this.extra1File = true;
        break;
      case "extra2":
        this.extra2File = true;
        break;
      case "laser1":
        this.laser1File = true;
        break;
      case "laser2":
        this.laser2File = true;
        break;
      case "main1":
        this.main1File = true;
        break;
      case "main2":
        this.main2File = true;
        break;
      case "main3":
        this.main3File = true;
        break;
      case "main4":
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
    switch (type) {
      case "mainLang":
        if (this.mainLanguage == true) {
          this.mainLanguage = false;
          this.itemShown.StickerLanguageK = "---";
        } else {
          this.mainLanguage = true;
        }
        break;

      case "mainLangTwo":
        if (this.mainLanguageTwo == true) {
          this.mainLanguageTwo = false;
          this.itemShown.StickerLanguageKTwo = "---";
        } else {
          this.mainLanguageTwo = true;
        }
        break;

      case "mainLangThree":
        if (this.mainLanguageThree == true) {
          this.mainLanguageThree = false;
          this.itemShown.StickerLanguageKThree = "---";
        } else {
          this.mainLanguageThree = true;
        }
        break;

      case "mainLangFour":
        if (this.mainLanguageFour == true) {
          this.mainLanguageFour = false;
          this.itemShown.StickerLanguageKFour = "---";
        } else {
          this.mainLanguageFour = true;
        }
        break;

      case "department":
        if (this.department == true) {
          this.department = false;
          this.itemShown.department = "---";
        } else {
          this.department = true;
        }
        break;

      case "production":
        if (this.production == true) {
          this.production = false;
          this.itemShown.productionInput = "---";
        } else {
          this.production = true;
        }
        break;

      case "productionTwo":
        if (this.productionTwo == true) {
          this.productionTwo = false;
          this.itemShown.productionTwoInput = "---";
        } else {
          this.productionTwo = true;
        }
        break;

      case "productionThree":
        if (this.productionThree == true) {
          this.productionThree = false;
          this.itemShown.productionThreeInput = "---";
        } else {
          this.productionThree = true;
        }
        break;

      case "productionFour":
        if (this.productionFour == true) {
          this.productionFour = false;
          this.itemShown.productionFourInput = "---";
        } else {
          this.productionFour = true;
        }
        break;

      case "productionFive":
        if (this.productionFive == true) {
          this.productionFive = false;
          this.itemShown.productionFiveInput = "---";
        } else {
          this.productionFive = true;
        }
        break;

      case "productionSix":
        if (this.productionSix == true) {
          this.productionSix = false;
          this.itemShown.productionSixInput = "---";
        } else {
          this.productionSix = true;
        }
        break;
      case "productionSeven":
        if (this.productionSeven == true) {
          this.productionSeven = false;
          this.itemShown.productionSevenInput = "---";
        } else {
          this.productionSeven = true;
        }
        break;
      case "productionEight":
        if (this.productionEight == true) {
          this.productionEight = false;
          this.itemShown.productionEightInput = "---";
        } else {
          this.productionEight = true;
        }
        break;

      case "volumeMl":
        if (this.volumeMl == true) {
          this.volumeMl = false;
          this.itemShown.volumeKey = "---";
        } else {
          this.volumeMl = true;
        }
        break;

      case "netWeightK":
        if (this.netWeightK == true) {
          this.netWeightK = false;
          this.itemShown.netWeightK = "---";
        } else {
          this.netWeightK = true;
        }
        break;

      case "grossWeightUnit":
        if (this.grossWeightUnit == true) {
          this.grossWeightUnit = false;
          this.itemShown.grossUnitWeightK = "---";
        } else {
          this.grossWeightUnit = true;
        }
        break;

      case "peerPharmTone":
        if (this.peerPharmTone == true) {
          this.peerPharmTone = false;
          this.itemShown.peerPharmTone = "---";
        } else {
          this.peerPharmTone = true;
        }
        break;

      case "laserAndExp":
        if (this.laserAndExp == true) {
          this.laserAndExp = false;
        } else {
          this.laserAndExp = true;
        }
        break;
    }
  }

  upload(src) {
    // const number = this.route.snapshot.paramMap.get('itemNumber');
    const number = this.itemShown.itemNumber;
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService
      .pushFileToStorage(this.currentFileUpload, src, number)
      .subscribe((event) => {
        console.log(event);

        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event instanceof HttpResponse) {
          console.log("File is completely uploaded!");
          console.log(event.body);
          this.showSuccess();
          switch (src) {
            case "bottle":
              this.bottleFile = false;
              this.item.bottleImage = "" + event.body;
              this.itemShown.bottleImage = "" + event.body;
              break;
            case "cap":
              this.capFile = false;
              this.item.capImage = "" + event.body;
              this.itemShown.capImage = "" + event.body;
              break;
            case "pump":
              this.pumpFile = false;
              this.item.pumpImage = "" + event.body;
              this.itemShown.pumpImage = "" + event.body;
              break;
            case "seal":
              this.sealFile = false;
              this.item.sealImage = "" + event.body;
              this.itemShown.sealImage = "" + event.body;
              break;
            case "extra1":
              this.extra1File = false;
              this.item.extraImage1 = "" + event.body;
              this.itemShown.extraImage1 = "" + event.body;
              break;
            case "extra2":
              this.extra2File = false;
              this.item.extraImage2 = "" + event.body;
              this.itemShown.extraImage2 = "" + event.body;
              break;
            case "laser1":
              this.laser1File = false;
              this.item.laserImage1 = "" + event.body;
              this.itemShown.laserImage1 = "" + event.body;
              break;
            case "laser2":
              this.laser2File = false;
              this.item.laserImage2 = "" + event.body;
              this.itemShown.laserImage2 = "" + event.body;
              break;
            case "main1":
              this.main1File = false;
              this.item.imgMain1 = "" + event.body;
              this.itemShown.imgMain1 = "" + event.body;
              break;
            case "main2":
              this.main2File = false;
              this.item.imgMain2 = "" + event.body;
              this.itemShown.imgMain2 = "" + event.body;
              break;
            case "main3":
              this.main3File = false;
              this.item.imgMain3 = "" + event.body;
              this.itemShown.imgMain3 = "" + event.body;
              break;
            case "main4":
              this.main4File = false;
              this.item.imgMain4 = "" + event.body;
              this.itemShown.imgMain4 = "" + event.body;
              break;
            default:
              break;
          }
        }
      });

    this.selectedFiles = undefined;
  }

  showSuccess() {
    this.toastr.info("Successful upload!");
  }

  loadCartonName(cartonNumber) {
    this.invtSer.getCmptByitemNumber(cartonNumber).subscribe((data) => {
      if (data) {
        this.itemShown.cartonName = data[0].componentName;
      }
    });
  }

  loadCartonName2(cartonNumber) {
    this.invtSer.getCmptByitemNumber(cartonNumber).subscribe((data) => {
      if (data) {
        this.itemShown.cartonName2 = data[0].componentName;
      }
    });
  }

  loadPackagDetails(number, src) {
    if (number != "") {
      this.invtSer.getCmptByNumber(number, "product").subscribe((res) => {
        switch (src) {
          case "bottle":
            this.itemShown.item1w = res[0].packageWeight;
            this.itemShown.item1s = res[0].packageType;
            break;
          case "cap":
            this.itemShown.item2w = res[0].packageWeight;
            this.itemShown.item2s = res[0].packageType;
            break;
          case "pump":
            this.itemShown.item3w = res[0].packageWeight;
            this.itemShown.item3s = res[0].packageType;
            break;
          case "seal":
            this.itemShown.item4w = res[0].packageWeight;
            this.itemShown.item4s = res[0].packageType;
            break;
          case "carton":
            this.itemShown.itemCtnW = res[0].packageWeight;
            break;
        }
      });
    }
  }

  getUserInfo() {
    if (this.authService.loggedInUser) {
      this.user = this.authService.loggedInUser;
      if (this.user.authorization) {
        if (
          this.authService.loggedInUser.authorization.includes("updateItemTree")
        ) {
          this.alowUserEditItemTree = true;
        }
        if (
          this.authService.loggedInUser.authorization.includes(
            "updateItemSpecs"
          )
        ) {
          this.allowEditSpecTable = true;
        }
      }
    } else {
      this.authService.userEventEmitter.subscribe((user) => {
        this.user = user;
        if (this.user.authorization) {
          if (
            this.authService.loggedInUser.authorization.includes(
              "updateItemTree"
            )
          ) {
            this.alowUserEditItemTree = true;
          }
          if (
            this.authService.loggedInUser.authorization.includes(
              "updateItemSpecs"
            )
          ) {
            this.allowEditSpecTable = true;
          }
        }
      });
    }
  }
}
