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
  getTemperaturesLogs():Observable<any> {
    const uri = `${this.baseUri}report/getAllTemperatures`
    return this.http.get(uri);
  }


  // Fetch temperatures logs by date
  getTemperaturesLogsByDate(startDate?,endDate?,startTime?,endTime?):Observable<any> {
    let obj
    if(startTime && endTime){
      obj = {
        startDate:startDate,
        endDate:endDate,
        startTime:startTime,
        endTime:endTime
      }
    }else{
      obj = {
        startDate:startDate,
        endDate:endDate,
      }
    }
    const uri = `${this.baseUri}report/getTemperaturesByDate`
    return this.http.post(uri,obj);
  }


}
