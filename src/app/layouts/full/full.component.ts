import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
declare var $: any;

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { AlertModalComponent } from "src/app/component/alert-modal/alert-modal.component";
import { AuthService } from "src/app/services/auth.service";
import { NotificationService } from "src/app/services/notification.service";
import { UsersService } from "src/app/services/users.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  themeColor: string = "r";
  databaseName: any;
  testing: boolean = false;

  constructor(
    public router: Router,
    private utilsService: UtilsService,
    private usersService: UsersService,
    private authService: AuthService,
    private notifications: NotificationService
  ) {}
  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;

  options = {
    theme: "light",
    dir: "ltr",
    layout: "vertical",
    sidebartype: "overlay",
    sidebarpos: "fixed",
    headerpos: "fixed",
    boxed: "full",
    navbarbg: "skin5",
    sidebarbg: "skin1",
    logobg: "skin1",
  };

  Logo() {
    this.expandLogo = !this.expandLogo;
    if (this.expandLogo) {
      //   $(".sidebar-link , .sidebar-item").css("width","250px");
    } else {
      $(".sidebar-link , .sidebar-item").css("width", "250px");
    }
  }

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/starter"]);
    }
    this.defaultSidebar = this.options.sidebartype;
    this.handleSidebar();
    this.getTheme();
    this.showUserAlerts();
  }
  //Dani Morag: 16/08/2021
  // the time the user doesn't touch his workstation
  public idleTime: any;
  //if he doesn't touch the workstation for more then the timeout (currently 3600000 miliseconds), he will be redirected to the login page
  //Dani Morag 22/08/2021 change the timeout from 1 hour(3600000) to three hours (10,800,000)
  onMouseMove(e) {
    clearTimeout(this.idleTime);
    // console.log(this.idleTime);
    this.idleTime = setTimeout(() => {
      this.router.navigate(["/login"]);
    }, 1000 * 60 * 60 * 3);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case "full":
      case "iconbar":
        if (this.innerWidth < 1170) {
          this.options.sidebartype = "mini-sidebar";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case "overlay":
        if (this.innerWidth < 767) {
          this.options.sidebartype = "mini-sidebar";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  getTheme() {
    this.utilsService.getTheme().subscribe((theme) => {
      console.log(theme);
      this.themeColor =
        theme.database == "testing"
          ? "rgb(30, 240, 81)"
          : theme.database == "dev1"
          ? "#75b9d8"
          : "#13135f";
      this.databaseName =
        theme.database == "testing" || theme.database == "dev1"
          ? "DEV ENVIRONMENT!!!!"
          : "";
      this.testing = theme.database == "testing" || "dev1" ? true : false;
    });
  }

  showUserAlerts() {
    setTimeout(() => {
      let userAlerts = this.authService.loggedInUser.loginAlerts;
      // console.log(userAlerts);
      for (let alert of userAlerts) {
        let titleObj = alert.titleObj;
        // console.log(titleObj);
        let msg = alert.msg;
        // console.log(msg);
        this.notifications.sendGlobalMessage(msg, titleObj).subscribe((ok) => {
          // console.log(ok);
          this.notifications
            .deleteUserAlerts(this.authService.loggedInUser.userName)
            .subscribe((res) => {
              // console.log(res);
            });
        });
      }
    }, 5000);
  }

  toggleSidebarType() {
    switch (this.options.sidebartype) {
      case "full":
      case "iconbar":
        this.options.sidebartype = "mini-sidebar";
        $(".sidebar-link , .sidebar-item").css("width", "65px");
        break;

      case "overlay":
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case "mini-sidebar":
        $(".sidebar-link , .sidebar-item").css("width", "250px");
        if (this.defaultSidebar === "mini-sidebar") {
          this.options.sidebartype = "full";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }
}
