import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = 'http://localhost/';

  constructor(private http:Http) { }

  setNewProductionSchedule(schedule):Observable<any>{
    let url = this.baseUrl + "schedule/addSchedule";
    debugger;
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
 
  getScheduleByDate(date){
    let url = this.baseUrl + "schedule?date" +date;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getSchedule(){
    let url = this.baseUrl + "schedule";
    debugger
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
