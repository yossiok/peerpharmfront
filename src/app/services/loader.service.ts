import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  public loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { }

  add (){
    this.loadingSubject.next(true);
  }

  remove (){
    this.loadingSubject.next(false);
  }
}
