import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { SuppliersService } from "src/app/services/suppliers.service";
import { WarehouseService } from "src/app/services/warehouse.service";

@Component({
  selector: "app-inv-arrivals",
  templateUrl: "./inv-arrivals.component.html",
  styleUrls: ["./inv-arrivals.component.scss"],
})
export class InvArrivalsComponent implements OnInit {
  @ViewChild("nameSelect") nameSelect: ElementRef;
  @ViewChild("printBtn2") printBtn2: ElementRef;
  @ViewChild("first") first: ElementRef;
  @Input() allWhareHouses: any[];
  @Input() reallyAllWhareHouses: any[];
  @Input() itemNumber: number;

  itemNames: any[];
  shellNums: any[];
  allSuppliers: any[];
  purchaseOrders: any[];
  certificateReception: number;
  allArrivals: any[] = [];
  today = new Date();
  pallets: number;
  amountPerPallet: number;
  sending: boolean = false;
  disabled: boolean = false;
  noItem: boolean = true;
  printSticker: boolean = false;

  componentArrival: FormGroup = new FormGroup({
    itemType: new FormControl("component", Validators.required),
    item: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    shell_id_in_whareHouse: new FormControl(null, Validators.required),
    position: new FormControl(""),
    whareHouseID: new FormControl(null, Validators.required),
    whareHouse: new FormControl(""),
    isNewItemShell: new FormControl(false, Validators.required),
    supplier: new FormControl(""),
    purchaseOrder: new FormControl(null),
  });

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private supplierService: SuppliersService,
    private purchaseService: Procurementservice,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.first.nativeElement.focus(), 500);
    if (this.itemNumber) {
      this.disabled = true;
      this.componentArrival.controls.item.setValue(this.itemNumber);
    }
    this.getSuppliers();
    this.warehouseService.inPrintCalled$.subscribe((data) => {
      console.log(data);
      this.certificateReception = data.logs[0].warehouseReception;
      console.log(this.certificateReception);
      this.today = data.dateAndTime;
      data.logs.forEach((element) => {
        element.position = element.shell_position_in_whareHouse_Origin;
        console.log(element);
      });
      this.allArrivals = data.logs;

      setTimeout(() => {
        this.printBtn2.nativeElement.click();
      }, 500);
    });
  }

  getSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((data) => {
      this.allSuppliers = data;
    });
  }

  getPurchaseOrders(e) {
    this.purchaseService
      .getAllOrdersFromSupplier(e.target.value)
      .subscribe((data) => {
        this.purchaseOrders = data
          .filter((PO) => PO.status != "closed" && PO.status != "canceled")
          .filter((PO) => {
            for (let si of PO.stockitems) {
              if (si.number == this.componentArrival.value.item) return true;
              else return false;
            }
          });
      });
  }

  async checkComponentN() {
    return new Promise((resolve, reject) => {
      this.inventoryService
        .getCmptByNumber(
          this.componentArrival.value.item,
          this.componentArrival.value.itemType
        )
        .subscribe((data) => {
          if (data.length > 0) {
            this.noItem = false;
            resolve(true);
          } else {
            this.noItem = true;
            reject(false);
          }
        });
    });
  }

  getShelfs() {
    if (
      this.componentArrival.value.whareHouseID == "5c31bb6f91ca6b2510349ce9"
    ) {
      this.componentArrival.controls.itemType.setValue("product");
    }

    this.checkComponentN()
      .then((result) => {
        if (!this.componentArrival.value.whareHouseID)
          this.toastr.error("אנא בחר מחסן.");
        else if (!this.componentArrival.value.item)
          this.toastr.error("אנא הזן מספר פריט.");
        else
          this.inventoryService
            .getShelfListForItemInWhareHouse2(
              this.componentArrival.value.item,
              this.componentArrival.value.whareHouseID
            )
            .subscribe((res) => {
              if (res.msg) this.toastr.error("בעיה בהזנת הנתונים.");
              else if (res.length == 0) {
                let noShellsForItem = confirm(
                  "הפריט לא נמצא על אף אחד מהמדפים במחסן זה. להכניס למדף חדש?"
                );
                if (noShellsForItem) {
                  this.componentArrival.controls.isNewItemShell.setValue(true);
                  this.getAllShellsOfWhareHouse();
                }
              } else {
                this.shellNums = res;
                //stupid bug:
                this.componentArrival.controls.shell_id_in_whareHouse.setValue(
                  this.shellNums[0].shell_id_in_whareHouse
                );
              }
            });
      })
      .catch((e) => {
        this.toastr.error("", "פריט לא קיים :(");
      });
  }

  getAllShellsOfWhareHouse() {
    this.componentArrival.controls.isNewItemShell.setValue(true);
    this.inventoryService
      .getWhareHouseShelfList(this.componentArrival.value.whareHouseID)
      .subscribe((res) => {
        this.shellNums = res.map((shell) => {
          shell.shell_id_in_whareHouse = shell._id;
          return shell;
        });
        //stupid bug:
        this.componentArrival.controls.shell_id_in_whareHouse.setValue(
          this.shellNums[0].shell_id_in_whareHouse
        );
      });
  }

  // Get names of all items for search
  getNames(event) {
    if (event.value.length > 2) {
      this.inventoryService.getNamesByRegex(event.value).subscribe((names) => {
        this.itemNames = names;
        this.componentArrival.controls.item.setValue(names[0].componentN);
      });
    }
  }

  setItemDetailsNumber(event) {
    this.componentArrival.controls.item.setValue(event.target.value);
  }

  addToArrivals() {
    // set whareHouse name and shelf position
    let whareHouse = this.allWhareHouses.find(
      (wh) => wh._id == this.componentArrival.value.whareHouseID
    );
    this.componentArrival.controls.whareHouse.setValue(whareHouse.name);
    let shellDoc = this.shellNums.find(
      (shell) =>
        shell.shell_id_in_whareHouse ==
        this.componentArrival.value.shell_id_in_whareHouse
    );
    this.componentArrival.controls.position.setValue(shellDoc.position);
    //push arrival to allArrivals
    this.allArrivals.push(this.componentArrival.value);
    //22/08/2021 Dani Morag:
    // reset the fields of the add component arrival except for the spplier and warehouse. Further to the request of Tomer
    this.componentArrival.get("itemType").reset();
    this.componentArrival.get("item").reset();
    this.componentArrival.get("amount").reset();
    this.componentArrival.get("shell_id_in_whareHouse").reset();
    this.componentArrival.get("position").reset();
    this.componentArrival.get("isNewItemShell").reset();

    this.componentArrival.controls.isNewItemShell.setValue(false);
    this.componentArrival.controls.itemType.setValue("component");
    this.first.nativeElement.focus();
  }

  addToStock() {
    this.sending = true;
    setTimeout(() => (this.sending = false), 7000); //if something goes wrong
    this.inventoryService
      .addComponentsToStock(this.allArrivals)
      .subscribe((data) => {
        if (data.msg) this.toastr.error(data.msg, "שגיאה");
        else {
          //set certificate data
          this.certificateReception =
            data.allResults[0].savedMovement.warehouseReception;
          for (let arrival of this.allArrivals) {
            arrival.suplierN = data.allResults.find(
              (a) => a.item == arrival.item
            ).suplierN;
            arrival.itemName = data.allResults.find(
              (a) => a.item == arrival.item
            ).componentName;
          }
          this.sending = false;
          this.toastr.success("שינויים נשמרו בהצלחה", "נשמר");
          this.componentArrival.reset();
          this.componentArrival.controls.isNewItemShell.setValue(false);
          this.componentArrival.controls.itemType.setValue("component");
          setTimeout(() => {
            // if (confirm('להדפיס מדבקות?')) this.printSticker = true
            this.printBtn2.nativeElement.click();
            setTimeout(() => {
              this.allArrivals = [];
              // this.printSticker = false
            }, 1000);
          }, 500);
        }
      });
  }

  removeFromArrivals(i) {
    this.allArrivals.splice(i, 1);
  }

  justPrint() {
    setTimeout(() => {
      this.printBtn2.nativeElement.click();
    }, 500);
  }

  clearArrivals() {
    this.allArrivals = [];
  }
}