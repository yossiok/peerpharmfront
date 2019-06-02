import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Formule } from '../peerpharm/formules/models/formule';
import { FormuleItem } from '../peerpharm/formules/models/formule-item';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class FormulesService {
  url: any = '/formules/add';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

  constructor(private http: Http) {}

  // for formule.component.ts
  addFormule(
    number: number,
    name: string,
    category: string,
    lastUpdate: Date,
    ph: string,
    client: string,
    allItems: FormuleItem[]
  ): Observable<Formule>  {
    let url= this.baseUrl+ "formules/add";
    const formule =  new Formule();
    formule.number = number;
    formule.name = name;
    formule.category = category;
    formule.lastUpdate = lastUpdate;
    formule.ph = ph;
    formule.client = client;
    formule.items = allItems;

    console.log(formule);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(url, formule, options)
      .map(res => this.extractData(res))
      .catch(this.handleErrorObservable);
  }
  private extractData(res: any) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status ' + res.status);
    }

    let body = res.json();
    // map data function
    var data = body;

    return data || {};
  }

  handleErrorObservable(arg0: any): any {
    throw new Error('Error getting new Formule');
  }







  // NOA Fomule Service
  getFormuleByNumber(number){
    debugger
    let url = this.baseUrl + "formules?byNumber="+number;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllFormules(){
    let url = this.baseUrl + "formules?all=yes";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  
  newFormule(newFormuleDetails){
    let url = this.baseUrl + "formules/add";
    return this.http.post(url, JSON.stringify(newFormuleDetails), this.options).pipe(map(res => res.json()));
  }

}
