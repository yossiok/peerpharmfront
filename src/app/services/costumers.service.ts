import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CostumersService {

  constructor(private http:Http) { }

 
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

 
  getAllCostumers(){
    let url = this.baseUrl + "costumers";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getCostumerData(CostumerNumber){
    let url = this.baseUrl + "costumers?CostumerNumber="+CostumerNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getCostumerByName(costumerName){
    let url = this.baseUrl + "costumers?costumerName="+costumerName;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getByCostumerId(costumerId){
    let url = this.baseUrl + "costumers?costumerId="+costumerId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getCustomerNamesRegex(name: string) {
    let url = this.baseUrl + "costumers/regexname?name="+name
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
    
  addorUpdateCostumer(CostumerObj){
    
    let url = this.baseUrl + "costumers/add";
    return this.http.post(url, JSON.stringify(CostumerObj), this.options).pipe(map(res => res.json()))
  }

  getAllCustomersOfItem(itemNumber) {
    let url = this.baseUrl + "costumers/costumersForItem?item="+itemNumber;
    return this.http.get(url).pipe(map(res => res.json()))
  }
}
