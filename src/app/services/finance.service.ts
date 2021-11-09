import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FinanceService {
  url: string = "/finance/reports";

  constructor(private http: HttpClient) {}

  getAllItemsSales(): Observable<any> {
    return <Observable<any>>this.http.get(this.url);
  }

  addSalesCost(itemCosts): Observable<any> {
    return <Observable<any>>this.http.post(this.url, itemCosts);
  }

  updateSalesCost(itemCost): Observable<any> {
    return <Observable<any>>this.http.post(`${this.url}/update`, itemCost);
  }

  deletePricing(itemNumber): Observable<any> {
    return <Observable<any>>(
      this.http.get(`${this.url}/delete?itemNumber=${itemNumber}`)
    );
  }

  getLastPricing(): Observable<any> {
    return <Observable<any>>this.http.get(`${this.url}/getLast`);
  }
}
