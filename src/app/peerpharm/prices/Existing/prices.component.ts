import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CostumersService } from 'src/app/services/costumers.service';
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
  customersForItem: any[];
  selectedComponent: any;
  totalItemPrice: number = 0;
  totalShippingPrice: number = 0;
  calculating: boolean = false;
  showOrders: boolean;
  showSuppliers: boolean;
  showCustomers: boolean;

  constructor(
    private itemService: ItemsService,
    private toastr: ToastrService,
    private invtSer: InventoryService,
    private procuremetnService: Procurementservice,
    private costumerService: CostumersService
  ) { }

  ngOnInit(): void {
    this.productNumber.nativeElement.focus()
  }

  changeView(component, view) {
    this.selectedComponent = component
    switch (view) {
      case 'orders':
        this. showOrders = true
        this. showSuppliers = false
        this. showCustomers = false
        break
      case 'customers':
        this. showOrders = false
        this. showSuppliers = false
        this. showCustomers = true
        break
      case 'suppliers':
        this. showOrders = false
        this. showSuppliers = true
        this. showCustomers = false
        break
    }
  }

  async getItemData(itemNumber) {
    this.calculating = true;
    this.itemService.getItemData(itemNumber.value).subscribe(data => {
      if(data.length == 0) this.toastr.error('Item Not Found.')
      else this.item = data[0]
      this.calculateProductPricing()
      setTimeout(()=> {
        this.getSuppliersForComponents()
        this.getCustomersForItem(this.item.itemNumber)
        this.calculating = false;
      }, 2000)
    })
  }

  
  calculateProductPricing() {
    this.itemComponents = []
    this.totalItemPrice = 0
    if (this.item.bottleNumber != '' && this.item.bottleNumber != '---') {
      this.invtSer.getCmptByitemNumber(this.item.bottleNumber).subscribe(data => {
        if (data) {
          this.itemComponents.push(this.createPriceObj(data))
        }
      })
    }
    if (this.item.capNumber != '' && this.item.capNumber != '---') {
      this.invtSer.getCmptByitemNumber(this.item.capNumber).subscribe(data => {
        this.itemComponents.push(this.createPriceObj(data))
      })
    }
    if (this.item.boxNumber != '' && this.item.boxNumber != '---') {
      this.invtSer.getCmptByitemNumber(this.item.boxNumber).subscribe(data => {
        this.itemComponents.push(this.createPriceObj(data))
      })
    }
    if (this.item.pumpNumber != '' && this.item.pumpNumber != '---') {
      this.invtSer.getCmptByitemNumber(this.item.pumpNumber).subscribe(data => {
        this.itemComponents.push(this.createPriceObj(data))
      })
    }
    if (this.item.sealNumber != '' && this.item.sealNumber != '---') {
      this.invtSer.getCmptByitemNumber(this.item.sealNumber).subscribe(data => {
        this.itemComponents.push(this.createPriceObj(data))
      })
    }
    if (this.item.stickerNumber != '' && this.item.stickerNumber != '---') {
      this.invtSer.getCmptByitemNumber(this.item.stickerNumber).subscribe(data => {
        this.itemComponents.push(this.createPriceObj(data))
      })
    }
    if (this.item.cartonNumber != '' && this.item.cartonNumber != '---') {
      this.invtSer.getCmptByitemNumber(this.item.cartonNumber).subscribe(data => {
        this.itemComponents.push(this.createPriceObj(data))
      })
    }
  }

  getSuppliersForComponents() {
    // this.itemComponents = []
    this.itemComponents.map(component => {
      this.procuremetnService.getLastOrdersForItem(component.componentNumber, 20).subscribe(data=>{
        component.lastOrders = data
        return component
      })
    })
    
  }

  getCustomersForItem(itemNumber){
    debugger
    this.costumerService.getAllCustomersOfItem(itemNumber).subscribe(data => {
      debugger
      this.customersForItem = data
    })
  }
  
  createPriceObj(data) {

    let componentPricing = {
      price: '',
      shippingPrice: '',
      componentNumber: data[0].componentN,
      componentName: data[0].componentName,
    }


    if(data[0].price) componentPricing.price = data[0].price
    else {
      let suppliers = data[0].alternativeSuppliers;
      if(!suppliers) componentPricing.price = 'Update Price'
      for (let i = 0; i < suppliers.length; i++) {
        if (suppliers[i].price != '' && suppliers[i].price != null && suppliers[i].price != undefined) {
          componentPricing.price = suppliers[0].price
          i = suppliers.length
        } else {
          componentPricing.price = 'Update Price'
        }
      }
    }

    componentPricing.shippingPrice = data[0].shippingPrice ? data[0].shippingPrice : 'No shipping Price'

    this.totalItemPrice = this.totalItemPrice + Number(componentPricing.price)

    if (typeof (Number(componentPricing.shippingPrice)) == typeof (0)) {
      if (!isNaN(Number(componentPricing.shippingPrice))) {
        this.totalShippingPrice = this.totalShippingPrice + Number(componentPricing.shippingPrice)
      }
    }

    return componentPricing
  }


}
