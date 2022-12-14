import { NONE_TYPE } from "@angular/compiler";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Http, Headers, RequestOptions, Jsonp } from "@angular/http";
import { Observable, BehaviorSubject, ReplaySubject } from "rxjs";
import { catchError } from "rxjs/operators";
import { tap, map } from "rxjs/operators";
import { YearCount } from "../peerpharm/inventory/shelf-list/YearCount";

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  public recommendation: any;
  public newRecommendEmitter: EventEmitter<any>;
  constructor(private http: Http) {
    this.newRecommendEmitter = new EventEmitter<any>();
  }

  private headers = new Headers({ "Content-Type": "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private baseUrl = "/";

  getAllItemShells(): Observable<any> {
    let url = this.baseUrl + "itemShell";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  shelfListByWH(whareHouseId, type, db = "real"): Observable<any> {
    let url =
      this.baseUrl +
      `itemShell/shelfsByWareHouse?whareHouse=${whareHouseId}&type=${type}&db=${db}`;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemShellsByWhouseName(warehouseName): Observable<any> {
    let url =
      this.baseUrl +
      "itemShell/getItemShellsByWhouseName?warehouseName=" +
      warehouseName;

    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getProductsItemShellByWHName(warehouseName): Observable<any> {
    let url =
      this.baseUrl +
      "itemShell/getProductsItemShellByWHName?warehouseName=" +
      warehouseName;

    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getShelvesByWHName(name): Observable<any> {
    let url = this.baseUrl + "shell?warehouseName=" + name;
    return this.http.get(url).pipe(
      map((res) => {
        return res.json();
      })
    );
  }

  getItemShellsByDate(fromDate, toDate): Observable<any> {
    let url =
      this.baseUrl +
      "itemShell/byDate?fromDate=" +
      fromDate +
      "&toDate=" +
      toDate;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemShellsMovementsByDate(fromDate, toDate): Observable<any> {
    let url =
      this.baseUrl +
      "itemmovement/byDate?fromDate=" +
      fromDate +
      "&toDate=" +
      toDate;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllComponentTypes() {
    let url = this.baseUrl + "component/allTypes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllComponentTypes2() {
    let url = this.baseUrl + "component/allTypes2";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllComponentTypes3() {
    let url = this.baseUrl + "component/allTypes3";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllComponentMaterials() {
    let url = this.baseUrl + "component/allCmptMaterials";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllComponentMaterials2() {
    let url = this.baseUrl + "component/allCmptMaterials2";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllallPackageTypes() {
    let url = this.baseUrl + "component/allPackageTypes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllallCategories() {
    let url = this.baseUrl + "component/allCategories";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllComponents(): Observable<any> {
    let url = this.baseUrl + "component";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllComponentsLimitedFields(): Observable<any> {
    let url = this.baseUrl + "componentlimitedfields";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllMaterials(): Observable<any> {
    let url = this.baseUrl + "material/getAllMaterials";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllProducts(): Observable<any> {
    let url = this.baseUrl + "component/getAllProducts";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllExpiredArrivals(): Observable<any> {
    let url = this.baseUrl + "material/getAllExpiredArrivals";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  checkExpirationsForMaterial(materialNum, arrivalReqNum): Observable<any> {
    let url =
      this.baseUrl +
      `material/checkExpiration?materialNum=${materialNum}&arrivalReqNum=${arrivalReqNum}`;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllMaterialLocations(): Observable<any> {
    let url = this.baseUrl + "material/allMaterialLocations";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllMatBoxes(): Observable<any> {
    let url = this.baseUrl + "material/getAllMatBoxes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllMaterialsForFormules(): Observable<any> {
    let url = this.baseUrl + "material/allMaterialForFormules";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  // getAllComponentsByStockType(itemType):Observable<any>{
  //   let url = this.baseUrl + "component/stockType?itemType="+itemType;
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));
  // }
  getSingleComponentData(cmptId) {
    const url = this.baseUrl + "component/?cmptId=" + cmptId;
    console.log(url);
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllComponentsByType(itemType): Observable<any> {
    let url = this.baseUrl + "component?itemType=" + itemType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getNamesByRegex(fewLetters): Observable<any> {
    let url = this.baseUrl + "component/regexname?fewLetters=" + fewLetters;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getCasNumbersByRegex(fewLetters): Observable<any> {
    let url = this.baseUrl + "component/regexCAS?fewLetters=" + fewLetters;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getComponentNumberByName(componentName) {
    let url =
      this.baseUrl + "component/numberByName?componentName=" + componentName;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getCompStatus(compNumber): Observable<any> {
    let url = this.baseUrl + "component?compStatus=" + compNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getCmptByNumber(cmptNumber, stockType): Observable<any> {
    let url =
      this.baseUrl +
      "component?componentN=" +
      cmptNumber +
      "&stockType=" +
      stockType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getCmptByitemNumber(cmptNumber): Observable<any> {
    let url = this.baseUrl + "component?componentN=" + cmptNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getComponentByitemNumber(cmptNumber): Observable<any> {
    let url =
      this.baseUrl + "component/getComponentByNumber?itemNumber=" + cmptNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getCmptPPCDetails(componentN): Observable<any> {
    let url =
      this.baseUrl + "component/stockAndOrderAmounts?componentN=" + componentN;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  //search
  getFilteredComponents(params): Observable<any> {
    let url = this.baseUrl + "component/search";
    return this.http.post(url, params).pipe(map((reponse) => reponse.json()));
  }

  // getStockItemByName(stockItemName): Observable<any> {
  //   let url = this.baseUrl + "component?stockItemName=" + stockItemName;
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));
  // }
  // getStockItemByType(stockItemType): Observable<any> {
  //   let url = this.baseUrl + "component?stockItemType=" + stockItemType;
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));
  // }
  // getStockItemByCategory(stockItemCategory): Observable<any> {
  //   let url = this.baseUrl + "component?stockItemCategory=" + stockItemCategory;
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));
  // }
  getCmptBySupplierItemNumber(cmptNumber, stockType): Observable<any> {
    let url =
      this.baseUrl +
      "component?componentNs=" +
      cmptNumber +
      "&stockType=" +
      stockType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getMaterialtByNumber(materialNumber): Observable<any> {
    let url = this.baseUrl + "material?componentN=" + materialNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getLastArrivalByMaterial(materialNumber): Observable<any> {
    let url = this.baseUrl + "material?lastArrival=" + materialNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialsForFormules(materials): Observable<any> {
    let url = this.baseUrl + "material/materialsForFormule";
    return this.http
      .post(url, JSON.stringify(materials), this.options)
      .pipe(map((res) => res.json()));
  }
  getBOM(materials): Observable<any> {
    let url = this.baseUrl + "material/billOfMaterials";
    return this.http
      .post(url, JSON.stringify(materials), this.options)
      .pipe(map((res) => res.json()));
  }

  getBomMulti(formules) {
    let url = this.baseUrl + "material/billOfMaterialsMulti";
    return this.http
      .post(url, JSON.stringify(formules), this.options)
      .pipe(map((res) => res.json()));
  }

  getAllocatedOrdersByNumber(itemNumber): Observable<any> {
    let url =
      this.baseUrl + "component/allocatedOrders?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllocatedOrdersByNumbers(itemNumbers): Observable<any> {
    let url = this.baseUrl + "component/allocatedOrders";
    return this.http
      .post(url, itemNumbers)
      .pipe(map((reponse) => reponse.json()));
  }

  getMaterialtByComponentN(componentN): Observable<any> {
    let url = this.baseUrl + "material?componentN=" + componentN;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  checkIfShelfExist(shelfPosition, whareHouseId) {
    let url =
      this.baseUrl +
      "shell?shelfPosition=" +
      shelfPosition +
      "&whareHouseId=" +
      whareHouseId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getShelfByShelfId(itemShellId) {
    let url = this.baseUrl + "itemShell?itemShellId=" + itemShellId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllKarantine() {
    let url = `${this.baseUrl}material/karantine`;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllProductsWithItem(itemNumber) {
    let url = `${this.baseUrl}component/allProductsWithItem?itemNumber=${itemNumber}`;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  addNewCmpt(cmptObj): Observable<any> {
    let url = this.baseUrl + "component/add";
    return this.http
      .post(url, JSON.stringify(cmptObj), this.options)
      .pipe(map((res) => res.json()));
  }
  updateAllocatedOrdersPos(allocatdOrders, compNumber): Observable<any> {
    let url = this.baseUrl + "component/updateAllocatedOrdersPos";
    return this.http
      .post(
        url,
        JSON.stringify({
          allocatedOrders: allocatdOrders,
          componentN: compNumber,
        }),
        this.options
      )
      .pipe(map((res) => res.json()));
  }
  deleteComponentById(id): Observable<any> {
    let url = this.baseUrl + "component/deleteComponentById";
    return this.http
      .post(url, JSON.stringify({ componentId: id }), this.options)
      .pipe(map((res) => res.json()));
  }
  addToFillingStorage(cmptObj): Observable<any> {
    let url = this.baseUrl + "component/addToFillingStorage";
    return this.http
      .post(url, JSON.stringify(cmptObj), this.options)
      .pipe(map((res) => res.json()));
  }
  updateShelf(shelf): Observable<any> {
    let url = this.baseUrl + "itemShell/updateShelf";
    return this.http
      .post(url, JSON.stringify(shelf), this.options)
      .pipe(map((res) => res.json()));
  }
  // ?????????? ????????,?????????? ?????????????? ????????????
  updateYearCount(whName, type, fileDate) {
    let url =
      this.baseUrl +
      "mongoArchives/itemshell2021?whName=" +
      whName +
      "&type=" +
      type +
      "&fileDate=" +
      fileDate;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  updateActionlogs(values): Observable<any> {
    let url = this.baseUrl + "mongoArchives/updateActionlogs";
    return this.http
      .post(url, JSON.stringify(values), this.options)
      .pipe(map((res) => res.json()));
  }

  // ?????????? ????????, ???????? ???????? ???????? ???????? ????????????
  getFilesListByWh(whName, type) {
    let url =
      this.baseUrl + "itemShell/files?whName=" + whName + "&type=" + type;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  // ?????????? ????????, ???????? ?????????? ???????? ?????? ?????????? ??????????
  getYearCountFile(fileDate) {
    let url = this.baseUrl + "itemShell/getFile?fileDate=" + fileDate;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  // ?????????? ????????, ?????????? ???????? ???? ????????????
  itemshellCopy(whName, itemType) {
    let url =
      this.baseUrl +
      "mongoArchives/itemshellCopy?whName=" +
      whName +
      "&itemType=" +
      itemType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  // ?????????? ????????, ?????????? ???????? ????????
  loadCounts(countsData) {
    let url = this.baseUrl + "itemShell/loadCounts";
    return this.http
      .post(url, JSON.stringify(countsData), this.options)
      .pipe(map((res) => res.json()));
  }

  // ?????????? ???????? - get last yearCount
  getLastYearCount(): Observable<YearCount> {
    let url = `${this.baseUrl}itemShell/lastYearCount`;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  addNewItemShelf(itemShelf) {
    let url = this.baseUrl + "itemShell/addNewItemShelf";

    return this.http
      .post(url, JSON.stringify(itemShelf), this.options)
      .pipe(map((response) => response.json()));
  }

  // ?????????? ???????? - ?????????? ?????? ????????????
  newShelfYearCount(shelf, whareHouse): Observable<any> {
    let url = this.baseUrl + "itemShell/newShelfYearCount";
    return this.http
      .post(url, JSON.stringify({ ...shelf, whareHouse }), this.options)
      .pipe(map((res) => res.json()));
  }

  sendExcel(excel) {
    let url = this.baseUrl + "itemShell/newCountUpload";
    return this.http
      .post(url, JSON.stringify(excel), this.options)
      .pipe(map((res) => res.json()));
  }

  // ?????????? ???????? - ?????????? ???? ???? ???????????? ??????????
  takeStock(updates) {
    let url = this.baseUrl + "itemShell/updateManyAndSaveStockTake";
    return this.http
      .post(url, JSON.stringify(updates), this.options)
      .pipe(map((res) => res.json()));
  }

  getDiffReport(match) {
    let url = this.baseUrl + "itemShell/getDiffReport";
    return this.http.post(url, match).pipe(map((response) => response.json()));
  }
  getPreviousStockReport(match) {
    let url = this.baseUrl + "itemShell/getPreviousStockReport";
    return this.http.post(url, match).pipe(map((response) => response.json()));
  }
  getPreviousProductsReport(match) {
    let url = this.baseUrl + "itemShell/getPreviousProductsReport";
    return this.http.post(url, match).pipe(map((response) => response.json()));
  }

  updateShelfAmount(shelf): Observable<any> {
    let url = this.baseUrl + "itemShell/updateShelfAmount";
    return this.http
      .post(url, JSON.stringify(shelf), this.options)
      .pipe(map((res) => res.json()));
  }
  updateShelfCostumer(shelf, costumer): Observable<any> {
    let url = this.baseUrl + "itemShell/updateShelfCostumer";
    return this.http
      .post(
        url,
        JSON.stringify({ shelf: shelf, costumer: costumer }),
        this.options
      )
      .pipe(map((res) => res.json()));
  }

  getAllProblematicItems() {
    let url = this.baseUrl + "component/problematicItemsReport";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  updateShelfPosition(itemShellID, newShellID, newPosition): Observable<any> {
    let url = `${this.baseUrl}itemShell/updateShelfPosition`;
    return this.http
      .post(url, { itemShellID, newShellID, newPosition }, this.options)
      .pipe(map((res) => res.json()));
  }

  updatePriceHistory(componentN, newPrice, coin, user): Observable<any> {
    let url = `${this.baseUrl}material/updateManualPrice`;
    return this.http
      .post(url, { componentN, newPrice, coin, user }, this.options)
      .pipe(map((res) => res.json()));
  }

  addNewMaterial(materialObj): Observable<any> {
    let url = this.baseUrl + "material/add";
    return this.http
      .post(url, JSON.stringify(materialObj), this.options)
      .pipe(map((res) => res.json()));
  }
  addNewBox(materialObj): Observable<any> {
    let url = this.baseUrl + "material/addNewBox";
    return this.http
      .post(url, JSON.stringify(materialObj), this.options)
      .pipe(map((res) => res.json()));
  }
  getShelfListForMaterial(material): Observable<any> {
    let url = this.baseUrl + "material/getShelfListForMaterial";
    return this.http
      .post(url, JSON.stringify({ material }), this.options)
      .pipe(map((res) => res.json()));
  }
  updateBoxLocation(id, location): Observable<any> {
    let url = this.baseUrl + "material/updateBoxLocation";
    return this.http
      .post(url, JSON.stringify({ id, location }), this.options)
      .pipe(map((res) => res.json()));
  }
  updateSupplier(obj): Observable<any> {
    let url = this.baseUrl + "material/updateSupplier";
    return this.http
      .post(url, JSON.stringify(obj), this.options)
      .pipe(map((res) => res.json()));
  }
  setAsMainSupplier(index, id): Observable<any> {
    let url = this.baseUrl + "material/setAsMainSupplier";
    return this.http
      .post(url, JSON.stringify({ index, id }), this.options)
      .pipe(map((res) => res.json()));
  }
  updateProductionDetails(production): Observable<any> {
    let url = this.baseUrl + "material/updateProductionDetails";
    return this.http
      .post(url, JSON.stringify(production), this.options)
      .pipe(map((res) => res.json()));
  }

  reduceMaterialAmount(material): Observable<any> {
    let url = this.baseUrl + "material/reduceMaterial";
    return this.http
      .post(url, JSON.stringify(material), this.options)
      .pipe(map((res) => res.json()));
  }

  reduceMaterialAmountFromShelf(materialNum, shelf, amount): Observable<any> {
    let url = this.baseUrl + "material/reduceMaterialAmountFromShelf";
    return this.http
      .post(url, JSON.stringify({ materialNum, shelf, amount }), this.options)
      .pipe(map((res) => res.json()));
  }

  reduceMaterialAmounts(
    batchNumber,
    formuleNumber,
    weightKG,
    user,
    reduce,
    barrels
  ): Observable<any> {
    let url = this.baseUrl + "material/reduceMaterialAmounts";
    return this.http
      .post(
        url,
        JSON.stringify({
          batchNumber: batchNumber,
          formuleNumber: formuleNumber,
          weightKG: weightKG,
          user: user,
          reduce: reduce,
          barrels: barrels,
        }),
        this.options
      )
      .pipe(map((res) => res.json()));
  }

  recieveNewComponents(allArrivals): Observable<any> {
    let url = this.baseUrl + "itemShell/recieveNewComponents";
    return this.http
      .post(url, JSON.stringify(allArrivals), this.options)
      .pipe(map((res) => res.json()));
  }

  addNewRecommendation(purchaseRecommend): Observable<any> {
    let url = this.baseUrl + "component/newPurchaseRecommend";
    return this.http
      .post(url, JSON.stringify(purchaseRecommend), this.options)
      .pipe(
        map((res) => {
          this.recommendation = res.json();
          this.newRecommendEmitter.emit(res.json());
          return res.json();
        })
      );
    // return this.http.post(url, JSON.stringify(purchaseRecommend), this.options).pipe(tap(data => {
    //   data = JSON.parse(data._body);
    //   ;
    //   this.recommendation = data;
    // }))
  }

  getComponentsAmounts(itemNumber?): Observable<any> {
    let url = this.baseUrl + "itemShell?amounts=yes&itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAmountsForMulti(allNumbers): Observable<any> {
    let url = this.baseUrl + "itemshell/amountsForMulti";
    return this.http
      .post(url, JSON.stringify({ numbers: allNumbers }), this.options)
      .pipe(map((res) => res.json()));
  }

  getComponentAmount(componentN): Observable<any> {
    let url = this.baseUrl + "itemShell?getComponentAmount=" + componentN;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  //get item amounts in Shelfs
  getAmountOnShelfs(itemNubmer): Observable<any> {
    let url =
      this.baseUrl +
      "itemShell?shelfsItemsAmounts=yes&itemNumber=" +
      itemNubmer;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  // updating item shelfs
  // updateInventoryChanges(qtyObj){
  //   var dataTosend={dataArr: qtyObj};
  //   let url = this.baseUrl + "itemShell/updateMulti";
  //   return this.http.post(url, JSON.stringify(dataTosend), this.options).pipe(map(res => res.json()))
  // }
  updateInventoryChangesTest(qtyObj, itemType, dir?) {
    if (dir && dir == "production") {
      let url =
        this.baseUrl +
        "itemShell/letsJustGiveWierdNamesToFunctions?stockType=" +
        itemType;
      return this.http
        .post(url, JSON.stringify(qtyObj), this.options)
        .pipe(map((res) => res.json()));
    } else {
      var dataTosend = { dataArr: qtyObj };
      let url =
        this.baseUrl + "itemShell/updateMultiFinal?stockType=" + itemType;
      return this.http
        .post(url, JSON.stringify(dataTosend), this.options)
        .pipe(map((res) => res.json()));
    }
  }

  deleteZeroStockAmounts(): Observable<any> {
    let url = this.baseUrl + "itemShell/removeZerosStock";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getWhareHousesList() {
    let url = this.baseUrl + "whareHouse";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  //temporary for minus elimination
  // getCleanMinus() {
  //   let url = this.baseUrl + "itemShell/cleanminus";
  //   return this.http.get(url).pipe(map((reponse) => reponse.json()));
  // }

  // get all shelves from one warehouse by warehouse ID

  getWhareHouseShelfList(whareHouseId) {
    let url = this.baseUrl + "shell?whareHouseId=" + whareHouseId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  // get all shelves from one warehouse by warehouse name
  getAllShellsByWarehouseName(warehouseName) {
    let url = this.baseUrl + "shell?warehouseName=" + warehouseName;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  addNewShelf(shellObj) {
    let url = this.baseUrl + "shell/add";
    return this.http
      .post(url, JSON.stringify(shellObj), this.options)
      .pipe(map((res) => res.json()));
  }
  // addNewWhareHouse(whareHouseName){ //OLD !!!
  //   let url = this.baseUrl + "whareHouse/add";
  //   return this.http.post(url, JSON.stringify({name:whareHouseName}), this.options).pipe(map(res => res.json()))
  // }
  addNewWhareHouse(whareHouseName) {
    let url = this.baseUrl + "whareHouse/add";
    return this.http
      .post(url, JSON.stringify({ name: whareHouseName }), this.options)
      .pipe(map((res) => res.json()));
  }

  getShelfListForItemInWhareHouse(itemNumber, whareHouseId) {
    let url =
      this.baseUrl +
      "itemShell?itemNumber=" +
      itemNumber +
      "&whareHouseId=" +
      whareHouseId;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getShelfListForItemInWhareHouse2(itemNumber, whareHouse) {
    let url =
      this.baseUrl +
      "itemShell/shelfListForItemInWhareHouse?itemNumber=" +
      itemNumber +
      "&whareHouse=" +
      whareHouse;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getWhActionsReport(startDate?, endDate?) {
    let url;
    if (startDate && endDate) {
      url = `${this.baseUrl}whareHouse/getActionsReport?startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `${this.baseUrl}whareHouse/getActionsReport`;
    }
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  addComponentsToStock(allArrivals) {
    let url = this.baseUrl + "itemShell/addComponentsToStock";
    return this.http
      .post(url, JSON.stringify({ allArrivals }), this.options)
      .pipe(map((res) => res.json()));
  }

  changeItemPosition(shelfChange) {
    let url = this.baseUrl + "itemShell/shelfChange";
    return this.http
      .post(url, JSON.stringify(shelfChange), this.options)
      .pipe(map((res) => res.json()));
  }

  checkoutComponents(allOutgoing) {
    let url = this.baseUrl + "itemShell/checkout";
    return this.http
      .post(url, JSON.stringify({ allOutgoing }), this.options)
      .pipe(map((res) => res.json()));
  }

  moveWareHouse(movementDetails) {
    let url = this.baseUrl + "itemShell/moveWareHouse";
    return this.http
      .post(url, JSON.stringify(movementDetails), this.options)
      .pipe(map((res) => res.json()));
  }

  getItemMovements(itemNumber) {
    let url = this.baseUrl + "itemmovement?id=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemShellsAfterUpdateByNumber(ItemNumber) {
    let url =
      this.baseUrl +
      "itemShell/getYearCountsByItemNumber?itemNumber=" +
      ItemNumber;
    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getComplexItemMovements(itemForm: Object) {
    let url = this.baseUrl + "itemmovement/complexMovements";
    return this.http
      .post(url, JSON.stringify(itemForm), this.options)
      .pipe(map((res) => res.json()));
  }

  getLastWHReception() {
    let url = this.baseUrl + "itemmovement/lastReception";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  updateMaterial(objToUpdate) {
    let url = this.baseUrl + "material/update";
    return this.http
      .post(url, JSON.stringify(objToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }

  updateCompt(objToUpdate) {
    let url = this.baseUrl + "component/update";
    return this.http
      .post(url, JSON.stringify(objToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }
  updateComptProcurement(objToUpdate) {
    let url = this.baseUrl + "component/update?procurement=yes";
    return this.http
      .post(url, JSON.stringify(objToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }

  updateComptAllocations(objToUpdate) {
    let url = this.baseUrl + "component/update?allocation=yes";
    return this.http
      .post(url, JSON.stringify(objToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }
  sumItemAllocations() {
    // let url = this.baseUrl + "component/update?allocation=yes";
    // return this.http.post(url, JSON.stringify(objToUpdate), this.options).pipe(map(res => res.json()));
  }
  //MOVED TO: inventory-request.service.ts
  // getInventoryDemandsList(){
  //   let url = this.baseUrl + "itemsDemand";
  //   return this.http.get(url).pipe(map(reponse => reponse.json()));

  // }

  getItemsByCmpt(componentN, componentType) {
    let url =
      this.baseUrl +
      "component?componentNumber=" +
      componentN +
      "&componentType=" +
      componentType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemByNumber(number) {
    let url = this.baseUrl + "component/itemByNumber?itemNumber=" + number;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  //Reports:

  getInvRep(reportForm) {
    let url = this.baseUrl + "component/inventoryreport";
    return this.http
      .post(url, JSON.stringify(reportForm), this.options)
      .pipe(map((reponse) => reponse.json()));
  }
  getInvRepCosts(type) {
    let url = this.baseUrl + "component/inventoryCosts?itemType=" + type;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getProductsStock() {
    let url = this.baseUrl + "component/productsStock";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getpurchaseRec(query) {
    let url = this.baseUrl + "component/purchaseRecommendReport";
    return this.http
      .post(url, JSON.stringify(query), this.options)
      .pipe(map((reponse) => reponse.json()));
  }

  getPPCReport(query) {
    let url = this.baseUrl + "component/PPCReport";
    return this.http
      .post(url, JSON.stringify(query), this.options)
      .pipe(map((reponse) => reponse.json()));
  }

  // DATA FIXES
  getDoubleItemShelfs() {
    let url = this.baseUrl + "component/componentFixes?doubleItemShelfs=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllFillingStorage() {
    let url = this.baseUrl + "component/getAllFillingStorage";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getDoubleStockItems() {
    let url = this.baseUrl + "component/componentFixes?doubleStockItems=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  deleteDoubleStockItemsProducts() {
    let url =
      this.baseUrl +
      "component/componentFixes?deleteDoubleStockItemsProducts=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemsOnShelf(shelfPosition, wh, stockType) {
    let url =
      this.baseUrl +
      "itemShell/getItemsOnShelf?shelfPosition=" +
      shelfPosition +
      "&whareHouseId=" +
      wh +
      "&stockType=" +
      stockType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllMovements(): Observable<any> {
    let url = this.baseUrl + "itemmovement?all=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  deleteStockItemAndItemShelfs(itemNumber, itemType): Observable<any> {
    let url =
      this.baseUrl +
      "component/?itemNumber=" +
      itemNumber +
      "&stockType=" +
      itemType;
    return this.http.delete(url).pipe(map((reponse) => reponse.json()));
  }

  addToWHActionLogs(objToUpdate) {
    let url = this.baseUrl + "itemmovement/whActionLogs";
    return this.http
      .post(url, JSON.stringify(objToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }
  getHistMovements(queryString) {
    let url = this.baseUrl + "itemmovement/whActionLogs" + queryString;
    return this.http.get(url).pipe(map((res) => res.json()));
  }

  getKasemAllCmptsOnShelfs(): Observable<any> {
    let url = this.baseUrl + "itemShell?getAllItemShelfsCmpt=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getOldProcurementAmount(): Observable<any> {
    let url = this.baseUrl + "component?oldProcurementAmount";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  /* SUPPLIERS */

  getAllSuppliers(): Observable<any> {
    let url = this.baseUrl + "supplier/getsuppliers";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  /* Matreials Stock */
  newMatrialArrival(objToUpdate) {
    let url = this.baseUrl + "material";
    return this.http
      .post(url, JSON.stringify(objToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }

  // save new certificate
  arrivalsCertificate(materialArrivalCertif): Observable<any> {
    let url = this.baseUrl + "material/arrivalsCertificate";
    return this.http
      .post(url, JSON.stringify(materialArrivalCertif), this.options)
      .pipe(map((reponse) => reponse.json()));
  }

  //get all certificates
  getAllArrivalsCertificates(): Observable<any> {
    let url = this.baseUrl + "material/arrivalsCertificate";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getMaterialStockItemByNum(internalNumber): Observable<any> {
    let url = this.baseUrl + "material?materialNumber=" + internalNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  checkFrameQuantityByNumber(itemNumber): Observable<any> {
    let url = this.baseUrl + "material?checkFrameQuantity=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialStockItemById(id): Observable<any> {
    let url = this.baseUrl + "material?materialId=" + id;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialByName(materialName): Observable<any> {
    let url = this.baseUrl + "material?materialName=" + materialName;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getMaterialByNumber(materialNumber, stockType): Observable<any> {
    let url =
      this.baseUrl +
      "material?componentN=" +
      materialNumber +
      "&stockType=" +
      stockType;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  findByItemNumber(itemNumber): Observable<any> {
    let url = this.baseUrl + "material?purchaseItemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getItemsBySupplierNum(number): Observable<any> {
    let url = this.baseUrl + "material?supplierNumber=" + number;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getLotNumber(supplierNumber, lotN): Observable<any> {
    let url =
      this.baseUrl + "material?suppNumber=" + supplierNumber + "&lotN=" + lotN;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllMaterialsArrivals(): Observable<any> {
    let url = this.baseUrl + "material?allLogs=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllMaterialsByDate(fromDate, toDate): Observable<any> {
    let url =
      this.baseUrl +
      "material/byDate?fromDate=" +
      fromDate +
      "&toDate=" +
      toDate;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  getAllMaterialsArrivalsWeek(): Observable<any> {
    let url = this.baseUrl + "material?week=yes";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialNotInStock(objToSearch): Observable<any> {
    let url = this.baseUrl + "material/findNotInStock";
    return this.http
      .post(url, JSON.stringify(objToSearch), this.options)
      .pipe(map((reponse) => reponse.json()));
  }
  updateMaterialPosition(id, position): Observable<any> {
    let url = this.baseUrl + "material/updateMaterialPosition";
    return this.http
      .post(url, JSON.stringify({ id: id, position: position }), this.options)
      .pipe(map((reponse) => reponse.json()));
  }
  updateAllPositions(materialNumber, position): Observable<any> {
    let url = this.baseUrl + "material/updateAllPositions";
    return this.http
      .post(
        url,
        JSON.stringify({ materialNumber: materialNumber, position: position }),
        this.options
      )
      .pipe(map((reponse) => reponse.json()));
  }

  getMaterialArrivalFormById(id): Observable<any> {
    let url = this.baseUrl + "material/scanBarcodeId?viewOnly=yes&id=" + id;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getAllMaterialsArrivalsByInternalNumber(internalNumber): Observable<any> {
    let url =
      this.baseUrl +
      "material/scanBarcodeId?searchSimilar=yes&internalNumber=" +
      internalNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialArrivalByNumber(internalNumber): Observable<any> {
    let url =
      this.baseUrl + "material?getMaterialArrivalByNumber=" + internalNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialArrivalByDate(startDate, endDate, barcode): Observable<any> {
    let url =
      this.baseUrl +
      `material/getArrivalByDateRange?startDate=${startDate}&endDate=${endDate}&barcode=${barcode}`;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialArrivalByName(materialName): Observable<any> {
    let url =
      this.baseUrl + "material?getMaterialArrivalByName=" + materialName;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  //returns doc with _id or "doc not found"
  updateMaterialArrivalForm(formToUpdate) {
    let url = this.baseUrl + "material/";
    return this.http
      .put(url, JSON.stringify(formToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }

  /* Matreials Qa */

  newMaterialRequirementsForm(objToUpdate) {
    let url = this.baseUrl + "material/requirementsForm";
    return this.http
      .post(url, JSON.stringify(objToUpdate), this.options)
      .pipe(map((res) => res.json()));
  }

  getMaterialMrpReport() {
    let url = this.baseUrl + "material/materialsMRPReport";

    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getLastReception() {
    let url = this.baseUrl + "itemShell/getLastReception";
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  // For warehouse reception from another warehouse
  getWhActionLogsByWhName(whName, whOriginName) {
    let url =
      this.baseUrl +
      "itemShell/getWhActionLogsByWhName?whName=" +
      whName +
      "&whOriginName=" +
      whOriginName;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }

  checkIfItemIsActive(itemNumber) {
    let url =
      this.baseUrl + "component/checkIfItemIsActive?itemNumber=" + itemNumber;
    return this.http.get(url).pipe(map((reponse) => reponse.json()));
  }
  getMaterialUsage(months, itemNumber) {
    let url =
      this.baseUrl +
      "itemmovement/materialUsageMonths?months=" +
      months +
      "&itemNumber=" +
      itemNumber;

    return this.http.get(url).pipe(map((response) => response.json()));
  }
  getComponentUsage(months, itemNumber) {
    let url =
      this.baseUrl +
      "itemmovement/componentUsageMonths?months=" +
      months +
      "&itemNumber=" +
      itemNumber;

    return this.http.get(url).pipe(map((response) => response.json()));
  }

  getMissingLotNumbersReport(query) {
    let url = this.baseUrl + "itemShell/getMissingLotNumbersReport";

    return this.http.post(url, query).pipe(map((response) => response.json()));
  }

  revertTransaction(id: string, username: string) {
    return this.http.post(`${this.baseUrl}itemShell/revert-transaction/${id}`, {username: username}).pipe(map((response) => response.json()));
  }
}

// startNewItemObservable() {
//   ;
//   let itemResultObservable: Observable<any[]> = new Observable(observer => {
//     let self = this;
//     let skip = 0;
//     let limit = 1500;
//     startNewCall(skip, limit);
//     function startNewCall(skip, limit) {
//       let url = "/component?skip=" + skip + "&limit=" + limit;
//       console.log("new call=> " + url);
//       self.http.get(url).subscribe(response => {
//         let items = <any[]>response.json();
//         skip = skip + 1500;
//         if (items.length > 0) {
//           console.log("got items bigger than 0");
//           observer.next(items);
//           startNewCall(skip, limit);
//         }
//         else {
//           console.log("complete!!");
//           observer.complete();
//         }
//       })

//     }
//   });

//   return itemResultObservable;
// }
