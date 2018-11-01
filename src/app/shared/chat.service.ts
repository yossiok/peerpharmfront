import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketService } from './chat/WebsocketService';

 
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;
  
  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService, private http:Http) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        debugger;
        return response;
      })
   }
  
  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
    debugger;
    this.messages.next(msg);
  }
  
  joinroom(taskid: string): any {
    this.wsService.joinroom(taskid);
  }
  
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = 'http://localhost/';

  getAllChatMessages(taskid){
    let url = this.baseUrl + "chatmessages?taskid="+taskid;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}