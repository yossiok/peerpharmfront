import { Observable, Subject } from "rxjs";
import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import * as io from "socket.io-client";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  url: any = "/notification/add";
  private socket: any;
  messages: Subject<any>;
  newMessageRecivedEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: Http) {
    this.socket = io(`http://127.0.0.1:8200`);
    this.socket.on("connect", () => {
      this.socket.on("message", data => {
        this.newMessageRecivedEventEmitter.emit(data);
      });
    });
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
    this.socket.emit("message", JSON.stringify(msg));
  }

  joinNotes(sendUsers: any[]): any {
    this.socket.emit("notes", sendUsers);
  }

  addNotification(
    noteCreated: Date,
    userId: string,
    noteContent: string,
    sendUsers: [string],
    recievedUsers: [string]
  ): Observable<any> {
    const notification = {
      noteCreated: noteCreated,
      userId: userId,
      noteContent: noteContent,
      sendUsers: sendUsers,
      recievedUsers: recievedUsers
    };
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(this.url, notification, options)
      .map(res => this.extractData(res))
      .catch(this.handleErrorObservable);
  }
  private extractData(res: any) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error("Bad response status " + res.status);
    }

    let body = res.json();
    // map data function
    var data = body;

    return data || {};
  }

  handleErrorObservable(arg0: any): any {
    throw new Error("Error getting new Notification");
  }
}
