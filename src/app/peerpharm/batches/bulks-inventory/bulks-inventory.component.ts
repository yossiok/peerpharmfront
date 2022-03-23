import { Component, OnInit, ElementRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { SuppliersService } from "src/app/services/suppliers.service";
import { WarehouseService } from "src/app/services/warehouse.service";
import { CostumersService } from "src/app/services/costumers.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-bulks-inventory",
  templateUrl: "./bulks-inventory.component.html",
  styleUrls: ["./bulks-inventory.component.scss"],
})
export class BulksInventoryComponent implements OnInit {
  user: any = {};
  allWarehouses: Array<any> = [];

  barrelArivalView: boolean = false;
  barrelCheckoutView: boolean = false;
  barrelReturnView: boolean = false;
  barrelInventoryView: boolean = false;
  expiredBarrelsView: boolean = false;
  beforeFillingView: boolean = false;

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private supplierService: SuppliersService,
    private purchaseService: Procurementservice,
    private warehouseService: WarehouseService,
    private modalService: NgbModal,
    private customersService: CostumersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllWhs();
  }

  getUser() {
    this.user = this.authService.loggedInUser;

    console.log(this.user);
  }
  getAllWhs() {
    this.inventoryService.getWhareHousesList().subscribe((whs) => {
      console.log(whs);
      let warehouses = whs.filter(
        (wh) =>
          wh.name == "Cream Barrels" ||
          wh.name == "Karantine" ||
          wh.name == "Rosh HaAyin" ||
          wh.name == "Filling"
      );

      this.allWarehouses = warehouses.filter((wh) => {
        return this.user.allowedWH.includes(wh._id);
      });

      // this.allWarehouses = whs.filter((wh) => wh.name == "Rosh HaAyin");
      this.allWarehouses.sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
      });

      console.log(this.allWarehouses);
    });
  }
  receiveBarrel() {}

  getShelves() {}

  readyBarrelArrival() {
    this.barrelArivalView = true;
    this.barrelCheckoutView = false;
    this.barrelReturnView = false;
    this.barrelInventoryView = false;
    this.expiredBarrelsView = false;
    this.beforeFillingView = false;
  }
  barrelCheckout() {
    this.barrelCheckoutView = true;
    this.barrelReturnView = false;
    this.barrelArivalView = false;
    this.barrelInventoryView = false;
    this.expiredBarrelsView = false;
    this.beforeFillingView = false;
  }
  barrelReturnArrival() {
    this.barrelReturnView = true;
    this.barrelArivalView = false;
    this.barrelCheckoutView = false;
    this.barrelInventoryView = false;
    this.expiredBarrelsView = false;
    this.beforeFillingView = false;
  }
  barrelInventory() {
    this.barrelArivalView = false;
    this.barrelCheckoutView = false;
    this.barrelReturnView = false;
    this.barrelInventoryView = true;
    this.expiredBarrelsView = false;
    this.beforeFillingView = false;
  }
  viewExpiredReport() {
    this.barrelArivalView = false;
    this.barrelCheckoutView = false;
    this.barrelReturnView = false;
    this.barrelInventoryView = false;
    this.expiredBarrelsView = true;
    this.beforeFillingView = false;
  }
  viewBeforeFillingView() {
    this.barrelArivalView = false;
    this.barrelCheckoutView = false;
    this.barrelReturnView = false;
    this.barrelInventoryView = false;
    this.expiredBarrelsView = false;
    this.beforeFillingView = true;
  }
}
