import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { observable } from "rxjs";
import { map } from "Rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SalesService {
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";

  constructor(private http: Http) {}

  getCustomerById(customerId) {
    let url =
      this.baseUrl +
      "proposals/getCustomerDetailsById?customerId=" +
      customerId;
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  addNewProposal(proposal) {
    let url = this.baseUrl + "proposals/addProposal";
    return this.http
      .post(url, proposal)
      .pipe(map((response) => response.json()));
  }
}
