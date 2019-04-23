import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})

export class Procurementservice {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

  constructor(private http: Http) { }

  getProcurementOrderItemBalance() {
    const url = this.baseUrl + 'procurementOrderItemBalance';
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getProcurementOrder() {
    const url = this.baseUrl + 'procurementOrderController';
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getProcurementOrderItem() {
    const url = this.baseUrl + 'procurementOrderItemController';
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getProcurementOrderItemByOrderNumber(orderNumber) {
    console.log(orderNumber);
  //  console.log(OrderDate);
    const url = this.baseUrl + 'procurementOrderItemController?orderNumber=' + orderNumber;
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  /*EXPECTED ARRIVALS OF PROCURMENT ITEMS*/
  
  getItemExpectedArrivals(componentN): Observable<any> {
    let url = this.baseUrl + 'expectedArrivalController?componentN=' +componentN;
    return this.http.get(url).pipe( map(reponse => reponse.json())
    )
  }


  addExpectedArrivals(arrivalsArr):Observable<any>{
    let url = this.baseUrl + 'expectedArrivalController/add';
    return this.http.post(url, JSON.stringify(arrivalsArr), this.options).pipe(map(res=>res.json()));
  }
  updateExpectedArrival(arrivalsArr):Observable<any>{
    let url = this.baseUrl + 'expectedArrivalController/upadate';
    return this.http.post(url, JSON.stringify(arrivalsArr), this.options).pipe(map(res=>res.json()));
  }
  findOpenJobNumbers(): Observable<any> {
    let url = this.baseUrl + 'expectedArrivalController?openJobNumbers';
    return this.http.get(url).pipe( map(reponse => reponse.json())
    )
  }


}
