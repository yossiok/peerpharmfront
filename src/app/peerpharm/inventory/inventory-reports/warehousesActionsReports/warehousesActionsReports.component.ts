import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../services/auth.service";
import { InventoryService } from "../../../../services/inventory.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-warehousesActionsReports",
  templateUrl: "./warehousesActionsReports.component.html",
  styleUrls: ["./warehousesActionsReports.component.scss"],
})
export class WarehousesActionsReportsComponent implements OnInit {
  user: any;
  isLogin: boolean = false;
  logs: any = {};
  sums: any = {};
  loader: boolean = false;
  startDate: any;
  endDate: any;
  startDateDisplay: Date;
  endDateDisplay: Date;

  constructor(
    private authService: AuthService,
    private inventoryService: InventoryService,
    private toastService: ToastrService,
    private router: Router,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    if (!this.isLogin) {
      this.router.navigate([`/peerpharm/login`]);
    }
  }

  getUserInfo() {
    if (this.authService.loggedInUser) {
      this.user = this.authService.loggedInUser;
      if (
        this.user &&
        this.user.authorization &&
        Number(this.user.screenPermission) <= 6
      ) {
        this.isLogin = true;
      }
    }
  }

  getReport() {
    if (this.startDate && this.endDate) {
      this.loader = true;
      this.inventoryService
        .getWhActionsReport(this.startDate, this.endDate)
        .subscribe((res) => {
          if (res.sums["summary"] > 0) {
            this.logs = res.logesPerWh;
            this.sums = res.sums;
            this.startDateDisplay = new Date(this.startDate);
            this.endDateDisplay = new Date(this.endDate);
            this.loader = false;
          } else {
            this.loader = false;
            this.toastService.warning("לא נמצאו תוצאות, נסה/י שנית");
          }
        });
    } else {
      this.loader = false;
      this.toastService.warning("חובה לציין תאריך התחלה וסיום");
    }
  }

  exportAsXLSX() {
    const showList = [];
    // In actions
    let obj = {};
    obj["מחסנים/פרמטרים"] = "כניסות"
    for (const [key, value] of Object.entries(this.logs)) {
      obj[key] = value["in"];
    }
    obj["כולם ביחד"] = this.sums["in"];
    showList.push(obj);


    // Out actions
    obj = {}
    obj["מחסנים/פרמטרים"] = "יציאות"
    for (const [key, value] of Object.entries(this.logs)) {
      obj[key] = value["out"];
    }
    obj["כולם ביחד"] = this.sums["out"];
    showList.push(obj);

    // wareHouseChange actions
    obj = {}
    obj["מחסנים/פרמטרים"] = "בין מחסנים"
    for (const [key, value] of Object.entries(this.logs)) {
      obj[key] = value["wareHouseChange"];
    }
    obj["כולם ביחד"] = this.sums["whChange"];
    showList.push(obj);

    // shelfChange actions
    obj = {}
    obj["מחסנים/פרמטרים"] = "שינוי מדף"
    for (const [key, value] of Object.entries(this.logs)) {
      obj[key] = value["shelfChange"];
    }
    obj["כולם ביחד"] = this.sums["shelf"];
    showList.push(obj);

    

    // summary
    obj = {}
    obj["מחסנים/פרמטרים"] = "סיכום"
    for (const [key, value] of Object.entries(this.logs)) {
      obj[key] = value["summary"];
    }
    obj["כולם ביחד"] = this.sums["summary"];
    showList.push(obj);


    this.excelService.exportAsExcelFile(showList, `דו"ח תנועת מחסנים`);
  }
}
