import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { zip } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = '/';

  constructor(private httpClient:HttpClient) { }
  searchByText(searchterm:string) {
    const sources = ["items", "order-items", "customers", "customer-orders", "orders", "purchase-orders"];
    return zip(...sources.map(source => this.search(source, searchterm, "4")));
  }

  search(source: string, searchterm:string, limit: string | undefined = undefined){
    let params = new HttpParams();
    params = params.append("searchterm",searchterm);
    if (limit) params = params.append("limit", limit);

    let url = this.baseUrl + `search/${source}` ;
    const requestOptions = { params: params };
    return this.httpClient.get<any[]>(url, requestOptions)
  }
 
}
