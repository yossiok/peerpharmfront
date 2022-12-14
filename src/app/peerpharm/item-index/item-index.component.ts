import { Component, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UploadFileService } from "src/app/services/helpers/upload-file.service";
import { InventoryService } from "src/app/services/inventory.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { SuppliersService } from "src/app/services/suppliers.service";
import { Currencies } from "../procurement/Currencies";
import { ExcelService } from "src/app/services/excel.service";
import { ActivatedRoute } from "@angular/router";

const defaultCmpt = {
  whoPays: "",
  payingCustomersList: [],
  componentN: "",
  componentName: "",
  componentNs: "",
  itemType: "",
  suplierN: "",
  suplierName: "",
  componentType: "",
  componentCategory: "",
  img: "",
  importFrom: "",
  lastModified: "",
  minimumStock: "",
  needPrint: "",
  packageType: "",
  packageWeight: "",
  remarks: "",
  jumpRemark: "",
  componentItems: [],
  input_actualMlCapacity: 0,
  alternativeComponent: "",
  comaxName: "",
  alternativeSuppliers: [],
  price: "",
  connectedProducts: [],
  manufcaturerName: "",
};

const defaultMaterial = {
  componentN: "",
  componentName: "",
  remarks: "",
  img: "",
  minimumStock: "",
  manufcaturerName: "",
  packageWeight: "",
  itemType: "material",
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
  function: "",
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
  formuleRemarks: "",
  manualPrice: 0,
  manualCoin: "ILS",
  price: 0,
  coin: "ILS",
  priceUpdates: [],
};

@Component({
  selector: "app-item-index",
  templateUrl: "./item-index.component.html",
  styleUrls: ["./item-index.component.scss"],
})
export class ItemIndexComponent implements OnInit {
  @ViewChild("nameSelect") nameSelect: ElementRef;
  @ViewChild("itemNumber") itemNumber: ElementRef;
  @ViewChild("problem") problem: ElementRef;
  @ViewChild("problematicItemsER") problematicItemsER: ElementRef;

  item: any;
  newItem: any = { componentN: null };
  itemNames: any[];
  itemCasNumbers: any[];
  items: any[];
  itemMovements: any[];
  itemMovementsCopy: any[];
  lastOrdersOfItem: any[];
  materialLocations: any[];
  allSuppliers: any[];
  cmptTypes2: Array<any>;
  cmptTypes3: Array<any>;
  cmptMaterials: Array<any>;
  cmptMaterials2: Array<any>;

  currencies: Currencies;
  today: Date = new Date();
  rowNumber: number = -1;
  counter: number = 0;
  screenPermission: number;
  gettingProducts: boolean = false;
  fetchingOrders: boolean;
  allowUserEditItem: boolean;
  showDetailsForm: boolean = true;
  showMovementsForm: boolean = false;
  showSalesForm: boolean = false;
  allowedProblematicEdit: boolean = false;
  new: boolean = false;
  tempHiddenImgSrc: any;

  //Material Stuff
  compositionName: any;
  compositionPercentage: any;
  compostionFunction: any;
  compositionCAS: any;
  compEdit: number = -1;

  problematicItems: Array<any>;
  cmptCategoryList: Array<any> = [
    "Sacara",
    "Mineralium",
    "Arganicare",
    "Spa Pharma",
    "Olive",
    "Vitamin C",
    "Quinoa",
    "Andrea Milano",
    "Dermalosophy",
    "Kreogen",
    "Careline",
    "Frulatte",
    "Mediskin",
    "4Ever",
    "Adah Lazorgan",
    "Avalanche",
    "Abyssian",
    "Jahshan",
    "Mika",
    "Hyalunol",
    "Hemp",
    "Kiss",
    "Rose",
    "Collagen",
    "Gaya",
  ];

  cmptTypes: Array<any> = [
    "bottle_Glass",
    "bottle_Plastic",
    "jar_Glass",
    "jar_Plastic",
    "cap",
    "cover",
    "pump",
    "cosmetic_pump",
    "over_cap",
    "tube",
    "colons",
    "hair_life",
    "compacts",
    "personal_package",
    "master_carton",
    "newsletter",
    "irosol_valve",
    "irosol_bottle",
    "irosol_hectotor",
    "irosol_bottle",
    "cellophane",
    "sticker",
    "sachet",
    "godett",
    "plate",
    "other",
  ];

  supplier: any = {
    supplierName: "",
    price: "",
    coin: "",
    coinLoading: "",
    priceLoading: "",
    manufacturer: "",
    alternativeMaterial: "",
    alterName: "",
    subGroup: "",
    packageWeight: "",
  };

  itemMovementForm: FormGroup = new FormGroup({
    itemType: new FormControl("all", Validators.required),
    itemNumbers: new FormControl([""], Validators.required),
    componentType: new FormControl("skip"),
    fromDate: new FormControl(new Date()),
    toDate: new FormControl(null),
    movementType: new FormControl("in", Validators.required),
    // price: new FormControl(null),
    // priceDir: new FormControl('higherThan'),
    amount: new FormControl(null),
    amountDir: new FormControl("higherThan"),
  });

  itemDetailsForm: FormGroup = new FormGroup({
    itemType: new FormControl("all", Validators.required),
    itemNumber: new FormControl("", Validators.required),
    itemName: new FormControl("", Validators.minLength(3)),
    cas: new FormControl("", Validators.minLength(3)),
  });

  get itemName() {
    return this.itemDetailsForm.get("itemName");
  }

  editVersionForm: FormGroup = new FormGroup({
    date: new FormControl(new Date(this.today), Validators.required),
    versionNumber: new FormControl(null, Validators.required),
    description: new FormControl("", Validators.required),
    image: new FormControl(null, Validators.required),
    user: new FormControl(null, Validators.required),
  });

  productsSoldForm: FormGroup = new FormGroup({
    productNumber: new FormControl(""),
    fromDate: new FormControl(new Date()),
    toDate: new FormControl(null),
    amount: new FormControl(null),
    amountDir: new FormControl("higherThan"),
  });
  allowPriceUpdate: boolean = false;
  supPurchases: any[] = [];
  fetchingMovements: boolean;

  constructor(
    private inventoryService: InventoryService,
    private toastSrv: ToastrService,
    private supplierService: SuppliersService,
    private procuretServ: Procurementservice,
    private authService: AuthService,
    private modalService: NgbModal,
    private uploadService: UploadFileService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllSuppliers();
    this.allowedProblematicEdit =
      this.authService.loggedInUser.userName == "haviv" ||
      this.authService.loggedInUser.userName == "martha" ||
      this.authService.loggedInUser.userName == "sima" ||
      this.authService.loggedInUser.userName == "dani";
    this.screenPermission = Number(
      this.authService.loggedInUser.screenPermission
    );
    this.getCurrencies();
    if (this.authService.loggedInUser.authorization.includes("updateStock")) {
      this.allowUserEditItem = true;
    }
    this.allowPriceUpdate =
      Number(this.authService.loggedInUser.screenPermission) < 4;
    setTimeout(() => this.itemNumber.nativeElement.focus(), 500);

    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      if (params.itemNumber) {
        this.itemDetailsForm.controls.itemNumber.setValue(params.itemNumber);
        this.getItemData();
      }
    });
  }

  setFormView(form) {
    switch (form) {
      case "itemDetails":
        this.showDetailsForm = true;
        this.showMovementsForm = false;
        this.showSalesForm = false;
        break;
      case "movements":
        this.showDetailsForm = false;
        this.showMovementsForm = true;
        this.showSalesForm = false;
        break;
      case "sales":
        this.showDetailsForm = false;
        this.showMovementsForm = false;
        this.showSalesForm = true;
        break;
    }
  }

  open(modal) {
    this.modalService.open(modal);
  }

  setColors(title) {
    switch (title) {
      case "title1":
        return "title1";
      case "title2":
        return "title2";
      case "title3":
        return "title3";
    }
  }

  getAllTypes() {
    this.inventoryService.getAllComponentTypes().subscribe((allTypes) => {
      this.cmptTypes = allTypes;
    });
    this.inventoryService.getAllComponentTypes2().subscribe((allTypes) => {
      this.cmptTypes2 = allTypes;
    });
    this.inventoryService.getAllComponentTypes3().subscribe((allTypes) => {
      this.cmptTypes3 = allTypes;
    });
  }

  getAllCmptMaterials() {
    this.inventoryService
      .getAllComponentMaterials()
      .subscribe((allMaterials) => {
        this.cmptMaterials = allMaterials;
      });
    this.inventoryService
      .getAllComponentMaterials2()
      .subscribe((allMaterials) => {
        this.cmptMaterials2 = allMaterials;
      });
  }

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((data) => {
      this.allSuppliers = data;
    });
  }

  getCurrencies() {
    this.procuretServ.getCurrencies().subscribe((currencies) => {
      delete currencies[0]._id;
      this.currencies = currencies[0];
    });
  }

  setItemNumber(i, e) {
    this.itemMovementForm.value.itemNumbers[i] = e.target.value;
  }

  fetchMovements() {
    this.fetchingMovements = true;
    this.inventoryService
      .getComplexItemMovements(this.itemMovementForm.value)
      .subscribe((data) => {
        this.fetchingMovements = false;
        this.item = undefined;
        this.itemMovements = data;
        this.itemMovementsCopy = data;
      });
  }

  resetMovements() {
    this.itemMovementForm.reset();
    this.itemMovements = undefined;
    this.itemMovementForm.controls.itemNumbers.setValue([""]);
  }

  getItemData() {
    this.itemMovements = [];
    this.inventoryService
      .getItemByNumber(this.itemDetailsForm.value.itemNumber)
      .subscribe((item) => {
        if (item.msg) this.toastSrv.error(item.msg);
        else {
          // update price
          if (item.price && item.coin) {
            item.priceILS = (
              Number(item.price) * this.currencies[item.coin.toUpperCase()]
            ).toFixed(2);
          } else if (item.manualPrice && item.manualCoin) {
            item.priceILS = (
              Number(item.manualPrice) *
              this.currencies[item.manualCoin.toUpperCase()]
            ).toFixed(2);
          }
          item.active = item.notActive ? "???? ????????" : "????????";
          item.color = item.notActive ? "red" : "blue";
          this.item = item;

          this.getLastOrdersItem(20);
          this.getProductsWithItem();
        }
      });
  }

  // Get names of all items for search
  getNames(event) {
    if (event.value.length > 2) {
      this.inventoryService.getNamesByRegex(event.value).subscribe((names) => {
        if (names.length == 0) this.toastSrv.error("???? ?????????? ???????????? ????????????");
        else {
          this.itemNames = names;
          this.itemDetailsForm.controls.itemNumber.setValue(
            names[0].componentN
          );
        }
      });
    }
  }

  // Get CAS numbers of all items for search
  getCasNumbers(event) {
    if (event.value.length > 1) {
      this.inventoryService
        .getCasNumbersByRegex(event.value)
        .subscribe((casNumbers) => {
          if (casNumbers.length == 0)
            this.toastSrv.error("???? ?????????? ???????????? ????????????");
          else {
            this.itemCasNumbers = casNumbers;
            this.itemDetailsForm.controls.itemNumber.setValue(
              casNumbers[0].componentN
            );
          }
        });
    }
  }

  setItemDetailsNumber(event) {
    this.itemDetailsForm.controls.itemNumber.setValue(event.target.value);
  }

  sortBy(array, by) {
    if (by.includes("Date")) {
      this[array].map((element) => {
        element.formatedDate = new Date(element[by]);
        return element;
      });
      by = "formatedDate";
    }
    if (this.counter % 2 == 0) this[array].sort((a, b) => a[by] - b[by]);
    else this[array].sort((a, b) => b[by] - a[by]);
    this.counter++;
  }

  filter(key, value) {
    this.itemMovements = this.itemMovementsCopy.filter(
      (movement) => movement[key] == value
    );
  }

  fetchProducts() {}

  checkIfItemExist(ev) {
    var itemNumber = ev.target.value;
    if (itemNumber != "") {
      this.inventoryService
        .getCmptByitemNumber(itemNumber)
        .subscribe((data) => {
          if (data.length > 0) {
            this.toastSrv.error("?????? ???? ! ???????? ???? ???????? ????????????");
          } else {
            console.log("ok");
          }
        });
    }
  }

  fillSupplierDetails() {
    if (this.item.suplierN != "") {
      this.supplierService
        .getSuppliersByNumber(this.item.suplierN)
        .subscribe((data) => {
          if (data) {
            this.item.suplierName = data[0].suplierName;
          }
        });
    }
  }

  writeNewStockItem(itemType) {
    switch (itemType) {
      case "material":
        this.writeNewMaterial();
        break;
      case "component":
        defaultCmpt.itemType = "component";
        this.writeNewComponent();
        break;
      case "product":
        defaultCmpt.itemType = "product";
        this.writeNewComponent();
        break;
    }
  }

  writeNewComponent() {
    this.item = { ...defaultCmpt };
    if (this.newItem.componentN != "") {
      this.item.componentN = this.newItem.componentN;
      this.inventoryService.addNewCmpt(this.item).subscribe((res) => {
        if (res == "itemExist") {
          this.toastSrv.error("???????? ?????? ???????? ????????????");
        } else if (res.componentN) {
          this.item = res;
          this.toastSrv.success("New stock item created");
          // this.resetResCmptData();
        }
        this.modalService.dismissAll();
      });
    } else {
      this.toastSrv.error("Can't create new stock item without number");
      this.modalService.dismissAll();
    }
  }

  writeNewMaterial() {
    this.item = { ...defaultMaterial };
    if (this.newItem.componentN != "") {
      this.item.componentN = this.newItem.componentN;
      this.inventoryService.addNewMaterial(this.item).subscribe((res) => {
        if (res == "???????? ???????? ???????????? !") {
          this.toastSrv.error("???????? ?????? ???????? ???????????? !");
        } else {
          this.item = res;
          this.toastSrv.success("New material item created");
        }
        this.modalService.dismissAll();
      });
    }
  }

  resetResCmptData() {
    this.item = {
      whoPays: "",
      payingCustomersList: [],
      componentN: "",
      componentName: "",
      componentNs: "",
      suplierN: "",
      suplierName: "",
      componentType: "",
      componentCategory: "",
      img: "",
      importFrom: "",
      lastModified: "",
      minimumStock: "",
      minimumPurchaseAmount: 0,
      manufcaturerName: "",
      needPrint: "",
      packageType: "",
      packageWeight: "",
      remarks: "",
      componentItems: [],
      input_actualMlCapacity: 0,
    };
  }

  editItemDetails() {
    console.log(this.item);
    if (confirm("?????????? ?????????")) {
      if (
        this.item.itemType == "component" ||
        this.item.itemType == "product"
      ) {
        this.inventoryService.updateCompt(this.item).subscribe((res) => {
          if (res._id) {
            // this.getAllMaterialLocations()
            this.getItemData();
            this.toastSrv.success("???????? ?????????? ????????????");
          } else {
            this.toastSrv.error("?????????? ???????? ????????");
          }
        });
      } else if (this.item.itemType == "material") {
        this.inventoryService.updateMaterial(this.item).subscribe((res) => {
          if (res.msg == "noUpdate") {
            this.toastSrv.error("?????????? ???????? ????????");
          } else {
            if (res._id) {
              this.getItemData();
              this.toastSrv.success("???????? ?????????? ????????????");
            } else {
              this.toastSrv.error("?????????? ???????? ????????");
            }
          }
        });
      }
    }
  }

  uploadCoaMaster(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    this.uploadService.uploadFileToS3Storage(file).subscribe((data) => {
      if (data.partialText) {
        this.item.coaMaster = data.partialText;
      }
    });
  }

  uploadMsds(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    this.uploadService.uploadFileToS3Storage(file).subscribe((data) => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.item.msds = data.partialText;
      }
    });
  }

  addComposition() {
    var obj = {
      compName: this.compositionName,
      compPercentage: this.compositionPercentage,
      compFunction: this.compostionFunction,
      compCAS: this.compositionCAS,
    };
    this.item.composition.push(obj);
    this.compositionName = "";
    this.compositionPercentage = null;
    this.compostionFunction = "";
    this.compositionCAS = "";
  }

  editComp(i) {
    this.compEdit = i;
  }

  deleteFromComposition(materialId, compositionName) {
    for (let i = 0; i < this.item.composition.length; i++) {
      if (this.item.composition[i].compName == compositionName) {
        this.item.composition.splice(i, 1);
        this.toastSrv.success("Composition Deleted");
      }
    }
  }

  //problematic item stuff

  downloadProblematicItemsReport() {
    this.inventoryService
      .getAllProblematicItems()
      .subscribe((problematicItems) => {
        this.problematicItems = problematicItems;
        this.modalService.open(this.problematicItemsER);
        let excel = [];
        for (let item of problematicItems) {
          excel.push({
            item: item.componentN,
            name: item.componentName,
          });
          for (let problem of item.problems) {
            excel.push({
              item: item.componentN,
              name: item.componentName,
              problem,
            });
          }
        }
        this.excelService.exportAsExcelFile(
          excel,
          `Problematic items ${new Date().toString().slice(0, 10)}`
        );
      });
  }

  addProblem() {
    if (this.problem.nativeElement.value == "")
      this.toastSrv.warning("???? ?????????? ???????? ???? ?????????? ???????? ????????????");
    else {
      this.item.problems.push(this.problem.nativeElement.value);
      this.problem.nativeElement.value = "";
    }
  }

  chooseProblem(event, value) {
    this.problem.nativeElement.value = event.target.value;
    console.log(event);
    console.log(value);
  }

  removeProblem(i) {
    this.item.problems.splice(i, 1);
  }

  addToPriceHistory() {
    let componentN = this.item.componentN;
    let newPrice = this.item.manualPrice;
    let coin = this.item.manualCoin;
    let user = this.authService.loggedInUser.userName;
    this.inventoryService
      .updatePriceHistory(this.item.componentN, newPrice, coin, user)
      .subscribe((data) => {
        this.item.priceUpdates.push({
          price: newPrice,
          coin,
          user,
          date: new Date(),
          type: "manual",
        });
      });
    this.toastSrv.info("", "???? ?????????? ????????");
    this.allowPriceUpdate = false;
    this.modalService.dismissAll();
  }

  checkUpdatePriceValidity(type) {
    this.allowPriceUpdate = false;
    this.allowPriceUpdate =
      this.item.manualCoin != undefined && this.item.manualPrice != undefined;
  }

  getSupplierPriceHistory(i) {
    //TODO: get supplier NUmber!!!
    this.procuretServ
      .getAllOrdersFromSupplier(this.item.alternativeSuppliers[i].suplierNumber)
      .subscribe((data) => {
        this.supPurchases = data.filter(
          (purchase) => purchase.status == "open"
        );
        for (let order of data) {
        }
      });
  }

  getAllMaterialLocations() {
    this.inventoryService.getAllMaterialLocations().subscribe((data) => {
      this.materialLocations = data;
    });
  }

  getProductsWithItem() {
    this.gettingProducts = true;
    this.inventoryService
      .getAllProductsWithItem(this.item.componentN)
      .subscribe((response) => {
        this.gettingProducts = false;
        if (response.allProductsWithItem)
          this.item.connectedProducts = response.allProductsWithItem;
      });
  }

  addSupplierToComponent() {
    if (
      this.supplier.price == "" ||
      this.supplier.price == "" ||
      this.supplier.supplierName == ""
    ) {
      this.toastSrv.error("?????? ???????? ???? ?????? , ???????? ?????????? ");
    } else {
      this.item.alternativeSuppliers.push(this.supplier);
      this.toastSrv.success("?????? ???????? ???????????? , ???? ?????????? ?????????? ???????? !");
      this.supplier = {
        supplierName: "",
        price: "",
        coin: "",
        coinLoading: "",
        priceLoading: "",
        manufacturer: "",
        alternativeMaterial: "",
        alterName: "",
        subGroup: "",
        packageWeight: "",
      };
    }
  }

  mainSupplier(isMain) {
    if (isMain) {
      return "lightgreen";
    } else {
      return "";
    }
  }

  edit(index) {
    this.rowNumber = index;
  }

  makeAsMainSupplier(index) {
    let id = this.item._id;
    this.inventoryService.setAsMainSupplier(index, id).subscribe((data) => {
      if (data) {
        this.item.alternativeSuppliers = data.alternativeSuppliers;
        this.item.suplierName = data.suplierName;
        this.item.suplierN = data.suplierN;
        this.item.componentNs = data.componentNs;
        this.item.price = data.price;

        this.toastSrv.success("?????? ???????? ?????????? ????????????!");
      }
    });
  }

  addSupplierToMaterial() {
    if (
      this.supplier.price == "" ||
      this.supplier.price == "" ||
      this.supplier.supplierName == ""
    ) {
      this.toastSrv.error("?????? ???????? ???? ?????? , ???????? ?????????? ");
    } else {
      this.item.alternativeSuppliers.push(this.supplier);

      this.toastSrv.success("?????? ???????? ???????????? , ???? ?????????? ?????????? ???????? !");
      this.supplier = {
        supplierName: "",
        price: "",
        coin: "",
        coinLoading: "",
        priceLoading: "",
        manufacturer: "",
        alternativeMaterial: "",
        alterName: "",
        subGroup: "",
        packageWeight: "",
        expectedArrival: "",
      };
    }
  }

  updateComponentVersion() {
    this.editVersionForm.controls.user.setValue(
      this.authService.loggedInUser.userName
    );
    this.item.versionNumber = this.editVersionForm.get("versionNumber").value;
    this.item.versionHistory.push(this.editVersionForm.value);
    this.editItemDetails();
    this.editVersionForm.reset();
  }

  uploadImg(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    this.uploadService.uploadFileToS3Storage(file).subscribe((data) => {
      if (data.partialText) {
        this.item.img = data.partialText;
        this.editVersionForm.controls.image.setValue(this.item.img);
      }
    });
  }

  deleteSupplier(index) {
    if (confirm("?????? ?????????? ?????? ?")) {
      this.item.alternativeSuppliers.splice(index, 1);
      this.toastSrv.success("?????? ???????? ???????????? , ???? ?????????? ?????????? ???????? !");
    }
  }

  getLastOrdersItem(numOfOrders) {
    this.fetchingOrders = true;
    this.procuretServ
      .getLastOrdersForItem(this.item.componentN, numOfOrders)
      .subscribe((orders) => {
        this.fetchingOrders = false;
        if (orders && orders.length > 0) {
          orders.map((order) => {
            if (order.coin) order.coin = order.coin.toUpperCase();
            if (order.price)
              order.localPrice = order.price * this.currencies[order.coin];
            return order;
          });
          this.lastOrdersOfItem = orders;
        } else
          this.lastOrdersOfItem = [
            {
              orderNumber: "Sorry.",
              supplierName: "No",
              status: "orders",
              arrivedAmount: "for this",
              quantity: "item.",
            },
          ];
      });
  }

  resetItemDetailsForm() {
    this.itemDetailsForm.reset();
    this.item = undefined;
    this.itemNames = [];
    this.itemCasNumbers = [];
  }
  // EXCEL EXPORT ---------------------------------------------------------------
  getCurrListToExcel() {
    let productsList = [];
    let list = this.item.connectedProducts;
    for (let index = 0; index < list.length; index++) {
      productsList.push({
        ID: index + 1,
        "Product Number": list[index].itemNumber,
        "Brand Name": list[index].name,
        "Material Name": list[index].subName,
        Description: list[index].discriptionK,
      });
    }

    this.exportAsXLSX(productsList);
  }
  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(data, "connectedProducts");
  }
  // ----------------------------------------------------------------------------
}
