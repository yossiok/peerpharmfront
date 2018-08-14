import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BoardModel } from '../peerpharm/taskboard/models/board-model';
import { TaskModel } from '../peerpharm/taskboard/models/task-model';
import { SubTaskModel } from '../peerpharm/taskboard/models/subtask-model'
import { UserInfo } from '../peerpharm/taskboard/models/UserInfo';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
 

@Injectable({
  providedIn: 'root' 
})
export class AuthService {
 
 
  private baseUrl = 'http://localhost/';  
  private authURL = this.baseUrl + "auth/";
  public isLoggedIn=false;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'  
    })
  };


  // Resolve HTTP using the constructor
  constructor(private http: Http, private httpClient:HttpClient) { }

  getLoggedInUser(): Observable<any> {
    return this.httpClient.get(this.authURL );
     
  }

  isUserLoggedIn():Observable<boolean>
  {
  
    return   <Observable<boolean>> this.httpClient.get(this.baseUrl+"verifysession");
  }



  login(userObj):Observable<boolean>
  {
  debugger;
    return   <Observable<boolean>> this.httpClient.post((this.baseUrl+"login"), userObj,this.httpOptions);
  }



 
}
