import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CostumersService } from 'src/app/services/costumers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { PricingService } from 'src/app/services/pricing.service';

@Component({
  selector: 'app-new-pricing',
  templateUrl: './new-pricing.component.html',
  styleUrls: ['./new-pricing.component.scss']
})
export class NewPricingComponent implements OnInit {

  itemComponents: any[] = []
  totalItemPrice: number = 0;
  totalShippingPrice: number = 0;
  customers: any[] = []
  showPricingDetails: boolean = false;
  loading: boolean = false;

  newPricingForm: FormGroup = new FormGroup({
    productPrice: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    productNumber: new FormControl('', Validators.required),
    customer: new FormControl(''),
    itemComponents: new FormControl([]),
  })

  constructor(
    private invtSer: InventoryService,
    private pricingService: PricingService,
    private costumerService: CostumersService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCustomers()
  }

  getCustomers() {
    this.costumerService.getAllCostumers().subscribe(customers => {
      this.customers = customers
    })
  }

  addComponent() {
    this.itemComponents.push({
      price: '',
      shippingPrice: '',
      componentNumber: '',
      componentName: '',
    })
  }

  calculateProductPricing(event) {
    let itemNumber = event.target.value
    this.invtSer.getCmptByitemNumber(itemNumber).subscribe(data => {
      if (data) {
        event.target.value = ''
        event.target.focus()
        this.itemComponents.push(this.createPriceObj(data))
      }
    })

  }

  createPriceObj(data) {

    let componentPricing = {
      price: '',
      shippingPrice: '',
      componentNumber: data[0].componentN,
      componentName: data[0].componentName,
    }

    if (data[0].price) componentPricing.price = data[0].price
    else {
      let suppliers = data[0].alternativeSuppliers;
      if (!suppliers) componentPricing.price = 'Update Price'
      for (let i = 0; i < suppliers.length; i++) {
        if (suppliers[i].price != '' && suppliers[i].price != null && suppliers[i].price != undefined) {
          componentPricing.price = suppliers[i].price
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

  savePricing() {
    this.loading = true
    this.newPricingForm.controls.itemComponents.setValue(this.itemComponents)
    this.newPricingForm.controls.productPrice.setValue(this.totalItemPrice + this.totalShippingPrice)
    this.pricingService.addPricing(this.newPricingForm.value).subscribe(res => {
      this.loading = false;
      this.showPricingDetails = false
      if(res.msg == 1) this.toastr.success('New Bidding Saved.')
      else this.toastr.error('Something gone bad.')
    })
  }

}
