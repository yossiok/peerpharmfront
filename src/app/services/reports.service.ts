import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  constructor(private http:HttpClient) { }

  private baseUri = "/";

  // Fetch temperatures logs
  getTemperaturesLogs(pageNumber?):Observable<any> {
    const uri = `${this.baseUri}report/getAllTemperatures?pageNumber=${pageNumber}`
    return this.http.get(uri);
  }


  // Fetch temperatures logs by date
  getTemperaturesLogsByDate(dateSearch,pageNumber?):Observable<any> {
    const obj = {
      dateSearch:dateSearch
    }
    const uri = `${this.baseUri}report/getTemperaturesByDate?pageNumber=${pageNumber}`
    return this.http.post(uri,obj);
  }


}
