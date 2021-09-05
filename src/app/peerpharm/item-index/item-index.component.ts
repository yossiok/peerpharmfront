import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UploadFileService } from 'src/app/services/helpers/upload-file.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { Currencies } from '../procurement/Currencies';

@Component({
  selector: 'app-item-index',
  templateUrl: './item-index.component.html',
  styleUrls: ['./item-index.component.scss']
})
export class ItemIndexComponent implements OnInit {

  @ViewChild('nameSelect') nameSelect: ElementRef
  @ViewChild('itemNumber') itemNumber: ElementRef

  item: any;
  itemNames: any[]
  items: any[]
  itemMovements: any[];
  itemMovementsCopy: any[];
  lastOrdersOfItem: any[]
  materialLocations: any[]
  allSuppliers: any[];
  cmptTypes2: Array<any>
  cmptTypes3: Array<any>
  cmptMaterials: Array<any>
  cmptMaterials2: Array<any>

  currencies: Currencies;
  today: Date = new Date()
  rowNumber: number = -1
  counter: number = 0
  screenPermission: number;
  gettingProducts: boolean;
  fetchingOrders: boolean;
  allowUserEditItem: boolean;
  showDetailsForm: boolean = true
  showMovementsForm: boolean = false
  showSalesForm: boolean = false
  allowedProblematicEdit: boolean = false

  //Material Stuff
  compositionName: any;
  compositionPercentage: any;
  compostionFunction: any;
  compositionCAS: any;
  compEdit: number = -1

  cmptCategoryList: Array<any> = [
    'Sacara', 'Mineralium', 'Arganicare', 'Spa Pharma', 'Olive', 'Vitamin C', 'Quinoa', 'Andrea Milano', 'Dermalosophy',
    'Kreogen', 'Careline', 'Frulatte', 'Mediskin', '4Ever', 'Adah Lazorgan', 'Avalanche', 'Abyssian', 'Jahshan',
    'Mika', 'Hyalunol', 'Hemp', 'Kiss', 'Rose', 'Collagen', 'Gaya',
  ]

  cmptTypes: Array<any> = [
    'bottle_Glass', 'bottle_Plastic', 'jar_Glass', 'jar_Plastic', 'cap', 'cover', 'pump', 'cosmetic_pump',
    'over_cap', 'tube', 'colons', 'hair_life', 'compacts', 'personal_package', 'master_carton', 'newsletter',
    'irosol_valve', 'irosol_bottle', 'irosol_hectotor', 'irosol_bottle', 'cellophane', 'sticker', 'sachet', 'godett',
    'plate', 'other'
  ]

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

  itemMovementForm: FormGroup = new FormGroup({
    itemType: new FormControl('all', Validators.required),
    itemNumbers: new FormControl([''], Validators.required),
    componentType: new FormControl('skip'),
    fromDate: new FormControl(new Date()),
    toDate: new FormControl(null),
    movementType: new FormControl('in', Validators.required),
    // price: new FormControl(null),
    // priceDir: new FormControl('higherThan'),
    amount: new FormControl(null),
    amountDir: new FormControl('higherThan')
  })

  itemDetailsForm: FormGroup = new FormGroup({
    itemType: new FormControl('all', Validators.required),
    itemNumber: new FormControl('', Validators.required),
  })

  editVersionForm: FormGroup = new FormGroup({
    date: new FormControl(new Date(this.today), Validators.required),
    versionNumber: new FormControl(null, Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl(null, Validators.required),
    user: new FormControl(null, Validators.required),
  })

  productsSoldForm: FormGroup = new FormGroup({
    productNumber: new FormControl(''),
    fromDate: new FormControl(new Date()),
    toDate: new FormControl(null),
    amount: new FormControl(null),
    amountDir: new FormControl('higherThan')
  })
  allowPriceUpdate: boolean = false
  supPurchases: any[] = []
  fetchingMovements: boolean;

  constructor(
    private inventoryService: InventoryService,
    private toastSrv: ToastrService,
    private supplierService: SuppliersService,
    private procuretServ: Procurementservice,
    private authService: AuthService,
    private modalService: NgbModal,
    private uploadService: UploadFileService
  ) { }

  ngOnInit(): void {
    this.allowedProblematicEdit = this.authService.loggedInUser.userName == 'haviv' || this.authService.loggedInUser.userName == 'martha' || this.authService.loggedInUser.userName == 'sima'
    this.screenPermission = Number(this.authService.loggedInUser.screenPermission)
    this.getCurrencies()
    if (this.authService.loggedInUser.authorization.includes("updateStock")) {
      this.allowUserEditItem = true;
    }
    this.allowPriceUpdate = Number(this.authService.loggedInUser.screenPermission) < 4
    setTimeout(() => this.itemNumber.nativeElement.focus(), 500)
  }

  setFormView(form) {
    switch (form) {
      case 'itemDetails':
        this.showDetailsForm = true
        this.showMovementsForm = false
        this.showSalesForm = false
        break
      case 'movements':
        this.showDetailsForm = false
        this.showMovementsForm = true
        this.showSalesForm = false
        break
      case 'sales':
        this.showDetailsForm = false
        this.showMovementsForm = false
        this.showSalesForm = true
        break
    }
  }

  open(modal) {
    this.modalService.open(modal)
  }

  setColors(title) {
    switch (title) {
      case 'title1': return 'title1'
      case 'title2': return 'title2'
      case 'title3': return 'title3'
    }
  }

  getAllTypes() {
    this.inventoryService.getAllComponentTypes().subscribe(allTypes => {
      this.cmptTypes = allTypes
    })
    this.inventoryService.getAllComponentTypes2().subscribe(allTypes => {
      this.cmptTypes2 = allTypes
    })
    this.inventoryService.getAllComponentTypes3().subscribe(allTypes => {
      this.cmptTypes3 = allTypes
    })
  }

  getAllCmptMaterials() {
    this.inventoryService.getAllComponentMaterials().subscribe(allMaterials => {
      this.cmptMaterials = allMaterials
    })
    this.inventoryService.getAllComponentMaterials2().subscribe(allMaterials => {
      this.cmptMaterials2 = allMaterials
    })
  }

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe(data => {
      this.allSuppliers = data;
    })
  }

  getCurrencies() {
    this.procuretServ.getCurrencies().subscribe(currencies => {
      delete currencies[0]._id
      this.currencies = currencies[0]
    })
  }

  setItemNumber(i, e) {
    this.itemMovementForm.value.itemNumbers[i] = e.target.value
  }

  fetchMovements() {
    this.fetchingMovements = true
    this.inventoryService.getComplexItemMovements(this.itemMovementForm.value).subscribe(data => {
      this.fetchingMovements = false
      console.log(data)
      this.item = undefined
      this.itemMovements = data
      this.itemMovementsCopy = data
    })
  }

  resetMovements() {
    this.itemMovementForm.reset();
    this.itemMovements = undefined
    this.itemMovementForm.controls.itemNumbers.setValue([''])
  }

  getItemData() {
    this.itemMovements = []
    this.inventoryService.getItemByNumber(this.itemDetailsForm.value.itemNumber).subscribe(item => {
      if (item.msg) this.toastSrv.error(item.msg)
      else {
        this.item = item
        this.getLastOrdersItem(20, this.item.itemType)
      }
    })
  }

  // Get names of all items for search
  getNames(event) {
    if (event.value.length > 2) {
      this.inventoryService.getNamesByRegex(event.value).subscribe(names => {
        this.itemNames = names
        this.itemDetailsForm.controls.itemNumber.setValue(names[0].componentN)
      })
    }
  }

  setItemDetailsNumber(event) {
    this.itemDetailsForm.controls.itemNumber.setValue(event.target.value)
  }


  sortBy(array, by) {
    if (by.includes('Date')) {
      this[array].map(element => {
        element.formatedDate = new Date(element[by])
        return element;
      })
      by = 'formatedDate'
    }
    if (this.counter % 2 == 0) this[array].sort((a, b) => (a[by]) - (b[by]))
    else this[array].sort((a, b) => (b[by]) - (a[by]))
    this.counter++
  }

  filter(key, value) {
    this.itemMovements = this.itemMovementsCopy.filter(movement => movement[key] == value)
  }

  fetchProducts() {

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

  fillSupplierDetails() {
    if (this.item.suplierN != '') {
      this.supplierService.getSuppliersByNumber(this.item.suplierN).subscribe(data => {
        if (data) {
          this.item.suplierName = data[0].suplierName;
        }
      })
    }
  }

  getProductsWithItem() {
    this.gettingProducts = true;
    this.inventoryService.getAllProductsWithItem(this.item.componentN).subscribe(response => {
      this.gettingProducts = false;
      if (response.allProductsWithItem) this.item.connectedProducts = response.allProductsWithItem
    })
  }

  writeNewStockItem(itemType) {
    switch (itemType) {
      case 'material': this.writeNewMaterial()
        break;
      case 'component' || 'product': this.writeNewComponent()
        break;
    }
  }

  writeNewComponent() {
    if (this.item.componentN != "") {
      // this.item.itemType = this.stockType;
      console.log(this.item);
      this.inventoryService.addNewCmpt(this.item).subscribe(res => {
        console.log("res from front: " + res)
        if (res == "itemExist") {
          this.toastSrv.error('פריט קיים במלאי')
        } else if (res.componentN) {
          this.toastSrv.success("New stock item created");
          this.resetResCmptData();
        }
      });
    } else {
      this.toastSrv.error("Can't create new stock item without number")
    }
  }

  writeNewMaterial() {
    this.item.itemType = "material"
    if (this.item.componentN != "") {
      this.inventoryService.addNewMaterial(this.item).subscribe(res => {
        if (res == "פריט קיים במערכת !") {
          this.toastSrv.error("פריט קיים במערכת !")
        } else {
          this.toastSrv.success("New material item created");
        }
      });
    }
  }

  uploadCoaMaster(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    this.uploadService.uploadFileToS3Storage(file).subscribe(data => {
      if (data.partialText) {
        this.item.coaMaster = data.partialText;
      }
    })
  }

  uploadMsds(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    this.uploadService.uploadFileToS3Storage(file).subscribe(data => {
      if (data.partialText) {
        // this.tempHiddenImgSrc=data.partialText;
        this.item.msds = data.partialText;
      }
    })
  }


  addComposition() {
    var obj = {
      compName: this.compositionName,
      compPercentage: this.compositionPercentage,
      compFunction: this.compostionFunction,
      compCAS: this.compositionCAS
    }
    this.item.composition.push(obj)
    this.compositionName = ''
    this.compositionPercentage = null
    this.compostionFunction = ''
    this.compositionCAS = ''
  }

  editComp(i) {
    this.compEdit = i
  }

  deleteFromComposition(materialId, compositionName) {
    for (let i = 0; i < this.item.composition.length; i++) {
      if (this.item.composition[i].compName == compositionName) {
        this.item.composition.splice(i, 1)
        this.toastSrv.success('Composition Deleted')
      }
    }
  }


  resetResCmptData() {
    this.item = {
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

  editItemDetails() {
    this.item;
    if (confirm("לעדכן פריט?")) {
      this.inventoryService.updateCompt(this.item).subscribe(res => {
        if (res._id) {
          // this.getAllMaterialLocations()
          this.toastSrv.success("פריט עודכן בהצלחה");
        } else {
          this.toastSrv.error("עדכון פריט נכשל");
        }
      });
    }

  }

  //pricing

  test() {
    debugger
  }

  addToPriceHistory() {
    let componentN = this.item.componentN
    let newPrice = this.item.manualPrice
    let coin = this.item.manualCoin
    let user = this.authService.loggedInUser.userName
    this.inventoryService.updatePriceHistory(this.item.componentN, newPrice, coin, user).subscribe(data => {
      this.item.priceUpdates.push({
        price: newPrice,
        coin, user,
        date: new Date(),
        type: 'manual'
      })
    })
    this.toastSrv.info('', 'יש לשמור פריט')
    this.allowPriceUpdate = false
    this.modalService.dismissAll()
  }

  checkUpdatePriceValidity(type) {
    this.allowPriceUpdate = false
    this.allowPriceUpdate = this.item.manualCoin != undefined && this.item.manualPrice != undefined
  }

  getSupplierPriceHistory(i) {
    //TODO: get supplier NUmber!!!
    this.procuretServ.getAllOrdersFromSupplier(this.item.alternativeSuppliers[i].suplierNumber).subscribe(data => {
      this.supPurchases = data.filter(purchase => purchase.status == 'open')
      for (let order of data) {

      }
    })
  }


  getAllMaterialLocations() {
    this.inventoryService.getAllMaterialLocations().subscribe(data => {
      this.materialLocations = data;
    })
  }


  addSupplierToComponent() {
    if (this.supplier.price == '' || this.supplier.price == '' || this.supplier.supplierName == '') {
      this.toastSrv.error('אנא תמלא שם ספק , מחיר ומטבע ')
    } else {
      this.item.alternativeSuppliers.push(this.supplier)
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
  }

  mainSupplier(isMain) {

    if (isMain) {
      return 'lightgreen'
    } else {
      return ''
    }
  }

  edit(index) {
    this.rowNumber = index;
  }

  makeAsMainSupplier(index) {
    let id = this.item._id;
    this.inventoryService.setAsMainSupplier(index, id).subscribe(data => {
      if (data) {
        this.item.alternativeSuppliers = data.alternativeSuppliers;
        this.toastSrv.success('ספק ראשי עודכן בהצלחה!')
      }
    })
  }

  addSupplierToMaterial() {

    if (this.supplier.price == '' || this.supplier.price == '' || this.supplier.supplierName == '') {
      this.toastSrv.error('אנא תמלא שם ספק , מחיר ומטבע ')
    } else {

      this.item.alternativeSuppliers.push(this.supplier)

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
        expectedArrival: "",
      }
    }

  }


  updateComponentVersion() {
    this.editVersionForm.controls.user.setValue(this.authService.loggedInUser.userName)
    this.item.versionNumber = this.editVersionForm.get('versionNumber').value
    this.item.versionHistory.push(this.editVersionForm.value)
    this.editItemDetails()
    this.editVersionForm.reset()
  }

  uploadImg(fileInputEvent) {
    let file = fileInputEvent.target.files[0];
    this.uploadService.uploadFileToS3Storage(file).subscribe(data => {
      if (data.partialText) {
        this.item.img = data.partialText;
        this.editVersionForm.controls.image.setValue(this.item.img)
      }
    })
  }

  deleteSupplier(index) {
    if (confirm('האם למחוק ספק ?')) {
      this.item.alternativeSuppliers.splice(index, 1);
      this.toastSrv.success('ספק הוסר בהצלחה , לא לשכוח לעדכן מידע !')
    }
  }

  getLastOrdersItem(numOfOrders, type) {
    this.fetchingOrders = true;
    this.procuretServ.getLastOrdersForItem(this.item.componentN, numOfOrders).subscribe(orders => {
      this.fetchingOrders = false;
      if (orders && orders.length > 0) {
        orders.map(order => {
          if (order.coin) order.coin = order.coin.toUpperCase()
          if (order.price) order.localPrice = order.price * this.currencies[order.coin]
          return order
        })
        this.lastOrdersOfItem = orders;
      }
      else this.lastOrdersOfItem = [
        { orderNumber: 'Sorry.', supplierName: 'No', status: 'orders', arrivedAmount: 'for this', quantity: 'item.' }
      ]
    })
  }

}
