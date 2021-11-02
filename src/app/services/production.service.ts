import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";
import { ProductionSchedule } from "../peerpharm/production/models/production-schedule";

@Injectable({
  providedIn: "root"
})
export class ProductionService {
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";

  constructor(private http: Http) { }

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

  addProductionSchedule(ProductionSchedule): Observable<ProductionSchedule> {
    const url = this.baseUrl + 'productionSchedule/add';
    console.log(ProductionSchedule);
    console.log(url);
    return this.http
      .post(url, ProductionSchedule, this.options)
      .pipe(map(res => res.json()));
  }

  getAllProductionSchedule() {
    const url = this.baseUrl + 'productionSchedule';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }


  addProdRequest(reqForm): Observable<any> {
    let url = this.baseUrl + "productionSchedule/add";
    return this.http.post(url, JSON.stringify(reqForm), this.options).pipe(map(res => res.json()))
  }

  getAllYieldsByDate(date) {
    let url = this.baseUrl + "productionLine/yield/all?productionDate=" + date;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getLineYieldByDate(line, date) {
    const url = this.baseUrl + `productionLine/yield?line=${line}&date=${date}`;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getAllYieldsByLine(line) {
    const url = this.baseUrl + `productionLine/yield/line?productionLine=${line}`;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getTodayYields() {
    const url = this.baseUrl + `productionLine/todayYields`;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  addUpdateYield(line, yieldData) {
    let url = this.baseUrl + `productionLine/yield`;
    return this.http.post(url, JSON.stringify(yieldData), this.options).pipe(map(res => res.json()))
  }

  getAllWorkPlans() {
    const url = this.baseUrl + `productionSchedule/workplans`;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  editWorkPlan(workPlan) {
    let url = this.baseUrl + `productionSchedule/workplan`;
    return this.http.post(url, JSON.stringify(workPlan), this.options).pipe(map(res => res.json()))
  }

  deleteWorkPlan(serialNumber) {
    const url = this.baseUrl + `productionSchedule/workplan?delete=${serialNumber}`;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
