import {
  Component,
  AfterViewInit,
  OnInit,
  AfterViewChecked,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
@Component({
  templateUrl: "./starter.component.html",
})
export class StarterComponent implements OnInit {
  subtitle: string;
  adminPanelAllowed: boolean = false;
  adminPanelView: boolean;
  userAuthorizations: any[];
  userPermission: string;
  check: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    this.subtitle = "Welcome";
  }

  ngOnInit() {
    setTimeout(() => {
      let user = this.authService.loggedInUser;
      if (user.userName && !this.check) {
        this.check = true;
        console.log("adminPanelView authorized: ", this.adminPanelAllowed);
        if (user.authorization.includes("adminPanel")) {
          this.adminPanelAllowed = true;
        } else {
          this.adminPanelAllowed = false;
        }
        if (user.screenPermission === "1" || user.screenPermission == "2") {
          this.adminPanelView = true;
        } else {
          this.adminPanelView = false;
          console.log("Screen Pemission level: ", user.screenPermission);
        }

        this.userPermission = user.screenPermission;
        this.userAuthorizations = user.authorization;
        console.log("Admin Panle allowed: ", this.adminPanelAllowed);
        console.log("User permission level: ", this.userPermission);

        if (localStorage.getItem("url")) {
          let urlToForward = localStorage.getItem("url");
          localStorage.removeItem("url");
          this.router.navigate([urlToForward]);
        }
      }
    }, 1000);
  }
}
