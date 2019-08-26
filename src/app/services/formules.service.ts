import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Formule } from '../peerpharm/formules/models/formule';
import { FormuleItem } from '../peerpharm/formules/models/formule-item';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { FormulePhase } from '../peerpharm/formules/models/formule-phase';

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
  // addFormule(
  //   number: number,
  //   name: string,
  //   category: string,
  //   lastUpdate: Date,
  //   ph: number,
  //   client: string,
  //   allPhases: FormulePhase[]
  // ): Observable<Formule>  {
  //   let url= this.baseUrl+ "formules/add";
  //   const formule =  new Formule();
  //   formule.number = number;
  //   formule.name = name;
  //   formule.category = category;
  //   formule.lastUpdate = lastUpdate;
  //   formule.ph = ph;
  //   formule.client = client;
  //   formule.phases = allPhases;

  //   console.log(formule);
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http
  //     .post(url, formule, options)
  //     .map(res => this.extractData(res))
  //     .catch(this.handleErrorObservable);
  // }
  // private extractData(res: any) {
  //   if (res.status < 200 || res.status >= 300) {
  //     throw new Error('Bad response status ' + res.status);
  //   }

  //   let body = res.json();
  //   // map data function
  //   var data = body;

  //   return data || {};
  // }

  handleErrorObservable(arg0: any): any {
    throw new Error('Error getting new Formule');
  }






  
  updateFormulesForm(formToUpdate){
    debugger;
    let url = this.baseUrl + "formules/";
    return this.http.put(url, JSON.stringify(formToUpdate), this.options).pipe(map(res => res.json()));
  }
  // NOA Fomule Service

  // GET
  getFormuleByParent(parent){
    let url = this.baseUrl + "formules?byParent="+parent;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getFormuleByNumber(number){
    let url = this.baseUrl + "formules?byNumber="+number;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getFormuleDataById(id){
    let url = this.baseUrl + "formules?allData="+id;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllFormules(){
    let url = this.baseUrl + "formules?all=yes";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  
  getPhasesByFormuleId(formuleId){
    let url = this.baseUrl + "formules/phases/?byFormuleId="+formuleId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getPhaseByNumberAndFormuleId(formuleId, phaseNumber){
    let url = this.baseUrl + "formules/phases/?formuleId="+formuleId+"&number="+phaseNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  
  // PUT
  newFormule(newFormuleDetails){
    let url = this.baseUrl + "formules/add";
    return this.http.post(url, JSON.stringify(newFormuleDetails), this.options).pipe(map(res => res.json()));
  }

  getTrueArray():Observable<any> {
  
    let url = this.baseUrl + "formules/istrue";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  
  addNewPhaseToFormule(newFormulePhase){
    debugger
    let url = this.baseUrl + "formules/addPhase";
    return this.http.post(url, JSON.stringify(newFormulePhase), this.options).pipe(map(res => res.json()));
  }

  // PUT
  updateFormule(newFormuleDetails){
    let url = this.baseUrl + "formules/update";
    return this.http.put(url, JSON.stringify(newFormuleDetails), this.options).pipe(map(res => res.json()));
  }
  updateFormulePhase(phase){
    let url = this.baseUrl + "formules/updatePhase";
    return this.http.put(url, JSON.stringify(phase), this.options).pipe(map(res => res.json()));
  }
  updateFormulePhaseId(phase){
    let url = this.baseUrl + "formules/updatePhaseId";
    return this.http.put(url, JSON.stringify(phase), this.options).pipe(map(res => res.json()));
  }

  updateFormulePhaseItems(phase){
    let url = this.baseUrl + "formules/updatePhaseItems";
    return this.http.put(url, JSON.stringify(phase), this.options).pipe(map(res => res.json()));
  }

  // FORMULE PRODUCTION FORMS


  startFormuleForm(request){
    let url = this.baseUrl + "formules/forms";
    return this.http.post(url, JSON.stringify(request), this.options).pipe(map(res => res.json()));
  }

  findFormuleForm(formuleId){
    let url = this.baseUrl + "formules/forms?formuleId="+formuleId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getFormBySchedleId(scheduleId){
    let url = this.baseUrl + "formules/forms?scheduleId="+scheduleId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  updateFormuleForm(form){
    let url = this.baseUrl + "formules/forms";
    return this.http.put(url, JSON.stringify(form), this.options).pipe(map(res => res.json()));
  }

  
}
