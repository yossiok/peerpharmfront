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
  private baseUrl = '/';

  constructor(private http:Http) { }

  setNewProductionSchedule(schedule):Observable<any>{
    let url = this.baseUrl + "schedule/addSchedule";
    debugger;
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
 
  getScheduleByDate(date){
    let url = this.baseUrl + "schedule?date=" +date;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getSchedule(){
    let url = this.baseUrl + "schedule";
    debugger
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  editSchedule(schedule):Observable<any>{
    let url = this.baseUrl + "schedule/update";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()));
  }

  updateScheduleLine(scheduleId, newLine):Observable<any>{
    let url = this.baseUrl + "schedule/update";
    var schedule={
      schedulUpdateKey:scheduleId,
      productionLine:''+newLine,
    }
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }

  updateScheduleLinePosition(scheduleId, newPosition){
    let url = this.baseUrl + "schedule/update";
    var schedule={
      schedulUpdateKey:scheduleId,
      productionLinePosition:''+newPosition,
    }
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }

  
  getOpenPrintSchedule(){
    let url = this.baseUrl + "printSchedule";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getPrintScheduleByDate(date){
    let url = this.baseUrl + "printSchedule?date="+date;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  setNewPrintSchedule(schedule):Observable<any>{
    let url = this.baseUrl + "printSchedule/add";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
  updatePrintSchedule(schedule):Observable<any>{
    let url = this.baseUrl + "printSchedule/update";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
}
