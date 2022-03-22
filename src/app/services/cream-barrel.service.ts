import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CreamBarrelService {
  constructor(private http: Http) {}
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";

  //bulks and barrels
  getNewBarrelByNumber(barrelNumber) {
    let url =
      this.baseUrl +
      "creamBarrel/getNewBarrelByNumber?barrelNumber=" +
      barrelNumber;
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getShelvesByBarrelNumber(barrelNumber, wh): Observable<any> {
    let url =
      this.baseUrl +
      "creamBarrel/getShelvesByBarrelNumber?barrelNumber=" +
      barrelNumber +
      "&warehouse=" +
      wh;
    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getShelvesByBatchNumber(batchNumber, wh): Observable<any> {
    let url =
      this.baseUrl +
      "creamBarrel/getShelvesByBatchNumber?batchNumber=" +
      batchNumber +
      "&warehouse=" +
      wh;
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  addBulksToStock(allBarrels) {
    let url = this.baseUrl + "creamBarrel/addToStock";

    return this.http
      .post(url, allBarrels)
      .pipe(map((response) => response.json()));
  }
  checkoutBarrels({ barrels, wh, position, user }): Observable<any> {
    let url = this.baseUrl + "creamBarrel/checkoutBarrels";

    return this.http
      .post(url, { barrels, wh, position, user })
      .pipe(map((res) => res.json()));
  }
}
