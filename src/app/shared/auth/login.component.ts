import { AuthService } from './../../services/auth.service';
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MatSnackBarModule, OverlayModule]
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  redirectUrl: string = "";
  constructor(private auth: AuthService, private router: Router, public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }

  loginform = true;
  recoverform = false;

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
  sendForm() {
    let loginfrm = { username: this.username, password: this.password };
    this.auth.login(loginfrm).subscribe((resp) => {
      if (resp) {
        debugger;
        if (this.redirectUrl && this.redirectUrl != "") {
          debugger
          this.router.navigate([this.redirectUrl]);
        }
        else {
          this.router.navigate(['/#/peerpharm/allorders/orders']);
        }
      }
      else {
        let snackBarRef = this.snackBar.open('Login failed please try again');
      }
    });

  }

  ngOnInit() {
    debugger;


    this.activatedRoute.queryParams.subscribe(params => {
      this.redirectUrl = params['redirectUrl'];
      if (this.auth.isLoggedIn) {
        if (this.redirectUrl && this.redirectUrl != "") {
          this.router.navigate([this.redirectUrl]);
        }
      }
    });
  }
}
