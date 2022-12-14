import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";

export interface Response {
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class ItemsService {
  constructor(private http: Http) {}

  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";

  getOpenOrdersForItem(item: any): Observable<any> {
    let url =
      this.baseUrl + "orderitem/getAllOpenOrdersByItemNumber?item=" + item;

    return this.http.get(url).pipe(map((res) => res.json()));
  }

  getLicenseItems(): Observable<any> {
    let url = this.baseUrl + "item/licenseRequired";

    return this.http.get(url).pipe(map((res) => res.json()));
  }

  setNewProductionSchedule(schedule): Observable<any> {
    let url = this.baseUrl + "schedule/addSchedule";

    return this.http
      .post(url, JSON.stringify(schedule), this.options)
      .pipe(map((res) => res.json()));
  }

  // getItemDetails(itemNumber): Observable<any> {
  //
  //   let url = this.baseUrl + "item/itemTreeDetails";
  //   return this.http.post(url, JSON.stringify(itemNumber), this.options).pipe(map(res => res.json()))
  // }

  getAllItems() {
    let url = this.baseUrl + "item";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  // For new Items index:
  getAllItemsGroups() {
    let url = this.baseUrl + "itemGroup/getGroups";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllItemsSubGroups() {
    let url = this.baseUrl + "itemSubGroup/getSubGroups";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllItemDepartments() {
    let url = this.baseUrl + "itemDepartment/get";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getIndexItems(page?) {
    let url = this.baseUrl;
    if (page) {
      url += `item/itemIndex?pageNumber=${page}`;
    } else {
      url += "item/itemIndex";
    }
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getIndexQuery(query) {
    let url =
      this.baseUrl +
      `item/itemIndexByQuery?name=${query.name}&itemCode=${query.itemCode}&barcode=${query.barCode}&department=${query.department}&group=${query.group}&subGroup=${query.subGroup}`;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  //////////////////////////////
  getAllItemsTwo() {
    let url = this.baseUrl + "item/getAllItems";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getItemsByStatus(itemStatus) {
    let url = this.baseUrl + "item?itemStatus=" + itemStatus;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemData(itemNumber) {
    let url = this.baseUrl + "item?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  createProdRequirement(itemNumber) {
    let url = this.baseUrl + "item?getItemComponents=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllItemShells() {
    let url = this.baseUrl + "item/getAllItemShells";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  createFillingReport(itemN) {
    let url = this.baseUrl + "item?createFillingReport=" + itemN;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getPlateImg(itemNumber) {
    let url = this.baseUrl + "item?plateImg=yes&itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getItemDetails(itemNumber) {
    let url = this.baseUrl + "item?itemDetails=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getItemByNumber(itemNumber) {
    let url = this.baseUrl + "item/getItemByNumber?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getShellDetailsByNumber(itemNumber) {
    let url = this.baseUrl + "item?itemInShell=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getShelfDetailByShelf(shelfNumber) {
    let url = this.baseUrl + "item?itemByShelfNumber=" + shelfNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  shelfDetailsByNumber(shelfNumber) {
    let url = this.baseUrl + "item?shelfDetailsByNumber=" + shelfNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getComponentsAmountByCmptNumber(
    componentNumber,
    itemQuantity
  ): Observable<any> {
    let url =
      this.baseUrl +
      "item?itemNumberToCheck=" +
      componentNumber +
      "&itemQuantity=" +
      itemQuantity;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getComponentsForItem(itemNumber) {
    let url = this.baseUrl + "item/componentsForItem?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getComponentsForMultiItems(itemsNumbersArray) {
    const obj = {
      itemsNumbers: itemsNumbersArray,
    };

    console.log(obj);

    let url = this.baseUrl + "item/componentsForMultiItems";
    return this.http.post(url, obj).pipe(map((reponse) => reponse.json()));
  }

  addItem(itemObj) {
    let url = this.baseUrl + "item/add";
    return this.http
      .post(url, JSON.stringify(itemObj), this.options)
      .pipe(map((res) => res.json()));
  }
  updateItem(itemObj) {
    let url = this.baseUrl + "item/update";
    return this.http
      .post(url, JSON.stringify(itemObj), this.options)
      .pipe(map((res) => res.json()));
  }

  updateNetWeightByVolume() {
    let url = this.baseUrl + "item/updateNetWeightByVolume";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  updateDocuments(itemDocObj) {
    let url = this.baseUrl + "item/updateDocs";
    return this.http
      .post(url, JSON.stringify(itemDocObj), this.options)
      .pipe(map((res) => res.json()));
  }
  findByIdAndUpdate(itemShell) {
    let url = this.baseUrl + "item/updateItemShellById";
    return this.http
      .post(url, JSON.stringify(itemShell), this.options)
      .pipe(map((res) => res.json()));
  }

  getAllItemNames() {
    let url = this.baseUrl + "item/allItemNames";
    return this.http.get(url).pipe(map((res) => res.json()));
  }

  checkForProblematicItems(itemNumber) {
    let url = this.baseUrl + "item/checkforproblematic";
    return this.http
      .post(url, JSON.stringify(itemNumber), this.options)
      .pipe(map((res) => res.json()));
  }

  newFloor(newFloor) {
    let url = this.baseUrl + "item/newFloorItem";
    return this.http
      .post(url, JSON.stringify(newFloor), this.options)
      .pipe(map((res) => res.json()));
  }

  updateLicenseLimition(itemDocObj) {
    let url = this.baseUrl + "item/updateDocs?updateLicenseLimition=yes";
    return this.http
      .post(url, JSON.stringify(itemDocObj), this.options)
      .pipe(map((res) => res.json()));
  }
  updateItemDetails(itemObj) {
    let url = this.baseUrl + "item/updateItemDetails";
    return this.http
      .post(url, JSON.stringify(itemObj), this.options)
      .pipe(map((res) => res.json()));
  }
  updateStickerImage(itemObj) {
    let url = this.baseUrl + "item/updateStickerImage";
    return this.http
      .post(url, JSON.stringify(itemObj), this.options)
      .pipe(map((res) => res.json()));
  }
  updateItemValues(itemObj) {
    let url = this.baseUrl + "item/updateItemValues";
    return this.http
      .post(url, JSON.stringify(itemObj), this.options)
      .pipe(map((res) => res.json()));
  }
  saveSpecSettings(specSettings) {
    let url = this.baseUrl + "item/saveSpecSettings";
    return this.http
      .post(url, JSON.stringify(specSettings), this.options)
      .pipe(map((res) => res.json()));
  }
  sendExcel(excel) {
    let url = this.baseUrl + "item/excelToData";
    return this.http
      .post(url, JSON.stringify(excel), this.options)
      .pipe(map((res) => res.json()));
  }

  startNewItemObservable() {
    let itemResultObservable: Observable<any[]> = new Observable((observer) => {
      let self = this;
      let skip = 0;
      let limit = 1000;
      startNewCall(skip, limit);
      function startNewCall(skip, limit) {
        let url = "/item?skip=" + skip + "&limit=" + limit;
        console.log("new call=> " + url);
        self.http.get(url).subscribe((response) => {
          let items = <any[]>response.json();
          skip += 1000;
          if (items.length > 0) {
            console.log("got items bigger than 0");
            observer.next(items);
            startNewCall(skip, limit);
          } else {
            console.log("complete!!");
            observer.complete();
          }
        });
      }
    });

    return itemResultObservable;
  }

  getItemsWithoutBoxOrStickerFields() {
    let url = this.baseUrl + "item/reports?noBox=yes&noSticker=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getProductsByQuery(query) {
    let url = this.baseUrl + "item/getProductsByQuery";
    return this.http
      .post(url, query, this.options)
      .pipe(map((response) => response.json()));
  }

  getAllproductsNew() {
    let url = this.baseUrl + "item/getAllproductsNew";
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getComponentsForList(list) {
    let url = this.baseUrl + "component/getComponentsForList";
    return this.http.post(url, list).pipe(map((response) => response.json()));
  }

  getMaterialsForList(list) {
    let url = this.baseUrl + "material/getMaterialsForList";
    return this.http.post(url, list).pipe(map((response) => response.json()));
  }
  addMaterialsForecast(forecast) {
    let url = this.baseUrl + "material/addMaterialsForecast";
    return this.http
      .post(url, forecast)
      .pipe(map((response) => response.json()));
  }
  saveForecastList(list) {
    let url = this.baseUrl + "orderitem/saveForecastList";
    return this.http.post(url, list).pipe(map((response) => response.json()));
  }
  getAllForecastLists() {
    let url = this.baseUrl + "orderitem/getAllForecastLists";
    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getForecastByNumber(forecastNumber) {
    let url =
      this.baseUrl +
      "orderitem/getForecastByNumber?forecastNumber=" +
      forecastNumber;
    return this.http.get(url).pipe(map((response) => response.json()));
  }
  deleteForecast(forecastNumber) {
    let url =
      this.baseUrl +
      "orderitem/deleteForecastByNumber?forecastNumber=" +
      forecastNumber;

    return this.http.delete(url).pipe(map((response) => response.json()));
  }
}
