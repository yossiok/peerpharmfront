import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http:Http) { }

  
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = '/';

  getAllComponents():Observable<any>{
    let url = this.baseUrl + "component";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getCmptByNumber(cmptNumber):Observable<any>{
    let url = this.baseUrl + "component?componentN="+cmptNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  addNewCmpt(cmptObj):Observable<any>{ 
    let url = this.baseUrl + "component/add";
    return this.http.post(url, JSON.stringify(cmptObj), this.options).pipe(map(res => res.json()))
}

  getComponentsAmounts():Observable<any>{
    let url = this.baseUrl + "itemShell?amounts=yes";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  //get item amounts in Shelfs 
  getAmountOnShelfs(itemNubmer):Observable<any>{  
    let url = this.baseUrl + "itemShell?shelfsItemsAmounts=yes&itemNumber="+itemNubmer;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  // updating item shelfs
  updateInventoryChanges(qtyObj){
    var dataTosend={dataArr: qtyObj};
    let url = this.baseUrl + "itemShell/updateMulti";
    return this.http.post(url, JSON.stringify(dataTosend), this.options).pipe(map(res => res.json()))
  }
  updateInventoryChangesTest(qtyObj){
    var dataTosend={dataArr: qtyObj};
    let url = this.baseUrl + "itemShell/updateMultiNew";
    return this.http.post(url, JSON.stringify(dataTosend), this.options).pipe(map(res => res.json()))
  }

  getWhareHousesList(){
    let url = this.baseUrl + "whareHouse";
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getWhareHouseShelfList(whareHouseId){
    let url = this.baseUrl + "shell?whareHouseId="+whareHouseId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  addNewShelf(shellObj){
    let url = this.baseUrl + "shell/add";
    return this.http.post(url, JSON.stringify(shellObj), this.options).pipe(map(res => res.json()))
  }
  addNewWhareHouse(whareHouseName){
    let url = this.baseUrl + "whareHouse/add";
    return this.http.post(url, JSON.stringify({name:whareHouseName}), this.options).pipe(map(res => res.json()))
  }

  getShelfListForItemInWhareHouse(itemNumber, whareHouseId){
    let url = this.baseUrl + "itemShell?itemNumber="+itemNumber +"&whareHouseId="+whareHouseId;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  
  getItemMovements(itemNumber){
    let url = this.baseUrl + "itemmovement?id="+itemNumber;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  updateCompt(objToUpdate){
    let url = this.baseUrl + "component/update";
    return this.http.post(url, JSON.stringify(objToUpdate), this.options).pipe(map(res => res.json()));
  }
  updateComptProcurement(objToUpdate){
    let url = this.baseUrl + "component/update?procurement=yes";
    return this.http.post(url, JSON.stringify(objToUpdate), this.options).pipe(map(res => res.json()));
  }

  updateComptAllocations(objToUpdate){
    let url = this.baseUrl + "component/update?allocation=yes";
    return this.http.post(url, JSON.stringify(objToUpdate), this.options).pipe(map(res => res.json()));
  }
  sumItemAllocations(){
    // let url = this.baseUrl + "component/update?allocation=yes";
    // return this.http.post(url, JSON.stringify(objToUpdate), this.options).pipe(map(res => res.json()));
  }
  //MOVED TO: inventory-request.service.ts
  // getInventoryDemandsList(){
  //   let url = this.baseUrl + "itemsDemand";
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));

  // }
}
