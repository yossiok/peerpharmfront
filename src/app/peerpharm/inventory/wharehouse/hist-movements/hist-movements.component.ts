import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { UsersService } from "src/app/services/users.service";
import { SuppliersService } from "src/app/services/suppliers.service";
import { WarehouseService } from "src/app/services/warehouse.service";

@Component({
  selector: "app-hist-movements",
  templateUrl: "./hist-movements.component.html",
  styleUrls: ["./hist-movements.component.scss"],
})
export class HistMovementsComponent implements OnInit {
  @Input() allWhareHouses: any[];

  movementTypes = [
    { value: "in", name: "כניסה" },
    { value: "out", name: "יציאה" },
    { value: "whareHouseChange", name: "העברה בין מחסנים" },
    { value: "shelfChange", name: "העברה בין מדפים" },
    { value: "production", name: "העברה לייצור" },
  ];
  allUsers: any = [];
  queryObj: object = {};
  histMovements: any = [];
  historicalMovements: FormGroup = new FormGroup({
    item: new FormControl(null),
    WH_originId: new FormControl(null, Validators.required),
    relatedOrderNum: new FormControl(null),
    movementType: new FormControl(""),
    fromDate: new FormControl(""),
    toDate: new FormControl(""),
    warehouseReception: new FormControl(""),
    userName: new FormControl(""),
  });

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private supplierService: SuppliersService,
    private purchaseService: Procurementservice,
    private userService: UsersService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (users) =>
        (this.allUsers = users.sort((a, b) => {
          if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1;
          else return -1;
        }))
    );
  }

  getReceptions() {
    let formValues = this.historicalMovements.controls;
    console.log(formValues);
    let queryString = "?";
    for (let item in formValues) {
      console.log("getting in");
      console.log(item);
      console.log(formValues[item].value);
      if (formValues[item].value && formValues[item].value.trim() != "") {
        this.queryObj[item] = formValues[item].value;
        queryString += `${item}=${formValues[item].value}&`;
      }
    }
    console.log(this.queryObj);
    console.log(queryString);
    queryString = queryString.slice(0, -1);
    console.log(queryString);
    this.inventoryService.getHistMovements(queryString).subscribe((data) => {
      data.forEach((element) => {
        console.log(element.userName, element.dateAndTime);
        let type;
        let wh;
        type = this.movementTypes.find((obj) => {
          console.log(obj.value);
          console.log(element.movementType);
          return obj.value == element.movementType;
        });
        element.movementName = type.name;
        element.logs.forEach((log) => {
          console.log(log.WH_originId);
          wh = this.allWhareHouses.find((obj) => {
            console.log(obj);
            return obj._id == log.WH_originId;
          });
          log.whareHouse = wh.name;
        });
      });
      console.log(data);
      this.histMovements = data;
    });
  }

  printData(move) {
    if (move.movementType == "out") {
      console.log(move);
      this.warehouseService.outCalledMethod(move);
    } else if (move.movementType == "in") {
      console.log(move);
      this.warehouseService.inCalledMethod(move);
    }
  }
}
