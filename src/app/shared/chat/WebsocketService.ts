

import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs/Rx';
import { ExcelService } from 'src/app/services/excel.service';

@Injectable({providedIn:'root'})
export class WebsocketService {

  // Our socket connection
  private socket;

  constructor() { }

  /*
  connect(): Rx.Subject<MessageEvent> {
    try{
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
  //  this.socket = io(`http://18.221.58.99:8200`);
   this.socket = io(`http://18.221.58.99:8200`);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.

    let observable = new Observable(observer => {
        this.socket.on('message', (data) => {
          console.log('websocket service socket connected');
          console.log("Received message from Websocket Server")
          observer.next(data);
        })

        this.socket.on('error', (err)=>
        {
          console.log(err);
          console.log('websocket service socket err- disconnecting');
          this.socket.disconnect();
        });
        return () => {
          this.socket.disconnect();
        }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('message', JSON.stringify(data));
        },
    };




    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    if(Rx&& Rx.Subject)
    return Rx.Subject.create(observer, observable);
    else  
    return null;
  }catch(e){
    console.log('something wrong with sockets- maybe port');
  }
  return null;
  }

  joinroom(taskid: string): any {
   this.socket.emit('room', taskid)
  }
*/
}
