import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserloggedinGuard implements CanActivate {

  constructor(private auth: AuthService, private router:Router) { }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean { 
    return this.auth.isUserLoggedIn().map(e => {
      if (e) {
        return true;
      }
      else{
        this.router.navigate(['/login']); 
      }
    });
  }
}
