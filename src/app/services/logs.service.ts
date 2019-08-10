import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {


  constructor(private httpclient:HttpClient) { }

  getAll():Observable<any> {
    return this.httpclient.get('/logs');
  }

}
