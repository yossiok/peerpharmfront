import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrdersService } from "../../../services/orders.service";
import { CostumersService } from "../../../services/costumers.service";
import { Costumer } from "../../classes/costumer.class";
import { Observable } from "rxjs";
import { String } from "aws-sdk/clients/lexmodelbuildingservice";
import { map, startWith } from "rxjs/operators";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-neworder",
  templateUrl: "./neworder.component.html",
  styleUrls: ["./neworder.component.css"]
})
export class NeworderComponent implements OnInit {
  orderItemForm: FormGroup;
  orderForm: FormGroup;
  orderNumber: string;
  orderId: string;
  closeResult: string;
  choosedCostumer: any;
  itemName: String;
  netWeightK: Number = 0;
  lastOrderNumber: Number;
  user:any;
  shippingMethod:any[] = [];
  shippingDetails:any = {
    shippingQuantity: "",
    shippingWay:"",
  }
  items: any[] = [];
  costumers: any[] = [];
  costumersCopy: any[] = [];
  filterCostumers: Observable<any[]>;
  submited: boolean = false;
  openModal: boolean = false;
  titleAlert: string = "This field is required";

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private orderSer: OrdersService,
    private costumerService: CostumersService,
    private toastSrv: ToastrService,
    private authService:AuthService,
  ) {
    this.orderForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      delivery: [null, Validators.required],
      costumer: [null, Validators.required],
      costumerInternalId: [""],
      orderdate: [null, Validators.required],
      remarks: [null],
      type: [null],
      user:[null,Validators.required]

    });

    this.orderItemForm = fb.group({
      itemN: [null, Validators.required],
      discription: [null, Validators.required],
      netWeightK: [null, Validators.required],
      quantity: [null, Validators.required],
      qtyKg: [null, Validators.nullValidator],
      remarks: [null, Validators.nullValidator],

    });
  }

  addNewOrder(post) {
    debugger;
  if(this.orderForm.controls.costumerInternalId.value==null){
    this.orderForm.controls.costumerInternalId.setValue(this.choosedCostumer.costumerId);
  };

  if(this.orderForm.valid){
    let newOrderObj = {
      costumer: post.costumer,
      orderDate: post.orderdate,
      costumerInternalId:post.costumerInternalId,
      deliveryDate: post.delivery,
      orderRemarks: post.remarks,
      type: post.type,
      status: 'open',
      stage: 'new',
      onHoldDate: null,
      user:post.user
    }
    this.orderSer.addNewOrder(newOrderObj).subscribe(res => {
      debugger;
      this.orderId = res._id;
      this.orderNumber = res.orderNumber;
      this.submited = true;
      this.orderSer.refreshOrders.emit(res)
      console.log(res)
    });
  }else{
    this.toastSrv.error("Failed please finish filling the form");
  }
}

  addNewItemOrder(post) {
    debugger
   if(this.shippingDetails.shippingWay == "" || this.shippingDetails.shippingQuantity == "") {
     this.toastSrv.error("Please Add Shipping Details")
   } else {
      
    console.log(post);
    var shippingQuantitySum = 0;

    this.shippingMethod.forEach(function(details) {
      shippingQuantitySum += parseInt(details.shippingQuantity);

      return shippingQuantitySum
    });
    
    console.log(shippingQuantitySum)
    

    if(post.quantity < shippingQuantitySum) {
      this.toastSrv.error("Shipping quantity can not be more than the quantity")
    } 
    else {
    // cause this 2 firleds has [value] also, it won't read them if it's not data what was insert
    //if(this.itemName!="" && this.itemName!=null) post.discription = this.itemName;
    // if(this.netWeightK!=0 && this.netWeightK!=null) post.netWeightK = this.netWeightK;
    let newOrderItemObj = {
      itemNumber: post.itemN,
      discription: post.discription,
      netWeightGr: post.netWeightK,
      quantity: post.quantity,
      qtyKg: post.qtyKg,
      shippingMethod: this.shippingMethod,
      batch: "",
      price: "",
      discount: "",
      totalPrice: "",
      itemRemarks: post.remarks,
      orderId: this.orderId,
      orderNumber: this.orderNumber
    };
    console.log(newOrderItemObj);
    this.orderItemForm.reset();
    this.orderSer.addNewOrderItem(newOrderItemObj).subscribe(res => {
      debugger;
      if(res!='error'){
        this.items.push(res);
        console.log(this.items)
        this.itemName = "";
        this.netWeightK = 0;
        this.toastSrv.success('item '+res.itemNumber+' added');
 
      } else{
        this.toastSrv.error('Adding item faild');
      }
     
      this.shippingMethod = [];

    });
   
    //  orderId:this.orderId
  }

   }
   
  
  }

  addShipping() { 
    debugger; 
    let DetailsToPush ={...this.shippingDetails};
    
    this.shippingMethod.push(DetailsToPush)

  }


  searchItem(itemNumber) {
    this.itemName = "";
    //console.log(itemNumber);
    if (itemNumber != "") {
      this.orderSer.getItemByNumber(itemNumber).subscribe(res => {
        // console.log(res[0]);
        this.orderItemForm.controls.discription.setValue(
          res[0].name + " " + res[0].subName + " " + res[0].discriptionK
        );
        this.orderItemForm.controls.netWeightK.setValue(res[0].netWeightK);
        //   this.itemName = res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
        //   this.netWeightK = res[0].netWeightK;
        console.log(this.itemName + ",  " + this.netWeightK);
      });
    }
  }

  getLastOrderNumber() {
    this.orderSer.getLastOrderNumber().subscribe();
  }
  ngOnInit() {
    //this.getLastOrderNumber();

    /* this.rForm.get('validate').valueChanges.subscribe(

       (validate) => {

           if (validate == '1') {
               this.rForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
               this.titleAlert = 'You need to specify at least 3 characters';
           } else {
               this.rForm.get('name').setValidators(Validators.required);
           }
           this.rForm.get('name').updateValueAndValidity();

       });
  */
    this.getCostumers();
    if(this.authService.loggedInUser)
    {
      this.user = this.authService.loggedInUser.firstName;
      this.orderForm.controls.user.setValue(this.user);
    }
    else
    {
      this.authService.userEventEmitter.subscribe(data=>
        {
          this.user = this.authService.loggedInUser.firstName;
          this.orderForm.controls.user.setValue(this.user);
        })
    } 
  
  }

  // addNewSavedOrder(post) {
  //   let newOrderObj = {
  //     costumer: post.costumer,
  //     orderDate: post.orderdate,
  //     deliveryDate: post.delivery,
  //     orderRemarks: post.remarks,
  //     status: "open",
  //     stage: 'new',
  //     onHoldDate: null,
  //   };
  //   this.orderSer.addNewOrder(newOrderObj).subscribe(res => {
  //     this.orderId = res._id;
  //     this.orderNumber = res.orderNumber;
  //     this.submited = true;
  //     console.log(res);
  //   });
  //   console.log(newOrderObj);
  // }

  addNewSavedOrderItem(post) {
    debugger;
    console.log(post);
    // cause this 2 firleds has [value] also, it won't read them if it's not data what was insert
    if (post.discription == null || post.discription != this.itemName)
      post.discription = this.itemName;
    if (post.netWeightK == null || post.netWeightK != this.netWeightK)
      post.netWeightK = this.netWeightK;
    let newOrderItemObj = {
      itemNumber: post.itemN,
      discription: post.discription,
      netWeightGr: post.netWeightK,
      quantity: post.quantity,
      qtyKg: post.qtyKg,
      shippingMethod: post.shippingMethod,
      batch: "",
      price: "",
      discount: "",
      totalPrice: "",
      itemRemarks: post.remarks,
      orderId: this.orderId,
      orderNumber: this.orderNumber
    };
    console.log(newOrderItemObj);
    this.orderItemForm.reset();
    this.orderSer.addNewOrderItem(newOrderItemObj).subscribe(res => 
      this.items.push(res)
      
      );
      debugger
   
  }

  getCostumers() {
    this.costumerService.getAllCostumers().subscribe(res => {
      this.filterCostumers = res;
      this.costumers = res;
      this.costumersCopy = res;
      this.filterCostumers = this.orderForm.get("costumer").valueChanges.pipe(
        startWith<string | any>(""),
        map(name => (name ? this._filter(name) : this.costumers.slice()))
      );
    });
  }

  private _filter(name: string): any[] {
    console.log(this.filterCostumers);
    this.filterCostumers.subscribe(res => console.log(res));
    const filterValue = name.toLowerCase();
    console.log("filterValue " + filterValue);

    return this.costumers.filter(costumer =>
      costumer.costumerName.includes(filterValue)
    );

    // return this.costumers.filter(costumer => costumer.costumerName.toLowerCase()==filterValue);
  }

  openSearch(content, costumer) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          console.log(result);

          if (result == "Saved") {
            this.chooseCostumer();
          }
          this.closeResult = `Closed with: ${result}`;
          console.log(this.closeResult);
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  searchCostumer(costumerValue) {
    if (costumerValue != "") {
      this.costumers = this.costumers.filter(costumer =>
        costumer.costumerName.toLowerCase().includes(costumerValue)
      );
    } else {
      this.costumers = this.costumersCopy.slice();
    }
  }

  chooseCostumer() {
    if(this.choosedCostumer.impRemark != null && this.choosedCostumer.impRemark!= undefined && this.choosedCostumer.impRemark!="" ){
      alert("ללקוח יש הערה חשובה:\n"+this.choosedCostumer.impRemark);
    }
    this.orderForm.controls.costumer.setValue(
      this.choosedCostumer.costumerName
    );
    this.orderForm.controls.costumerInternalId.setValue(
      this.choosedCostumer.costumerId
    );
  }
 
}
