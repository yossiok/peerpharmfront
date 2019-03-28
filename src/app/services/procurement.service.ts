import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';

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
}
