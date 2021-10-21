import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { WarehouseService } from "src/app/services/warehouse.service";
import { WarehousesNamesPipe } from "src/app/pipes/warehouses-names.pipe";

@Component({
  selector: "app-between-wh",
  templateUrl: "./between-wh.component.html",
  styleUrls: ["./between-wh.component.scss"],
})
export class BetweenWHComponent implements OnInit {
  @Input() allWhareHouses;
  @Input() reallyAllWhareHouses: any[];
  @Input() itemNumber;
  @ViewChild("first") first: ElementRef;
  @ViewChild("printBtn2") printBtn2: ElementRef;

  originWHShelfs: any[];
  destWHShelfs: any[];
  today = new Date();
  noItem: boolean = false;
  disabled: boolean = false;
  originShelf: any;
  destShelf: any;
  itemNames: any[];
  allMovements: any[] = [];
  movementForm: FormGroup = new FormGroup({
    amount: new FormControl(null, Validators.required),
    item: new FormControl(null, [Validators.required, Validators.minLength(1)]),
    itemName: new FormControl(""),
    itemType: new FormControl("component"),
    shell_id_in_whareHouse_Origin: new FormControl(null, Validators.required),
    shell_position_in_whareHouse_Origin: new FormControl(
      null,
      Validators.required
    ),
    WH_originId: new FormControl(null, Validators.required),
    WH_originName: new FormControl(null, Validators.required),
    shell_id_in_whareHouse_Dest: new FormControl(null, Validators.required),
    shell_position_in_whareHouse_Dest: new FormControl(
      null,
      Validators.required
    ),
    WH_destId: new FormControl(null, Validators.required),
    WH_destName: new FormControl(null, Validators.required),
    isNewItemShell: new FormControl(false, Validators.required),
  });
  sending: boolean = false;
  certificateReception: any;
  reception: any;
  originWHName: any;
  originWHId: any;
  destinationWHName: any;
  destinationWHId: any;
  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private wareHouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.first.nativeElement.focus(), 500);
    if (this.itemNumber) {
      this.movementForm.controls.item.setValue(this.itemNumber);
      this.disabled = true;
    }
    this.getHistoricalReceptions();
    this.getLastReception();
  }

  getLastReception() {
    this.inventoryService.getLastReception().subscribe((data) => {
      this.reception = data[0].warehouseReception + 1;
      console.log(this.reception);
    });
  }

  getHistoricalReceptions() {
    this.wareHouseService.moveWHPrintCalled$.subscribe((data) => {
      this.certificateReception = data.logs[0].warehouseReception;
      this.today = data.dateAndTime;
      data.logs.forEach((element) => {
        element.position = element.shell_position_in_whareHouse_Origin;
      });
      console.log(data.logs[0]);
      this.movementForm.patchValue(data.logs[0]);

      setTimeout(() => {
        this.printBtn2.nativeElement.click();
      }, 500);
    });
  }

  // check if component number exist
  async checkComponentN() {
    return new Promise((resolve, reject) => {
      this.inventoryService
        .getCmptByNumber(
          this.movementForm.value.item,
          this.movementForm.value.itemType
        )
        .subscribe((data) => {
          if (data.length > 0) {
            this.noItem = false;
            this.itemNames = data;
            resolve(true);
          } else {
            this.noItem = true;
            reject(false);
          }
        });
    });
  }

  // Get names of all items for search
  getNames(event) {
    if (event.value.length > 2) {
      this.inventoryService.getNamesByRegex(event.value).subscribe((names) => {
        this.itemNames = names;
        this.movementForm.controls.item.setValue(names[0].componentN);
        this.movementForm.controls.itemName.setValue(names[0].componentName);
      });
    }
  }

  setItemDetailsNumber(event) {
    this.movementForm.controls.item.setValue(event.target.value);
  }

  checkComponentNumber() {
    console.log(this.movementForm.value.item);
    console.log("Sending value: " + this.sending);
    if (!this.sending) {
      this.inventoryService
        .getCmptByitemNumber(this.movementForm.value.item)
        .subscribe((data) => {
          if (data.length > 0) {
            this.noItem = false;
            this.itemNames = data;
            this.movementForm.controls.itemName.setValue(
              this.itemNames[0].componentName
            );
          } else {
            console.log("No item found");
            this.noItem = true;
            this.toastr.error("מספר פריט לא תקין");
            this.movementForm.controls.item.reset();
          }
        });
    } else {
      return;
    }
  }

  // get chunks with item
  // it was better to split it to 2 different functions - one for origin and one for destination...
  getChunks(whType) {
    if (whType == "o") this.originWHShelfs = [];
    if (whType == "d") this.destWHShelfs = [];
    // product movement
    if (this.movementForm.value.WH_originId == "5c31bb6f91ca6b2510349ce9") {
      this.movementForm.controls.itemType.setValue("product");
    } else this.movementForm.controls.itemType.setValue("component");

    // origin or destination WH?
    let WHID =
      whType == "o"
        ? this.movementForm.value.WH_originId
        : this.movementForm.value.WH_destId;

    this.checkComponentN()
      .then((result) => {
        if (!result) {
          this.toastr.error("מספר פריט לא תקין");
          return;
        }

        if (!WHID) this.toastr.error("אנא בחר מחסן.");
        else if (!this.movementForm.value.item)
          this.toastr.error("אנא הזן מספר פריט.");
        else
          this.inventoryService
            .getShelfListForItemInWhareHouse2(
              this.movementForm.value.item,
              WHID
            )
            .subscribe((chunks) => {
              if (chunks.msg) this.toastr.error("בעיה בהזנת הנתונים.");
              else if (chunks.length == 0) {
                // no existing cunks for item
                // if origin - break
                if (whType == "o") this.toastr.error("הפריט לא נמצא במחסן זה");
                // if destination - ask for approval to enter to new shelf
                else if (whType == "d") {
                  let noShellsForItem = confirm(
                    "הפריט לא נמצא על אף אחד מהמדפים במחסן זה. להכניס למדף חדש?"
                  );
                  if (noShellsForItem) {
                    // approved - announce new itemShell (chunk) and get all shelfs of destination WH
                    this.movementForm.controls.isNewItemShell.setValue(true);
                    this.getAllShelfsOfDest(WHID);
                    let whName = this.reallyAllWhareHouses.find(
                      (wh) => wh._id == this.movementForm.value.WH_destId
                    ).name;
                    this.movementForm.controls.WH_destName.setValue(whName);
                    this.movementForm.controls.shell_id_in_whareHouse_Dest.setValue(
                      this.destWHShelfs[0].shell_id_in_whareHouse
                    ); //stupid bug
                    this.setDestPosition();
                  }
                }
              } else {
                if (whType == "o") {
                  this.originWHShelfs = chunks;
                  this.movementForm.controls.shell_id_in_whareHouse_Origin.setValue(
                    this.originWHShelfs[0].shell_id_in_whareHouse
                  ); //stupid bug
                  this.setOriginPosition();
                  let whName = this.allWhareHouses.find(
                    (wh) => wh._id == this.movementForm.value.WH_originId
                  ).name;
                  this.movementForm.controls.WH_originName.setValue(whName);
                }
                if (whType == "d") {
                  this.destWHShelfs = chunks;
                  this.movementForm.controls.shell_id_in_whareHouse_Dest.setValue(
                    this.destWHShelfs[0].shell_id_in_whareHouse
                  ); //stupid bug
                  this.setDestPosition();
                  let whName = this.reallyAllWhareHouses.find(
                    (wh) => wh._id == this.movementForm.value.WH_destId
                  ).name;
                  this.movementForm.controls.WH_destName.setValue(whName);
                }
              }
            });
      })
      .catch((e) => {
        console.log("error: ", e);
        this.toastr.error("", "פריט לא קיים :(");
      });
  }

  getAllShelfsOfDest(e) {
    e = e.target ? e.target.value : e;
    this.inventoryService.getWhareHouseShelfList(e).subscribe((res) => {
      this.destWHShelfs = res.map((shell) => {
        shell.shell_id_in_whareHouse = shell._id;
        this.movementForm.controls.shell_id_in_whareHouse_Dest.setValue(
          shell._id
        );
        return shell;
      });
    });
  }

  setOriginPosition() {
    this.originShelf = this.originWHShelfs.find(
      (shelf) =>
        shelf.shell_id_in_whareHouse ==
        this.movementForm.value.shell_id_in_whareHouse_Origin
    );
    this.movementForm.controls.shell_position_in_whareHouse_Origin.setValue(
      this.originShelf.position
    );
  }

  checkAmount() {
    if (!this.originShelf) {
      this.toastr.error("אנא הכנס מדף ממנו מוציאים");
      this.movementForm.controls.amount.reset();
    } else if (this.originShelf.amount < this.movementForm.value.amount) {
      let conf = confirm("הכמות שהזנת גדולה מהכמות במדף. להמשיך בכל זאת?");
      if (!conf) this.movementForm.controls.amount.reset();
    }
  }

  setDestPosition() {
    this.destShelf = this.destWHShelfs.find(
      (shelf) =>
        shelf.shell_id_in_whareHouse ==
        this.movementForm.value.shell_id_in_whareHouse_Dest
    );
    this.movementForm.controls.shell_position_in_whareHouse_Dest.setValue(
      this.destShelf.position
    );
  }

  addItem() {
    console.log(this.movementForm.value);
    if (this.allMovements.length == 0) {
      this.originWHName = this.movementForm.value.WH_originName;
      this.originWHId = this.movementForm.value.WH_originId;
      this.destinationWHName = this.movementForm.value.WH_destName;
      this.destinationWHId = this.movementForm.value.WH_destId;
      this.allMovements.push(this.movementForm.value);
    } else {
      this.allMovements.push(this.movementForm.value);
    }

    //push arrival to allArrivals

    console.log(this.allMovements);

    setTimeout(() => {
      this.movementForm.reset();
      this.movementForm.controls.WH_originName.setValue(this.originWHName);
      this.movementForm.controls.WH_originId.setValue(this.originWHId);
      this.movementForm.controls.WH_destName.setValue(this.destinationWHName);
      this.movementForm.controls.WH_destId.setValue(this.destinationWHId);
      this.movementForm.controls.isNewItemShell.setValue(false);
      this.movementForm.controls.itemType.setValue("component");
      this.itemNames = [];
      this.first.nativeElement.focus();
    }, 500);
  }

  removeFromAllMovements(i) {
    this.allMovements.splice(i, 1);
  }

  clearArrivals(){
    this.allMovements = []
  }

  move() {
    this.sending = true;
    console.log(this.allMovements);
    this.inventoryService.moveWareHouse(this.allMovements).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastr.error(data.msg, "שגיאה");
      } else {
        setTimeout(() => {
          this.printBtn2.nativeElement.click();
        }, 500);
        setTimeout(() => {
          this.movementForm.reset();
          this.allMovements = [];
          this.reception = null;
          this.movementForm.controls.isNewItemShell.setValue(false);
          this.movementForm.controls.itemType.setValue("component");
          this.first.nativeElement.focus();
        }, 1500);
        this.toastr.success("שינויים נשמרו בהצלחה", "נשמר");
        this.sending = false;
        this.movementForm.controls.valid.setValue(false);
      }
    });
  }

  justPrint() {
    this.printBtn2.nativeElement.click();
  }
}
