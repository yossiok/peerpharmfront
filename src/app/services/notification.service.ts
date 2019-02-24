import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { WebsocketService } from "./../shared/chat/WebsocketService";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  url: any = "/notification/add";
  messages: Subject<any>;

  constructor(private http: Http, private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService.connect().map(
      (response: any): any => {
        debugger;
        return response;
      }
    );
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
 //  debugger;
    this.messages.next(msg);
  }

  joinNotes(sendUsers: any[]): any {
 //  debugger;
    this.wsService.joinNotes(sendUsers);
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
