import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlateService {

  
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = '/';

  constructor(private http:Http) { }

  getPlates():Observable<any>{
    let url = this.baseUrl + 'pallet'
    return this.http.get(url).pipe(map(reponse => reponse.json()));  
  }

  addNewPlate(plate):Observable<any>{
    let url = this.baseUrl + 'pallet/add';
    return this.http.post(url, JSON.stringify(plate), this.options).pipe(map(res=>res.json));
  }

  updatePlate(plate):Observable<any>{
    let url = this.baseUrl + 'pallet/update';
    return this.http.post(url, JSON.stringify(plate), this.options).pipe(map(res=>res.json));
  }
}
