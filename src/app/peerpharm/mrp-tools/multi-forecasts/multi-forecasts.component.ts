import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "src/app/services/items.service";
import { AuthService } from "src/app/services/auth.service";
import { FormulesService } from "src/app/services/formules.service";
import { CostumersService } from "src/app/services/costumers.service";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-multi-forecasts",
  templateUrl: "./multi-forecasts.component.html",
  styleUrls: ["./multi-forecasts.component.scss"],
})
export class MultiForecastsComponent implements OnInit {
  user: any = null;
  userName: string = "";
  authorized: boolean = false;
  viewFormule: boolean = false;
  forecastLists: any[] = [];
  forecastListsCopy: any[] = [];
  customersList: any[] = [];
  yearsList: any[] = [];
  formulesOnly: any[] = [];
  errors: any[] = [];
  materialsList: any[] = [];
  loading: boolean = false;
  componentsList: any[] = [];
  itemsList: any[] = [];

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private fourmulesService: FormulesService,
    private excelService: ExcelService,
    private customersService: CostumersService
  ) {}

  forecastSearchForm: FormGroup = new FormGroup({
    forecastNumber: new FormControl(""),
    forecastYear: new FormControl(""),
    forecastQuarter: new FormControl(""),
    customerId: new FormControl(""),
    isSelected: new FormControl(false),
  });

  ngOnInit(): void {
    this.getUser();
    this.getAllCustomers();
    this.getForecastLists();
    this.getYearsList();
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

  getYearsList() {
    let today = new Date();
    let currentYear = today.getFullYear();
    console.log(currentYear);
    for (let i = 0; i < 5; i++) {
      this.yearsList.push(currentYear + i);
    }
    console.log(this.yearsList);
  }

  getForecastLists() {
    this.itemsService.getAllForecastLists().subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data && data.length > 0) {
        // for (let forecast of data) {
        //   if (forecast.customerId) {
        //     let idx = this.customersInForecasts.findIndex(
        //       (customer) => customer == forecast.customerId
        //     );
        //     if (idx < 0) {
        //       this.customersInForecasts.push(forecast.customerId);
        //     }
        //   }
        // }
        this.forecastLists = data;
        this.forecastListsCopy = data;

        return;
      } else if (!data || data.length == 0) {
        this.toastr.error("לא נמצאו תחזיות");
        return;
      }
    });
  }
  filterByNumber() {
    let number = this.forecastSearchForm.value.forecastNumber;
    console.log(number);
    if (number && number != "all") {
      this.forecastLists = this.forecastListsCopy.filter(
        (forecast) => forecast.forecastNumber == number
      );
    } else if (number && number == "all") {
      this.forecastLists = this.forecastListsCopy;
    }
  }
  filterByYear() {
    let year = this.forecastSearchForm.value.forecastYear;
    console.log(year);
    if (year && year != "all") {
      this.forecastLists = this.forecastListsCopy.filter(
        (forecast) => forecast.forecastYear == year
      );
    } else if (year && year == "all") {
      this.forecastLists = this.forecastListsCopy;
    }
  }
  filterByQuarter() {
    let quarter = this.forecastSearchForm.value.forecastQuarter;
    console.log(quarter);
    if (quarter && quarter != "all") {
      this.forecastLists = this.forecastListsCopy.filter(
        (forecast) => forecast.forecastQuarter.toUpperCase() == quarter
      );
    } else if (quarter && quarter == "all") {
      this.forecastLists = this.forecastListsCopy;
    }
  }
  filterByCustomer() {
    let customer = this.forecastSearchForm.value.customerId;
    console.log(customer);
    if (customer && customer != "all") {
      this.forecastLists = this.forecastListsCopy.filter(
        (forecast) =>
          forecast.customerId && forecast.customerId.includes(customer)
      );
    } else if (customer && customer == "all") {
      this.forecastLists = this.forecastListsCopy;
    }
  }

  clearFilters() {
    this.forecastSearchForm.reset();
    this.forecastLists = this.forecastListsCopy;
    this.materialsList = [];
    this.componentsList = [];
    this.errors = [];
    this.formulesOnly = [];
  }

  isSelected(checked, i) {
    this.forecastLists[i].isSelected = checked;
    console.log(this.forecastLists);
  }
  selectAll(checked) {
    try {
      for (let forecast of this.forecastLists) {
        forecast.isSelected = checked;
      }
      console.log(this.forecastLists);
    } catch (error) {
      console.log(error);
    }
  }

  getComponentsForList() {
    if (this.forecastLists.length == 0) {
      this.toastr.error("רשימת התחזיות ריקה");
      return;
    } else {
      this.forecastLists = this.forecastLists.filter(
        (forecast) => forecast.isSelected == true
      );
      if (this.forecastLists.length == 0) {
        this.toastr.error("רשימת התחזיות ריקה, יש לבחור לפחות תחזית אחת");
        return;
      }
    }
    this.loading = true;
    this.componentsList = [];
    this.materialsList = [];
    this.errors = [];
    this.itemsList = [];
    for (let forecast of this.forecastLists) {
      for (let item of forecast.itemsList) {
        let idx = this.itemsList.findIndex(
          (itemL) => itemL.itemNumber == item.itemNumber
        );
        if (idx > -1) {
          this.itemsList[idx].quantity += item.quantity;
        } else {
          this.itemsList.push(item);
        }
      }
    }
    console.log(this.itemsList);
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

    if (this.forecastLists.length == 0) {
      this.toastr.error("רשימת התחזיות ריקה");
      return;
    } else {
      this.forecastLists = this.forecastLists.filter(
        (forecast) => forecast.isSelected == true
      );
      if (this.forecastLists.length == 0) {
        this.toastr.error("רשימת התחזיות ריקה, יש לבחור לפחות תחזית אחת");
        return;
      }
    }
    this.loading = true;
    this.errors = [];
    this.materialsList = [];
    this.componentsList = [];
    this.itemsList = [];
    for (let forecast of this.forecastLists) {
      for (let item of forecast.itemsList) {
        item.totalWeight = (item.quantity * item.unitWeight) / 1000;
        let idx = this.itemsList.findIndex(
          (itemL) => itemL.itemNumber == item.itemNumber
        );
        if (idx > -1) {
          this.itemsList[idx].totalWeight += item.totalWeight;
        } else {
          this.itemsList.push(item);
        }
      }
    }
    console.log(this.itemsList);

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
