import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { observable } from "rxjs";
import { map } from "rxjs/operators";

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

  updateProposal(proposal) {
    let url = this.baseUrl + "proposals/updateProposal";
    return this.http
      .post(url, proposal)
      .pipe(map((response) => response.json()));
  }
  updateProposalStatus(status) {
    let url = this.baseUrl + "proposals/updateProposalStatus";
    return this.http.post(url, status).pipe(map((response) => response.json()));
  }

  getAllProposals() {
    let url = this.baseUrl + "proposals/getAllProposals";
    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getAllStockProposals() {
    let url = this.baseUrl + "proposals/getAllStockProposals";
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getItemsByPriceList(priceId) {
    let url = this.baseUrl + "proposals/getItemsByPriceList?priceId=" + priceId;

    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getOrdersBySearch(query) {
    let url = this.baseUrl + "proposals/getOrdersBySearch";
    return this.http.post(url, query).pipe(map((response) => response.json()));
  }

  updateSalesOrderStatus(salesOrder) {
    let url = this.baseUrl + "proposal/updateSalesOrdersStatus";
    return this.http
      .post(url, salesOrder)
      .pipe(map((response) => response.json()));
  }

  getInvoicesBySearch(query) {
    let url = this.baseUrl + "invoices/getInvoicesBySearch";

    return this.http.post(url, query).pipe(map((response) => response.json()));
  }
  getAllCmxAgents() {
    let url = this.baseUrl + "invoices/getAllCmxAgents";
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  syncLastDayInvoices() {
    let url = this.baseUrl + "invoices/syncLastDayInvoices";
    return this.http.get(url).pipe(map((response) => response.json()));
  }
}
