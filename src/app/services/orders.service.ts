import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';

@Injectable()
export class OrdersService {
  
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = 'http://localhost/';

  constructor(private http:Http) { }

  getOrders():Observable<any>{
    let url = this.baseUrl + 'order'
    //debugger;
   // this.http.get(url).subscribe(res=>console.log(res));
    debugger;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    );
      //.map((res: Response) => res.json())
      //.catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  getOrderById(id):Observable<any>{
    let url = this.baseUrl + 'orderitem?orderId=' +id;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    )}

    //get item details (can move it to item service)
   getItemByNumber(itemNumber):Observable<any>{
      let url = this.baseUrl + "item?itemNumber="+itemNumber;
      return this.http.get(url).pipe(map(reponse => reponse.json())
      )}


 //edit item in order
  editItemOrder(orderItem): Observable<any> {
    let url = this.baseUrl + "orderitem/update";
    debugger;
    return this.http.post(url,JSON.stringify(orderItem) , this.options).pipe(map(res => res.json()))
  }

  
  //add new order
  addNewOrder(order):Observable<any>{
    let url = this.baseUrl + "order/add";
    return this.http.post(url, JSON.stringify(order), this.options).pipe(map(res => res.json()))
  }

  //add new item to order
  addNewOrderItem(orderItem):Observable<any>{
    let url = this.baseUrl + "orderitem/add";
    return this.http.post(url, JSON.stringify(orderItem), this.options).pipe(map(res => res.json()))
  }

  //get list of sum of all components needed to the order
  getComponentsSum(orderNumber){
  let url = this.baseUrl + "itemsDemand?orderNumber="+orderNumber;
 // debugger
  return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  deleteOrderItem(itemId){
    
    let url = this.baseUrl + "orderitem/remove";
    debugger;
    let item= {id:itemId}
    return this.http.post(url,JSON.stringify(item) , this.options).pipe(map(res => res.json()))
  }
}
