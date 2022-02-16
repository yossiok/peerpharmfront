import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { WarehouseService } from "src/app/services/warehouse.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  @ViewChild("nameSelect") nameSelect: ElementRef;
  @ViewChild("printBtn2") printBtn2: ElementRef;
  @ViewChild("first") first: ElementRef;
  @Input() allWhareHouses: any[];
  @Input() reallyAllWhareHouses: any[];
  @Input() itemNumber: number;

  itemNames: any[];
  shellNums: any[];
  certificateReception: number;
  shelf: any;
  outGoing: any[] = [];
  today = new Date();
  sending: boolean = false;
  disabled: boolean = false;
  isReturn: boolean = false;

  componentCheckout: FormGroup = new FormGroup({
    itemType: new FormControl("component", Validators.required),
    item: new FormControl(null, Validators.required),
    itemName: new FormControl(""),
    amount: new FormControl(null, Validators.min(0.001)),
    shell_id_in_whareHouse: new FormControl(null, Validators.required),
    position: new FormControl(""),
    whareHouseID: new FormControl(null, Validators.required),
    whareHouse: new FormControl(""),
    isNewItemShell: new FormControl(false, Validators.required),
    destination: new FormControl("", Validators.required),
  });

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.first.nativeElement.focus(), 500);
    if (this.itemNumber) {
      this.disabled = true;
      this.componentCheckout.controls.item.setValue(this.itemNumber);
    }
    this.getHistoricalCertificates();
  }

  getHistoricalCertificates() {
    this.warehouseService.outPrintCalled$.subscribe((data) => {
      this.certificateReception = data.logs[0].warehouseReception;
      this.today = data.dateAndTime;
      data.logs.forEach((element) => {
        element.position = element.shell_position_in_whareHouse_Origin;
      });
      this.outGoing = data.logs;

      setTimeout(() => {
        this.printBtn2.nativeElement.click();
        this.componentCheckout.reset();
        this.outGoing = [];
      }, 500);
    });
  }

  getShelfs() {
    console.log(this.componentCheckout.value.item);
    this.inventoryService
      .getCmptByitemNumber(this.componentCheckout.value.item)
      .subscribe((data) => {
        if (data.length > 0) {
          this.itemNames = data;
        }
      });

    if (
      this.componentCheckout.value.whareHouseID == "5c31bb6f91ca6b2510349ce9"
    ) {
      this.componentCheckout.controls.itemType.setValue("product");
    }
    if (!this.componentCheckout.value.whareHouseID)
      this.toastr.error("אנא בחר מחסן.");
    else if (!this.componentCheckout.value.item)
      this.toastr.error("אנא הזן מספר פריט.");
    else
      this.inventoryService
        .getShelfListForItemInWhareHouse2(
          this.componentCheckout.value.item,
          this.componentCheckout.value.whareHouseID
        )
        .subscribe((res) => {
          if (res.msg) this.toastr.error("בעיה בהזנת הנתונים.");
          else if (res.length == 0) {
            this.toastr.error("הפריט לא נמצא על אף אחד מהמדפים במחסן זה.");
          } else {
            this.shellNums = res;
            //stupid bug:
            this.componentCheckout.controls.shell_id_in_whareHouse.setValue(
              this.shellNums[0].shell_id_in_whareHouse
            );
          }
        });
  }

  // Get names of all items for search
  getNames() {
    let inputName = this.componentCheckout.controls.itemName.value;

    if (inputName.length > 2) {
      this.inventoryService.getNamesByRegex(inputName).subscribe((names) => {
        this.itemNames = names;
        this.componentCheckout.controls.item.setValue(names[0].componentN);
      });
    }
  }

  setItemDetailsNumber(event) {
    this.componentCheckout.controls.item.setValue(event.target.value);
  }

  setShelf(e) {
    let shelfId = e.target.value;
    this.shelf = this.shellNums.find(
      (s) => s.shell_id_in_whareHouse == shelfId
    );
  }

  checkAmount() {
    if (!this.componentCheckout.value.shell_id_in_whareHouse) {
      this.toastr.error("אנא הכנס מדף ממנו מוציאים");
      this.componentCheckout.controls.amount.reset();
    } else if (this.componentCheckout.value.amount > this.shelf.amount) {
      let conf = confirm("הכמות שהזנת גדולה מהכמות במדף. להמשיך בכל זאת?");
      if (!conf) this.componentCheckout.controls.amount.reset();
    }
  }

  addToOutGoing() {
    // set whareHouse name and shelf position
    let whareHouse = this.allWhareHouses.find(
      (wh) => wh._id == this.componentCheckout.value.whareHouseID
    );
    this.componentCheckout.controls.whareHouse.setValue(whareHouse.name);
    let shellDoc = this.shellNums.find(
      (shell) =>
        shell.shell_id_in_whareHouse ==
        this.componentCheckout.value.shell_id_in_whareHouse
    );
    this.componentCheckout.controls.position.setValue(shellDoc.position);
    //push arrival to outGoing
    this.outGoing.push(this.componentCheckout.value);
    this.componentCheckout.reset();
    this.componentCheckout.controls.item.setValue(this.itemNumber);
    this.componentCheckout.controls.isNewItemShell.setValue(false);
    this.componentCheckout.controls.itemType.setValue("component");
    this.shellNums = [];
    this.first.nativeElement.focus();
  }

  checkout() {
    this.sending = true;
    console.log(this.outGoing);
    setTimeout(() => (this.sending = false), 7000); //if something goes wrong
    this.inventoryService
      .checkoutComponents(this.outGoing)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          // this.toastr.error("ייתכן שהפעולה בוצעה. אנא פנה לצוות הפיתוח.","היתה בעיה");
          this.toastr.error(data.msg, "שגיאה:");
          console.log(data.msg);
        } else if (data.actionLogs == 0) {
          this.toastr.error(" הפעולה נכשלה, לא בוצעו עדכוני מלאי");
          this.sending = false;
          alert("הפעולה נכשלה, לא נעשה שינוי למלאי");
          setTimeout(() => {
            this.componentCheckout.reset();
            this.outGoing = [];
            this.first.nativeElement.focus();
          }, 1500);
          this.componentCheckout.controls.valid.setValue(false);
        } else if (data.actionLogs.length < this.outGoing.length) {
          let realData = [];
          for (let move of this.outGoing) {
            let index = data.actionLogs.findIndex((al) => {
              return al.item == move.item;
            });
            if (index > -1) {
              move.itemName = data.allResults[index].componentName;
              realData.push(move);
            }
            this.outGoing = realData;
          }
          this.certificateReception = data.actionLogs[0].warehouseReception;
          console.log(this.outGoing);
          this.toastr.warning(" הפעולה בוצעה חלקית, ");
          this.sending = false;
          alert(" הפעולה בוצעה חלקית, ");
          setTimeout(() => {
            this.printBtn2.nativeElement.click();
            setTimeout(() => (this.outGoing = []), 1000);
          }, 500);
          setTimeout(() => {
            this.componentCheckout.reset();
            this.first.nativeElement.focus();
          }, 1500);
          this.componentCheckout.controls.valid.setValue(false);
        } else {
          //set certificate data
          this.certificateReception =
            data.allResults[0].savedMovement.warehouseReception;
          for (let arrival of this.outGoing) {
            arrival.itemName = data.allResults.find(
              (a) => a.item == arrival.item
            ).componentName;
            arrival.amount = Math.abs(arrival.amount);
          }

          this.sending = false;
          this.toastr.success("שינויים נשמרו בהצלחה", "נשמר");
          setTimeout(() => {
            this.printBtn2.nativeElement.click();
            setTimeout(() => (this.outGoing = []), 1000);
          }, 500);
        }
      });
  }

  removeFromArrivals(i) {
    this.outGoing.splice(i, 1);
  }

  justPrint() {
    setTimeout(() => {
      this.printBtn2.nativeElement.click();
    }, 500);
  }

  clearArrivals() {
    this.outGoing = [];
  }

  shaulyShutUp() {
    this.isReturn = !this.isReturn;
  }
}
