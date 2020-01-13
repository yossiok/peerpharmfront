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
  saveProdDailyClean(prodDailyClean){
    debugger;
    let url = this.baseUrl + "forms/saveProdDailyClean";
    return this.http.post(url, JSON.stringify(prodDailyClean), this.options).pipe(map(res => res.json()));
  }
  saveNewDailyClean(dailyCleanForm){
    debugger;
    let url = this.baseUrl + "forms/saveNewDailyClean";
    return this.http.post(url, JSON.stringify(dailyCleanForm), this.options).pipe(map(res => res.json()));
  }
  saveNewDailyCleanSecond(dailyCleanFormSecond){
    debugger;
    let url = this.baseUrl + "forms/saveNewDailyCleanSecondFloor";
    return this.http.post(url, JSON.stringify(dailyCleanFormSecond), this.options).pipe(map(res => res.json()));
  }
  addNewLibraTest(libraCalibTest){
    debugger;
    let url = this.baseUrl + "forms/addNewLibraCalibTest";
    return this.http.post(url, JSON.stringify(libraCalibTest), this.options).pipe(map(res => res.json()));
  }
  addNewWaterTest(waterTest){
    debugger;
    let url = this.baseUrl + "forms/addNewWaterTest";
    return this.http.post(url, JSON.stringify(waterTest), this.options).pipe(map(res => res.json()));
  }
  addNewTempTest(temperatureTest){
    debugger;
    let url = this.baseUrl + "forms/addNewTempTest";
    return this.http.post(url, JSON.stringify(temperatureTest), this.options).pipe(map(res => res.json()));
  }
  addNewCalibDayTest(calibrationDayTest){
    debugger;
    let url = this.baseUrl + "forms/addNewCalibDayTest";
    return this.http.post(url, JSON.stringify(calibrationDayTest), this.options).pipe(map(res => res.json()));
  }
  addNewSewerPHTest(sewerPHTest){
    debugger;
    let url = this.baseUrl + "forms/addNewSewerPHTest";
    return this.http.post(url, JSON.stringify(sewerPHTest), this.options).pipe(map(res => res.json()));
  }
  saveFirstAidCheck(firstAidCheck){
    debugger;
    let url = this.baseUrl + "forms/saveFirstAidCheck";
    return this.http.post(url, JSON.stringify(firstAidCheck), this.options).pipe(map(res => res.json()));
  }

  editCalibrationWeek(calibrationWeekFormEdit){
    debugger;
    let url = this.baseUrl + "forms/editCalibrationWeekForm";
    return this.http.post(url, JSON.stringify(calibrationWeekFormEdit), this.options).pipe(map(res => res.json()));
  }
  updateCalibTestRemarks(calibrationWeekFormEdit){
    debugger;
    let url = this.baseUrl + "forms/updateCalibTestRemark";
    return this.http.post(url, JSON.stringify(calibrationWeekFormEdit), this.options).pipe(map(res => res.json()));
  }
  updateWaterTestRemarks(waterTestEdit){
    debugger;
    let url = this.baseUrl + "forms/updateWaterTestRemarks";
    return this.http.post(url, JSON.stringify(waterTestEdit), this.options).pipe(map(res => res.json()));
  }
  updateTempTestRemarks(tempTestEdit){
    debugger;
    let url = this.baseUrl + "forms/updateTempTestRemarks";
    return this.http.post(url, JSON.stringify(tempTestEdit), this.options).pipe(map(res => res.json()));
  }
  updateCalibDayRemarks(calibDayEdit){
    debugger;
    let url = this.baseUrl + "forms/updateCalibDayRemarks";
    return this.http.post(url, JSON.stringify(calibDayEdit), this.options).pipe(map(res => res.json()));
  }
  updateSewerTestRemarks(sewerTestEdit){
    debugger;
    let url = this.baseUrl + "forms/updateSewerTestRemarks";
    return this.http.post(url, JSON.stringify(sewerTestEdit), this.options).pipe(map(res => res.json()));
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
  getLibraTestsByNumber(balanceSerialNum) {
    let url = this.baseUrl + 'forms?getLibraTestsByNumber='+balanceSerialNum;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllLibraCalibTests() {
    let url = this.baseUrl + 'forms/getAllLibraCalibTests';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllWaterTests() {
    let url = this.baseUrl + 'forms/getAllWaterTests';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllTempTests() {
    let url = this.baseUrl + 'forms/getAllTempTests';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllCalibDayTests() {
    let url = this.baseUrl + 'forms/getAllCalibDayTests';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllSewerPHTests() {
    let url = this.baseUrl + 'forms/getAllSewerPHTests';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllDailyCleanForms() {
    let url = this.baseUrl + 'forms/getAllDailyCleanForms';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllDailyCleanSecondForms() {
    let url = this.baseUrl + 'forms/getAllDailyCleanSecondForms';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllProdDailyClean() {
    let url = this.baseUrl + 'forms/getAllProdDailyClean';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
