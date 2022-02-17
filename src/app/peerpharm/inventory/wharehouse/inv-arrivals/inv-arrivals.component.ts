import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
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
  selector: "app-inv-arrivals",
  templateUrl: "./inv-arrivals.component.html",
  styleUrls: ["./inv-arrivals.component.scss"],
})
export class InvArrivalsComponent implements OnInit {
  @ViewChild("nameSelect") nameSelect: ElementRef;
  @ViewChild("printBtn2") printBtn2: ElementRef;
  @ViewChild("first") first: ElementRef;
  @ViewChild("invstck") invstck: ElementRef;
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
  showStickerForm: boolean = false;
  customersList: any[];

  componentArrival: FormGroup = new FormGroup({
    itemType: new FormControl("component", Validators.required),
    item: new FormControl(null, Validators.required),
    itemName: new FormControl(""),
    amount: new FormControl(null, Validators.min(0.001)),
    shell_id_in_whareHouse: new FormControl(null, Validators.required),
    position: new FormControl(""),
    whareHouseID: new FormControl(null, Validators.required),
    whareHouse: new FormControl(""),
    isNewItemShell: new FormControl(false, Validators.required),
    supplier: new FormControl(""),
    purchaseOrder: new FormControl(null),
    ownerId: new FormControl(""),
    user: new FormControl(""),
  });
  stickerItem: any;

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
    setTimeout(() => {
      this.first.nativeElement.focus();
      console.log(this.allWhareHouses);
    }, 500);
    if (this.itemNumber) {
      this.disabled = true;
      this.componentArrival.controls.item.setValue(this.itemNumber);
    }
    this.checkOwnerShip();
    this.getSuppliers();
    this.getHistoricalReceptions();
    this.getCustomers();
  }

  getCustomers() {
    this.customersService.getAllCostumers().subscribe((customers) => {
      if (customers.msg) {
        this.toastr.error(customers.msg);
        console.log(customers.msg);
      } else if (customers) {
        this.customersList = customers;
        console.log(customers);
      } else if (!customers) {
        this.toastr.error("רשימת בספקים לא הועלתה");
        console.log("Customers list wasn't retrieved from the data base");
      }
    });
  }

  getHistoricalReceptions() {
    this.warehouseService.inPrintCalled$.subscribe((data) => {
      this.certificateReception = data.logs[0].warehouseReception;
      this.today = data.dateAndTime;
      data.logs.forEach((element) => {
        element.position = element.shell_position_in_whareHouse_Origin;
      });
      this.allArrivals = data.logs;

      setTimeout(() => {
        this.printBtn2.nativeElement.click();
        this.componentArrival.reset();
        this.allArrivals = [];
      }, 500);
    });
  }

  open(modal) {
    this.modalService.open(modal);
  }

  setStickerDetails(item) {
    this.stickerItem = { ...item };
  }

  loadStickerComponent() {
    this.invstck.nativeElement.ngOnInit();
  }

  getSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((data) => {
      console.log(data);
      this.allSuppliers = data;
      console.log(this.allSuppliers);
    });
  }

  getPurchaseOrders(e) {
    console.log(e.target.value);
    this.purchaseOrders = [];
    this.purchaseService
      .getAllOrdersFromSupplier(e.target.value)
      .subscribe((data) => {
        if (data.length > 0) {
          let filtered = data.filter(
            (order) => order.status != "closed" && order.status != "canceled"
          );
          for (let po of filtered) {
            let idx = po.stockitems.findIndex(
              (si) => si.number == this.componentArrival.value.item
            );
            if (idx > -1) {
              this.purchaseOrders.push(po);
            }
          }
        }
      });
  }

  // if

  //         this.purchaseOrders = data
  //           .filter((PO) => PO.status != "closed" && PO.status != "canceled")
  //           .filter((PO) => {
  //             for (let si of PO.stockitems) {
  //               if (si.number == this.componentArrival.value.item) return true;
  //               else return false;
  //             }
  //           });
  //       });
  //   }

  async checkComponentN() {
    return new Promise((resolve, reject) => {
      this.inventoryService
        .getCmptByitemNumber(this.componentArrival.value.item)
        .subscribe((data) => {
          if (data.length > 0) {
            if (data[0].itemType == "material") {
              reject("לא ניתן להכניס חומרי גלם דרך טופס זה");
              return;
            }
            this.noItem = false;
            this.itemNames = data;
            resolve(data);
          } else {
            this.noItem = true;
            reject("פריט לא קיים :(");
          }
        });
    });
  }

  checkOwnerShip() {
    this.componentArrival
      .get("ownerId")
      .valueChanges.subscribe((selectedValue) => {
        console.log(selectedValue);

        if (selectedValue != "" && selectedValue != "0001") {
          let shellArr = this.shellNums.filter(
            (sn) => sn.position == "CUSTOMER"
          );
          this.shellNums = [
            { position: "CUSTOMER", shell_id_in_whareHouse: "CU-001" },
          ];
        }
      });
  }

  getShelfs() {
    console.log("Get Shelf initiated");
    if (
      this.componentArrival.value.whareHouseID == "5c31bb6f91ca6b2510349ce9"
    ) {
      this.componentArrival.controls.itemType.setValue("product");
    }

    this.checkComponentN()
      .then((result) => {
        // console.log(result);
        this.componentArrival.controls.itemName.setValue(
          result[0].componentName
        );
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
              console.log(res);
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
        this.toastr.error("", e);
      });
  }

  getAllShellsOfWhareHouse() {
    console.log("Get all shelves initiated");
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
  getNames() {
    let inputName = this.componentArrival.controls.itemName.value;
    if (inputName.length > 2) {
      this.inventoryService.getNamesByRegex(inputName).subscribe((names) => {
        console.log(names);
        this.itemNames = names;
        this.componentArrival.controls.item.setValue(names[0].componentN);
        this.componentArrival.controls.itemName.setValue(
          names[0].componentName
        );
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
    this.componentArrival.controls.user.setValue(
      this.authService.loggedInUser.userName
    );
    console.log(this.componentArrival.value.user);
    this.componentArrival.controls.whareHouse.setValue(whareHouse.name);
    let shellDoc = this.shellNums.find(
      (shell) =>
        shell.shell_id_in_whareHouse ==
        this.componentArrival.value.shell_id_in_whareHouse
    );
    this.componentArrival.controls.position.setValue(shellDoc.position);

    //push arrival to allArrivals
    // convert item from number to string
    let itemToPush = { ...this.componentArrival.value };
    itemToPush.item = "" + itemToPush.item;
    this.allArrivals.push(this.componentArrival.value);
    // this.allArrivals.push(itemToPush);
    //22/08/2021 Dani Morag:
    // reset the fields of the add component arrival except for the supplier and warehouse. Further to the request of Tomer
    this.componentArrival.get("itemType").reset();
    this.componentArrival.get("item").reset();
    this.componentArrival.get("amount").reset();
    this.componentArrival.get("shell_id_in_whareHouse").reset();
    this.componentArrival.get("position").reset();
    this.componentArrival.get("isNewItemShell").reset();
    this.componentArrival.get("supplier").reset();
    this.componentArrival.get("purchaseOrder").reset();
    this.shellNums = [];

    this.componentArrival.controls.isNewItemShell.setValue(false);
    this.componentArrival.controls.itemType.setValue("component");
    this.first.nativeElement.focus();
  }

  addToStock() {
    console.log(this.allArrivals);
    console.log(this.authService.loggedInUser.userName);

    this.sending = true;
    setTimeout(() => (this.sending = false), 7000); //if something goes wrong
    this.inventoryService
      .addComponentsToStock(this.allArrivals)
      .subscribe((data) => {
        console.log(data);

        if (data) {
          console.log(data);
          //set certificate data
          this.certificateReception = data.savedMovement[0].warehouseReception;
          // for (let arrival of this.allArrivals) {
          //   arrival.suplierN = data.allResults.find(
          //     (a) => a.item == arrival.item
          //   ).suplierN;
          //   arrival.itemName = data.allResults.find(
          //     (a) => a.item == arrival.item
          //   ).componentName;
          // }

          if (data.msg.length > 0) {
            for (let message of data.msg) {
              this.toastr.error(message);
            }
          }
          if (data.warning.length > 0) {
            for (let warning of data.warning) this.toastr.warning(warning);
          }

          if (data.msg.length == 0 && data.warning.length == 0) {
            this.toastr.success("נשמר", "הנתונים נשלמרו בהצלחה");
          }
          this.sending = false;
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
        } else {
          this.toastr.error("לא נוצר קשר עם השרת, הפעולה לא הצליחה");
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

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
