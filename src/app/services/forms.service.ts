import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { CDK_DESCRIBEDBY_HOST_ATTRIBUTE } from '@angular/cdk/a11y';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http:Http) { }

  
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

 
  getAllForms(){
    
    let url = this.baseUrl + "formDetails";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getFormData(formId){
    let url = this.baseUrl + "formDetails?idForTitle="+formId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  addorUpdateCostumer(CostumerObj){
    let url = this.baseUrl + "costumers/add";
    return this.http.post(url, JSON.stringify(CostumerObj), this.options).pipe(map(res => res.json()))
  }
}
