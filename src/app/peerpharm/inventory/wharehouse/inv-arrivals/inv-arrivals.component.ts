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
import { OrdersService } from "src/app/services/orders.service";

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
  supplierView: boolean = false;
  warehouseView: boolean = false;
  customerView: boolean = false;
  customerSupplyView: boolean = false;
  chosenPO: any = null;
  whActionLogs: any[] = [];
  chosenActionLog: any;
  customerOrders: any[] = [];
  chosenOrder: any[] = [];

  componentArrival: FormGroup = new FormGroup({
    itemType: new FormControl("component", Validators.required),
    item: new FormControl(null, Validators.required),
    itemName: new FormControl(""),
    amount: new FormControl(null, [Validators.min(0.001), Validators.required]),
    shell_id_in_whareHouse: new FormControl(null, Validators.required),
    position: new FormControl(""),
    whareHouseID: new FormControl(null, Validators.required),
    whareHouse: new FormControl(""),
    isNewItemShell: new FormControl(false, Validators.required),
    supplier: new FormControl(""),
    purchaseOrder: new FormControl(null),
    ownerId: new FormControl(""),
    user: new FormControl(""),
    sourceType: new FormControl(""),
    inList: new FormControl(false),
    sourceWhId: new FormControl(""),
    sourceWhName: new FormControl(""),
    sourceWhCertificateId: new FormControl(""),
    shell_id_in_whareHouse_Origin: new FormControl(""),
    shell_position_in_whareHouse_Origin: new FormControl(""),
    itemId: new FormControl(""),
    customerId: new FormControl(""),
    customerName: new FormControl(""),
    customerOrder: new FormControl(""),
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
    private authService: AuthService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.first.nativeElement.focus();
      console.log(this.allWhareHouses);
    }, 500);
    if (this.itemNumber) {
      // this.disabled = true;
      this.componentArrival.controls.item.setValue(this.itemNumber);
    }
    // this.checkOwnerShip();
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

  getPurchaseOrders() {
    let supplierId = this.componentArrival.value.supplier;
    if (!supplierId || isNaN(supplierId)) {
      alert("יש לבחור ספק מתוך הרשימה");
      return;
    }
    this.purchaseOrders = [];
    this.chosenPO = null;
    this.componentArrival.controls.item.reset();
    this.componentArrival.controls.itemName.reset();
    this.componentArrival.controls.position.reset();
    this.componentArrival.controls.amount.reset();
    this.shellNums = [];
    this.itemNames = [];
    this.purchaseService
      .getOpenOrdersFromSupplier(supplierId)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          alert("לא נמצא ספק מתאים לערך שנבחר");
          return;
        } else if (data && data.length > 0) {
          this.purchaseOrders = data;
        } else if (data && data.length == 0) {
          alert("לא נמצאו הזמנות רכש פתוחות לספק שנבחר");
          return;
        }
      });
  }

  async checkComponentN() {
    return new Promise((resolve, reject) => {
      this.inventoryService
        .getCmptByitemNumber(this.componentArrival.value.item)
        .subscribe((data) => {
          if (data.length > 0) {
            // if (data[0].itemType == "material") {
            //   reject("לא ניתן להכניס חומרי גלם דרך טופס זה");
            //   return;
            // }
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
    // The origin plan was to have a special shlef for customer owned
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

  getWhName() {
    let whId = this.componentArrival.value.whareHouseID;
    if (!whId) {
      return;
    }
    this.allWhareHouses.forEach((wh) => {
      wh.inList = false;
      wh.color = "#fff";
    });

    let wh = this.allWhareHouses.find((wh) => wh._id == whId);

    if (wh) {
      this.componentArrival.controls.whareHouse.setValue(wh.name);
      wh.inList = true;
      wh.color = "#e8e5e5";
    }

    this.resetValues();
  }

  getShelfs() {
    if (
      (!this.componentArrival.value.item ||
        this.componentArrival.value.item.length) < 2 &&
      !this.componentArrival.value.itemId
    ) {
      return;
    }
    if (this.componentArrival.value.sourceType == "warehouse") {
      console.log(this.componentArrival.value.itemId);
      let itemId = this.componentArrival.value.itemId;
      let item;
      if (itemId) {
        item = this.chosenActionLog.logs.find((log) => log._id == itemId);
      } else {
        item = this.chosenActionLog.logs.find(
          (log) => log.item == this.componentArrival.value.item
        );
      }
      this.componentArrival.controls.item.setValue(item.item);
    }
    if (this.componentArrival.value.sourceType == "customer") {
      let itemNumber = this.componentArrival.value.item;
      let item;
      if (itemNumber) {
        item = this.chosenOrder.find((co) => co.itemNumber == itemNumber);
        this.componentArrival.controls.itemName.setValue(item.discription);
      }
      if (
        this.componentArrival.value.whareHouseID == "5c31bb6f91ca6b2510349ce9"
      ) {
        this.componentArrival.controls.itemType.setValue("product");
      } else this.componentArrival.controls.itemType.setValue("component");
    }
    if (this.componentArrival.value.sourceType == "supplier") {
      let itemNumber = this.componentArrival.value.item;
      let item;
      if (itemNumber) {
        item = this.chosenPO.stockitems.find((cp) => cp.number == itemNumber);
        this.componentArrival.controls.itemName.setValue(item.name);
      }
      this.componentArrival.controls.itemType.setValue(this.chosenPO.orderType);
    }

    //     if(this.componentArrival.value.sourceType=="customerSupply"){
    // this.componentArrival.controls.itemType.setValue("component")

    //     }

    console.log("Get Shelf initiated");
    if (
      this.componentArrival.value.whareHouseID == "5c31bb6f91ca6b2510349ce9"
    ) {
      this.componentArrival.controls.itemType.setValue("product");
    }

    if (this.componentArrival.value.itemName) {
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
            this.componentArrival.controls.isNewItemShell.setValue(false);
          }
        });
      return;
    } else {
      this.checkComponentN()
        .then((result) => {
          // console.log(result);
          this.componentArrival.controls.itemName.setValue(
            result[0].componentName
          );
          this.componentArrival.controls.itemType.setValue(result[0].itemType);
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
                    this.componentArrival.controls.isNewItemShell.setValue(
                      true
                    );
                    this.getAllShellsOfWhareHouse();
                  }
                } else {
                  this.shellNums = res;
                  //stupid bug:
                  this.componentArrival.controls.shell_id_in_whareHouse.setValue(
                    this.shellNums[0].shell_id_in_whareHouse
                  );
                  this.componentArrival.controls.isNewItemShell.setValue(false);
                }
              });
        })
        .catch((e) => {
          this.toastr.error("", e);
        });
    }
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
    try {
      let item;
      //check amount versus the ordered amount leftover
      if (this.componentArrival.controls.sourceType.value == "supplier") {
        item = this.chosenPO.stockitems.find(
          (po) => po.number == this.componentArrival.controls.item.value
        );
        if (!item) {
          if (!confirm("הפריט לא נמצא בהזמנה האם לקלוט למחסן?")) return;
        }
        if (
          this.componentArrival.controls.amount.value >
          item.quantity * 1.2 - item.arrivedAmount
        ) {
          alert(
            "הכמות שאתה קולט למחסן גדולה מהכמות שנשארה לאספקה בהזמנה. צור קשר עם הקניינית על מנת לעדכן את ההזמנה."
          );

          return;
        }
        item.inList = true;
        item.color = "#e8e5e5";
        console.log(this.chosenPO);
      }

      if (this.componentArrival.value.sourceType == "warehouse") {
        // check if the  quantity arrived against the delivery note.
        item = this.chosenActionLog.logs.find(
          (log) => log._id == this.componentArrival.value.itemId
        );

        if (!item) {
          alert(
            "הפריט לא נמצא בתעודת יציאה מהמחסן, יש יצור תעודה ממחסן המקור."
          );
          return;
        }

        if (this.componentArrival.value.amount != item.amount) {
          alert("הכמות שהוכנסה לא תואמת לכמות שנשלחה, יש לתקן כמות.");
          return;
        }
        item.inList = true;
        item.color = "#e8e5e5";
        this.componentArrival.controls.shell_id_in_whareHouse_Origin.setValue(
          item.shell_id_in_whareHouse_Origin
        );
        this.componentArrival.controls.shell_position_in_whareHouse_Origin.setValue(
          item.shell_position_in_whareHouse_Origin
        );
      }
      if (this.componentArrival.controls.sourceType.value == "customer") {
        item = this.chosenOrder.find(
          (order) =>
            order.itemNumber == this.componentArrival.controls.item.value
        );
        if (!item) {
          if (!confirm("הפריט לא נמצא בהזמנה האם לקלוט למחסן?")) return;
        }
        if (
          this.componentArrival.controls.amount.value >
          item.quantityProduced * 1.1 - item.arrivedAmount
        ) {
          if (
            !confirm("הכמות שאתה קולט למחסן גדולה מהכמות שסופקה. האם להמשיך?")
          )
            return;
        }
        item.inList = true;
        item.color = "#e8e5e5";
        console.log(this.chosenPO);
      }

      // let idx = this.chosenPO.stockitems.findIndex(
      //   (si) => si.number == this.componentArrival.value.item
      // );

      // if (
      //   this.componentArrival.value.amount >
      //   this.chosenPO.stockitems[idx].leftOver +
      //     this.chosenPO.stockitems[idx].quantity * 0.1
      // ) {
      //   alert(
      //     "הכמות שהוכנסה גדולה מהיתרה להספקה. יש לתקן כמות או לעדכן הזמנת רכש"
      //   );
      //   this.componentArrival.controls.amount.setValue(null);
      //   return;
      // }

      // let item = this.componentArrival.value.item;
      // let idx = this.allArrivals.findIndex((line) => line.item == item);
      // if (idx > -1) {
      //   alert("הפריט הוכנס כבר לרשימת הפריטים שהתקבלו");

      //   this.componentArrival.controls.item.reset();
      //   return;
      // }

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

      console.log(this.allArrivals);

      // mark the chosen component in case it is from PO

      // this.chosenPO.stockitems[idx].inList = true;
      // this.chosenPO.stockitems[idx].color = "#d8d8d0";
      // console.log(this.chosenPO.stockitems[idx]);

      // this.allArrivals.push(itemToPush);
      //22/08/2021 Dani Morag:
      // reset the fields of the add component arrival except for the supplier and warehouse. Further to the request of Tomer
      this.componentArrival.get("itemType").reset();
      this.componentArrival.get("item").reset();
      this.componentArrival.get("itemName").reset();
      this.componentArrival.get("amount").reset();
      this.componentArrival.get("shell_id_in_whareHouse").reset();
      this.componentArrival.get("position").reset();
      this.componentArrival.get("isNewItemShell").reset();

      // this.componentArrival.get("supplier").reset();
      // this.componentArrival.get("purchaseOrder").reset();
      this.shellNums = [];
      this.itemNames = [];

      this.componentArrival.controls.isNewItemShell.setValue(false);
      console.log(this.allArrivals);
      this.first.nativeElement.focus();
    } catch (error) {
      console.log(error.message);
      this.toastr.error(error.message);
    }
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
          console.log(this.certificateReception);
          if (data.msg.length > 0) {
            for (let message of data.msg) {
              this.toastr.error(message);
            }
          }
          if (data.warning.length > 0) {
            for (let warning of data.warning) this.toastr.warning(warning);
          }

          if (data.msg.length == 0 && data.warning.length == 0) {
            this.toastr.success("נשמר", "הנתונים נשמרו בהצלחה");
          }
          this.sending = false;
          // this.componentArrival.controls.itemType.setValue("component");
          setTimeout(() => {
            // if (confirm('להדפיס מדבקות?')) this.printSticker = true
            this.printBtn2.nativeElement.click();
            setTimeout(() => {
              this.allArrivals = [];
              this.itemNames = [];
              // this.printSticker = false
              this.componentArrival.reset();
              this.chosenPO = null;
              this.shellNums = [];
              this.componentArrival.controls.isNewItemShell.setValue(false);
              this.purchaseOrders = [];
              this.supplierView = false;
              this.chosenActionLog = null;
            }, 1000);
          }, 500);
        } else {
          this.toastr.error("לא נוצר קשר עם השרת, הפעולה לא הצליחה");
        }
      });
  }

  removeFromArrivals(i) {
    let itemNumber = this.allArrivals[i].item;
    let item;
    let sourceType = this.componentArrival.value.sourceType;
    if (sourceType == "supplier") {
      let idx = this.chosenPO.stockitems.findIndex(
        (si) => si.number == itemNumber
      );
      this.chosenPO.stockitems[idx].inList = false;
      this.chosenPO.stockitems[idx].color = "#fff";
      this.allArrivals.splice(i, 1);
    } else if (sourceType == "warehouse") {
      let itemId = this.allArrivals[i].itemId;

      if (itemId) {
        item = this.chosenActionLog.logs.find((log) => log._id == itemId);
      } else {
        item = this.chosenActionLog.logs.find((log) => log.item == itemNumber);
      }
      item.inList = false;
      item.color = "#fff";
      this.allArrivals.splice(i, 1);
    } else if (sourceType == "customer") {
      item = this.chosenOrder.find((order) => order.itemNumber == itemNumber);
      item.inList = false;
      item.color = "#fff";
      this.allArrivals.splice(i, 1);
    } else {
      this.allArrivals.splice(i, 1);
    }
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

  chooseSource() {
    let source = this.componentArrival.value.sourceType;
    console.log(source);
    this.resetValues();
    if (source == "supplier") {
      this.supplierView = true;
      this.warehouseView = false;
      this.customerView = false;
      this.customerSupplyView = false;
    } else if (source == "warehouse") {
      this.warehouseView = true;
      this.supplierView = false;
      this.customerView = false;
      this.customerSupplyView = false;
    } else if (source == "customer") {
      this.warehouseView = false;
      this.supplierView = false;
      this.customerView = true;
      this.customerSupplyView = false;
    } else if (source == "customerSupply") {
      this.customerSupplyView = true;
      this.supplierView = false;
      this.warehouseView = false;
      this.customerView = false;
    }
  }

  choosePO() {
    this.chosenPO = null;
    let poNumber = this.componentArrival.value.purchaseOrder;
    console.log(poNumber);
    this.chosenPO = this.purchaseOrders.find(
      (po) => po.orderNumber == poNumber
    );

    if (this.chosenPO.stockitems && this.chosenPO.stockitems.length > 0) {
      this.chosenPO.stockitems.forEach((si) => {
        si.quantity = si.quantity ? Number(si.quantity) : 0;
        si.arrivedAmount = si.arrivedAmount ? Number(si.arrivedAmount) : 0;
        si.leftOver =
          si.quantity - si.arrivedAmount < 0
            ? 0
            : si.quantity - si.arrivedAmount;
        si.inList = false;
        si.color = "#fff";
      });
    }
  }

  resetValues() {
    let whareHouseID = this.componentArrival.value.whareHouseID;
    let whareHouse = this.componentArrival.value.whareHouse;
    let sourceType = this.componentArrival.value.sourceType;
    this.purchaseOrders = [];
    this.chosenPO = null;
    this.shellNums = [];
    this.itemNames = [];
    this.allArrivals = [];
    this.whActionLogs = [];
    this.chosenActionLog = null;
    this.chosenOrder = [];
    this.componentArrival.reset();
    this.componentArrival.controls.whareHouseID.setValue(whareHouseID);
    this.componentArrival.controls.whareHouse.setValue(whareHouse);
    this.componentArrival.controls.sourceType.setValue(sourceType);
    // this.componentArrival.get("itemType").reset();
    // this.componentArrival.get("item").reset();
    // this.componentArrival.get("itemName").reset();
    // this.componentArrival.get("amount").reset();
    // this.componentArrival.get("shell_id_in_whareHouse").reset();
    // this.componentArrival.get("position").reset();
    // this.componentArrival.get("supplier").reset();
    // this.componentArrival.get("purchaseOrder").reset();
    // this.componentArrival.controls.isNewItemShell.setValue(false);
    // this.componentArrival.get("customerId").reset();
    // this.componentArrival.get("customerName").reset();
    // this.componentArrival.get("customerOrder").reset();
  }

  getWhActionLogs() {
    if (!this.componentArrival.controls.sourceWhId.value) {
      alert("יש לבחור מחסן מקור");
      return;
    }
    let idx = this.allWhareHouses.findIndex(
      (wh) => wh._id == this.componentArrival.controls.sourceWhId.value
    );
    let sourceWhName = this.allWhareHouses[idx].name;
    let destWhName = this.componentArrival.value.whareHouse;

    if (sourceWhName && destWhName && sourceWhName != destWhName) {
      this.componentArrival.controls.sourceWhName.setValue(sourceWhName);
    } else {
      alert("יש לבחור מחסן יעד ומחסן מקור");
      return;
    }

    this.inventoryService
      .getWhActionLogsByWhName(sourceWhName, destWhName)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          return;
        } else if (data.length > 0) {
          this.whActionLogs = data;
          return;
        } else {
          this.toastr.error("לא נמצאו תעודות יציאה למחסן זה");
          this.whActionLogs = [];
          return;
        }
      });
  }

  setSourceDeliveryNote() {
    let deliveryNote = this.componentArrival.value.sourceWhCertificateId;
    if (deliveryNote) {
      let idx = this.whActionLogs.findIndex(
        (al) => al.deliveryNote == deliveryNote
      );
      if (idx > -1) {
        for (let item of this.whActionLogs[idx].logs) {
          if (item.deliveryStatus == "delivered") {
            item.inList = true;
            item.color = "#e8e5e5";
          }
        }
        this.chosenActionLog = this.whActionLogs[idx];
      }
    }
  }

  getOrderNumber() {
    let customerId = this.componentArrival.value.customerId;
    console.log(customerId);
    let customer = this.customersList.find(
      (cus) => cus.costumerId == customerId
    );
    this.componentArrival.controls.customerName.setValue(customer.costumerName);
    console.log(this.componentArrival.value.customerName);

    if (customerId) {
      this.ordersService.getOrdersByCustomerId(customerId).subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          return;
        } else if (data && data.length > 0) {
          this.customerOrders = data;
          return;
        } else {
          alert("לא נמצאו הזמנות מלקוח זה.");
          return;
        }
      });
    }
  }

  chooseOrder() {
    let orderNumber = this.componentArrival.value.customerOrder;
    console.log(orderNumber);

    if (orderNumber) {
      this.ordersService.getItemsFromOrder(orderNumber).subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          return;
        } else if (data && data.length > 0) {
          this.chosenOrder = data;
          console.log(this.chosenOrder);
          return;
        } else {
          alert("לא נמצאו פריטים בהזמנה שנבחרה.");
          return;
        }
      });
    }
  }
}
