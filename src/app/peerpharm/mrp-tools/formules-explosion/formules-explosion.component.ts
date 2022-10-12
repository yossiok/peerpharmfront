import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "src/app/services/items.service";
import { AuthService } from "src/app/services/auth.service";
import { FormulesService } from "src/app/services/formules.service";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-formules-explosion",
  templateUrl: "./formules-explosion.component.html",
  styleUrls: ["./formules-explosion.component.scss"],
})
export class FormulesExplosionComponent implements OnInit {
  user: any = null;
  userName: string = "";
  authorized: boolean = false;
  viewFormule: boolean = false;
  loading: boolean = false;
  errors: any[] = [];

  formulesList: any[] = [];
  materialsList: any[] = [];

  formuleSimForm: FormGroup = new FormGroup({
    formuleNumber: new FormControl("", Validators.required),
    formuleName: new FormControl(""),
    weightKg: new FormControl(null, Validators.required),
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
    this.authorized = this.user.authorization.includes("viewFormule");
    console.log(this.user.authorization);
    console.log(this.user.userName);
    console.log(this.authorized);
    console.log(this.viewFormule);
  }
  getFormuleName() {
    console.log(this.formuleSimForm.value.formuleNumber);
    let formuleNum = this.formuleSimForm.value.formuleNumber;
    if (formuleNum.length == 0) {
      this.first.nativeElement.focus();
      return;
    }

    this.fourmulesService.getFormuleByNumber(formuleNum).subscribe((data) => {
      console.log(data);
      if (!data) {
        this.toastr.error("לא נמצאה פורמולה בשם זה");
        this.first.nativeElement.focus();
        return;
      }
      if (data.msg) {
        console.log(data.msg);
        this.toastr.error(data.msg);
        this.first.nativeElement.focus();
        return;
      } else if (data) {
        this.formuleSimForm.controls.formuleName.setValue(data.formuleName);
        return;
      }
    });
  }
  addFormule() {
    console.log(this.formuleSimForm.value);
    if (!this.formuleSimForm.valid) {
      alert("אחד הנתונים חסר");
      return;
    } else if (this.formuleSimForm.value.weightKg < 1) {
      alert("הכמות צריכה להיות גדולה מאפס");
      return;
    }

    this.formulesList.push(this.formuleSimForm.value);
    this.formuleSimForm.reset();
    this.first.nativeElement.focus();
  }
  clearFormuleSim() {
    this.formuleSimForm.reset();
  }

  removeFormule(idx) {
    this.formulesList.splice(idx, 1);
  }
  getMaterialsForList() {
    if (!this.authorized) {
      alert("אין לך הרשאה לראות נתונים אלה.");
      return;
    }

    if (this.formulesList.length == 0) {
      this.toastr.error("רשימת המוצרים ריקה, יש להכניס לפחות מוצר אחד לרשימה");
      return;
    }
    this.loading = true;
    this.errors = [];
    this.materialsList = [];
    this.itemsService
      .getMaterialsForList(this.formulesList)
      .subscribe((data) => {
        console.log(data);
        this.loading = false;
        if (data.msg) {
          this.toastr.error(data.msg);
          console.log(data.msg);
        } else if (data && data.length > 0) {
          for (let material of data) {
            if (material.msg) {
              this.errors.push(material.msg);
              this.toastr.error(material.msg);
            } else {
              this.materialsList.push(material);
            }
          }
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
}
