import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ProductionOrders } from './../models/production-orders';
import { ProductionSchedule } from './../models/production-schedule';
import { ItemsService } from './../../../services/items.service';
import { ProductionService } from './../../../services/production.service';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-production-request',
  templateUrl: './production-request.component.html',
  styleUrls: ['./production-request.component.css']
})
export class ProductionRequestComponent implements OnInit {
  userName: String;
  departments: Array<any>;
  formules: Array<any>;
  categories: Array<any>;
  orders: Array<any>;
  items: Array<any>;
  
  constructor(
    private fb: FormBuilder,
    private productionService: ProductionService,
    private itemsService: ItemsService,
    private ordersService: OrdersService,
    private authService: AuthService,
  ) {}

  public requestForm: FormGroup;
  productionScheduleObject = new ProductionSchedule();
  errorItemNumber = false;

  @ViewChildren('childOrders')
  childOrders: QueryList<any>;

    async ngOnInit() {
    await this.authorizedUser().then(user=>{ 
      this.userName=user+"";
    });

    console.log(this.userName)
    // this.requestForm= this.fb.group({
    //   date: [new Date(), Validators.required],
    //   user: ["", Validators.required],
    //   reqNumber: [Number, Validators.required],
    //   formuleNumber: ["", Validators.required],
    //   formuleName: ["", Validators.required],
    //   relatedItems: [Array, Validators.required],
    //   relatedOrders: [Array, Validators.required],
    //   quantity: [Number, Validators.required],
    // });
    this.requestForm = new FormGroup({
      prodRequestNumber: new FormControl('', [Validators.required]),
      itemNumber: new FormControl('', [Validators.required]),
      makatNumber: new FormControl('', [Validators.required]),
      itemBarkod: new FormControl('', [Validators.required]),
      itemTotalQuantity: new FormControl(null, [Validators.required])
    });
  }

  async authorizedUser(){ 
  var authService=this.authService;
  return new Promise(async function (resolve, reject) {
    authService.userEventEmitter.subscribe(user => {
      user.firstName+" "+user.lastName;
      resolve (user.firstName+" "+user.lastName);
    });
  });
  
}

  ValidateItemNumber() {
    //debugger;
    this.itemsService
      .getItemData(this.requestForm.value.itemNumber)
      .subscribe((itemData) => {
        console.log(itemData);
        if (!itemData.length) {
          this.errorItemNumber = true;
        } else {
          this.errorItemNumber = false;
          console.log(itemData[0].barcodeK);
          this.requestForm.controls['itemBarkod'].setValue(itemData[0].barcodeK);
        }
      });
  }

  RealtedOrders() {
    const newProdOrder = new ProductionOrders();
    this.productionScheduleObject.orders.push(newProdOrder);
  }

  // UpdateTotalQuantity(lastOrderQuantity) {
  //   debugger;
  //   // console.log( lastOrderQuantity  + ' from your father');
  //    const sumQuantityOrder =  this.requestForm.value.itemTotalQuantity + lastOrderQuantity;
  //   this.requestForm.controls['itemTotalQuantity'].setValue(sumQuantityOrder);
  // }

  onSubmit(): void {
    this.productionScheduleObject.prodRequestNumber = this.requestForm.value.prodRequestNumber;
    this.productionScheduleObject.itemNumber = this.requestForm.value.itemNumber;
    this.productionScheduleObject.makatNumber = this.requestForm.value.makatNumber;
    this.productionScheduleObject.itemBarkod = this.requestForm.value.itemBarkod;
    this.productionScheduleObject.itemTotalQuantity = this.requestForm.value.itemTotalQuantity;

    this.childOrders.forEach((childOrder, index) => {
      this.productionScheduleObject.orders[index].orderNumber =
        childOrder.prodOrdersForm.value.orderNumber;
      this.productionScheduleObject.orders[index].orderDeliveryDate =
        childOrder.prodOrdersForm.value.orderDeliveryDate;
      this.productionScheduleObject.orders[index].orderCustomer =
        childOrder.prodOrdersForm.value.orderCustomer;
    });

    this.productionService
      .addProductionSchedule(this.productionScheduleObject)
      .subscribe(data => console.log('added ' + data));
  }
}
