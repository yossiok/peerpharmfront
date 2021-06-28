import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
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

  itemMovements: any[];

  item: any;

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

  cmptCategoryList: Array<any> = [
    'Sacara', 'Mineralium', 'Arganicare', 'Spa Pharma', 'Olive', 'Vitamin C', 'Quinoa', 'Andrea Milano', 'Dermalosophy',
    'Kreogen', 'Careline', 'Frulatte', 'Mediskin', '4Ever', 'Adah Lazorgan', 'Avalanche', 'Abyssian', 'Jahshan',
    'Mika', 'Hyalunol', 'Hemp', 'Kiss', 'Rose', 'Collagen', 'Gaya',
  ]

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

  allSuppliers: any;
  gettingProducts: boolean;
  fetchingOrders: boolean;
  lastOrdersOfItem: any []
  currencies: Currencies;
  allowUserEditItem: boolean;
  rowNumber: number = -1

  constructor(
    private inventoryService: InventoryService,
    private toastSrv: ToastrService,
    private supplierService: SuppliersService,
    private procuretServ: Procurementservice,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getAllSuppliers()
    this.getItemData()
    if (this.authService.loggedInUser.authorization.includes("updateStock")) {
      this.allowUserEditItem = true;
    }
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
    this.inventoryService.getComplexItemMovements(this.itemMovementForm.value).subscribe(data => {
      console.log(data)
      this.itemMovements = data
    })
  }

  getItemData(){
    this.inventoryService.getItemByNumber(this.itemDetailsForm.value.itemNumber).subscribe(item => {
      if(item.msg) this.toastSrv.error(item.msg)
      else this.item = item
    })
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
        // this.newItem = '';

      });

    } else {
      this.toastSrv.error("Can't create new stock item without number")
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

  editStockItemDetails() {

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

  addSupplierToComponent() {

    if(this.supplier.price == '' || this.supplier.price == '' || this.supplier.supplierName == ''){
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

  mainSupplier(isMain){
    debugger
    if(isMain){
      return 'lightgreen'
    } else {
      return ''
    }
  }

  edit(index) {
    this.rowNumber = index;
  }

  makeAsMainSupplier(index){
    debugger;
    let id = this.item._id;
    this.inventoryService.setAsMainSupplier(index,id).subscribe(data => {
      if(data){
        this.item.alternativeSuppliers = data.alternativeSuppliers;
        this.toastSrv.success('ספק ראשי עודכן בהצלחה!')
      }
    })
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
        { orderNumber: 'Sorry.', price: 'There', coin: 'are no', supplierName: 'orders', quantity: 'for this', date: 'item.' }
      ]
    })
  }

}
