import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: Http) { }


  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';



  setNewProductionSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "schedule/addSchedule";

    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }

  getAllItems() {
    let url = this.baseUrl + "item";
    return this.http.get(url).pipe(map(reponse => reponse.json())); 
  }

  getItemData(itemNumber) {
    let url = this.baseUrl + "item?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getPlateImg(itemNumber) {
    let url = this.baseUrl + "item?plateImg=yes&itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  addorUpdateItem(itemObj) {
    console.log(itemObj);
    debugger
    let url = this.baseUrl + "item/add";
    return this.http.post(url, JSON.stringify(itemObj), this.options).pipe(map(res => res.json))
  }

  updateDocuments(itemDocObj) {
    let url = this.baseUrl + "item/updateDocs";
    return this.http.post(url, JSON.stringify(itemDocObj), this.options).pipe(map(res => res.json))
  }
  updateLicenseLimition(itemDocObj) {
    let url = this.baseUrl + "item/updateDocs?updateLicenseLimition=yes";
    return this.http.post(url, JSON.stringify(itemDocObj), this.options).pipe(map(res => res.json()))
  }





  startNewItemObservable() { 
    let itemResultObservable: Observable<any[]> = new Observable(observer => {
      let self=this;
      let skip = 0;
      let limit = 500;
      startNewCall(skip, limit);
      function startNewCall(skip, limit) {
        let url="/item?skip=" + skip + "&limit=" + limit; 
        console.log("new call=> "+url);
        self.http.get(url).subscribe(response => { 
          let items = <any[]>response.json();
          skip = skip + 500;   
          if (items.length > 0) {
            console.log("got items bigger than 0");
            observer.next(items);
            startNewCall(skip, limit);
          }
          else {
            console.log("complete!!");
            observer.complete();
          }
        })

      }
    });

    return itemResultObservable;
  }

}