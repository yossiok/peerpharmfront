import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryRequestService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';


  constructor(private http: Http) { }

  addNewRequest(reqObj){
    let url = this.baseUrl + "inventoryRequest";
    return this.http.post(url, JSON.stringify(reqObj), this.options).pipe(map(res => res.json()));
  }

  getLastRequsetId():Observable<any>  {
    let url = this.baseUrl + "inventoryRequest?lastReqId=yes" ;
    debugger;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
