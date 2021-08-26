import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule, FormControl, AbstractControl } from "@angular/forms";
import { OrdersService } from "../../../services/orders.service";
import { CostumersService } from "../../../services/costumers.service";
import { Costumer } from "../../classes/costumer.class";
import { Observable } from "rxjs";
import { String } from "aws-sdk/clients/lexmodelbuildingservice";
import { map, startWith } from "rxjs/operators";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ItemsService } from "src/app/services/items.service";

@Component({
  selector: "app-neworder",
  templateUrl: "./neworder.component.html",
  styleUrls: ["./neworder.component.scss"],
})
export class NeworderComponent implements OnInit {
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("amounts") amounts;
  @ViewChild("problematics") problematics: ElementRef

  orderItemForm: FormGroup;
  orderForm: FormGroup;
  orderNumber: string;
  orderId: string;
  closeResult: string;
  choosedCostumer: any;
  itemName: String;
  netWeightK: Number = 0;
  lastOrderNumber: Number;
  user: any;
  existOrderItem: any[];
  shippingMethod: any[] = [];
  shippingDetails: any = {
    shippingQuantity: "",
    shippingWay: "",
  };
  items: any[] = [];
  costumers: any[] = [];
  costumersCopy: any[] = [];
  filterCostumers: Observable<any[]>;
  submited: boolean = false;
  openModal: boolean = false;
  titleAlert: string = "This field is required";
  materialsNotEnoughAmount: [];
  waitForAmounts: boolean = false;
  newOrderAllowed: boolean = false;
  problematicComponents: any[]
  problematicMaterials: any[]
  formuleExist: boolean = false
  isTooOld: boolean = false

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private orderSer: OrdersService,
    private costumerService: CostumersService,
    private toastSrv: ToastrService,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private itemsService: ItemsService

  ) {
    this.orderForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      delivery: [null, Validators.required],
      costumer: [null, Validators.required],
      costumerInternalId: [""],
      orderdate: [null, Validators.required],
      remarks: [null],
      customerOrderNum: [null],
      type: [null],
      user: [null, Validators.required],
      area: [null],
    });

    this.orderItemForm = fb.group({
      itemN: [null, Validators.required],
      discription: [null, Validators.required],
      netWeightK: [null, Validators.required],
      quantity: [null, Validators.required],
      qtyKg: [null, Validators.nullValidator],
      remarks: [null, Validators.nullValidator],
      hasLicense: [false, Validators.required],
      exploded: [false, Validators.required],
      productionApproved: [false, Validators.required],
      problematic: [false, Validators.required],
      formuleExist: [false, Validators.required],
      problematicMaterials: [[]],
      problematicComponents: [[]],
    });
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
    if (this.authService.loggedInUser) {
      if (this.authService.loggedInUser.authorization.includes("newOrder")) {
        this.newOrderAllowed = true
      }
      this.user = this.authService.loggedInUser.firstName;
      this.orderForm.controls.user.setValue(this.user);
    } else {
      this.authService.userEventEmitter.subscribe((data) => {
        this.user = this.authService.loggedInUser.firstName;
        this.orderForm.controls.user.setValue(this.user);
      });
    }
  }


  addNewOrder(post) {
    if (this.orderForm.controls.costumerInternalId.value == null) {
      this.orderForm.controls.costumerInternalId.setValue(
        this.choosedCostumer.costumerId
      );
    }

    if (this.orderForm.valid) {
      let newOrderObj = {
        area: this.choosedCostumer.area,
        costumer: post.costumer,
        orderDate: post.orderdate,
        costumerInternalId: post.costumerInternalId,
        deliveryDate: post.delivery,
        orderRemarks: post.remarks,
        customerOrderNum: post.customerOrderNum,
        type: post.type,
        status: "open",
        stage: "new",
        onHoldDate: null,
        user: post.user,
      };
      this.orderSer.addNewOrder(newOrderObj).subscribe((res) => {
        this.orderId = res._id;
        this.orderNumber = res.orderNumber;
        this.submited = true;
        this.orderSer.refreshOrders.emit(res);
        console.log(res);
      });
    } else {
      this.toastSrv.error("Failed please finish filling the form");
    }
  }

  // checkAmounts() {
  //   if (
  //     this.orderItemForm.controls["netWeightK"].value != "" &&
  //     this.orderItemForm.controls["quantity"].value != "" &&
  //     this.orderItemForm.controls["netWeightK"].value != null &&
  //     this.orderItemForm.controls["quantity"].value != null
  //   ) {
  //     this.waitForAmounts = true;
  //     this.modalService.open(this.amounts);

  //     let weightKG =
  //       (Number(this.orderItemForm.controls["netWeightK"].value) *
  //         Number(this.orderItemForm.controls["quantity"].value)) /
  //       1000;
  //     let formule = this.orderItemForm.controls["itemN"].value;
  //     //check amounts
  //     this.inventoryService
  //       .reduceMaterialAmounts('0',formule, weightKG, false)
  //       .subscribe((response) => {
  //         this.materialsNotEnoughAmount = response.materials;
  //         if (response.materials.length > 0) {
  //           let materialNames = <any>[];
  //           for (let material of response.materials) {
  //             this.inventoryService
  //               .getMaterialByNumber(material.material, "material")
  //               .subscribe((material) => {
  //                 materialNames.push(material[0].componentName);
  //               });
  //           }
  //           this.materialsNotEnoughAmount = materialNames;
  //           setTimeout(() => (this.waitForAmounts = false), 3000);
  //         }
  //       });
  //   } else this.toastSrv.warning("יש להזין משקל נטו וכמות");
  // }

  addNewItemOrder(post) {
    if (
      this.shippingDetails.shippingWay == "" ||
      this.orderItemForm.controls.itemN.value == "" ||
      this.orderItemForm.controls.itemN.value == null
    ) {
      this.toastSrv.error("Please fill all the details");
    } else {
      console.log(post);
      var shippingQuantitySum = 0;

      this.shippingMethod.forEach(function (details) {
        shippingQuantitySum += parseInt(details.shippingQuantity);

        return shippingQuantitySum;
      });

      console.log(shippingQuantitySum);

      if (post.quantity) {
        // cause this 2 firleds has [value] also, it won't read them if it's not data what was insert
        //if(this.itemName!="" && this.itemName!=null) post.discription = this.itemName;
        // if(this.netWeightK!=0 && this.netWeightK!=null) post.netWeightK = this.netWeightK;
        let newOrderItemObj = {
          itemNumber: post.itemN,
          discription: post.discription,
          netWeightGr: post.netWeightK,
          quantity: post.quantity,
          qtyKg: post.qtyKg,
          hasLicense: post.hasLicense,
          exploded: post.exploded,
          productionApproved: post.productionApproved,
          problematic: post.problematic,
          formuleExist: post.formuleExist,
          problematicComponents: post.problematicComponents,
          problematicMaterials: post.problematicMaterials,
          shippingMethod: this.shippingMethod,
          batch: "",
          price: "",
          discount: "",
          totalPrice: "",
          itemRemarks: post.remarks,
          orderId: this.orderId,
          orderNumber: this.orderNumber,
        };
        console.log(newOrderItemObj);
        this.orderItemForm.reset();
        this.orderItemForm.controls.hasLicense.setValue(false)
        this.orderItemForm.controls.exploded.setValue(false)
        this.orderItemForm.controls.productionApproved.setValue(false)
        this.orderSer.addNewOrderItem(newOrderItemObj).subscribe((res) => {
          if (res.msg == "notActive") {
            this.toastSrv.error("שים לב פריט זה אינו פעיל");
          } else if (res != "error") {
            this.items.push(res);
            console.log(this.items);
            this.itemName = "";
            this.netWeightK = 0;
            this.toastSrv.success("item " + res.itemNumber + " added");

            // IMPORTANT WARNING FOR DANGEROUS MATERIALS!!!
            // if(post.itemN == '15341' || post.itemN == '13629' || post.itemN == '10627') {
            //   this.toastSrv.error(`PAY ATTENTION! material ${post.itemN} should be treated carefully!!`)
            // TODO: add notification to shmuel / martha
            // }
          } else {
            this.toastSrv.error("Adding item faild");
          }

          this.shippingMethod = [];
        });

        //  orderId:this.orderId
      }
    }
  }

  addShipping() {
    let DetailsToPush = { ...this.shippingDetails };

    this.shippingMethod.push(DetailsToPush);
  }

  searchItem(itemNumber) {
    this.itemName = "";
    this.existOrderItem = [];
    //console.log(itemNumber);
    if (itemNumber != "") {
      this.orderSer.getItemByNumber(itemNumber).subscribe((res) => {
        // console.log(res[0]);
        this.orderItemForm.controls.discription.setValue(
          res[0].name + " " + res[0].subName + " " + res[0].discriptionK
        );
        this.orderItemForm.controls.netWeightK.setValue(res[0].netWeightK);

        //check license
        if (res[0].licsensNumber != "") {
          if (new Date(res[0].licsensDate) > new Date()) this.orderItemForm.controls.hasLicense.setValue(true);
        }

        //check for problematic ingredients
        this.itemsService.checkForProblematicItems(itemNumber).subscribe(data => {
          this.problematicMaterials = data.problematicMaterials
          this.problematicComponents = data.problematicComponents
          this.formuleExist = data.formuleFound
          this.modalService.open(this.problematics)
          if (!data.formuleFound || data.problematicMaterials.length > 0 || data.problematicComponents.length > 0) {
            this.orderItemForm.controls.problematic.setValue(true)
            this.orderItemForm.controls.formuleExist.setValue(data.formuleFound)
            this.orderItemForm.controls.problematicMaterials.setValue(data.problematicMaterials)
            this.orderItemForm.controls.problematicComponents.setValue(data.problematicComponents)
          }
        })

        //check if this product was produced in the last 18 months (Haviv & Uri request 25/8/2021)
        this.orderSer.checkForLastProduction(itemNumber).subscribe(data => {
          if (data.err) this.toastSrv.error('אנא וודא כי המוצר יוצר בשנה האחרונה', 'בעיה בבדיקת ייצור של המוצר. ')
          else this.isTooOld = data.isTooOld
        })

        this.orderSer.getAllOpenOrderItemsByItemNumber(itemNumber).subscribe((data) => {
          if (data.length > 0) {
            this.existOrderItem = data;
          } else {
            this.existOrderItem = undefined;
          }
        });
      });
    }
  }

  getLastOrderNumber() {
    this.orderSer.getLastOrderNumber().subscribe();
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
      orderNumber: this.orderNumber,
    };
    console.log(newOrderItemObj);
    this.orderItemForm.reset();
    this.orderSer
      .addNewOrderItem(newOrderItemObj)
      .subscribe((res) => this.items.push(res));
  }

  getCostumers() {
    this.costumerService.getAllCostumers().subscribe((res) => {
      this.filterCostumers = res;
      this.costumers = res;
      this.costumersCopy = res;
      this.filterCostumers = this.orderForm.get("costumer").valueChanges.pipe(
        startWith<string | any>(""),
        map((name) => (name ? this._filter(name) : this.costumers.slice()))
      );
    });
  }

  private _filter(name: string): any[] {
    console.log(this.filterCostumers);
    this.filterCostumers.subscribe((res) => console.log(res));
    const filterValue = name.toLowerCase();
    console.log("filterValue " + filterValue);

    return this.costumers.filter((costumer) =>
      costumer.costumerName.includes(filterValue)
    );

    // return this.costumers.filter(costumer => costumer.costumerName.toLowerCase()==filterValue);
  }

  openSearch(content, costumer) {
    console.log("AKAKAKAKAKAKAKAKAKAK ", content);
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          console.log(result);

          if (result == "Saved") {
            this.chooseCostumer();
          }
          this.closeResult = `Closed with: ${result}`;
          console.log(this.closeResult);
        },
        (reason) => {
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
      this.costumers = this.costumers.filter((costumer) =>
        costumer.costumerName.toLowerCase().includes(costumerValue)
      );
    } else {
      this.costumers = this.costumersCopy.slice();
    }
  }

  chooseCostumer() {
    if (
      this.choosedCostumer.impRemark != null &&
      this.choosedCostumer.impRemark != undefined &&
      this.choosedCostumer.impRemark != ""
    ) {
      alert("ללקוח יש הערה חשובה:\n" + this.choosedCostumer.impRemark);
    }
    this.orderForm.controls.costumer.setValue(
      this.choosedCostumer.costumerName
    );
    this.orderForm.controls.costumerInternalId.setValue(
      this.choosedCostumer.costumerId
    );
  }
}
