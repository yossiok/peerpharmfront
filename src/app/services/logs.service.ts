import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LogsService {


  constructor(private http:HttpClient) { }

  private baseUri = "/";

  getAll():Observable<any> {
    return this.http.get('/logs');
  }

  getQaLogs(startDate?, endDate?):Observable<any> {
    let uri
    if(startDate && endDate){
      uri = `${this.baseUri}logs/getQaLogs?startDate=${startDate}&endDate=${endDate}`;
    }else{
      uri = `${this.baseUri}logs/getQaLogs`;
    }
    return this.http.get(uri);
  }


}
