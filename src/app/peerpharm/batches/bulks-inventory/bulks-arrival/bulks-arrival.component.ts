import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { CreamBarrelService } from "src/app/services/cream-barrel.service";
import { WarehouseService } from "src/app/services/warehouse.service";
import { AuthService } from "src/app/services/auth.service";
@Component({
  selector: "app-bulks-arrival",
  templateUrl: "./bulks-arrival.component.html",
  styleUrls: ["./bulks-arrival.component.scss"],
})
export class BulksArrivalComponent implements OnInit {
  @Input("allWarehouses") allWarehouses: any[];
  @ViewChild("first") first: ElementRef;

  allArrivals: any[];
  shellNums: any[];
  disabled: boolean;
  noItem: boolean;
  sending: boolean;
  today: Date = new Date();
  allBarrels: any[] = [];
  currentWarehouse: string = "";
  user: any = null;
  authorized: boolean = false;
  barrelsList: any[] = [];
  currentBarrel = {
    barrelNumber: String,
    batchNumber: String,
    formuleNumber: String,
    productionDate: Date,
    expirationDate: Date,
    itemNumber: String,
    itemName: String,
    orderNumber: String,
    barrelWeight: 0,
    ph: String,
    barrelStatus: String,
    itemType: String,
    user: String,
  };
  bulkArrival: FormGroup = new FormGroup({
    barrelNumber: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    batchNumber: new FormControl("", Validators.minLength(8)),
    barrelWeight: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(300),
    ]),
    barrelStatus: new FormControl("", Validators.required),
    user: new FormControl(""),
    warehouse: new FormControl("", Validators.required),
    warehouseID: new FormControl(""),
    position: new FormControl(null, Validators.required),
    barcode: new FormControl(""),
    arrivalDate: new FormControl(new Date()),
  });

  get barrelNumber() {
    return this.bulkArrival.get("barrelNumber");
  }

  get barrelWeight() {
    return this.bulkArrival.get("barrelWeight");
  }
  get warehouse() {
    return this.bulkArrival.get("warehouse");
  }
  get position() {
    return this.bulkArrival.get("position");
  }

  constructor(
    private creamBarrelService: CreamBarrelService,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private warehouseService: WarehouseService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.allWarehouses);
    for (let wh of this.allWarehouses) {
      console.log(wh.name);
      console.log(wh._id);
    }
    this.getUser();
  }

  getUser() {
    this.user = this.authService.loggedInUser;
    console.log(this.user);
    let authorizations = this.user.authorization;
    if (
      authorizations.includes("updateStock") &&
      authorizations.includes("materialStock")
    ) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }
    console.log(this.user.userName, this.authorized);
  }

  showWH() {
    console.log(this.bulkArrival.controls.position.value);
    this.currentWarehouse = this.bulkArrival.controls.warehouse.value;
  }

  getBarrel() {
    console.log(this.bulkArrival.controls.barrelNumber.valid);
    console.log(this.bulkArrival.controls.barrelNumber);
    let barrelNumber = this.bulkArrival.controls.barrelNumber.valid
      ? this.bulkArrival.controls.barrelNumber.value
      : null;
    if (barrelNumber) {
      this.creamBarrelService
        .getNewBarrelByNumber(barrelNumber)
        .subscribe((data) => {
          console.log(data);
          if (data.msg) {
            if (data.msg == "Barrel not found") {
              alert("החבית לא קיימת, בדוק את המספר ונסה שוב");
            }
            this.toastr.error(data.msg);
          } else if (data) {
            this.barrelsList.push(data);
            this.currentBarrel = { ...data };
            console.log(this.barrelsList);
            console.log(this.currentBarrel);
          }
        });
    }
  }
  getShelves() {
    console.log(this.bulkArrival.value);
    console.log(this.currentBarrel.batchNumber);
    console.log(this.bulkArrival.controls.warehouse.value);

    this.creamBarrelService
      .getShelvesByBarrelNumber(
        this.bulkArrival.controls.barrelNumber.value,
        this.bulkArrival.controls.warehouse.value
      )
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          let ok = confirm("האצווה לא קיימת במחסן, בחר מיקום חדש.");
          if (ok) {
            this.getAllShellsByWarehouseName();
          }
          console.log(data.msg);
        } else if (data.length == 0) {
          confirm("החבית שהקלדת לא קיימת, האם ליצור חדשה?");
        }
        this.shellNums = data;
      });
  }

  getAllShellsByWarehouseName() {
    console.log("Get all shelves initiated");
    console.log(this.bulkArrival.controls.warehouse.value);
    this.inventoryService
      .getAllShellsByWarehouseName(this.bulkArrival.controls.warehouse.value)
      .subscribe((res) => {
        this.shellNums = res.map((shell) => {
          shell.shell_id_in_whareHouse = shell._id;
          return shell;
        });
        console.log(this.shellNums);
      });
  }
  addBarrelToList() {
    console.log(this.bulkArrival.value);
    console.log(this.currentBarrel);
    console.log(this.user.userName);
    console.log(this.user.firstName + " " + this.user.lastName);
    let wh = this.allWarehouses.find((wh) => wh.name == this.currentWarehouse);
    let arrival = {
      amount: 1,
      weightKg: this.bulkArrival.value.barrelWeight,
      user: this.user.firstName + " " + this.user.lastName,
      whareHouse: this.bulkArrival.value.warehouse,
      whareHouseID: wh._id,
      itemType: "bulk",
      position: this.bulkArrival.value.position,
      item: this.bulkArrival.value.barrelNumber,
      userName: this.user.userName,
      expirationDate: this.currentBarrel.expirationDate,
      productionDate: this.currentBarrel.productionDate,
      batchNumber: this.currentBarrel.batchNumber,
      ownerId: "1",
      ownerName: "PeerPharm",
    };
    console.log(arrival);
    this.allBarrels.push(arrival);
    this.bulkArrival.reset();
    this.bulkArrival.controls.warehouse.setValue(this.currentWarehouse);
    let props = Object.getOwnPropertyNames(this.currentBarrel);
    for (let pro of props) {
      this.currentBarrel[pro] = null;
    }
    this.currentBarrel.barrelWeight = null;
    this.bulkArrival.controls.position.reset();
  }

  removeFrombarrels(i) {
    this.allBarrels.splice(i, 1);
  }

  addBarrelToShelf() {
    for (let arrival of this.allBarrels) {
      console.log(arrival);
    }
    this.creamBarrelService
      .addBulksToStock(this.allBarrels)
      .subscribe((data) => {
        console.log(data);
        let listSize = this.allBarrels.length;

        if (data.msg) {
          this.toastr.error(data.msg);
          this.resetForm();
        } else if (data.errors.length > 0) {
          for (let error of data.errors) {
            this.toastr.error(error.msg);
          }
          this.resetForm();
        } else if (
          listSize == data.newMovements.length &&
          listSize == data.newItemShells.length &&
          data.savedWhActionlog
        ) {
          this.toastr.success("החבית/יות נקלטה/ו למלאי בהצלחה.");
          this.resetForm();
        } else if (!data) {
          this.toastr.error("הפעולה לא הצליחה, בדוק את הנתונים ונסה שנית.");
          this.resetForm();
        }
      });
  }

  resetForm() {
    this.barrelsList = [];
    this.bulkArrival.reset();
    this.allBarrels = [];
    this.bulkArrival.controls.warehouse.setValue(this.currentWarehouse);
  }

  justPrint() {}

  clearArrivals() {}
}
