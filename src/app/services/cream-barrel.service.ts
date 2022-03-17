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

  getShelvesByBarrelNumber(barrelNumber, wh): Observable<any> {
    let url =
      this.baseUrl +
      "creamBarrel/getShelvesByBarrelNumber?barrelNumber=" +
      barrelNumber +
      "&warehouse=" +
      wh;
    return this.http.get(url).pipe(map((response) => response.json()));
  }
}
