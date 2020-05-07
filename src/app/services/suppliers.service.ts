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
    
    let url = this.baseUrl + "supplier/alternative";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getAllSuppliers(){
    
    let url = this.baseUrl + "supplier/getsuppliers";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getSuppliersDiffCollection() {
    let url = this.baseUrl + "supplier/getsuppliers";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getSuppliersByNumber(supplierN){
    let url = this.baseUrl + "supplier?suplierNumber="+supplierN
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  
  addorUpdateSupplier(supplierObj){
    
    let url = this.baseUrl + "supplier/add";
    return this.http.post(url, JSON.stringify(supplierObj), this.options).pipe(map(res => res.json()))
  }
  addToSupplierPriceList(supplierObj){
    
    let url = this.baseUrl + "supplier/addToSupplierPriceList";
    return this.http.post(url, JSON.stringify(supplierObj), this.options).pipe(map(res => res.json()))
  }
  
  updateCurrSupplier(supplierObj){
    
    let url = this.baseUrl + "supplier/update";
    return this.http.post(url, JSON.stringify(supplierObj), this.options).pipe(map(res => res.json()))
  }


}
