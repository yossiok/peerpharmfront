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
      if (this.authService.loggedInUser.userName && !this.check) {
        this.check = true;
        console.log(this.adminPanelAllowed);
        if (
          this.authService.loggedInUser.authorization.includes("adminPanel")
        ) {
          this.adminPanelAllowed = true;
        } else {
          this.adminPanelAllowed = false;
        }
        if (this.authService.loggedInUser.screenPermission === "1") {
          this.adminPanelView = true;
        } else {
          this.adminPanelView = false;
          console.log(this.authService.loggedInUser.screenPermission);
        }

        this.userPermission = this.authService.loggedInUser.screenPermission;
        this.userAuthorizations = this.authService.loggedInUser.authorization;
        console.log(this.adminPanelAllowed);
        console.log(this.userPermission);




        if (localStorage.getItem('url')) {
          
          let urlToForward = localStorage.getItem('url');
          localStorage.removeItem('url');
          this.router.navigate([urlToForward]);
        }
      }
    }, 1000);
  }
}
