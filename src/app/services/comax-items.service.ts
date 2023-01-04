import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs-compat";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ComaxItemsService {
  constructor(private http: Http) {}
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";

  getComaxItemsByQuery(query: any): Observable<any> {
    let url = this.baseUrl + "comaxitem/getItemsByQuery";

    return this.http.post(url, query).pipe(map((response) => response.json()));
  }

  getAllCmxDepartments() {
    let url = this.baseUrl + "comaxitem/getAllCmxDepartments";

    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getAllCmxGroups() {
    let url = this.baseUrl + "comaxitem/getAllCmxGroups";

    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getAllCmxSubGroups() {
    let url = this.baseUrl + "comaxitem/getAllCmxSubGroups";

    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getAllCmxBrands() {
    let url = this.baseUrl + "comaxitem/getAllCmxBrands";

    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getLastUpdateFrom() {
    let url = this.baseUrl + "comaxitem/getLastUpdateFrom";
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getItemIsInData(itemId: string) {
    let url = `${this.baseUrl}comaxitem/get-item-is-in-data/${itemId}`;
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  deleteItem(itemId: string) {
    let url = `${this.baseUrl}comaxitem/delete-item/${itemId}`;
    return this.http.delete(url).pipe(map((response) => response.json()));
  }
}
