import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})

export class Procurementservice {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

  constructor(private http: Http) { }


  getProcurementOrderItemByDate(fromDate, toDate):Observable<any>{
    
    let url = this.baseUrl + "procurementOrderController/byDate?fromDate="+fromDate+"&toDate="+toDate;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getProcurementOrderItemBalanceByDate(fromDate, toDate):Observable<any>{
    
    let url = this.baseUrl + "procurementOrderItemBalance/byDate?fromDate="+fromDate+"&toDate="+toDate;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }



  getProcurementOrderItemBalance() {
    const url = this.baseUrl + 'procurementOrderItemBalance';
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getProcurementOrder() {
    const url = this.baseUrl + 'procurementOrderController';
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllInvoices() {
    const url = this.baseUrl + 'procurementOrderController/getAllInvoices';
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getProcurementOrderItem() {
    const url = this.baseUrl + 'procurementOrderItemController';
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getProcurementOrderItemByOrderNumber(orderNumber) {
    const url = this.baseUrl + 'procurementOrderItemController?orderNumber=' + orderNumber;
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getPurchaseOrderByItem(itemNumber) {
    const url = this.baseUrl + 'procurementOrderController?itemNumber=' + itemNumber;
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

 

  /*EXPECTED ARRIVALS OF PROCURMENT ITEMS*/
  
  getAllExpectedArrivals(): Observable<any> {
    
    let url = this.baseUrl + 'expectedArrivalController/all';
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  componentsWithPurchaseRec(): Observable<any> {
    
    let url = this.baseUrl + 'procurementOrderController/componentsWithPurchaseRec';
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  getAllPurchaseRecommends(): Observable<any> {
    
    let url = this.baseUrl + 'procurementOrderController/getAllPurchaseRecommends';
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  getAllPurchases(): Observable<any> {
    
    let url = this.baseUrl + 'procurementOrderController/getAllPurchases';
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  getRecommendById(recommendId): Observable<any> {
    
    let url = this.baseUrl + 'procurementOrderController?getRecommendById='+recommendId;
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }

  getItemExpectedArrivals(componentN): Observable<any> {
    let url = this.baseUrl + 'expectedArrivalController?componentN=' +componentN;
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  findIfOrderExist(orderNumber): Observable<any> {
    let url = this.baseUrl + 'newProcurement?orderNumberExist=' +orderNumber;
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  getAllItemPurchases(itemNumber): Observable<any> {
    let url = this.baseUrl + 'newProcurement?allItemPurchases=' +itemNumber;
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  // copyOldData(): Observable<any> {
  //   let url = this.baseUrl + 'expectedArrivalController/copyOldData';
  //   return this.http.get(url).pipe( map(reponse => reponse.json()));
  // }
  findOpenJobNumbers(): Observable<any> {
    let url = this.baseUrl + 'expectedArrivalController?openJobNumbers';
    return this.http.get(url).pipe( map(reponse => reponse.json()))
  }
  findOneJobNumber(jobNumber): Observable<any> {
    
    let url = this.baseUrl + 'expectedArrivalController?oneJobNumber='+jobNumber;
    return this.http.get(url).pipe( map(reponse => reponse.json()))
  }
  addExpectedArrivals(arrivalsArr):Observable<any>{
    let url = this.baseUrl + 'expectedArrivalController/add';
    return this.http.post(url, JSON.stringify(arrivalsArr), this.options).pipe(map(res=>res.json()));
  }
  updateExpectedArrival(arrivalsArr):Observable<any>{
    let url = this.baseUrl + 'expectedArrivalController/updateExpected';
    return this.http.post(url, JSON.stringify(arrivalsArr), this.options).pipe(map(res=>res.json()));
  }
 
  addNewJobNumber(obj):Observable<any>{
    let url = this.baseUrl + 'expectedArrivalController/addJobNumber';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  updateTransformationArrival(obj):Observable<any>{
    let url = this.baseUrl + 'expectedArrivalController/updateTransport';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  suppliedExpectedArrival(arrivalsArr):Observable<any>{
    
    let url = this.baseUrl + 'expectedArrivalController/expectedSupplied';
    return this.http.post(url, JSON.stringify(arrivalsArr), this.options).pipe(map(res=>res.json()));
  }

  addNewProcurement(obj):Observable<any>{
    
    let url = this.baseUrl + 'newProcurement/add';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }

  updatePaymentStatus(paymentStatus,orderNumber):Observable<any>{
    
    let url = this.baseUrl + 'newProcurement/updatePaymentStatus';
    return this.http.post(url, JSON.stringify({paymentStatus:paymentStatus,orderNumber:orderNumber}), this.options).pipe(map(res=>res.json()));
  }
  updatePaymentRemark(paymentRemark,orderNumber):Observable<any>{
    
    let url = this.baseUrl + 'newProcurement/updatePaymentRemark';
    return this.http.post(url, JSON.stringify({paymentRemark:paymentRemark,orderNumber:orderNumber}), this.options).pipe(map(res=>res.json()));
  }
  sendOrderToSupplier(obj):Observable<any>{
    
    let url = this.baseUrl + 'procurementOrderController/sendOrderToSupplier';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  saveNewInvoice(supInvoiceNum,supplierNumber,status,invoice):Observable<any>{
    
    let url = this.baseUrl + 'procurementOrderController/saveNewInvoice';
    return this.http.post(url, JSON.stringify({supInvoiceNumber:supInvoiceNum,supplierNumber:supplierNumber,status:status,invoices:invoice}), this.options).pipe(map(res=>res.json()));
  }
  addItemToProcurement(obj):Observable<any>{
    
    let url = this.baseUrl + 'procurementOrderController/addItemToProcurement';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  setItemToDone(obj):Observable<any>{
    
    let url = this.baseUrl + 'procurementOrderController/setItemToDone';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  closeRecommendationById(id):Observable<any>{
    
    let url = this.baseUrl + 'procurementOrderController/closeRecommendationById';
    return this.http.post(url, JSON.stringify({id:id}), this.options).pipe(map(res=>res.json()));
  }
  removeFromFrameQuantity(obj):Observable<any>{
    let url = this.baseUrl + 'newProcurement/findMaterialAndRemoveFrameAmount';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  updatePurchaseOrder(obj):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/updatePurchaseOrder';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  
  setPurchaseStatus(obj):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/setPurchaseStatus';
    return this.http.post(url, JSON.stringify(obj), this.options).pipe(map(res=>res.json()));
  }
  
  changeColor(itemNumber,orderNumber,orderAmount,supplierPrice,itemRemarks,orderCoin,index):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/changeColor';
    return this.http.post(url, JSON.stringify({itemNumber,orderNumber,orderAmount,supplierPrice,itemRemarks,orderCoin,index}), this.options).pipe(map(res=>res.json()));
  }
  
  cancelOrder(orderNumber):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/cancelOrderByNumber';
    return this.http.post(url, JSON.stringify({orderNumber}), this.options).pipe(map(res=>res.json()));
  }
  updatePdfFile(order):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/updatePdfFile';
    return this.http.post(url, JSON.stringify({order}), this.options).pipe(map(res=>res.json()));
  }
  updateComponentPurchase(purchase):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/updateComponentPurchase';
    return this.http.post(url, JSON.stringify({purchase}), this.options).pipe(map(res=>res.json()));
  }
  updateRecommendRemarks(purchase):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/updateRecommendRemarks';
    return this.http.post(url, JSON.stringify({purchase}), this.options).pipe(map(res=>res.json()));
  }
  updatePurchaseRemarks(purchase):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/updatePurchaseRemarks';
    return this.http.post(url, JSON.stringify({purchase}), this.options).pipe(map(res=>res.json()));
  }
  orderSentToClient(orderNumber):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/orderSentToClient';
    return this.http.post(url, JSON.stringify({orderNumber}), this.options).pipe(map(res=>res.json()));
  }
  changeStatus(status,orderNumber):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/changeStatus';
    return this.http.post(url, JSON.stringify({status,orderNumber}), this.options).pipe(map(res=>res.json()));
  }
  clientGotTheOrder(orderNumber):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/clientGotTheOrder';
    return this.http.post(url, JSON.stringify({orderNumber}), this.options).pipe(map(res=>res.json()));
  }
  closeOrder(orderNumber,reason):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/closeOrder';
    return this.http.post(url, JSON.stringify({orderNumber,reason}), this.options).pipe(map(res=>res.json()));
  }
  deleteItemFromOrder(itemNumber,orderNumber):Observable<any>{
    let url = this.baseUrl + 'procurementOrderController/deleteItemFromOrder';
    return this.http.post(url, JSON.stringify({itemNumber,orderNumber}), this.options).pipe(map(res=>res.json()));
  }
  getAllComponentsPurchase(): Observable<any> {
    
    let url = this.baseUrl + 'procurementOrderController/getAllComponentsPurchase';
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }
  getAllMaterialsPurchase(): Observable<any> {
    
    let url = this.baseUrl + 'procurementOrderController/getAllMaterialsPurchase';
    return this.http.get(url).pipe( map(reponse => reponse.json()));
  }


  

}
