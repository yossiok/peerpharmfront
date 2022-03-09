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

  bulkArrival: FormGroup = new FormGroup({
    barrelNumber: new FormControl(null),
    batchNumber: new FormControl("", Validators.required),
    fomruleNumber: new FormControl("", Validators.required),
    barrelWeight: new FormControl(null, Validators.required),
    barrelStatus: new FormControl("", Validators.required),
    orderNumbers: new FormControl([], Validators.required),
    user: new FormControl(""),
    warehouseName: new FormControl("", Validators.required),
    position: new FormControl("", Validators.required),
    barcode: new FormControl(""),
    arrivalDate: new FormControl(new Date()),
  });

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
      this.allWarehouses = whs.filter((wh) => wh.name == "Rosh HaAyin");
    });
  }
  receiveBarrel() {}

  getShelves() {}
}
