import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WorkPlanService {

  private baseUrl = "/";

  constructor(private http:HttpClient) { }

  // Multi Delete workPlans
  multiDelete(idArray) {
    let url = this.baseUrl + "workPlan/multiDelete";
    return this.http.post(url,idArray);
  }

  
}
