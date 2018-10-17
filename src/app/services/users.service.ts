import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import {UserInfo} from '../peerpharm/taskboard/models/UserInfo'


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class UsersService {
  private baseUrl2 = '/';

  constructor(private http:Http) { }


  addNewUser(user:UserInfo):Observable<UserInfo>{
    let url = this.baseUrl2 + 'users'
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, JSON.stringify(user), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

}
