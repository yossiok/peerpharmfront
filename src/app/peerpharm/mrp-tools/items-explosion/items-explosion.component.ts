import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "src/app/services/items.service";
import { AuthService } from "src/app/services/auth.service";
import { FormulesService } from "src/app/services/formules.service";
import { CostumersService } from "src/app/services/costumers.service";
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
  newForecast: boolean = false;

  itemsList: any[] = [];
  materialsList: any[] = [];
  errors: any[] = [];
  loading: boolean = false;
  componentsList: any[] = [];
  formulesOnly: any[] = [];
  forecastLists: any[] = [];
  customersList: any[] = [];

  forecastListForm: FormGroup = new FormGroup({
    forecastName: new FormControl("", Validators.required),
    forecastYear: new FormControl("", Validators.required),
    forecastQuarter: new FormControl("", Validators.required),
    customerId: new FormControl("", Validators.required),
    forecastNumber: new FormControl(""),
  });

  orderSimForm: FormGroup = new FormGroup({
    itemNumber: new FormControl("", Validators.required),
    itemName: new FormControl(""),
    barcode: new FormControl(""),
    quantity: new FormControl(null, Validators.required),
    unitWeight: new FormControl(null, Validators.required),
    components: new FormControl([]),
    formuleOnly: new FormControl(false),
  });

  @ViewChild("first") first: ElementRef;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private fourmulesService: FormulesService,
    private excelService: ExcelService,
    private customersService: CostumersService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllCustomers();
    this.getForecastLists();
  }
  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized =
      this.user.authorization.includes("newProposal") ||
      this.user.authorization.includes("newOrder");
    this.viewFormule = this.user.authorization.includes("viewFormule");
    console.log(this.user.authorization);
    console.log(this.user.userName);
    console.log(this.authorized);
    console.log(this.viewFormule);
  }

  getAllCustomers() {
    this.customersService.getAllCostumers().subscribe((data) => {
      console.log(data);
      if (data.msg) {
        console.log(data.msg);
        this.toastr.error(data.msg);
        return;
      } else if (data.length > 0) {
        this.customersList = data;
      } else {
        this.toastr.error("לא נמצאו לקוחות המתאימים לחיפוש");
      }
    });
  }

  getForecastLists() {
    this.itemsService.getAllForecastLists().subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data && data.length > 0) {
        this.forecastLists = data;
        return;
      } else if (!data || data.length == 0) {
        this.toastr.error("לא נמצאו תחזיות");
        return;
      }
    });
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
        if (!data.itemName && data.formuleNumber) {
          this.orderSimForm.controls.itemName.setValue(data.formuleName);
          this.orderSimForm.controls.unitWeight.setValue(1000);
          this.orderSimForm.controls.components.setValue([]);
          this.orderSimForm.controls.formuleOnly.setValue(true);
        } else if (data.itemName) {
          this.orderSimForm.controls.itemName.setValue(data.itemName);
          this.orderSimForm.controls.barcode.setValue(data.barcode);
          this.orderSimForm.controls.unitWeight.setValue(data.weight);
          this.orderSimForm.controls.components.setValue(data.components);
        }
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
    if (this.orderSimForm.value.formuleOnly) {
      this.formulesOnly.push(
        this.orderSimForm.value.itemNumber + " הוא פורמולה ללא מוצר"
      );
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
    for (let item of this.itemsList) {
      item.totalWeight = (item.quantity * item.unitWeight) / 1000;
    }

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

  saveMaterialsList() {
    let listName = prompt("הכנס שם לתחזית");
    console.log(listName);
    if (listName.length == 0) {
      alert("יש להכניס שם");
      return;
    }
    console.log(this.itemsList);
    console.log(this.materialsList);
    console.log(this.errors);
    console.log(this.formulesOnly);
    let forecast = {
      itemsList: this.itemsList,
      materials: this.materialsList,
      errMessages: this.errors,
      formulesOnly: this.formulesOnly,
      forecastName: listName,
      user: this.user.firstName + " " + this.user.lastName,
      reportDate: new Date(),
    };

    this.itemsService.addMaterialsForecast(forecast).subscribe((data) => {
      console.log(data);
    });
  }

  saveList() {
    let list = this.forecastListForm.value;

    if (!this.forecastListForm.valid) {
      alert("יש להזין שם תחזית, שנה, רבעון ולקוח");
      return;
    }

    console.log(list);
    if (!this.itemsList || this.itemsList.length == 0) {
      alert("התחזית צריכה להכיל לפחות מוצר אחד");
      return;
    }
    list.itemsList = this.itemsList;
    list.user = this.user.firstName + " " + this.user.lastName;
    list.forecastDate = new Date();
    list.formulesOnly = this.formulesOnly;
    list.errMessages = this.errors;
    this.itemsService.saveForecastList(list).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data.forecastNumber) {
        let idx = this.forecastLists.findIndex(
          (forecast) => forecast.forecastNumber == data.forecastNumber
        );
        if (idx > -1) {
          this.forecastLists.splice(idx, 1, data);
        } else {
          this.forecastLists.push(data);
          this.forecastListForm.controls.forecastNumber.setValue(
            data.forecastNumber
          );
        }
        this.toastr.success(`תחזית מספר ${data.forecastNumber} נשמרה`);
        return;
      }
    });
  }
  getForecastByNumber(event) {
    console.log(event.value);
    let forecastNumber = event.value;
    if (forecastNumber) {
      this.itemsService
        .getForecastByNumber(forecastNumber)
        .subscribe((data) => {
          console.log(data);
          if (data.msg) {
            this.toastr.error(data.msg);
            return;
          } else if (data) {
            this.itemsList = data.itemsList;
            this.forecastListForm.controls.forecastNumber.setValue(
              data.forecastNumber
            );
            this.forecastListForm.controls.forecastName.setValue(
              data.forecastName
            );
            this.forecastListForm.controls.forecastYear.setValue(
              data.forecastYear
            );
            this.forecastListForm.controls.forecastQuarter.setValue(
              data.forecastQuarter || "q4"
            );
            this.forecastListForm.controls.customerId.setValue(
              data.customerId || "General"
            );
            this.formulesOnly = data.formulesOnly;
            this.errors = data.errMessages;
            this.materialsList = [];
            this.componentsList = [];

            return;
          }
        });
    }
  }

  deleteList() {
    let conf = confirm("אתה עומד למחוק את התחזית לצמיתות, האם להמשיך?");
    if (!conf) {
      return;
    }
    let forecastNumber = this.forecastListForm.value.forecastNumber;
    if (!forecastNumber) {
      this.toastr.error("מספר תחזית לא קיים");
      return;
    }
    this.itemsService.deleteForecast(forecastNumber).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data && data.forecastNumber) {
        this.toastr.success(`תחזית מספר ${data.forecastNumber} נמחקה`);
        let idx = this.forecastLists.findIndex(
          (forecast) => forecast.forecastNumber == data.forecastNumber
        );
        this.forecastLists.splice(idx, 1);
        this.oldForecastView();
        return;
      }
    });
  }

  newForecastView() {
    this.newForecast = true;
    this.itemsList = [];
    this.errors = [];
    this.formulesOnly = [];
    this.forecastListForm.reset();
    this.materialsList = [];
    this.componentsList = [];
  }
  oldForecastView() {
    this.newForecast = false;
    this.itemsList = [];
    this.errors = [];
    this.formulesOnly = [];
    this.forecastListForm.reset();
    this.materialsList = [];
    this.componentsList = [];
  }
}
