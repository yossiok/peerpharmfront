import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmService } from '../services/confirm.modal.service';

@Injectable({
  providedIn: 'root'
})
export class TwoFactor implements CanActivate {


  constructor(private auth: AuthService, private router: Router, private modalService: ConfirmService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise((resolve, reject) => {
      this.modalService.userAnserEventEmitter.subscribe((userChoice) => {
        if (userChoice) resolve(userChoice as boolean);
        else reject(false);
      });
      this.modalService.confirm({ title: "title", message: "message" });

      // this.modalService.userAnserEventEmitter.subscribe(userChoice=>
      //   {
      //     resolve(userChoice); 
      //   });
      //   this.modalService.confirm({ title: 'title', message: 'message' });

    })

  }
}
