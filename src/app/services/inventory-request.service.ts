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
  checkArrived(obj){
    let url = this.baseUrl + "inventoryRequest/checkArrived";
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res => res.json()));
  }

  getInventoryRequestsListWeek():Observable<any> {
    
    let url = this.baseUrl + "inventoryRequest/byDate";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getFillingRequestsList():Observable<any> {
    
    let url = this.baseUrl + "inventoryRequest/getFillingRequestsList";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  filterByDate(fromDate,toDate) {
    let url = this.baseUrl + 'inventoryRequest/filterByDate?fromDate='+fromDate+"&toDate="+toDate
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  
  getRequestByNumber(reqNumber) {
    let url = this.baseUrl + 'inventoryRequest?reqNumber='+reqNumber
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }


  getLastRequsetId():Observable<any>  {
    let url = this.baseUrl + "inventoryRequest?lastReqId=yes" ;
    //returns one object not array
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
