import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import {UserInfo} from '../peerpharm/taskboard/models/UserInfo'


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Injectable({providedIn:'root'})
export class UsersService  {


  private baseUrl2 = '/';

  public allScreens=[];

  constructor(private http:Http, private httpClient:HttpClient) {
    this.getAllScreens().subscribe(data=>
      {
        ;
        this.allScreens=[...data];
      });
   }
   
 


  addNewUser(user:UserInfo):Observable<UserInfo>{
    let url = this.baseUrl2 + 'users'
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, JSON.stringify(user), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }
  setUserPermission(permLevel,id):Observable<UserInfo>{
    let url = this.baseUrl2 + 'users/setUserPermLevel'
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, JSON.stringify({permLevel:permLevel,userId:id}), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }



  getAllUsers():Observable<UserInfo[]>
  {
    let url = this.baseUrl2 + 'users';
    return this.http.get(url)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');

  }
  getUsersByDep(department:string):Observable<UserInfo[]>
  {
    let url = this.baseUrl2 + 'users/getusersbydep?dep='+department;
    return this.http.get(url)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  getAllActiveUsers():Observable<any>{
    return this.httpClient.get(this.baseUrl2+"sessions");
  }

  
  savePermissionToScreen(screen:any):Observable<any> {
    let url = this.baseUrl2 + 'users/setPermissionToScreen';
    ;
    return this.httpClient.post(url, JSON.stringify(screen),httpOptions);
      
  }
  changePassword(userName,newPass,oldPass):Observable<any> {
    let url = this.baseUrl2 + 'users/changepassword';
    ;
    return this.httpClient.post(url, JSON.stringify({userName:userName,newEmail:newPass,oldPassword:oldPass}),httpOptions);
      
  }
  updateEmail(userId,newEmail):Observable<any> {
    let url = this.baseUrl2 + 'users/updateEmail';
    ;
    return this.httpClient.post(url, JSON.stringify({userId:userId,newEmail:newEmail}),httpOptions);
      
  }

  
  getAllScreens():Observable<any[]>
  {
    let url = this.baseUrl2 + 'users/allscreens';
    return this.http.get(url)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');

  }

  
  
 

}
