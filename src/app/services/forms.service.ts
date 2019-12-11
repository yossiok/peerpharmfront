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


  saveCalibrationWeek(calibrationWeekForm){
    debugger;
    let url = this.baseUrl + "forms/saveCalibrationWeekForm";
    return this.http.post(url, JSON.stringify(calibrationWeekForm), this.options).pipe(map(res => res.json()));
  }
  addNewLibraTest(libraCalibTest){
    debugger;
    let url = this.baseUrl + "forms/addNewLibraCalibTest";
    return this.http.post(url, JSON.stringify(libraCalibTest), this.options).pipe(map(res => res.json()));
  }

  editCalibrationWeek(calibrationWeekFormEdit){
    debugger;
    let url = this.baseUrl + "forms/editCalibrationWeekForm";
    return this.http.post(url, JSON.stringify(calibrationWeekFormEdit), this.options).pipe(map(res => res.json()));
  }

  getCalibrationFormByYear(calibrationForm) {
    let url = this.baseUrl + 'forms?getCalibrationFormByYear='+calibrationForm;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getAllForms() {
    let url = this.baseUrl + 'formDetails';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getTotalUnits() {
    let url = this.baseUrl + 'formDetails?totalUnits';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getFormData(formId){
    let url = this.baseUrl + "formDetails?idForTitle="+formId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getFormDetailsByOrder(orderNumber) { 
    debugger
    let url = this.baseUrl + "formDetails?formDetailsByOrder="+orderNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }


  // Libra List // 

  getAllLibraList(balanceSerialNum) {
    let url = this.baseUrl + 'forms?getAllLibraList='+balanceSerialNum;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllLibraCalibTests() {
    let url = this.baseUrl + 'forms/getAllLibraCalibTests';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
