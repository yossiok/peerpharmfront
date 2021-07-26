import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  url: string = '/item/pricing'

  constructor(private http: HttpClient) { }

  getAllPricings(): Observable<any> {
    return <Observable<any>>this.http.get(this.url);
  }

  addPricing(pricing): Observable<any> {
    return <Observable<any>>this.http.post(this.url, pricing)
  }

  updatePricing(pricing): Observable<any> {
    return <Observable<any>>this.http.post(`${this.url}/update`, pricing)
  }

  deletePricing(pricingNumber): Observable<any> {
    return <Observable<any>>this.http.get(`${this.url}/delete?pricingNumber=${pricingNumber}`)
  }

  getLastPricing(): Observable<any> {
    return <Observable<any>>this.http.get(`${this.url}/getLast`)
  }
  
}
