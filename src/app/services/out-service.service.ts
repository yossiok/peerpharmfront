import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OutService } from '../peerpharm/out-services/OutService';
import { ServiceType } from '../peerpharm/out-services/ServiceType';

@Injectable({
  providedIn: 'root'
})
export class OutServiceService {

  url: string = '/outservice'
  // private headers = new Headers({ 'Content-Type': 'application/json' });
  // private options = new RequestOptions({ headers: this.headers });

  constructor(private http: HttpClient) { }

  getAllServices(): Observable<OutService[]> {
    return <Observable<OutService[]>>this.http.get(this.url);
  }

  getAllTypes(): Observable<ServiceType[]> {
    return <Observable<ServiceType[]>>this.http.get(`${this.url}/types`);
  }

  addService(service: OutService): Observable<OutService> {
    return <Observable<any>>this.http.post(this.url, service)
  }
}
