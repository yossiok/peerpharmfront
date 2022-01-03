import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
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
export class HistMovementsComponent implements OnInit, OnChanges {
  @Input() allWhareHouses: any[];
  @Output() initTabByName = new EventEmitter<any>();

  historicalMovements: FormGroup = new FormGroup({
    item: new FormControl(null),
    WH_originId: new FormControl(null),
    relatedOrderNum: new FormControl(null),
    movementType: new FormControl(""),
    fromDate: new FormControl("", Validators.required),
    toDate: new FormControl(""),
    warehouseReception: new FormControl(""),
    userName: new FormControl(""),
  });
  queryObj: object = {};
  movementTypes = [
    { value: "in", name: "כניסה" },
    { value: "out", name: "יציאה" },
    { value: "whareHouseChange", name: "העברה בין מחסנים" },
    // { value: "shelfChange", name: "העברה בין מדפים" },
    // { value: "production", name: "העברה לייצור" },
  ];
  allUsers: any = [];
  histMovements: any = [];
  fetching: boolean = false

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
    console.log(this.historicalMovements.controls);
  }

  consoleForm(){
    console.log(this.historicalMovements)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.allWhareHouses = changes.allWhareHouses.currentValue;
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
    this.fetching = true
    // build the query
    let formValues = this.historicalMovements.controls;
    this.histMovements = [];
    let queryString = "?";
    for (let item in formValues) {
      if (formValues[item].value && formValues[item].value.trim() != "") {
        this.queryObj[item] = formValues[item].value;
        queryString += `${item}=${formValues[item].value}&`;
      }
    }

    queryString = queryString.slice(0, -1);
    this.inventoryService.getHistMovements(queryString).subscribe((data) => {
      console.log(data);

      // check if the recption belongs to wh authorized for this user, and the movement type is one of the three: in, out or between wh
      data.forEach((element) => {
        if (!element.itemType) {
          let type;
          let wh;

          type = this.movementTypes.find((obj) => {
            return obj.value == element.movementType;
          });
          element.movementName = type ? type.name : "NA";
          element.logs.forEach((log) => {
            wh = this.allWhareHouses.find((obj) => {
              return obj._id == log.WH_originId;
            });
            log.whareHouse = wh ? wh.name : '';
          });
        }
      });
      this.histMovements = data.filter((e) => !e.itemType);
      this.fetching = false
    });
  }

  printData(move) {
    this.initTabByName.emit(move.movementType);

    setTimeout(() => {
      if (move.movementType == "out") {
        this.warehouseService.outCalledMethod(move);
      } else if (move.movementType == "in") {
        this.warehouseService.inCalledMethod(move);
      } else if (move.movementType == "whareHouseChange") {
        this.warehouseService.moveWHCalledMethod(move);
      }
      this.historicalMovements.reset();
    }, 500);
  }

  resetTable() {
    this.historicalMovements.reset();
    this.histMovements = [];
  }
}
