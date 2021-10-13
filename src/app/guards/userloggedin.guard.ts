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



     /* if(location.href.includes('/items/itemDetails'))
      {
        return false;
      }
      else{
*/

if(this.auth.isLoggedIn)
{
 
  return true;
}
else{

  if(!state.url.includes('starter') && !state.url.includes('login'))
  {
    //save the state url
    localStorage.setItem('url', state.url);
  }
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
// }
}
