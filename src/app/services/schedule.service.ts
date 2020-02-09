import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http';
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

  constructor(private http: Http) { }

  setNewProductionSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "schedule/addSchedule";
    
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
  // setNewMkpProductionSchedule(schedule): Observable<any> {
  //   let url = this.baseUrl + "mkpSchedule/add";
    
  //   return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  // }
  setNewMkpProductionSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "mkpSchedule/addMkp";
    
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }

  getScheduleByDate(date) {
    let url = this.baseUrl + "schedule?date=" + date;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getSchedule() {
    let url = this.baseUrl + "schedule";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  editSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "schedule/update";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()));
  }

  deleteSchedule(id): Observable<any> {
    let sced={_id:id};
    let url = this.baseUrl + "schedule/delete";
    return this.http.post(url, JSON.stringify(sced), this.options).pipe(map(res => res.json()));
  }
  updateScheduleLine(scheduleId, newLine): Observable<any> {
    let url = this.baseUrl + "schedule/update";
    var schedule = {
      schedulUpdateKey: scheduleId,
      productionLine: '' + newLine,
    }
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
  
  updateScheduleLinePosition(scheduleId, newPosition) {
    let url = this.baseUrl + "schedule/update";
    var schedule = {
      schedulUpdateKey: scheduleId,
      productionLinePosition: '' + newPosition,
    }
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }

  setOpenToToday() {
    let url = this.baseUrl + "schedule/update";
    var schedule = {setOpenToToday: true }
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }

  getOpenPrintSchedule() {
    let url = this.baseUrl + "printSchedule?open=yes";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllPrintSchedule() {
    let url = this.baseUrl + "printSchedule";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getPrintingByStatus(status) {
    let url = this.baseUrl + "printSchedule?status=yes";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getPrintScheduleByDate(date) {
    let url = this.baseUrl + "printSchedule?date=" + date;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  setNewPrintSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "printSchedule/add";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
  updatePrintSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "printSchedule/update";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
  
  deletePrintSchedule(id): Observable<any> {
    let sced={_id:id};
    let url = this.baseUrl + "printSchedule/delete";
    return this.http.post(url, JSON.stringify(sced), this.options).pipe(map(res => res.json()));
  }

  getAllSchedulePrintByDate(fromDate, toDate):Observable<any>{
    
    let url = this.baseUrl + "schedule/byDate?fromDate="+fromDate+"&toDate="+toDate;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getOpenMkpSchedule() {
    let url = this.baseUrl + "mkpSchedule";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getMkpScheduleByDate(date) {
    let url = this.baseUrl + "mkpSchedule?date=" + date;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  

  setNewMkpSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "mkpSchedule/add";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
  updateMkpSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "mkpSchedule/update";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }

  updateMkpDoneSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "mkpSchedule/updateDone";
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
  deleteMkpSchedule(id): Observable<any> {
    let sced={_id:id};
    let url = this.baseUrl + "mkpSchedule/delete";
    return this.http.post(url, JSON.stringify(sced), this.options).pipe(map(res => res.json()));
  }













  addImpRemarkFromItemTree(){
    let url = this.baseUrl + "schedule/addItemImportantRemarkToSchedule";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

}
