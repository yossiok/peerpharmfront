import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { PeerPharmModule } from '../peerpharm/peerpharmmodule';

//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
@Injectable()
export class OrdersService {

  public test:string="a";
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

  arr: any = [];
  private orderSrc = new BehaviorSubject<Array<string>>([]);
  ordersArr = this.orderSrc.asObservable();

  private openOrdersSrc = new BehaviorSubject<Boolean>(false);
  openOrdersValidate = this.openOrdersSrc.asObservable();

  refreshOrders:EventEmitter<any> = new EventEmitter();

  constructor(private http: Http) {
    debugger;
   }

  getOrders(): Observable<any> {
    let url = this.baseUrl + 'order'
    //
    // this.http.get(url).subscribe(res=>console.log(res));

    return this.http.get(url).pipe(map(reponse => reponse.json())
    );
    //.map((res: Response) => res.json())
    //.catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }
  getAllOrders(): Observable<any> {
    let url = this.baseUrl + 'order/allorders'
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    );
  }
  getAllOpenOrderItems(): Observable<any> {
    let url = this.baseUrl + 'order/allOpenOrderItems'
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    );
  }

  // getOrderCompileData(orderNumber): Observable<any> {
  //   let url = this.baseUrl + 'packingPallltItems?getAmounts=yes&orderNumber=' + orderNumber;
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));
  // }

  //edit  order
  allocatedDone(id): Observable<any> {
    let url = this.baseUrl + "order/updateStatus";
    return this.http.post(url, JSON.stringify({id}), this.options).pipe(map(res => res.json()))
  }
  editOrder(order): Observable<any> {
    let url = this.baseUrl + "order/update";
    return this.http.post(url, JSON.stringify(order), this.options).pipe(map(res => res.json()))
  }
  editOrderStage(orderItem,stage): Observable<any> {
    let url = this.baseUrl + "order/update?updateStage="+stage;
    return this.http.post(url, JSON.stringify(orderItem), this.options).pipe(map(res => res.json()))
  }

  deleteOrder(order) {
    let url = this.baseUrl + "order/remove";
    return this.http.post(url, JSON.stringify(order), this.options).pipe(map(res => res.json()))
  }

  getLastOrderNumber() {
    let url = this.baseUrl + "order?lastOrderNumber=yes";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getOrderById(id): Observable<any> {
    let url = this.baseUrl + 'orderitem?orderId=' + id;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getOrderItemsByNumber(orderNumber): Observable<any> {
    let url = this.baseUrl + 'orderitem?orderNumber=' + orderNumber;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    );
  }
  getOrderItemsByitemNumber(itemNumber): Observable<any> {
    let url = this.baseUrl + 'orderitem?itemNumber=' + itemNumber;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    );
  }

  getOrdersByArea(orderArea): Observable<any> {
    let url = this.baseUrl + 'order?orderArea=' + orderArea;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    );
  }
  getOrderAmounts(): Observable<any> {
    debugger
    let url = this.baseUrl + 'orderitem/getamounts' ;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    );
  }

  getOpenOrdersItems():Observable<any>{
    let url = this.baseUrl + 'orderitem?openOrdersItems=open';
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    )
  }
  getOrderByNumber(orderNumber): Observable<any> {
    let url = this.baseUrl + 'order?orderNumber=' + orderNumber;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    )
  }
  getOrderByType(): Observable<any> {
    debugger
    let url = this.baseUrl + 'order/type';
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    )
  }
  getOrdersIdsByNumbers(ordersNumbers): Observable<any> {
    let url = this.baseUrl + 'order?multyOrdersNumbersIds=' + ordersNumbers;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    )
  }

  getMultiOrdersIds(idsArray): Observable<any> {
    let url = this.baseUrl + 'orderitem?multiOrdersIds=' + idsArray;
    return this.http.get(url).pipe(
      map(reponse => reponse.json())
    )
  }
  //get item details (can move it to item service)
  getItemByNumber(itemNumber): Observable<any> {
    let url = this.baseUrl + "item?getLicsens=yes&itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json())
    )
  }


  //edit item in order
  editItemOrder(orderItem): Observable<any> {
    let url = this.baseUrl + "orderitem/update";
    return this.http.post(url, JSON.stringify(orderItem), this.options).pipe(map(res => res.json()))
  }
  editItemOrderStatus(orderItem): Observable<any> {
    let url = this.baseUrl + "orderitem/updateStatus";
    return this.http.post(url, JSON.stringify(orderItem), this.options).pipe(map(res => res.json()))
  }
  editFormuleCheck(formuleStatus,id): Observable<any> {
    debugger
    let url = this.baseUrl + "orderitem/updateCheckFormule";
    return this.http.post(url, JSON.stringify({formuleStatus:formuleStatus,id:id}), this.options).pipe(map(res => res.json()))
  }


  //add new order
  addNewOrder(order): Observable<any> {
    let url = this.baseUrl + "order/add";
    return this.http.post(url, JSON.stringify(order), this.options).pipe(map(res => res.json()))
  }

  addNewProductDoc(productDoc): Observable<any> {
    debugger;
    let url = this.baseUrl + "order/productDocg";
    return this.http.post(url, JSON.stringify(productDoc), this.options).pipe(map(res => res.json()))
  }

  //add new item to order
  addNewOrderItem(orderItem): Observable<any> {
    let url = this.baseUrl + "orderitem/add";
    return this.http.post(url, JSON.stringify(orderItem), this.options).pipe(map(res => res.json()))
  }

  //get list of sum of all components needed to the order
  getComponentsSum(orderNumber) {
    let url = this.baseUrl + "itemsDemand?orderNumber=" + orderNumber;
    debugger
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  deleteOrderItem(itemId) {
    let url = this.baseUrl + "orderitem/remove";
    let item = { id: itemId }
    return this.http.post(url, JSON.stringify(item), this.options).pipe(map(res => res.json()))
  }
  getOrderItemByNumberAndOrder(item, order) {
    let url = this.baseUrl + "orderitem?item=" + item+"&order="+ order;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }



  sendOrderData(tempArr: Array<string>) {
    this.orderSrc.next(tempArr);
  }

  getAllOpenOrdersItems(status:boolean){
    this.openOrdersSrc.next(status);
  }


  getItemPackingList(itemNumber,orderNumber): Observable<any> {
    let url = this.baseUrl + 'packingPallltItems?itemNPackingList=' + itemNumber+"&orderNumber="+orderNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json())
    );
  }

  getPalletsDataByOrderNumber(orderNumber): Observable<any> {
    let url = this.baseUrl + 'packingPallltItems?orderPalletsData=' + orderNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json())
    );
  }
  getOrderPackingList(orderNumber): Observable<any> {
    let url = this.baseUrl + 'packingPallltItems?orderPallets=' + orderNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json())
    );
  }
  //not done at server side
  addItemToPackingList(newObj) {
    let url = this.baseUrl + 'packingPallltItems/add';
    return this.http.post(url, JSON.stringify(newObj), this.options).pipe(map(res => res.json()));
  }

  //get items required elements for item: components/stickers/boxes/cartons
  
  getOrderComponents(orderItemsNumArr): Observable<any> {
    let url = this.baseUrl + 'orderitem/getComponents?orderItemsNumArr=' + orderItemsNumArr;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }


  getOrderItemsFromArray(): Observable<any> {
    let url = this.baseUrl + 'orderitem/getOrderItemsFromArray';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
}
