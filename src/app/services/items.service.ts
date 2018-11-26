import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http:Http) { }

  
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';



  setNewProductionSchedule(schedule):Observable<any>{
    let url = this.baseUrl + "schedule/addSchedule";
    
    return this.http.post(url, JSON.stringify(schedule), this.options).pipe(map(res => res.json()))
  }
 
  getAllItems(){
    let url = this.baseUrl + "item";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getItemData(itemNumber){
    let url = this.baseUrl + "item?itemNumber="+itemNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  addorUpdateItem(itemObj){
    console.log(itemObj);
    let url = this.baseUrl + "item/add";
    return this.http.post(url, JSON.stringify(itemObj), this.options).pipe(map(res => res.json))
  }

  updateDocuments(itemDocObj){
    let url = this.baseUrl + "item/updateDocs";
    return this.http.post(url, JSON.stringify(itemDocObj), this.options).pipe(map(res => res.json))
  }
}
