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


  addNewLibra(newlibra){
    debugger;
    let url = this.baseUrl + "forms/addNewLibra";
    return this.http.post(url, JSON.stringify(newlibra), this.options).pipe(map(res => res.json()));
  }
  updateLibra(libra){
    debugger;
    let url = this.baseUrl + "forms/updateLibra";
    return this.http.post(url, JSON.stringify(libra), this.options).pipe(map(res => res.json()));
  }
  addNewPHToCalWeek(newph){
    debugger;
    let url = this.baseUrl + "forms/addNewPHToCalWeek";
    return this.http.post(url, JSON.stringify(newph), this.options).pipe(map(res => res.json()));
  }
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
  addOldWaterTest(waterTest){
    debugger;
    let url = this.baseUrl + "forms/addOldWaterTest";
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
  addNewPackedList(packedList){
    debugger;
    let url = this.baseUrl + "formDetails/addNewPackedList";
    return this.http.post(url, JSON.stringify(packedList), this.options).pipe(map(res => res.json()));
  }
  movePalletToPL(packedList){
    debugger;
    let url = this.baseUrl + "formDetails/movePalletToPL";
    return this.http.post(url, JSON.stringify(packedList), this.options).pipe(map(res => res.json()));
  }
  updatePLStatus(packedList){
    debugger;
    let url = this.baseUrl + "formDetails/updatePLStatus";
    return this.http.post(url, JSON.stringify(packedList), this.options).pipe(map(res => res.json()));
  }
  updatePallet(pallet){
    debugger;
    let url = this.baseUrl + "formDetails/updatePalletDetails";
    return this.http.post(url, JSON.stringify({pallet}), this.options).pipe(map(res => res.json()));
  }
  addPalletToExistPackList(packedList){
    debugger;
    let url = this.baseUrl + "formDetails/addPalletToExistPackList";
    return this.http.post(url, JSON.stringify(packedList), this.options).pipe(map(res => res.json()));
  }
  addLineToExistPallet(line){
    debugger;
    let url = this.baseUrl + "formDetails/addLineToExistPallet";
    return this.http.post(url, JSON.stringify(line), this.options).pipe(map(res => res.json()));
  }
  addPalletToExistPL(pallet){
    debugger;
    let url = this.baseUrl + "formDetails/addPalletToExistPL";
    return this.http.post(url, JSON.stringify(pallet), this.options).pipe(map(res => res.json()));
  }
  createNewPallet(pallet){
    debugger;
    let url = this.baseUrl + "formDetails/createNewPallet";
    return this.http.post(url, JSON.stringify(pallet), this.options).pipe(map(res => res.json()));
  }
  deletePalletById(pallet){
    debugger;
    let url = this.baseUrl + "formDetails/deletePalletById";
    return this.http.post(url, JSON.stringify(pallet), this.options).pipe(map(res => res.json()));
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
  updateCalibWeekRemarks(calibrationWeekFormEdit){
    debugger;
    let url = this.baseUrl + "forms/updateCalibWeekRemarks";
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
  insertBillNumber(id,billNumber){
    debugger;
    let url = this.baseUrl + "formDetails/updateBillNumber";
    return this.http.post(url, JSON.stringify({id,billNumber}), this.options).pipe(map(res => res.json()));
  }

  getCalibrationFormByYear(calibrationForm) {
    let url = this.baseUrl + 'forms?getCalibrationFormByYear='+calibrationForm;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getAllForms() {
    let url = this.baseUrl + 'formDetails';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllPackedLists() {
    let url = this.baseUrl + 'formDetails/getAllPackedLists';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllReadyForBillPLs() {
    let url = this.baseUrl + 'formDetails/getAllReadyForBillPLs';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllClosedPallets() {
    let url = this.baseUrl + 'formDetails/getAllClosedPallets';
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
    
    let url = this.baseUrl + "formDetails?formDetailsByOrder="+orderNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }




  // Libra List // 

  filterByDate(phNumber,fromDate,toDate) {
    let url = this.baseUrl + 'forms/filterByDate?fromDate='+fromDate+"&toDate="+toDate+"&phNumber="+phNumber
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  filterCalibDayTestByDate(phNumber,fromDate,toDate) {
    let url = this.baseUrl + 'forms/filterCalibDayTestByDate?fromDate='+fromDate+"&toDate="+toDate+"&phNumber="+phNumber
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  filterLibraByDate(balanceSerialNum,fromDate,toDate) {
    let url = this.baseUrl + 'forms/filterLibraByDate?fromDate='+fromDate+"&toDate="+toDate+"&balanceSerialNum="+balanceSerialNum
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  filterOldWaterByDate(system,fromDate,toDate) {
    let url = this.baseUrl + 'forms/filterOldWaterByDate?fromDate='+fromDate+"&toDate="+toDate+"&system="+system
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  filterNewWaterByDate(system,fromDate,toDate) {
    let url = this.baseUrl + 'forms/filterOldWaterByDate?fromDate='+fromDate+"&toDate="+toDate+"&system="+system
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  filterTempTestbyDate(fromDate,toDate) {
    let url = this.baseUrl + 'forms/filterTempTestbyDate?fromDate='+fromDate+"&toDate="+toDate
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  filterSewerTestByDate(fromDate,toDate) {
    let url = this.baseUrl + 'forms/filterSewerTestByDate?fromDate='+fromDate+"&toDate="+toDate
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllFirstAids() {
    let url = this.baseUrl + 'forms/getAllFirstAids';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllLibraList() {
    let url = this.baseUrl + 'forms/getAllLibraList';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getLibraByNumber(balanceSerialNum) {
    let url = this.baseUrl + 'forms?getLibraByNumber='+balanceSerialNum;
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
  getAllCalibWeekTests() {
    let url = this.baseUrl + 'forms/getAllCalibWeekTests';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getCalibWeekByPH(phNumber) {
    let url = this.baseUrl + 'forms?getCalibWeekByPH='+phNumber;
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
  getAllPLs() {
    debugger
    let url = this.baseUrl + 'packingPallltItems/getAllPL';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllqaPallets() {
    debugger
    let url = this.baseUrl + 'formDetails/getAllqaPallets';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
