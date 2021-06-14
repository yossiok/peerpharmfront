import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { FormulesService } from 'src/app/services/formules.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';
import { Procurementservice } from 'src/app/services/procurement.service';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  @ViewChild('productNumber') productNumber: ElementRef

  item: any;
  itemComponents: any[];
  customersForItem: any[] = []
  selectedComponent: any;
  totalItemPrice: number = 0;
  totalShippingPrice: number = 0;
  calculating: boolean = false;
  loadingCustomers: boolean = false;
  showOrders: boolean;
  showSuppliers: boolean;
  showCustomers: boolean;
  selectedStatus: string = 'open'
  allItemNames: any[];
  currentNames: any[] = [];
  allowed: boolean = false;

  constructor(
    private itemService: ItemsService,
    private toastr: ToastrService,
    private invtSer: InventoryService,
    private procuremetnService: Procurementservice,
    private costumerService: CostumersService,
    private authService: AuthService,
    private formuleService: FormulesService
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.productNumber.nativeElement.focus(), 1000)
    // this.getAllItemNames()
    this.allowed = this.authService.loggedInUser.authorization.includes("formulePrice")
    // let interval = setInterval(() => {
    //   if (this.item && this.item.formulePrice && !isNaN(this.item.formulePrice)) {
    //     this.totalItemPrice += this.item.formulePrice
    //     clearInterval(interval)
    //   }
    // }, 3000)
  }

  findByName(e) {
    console.log(e)
    this.currentNames = []
    if (e.length > 3) {
      this.currentNames = this.allItemNames.filter(nameObj => nameObj.name.toLowerCase().includes(e.toLowerCase()))
    }
  }

  changeView(component, view) {
    this.selectedComponent = component
    switch (view) {
      case 'orders':
        this.showOrders = true
        this.showSuppliers = false
        this.showCustomers = false
        break
      case 'customers':
        this.showOrders = false
        this.showSuppliers = false
        this.showCustomers = true
        break
      case 'suppliers':
        this.showOrders = false
        this.showSuppliers = true
        this.showCustomers = false
        break
    }
  }

  getAllItemNames() {
    this.itemService.getAllItemNames().subscribe(data => {
      this.allItemNames = data
    })
  }

  getItemData(itemNumber) {
    this.calculating = true;
    this.itemService.getItemData(itemNumber.value).subscribe(data => {
      if (data.length == 0) {
        this.toastr.error('Item Not Found.')
        this.calculating = false;
      }
      else {
        this.item = data[0]
        this.formuleService.getFormulePriceByNumber(this.item.itemNumber).subscribe(response => {
          if (response.msg) this.toastr.error(response.msg)
          this.item.formulePrice = response.formulePrice ? response.formulePrice : null
          this.calculateProductPricing()
          setTimeout(() => {
            this.getSuppliersForComponents()
            this.loadingCustomers = true
            this.getCustomersForItem(this.item.itemNumber)
            
          }, 2000)
          setTimeout(()=>this.calculating = false, 10000)
        })

      }
    })
  }


  calculateProductPricing() {
      this.itemComponents = []
      this.totalItemPrice = 0
      this.itemService.getComponentsForItem(this.item.itemNumber).subscribe(allComponents => {
        for(let component of allComponents) {
          this.itemComponents.push(this.createComponentPrice(component))
        }
        if (this.item.formulePrice) this.totalItemPrice += this.item.formulePrice
      })

      this.productNumber.nativeElement.focus()
  }

  createComponentPrice(component) {

        let componentPricing = {
          price: '',
          shippingPrice: '',
          componentNumber: component.componentN,
          componentName: component.componentName,
          imgUrl: ''
        }

        if (component.price) componentPricing.price = component.price
        else {
          let suppliers = component.alternativeSuppliers;
          if (!suppliers || suppliers.length == 0) componentPricing.price = 'Update Price'
          for (let i = 0; i < suppliers.length; i++) {
            if (suppliers[i].price != '' && suppliers[i].price != null && suppliers[i].price != undefined) {
              componentPricing.price = suppliers[0].price
              i = suppliers.length
            } else {
              componentPricing.price = 'Update Price'
            }
          }
        }

        componentPricing.shippingPrice = component.shippingPrice ? component.shippingPrice : 'No shipping Price'

        if (typeof (componentPricing.price) == typeof (0)) this.totalItemPrice = this.totalItemPrice + Number(componentPricing.price)

        if (typeof (Number(componentPricing.shippingPrice)) == typeof (0)) {
          if (!isNaN(Number(componentPricing.shippingPrice))) {
            this.totalShippingPrice = this.totalShippingPrice + Number(componentPricing.shippingPrice)
          }
        }

        componentPricing.imgUrl = component.img

        return componentPricing
  }

  getSuppliersForComponents() {
    this.itemComponents.map(component => {
      this.procuremetnService.getLastOrdersForItem(component.componentNumber, 20).subscribe(data => {
        component.lastOrders = data
        return component
      })
    })

  }

  getCustomersForItem(itemNumber) {
    this.costumerService.getAllCustomersOfItem(itemNumber).subscribe(data => {
      data.forEach(customer => {
        if (customer) this.customersForItem.push(customer)
      })
      this.loadingCustomers = false
    })
  }




}
