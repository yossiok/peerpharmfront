import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-shelf-change",
  templateUrl: "./shelf-change.component.html",
  styleUrls: ["./shelf-change.component.scss"],
})
export class ShelfChangeComponent implements OnInit {
  @ViewChild("nameSelect") nameSelect: ElementRef;
  @ViewChild("printBtn2") printBtn2: ElementRef;
  @ViewChild("first") first: ElementRef;
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

  shelfChange: FormGroup = new FormGroup({
    itemType: new FormControl("component", Validators.required),
    item: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.min(0.001)),
    old_shell_id_in_whareHouse: new FormControl(null, Validators.required),
    new_shell_id_in_whareHouse: new FormControl(null, Validators.required),
    whareHouseID: new FormControl(null, Validators.required),
    user: new FormControl(""),
  });

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.first.nativeElement.focus(), 500);
    if (this.itemNumber) {
      this.disabled = true;
      this.shelfChange.controls.item.setValue(this.itemNumber);
    }
    //temporary
    // this.getCleanMinus();
  }
  //temposrary
  // getCleanMinus() {
  //   this.inventoryService.getCleanMinus().subscribe((data) => {
  //     console.log(data);
  //   });
  // }

  getShelfs() {
    this.inventoryService
      .getCmptByitemNumber(this.shelfChange.value.item)
      .subscribe((data) => {
        if (data.length > 0) {
          this.itemNames = data;
        }
      });

    if (this.shelfChange.value.whareHouseID == "5c31bb6f91ca6b2510349ce9") {
      this.shelfChange.controls.itemType.setValue("product");
    }
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
          if (res.msg) {
            this.toastr.error("בעיה בהזנת הנתונים.");
            this.shelfsWithItem = [];
          } else if (res.length == 0) {
            this.toastr.error("הפריט לא נמצא על אף אחד מהמדפים במחסן זה.");
            this.shelfsWithItem = [];
          } else {
            this.shelfsWithItem = res;
            //stupid bug:
            this.shelfChange.controls.old_shell_id_in_whareHouse.setValue(
              this.shelfsWithItem[0].shell_id_in_whareHouse
            );
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
      this.authService.loggedInUser.userName
    );
    console.log(this.shelfChange.value);
    this.sending = true;
    setTimeout(() => (this.sending = false), 7000); //if something goes wrong
    this.inventoryService
      .changeItemPosition(this.shelfChange.value)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg, "שגיאה");
          this.shelfsWithItem = [];
        } else {
          //set certificate data
          this.sending = false;
          this.toastr.success("שינויים נשמרו בהצלחה", "נשמר");
          this.shelfChange.reset();
          this.shelfChange.controls.itemType.setValue("component");
          this.first.nativeElement.focus();
          this.shelfsWithItem;
        }
      });
  }
}
