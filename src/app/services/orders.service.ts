import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";
import { PeerPharmModule } from "../peerpharm/peerpharmmodule";
import { OrdersGroupbyCustomersForm } from "../peerpharm/reports/orders-report-grouped-by-clients/orders-report-grouped-by-clients.component";

//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
@Injectable()
export class OrdersService {
  public test: string = "a";
  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";
  private openOrderReport = new Subject<any[]>();

  arr: any = [];
  private orderSrc = new BehaviorSubject<Array<string>>([]);
  ordersArr = this.orderSrc.asObservable();

  private openOrdersSrc = new BehaviorSubject<Boolean>(false);
  openOrdersValidate = this.openOrdersSrc.asObservable();

  refreshOrders: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http) {}

  getOrders(): Observable<any> {
    let url = this.baseUrl + "order";
    //
    // this.http.get(url).subscribe(res=>console.log(res));

    return this.http.get(url).pipe(map((reponse) => reponse.json()));
    //.map((res: Response) => res.json())
    //.catch((error: any) => Observable.throw(error.json().error) || 'Server Error');
  }

  // Get open orders reports with items and return excel
  getOpenOrderReport() {
    let url = this.baseUrl + "order/openReport";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllOrders(): Observable<any> {
    let url = this.baseUrl + "order/allorders";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getLastAllOrders(limit): Observable<any> {
    let url = this.baseUrl + "order/allorders?limit=" + limit;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOrdersReport(): Observable<any> {
    let url = this.baseUrl + "order/allorders";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllSalesByCMX(): Observable<any> {
    let url = this.baseUrl + "order/allsalesbycmx";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllItems(): Observable<any> {
    let url = this.baseUrl + "order/allItems";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllOpenOrderItemsNew(): Observable<any> {
    let url = this.baseUrl + "order/allOpenOrderItemsNew";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllOpenOrderItems(): Observable<any> {
    let url = this.baseUrl + "order/allOpenOrderItems";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllOpenOrderItemsByItemNumber(itemNumber): Observable<any> {
    let url =
      this.baseUrl + "order?allOpenOrderItemsByItemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOrdersGroupByClient(values: OrdersGroupbyCustomersForm) {
    let url = this.baseUrl + "order/orders-reports-grouped-by-clients";
    return this.http.post(url, values).pipe(map((res) => res.json()));
  }

  getOrdersCustomers() {
    let url = this.baseUrl + "order/orders-customers";
    return this.http.get(url).pipe(map((res) => res.json()));
  }

  // Name OR(!) Number
  getAllOpenOrderItemsByItemValue(itemValue): Observable<any> {
    let url = this.baseUrl + "order?allOpenOrderItemsByItemValue=" + itemValue;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllOpenOrdersByIncludeNumber(number){
    let url = this.baseUrl + "order/getOpenOrdersByIncludeNumber?number=" + number;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllOpenOrdersByIncludeCustomer(number){
    let url = this.baseUrl + "order/getOpenOrdersByIncludeCustomer?number=" + number;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllOpenOrdersByOrderDate(startDate,endDate){
    let url = this.baseUrl + `order/getOpenOrdersByOrderDate?startDate=${startDate}&endDate=${endDate}`
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllOpenOrdersByDeliveryDate(startDate,endDate){
    let url = this.baseUrl + `order/getOpenOrdersByDeliveryDate?startDate=${startDate}&endDate=${endDate}`
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllOpenOrderByStage(stage){
    let url = this.baseUrl + `order/getOpenOrdersByStage?stage=${stage}`
    return this.http.get(url).pipe(map((reponse) => reponse.json()));

  }

  // getOrderCompileData(orderNumber): Observable<any> {
  //   let url = this.baseUrl + 'packingPallltItems?getAmounts=yes&orderNumber=' + orderNumber;
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));
  // }

  //edit  order
  allocatedDone(id): Observable<any> {
    let url = this.baseUrl + "order/updateStatus";
    return this.http
      .post(url, JSON.stringify({ id }), this.options)
      .pipe(map((res) => res.json()));
  }
  editOrder(order): Observable<any> {
    let url = this.baseUrl + "order/update";
    return this.http
      .post(url, JSON.stringify(order), this.options)
      .pipe(map((res) => res.json()));
  }
  editOrderStage(orderItem, stage): Observable<any> {
    let url = this.baseUrl + "order/update?updateStage=" + stage;
    return this.http
      .post(url, JSON.stringify(orderItem), this.options)
      .pipe(map((res) => res.json()));
  }

  deleteOrder(order) {
    let url = this.baseUrl + "order/remove";
    return this.http
      .post(url, JSON.stringify(order), this.options)
      .pipe(map((res) => res.json()));
  }

  getLastOrderNumber() {
    let url = this.baseUrl + "order?lastOrderNumber=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrderById(id): Observable<any> {
    let url = this.baseUrl + "orderitem?orderId=" + id;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOrderItemsByNumber(orderNumber): Observable<any> {
    let url = this.baseUrl + "orderitem?orderNumber=" + orderNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrderItemsByitemNumber(itemNumber): Observable<any> {
    let url = this.baseUrl + "orderitem?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOrderByCustomer(customer): Observable<any> {
    let url = this.baseUrl + "orderitem?customer=" + customer;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrdersByCustomerId(customerId): Observable<any> {
    let url =
      this.baseUrl + "orderitem/getOrdersByCustomerId?customerId=" + customerId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrdersByItemNumber(itemNumber): Observable<any> {
    let url =
      this.baseUrl + "orderitem/getOrdersByItemNumber?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrderItemsByCustomerId(customerId): Observable<any> {
    let url =
      this.baseUrl +
      "orderitem/getOrderItemsByCustomerId?customerId=" +
      customerId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllCustomerOrderedItems(customer) {
    let url =
      this.baseUrl + "orderitem/productsForCustomer?customer=" + customer;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getCostumerByOrder(orderNumber): Observable<any> {
    let url =
      this.baseUrl +
      "order/costumerNameByOrderNumber?orderNumber=" +
      orderNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOrdersByArea(orderArea): Observable<any> {
    let url = this.baseUrl + "order?orderArea=" + orderArea;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOpenOrdersLimit(limit: number): Observable<any> {
    let url = this.baseUrl + "order/limit?limit=" + limit;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOpenOrdersByUser(user): Observable<any> {
    let url = this.baseUrl + "order?user=" + user;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOrderAmounts(): Observable<any> {
    let url = this.baseUrl + "orderitem/getamounts";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getOpenOrdersItems(): Observable<any> {
    let url = this.baseUrl + "orderitem?openOrdersItems=open";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrderByNumber(orderNumber): Observable<any> {
    let url = this.baseUrl + "order?orderNumber=" + orderNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAmountsForProject(orderNumber, projectId): Observable<any> {
    let url =
      this.baseUrl +
      "order?amountsForProject=" +
      orderNumber +
      "&projectId=" +
      projectId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrderByType(): Observable<any> {
    let url = this.baseUrl + "order/type";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrdersIdsByNumbers(ordersNumbers): Observable<any> {
    let url = this.baseUrl + "order?multyOrdersNumbersIds=" + ordersNumbers;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getMultiOrdersIds(idsArray): Observable<any> {
    let url = this.baseUrl + "orderitem?multiOrdersIds=" + idsArray;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  //Uri report
  getUriReport(): Observable<any> {
    let url = this.baseUrl + "order/urireport";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getProblematicsReport() {
    let url = this.baseUrl + "order/allOpenProblematicOrderItems";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getProblematicsReportForPurchase(itemType) {
    let url;
    if (itemType == "all")
      url = this.baseUrl + "order/allOpenProblematicOrderItemsForPurchase";
    else
      url =
        this.baseUrl +
        "order/allOpenProblematicOrderItemsForPurchase?itemType=" +
        itemType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  //get item details (can move it to item service)
  getItemByNumber(itemNumber): Observable<any> {
    let url = this.baseUrl + "item?getLicsens=yes&itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemsFromOrder(orderNumber) {
    let url =
      this.baseUrl + "orderitem/itemsByOrder?orderNumber=" + orderNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  //edit item in order
  editItemOrder(orderItem): Observable<any> {
    let url = this.baseUrl + "orderitem/update";
    return this.http
      .post(url, JSON.stringify(orderItem), this.options)
      .pipe(map((res) => res.json()));
  }
  editItemOrderStatus(orderItem): Observable<any> {
    let url = this.baseUrl + "orderitem/updateStatus";
    return this.http
      .post(url, JSON.stringify(orderItem), this.options)
      .pipe(map((res) => res.json()));
  }
  reOpenOrderItem(item): Observable<any> {
    let url = this.baseUrl + "orderitem/reopenorderitem";

    return this.http
      .post(url, JSON.stringify(item), this.options)
      .pipe(map((res) => res.json()));
  }

  changeReqStatus(status, id, type): Observable<any> {
    let url = this.baseUrl + "orderitem/changeReqStatus";
    return this.http
      .post(
        url,
        JSON.stringify({ status: status, id: id, type: type }),
        this.options
      )
      .pipe(map((res) => res.json()));
  }
  editFormuleCheck(formuleStatus, id): Observable<any> {
    let url = this.baseUrl + "orderitem/updateCheckFormule";
    return this.http
      .post(
        url,
        JSON.stringify({ formuleStatus: formuleStatus, id: id }),
        this.options
      )
      .pipe(map((res) => res.json()));
  }

  //add new order
  addNewOrder(order): Observable<any> {
    let url = this.baseUrl + "order/add";
    return this.http
      .post(url, JSON.stringify(order), this.options)
      .pipe(map((res) => res.json()));
  }
  sendFormuleToProduction(production): Observable<any> {
    let url = this.baseUrl + "orderitem/sendFormuleToProduction";
    return this.http
      .post(url, JSON.stringify(production), this.options)
      .pipe(map((res) => res.json()));
  }

  addNewProductDoc(productDoc): Observable<any> {
    let url = this.baseUrl + "order/productDocg";
    return this.http
      .post(url, JSON.stringify(productDoc), this.options)
      .pipe(map((res) => res.json()));
  }

  //add new item to order
  addNewOrderItem(orderItem): Observable<any> {
    let url = this.baseUrl + "orderitem/add";
    return this.http
      .post(url, JSON.stringify(orderItem), this.options)
      .pipe(map((res) => res.json()));
  }
  saveOrderItemRemarks(remarks): Observable<any> {
    let url = this.baseUrl + "orderitem/saveOrderItemRemarks";
    return this.http
      .post(url, JSON.stringify(remarks), this.options)
      .pipe(map((res) => res.json()));
  }

  //get list of sum of all components needed to the order
  getComponentsSum(orderNumber) {
    let url = this.baseUrl + "itemsDemand?orderNumber=" + orderNumber;

    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  deleteOrderItem(itemId) {
    let url = this.baseUrl + "orderitem/remove";
    let item = { id: itemId };
    return this.http
      .post(url, JSON.stringify(item), this.options)
      .pipe(map((res) => res.json()));
  }
  getOrderItemByNumberAndOrder(item, order) {
    let url = this.baseUrl + "orderitem?item=" + item + "&order=" + order;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  sendOrderData(tempArr: Array<string>) {
    this.orderSrc.next(tempArr);
  }

  getAllOpenOrdersItems(status: boolean) {
    this.openOrdersSrc.next(status);
  }

  getItemPackingList(itemNumber, orderNumber): Observable<any> {
    let url =
      this.baseUrl +
      "packingPallltItems?itemNPackingList=" +
      itemNumber +
      "&orderNumber=" +
      orderNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getPalletsDataByOrderNumber(orderNumber): Observable<any> {
    let url =
      this.baseUrl + "packingPallltItems?orderPalletsData=" + orderNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOrderPackingList(orderNumber): Observable<any> {
    let url = this.baseUrl + "packingPallltItems?orderPallets=" + orderNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  //not done at server side
  addItemToPackingList(newObj) {
    let url = this.baseUrl + "packingPallltItems/add";
    return this.http
      .post(url, JSON.stringify(newObj), this.options)
      .pipe(map((res) => res.json()));
  }

  makePlan(orderItems, remark, wp = null) {
    let url = this.baseUrl + "orderitem/makePlan?remark=" + remark;
    return this.http
      .post(url, JSON.stringify({ orderItems, wp }), this.options)
      .pipe(map((reponse) => reponse.json()));
  }

  deleteItemFromPAKALIST(orderITemId) {
    let url =
      this.baseUrl + "orderitem/deleteItemFromPAKALIST?_id=" + orderITemId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  uploadFreeBatches(freeBatches) {
    let url = this.baseUrl + "order/freebatches";
    return this.http
      .post(url, JSON.stringify(freeBatches), this.options)
      .pipe(map((reponse) => reponse.json()));
  }

  downloadFreeBatches() {
    let url = this.baseUrl + "order/freebatches";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  updatePakaStatus(orderItems) {
    let url = this.baseUrl + "orderitem/updatePakaStatus";
    return this.http
      .post(url, JSON.stringify({ orderItems }), this.options)
      .pipe(map((reponse) => reponse.json()));
  }

  //get items required elements for item: components/stickers/boxes/cartons

  getOrderComponents(orderItemsNumArr): Observable<any> {
    let url =
      this.baseUrl +
      "orderitem/getComponents?orderItemsNumArr=" +
      orderItemsNumArr;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllOrdersForComponentsNew(componentNumbers): Observable<any> {
    let url = this.baseUrl + "orderitem/ordersForComponentNew";
    return this.http
      .post(url, JSON.stringify({ componentNumbers }), this.options)
      .pipe(map((res) => res.json()));
  }
  getAllOrdersForComponents(componentNumbers): Observable<any> {
    let url = this.baseUrl + "orderitem/ordersForComponent";
    return this.http
      .post(url, JSON.stringify({ componentNumbers }), this.options)
      .pipe(map((res) => res.json()));
  }

  getOrderItemsFromArray(): Observable<any> {
    let url = this.baseUrl + "orderitem/getOrderItemsFromArray";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  setProductionStatus(productionItemStatus): Observable<any> {
    let url = this.baseUrl + "orderitem/setOrderItemProdStatus";
    return this.http
      .post(url, JSON.stringify(productionItemStatus), this.options)
      .pipe(map((res) => res.json()));
  }

  checkForLastProduction(itemNumber): Observable<any> {
    let url =
      this.baseUrl + "formDetails/isLastFormOfItemTooOld?item=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemStock(itemNumber) {
    let url = this.baseUrl + "itemShell/getItemStock?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((res) => res.json()));
  }
}
