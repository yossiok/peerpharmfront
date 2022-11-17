import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { WarehouseService } from "src/app/services/warehouse.service";
import { WarehousesNamesPipe } from "src/app/pipes/warehouses-names.pipe";
import { AuthService } from "src/app/services/auth.service";

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
  itemfound: boolean = false;
  originShelf: any;
  destShelf: any;
  itemNames: any[];
  allMovements: any[] = [];
  movementForm: FormGroup = new FormGroup({
    amount: new FormControl(null, Validators.min(0.001)),
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
    user: new FormControl(""),
  });
  sending: boolean = false;
  certificateReception: any;
  reception: any;
  originWHName: any;
  originWHId: any;
  destinationWHName: any;
  destinationWHId: any;
  historic: boolean;
  user: string = "";
  userWH: Array<any>;
  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private wareHouseService: WarehouseService,
    private authService: AuthService
  ) {}
  actionLogs: any[] = [];

  ngOnInit(): void {
    setTimeout(() => this.first.nativeElement.focus(), 500);
    if (this.itemNumber) {
      this.movementForm.controls.item.setValue(this.itemNumber);
      this.disabled = true;
    }
    this.getHistoricalReceptions();
    this.getLastReception();
    this.user = this.authService.loggedInUser.userName;
    // this.userWH = this.authService.loggedInUser.allowedWH;
    this.userWH = this.reallyAllWhareHouses.filter((wh) =>
      this.authService.loggedInUser.allowedWH.includes(wh._id)
    );
    console.log(this.userWH);
  }

  getLastReception() {
    this.inventoryService.getLastReception().subscribe((data) => {
      this.reception = data[0].warehouseReception + 1;
      console.log(this.reception);
    });
  }

  getHistoricalReceptions() {
    this.wareHouseService.moveWHPrintCalled$.subscribe((data) => {
      this.allMovements = [];
      this.reception = data.logs[0].warehouseReception;
      this.historic = true;
      this.today = data.dateAndTime;
      data.logs.forEach((element) => {
        this.allMovements.push(element);
      });
      console.log(data.logs[0]);
      this.movementForm.patchValue(data.logs[0]);

      setTimeout(() => {
        this.movementForm.reset();
        this.printBtn2.nativeElement.click();
        this.allMovements = [];
      }, 500);
    });
    this.reception = "";
    this.historic = false;
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
          console.log(data);
          if (data.length > 0) {
            if (data[0].itemType == "material") {
              reject("לא ניתן להעביר חומרי גלם דרך טופס זה");
              return;
            }
            this.movementForm.controls.itemName.setValue(data[0].componentName);
            this.noItem = false;
            this.itemNames = data;
            resolve(true);
          } else {
            this.noItem = true;
            resolve("פריט זה לא נמצא במחסן שנבחר :(");
          }
        });
    });
  }

  // Get names of all items for search
  getNames() {
    let inputName = this.movementForm.controls.itemName.value;
    if (inputName.length > 2) {
      this.inventoryService.getNamesByRegex(inputName).subscribe((names) => {
        console.log(names);
        this.itemNames = names;
        this.movementForm.controls.item.setValue(names[0].componentN);
        this.movementForm.controls.itemName.setValue(names[0].componentName);
      });
    }
    console.log(this.movementForm.value.itemName);
  }

  setItemDetailsNumber(event) {
    this.movementForm.controls.item.setValue(event.target.value);
  }

  checkComponentNumber() {
    console.log(this.movementForm.value.item);
    console.log("Sending value: " + this.sending);

    if (!this.movementForm.value.item) {
      alert("אנא הכנס מספר פריט");
      return;
    } else if (!this.sending) {
      this.inventoryService
        .getCmptByitemNumber(this.movementForm.value.item)
        .subscribe((data) => {
          console.log(data);
          if (data.length > 0) {
            this.noItem = false;
            this.itemNames = data;
            this.movementForm.controls.itemName.setValue(
              this.itemNames[0].componentName
            );
            if (this.allMovements.length > 0) {
              console.log(this.allMovements);
              this.getChunks("o");
              // this.getChunks("d");
            }
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
    this.itemfound = false;
    console.log(this.movementForm.controls.WH_originId.value);
    if (
      !this.movementForm.controls.WH_originId.value ||
      !this.movementForm.controls.item.value
    ) {
      return;
    }

    console.log(whType);
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
          this.itemfound = false;
          return;
        }

        if (!WHID) this.toastr.error("אנא בחר מחסן.");
        else if (!this.movementForm.value.item)
          this.toastr.error("אנא הזן מספר פריט.");
        else console.log(this.movementForm.value.item, WHID);
        this.inventoryService
          .getShelfListForItemInWhareHouse2(this.movementForm.value.item, WHID)
          .subscribe((chunks) => {
            console.log(chunks);
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
                this.itemfound = true;
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
                this.itemfound = true;
              }
            }
          });
      })
      .catch((e) => {
        console.log("error: ", e);
        this.toastr.error("", e);
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
    this.itemfound = true;
  }

  addItem() {
    if (this.itemfound) {
      this.movementForm.controls.user.setValue(this.user);
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
        this.originWHShelfs = [];
        this.first.nativeElement.focus();
      }, 500);
    } else {
      alert("פריט לא נמצא אנא נסה שנית");
    }
  }

  removeFromAllMovements(i) {
    this.allMovements.splice(i, 1);
  }

  clearArrivals() {
    this.allMovements = [];
  }

  move() {
    this.sending = true;
    this.historic = false;
    let self = this;
    console.log(this.allMovements);
    this.inventoryService.moveWareHouse(this.allMovements).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.sending = false;
        alert(data.msg);
        this.toastr.error("Operation Falied", data.msg);
      } else if (data && data.errors && data.erros.length > 0) {
        for (let er of data.errors) {
          let error = er.msg ? er.msg : er;
          this.toastr.error(er.msg);
        }
      } else if (!data.savedMovements || data.savedMovements.length == 0) {
        this.toastr.error("הפעולה נכשלה, לא נעשה שינוי למלאי");
        alert("הפעולה נכשלה, לא נעשה שינוי למלאי");
        setTimeout(() => {
          this.movementForm.reset();
          this.allMovements = [];
          this.originWHShelfs = [];
          this.reception = null;
          this.movementForm.controls.isNewItemShell.setValue(false);
          this.movementForm.controls.itemType.setValue("component");
          this.first.nativeElement.focus();
        }, 1500);
        this.sending = false;
        this.movementForm.controls.valid.setValue(false);
      } else if (data.savedMovements.length < this.allMovements.length) {
        let realData = [];
        for (let move of this.allMovements) {
          let index = data.actionLogs.findIndex((al) => {
            return al.item == move.item;
          });
          if (index > -1) {
            realData.push(move);
          }
        }
        self.allMovements = [...realData];
        console.log(realData);
        console.log(this.allMovements);
        this.toastr.warning("שינויים בוצעו בחלק מההעברות בלבד", "נשמר");
        alert(
          "שינויים בוצעו בחלק מההעברות בלבד, הדפס תעודה דרך שחזור תעודות היסטוריות. מספר תעודה:" +
            data.actionLogs[0].warehouseReception
        );
        setTimeout(() => {
          this.allMovements = [];
          this.movementForm.reset();
          this.originWHShelfs = [];
          this.reception = null;
          this.movementForm.controls.isNewItemShell.setValue(false);
          this.movementForm.controls.itemType.setValue("component");
          this.movementForm.controls.valid.setValue(false);
          this.first.nativeElement.focus();
        }, 1500);
        this.sending = false;
      } else if (data.savedMovements.length == this.allMovements.length) {
        setTimeout(() => {
          this.printBtn2.nativeElement.click();
          location.reload();
        }, 500);
        setTimeout(() => {
          this.movementForm.reset();
          this.allMovements = [];
          this.originWHShelfs = [];
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
    this.historic = false;
  }

  justPrint() {
    this.printBtn2.nativeElement.click();
  }
}
