import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class BatchesService {
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = "/";

  constructor(private http: Http) {}

  addBatch(newBatch) {
    let url = this.baseUrl + "batch/add";
    return this.http
      .post(url, JSON.stringify(newBatch), this.options)
      .pipe(map((res) => res.json()));
  }

  addNewMkpBatch(newMkpBatch, reduce) {
    let url = this.baseUrl + "batch/addMkpBatch?reduce=" + reduce;
    return this.http
      .post(url, JSON.stringify(newMkpBatch), this.options)
      .pipe(map((res) => res.json()));
  }

  // BATCHES OF GENERAL PHARMA
  getAllBatches(): Observable<any> {
    let url = this.baseUrl + "batch";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getBatchBySearchName(name) {
    let url = this.baseUrl + "batch/search?name=" + name;
    return this.http.get(url).pipe(map((res) => res.json()));
  }

  getLastBatches(limit): Observable<any> {
    let url = this.baseUrl + "batch?limit=" + limit;

    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllBatchesYear(year): Observable<any> {
    console.log(year);
    let url = this.baseUrl + "batch?Year=" + year;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllBatchesByDate(batchN): Observable<any> {
    let url = this.baseUrl + "batch/excelExportByDate?batchN=" + batchN;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllBatchesByNumber(batchN): Observable<any> {
    let url = this.baseUrl + "batch?batchNumber=" + batchN;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getLastBatch(): Observable<any> {
    let url = this.baseUrl + "batch?lastBatch=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getBatchesByItemNumber(itemNumber): Observable<any> {
    let url = this.baseUrl + "batch?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  deleteBatch(batch) {
    let url = this.baseUrl + "batch/remove";
    return this.http
      .post(url, JSON.stringify(batch), this.options)
      .pipe(map((res) => res.json()));
  }
  setBatchToSchedule(id) {
    let url = this.baseUrl + "batch/setBatchToSchedule";
    return this.http
      .post(url, JSON.stringify({ id: id }), this.options)
      .pipe(map((res) => res.json()));
  }
  getBatchData(batchNumber) {
    let url = this.baseUrl + "batch?batchNumber=" + batchNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMkpBatchData(batchNumber) {
    let url = this.baseUrl + "batch?batchNumberMkp=" + batchNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  checkIfBatchExist(batchNumber) {
    let url = this.baseUrl + "batch/checkifexist?batchNumber=" + batchNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  // BATCHES OF MAKE-UP
  getAllMkpBatches(): Observable<any> {
    let url = this.baseUrl + "batch/mkpBatches";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  updateBatchesForm(formToUpdate) {
    let url = this.baseUrl + "batch/";
    return this.http
      .put(url, JSON.stringify(formToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }

  updateSpecvalue(batchNum, specStatus) {
    let url = this.baseUrl + "batch/specvalue";
    return this.http
      .post(url, JSON.stringify({ batchNum, specStatus }), this.options)
      .pipe(map((res) => res.json()));
  }

  getSpecvalue(batchNum) {
    let url = this.baseUrl + "batch/specvalue?batchNum=" + batchNum;
    return this.http.get(url).pipe(map((res) => res.json()));
  }

  getSpecvalueMulti(batches) {
    let url = this.baseUrl + "batch/specvalueMulti?batches=" + batches;
    return this.http.get(url).pipe(map((res) => res.json()));
  }
}
