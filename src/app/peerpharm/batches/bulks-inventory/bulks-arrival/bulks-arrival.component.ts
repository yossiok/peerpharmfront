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
  bulkArrival: FormGroup = new FormGroup({
    barrelNumber: new FormControl(null),
    batchNumber: new FormControl("", Validators.required),
    fomruleNumber: new FormControl("", Validators.required),
    barrelWeight: new FormControl(null, Validators.required),
    barrelStatus: new FormControl("", Validators.required),
    orderNumbers: new FormControl([], Validators.required),
    user: new FormControl(""),
    warehouse: new FormControl({}, Validators.required),
    position: new FormControl("", Validators.required),
    barcode: new FormControl(""),
    arrivalDate: new FormControl(new Date()),
  });

  @Input("allWarehouses") allWarehouses: any[];
  @ViewChild("first") first: ElementRef;

  constructor(
    private creamBarrelService: CreamBarrelService,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private warehouseService: WarehouseService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.allWarehouses);
    }, 500);
  }
  showWH() {
    console.log(this.bulkArrival.controls.warehouseID);
    console.log(this.bulkArrival.controls.warehouseName.value);
  }
  getShelves() {
    console.log(this.bulkArrival.controls.barrelName);

    this.creamBarrelService
      .getShelvesByBarrelNumber(
        this.bulkArrival.controls.barrelNumber.value,
        this.bulkArrival.controls.warehouse.value.name
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
