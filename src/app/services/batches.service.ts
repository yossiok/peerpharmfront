import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = 'http://localhost/';

  constructor(private http:Http) { }

  getAllBatches():Observable<any>{
    let url = this.baseUrl + 'batch'
    return this.http.get(url).pipe(map(reponse => reponse.json()));  
  }
}
