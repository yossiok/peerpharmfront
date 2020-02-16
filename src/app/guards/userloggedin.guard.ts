import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserloggedinGuard implements CanActivate {

  constructor(private auth: AuthService, private router:Router) { }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean { 
      debugger;
      if(location.href.includes('/items/itemDetails'))
      {
        return true;
      }
      else{

      
    return this.auth.isUserLoggedIn().pipe(
        map((response) => { 
 
         
          if(!response)
          {
            this.router.navigate([ '/login' ]); 
          }
         return response;
        })) ; 
  }
}
}
