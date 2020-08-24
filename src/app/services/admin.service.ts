import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = '/';

  constructor(private http:Http) { }


  addDepartment(newDepartment) {
    
    let url = this.baseUrl + "admin/newDepartment";
    return this.http.post(url, JSON.stringify(newDepartment), this.options).pipe(map(res => res.json()))
  }
  addStation(newDepartment) {
    
    let url = this.baseUrl + "admin/newStation";
    return this.http.post(url, JSON.stringify(newDepartment), this.options).pipe(map(res => res.json()))
  }

  getAllBatches():Observable<any>{
    let url = this.baseUrl + 'batch'
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
