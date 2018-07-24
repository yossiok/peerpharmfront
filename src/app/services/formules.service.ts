import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Formule } from '../peerpharm/formules/models/formule'; 
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class FormulesService {

  url: any = "http://localhost/formules/add";

  constructor(private http: Http) { }

  addFormule(formule: Formule): Observable<Formule> {
    debugger;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.url, formule, options)
      .map((res) => this.extractData(res))
      .catch(this.handleErrorObservable);
  }
  private extractData(res: any) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status ' + res.status);
    }

    let body = res.json();
    // map data function
    var data = body;
debugger;
    return data || {};
  }

  handleErrorObservable(arg0: any): any {
    throw new Error("Error getting new Formule");
  }
}
