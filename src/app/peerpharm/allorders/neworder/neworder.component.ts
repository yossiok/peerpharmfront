import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
} from "@angular/forms";
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
import { Location } from "@angular/common";

@Component({
  selector: "app-neworder",
  templateUrl: "./neworder.component.html",
  styleUrls: ["./neworder.component.scss"],
})
export class NeworderComponent implements OnInit {
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("amounts") amounts;
  @ViewChild("problematics") problematics: ElementRef;

  orderNumber: string;
  orderId: string;
  closeResult: string;
  choosedCostumer: any;
  itemName: String;
  netWeightGr: Number = 0;
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
  problematicComponents: any[];
  problematicMaterials: any[];
  formuleExist: boolean = false;
  isTooOld: boolean = false;
  noNeto: boolean = false;
  today: Date = new Date();

  orderForm: FormGroup = new FormGroup({
    //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    deliveryDate: new FormControl(new Date(), Validators.required),
    costumer: new FormControl("", Validators.required),
    costumerInternalId: new FormControl(""),
    orderDate: new FormControl(new Date(), Validators.required),
    orderRemarks: new FormControl(""),
    customerOrderNum: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    user: new FormControl(null, Validators.required),
    status: new FormControl("open"),
    stage: new FormControl("new"),
    hasSpecialOrderItems: new FormControl(false),

    // area: new FormControl(null),
  });

  orderItemForm: FormGroup = new FormGroup({
    itemNumber: new FormControl(null, Validators.required),
    discription: new FormControl(null, Validators.required),
    netWeightGr: new FormControl(null, Validators.required),
    quantity: new FormControl(0, Validators.min(1)),
    qtyKg: new FormControl(null, Validators.nullValidator),
    itemRemarks: new FormControl(null, Validators.nullValidator),
    hasLicense: new FormControl(false, Validators.required),
    exploded: new FormControl(false, Validators.required),
    productionApproved: new FormControl(false, Validators.required),
    problematic: new FormControl(false, Validators.required),
    formuleExist: new FormControl(false, Validators.required),
    problematicMaterials: new FormControl([[]]),
    problematicComponents: new FormControl([[]]),
    itemDeliveryDate: new FormControl(null),
    status: new FormControl("open"),
    orderId: new FormControl(null),
    orderNumber: new FormControl(null),
    shippingMethod: new FormControl([]),
    itemOrderDate: new FormControl(new Date(), Validators.required),
    batch: new FormControl(""),
  });

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private orderSer: OrdersService,
    private costumerService: CostumersService,
    private toastSrv: ToastrService,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private itemsService: ItemsService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getCostumers();
    if (this.authService.loggedInUser) {
      if (this.authService.loggedInUser.authorization.includes("newOrder")) {
        this.newOrderAllowed = true;
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

  back(): void {
    this.location.back();
  }

  addNewOrder() {
    console.log(this.orderForm);
    if (this.orderForm.controls.costumerInternalId.value == null) {
      this.orderForm.controls.costumerInternalId.setValue(
        this.choosedCostumer.costumerId
      );
    }

    if (this.orderForm.valid) {
      // let newOrderObj = {
      //   area: this.choosedCostumer.area,
      //   costumer: post.costumer,
      //   orderDate: post.orderdate,
      //   costumerInternalId: post.costumerInternalId,
      //   deliveryDate: post.delivery,
      //   orderRemarks: post.remarks,
      //   customerOrderNum: post.customerOrderNum,
      //   type: post.type,
      //   status: "open",
      //   stage: "new",
      //   onHoldDate: null,
      //   user: post.user,
      // };

      this.orderSer.addNewOrder(this.orderForm.value).subscribe((res) => {
        console.log(res);
        if (res.msg) {
          this.toastSrv.error(res.msg);
          return;
        } else if (res) {
          this.orderId = res._id;
          this.orderNumber = res.orderNumber;
          this.submited = true;
          this.orderSer.refreshOrders.emit(res);
          console.log(res);
          this.toastSrv.success("הזמנה חדשה נוצרה בהצלחה");
        } else {
          this.toastSrv.error(
            "הוספת הזמנה חדשה לא הצליחה. אם ניסיון חוזר לא מצליח, יש לפנות למנהל המערכת."
          );
          return;
        }
      });
    } else {
      this.toastSrv.error("יש למלא את שדות החובה");
    }
  }

  // checkAmounts() {
  //   if (
  //     this.orderItemForm.controls["netWeightGr"].value != "" &&
  //     this.orderItemForm.controls["quantity"].value != "" &&
  //     this.orderItemForm.controls["netWeightGr"].value != null &&
  //     this.orderItemForm.controls["quantity"].value != null
  //   ) {
  //     this.waitForAmounts = true;
  //     this.modalService.open(this.amounts);

  //     let weightKG =
  //       (Number(this.orderItemForm.controls["netWeightGr"].value) *
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

  addNewItemOrder() {
    console.log(this.orderItemForm);
    // console.log(post);
    if (
      this.shippingDetails.shippingWay == "" ||
      this.orderItemForm.controls.itemNumber.value == "" ||
      this.orderItemForm.controls.itemNumber.value == null
    ) {
      this.toastSrv.error("Please fill all the details");
    } else {
      //update order has problematic items
      let hasSpecialOrderItems = false;
      if (
        this.orderItemForm.value.problematicMaterials.length > 0 ||
        this.orderItemForm.value.problematicComponents.length > 0
      ) {
        hasSpecialOrderItems = true;
      }

      // if (this.problematicMaterials && this.problematicMaterials.length > 0) {
      //   hasSpecialOrderItems = true;
      // }
      // if (this.problematicComponents && this.problematicComponents.length > 0) {
      //   hasSpecialOrderItems = true;
      // }
      this.orderSer
        .editOrder({
          orderId: this.orderId,
          hasSpecialOrderItems: hasSpecialOrderItems,
          orderType: this.orderForm.controls.type.value,
        })
        .subscribe((data) => {
          console.log("order problematic items updated");
        });

      var shippingQuantitySum = 0;

      this.shippingMethod.forEach(function (details) {
        shippingQuantitySum += parseInt(details.shippingQuantity);
        return shippingQuantitySum;
      });
      this.orderItemForm.controls.shippingMethod.setValue(this.shippingMethod);
      this.orderItemForm.controls.orderNumber.setValue(this.orderNumber);
      this.orderItemForm.controls.orderId.setValue(this.orderId);

      if (this.orderItemForm.valid) {
        // let newOrderItemObj = {
        // itemNumber: post.itemN,
        // discription: post.discription,
        // netWeightGr: post.netWeightGr,
        // quantity: post.quantity,
        // qtyKg: post.qtyKg,
        // hasLicense: post.hasLicense,
        // exploded: post.exploded,
        // productionApproved: post.productionApproved,
        // problematic: post.problematic,
        // formuleExist: post.formuleExist,
        // problematicComponents: post.problematicComponents,
        // problematicMaterials: post.problematicMaterials,
        // shippingMethod: this.shippingMethod,
        // batch: "",
        // price: "",
        // discount: "",
        // totalPrice: "",
        // // itemRemarks: post.remarks,
        // orderId: this.orderId,
        // orderNumber: this.orderNumber,
        // status: "open",
        // itemDeliveryDate: this.orderItemForm.controls.itemDeliveryDate.value,
        // };

        this.orderSer
          .addNewOrderItem(this.orderItemForm.value)
          .subscribe((res) => {
            console.log(res);
            if (res.msg == "notActive") {
              this.toastSrv.error("שים לב פריט זה אינו פעיל");
            } else if (res != "error") {
              this.items.push(res.document);
              this.itemName = "";
              // this.netWeightGr = 0;
              this.toastSrv.success(
                "item " + res.document.itemNumber + " added"
              );
            } else {
              this.toastSrv.error("Adding item faild");
            }
            this.today = new Date();
            this.shippingMethod = [];
            this.orderItemForm.reset();
            this.orderItemForm.controls.quantity.setValue(0);
            // eran
            this.orderItemForm.controls.batch.setValue("");
            this.orderItemForm.controls.hasLicense.setValue(false);
            this.orderItemForm.controls.exploded.setValue(false);
            this.orderItemForm.controls.productionApproved.setValue(false);
            setTimeout(() => {
              this.orderItemForm.controls.itemOrderDate.setValue(this.today);
            }, 150);
          });
      }
    }
  }

  addShipping() {
    let DetailsToPush = { ...this.shippingDetails };
    this.shippingMethod.push(DetailsToPush);
  }

  searchItem() {
    let itemNumber = this.orderItemForm.controls.itemNumber.value;
    console.log(itemNumber);
    let itemExists = this.items.findIndex((oi) => oi.itemNumber == itemNumber);
    if (itemExists > -1) {
      alert(
        "פריט זה קיים כבר בהזמנה זו, יש לפתוח הזמנה חדשה או לשנות את הכמות בפריט הקיים (לפני שנשלח לבישול!). "
      );
      this.orderItemForm.controls.itemNumber.setValue("");
      this.orderItemForm.controls.discription.setValue("");
      this.orderItemForm.controls.itemRemarks.setValue("");
      this.orderItemForm.controls.quantity.setValue(0);
      this.orderItemForm.controls.netWeightGr.setValue(null);
      this.orderItemForm.controls.qtyKg.setValue(null);

      return;
    }

    this.noNeto = false;
    this.itemName = "";
    this.existOrderItem = [];
    if (itemNumber != "") {
      this.orderSer.getItemByNumber(itemNumber).subscribe((res) => {
        console.log(res);
        this.orderItemForm.controls.discription.setValue(
          res[0].name + " " + res[0].subName + " " + res[0].discriptionK
        );
        this.orderItemForm.controls.netWeightGr.setValue(res[0].netWeightK);
        if (!res[0].netWeightK) {
          this.noNeto = true;
          this.orderItemForm.controls.netWeightGr.setValue(res[0].volumeKey);
        }

        //check license
        if (res[0].licsensNumber != "") {
          if (new Date(res[0].licsensDate) > new Date())
            this.orderItemForm.controls.hasLicense.setValue(true);
        }

        //check for problematic ingredients
        this.itemsService
          .checkForProblematicItems([itemNumber])
          .subscribe((data) => {
            console.log(data);
            this.problematicMaterials = data[0].problematicMaterials;
            this.problematicComponents = data[0].problematicComponents;
            this.formuleExist = data[0].formuleFound;
            this.orderItemForm.controls.formuleExist.setValue(
              data[0].formuleFound
            );
            this.orderItemForm.controls.problematicMaterials.setValue(
              data[0].problematicMaterials
            );

            this.orderItemForm.controls.problematicComponents.setValue(
              data[0].problematicComponents
            );
            if (
              !data[0].formuleFound ||
              data[0].problematicMaterials.length > 0 ||
              data[0].problematicComponents.length > 0
            ) {
              this.orderItemForm.controls.problematic.setValue(true);
            } else {
              this.orderItemForm.controls.problematic.setValue(false);
            }
            setTimeout(() => {
              this.modalService.open(this.problematics);
            }, 300);

            //check if this product was produced in the last 18 months (Haviv & Uri request 25/8/2021)
            this.orderSer
              .checkForLastProduction(itemNumber)
              .subscribe((data) => {
                if (data.err)
                  this.toastSrv.error(
                    "אנא וודא כי המוצר יוצר בשנה האחרונה",
                    "בעיה בבדיקת ייצור של המוצר. "
                  );
                else this.isTooOld = data.isTooOld;

                this.orderSer
                  .getAllOpenOrderItemsByItemNumber(itemNumber)
                  .subscribe((data) => {
                    if (data.length > 0) {
                      this.existOrderItem = data;
                    } else {
                      this.existOrderItem = undefined;
                    }
                  });
              });
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
    if (post.netWeightGr == null || post.netWeightGr != this.netWeightGr)
      post.netWeightGr = this.netWeightGr;
    let newOrderItemObj = {
      itemNumber: post.itemN,
      discription: post.discription,
      netWeightGr: post.netWeightGr,
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
  calcQuantity() {
    if (
      this.orderItemForm.controls.netWeightGr.value &&
      this.orderItemForm.controls.quantity.value
    ) {
      let totalWeight =
        (this.orderItemForm.controls.netWeightGr.value *
          this.orderItemForm.controls.quantity.value) /
        1000;
      this.orderItemForm.controls.qtyKg.setValue(totalWeight);
    }
  }
}
