import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BoardModel } from '../peerpharm/taskboard/models/board-model';
import { TaskModel } from '../peerpharm/taskboard/models/task-model';
import { SubTaskModel } from '../peerpharm/taskboard/models/subtask-model'
import * as moment from 'moment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TasksService {
  // private instance variable to hold base url
  private baseUrl = 'http://localhost:3001/';
  private baseUrl2 = 'http://localhost/';
  private boardUrl = 'http://localhost/dep/';
  ///dep/sales/tasks
  //private taskUrl = 'http://localhost/tasks/';
  private addDepUrl = this.baseUrl2 + "dep/add/";

  // Resolve HTTP using the constructor
  constructor(private http: Http) { }

  getBoards(): Observable<BoardModel[]> {
    return this.http.get(this.boardUrl)
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
  updateTask(_id: string, list: string, boardid: string): Observable<any> {
    
    const url = this.boardUrl + boardid + '/tasks/' + _id;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    debugger;
    return this.http.post(url, JSON.stringify({ list: list }), options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  createTask(boardid: string, list: string, name: string, dueDate: Date, priority: string): Observable<any> {
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


    const taskobj = {
      'list': list,
      'name': name,
      'dueDate': d,
      'priority': priority
    }
    console.log(taskobj);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    //this.http.post(url, JSON.stringify(taskobj), options).subscribe(res=>console.log("QQQ "   + res.json) );


    return this.http.post(url, JSON.stringify(taskobj), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  createSubTask(mainTaskId: string, name: string, dueDate: Date, priority: string, depId: string, userId: string, list: string): Observable<any> {
    const url = this.baseUrl2 + 'subtasks/add';
    debugger;
    var d = new Date(dueDate);

    const subTaskObj = {
      'mainTaskId': mainTaskId,
      'name': name,
      'dueDate': d,
      'priority': priority,
      'depId': depId,
      'userId': userId,
      'list': list
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

    debugger;
    return this.http.post(url, JSON.stringify(updateObj), options)
      .map((res: Response) => console.log(res.json()))
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }
  createBoard(board: BoardModel): Observable<any> {
    console.log('post');
    console.log(board);
    const url = this.addDepUrl;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, JSON.stringify(board), options)
      .map((res: Response) => { debugger; console.log(res.json) })
      .catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }



}


