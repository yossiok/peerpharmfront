import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WarehouseService {
  private inPrintAnnounce = new Subject<any>();
  private outPrintAnnounce = new Subject<any>();
  private moveWHPrintAnnounce = new Subject<any>();

  inPrintCalled$ = this.inPrintAnnounce.asObservable();
  outPrintCalled$ = this.outPrintAnnounce.asObservable();
  moveWHPrintCalled$ = this.moveWHPrintAnnounce.asObservable();


  inCalledMethod(data) {
    this.inPrintAnnounce.next(data);
  }

  outCalledMethod(data) {
    this.outPrintAnnounce.next(data);
  }

  moveWHCalledMethod(data) {
    this.moveWHPrintAnnounce.next(data);
  }
}
