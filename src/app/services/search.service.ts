import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = '/';

  constructor(private http:Http) { }


  searchByText(searchterm) {
    
    let url = this.baseUrl + "globalsearch?searchterm="+searchterm;
    return this.http.get(url ).pipe(map(res => res.json()))
  }
 
}
