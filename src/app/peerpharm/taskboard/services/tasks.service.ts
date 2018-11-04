import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BoardModel } from '../models/board-model';
import { TaskModel } from '../models/task-model';
import { SubTaskModel } from '../models/subtask-model'
import * as moment from 'moment';
import { HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TasksService {
  // private instance variable to hold base url
  private baseUrl2 = '/';
  private boardUrl = '/dep/';
  private tasksUrl = '/tasks/';
  ///dep/sales/tasks 
  private addDepUrl = this.baseUrl2 + "dep/add/";

  // Resolve HTTP using the constructor
  constructor(private http: Http) { }

  getBoardsByDepartments(departments: Array<string>): Observable<BoardModel[]> {
    var str = departments.join();
    let boardUrl = this.boardUrl + str;
    return this.http.get(boardUrl)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  getTasks(boardid: string): Observable<TaskModel[]> {
    const url = this.boardUrl + boardid + '/tasks';
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  getSubTasks(mainTaskId: string): Observable<SubTaskModel[]> {
    //const url = this.baseUrl2 + 'subtasks/&mainTaskId='+mainTaskId;
    const url = this.baseUrl2 + 'subtasks/' + mainTaskId;
    console.log(url);
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }
  updateTask(_id: string, list: string, boardid: string): any {

    const url = this.boardUrl + boardid + '/tasks/' + _id;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify({ list: list }), options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }


  updateSubTask(subtask:SubTaskModel): any {
    const url = this.baseUrl2 + 'subtasks/updateSubTask';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify( subtask ), options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }



  createTask(boardid: string, list: string, name: string, dueDate: Date, priority: string, deps:any): Observable<any> {
    console.log('post');
    
    const url = this.boardUrl + boardid + '/tasks';

    var d = new Date(dueDate);
    //dueDate= moment(d).format("DDMMYYY");
    /*    const taskobj = {
          'board': boardid,
          'list': list,
          'name': name,
          'dueDate': d,
          'priority': priority
        } */
        let departments=deps.map(d=>d.id );


    const taskobj = {
      'list': list,
      'name': name,
      'dueDate': d,
      'priority': priority,
      'departments':departments
    }
    console.log(taskobj);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    //this.http.post(url, JSON.stringify(taskobj), options).subscribe(res=>console.log("QQQ "   + res.json) );


    return this.http.post(url, JSON.stringify(taskobj), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  createSubTask(mainTaskId: string, name: string, dueDate: Date, priority: string, depId: string, userId: string, status:string): any {
     
    const url = this.baseUrl2 + 'subtasks/add';

    var d = new Date(dueDate);

    const subTaskObj = {
      'mainTaskId': mainTaskId,
      'name': name,
      'dueDate': d,
      'priority': priority,
      'depId': depId,
      'status':status,
      'userId': userId
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, JSON.stringify(subTaskObj), options)
      .map((res: Response) => console.log(res.json))
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }


  addDepToMainTask(mainTaskId: string, depId: string) {
    const url = this.boardUrl + depId + '/tasks/' + mainTaskId;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let updateObj = {
      _id: mainTaskId,
      depId: depId,
      req: 'addDep'
    }
    return this.http.post(url, JSON.stringify(updateObj), options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }
  createBoard(board: BoardModel): any {
    console.log('post');
    console.log(board);
    const url = this.addDepUrl;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, JSON.stringify(board), options)
      .map((res: Response) => { console.log(res.json) })
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  getAvatarImagesByUserId(userId: string): any {
 
    const url = this.tasksUrl + 'getAvatarsByUserId?id='+userId;
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }



  
  getAllDepartments( ): any {
 
    const url = this.tasksUrl + 'getAllDepartments';
      
    return this.http.get(url )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }



}


