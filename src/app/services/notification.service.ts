import { Observable, Subject } from "rxjs";
import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import * as io from "socket.io-client";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  url: any = "/notification/add";
  private socket: any;
  messages: Subject<any>;
  newMessageRecivedEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  newInventoryReqEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  private baseUrl = '/';
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) {
  
  //  this.socket = io(`http://127.0.0.1:8200`);// Localhost
    /* this.socket = io(`http://18.221.58.99:8200`);
     this.socket.on("connect", () => {
      console.log('notification service socket connected');
       this.socket.on("message", data => {
        
        this.newMessageRecivedEventEmitter.emit(data);
       });

       this.socket.on("error", data => {
        console.log('notification service socket err- disconnecting');
        this.socket.disconnect();
       });


      this.socket.on("newInventoryReq", data => {
      this.newInventoryReqEventEmitter.emit(data);
       });
     });*/
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
  //  this.socket.emit("message", JSON.stringify(msg));
  }

      // let titleObj = {};
      //   titleObj.index = 60;
      //   titleObj.title = "Password about to expire";
      //   titleObj.users = req.user._doc.username;
      //   titleObj.force = false;

      //   let msg = "תוקף סיסמתך יפוג בעוד מספר ימים. אנא החלף סיסמא"

      //   let userAlert = { titleObj, msg }

  sendGlobalMessage(msg, titleObj) {
    return this.http.get(`/notification/sendglobalmessage?title=${JSON.stringify(titleObj)}&msg=${msg}`)
  }

  joinNotes(sendUsers: any[]): any {
    this.socket.emit("notes", sendUsers);
  }

addUserAlert(message, titleObj, userName): Observable<any> {
  let userAlert = { titleObj, message }
  return this.http.post('/notification/addUserAlert?userName='+userName, userAlert, this.options)
}

deleteUserAlerts(userName) {
  return this.http.get('/notification/deleteUserALerts?userName='+userName)
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

    return this.http
      .post(this.url, notification, this.options)
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


  editNotification(note): Observable<any> {
    let url = this.baseUrl + "notification/update";
    return this.http.post(url, JSON.stringify(note), this.options).pipe(map(res => res.json()));
  }
}
