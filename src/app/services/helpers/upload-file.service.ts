import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private http: HttpClient) { }

  //pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
  pushFileToStorage(file: File, src: string, itemNumber: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('src', src);
    formdata.append('itemN', itemNumber);
    //const req = new HttpRequest('POST', 'http://localhost:8080/api/files/upload', formdata, {
    const req = new HttpRequest('POST', '/upload/api/files/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    //return this.http.get('http://localhost:8080/api/files/all');
    return this.http.get('/upload/api/files/all');
  }
}
