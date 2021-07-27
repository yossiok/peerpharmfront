import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  @ViewChild('firstComponent') firstComponent: ElementRef
  @Input() biddingToUpdate
  @Output() getAll: EventEmitter<any> = new EventEmitter<any>()

  // itemComponents: any[] = []
  customers: any[] = []
  projectNumber: number
  currentStep: number = 1
  loading: boolean = false;
  chooseExisting: boolean = false;
  newCustomer: boolean = false
  formSubmitted: boolean = false
  currencies: Currencies;
  currentTab: number = 0;

  newPricingForm: FormGroup = new FormGroup({
    productPrice: new FormControl(0, Validators.required),
    productName: new FormControl(''),
    productNumber: new FormControl(null),
    customer: new FormControl(''),
    costumerId: new FormControl(null),
    itemComponents: new FormControl([]),
    date: new FormControl(new Date(), Validators.required),
    formuleNumber: new FormControl(''),
    PPK: new FormControl(null), //Price Per KILO
    ML: new FormControl(null), //desired mililiters
    componentsPrice: new FormControl(0),
    PPML: new FormControl(null), //Price for ml amount
    processingFee: new FormControl(null),
    oneTimeExp: new FormControl(null),
    deliveryConds: new FormControl(''),
    deliveryFee: new FormControl(null),
    diffExp: new FormControl(null),
    remarks: new FormControl(''),
    otherExp: new FormControl(null),
  })


  // item: any;

  newComponent: any = {
    price: 0,
    manualPrice: 0,
    coin: 'ILS',
    manualCoin: 'ILS',
    shippingPrice: 0,
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
    if (this.biddingToUpdate) this.newPricingForm.patchValue(this.biddingToUpdate)
  }

  ngOnChanges() {
    // console.log('on changes')
    this.calculateFinalPrice()
  }

  ngDoCheck() {
    // console.log('do check')
    this.calculateFinalPrice()
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

  upgradeTab() {
    this.currentTab++
  }

  downGradeTab() {
    this.currentTab--
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
    this.loading = true
    setTimeout(() => {
      if (this.loading) {
        this.loading = false
        this.toastr.error('Something went wrong')
      }
    }, 10000)
    this.formuleService.getFormulePriceByNumber(this.newPricingForm.value.formuleNumber).subscribe(response => {
      this.loading = false
      if (response.msg) this.toastr.error(response.msg)
      else this.newPricingForm.controls.PPK.setValue(response.formulePrice)
    })
  }

  calculateForML() {
    this.newPricingForm.controls.PPML.setValue(this.newPricingForm.value.PPK * (this.newPricingForm.value.ML / 1000))
  }

  addComponent() {
    let c = { ...this.newComponent }
    this.newPricingForm.value.itemComponents.push(c)
    this.newPricingForm.controls.componentsPrice.setValue(this.newPricingForm.value.componentsPrice + c.price + c.shippingPrice)
    this.newComponent = {
      price: 0,
      shippingPrice: 0,
      coin: '',
      manualCoin: '',
      componentNumber: '',
      componentName: '',
    }
    this.firstComponent.nativeElement.focus()
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
      if (data.length > 0) {
        this.newComponent = {
          componentN: data[0].componentN,
          componentName: data[0].componentName,
          price: data[0].price,
          coin: data[0].coin,
          manualPrice: data[0].manualPrice,
          manualCoin: data[0].manualCoin,
          shippingPrice: data[0].shippingPrice,
        }

        if (this.newComponent.manualPrice) {
          this.newComponent.price = this.newComponent.manualPrice * this.currencies[this.newComponent.manualCoin]
        }
        else if (this.newComponent.price) {
          this.newComponent.price = this.newComponent.price * this.currencies[this.newComponent.coin]
        }
        else {
          let suppliers = this.newComponent.alternativeSuppliers;
          if (!suppliers) this.newComponent.price = 'Update Price'
          for (let i = 0; i < suppliers.length; i++) {
            if (suppliers[i].price != '' && suppliers[i].price != null && suppliers[i].price != undefined) {
              suppliers[i].coin = suppliers[i].coin == 'nis' ? 'ILS' : suppliers[i].coin.toUpperCase()
              if (!suppliers[i].coin) suppliers[i].coin = 'ILS'
              this.newComponent.price = suppliers[i].price * this.currencies[suppliers[i].coin]
              i = suppliers.length
            } else {
              this.newComponent.price = 'Update Price'
            }
          }
        }
        this.newComponent.shippingPrice = this.newComponent.shippingPrice ? this.newComponent.shippingPrice : 0
        this.newComponent.finalPrice = this.newComponent.price + this.newComponent.shippingPrice

      }

      else this.toastr.info('Enter details myself.', 'No Component Details')


      // this.totalItemPrice = this.totalItemPrice + Number(this.newComponent.price)

      // if (typeof (Number(this.newComponent.shippingPrice)) == typeof (0)) {
      //   if (!isNaN(Number(this.newComponent.shippingPrice))) {
      //     this.totalShippingPrice = this.totalShippingPrice + Number(this.newComponent.shippingPrice)
      //   }
      // }
      // this.itemComponents.push(this.newComponent)
    })
  }

  calculateFinalPrice() {
    let finalPrice = 0
    let otherExp = 0
    this.newPricingForm.controls.componentsPrice.setValue(0)

    for (let component of this.newPricingForm.value.itemComponents) {
      component.finalPrice = component.price + component.shippingPrice
      this.newPricingForm.controls.componentsPrice.setValue(this.newPricingForm.value.componentsPrice + component.finalPrice)
    }

    finalPrice = this.newPricingForm.value.componentsPrice +
      this.newPricingForm.value.PPML + this.newPricingForm.value.processingFee
    otherExp = this.newPricingForm.value.oneTimeExp + this.newPricingForm.value.deliveryFee + 
      this.newPricingForm.value.diffExp

    this.newPricingForm.controls.productPrice.setValue(finalPrice)
    this.newPricingForm.controls.otherExp.setValue(otherExp)
  }

  savePricing() {
    this.loading = true
    let costumer = this.customers.find(c => c.costumerName == this.newPricingForm.value.customer)
    if(costumer) this.newPricingForm.controls.customerId.setValue(costumer.costumerId)
    if (this.biddingToUpdate) {
      // update
      let updatedBidding = {...this.newPricingForm.value, number: this.biddingToUpdate.number}
      this.pricingService.updatePricing(updatedBidding).subscribe(res => {
        this.loading = false;
        if (res.msg == 1) {
          this.toastr.success('Bidding Updated.')
          this.getAll.emit()
        } 
        else this.toastr.error('Something gone bad.')
      })
    }
    else {
      // save
      this.pricingService.addPricing(this.newPricingForm.value).subscribe(res => {
        this.loading = false;
        if (res.msg == 1) this.toastr.success('New Bidding Saved.')
        else this.toastr.error('Something gone bad.')
      })
    }
  }

}
