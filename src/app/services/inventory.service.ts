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
  getSingleComponentData(cmptId) {
    const url = this.baseUrl + 'component/?cmptId='+cmptId;
    console.log(url);
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getAllComponentsByType(itemType):Observable<any>{
    let url = this.baseUrl + "component?itemType="+itemType;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  getCmptByNumber(cmptNumber, stockType):Observable<any>{
    let url = this.baseUrl + "component?componentN="+cmptNumber+"&stockType="+stockType;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }
  getCmptBySupplierItemNumber(cmptNumber, stockType):Observable<any>{
    let url = this.baseUrl + "component?componentNs="+cmptNumber+"&stockType="+stockType;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }

  checkIfShelfExist(shelfPosition,whareHouseId){
    let url = this.baseUrl + "shell?shelfPosition="+shelfPosition+"&whareHouseId="+whareHouseId;
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
  // updateInventoryChanges(qtyObj){
  //   var dataTosend={dataArr: qtyObj};
  //   let url = this.baseUrl + "itemShell/updateMulti";
  //   return this.http.post(url, JSON.stringify(dataTosend), this.options).pipe(map(res => res.json()))
  // }
  updateInventoryChangesTest(qtyObj,stockType){
    var dataTosend={dataArr: qtyObj};
    let url = this.baseUrl + "itemShell/updateMultiFinal?stockType="+stockType;
    return this.http.post(url, JSON.stringify(dataTosend), this.options).pipe(map(res => res.json()))
  }
  deleteZeroStockAmounts():Observable<any>{  
    let url = this.baseUrl + "itemShell/removeZerosStock"
    return this.http.get(url).pipe(map(reponse => reponse.json()));
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
  // addNewWhareHouse(whareHouseName){ //OLD !!!
  //   let url = this.baseUrl + "whareHouse/add";
  //   return this.http.post(url, JSON.stringify({name:whareHouseName}), this.options).pipe(map(res => res.json()))
  // }
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

  getItemsByCmpt(componentN , componentType){
    let url = this.baseUrl + "component?componentNumber="+componentN +"&componentType="+componentType;
    return this.http.get(url).pipe(map(reponse => reponse.json()));
  }




// DATA FIXES
getDoubleItemShelfs(){
  let url = this.baseUrl + "component/componentFixes?doubleItemShelfs=yes";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}
getDoubleStockItems(){
  let url = this.baseUrl + "component/componentFixes?doubleStockItems=yes";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}
deleteDoubleStockItemsProducts(){
  let url = this.baseUrl + "component/componentFixes?deleteDoubleStockItemsProducts=yes";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

getItemsOnShelf(shelfPosition,wh , stockType){
  let url = this.baseUrl + "itemShell?getItemsOnShelf=yes&shelfPosition="+shelfPosition +"&whareHouseId="+wh+"&stockType="+stockType;
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

getAllMovements():Observable<any>{
  let url = this.baseUrl + "itemmovement?all=yes";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

deleteStockItemAndItemShelfs(itemNumber, itemType ):Observable<any>{
  let url = this.baseUrl + "component/?itemNumber="+itemNumber+"&stockType="+itemType;
  return this.http.delete(url).pipe(map(reponse => reponse.json()));
}

addToWHActionLogs(objToUpdate){
  let url = this.baseUrl + "itemmovement/whActionLogs";
  return this.http.post(url, JSON.stringify(objToUpdate), this.options).pipe(map(res => res.json()));
}


getKasemAllCmptsOnShelfs():Observable<any>{
  let url = this.baseUrl + "itemShell?getAllItemShelfsCmpt=yes";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}
getOldProcurementAmount():Observable<any>{
  let url = this.baseUrl + "component?oldProcurementAmount";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}


/* SUPPLIERS */

getAllSuppliers():Observable<any>{
  let url = this.baseUrl + "supplier"
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

/* Matreials Stock */
newMatrialArrival(objToUpdate){
  let url = this.baseUrl + "material";
  return this.http.post(url, JSON.stringify(objToUpdate), this.options).pipe(map(res => res.json()));
}

getMaterialStockItemByNum(internalNumber):Observable<any>{
  let url = this.baseUrl + "material?materialNumber="+internalNumber ;
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}
findByItemNumber(itemNumber):Observable<any>{
  let url = this.baseUrl + "material?purchaseItemNumber="+itemNumber;
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

getItemsBySupplierNum(number):Observable<any>{
  let url = this.baseUrl + "material?supplierNumber="+number;
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

getLotNumber(itemN, lotN):Observable<any>{
  let url = this.baseUrl + "material?itemN="+itemN+"&lotN="+lotN;
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}

getAllMaterialsArrivals():Observable<any>{
  let url = this.baseUrl + "material?allLogs=yes";
  return this.http.get(url).pipe(map(reponse => reponse.json()));
}


}
