import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BoardModel } from '../peerpharm/taskboard/models/board-model';
import { TaskModel } from '../peerpharm/taskboard/models/task-model';
import { SubTaskModel } from '../peerpharm/taskboard/models/subtask-model'
import { UserInfo } from '../peerpharm/taskboard/models/UserInfo';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Injectable()
export class AuthService {
 
  private baseUrl = 'http://localhost/';  
  private authURL = this.baseUrl + "auth/";
  public isLoggedIn=false;

  // Resolve HTTP using the constructor
  constructor(private http: Http, private httpClient:HttpClient) { }

  getLoggedInUser(): Observable<any> {
    return this.http.get(this.authURL)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  isUserLoggedIn():Observable<boolean>
  {
    return   <Observable<boolean>> this.httpClient.get(this.baseUrl+"verifysession");
  }

}
