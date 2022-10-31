import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "src/app/services/items.service";
import { BatchesService } from "src/app/services/batches.service";
import { InventoryService } from "src/app/services/inventory.service";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { OrdersService } from "src/app/services/orders.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductionService } from "src/app/services/production.service";
import { WorkPlan } from "../../production/planning/WorkPlan";
import { AotCompiler } from "@angular/compiler";
import { xor } from "lodash";
import {
  NgbModal,
  NgbNav,
  NgbNavChangeEvent,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-new-batch",
  templateUrl: "./new-batch.component.html",
  styleUrls: ["./new-batch.component.scss"],
})
export class NewBatchComponent implements OnInit {
  @ViewChild("printBtn") printBtn: ElementRef;
  @ViewChild("currentOrderNumber") currentOrderNumber: ElementRef;
  @ViewChild("itemWeight") itemWeight: ElementRef;
  @ViewChild("itemNumber") itemNumber: ElementRef;
  @ViewChild("itemName") itemName: ElementRef;

  allStickers: any[] = [];
  batchDefaultNumber: string = "22pp";
  lastBatch: any;
  today: Date = new Date();
  disableButton: boolean;
  newBatchAllowed: boolean = false;
  currentItems: any[] = [];
  workPlan: WorkPlan;
  workPlanFormule: string;
  finalWeight: number;
  openBarrelsModal: boolean = false;

  //barcode parameters
  bcValue = "BARCODE";
  elementType = "svg";
  format = "CODE128";
  lineColor = "#000000";
  width = 1.5;
  height = 30;
  displayValue = true; // true=display bcValue  fonts under barcode
  fontOptions = "";
  font = "monospace";
  textAlign = "center";
  textPosition = "bottom";
  textMargin = 1.5;
  fontSize = 20;
  background = "#ffffff";
  // margin = 10;
  marginTop = 15;
  marginBottom = 5;
  marginLeft = 20;
  marginRight = 10;

  newBatchForm: FormGroup = new FormGroup({
    chosenFormule: new FormControl("", Validators.required),
    itemName: new FormControl("", Validators.required),
    produced: new FormControl(new Date(this.today), Validators.required),
    expration: new FormControl("", Validators.required),
    barrels: new FormControl(0, Validators.min(1)),
    ph: new FormControl("", Validators.required),
    weightKg: new FormControl("", Validators.required),
    weightQtyLeft: new FormControl(""),
    batchNumber: new FormControl(this.batchDefaultNumber, [
      Validators.required,
      Validators.minLength(7),
    ]),
    batchCreated: new FormControl(0, Validators.required),
    itemsToCook: new FormControl([], Validators.minLength(1)),
    newWeight: new FormControl(0),
    barrelsList: new FormControl([]),
    workPlanID: new FormControl(null),
    ordersAndItems: new FormControl([]),
    formule: new FormControl(""),
  });

  user: any;

  constructor(
    private inventorySrv: InventoryService,
    private toastSrv: ToastrService,
    private itemSrv: ItemsService,
    private batchService: BatchesService,
    private authService: AuthService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private prodSchedServ: ProductionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getLastBatch();
    this.newBatchAllowed = this.authService.loggedInUser.authorization.includes(
      "newBatch"
    )
      ? true
      : false;
    this.getWorkPlan();
    this.getUserInfo();
  }

  getWorkPlan() {
    this.route.queryParamMap.subscribe((params) => {
      console.log(params);
      if (params["params"].workPlanId) {
        this.prodSchedServ
          .getWorkPlan(params["params"].workPlanId)
          .subscribe((workPlan) => {
            console.log(workPlan);
            this.workPlan = workPlan;

            // get the serial number of the wp. It will be sent together with the new batch
            this.newBatchForm.controls.workPlanID.setValue(
              workPlan.serialNumber
            );
            this.workPlanFormule = params["params"].formule;
            let formule = this.workPlan.productionFormules.find(
              (f) => f.formule == params["params"].formule
            );
            // this.openBarrelsModal = true;
            this.newBatchForm.controls.formule.setValue(formule.formule);
            console.log(formule.barrels);
            let finalWeight;
            let barrelsWeight = 0;
            while (isNaN(finalWeight)) finalWeight = prompt("הכנס משקל כולל");
            for (let barrel of formule.barrels) {
              let barrelWeight;
              while (isNaN(barrelWeight))
                barrelWeight = prompt(
                  "מה המשקל של חבית ישנה מספר: " + barrel.barrelNumber
                );
              barrelsWeight += Number(barrelWeight);
            }
            this.newBatchForm.controls.barrelsList.setValue(formule.barrels);

            this.finalWeight = Number(finalWeight);
            // while (isNaN(barrelsWeight))
            //   barrelsWeight = prompt("הכנס משקל חומר ישן");
            this.newBatchForm.controls.weightKg.setValue(this.finalWeight);
            this.newBatchForm.controls.newWeight.setValue(
              finalWeight - barrelsWeight
            );

            // calculate the weight for each order from the total weight of the batch
            console.log(formule);

            console.log(formule.producedKG);
            let totalToUse = Number(finalWeight); // total weight of the  new batch
            //ordersAndItems will be sent to the server with the new batch
            this.newBatchForm.controls.ordersAndItems.setValue(
              formule.ordersAndItems
            );
            for (let item of this.newBatchForm.controls.ordersAndItems.value) {
              item.producedKg = item.producedKg ? item.producedKg : 0;
              let usedInThisbatch = 0;
              // it could be a second batch for the same workplan, we need to check what is the weight that was already added to this order
              // check if there is weight left
              if (totalToUse > 0) {
                //check if it is needed to add batch for this order
                if (item.producedKg < item.weightKg) {
                  // check if we have enough weight to fill the gap
                  if (totalToUse >= item.weightKg - item.producedKg) {
                    usedInThisbatch = item.weightKg - item.producedKg;
                    totalToUse -= item.weightKg - item.producedKg;
                    item.producedKg = item.weightKg;
                  } else {
                    // if not enough, we will use all the wight for this order.
                    usedInThisbatch = totalToUse;
                    item.producedKg += totalToUse;
                    totalToUse = 0;
                  }
                }
                // item.weightKg = this.finalWeight / formule.ordersAndItems.length;
              }
              let itemToPush = { ...item, usedInThisbatch };
              this.newBatchForm.value.itemsToCook.push(itemToPush);
            }

            //if there is weight left we will add it to the last order

            console.log(this.newBatchForm);

            // need to update the workplan with the produced quantities
          });
      }
    });
  }

  ngDoCheck() {
    if (this.finalWeight)
      this.newBatchForm.controls.weightKg.setValue(this.finalWeight);
    else {
      let finalWeight = 0;
      for (let item of this.newBatchForm.value.itemsToCook) {
        finalWeight += Number(item.weightKg);
      }
      this.newBatchForm.controls.weightKg.setValue(finalWeight);
    }
  }

  getLastBatch() {
    this.batchService.getLastBatch().subscribe((data) => {
      this.lastBatch = data;
    });
  }

  backToWP() {
    this.router.navigate(["/peerpharm/production/planning"], {
      queryParams: {
        workPlanId: this.workPlan.serialNumber,
      },
    });
  }

  //*****************************************************changing batch process********************************************************************************* */

  getOrderDetails(e) {
    let orderNumber = e.target.value;
    //get all items from order:
    this.orderService.getItemsFromOrder(orderNumber).subscribe((res) => {
      if (res.length > 0) {
        this.currentItems = res;
      } else this.toastSrv.error("No items on this order");
    });
  }

  checkItem(e) {
    let item = this.currentItems.find((i) => i.itemNumber == e.target.value);
    if (!item)
      this.toastSrv.error(
        "Item does not exist in this order.",
        "Unmatch Item!"
      );
    else {
      this.itemName.nativeElement.value = item.discription;
    }
  }

  saveItem() {
    //check
    let itemNumber = this.itemNumber.nativeElement.value;
    let itemName = this.itemName.nativeElement.value;
    let itemWeight = this.itemWeight.nativeElement.value;
    let orderNumber = this.currentOrderNumber.nativeElement.value;
    this.newBatchForm.value.itemsToCook.push({
      orderNumber,
      itemNumber,
      itemName,
      weightKg: itemWeight,
    });
    this.itemWeight.nativeElement.value = null;
    this.currentOrderNumber.nativeElement.value = null;
    this.itemNumber.nativeElement.value = null;
    this.itemName.nativeElement.value = null;
    this.currentItems = [];
    this.currentOrderNumber.nativeElement.focus();
  }

  setMainFormule(item) {
    this.newBatchForm.controls.chosenFormule.setValue(item.itemNumber);
    this.newBatchForm.controls.itemName.setValue(item.itemName);
  }

  removeItem(i) {
    this.newBatchForm.value.itemsToCook.splice(i, 1);
  }

  checkPointerAllowed() {
    if (this.newBatchForm.value.chosenFormule == "") return "disable-pointer";
    else return "";
  }

  //************************************************************************************************************************************** */

  fillItemName(ev) {
    var itemNumber = ev.target.value;
    this.itemSrv.getItemData(itemNumber).subscribe((data) => {
      console.log("data: ", data);
      if (data.length > 0) {
        this.newBatchForm.controls["itemName"].setValue(
          data[0].name + " " + data[0].subName + " " + data[0].discriptionK
        );
      } else {
        this.toastSrv.error("פריט לא קיים במערכת");
      }
    });
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.newBatchForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  async getUserInfo() {
    if (this.authService.loggedInUser) {
    }
    this.user = await this.authService.loggedInUser;
  }

  addNewBatch(justStickers: boolean) {
    console.log(this.newBatchForm.value);
    console.log(this.newBatchForm.status);
    let invalids = this.findInvalidControls();
    console.log(invalids);
    if (invalids.length > 0) {
      this.toastSrv.error(
        "Value in field " +
          invalids[0] +
          " is not valid, please fix and try again."
      );
      return;
    }
    // weightQtyLeft value doesn't exist in the form
    console.log(this.newBatchForm.controls.weightKg.value);
    this.newBatchForm.controls.weightQtyLeft.setValue(
      this.newBatchForm.controls.weightKg.value
    );

    // change the batch number to lower case
    this.newBatchForm.controls.batchNumber.setValue(
      this.newBatchForm.get("batchNumber").value.toLowerCase()
    );

    // set the date to today by default
    this.newBatchForm.controls.batchCreated.setValue(new Date().getTime());

    // set expiration date

    let expirationDate = new Date();
    // get the number of years from the form
    let expirationYear = this.newBatchForm.get("expration").value;
    // add the number of years to today date
    expirationDate.setFullYear(
      Number(expirationDate.getFullYear()) + Number(expirationYear)
    );
    // set the value of the expiration in the form
    this.newBatchForm.controls.expration.setValue(expirationDate);

    if (this.newBatchForm.controls.batchNumber.value.length < 5) {
      this.toastSrv.error(
        "Batch number must include at least 5 charchters",
        "Invalid Batch Number"
      );
    }

    if (parseInt(this.newBatchForm.controls["barrels"].value) > 1) {
      for (
        let x = 1;
        x < parseInt(this.newBatchForm.controls["barrels"].value) + 1;
        x++
      ) {
        //create barcode
        let barcode = this.newBatchForm.value.batchNumber + "-" + x;
        let batchSticker = {
          bcValue: barcode,
          batch: this.newBatchForm.value,
          printNum:
            "" +
            x +
            "/" +
            parseInt(this.newBatchForm.controls["barrels"].value),
          user: `${this.user.firstName} ${this.user.lastName}`,
        };
        this.allStickers.push(batchSticker);
      }
      console.log(this.allStickers);
    } else {
      // create barcode
      let barcode = this.newBatchForm.value.batchNumber + "-1";

      let batchSticker = {
        bcValue: barcode,
        batch: this.newBatchForm.value,
        printNum: "1/1",
        user: `${this.user.firstName} ${this.user.lastName}`,
      };
      this.allStickers.push(batchSticker);
    }
    console.log(this.allStickers);

    if (justStickers) {
      // just print stickers
      //TODO: CHECK IF BATCH EXIST!!!
      this.batchService
        .checkIfBatchExist(
          this.newBatchForm.get("batchNumber").value.toLowerCase()
        )
        .subscribe((response) => {
          if (response) {
            if (
              confirm(
                "בחרת רק להדפיס מדבקות. באטצ' לא יתווסף למערכת. האם להמשיך?"
              )
            ) {
              setTimeout(() => {
                this.printBtn.nativeElement.click();
                // this.newBatchForm.reset()
                // this.newBatchForm.controls.batchNumber.setValue(this.batchDefaultNumber)
                this.allStickers = [];
              }, 2000);
            }
          } else this.toastSrv.error("", "Batch not exist.");
        });
    }
    // add batch AND REDUCE AMOUNTS!!!
    else {
      this.batchService
        .checkIfBatchExist(this.newBatchForm.value.batchNumber)
        .subscribe((data) => {
          console.log(data);
          if (data == true) {
            alert(
              "Batch Number " +
                this.newBatchForm.value.batchNumber +
                " already exists, choose a new batchNumber"
            );
            return;
          }

          if (this.newBatchForm.value.chosenFormule == "") {
            this.toastSrv.error("Please Choose Main Formule");
          } else {
            if (
              confirm("באטצ' יתווסף למערכת והכמויות יירדו מהמלאי. האם להמשיך?")
            ) {
              this.disableButton = true;
              this.toastSrv.info("Adding Batch. Please wait...");
              let con = true;
              let user = this.authService.loggedInUser.userName;
              console.log(user);
              // reduce materials from itemShells

              this.batchService
                .addBatch(this.newBatchForm.value)
                .subscribe((data) => {
                  console.log(data);
                  if (data.msg == "success") {
                    console.log(this.newBatchForm.controls);
                    this.inventorySrv
                      .reduceMaterialAmounts(
                        this.newBatchForm.controls.batchNumber.value,
                        this.newBatchForm.controls.chosenFormule.value,
                        this.newBatchForm.controls.newWeight.value,
                        user,
                        true,
                        this.newBatchForm.controls.barrelsList.value
                      )
                      .subscribe((data) => {
                        console.log(data);
                        this.disableButton = false;
                        if (data == "Formule Not Found") {
                          this.toastSrv.error(data);
                          con = confirm(
                            "פורמולה לא קיימת. כמויות לא ירדו מהמלאי. להוסיף באטצ' בכל זאת?"
                          );
                          this.disableButton = false;
                        }
                        if (data.materials && data.updatedShells)
                          this.toastSrv.success(
                            "Amounts reduced. Shelfs updated."
                          );
                      });

                    this.printBtn.nativeElement.click();
                    this.toastSrv.success("באטצ נוסף בהצלחה !");

                    this.resetBatchValues();
                    this.toastSrv.info(
                      "אתה חוזר לפקודת העבודה",
                      "You are getting back to the workplan"
                    );

                    this.backToWP();
                  } else if (data.msg == "Batch Allready Exist") {
                    this.toastSrv.error(
                      "Please fill a different batch number.",
                      "Batch number allready exist."
                    );
                    this.disableButton = false;
                  } else {
                    this.toastSrv.error("Something went wrong.");
                    this.resetBatchValues();
                    return;
                  }
                });
            } else {
              this.resetBatchValues();
              this.toastSrv.info(
                "אתה חוזר לפקודת העבודה",
                "You are getting back to the workplan"
              );
              this.backToWP();
            }
          }
        });
    }
  }

  resetBatchValues() {
    this.newBatchForm.reset();
    this.newBatchForm.controls.batchNumber.setValue(this.batchDefaultNumber);
    this.newBatchForm.controls.itemsToCook.setValue([]);
  }

  //not needed anymore
  // reduceMaterialAmounts(batchNumber,formuleNumber, weightKG) {
  //     this.inventorySrv.reduceMaterialAmounts(batchNumber,formuleNumber, weightKG, true).subscribe(data => {
  //       if(data == 'Formule Not Found') this.toastSrv.error(data)
  //       else if(data.materials && data.updatedShells) this.toastSrv.success('Amounts reduced. Shelfs updated.')
  //     })
  // }
}
