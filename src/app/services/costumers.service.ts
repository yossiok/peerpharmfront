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
  private baseUrl = 'http://localhost/';

 
  getAllCostumers(){
    let url = this.baseUrl + "costumers";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getCostumerData(CostumerNumber){
    let url = this.baseUrl + "costumers?CostumerNumber="+CostumerNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  addorUpdateCostumer(CostumerObj){
    let url = this.baseUrl + "costumers/add";
    return this.http.post(url, JSON.stringify(CostumerObj), this.options).pipe(map(res => res.json))
  }
}
