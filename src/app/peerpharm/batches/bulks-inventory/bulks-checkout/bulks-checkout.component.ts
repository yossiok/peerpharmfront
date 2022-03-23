import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { CreamBarrelService } from "src/app/services/cream-barrel.service";
import { WarehouseService } from "src/app/services/warehouse.service";
import { AuthService } from "src/app/services/auth.service";
import { BatchesService } from "src/app/services/batches.service";

@Component({
  selector: "app-bulks-checkout",
  templateUrl: "./bulks-checkout.component.html",
  styleUrls: ["./bulks-checkout.component.scss"],
})
export class BulksCheckoutComponent implements OnInit {
  @Input("allWarehouses") allWarehouses: any[];

  currentWarehouse: string = "";
  user: any = null;
  authorized: boolean = false;
  batchesList: any[] = [];
  barrelsList: any[] = [];
  destinationWHs: any[] = [];
  barrelsCheckout: any[] = [];
  shelvesList: any[] = [];

  bulkCheckout: FormGroup = new FormGroup({
    originWH: new FormControl("", Validators.required),
    destinationWH: new FormControl("", Validators.required),
    destinationWHID: new FormControl("", Validators.required),
    batchNumber: new FormControl("", Validators.required),
    barrelNumber: new FormControl("", Validators.required),
    originPosition: new FormControl("", Validators.required),
    destinationPosition: new FormControl("", Validators.required),
    user: new FormControl("", Validators.required),
    searchBatch: new FormControl(""),
  });

  get originWH() {
    return this.bulkCheckout.get("originWH");
  }
  // get destinationPosition() {
  //   return this.bulkCheckout.get("destinationPosition");
  // }
  // get barrelNumber() {
  //   return this.bulkCheckout.get("barrelNumber");
  // }

  constructor(
    private creamBarrelService: CreamBarrelService,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private warehouseService: WarehouseService,
    private modalService: NgbModal,
    private authService: AuthService,
    private batchesService: BatchesService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getDestinationWH();
  }

  getUser() {
    this.user = this.authService.loggedInUser;
    console.log(this.user);
    let authorizations = this.user.authorization;
    if (
      authorizations.includes("updateStock") &&
      authorizations.includes("updateStock") &&
      authorizations.includes("materialStock")
    ) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }
    console.log(this.user.userName, this.authorized);
  }

  getDestinationWH() {
    this.destinationWHs = this.allWarehouses.filter(
      (wh) => wh.name == "Filling"
    );
  }
  getShelves() {
    let wh = this.bulkCheckout.controls.destinationWH.value;
    if (!wh) {
      alert("יש לבחור  מחסן יעד");
      return;
    } else {
      this.inventoryService.getShelvesByWHName(wh).subscribe((data) => {
        console.log(data);
        this.shelvesList = data;
        this.bulkCheckout.controls.destinationWHID.setValue(
          data[0].whareHouseId
        );

        console.log(this.bulkCheckout.value);
      });
    }
  }

  getBatch() {
    this.batchesList = [];
    let name = this.bulkCheckout.controls.searchBatch.value;
    if (name.length < 5) {
      alert("יש להקליד 5 אותיות ראשונות לפחות");
      return;
    } else {
      this.batchesService.getBatchBySearchName(name).subscribe((data) => {
        console.log(data);
        this.batchesList = data;
      });
    }
  }

  getBarrelsByBatch() {
    let batchNumber = this.bulkCheckout.controls.batchNumber.value;
    console.log(batchNumber);
    let warehouse = this.bulkCheckout.controls.originWH.value;
    this.creamBarrelService
      .getShelvesByBatchNumber(batchNumber, warehouse)
      .subscribe((data) => {
        console.log(data);
        this.barrelsList = data;
      });
  }

  addBarrelToList(checked, barrelNumber) {
    if (checked) {
      this.barrelsCheckout.push({ barrelNumber });
    } else {
      this.barrelsCheckout = this.barrelsCheckout.filter(
        (b) => b.barrelNumber != barrelNumber
      );
    }
    console.log(this.barrelsCheckout);
  }
  checkoutBarrels() {
    let barrels = this.barrelsCheckout;
    let wh = this.bulkCheckout.controls.destinationWHID.value;
    let position = this.bulkCheckout.controls.destinationPosition.value;
    let user = this.user.firstName + " " + this.user.lastName;
    console.log(barrels, wh, position, user);
    if (barrels.length > 0 && wh && position) {
      this.creamBarrelService
        .checkoutBarrels({ barrels, wh, position, user })
        .subscribe((data) => {
          console.log(data);
          if (!data) {
            this.toastr.error("הנתונים לא נשמרו בשרת");
          } else if (data.msg) {
            this.toastr.error(data.msg);
          } else if (data.errors.length > 0) {
            let errorsStr = "Errors: ";
            for (let msg of data.errors) {
              errorsStr += msg.msg + ", ";
            }
            alert(errorsStr);
          } else if (data.newMovements.length == barrels.length) {
            this.toastr.success("החביות הועברו בהצלחה");
          }
          this.checkoutReset();
        });
    }
  }

  checkoutReset() {
    this.bulkCheckout.reset();
    this.batchesList = [];
    this.barrelsList = [];
    this.destinationWHs = [];
    this.barrelsCheckout = [];
    this.shelvesList = [];
  }
}
