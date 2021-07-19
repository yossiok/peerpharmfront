import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CostumersService } from 'src/app/services/costumers.service';
import { FormulesService } from 'src/app/services/formules.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';
import { PricingService } from 'src/app/services/pricing.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { Currencies } from '../../procurement/Currencies';

@Component({
  selector: 'app-new-pricing',
  templateUrl: './new-pricing.component.html',
  styleUrls: ['./new-pricing.component.scss']
})
export class NewPricingComponent implements OnInit {

  itemComponents: any[] = []
  customers: any[] = []
  projectNumber: number
  totalItemPrice: number = 0;
  totalShippingPrice: number = 0;
  currentStep: number = 1
  showPricingDetails: boolean = false;
  loading: boolean = false;
  chooseExisting: boolean = false;
  newCustomer: boolean = false
  manualComponent: boolean = false
  currencies: Currencies;

  newPricingForm: FormGroup = new FormGroup({
    productPrice: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    productNumber: new FormControl('', Validators.required),
    customer: new FormControl(''),
    itemComponents: new FormControl([]),
    date: new FormControl(new Date(), Validators.required),
    formuleNumber: new FormControl(null),
    PPK: new FormControl(null), //Price Per KILO
    ML: new FormControl(null), //desired mililiters
    PPML: new FormControl(null), //Price for ml amount
  })

  lop = 'dsds'

  item: any;

  newComponent: any = {
    price: '',
    shippingPrice: '',
    componentNumber: '',
    componentName: '',
  }

  constructor(
    private invtSer: InventoryService,
    private pricingService: PricingService,
    private costumerService: CostumersService,
    private itemService: ItemsService,
    private procServ: Procurementservice,
    private formuleService: FormulesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getCustomers()
    this.getLastBiddingNumber()
    this.getCurrencies()
  }

  getCustomers() {
    this.costumerService.getAllCostumers().subscribe(customers => {
      this.customers = customers
    })
  }

  getLastBiddingNumber() {
    this.pricingService.getLastPricing().subscribe(data => {
      this.projectNumber = data[0].number + 1
    })
  }

  getCurrencies() {
    this.procServ.getCurrencies().subscribe(currencies => {
      this.currencies = currencies[0]
    })
  }

  // getItemData(itemNumber) {
  //   if (itemNumber == 0 || itemNumber.value == '' || !itemNumber) this.toastr.error('Enter a valid product number')
  //   else {
  //     this.itemService.getItemData(itemNumber.value).subscribe(data => {
  //       if (data.length == 0) {
  //         this.toastr.error('Item Not Found.')
  //       }
  //       else {
  //         this.item = data[0]
  //       }
  //     })
  //   }
  // }


  calculatePPK() {
    this.formuleService.getFormulePriceByNumber(this.newPricingForm.value.formuleNumber).subscribe(response => {
      if (response.msg) this.toastr.error(response.msg)
      else this.newPricingForm.controls.PPK.setValue(response.formulePrice)
    })
  }

  calculateForML() {
    this.newPricingForm.controls.PPML.setValue(this.newPricingForm.value.PPK * (this.newPricingForm.value.ML / 1000))
  }

  addComponent() {
    this.itemComponents.push(this.newComponent)
    this.totalItemPrice += this.newComponent.price
    this.newComponent.shippingPrice != 'No Shipping.' ? this.totalShippingPrice += this.newComponent.shippingPrice : null
  }

  // formuleCalculate(data, formuleWeight) {
  //   data.phases.forEach(phase => {
  //     phase.items.forEach(item => {
  //       item.kgProd = Number(formuleWeight) * (Number(item.percentage) / 100)
  //     });
  //   });
  //   return data
  // }


  getCmptDetails(event) {

    let itemNumber = event.target.value
    this.invtSer.getCmptByitemNumber(itemNumber).subscribe(data => {
      if (data) {
        this.newComponent = { ...data[0] }
        
        if (this.newComponent.price) {
          this.newComponent.price = this.newComponent.price * this.currencies[this.newComponent.coin]
        } 
        else if (this.newComponent.manualPrice) {
          this.newComponent.price = this.newComponent.manualPrice * this.currencies[this.newComponent.manualCoin]
        }
        else {
          let suppliers = this.newComponent.alternativeSuppliers;
          if (!suppliers) this.newComponent.price = 'Update Price'
          for (let i = 0; i < suppliers.length; i++) {
            if (suppliers[i].price != '' && suppliers[i].price != null && suppliers[i].price != undefined) {
              suppliers[i].coin = suppliers[i].coin == 'nis' ? 'ILS' : suppliers[i].coin.toUpperCase()
              if(!suppliers[i].coin) suppliers[i].coin = 'ILS'
              this.newComponent.price = suppliers[i].price * this.currencies[suppliers[i].coin]
              i = suppliers.length
            } else {
              this.newComponent.price = 'Update Price'
            }
          }
        }
        this.newComponent.shippingPrice = this.newComponent.shippingPrice ? this.newComponent.shippingPrice : 'No Shipping.'
      }

      else this.toastr.info('Enter details myself.','No Component Details')


      // this.totalItemPrice = this.totalItemPrice + Number(this.newComponent.price)

      // if (typeof (Number(this.newComponent.shippingPrice)) == typeof (0)) {
      //   if (!isNaN(Number(this.newComponent.shippingPrice))) {
      //     this.totalShippingPrice = this.totalShippingPrice + Number(this.newComponent.shippingPrice)
      //   }
      // }
      // this.itemComponents.push(this.newComponent)
    })
  }

  savePricing() {
    this.loading = true
    this.newPricingForm.controls.itemComponents.setValue(this.itemComponents)
    this.newPricingForm.controls.productPrice.setValue(this.totalItemPrice + this.totalShippingPrice)
    this.pricingService.addPricing(this.newPricingForm.value).subscribe(res => {
      this.loading = false;
      this.showPricingDetails = false
      if (res.msg == 1) this.toastr.success('New Bidding Saved.')
      else this.toastr.error('Something gone bad.')
    })
  }

}
