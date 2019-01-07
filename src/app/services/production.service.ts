import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";
import { ProdSchedule } from "../peerpharm/production/models/production-schedule";

@Injectable({
  providedIn: "root"
})
export class ProductionService {
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";

  constructor(private http: Http) {}

  addNewProductionLine(line): Observable<any> {
    let url = this.baseUrl + "productionLine/add";
    return this.http
      .post(url, JSON.stringify(line), this.options)
      .pipe(map(res => res.json()));
  }

  getLineByNumber(lineNumber) {
    let url = this.baseUrl + "productionLine?lineNumber=" + lineNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getAllLines() {
    let url = this.baseUrl + "productionLine";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  // editSchedule(schedule):Observable<any>{
  // let url = this.baseUrl + "schedule/update";
  // return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()));
  // }

  addProductionSchedule(prodSchedule): Observable<ProdSchedule> {
    const url = this.baseUrl + 'productionSchedule/add';
    console.log(prodSchedule);
    console.log(url);
    return this.http
      .post(url, prodSchedule, this.options)
      .pipe(map(res => res.json()));
  }

  getAllProductionSchedule() {
    const url = this.baseUrl + 'productionSchedule';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
