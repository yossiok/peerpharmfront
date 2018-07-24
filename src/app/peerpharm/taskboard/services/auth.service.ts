import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BoardModel } from '../models/board-model';
import { TaskModel } from '../models/task-model';
import { SubTaskModel } from '../models/subtask-model'
import { UserInfo } from '../models/UserInfo';

@Injectable()
export class AuthService { 
  private baseUrl = 'http://localhost/';  
  private authURL = this.baseUrl + "auth/";
  public isLoggedIn=false;

  // Resolve HTTP using the constructor
  constructor(private http: Http) { }

  verifyLogIn(): Observable<any> {
    return this.http.get(this.authURL)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

}
