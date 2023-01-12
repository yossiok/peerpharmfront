import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShellsService {

  constructor(private http: HttpClient) {}
  private restUrl = "/api/v1/shell";

  getShellById = (id:string) => {
    return this.http.get(`${this.restUrl}/${id}`);
  }
}
