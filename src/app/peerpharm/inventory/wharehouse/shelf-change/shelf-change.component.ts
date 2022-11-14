import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { AuthService } from "src/app/services/auth.service";
import { WarehouseService } from "src/app/services/warehouse.service";

@Component({
  selector: "app-shelf-change",
  templateUrl: "./shelf-change.component.html",
  styleUrls: ["./shelf-change.component.scss"],
})
export class ShelfChangeComponent implements OnInit {
  @ViewChild("nameSelect") nameSelect: ElementRef;
  @ViewChild("printBtn2") printBtn2: ElementRef;
  @ViewChild("first") first: ElementRef;
  @ViewChild("print") print: ElementRef;
  @Input() allWhareHouses: any[];
  @Input() reallyAllWhareHouses: any[];
  @Input() itemNumber: number;

  itemNames: any[];
  shelfsWithItem: any[];
  shellNums: any[];
  certificateReception: number;
  allArrivals: any[] = [];
  today = new Date();
  sending: boolean = false;
  disabled: boolean = false;
  shelfChangeLog: any = null;
  printDate: Date;

  shelfChange: FormGroup = new FormGroup({
    itemType: new FormControl("component", Validators.required),
    item: new FormControl(null, Validators.required),
    itemName: new FormControl(""),
    amount: new FormControl(null, Validators.min(0.001)),
    old_shell_id_in_whareHouse: new FormControl(null, Validators.required),
    oldPosition: new FormControl(""),
    newPosition: new FormControl(""),
    new_shell_id_in_whareHouse: new FormControl(null, Validators.required),
    whareHouseID: new FormControl(null, Validators.required),
    whName: new FormControl(""),
    user: new FormControl(""),
    deliveryNote: new FormControl(""),
  });

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private authService: AuthService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.first.nativeElement.focus(), 500);
    if (this.itemNumber) {
      this.disabled = true;
      this.shelfChange.controls.item.setValue(this.itemNumber);
    }
    this.getHistoricalCertificates();
    //temporary
    // this.getCleanMinus();
  }
  //temposrary
  // getCleanMinus() {
  //   this.inventoryService.getCleanMinus().subscribe((data) => {
  //     console.log(data);
  //   });
  // }

  getHistoricalCertificates() {
    this.warehouseService.shelfChangePrintCalled$.subscribe((data) => {
      if (data && data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data) {
        console.log(data);
        this.certificateReception = data.logs[0].warehouseReception;
        this.today = data.dateAndTime;
        this.printDate = data.dateAndTime;

        this.shelfChange.controls.item.setValue(data.logs[0].item);
        this.shelfChange.controls.itemName.setValue(data.logs[0].itemName);
        this.shelfChange.controls.amount.setValue(data.logs[0].amount);
        this.shelfChange.controls.newPosition.setValue(
          data.logs[0].shell_position_in_whareHouse_Dest
        );
        this.shelfChange.controls.oldPosition.setValue(
          data.logs[0].shell_position_in_whareHouse_Origin
        );
        this.shelfChange.controls.deliveryNote.setValue(data.deliveryNote);
        this.shelfChange.controls.whName.setValue(data.logs[0].WH_originName);
        this.shelfChange.controls.user.setValue(data.userName);
        this.shelfChangeLog = data.logs[0];

        setTimeout(() => {
          this.print.nativeElement.click();
          this.shelfChange.reset();
          this.shelfChangeLog = [];
        }, 500);
      }
    });
  }

  getShelfs() {
    this.inventoryService
      .getCmptByitemNumber(this.shelfChange.value.item)
      .subscribe((data) => {
        if (data.length > 0) {
          this.itemNames = data;
          this.shelfChange.controls.itemType.setValue(data[0].itemType);
          this.shelfChange.controls.itemName.setValue(data[0].componentName);
        }
      });

    // if (this.shelfChange.value.whareHouseID == "5c31bb6f91ca6b2510349ce9") {
    //   this.shelfChange.controls.itemType.setValue("product");
    // }
    if (!this.shelfChange.value.whareHouseID)
      this.toastr.error("אנא בחר מחסן.");
    else if (!this.shelfChange.value.item)
      this.toastr.error("אנא הזן מספר פריט.");
    else if (this.shelfChange.value.item)
      this.inventoryService
        .getShelfListForItemInWhareHouse2(
          this.shelfChange.value.item,
          this.shelfChange.value.whareHouseID
        )
        .subscribe((res) => {
          console.log(res);
          if (res.msg) {
            this.toastr.error("בעיה בהזנת הנתונים.");
            this.shelfsWithItem = [];
          } else if (res.length == 0) {
            this.toastr.error("הפריט לא נמצא על אף אחד מהמדפים במחסן זה.");
            this.shelfsWithItem = [];
          } else {
            console.log(res);
            this.shelfsWithItem = res;
            console.log(this.shelfsWithItem);
          }
        });
  }

  getAllShellsOfWhareHouse() {
    this.inventoryService
      .getWhareHouseShelfList(this.shelfChange.value.whareHouseID)
      .subscribe((res) => {
        this.shellNums = res;
        this.shelfChange.controls.new_shell_id_in_whareHouse.setValue(
          this.shellNums[0]._id
        );
        this.shelfChange.controls.newposition.setValue(
          this.shellNums[0].position
        );
      });
  }

  // Get names of all items for search
  getNames(event) {
    if (event.value.length > 2) {
      this.inventoryService.getNamesByRegex(event.value).subscribe((names) => {
        this.itemNames = names;
        this.shelfChange.controls.item.setValue(names[0].componentN);
      });
    }
  }

  setItemDetailsNumber(event) {
    this.shelfChange.controls.item.setValue(event.target.value);
  }

  changeShelf() {
    this.shelfChange.controls.user.setValue(
      `${this.authService.loggedInUser.firstName} ${this.authService.loggedInUser.lastName}`
    );
    let whName = this.allWhareHouses.find(
      (wh) => wh._id == this.shelfChange.value.whareHouseID
    );
    this.shelfChange.controls.whName.setValue(whName.name);

    let newPosition = this.shellNums.find(
      (sh) => sh._id == this.shelfChange.value.new_shell_id_in_whareHouse
    );
    this.shelfChange.controls.newPosition.setValue(newPosition.position);
    let oldPosition = this.shelfsWithItem.find(
      (sh) =>
        sh.shell_id_in_whareHouse ==
        this.shelfChange.value.old_shell_id_in_whareHouse
    );
    this.shelfChange.controls.oldPosition.setValue(oldPosition.position);

    console.log(this.shelfChange.value);
    this.sending = true;
    setTimeout(() => (this.sending = false), 7000);
    this.printDate = new Date();
    this.inventoryService
      .changeItemPosition(this.shelfChange.value)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          this.shelfsWithItem = [];
        } else if (data[3].savedWhActionlog) {
          //set certificate data
          this.sending = false;
          this.shelfChangeLog = data[3].savedWhActionlog;
          console.log(this.shelfChangeLog);
          let user = this.shelfChange.value.user;
          let whName = this.shelfChange.value.whName;
          let warehouseId = this.shelfChange.value.whareHouseID;

          setTimeout(() => {
            this.print.nativeElement.click();
            this.shelfChange.reset();
            this.shelfChange.controls.user.setValue(user);
            this.shelfChange.controls.whName.setValue(whName);
            this.shelfChange.controls.whareHouseID.setValue(warehouseId);
            this.shelfsWithItem = [];
            this.first.nativeElement.focus();
            console.log(this.shelfChange.value);
            this.toastr.success("שינויים נשמרו בהצלחה", "נשמר");
          }, 2000);
          // this.shelfsWithItem;
          // this.shelfChange.controls.itemType.setValue("component");
        }
      });
  }
}
