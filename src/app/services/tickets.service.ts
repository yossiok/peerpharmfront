import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { PeerPharmModule } from '../peerpharm/peerpharmmodule';

//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
@Injectable({ providedIn: 'root' })
export class TicketsService {

  // private headers = new Headers({ 'Content-Type': 'application/json' });
  // private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

  // arr: any = [];
  // private orderSrc = new BehaviorSubject<Array<string>>([]);
  // ordersArr = this.orderSrc.asObservable();

  // private openOrdersSrc = new BehaviorSubject<Boolean>(false);
  // openOrdersValidate = this.openOrdersSrc.asObservable();

  // refreshOrders: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http) {

  }

  addNewTicket(ticket): Observable<any> {
    let url = this.baseUrl + 'tickets/add';
    console.log(ticket);
    return this.http.post(url, ticket).pipe(map(res => res.json()))
  }

  getAllTickets(): Observable<any> {
    let url = this.baseUrl + 'tickets/getAllTickets';
    return this.http.get(url, {}).pipe(map(res => res.json()));
  }
}
