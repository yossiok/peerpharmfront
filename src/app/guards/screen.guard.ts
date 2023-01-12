import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScreenGuard implements CanActivate {

  constructor(private authService: AuthService, private userService: UsersService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
 return new Promise((resolve, reject)=>
 {
  if (this.authService.loggedInUser) {
    let screenPermission = this.authService.loggedInUser.screenPermission;
    if (this.userService.allScreens.length>0) {

        resolve(this.checkForScreenPermission(screenPermission,next.data.title, this.userService.allScreens))
    }
    else
    {
      this.userService.getAllScreens().subscribe(data=>
        {

            resolve(this.checkForScreenPermission(screenPermission,next.data.title, data))

        });
    }
  }
  else
  {
    this.authService.getLoggedInUser().subscribe(data=>
      {

        let screenPermission = this.authService.loggedInUser.screenPermission;
        if (this.userService.allScreens.length>0) {

            resolve(this.checkForScreenPermission(screenPermission,next.data.title, this.userService.allScreens))
        }
        else
        {
          this.userService.getAllScreens().subscribe(data=>
            {

                resolve(this.checkForScreenPermission(screenPermission,next.data.title, data))

            });
        }
      })
  }
 });


  }

checkForScreenPermission(screenPermission, title, arrOfScreens):boolean
{
  //find the screen

  let allpermissionString =arrOfScreens.find(x => x.name == title).permission;
  let allPermissionsArr = allpermissionString.split(',');
  if (allPermissionsArr.includes(screenPermission)) {
    return true;
  }
  else
  {
    return false;
  }
}


}
