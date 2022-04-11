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

  getQaLogs(pageNumber):Observable<any> {
    const uri = `${this.baseUri}logs/getQaLogs?pageNumber=${pageNumber}`;
    return this.http.get(uri);
  }


}
