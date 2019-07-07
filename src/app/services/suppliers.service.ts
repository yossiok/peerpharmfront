import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SuppliersService {


  constructor(private http:Http) { }

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';


  getAllAlternativeSuppliers(){
    debugger
    let url = this.baseUrl + "supplier/alternative";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getAllSuppliers(){
    
    let url = this.baseUrl + "supplier";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  
  addorUpdateSupplier(supplierObj){
    debugger
    let url = this.baseUrl + "supplier/add";
    return this.http.post(url, JSON.stringify(supplierObj), this.options).pipe(map(res => res.json()))
  }


}
