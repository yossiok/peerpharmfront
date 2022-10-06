import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "src/app/services/items.service";
import { AuthService } from "src/app/services/auth.service";
import { FormulesService } from "src/app/services/formules.service";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-items-explosion",
  templateUrl: "./items-explosion.component.html",
  styleUrls: ["./items-explosion.component.scss"],
})
export class ItemsExplosionComponent implements OnInit {
  user: any = null;
  userName: string = "";
  authorized: boolean = false;
  viewFormule: boolean = false;

  itemsList: any[] = [];
  materialsList: any[] = [];
  errors: any[] = [];
  loading: boolean = false;
  componentsList: any[] = [];

  orderSimForm: FormGroup = new FormGroup({
    itemNumber: new FormControl("", Validators.required),
    itemName: new FormControl(""),
    barcode: new FormControl(""),
    quantity: new FormControl(null, Validators.required),
    unitWeight: new FormControl(null, Validators.required),
    components: new FormControl([]),
  });

  @ViewChild("first") first: ElementRef;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private fourmulesService: FormulesService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized =
      this.user.authorization.includes("newProposal") ||
      this.user.authorization.includes("newOrder");
    this.viewFormule =
      this.user.authorization.includes("showFormule") ||
      this.user.authorization.includes("formulePrice");
    console.log(this.user.authorization);
    console.log(this.user.userName);
    console.log(this.authorized);
    console.log(this.viewFormule);
  }

  getItemName() {
    console.log(this.orderSimForm.value.itemNumber);
    let itemNumber = this.orderSimForm.value.itemNumber;
    this.itemsService.getItemByNumber(itemNumber).subscribe((data) => {
      if (!data) {
        this.toastr.error("לא נמצא מוצר במקט זה");
        this.first.nativeElement.focus();
        return;
      }

      if (data.msg) {
        console.log(data.msg);
        this.toastr.error(data.msg);
        this.first.nativeElement.focus();
        return;
      } else if (data) {
        this.orderSimForm.controls.itemName.setValue(data.itemName);
        this.orderSimForm.controls.barcode.setValue(data.barcode);
        this.orderSimForm.controls.unitWeight.setValue(data.weight);
        this.orderSimForm.controls.components.setValue(data.components);
      }
    });
  }
  addItem() {
    console.log(this.orderSimForm.value);
    if (!this.orderSimForm.valid) {
      alert("אחד הנתונים חסר");
      return;
    } else if (this.orderSimForm.value.quantity < 1) {
      alert("הכמות חייבת להיות גדולה מאפס");
      return;
    } else if (this.orderSimForm.value.unitWeight < 1) {
      alert("משקל יחידה חייב להיות גדול מאפס");
      return;
    }

    this.itemsList.push(this.orderSimForm.value);
    this.orderSimForm.reset();
    this.first.nativeElement.focus();
  }
  clearOrderSim() {
    this.orderSimForm.reset();
  }
  removeItem(idx) {
    console.log(idx);
    this.itemsList.splice(idx, 1);
  }
  getComponentsForList() {
    if (this.itemsList.length == 0) {
      this.toastr.error("רשימת המוצרים ריקה, יש להכניס לפחות מוצר אחד לרשימה");
      return;
    }
    this.loading = true;
    this.componentsList = [];
    this.materialsList = [];
    this.errors = [];
    this.itemsService.getComponentsForList(this.itemsList).subscribe((data) => {
      console.log(data);
      this.loading = false;
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data.components && data.components.length > 0) {
        this.componentsList = data.components;
      }
    });
  }
  getMaterialsForList() {
    if (!this.viewFormule) {
      alert("אין לך הרשאה לראות נתונים אלה.");
      return;
    }

    if (this.itemsList.length == 0) {
      this.toastr.error("רשימת המוצרים ריקה, יש להכניס לפחות מוצר אחד לרשימה");
      return;
    }
    this.loading = true;
    this.errors = [];
    this.materialsList = [];
    this.componentsList = [];
    this.itemsService.getMaterialsForList(this.itemsList).subscribe((data) => {
      this.loading = false;

      if (data.msg) {
        this.toastr.error(data.msg);
        console.log(data.msg);
      } else if (data && data.length > 0) {
        for (let material of data) {
          if (material.msg) {
            this.errors.push(material.msg);
          } else {
            this.materialsList.push(material);
          }
        }
      } else {
        this.errors.push("לא נמצאו פורמולות ");
        return;
      }
    });
  }

  exportMaterialsListXL() {
    let matList = [];
    for (let material of this.materialsList) {
      let line = {
        "מק''ט חומר גלם": material.item,
        "שם חומר גלם": material.itemName,
        "כמות נדרשת לייצור": material.kgProd,
        "כמות במלאי": material.stockAmount,
        "כמות ברכש": material.purchaseAmount,
        "מצב החומר": material.diff,
      };
      matList.push(line);
    }

    this.excelService.exportAsExcelFile(matList, "Materials List");
  }
  exportComponentsListXL() {
    let compList = [];
    for (let component of this.componentsList) {
      let line = {
        "מק''ט פריט": component.componentN,
        " תאור פריט": component.componentName,
        " סוג פריט": component.componentType,
        "כמות נדרשת לייצור": component.qtyRequired,
        "כמות במלאי": component.stockAmount,
        "כמות ברכש": component.purchaseAmount,
        "מצב החומר": component.diff,
      };
      compList.push(line);
    }

    this.excelService.exportAsExcelFile(compList, "Components List");
  }
}
