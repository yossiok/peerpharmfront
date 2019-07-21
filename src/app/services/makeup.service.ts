import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MakeupService {

  constructor(private http: Http) { }


  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';


 // powder section //

  addNewPowderReport(powders):Observable<any> {
    debugger;
    let url = this.baseUrl + "makeup/addpowder";

    return this.http.post(url, JSON.stringify(powders), this.options).pipe(map(res => res.json()))
  }

  getPowderByItem(itemNumber):Observable<any>{
    debugger
    let url = this.baseUrl + "makeup/byitem?itemNumber="+itemNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getAllPowders():Observable<any>{
    debugger
    let url = this.baseUrl + "makeup/allpowders";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
 // end of powder section // 

 // Wet Items Section //

 addWetItemReport(wetItems):Observable<any> {
  debugger;
  let url = this.baseUrl + "makeup/addwet";

  return this.http.post(url, JSON.stringify(wetItems), this.options).pipe(map(res => res.json()))
}

getAllWetItems():Observable<any>{
  debugger
  let url = this.baseUrl + "makeup/allwet";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

// lipstick item section // 

addLipstickItem(lipstickItem):Observable<any> {
  debugger;
  let url = this.baseUrl + "makeup/addlipstick";

  return this.http.post(url, JSON.stringify(lipstickItem), this.options).pipe(map(res => res.json()))
}

getAllLipsticks():Observable<any>{
  debugger
  let url = this.baseUrl + "makeup/alllipsticks";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}


}
