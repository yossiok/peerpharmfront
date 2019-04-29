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
    let url = this.baseUrl + "inventoryRequest/add";
    return this.http.post(url, JSON.stringify(reqObj), this.options).pipe(map(res => res.json()));
  }
  closeRequest(reqObj){
    let url = this.baseUrl + "inventoryRequest/close";
    return this.http.post(url, JSON.stringify(reqObj), this.options).pipe(map(res => res.json()));
  }

  getLastRequsetId():Observable<any>  {
    let url = this.baseUrl + "inventoryRequest?lastReqId=yes" ;
    //returns one object not array
    debugger
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  //************************************************************* */
  //OR for using inventoryList - Current USE
  getInventoryDemandsList():Observable<any> {
    let url = this.baseUrl + "itemsDemand";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  //OR for using inventoryList - TBD
  getInventoryRequestsList():Observable<any> {
    let url = this.baseUrl + "inventoryRequest";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getOpenInventoryRequestsList():Observable<any> {
    let url = this.baseUrl + "inventoryRequest?open=yes";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
    //************************************************************* */


  checkIfComptNumExist(comptNum):Observable<any> {
    let url = this.baseUrl + "inventoryRequest?componentNum="+comptNum;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  checkIfOrderNumExist(OrderNum):Observable<any> {
    let url = this.baseUrl + "inventoryRequest?orderNum="+OrderNum;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
