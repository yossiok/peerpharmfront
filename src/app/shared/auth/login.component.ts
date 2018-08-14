import { AuthService } from './../../services/auth.service';
import { debounceTime } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers:[MatSnackBar, OverlayModule]
})
export class LoginComponent {
  username: string;
  password: string;
  constructor(private auth: AuthService,   private router: Router, public snackBar: MatSnackBar) { }

  loginform = true;
  recoverform = false;

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
  sendForm() {
    let loginfrm = { username: this.username, password: this.password };
    this.auth.login(loginfrm).subscribe((resp) => {
      if(resp)
      {
        this.router.navigate(['/']);
      }
      else{
        let snackBarRef = this.snackBar.open('Login failed please try again');
      }
    });

  }
}
