
import { Component, OnInit, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ProductionOrders } from './../models/production-orders';
import { ProductionSchedule } from './../models/production-schedule';
import { ItemsService } from './../../../services/items.service';
import { ProductionService } from './../../../services/production.service';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';
import { FormulesService } from 'src/app/services/formules.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-production-request',
  templateUrl: './production-request.component.html',
  styleUrls: ['./production-request.component.scss']
})
export class ProductionRequestComponent implements OnInit {
  requestForm: FormGroup;
  
  today:String;
  due:String;
  userName: String;
  departments: Array<any>;
  formules: Array<any>;
  categories: Array<any>;
  orders: Array<any>;
  items: Array<any>;
  nameList: Array<any>;
  allFormules: Array<any>=[];
  nameInput:String;
  relatedItems:Array<any>=[];


  
  constructor(
    private toastSrv: ToastrService,
    private formuleService: FormulesService,
    private fb: FormBuilder,
    private productionService: ProductionService,
    private itemsService: ItemsService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private orderService: OrdersService,
  ) {
    this.requestForm= this.fb.group({
      date: [new Date(), Validators.required],
      dueDate: [new Date(), Validators.required],
      user: ["", Validators.required],
      reqNumber: [Number, Validators.required],
      formuleId: ["", Validators.required],
      formuleNumber: ["", Validators.required],
      formuleName: ["", Validators.required],
      relatedItems: [Array],
      quantity: [Number, Validators.required],
      lastUpdated: [Date, Validators.required],
      lastUpdatedUser: ["", Validators.required],
      status: ["new", Validators.required]

    });
    
  }

  productionScheduleObject = new ProductionSchedule();
  errorItemNumber = false;

  @ViewChild('nameL') nameL: ElementRef;  
  @ViewChild('todayD') todayD: ElementRef;
  @ViewChild('dueDate') dueDate: ElementRef;
  @ViewChild('itemNum') itemNum: ElementRef;
  @ViewChild('orderNum') orderNum: ElementRef;


  async ngOnInit() {
    this.nameL.nativeElement.value="";
    
    this.today = new Date().toISOString().slice(0,10);
    this.todayD.nativeElement.value = this.today;
    this.dueDate.nativeElement.value = this.today;

    await this.authService.userEventEmitter.subscribe(user => {
      this.userName=user.firstName+" "+user.lastName;
      this.requestForm.controls.user.setValue(this.userName)
      this.requestForm.controls.lastUpdatedUser.setValue(this.userName)
    });
    this.getAllFormules();

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

  // ValidateItemNumber() {
  //   //;
  //   this.itemsService
  //     .getItemData(this.requestForm.value.itemNumber)
  //     .subscribe((itemData) => {
  //       console.log(itemData);
  //       if (!itemData.length) {
  //         this.errorItemNumber = true;
  //       } else {
  //         this.errorItemNumber = false;
  //         console.log(itemData[0].barcodeK);
  //         this.requestForm.controls['itemBarkod'].setValue(itemData[0].barcodeK);
  //       }
  //     });
  // }

  RealtedOrders() {
    const newProdOrder = new ProductionOrders();
    this.productionScheduleObject.orders.push(newProdOrder);
  }

  chooseName(n){
    this.nameL
    this.requestForm.value.formuleName= n+"";
  }

  filterNameList(input){
    this.requestForm.controls.formuleName.setValue(input);
    this.nameL.nativeElement.value;
    if(input !=""){
      let inputVal= input.toLowerCase();
      this.nameList= this.allFormules.filter(n => {
          if(n.name.toLowerCase().includes(inputVal)) {
            
            return n;
          } 
        });
      }    
  }

  getAllFormules() { 

    this.formuleService.getAllFormules().subscribe( data => {
    this.allFormules = data; 
    })

  }
  getUserName(){
    
    this.userName = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
    this.requestForm.controls.user.setValue(this.userName)
    this.requestForm.controls.lastUpdatedUser.setValue(this.userName)

  }

  addRelatedItem(item ,order) { 
    debugger
    // if(this.itemNum.nativeElement.value && this.orderNum.nativeElement.value != "") {
    if(item != "" && order != "") {
      // check if exist in order item:
      this.orderService.getOrderItemByNumberAndOrder(item, order).subscribe(doc=>{
        if(doc._id){
          // this.requestForm.value.relatedItems.push({itemNumber: item ,orderNumber: order });
          this.relatedItems.push({itemNumber: item ,orderNumber: order });
          this.itemNum.nativeElement.value = "";
          this.orderNum.nativeElement.value = "";
        }else{
          this.toastSrv.error("order item don't exist")
        }
      });
    }
    else { 
      this.toastSrv.error("Please fill item and order number");
      alert("Please fill both fields.")
    }
  }

  // UpdateTotalQuantity(lastOrderQuantity) {
  //   ;
  //   // console.log( lastOrderQuantity  + ' from your father');
  //    const sumQuantityOrder =  this.requestForm.value.itemTotalQuantity + lastOrderQuantity;
  //   this.requestForm.controls['itemTotalQuantity'].setValue(sumQuantityOrder);
  // }


  onSubmit(): void {
    debugger
    this.requestForm.controls.formuleName.setValue(this.nameL.nativeElement.value);
    if(this.relatedItems.length>0){
      this.requestForm.controls.relatedItems.setValue(this.relatedItems) ;
    }else{
      this.requestForm.controls.relatedItems.setValue([]) ;
    }
   if (this.requestForm.valid){
    this.productionService.addProdRequest(this.requestForm.value).subscribe(data=>{
      console.log(data)
      if(data._id){
        this.requestForm.reset();
        this.dueDate.nativeElement.value=''; 
        this.toastSrv.success("Request sent to production");

      }else{
        this.toastSrv.error("Can't save request");
      }
     
    });
   }else{
    this.toastSrv.error("Please fill out all the fields in the form.");
   }
    
  }
  removeItem(itemObj , index){
    let keyToRemove;
    this.relatedItems.forEach((item , key)=>{
      if(item.itemNumber == itemObj.itemNumber && 
        item.orderNumber == itemObj.orderNumber &&
        index== key){
          keyToRemove=key;
      }
      if(key+1 == this.relatedItems.length){
        this.relatedItems.splice(keyToRemove , 1)
      }
    })
  }

  findFormule(ev){
    let num= ev.target.value;
    this.formuleService.getFormuleByNumber(num).subscribe(formule=>{
      if(formule._id){
        this.requestForm.controls.formuleName.setValue(formule.name) ;
        this.requestForm.controls.formuleId.setValue(formule._id) ;
      } else{
        this.toastSrv.error("Can't find formule number")
      }
    })
  }

}
