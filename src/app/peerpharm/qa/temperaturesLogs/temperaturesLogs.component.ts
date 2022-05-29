import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { ReportsService } from "src/app/services/reports.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-temperaturesLogs",
  templateUrl: "./temperaturesLogs.component.html",
  styleUrls: ["./temperaturesLogs.component.scss"],
})
export class TemperaturesLogsComponent implements OnInit {
  user: any;
  isLogin: boolean = false;
  pageNumber: number = 1;
  pages: number;
  temperatures: Array<any> = [];
  dateSearch: Date = null;

  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router
  ) {}

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

  ngOnInit() {
    this.getUserInfo();
    if (this.isLogin) {
      this.reportsService
        .getTemperaturesLogs(String(this.pageNumber))
        .subscribe((res) => {
          this.temperatures = res.temperatures;
          this.pageNumber = res.page;
          this.pages = res.pages;
          this.router.navigate([
            `/peerpharm/qa/temperaturesLogs/${this.pageNumber}`,
          ]);
        });
    } else {
      this.router.navigate([`/peerpharm/login`]);
    }
  }

  previousPage() {
    if (this.dateSearch) {
      if (this.pageNumber > 1) {
        this.pageNumber--;
        this.reportsService
          .getTemperaturesLogsByDate(this.dateSearch, String(this.pageNumber))
          .subscribe((res) => {
            this.temperatures = res.temperatures;
            this.pageNumber = res.page;
            this.pages = res.pages;
            this.router.navigate([
              `/peerpharm/qa/temperaturesLogs/${this.pageNumber}`,
            ]);
          });
      } else {
        this.toastService.warning("זה הדף הראשון");
      }
      return;
    }
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.reportsService
        .getTemperaturesLogs(String(this.pageNumber))
        .subscribe((res) => {
          this.temperatures = res.temperatures;
          this.pageNumber = res.page;
          this.pages = res.pages;
          this.router.navigate([
            `/peerpharm/qa/temperaturesLogs/${this.pageNumber}`,
          ]);
        });
    } else {
      this.toastService.warning("זה הדף הראשון");
    }
  }

  nextPage() {
    if (this.dateSearch) {
      if (this.pageNumber < this.pages) {
        this.pageNumber++;
        this.reportsService
          .getTemperaturesLogsByDate(this.dateSearch, String(this.pageNumber))
          .subscribe((res) => {
            this.temperatures = res.temperatures;
            this.pageNumber = res.page;
            this.pages = res.pages;
            this.router.navigate([
              `/peerpharm/qa/temperaturesLogs/${this.pageNumber}`,
            ]);
          });
      } else {
        this.toastService.warning("זה הדף האחרון");
      }
      return;
    }
    if (this.pageNumber < this.pages) {
      this.pageNumber++;
      this.reportsService
        .getTemperaturesLogs(String(this.pageNumber))
        .subscribe((res) => {
          this.temperatures = res.temperatures;
          this.pageNumber = res.page;
          this.pages = res.pages;
          this.router.navigate([
            `/peerpharm/qa/temperaturesLogs/${this.pageNumber}`,
          ]);
        });
    } else {
      this.toastService.warning("זה הדף האחרון");
    }
  }

  changeDate() {
    if (this.dateSearch) {
      this.temperatures = null;
      this.pageNumber = 1;
      this.reportsService
        .getTemperaturesLogsByDate(this.dateSearch, String(this.pageNumber))
        .subscribe((res) => {
          this.temperatures = res.temperatures;
          this.pageNumber = 1;
          this.pages = res.pages;
          this.router.navigate([
            `/peerpharm/qa/temperaturesLogs/${this.pageNumber}`,
          ]);
        });
    } else {
      this.toastService.error("אנא בחר/י תאריך");
    }
  }
}