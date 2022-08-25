import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { WorkPlanStatusPipe } from "src/app/pipes/work-plan-status.pipe";
import { AuthService } from "src/app/services/auth.service";
import { ExcelService } from "src/app/services/excel.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ProductionService } from "src/app/services/production.service";
import { resolve } from "url";
import { WorkPlan } from "../WorkPlan";
import { FormulesService } from "src/app/services/formules.service";
import { EPERM } from "constants";

@Component({
  selector: "app-all-planning",
  templateUrl: "./all-planning.component.html",
  styleUrls: ["./all-planning.component.scss"],
})
export class AllPlanningComponent implements OnInit {
  @ViewChild("produced") producedWorkPlansER: ElementRef;
  @ViewChild("familyFilter") familyFilter: ElementRef;

  workPlans: WorkPlan[];
  workPlansCopy: WorkPlan[];
  workPlansReportArray:WorkPlan[];
  workPlansReportArrayCopy:WorkPlan[];
  checkedWorkPlans: WorkPlan[] = [];
  producedWorkPlans: number[];
  workPlansInterval: any = null;
  currentWorkPlan: WorkPlan;
  materialsForFormules: Array<any>;
  fetchingWorkPlans: boolean = false;
  fetchingWorkPlans2: boolean = false;
  fetchingWorkPlans3: boolean = false;
  disableCheckBox: boolean = false;
  showMaterialsForFormules: boolean = false;
  showWorkPlan: boolean = false;
  loadData: boolean = false;
  showCheckbox: boolean = false;
  authorized: boolean = false;

  toDoneArray: Array<any> = [];
  sortByDateFlag = false
  itemNumberReportFilter = ""
  orderNumberReportFilter = ""
  showReport = false

  constructor(
    private productionService: ProductionService,
    private excelService: ExcelService,
    private workPlanStatusPipe: WorkPlanStatusPipe,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private formuleService: FormulesService
  ) {}

  async ngOnInit() {
    let bool = await this.getWorkPlans();
    this.authorized = this.authService.loggedInUser.authorization.includes(
      "creamProductionManager"
    );
    this.route.queryParamMap.subscribe((params) => {
      if (params["params"].workPlanId && bool) {
        this.openWorkPlan(Number(params["params"].workPlanId));
      }
    });
  }

  getWorkPlans() {
    this.fetchingWorkPlans = true;
    return new Promise((resolve, reject) => {
      this.productionService.getAllWorkPlans().subscribe((workPlans) => {
        this.workPlans = workPlans.filter(
          (wp) => wp.status != 8 && wp.status != 7
        );
        
        this.workPlansReportArray = workPlans.map((wp)=>{
          if(wp.status != 8 && wp.status != 7 && wp.status != 6 && (Math.ceil(Math.abs(new Date().getTime() - new Date(wp.date).getTime()) / (1000 * 60 * 60 * 24)) ) > 7){
              return {
                ...wp,
                daysDiff: (Math.ceil(Math.abs(new Date().getTime() - new Date(wp.date).getTime()) / (1000 * 60 * 60 * 24)) )
              }
          }
        });
        this.workPlansReportArray.map((wp,index)=>{
          if(wp && wp.orderItems && wp.orderItems.length > 0){
            wp.orderItems.map((item)=>{
              if(item && item.status && (item.status == 6 || item.status == 7 || item.status == 8)){
                delete this.workPlansReportArray[index]
              }
            })
          }
        })
        this.workPlansReportArray.sort((a,b)=>{
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        this.workPlansReportArrayCopy = this.workPlansReportArray
            
        this.workPlansCopy = [...workPlans];
        this.fetchingWorkPlans = false;
        console.log(this.workPlans);
        resolve(true);
      });
    });
  }

  updateToDoneArray(workPlan) {
    if (this.toDoneArray.includes(workPlan)) {
      this.toDoneArray = this.toDoneArray.filter(
        (wp) => wp._id != workPlan._id
      );
    } else {
      this.toDoneArray.push(workPlan);
    }
  }

  toDone() {
    for (let wp of this.toDoneArray) {
      wp.status = 7;
    }

    this.productionService
      .multiUpdateWorkPlans(this.toDoneArray)
      .subscribe((res) => {
        console.log(res);
        this.toDoneArray = [];
        this.ngOnInit();
      });
  }

  // checkForProduced() {
  //   this.producedWorkPlans = this.workPlans.filter(wp => wp.status == 6).map(wp => wp.serialNumber)
  //   this.modalService.open(this.producedWorkPlansER)
  // }

  openWorkPlan(serialNum) {
    this.showWorkPlan = true;
    this.currentWorkPlan = this.workPlans.find(
      (wp) => wp.serialNumber == serialNum
    );
  }

  closeWorkPlan(i) {
    this.currentWorkPlan = null;
    this.showWorkPlan = false;
    if (i != -1) {
      this.currentWorkPlan = this.workPlans[i];
      this.showWorkPlan = true;
    }
  }

  filterWorkPlans(event) {
    let value = event.target.value.toLowerCase().trim();
    this.workPlans = this.workPlansCopy.filter((o) =>
      Object.entries(o).some((entry) =>
        String(entry[1]).toLowerCase().includes(value)
      )
    );
  }

  filterByStatus(event) {
    let status = event.target.value;
    if (status == 7) {
      this.fetchingWorkPlans2 = true;
      this.productionService.getDoneWorkPlans().subscribe((workPlans) => {
        this.workPlans = workPlans;
        this.fetchingWorkPlans2 = false;
      });
      return;
    }
    if (status == 8) {
      this.fetchingWorkPlans3 = true;
      this.productionService.getCancelWorkPlans().subscribe((workPlans) => {
        this.workPlans = workPlans;
        this.fetchingWorkPlans3 = false;
      });
      return;
    }
    if (status == 0) {
      this.workPlans = this.workPlansCopy;
      return;
    }
    this.workPlans = this.workPlansCopy.filter((wp) => wp.status == status);
  }

  filterByItemOrOrder(event) {
    let value = event.target.value;
    this.workPlans = this.workPlansCopy.filter((o) =>
      Object.entries(o.orderItems).some(
        (entry) =>
          String(entry[1].itemNumber).toLowerCase().includes(value) ||
          String(entry[1].orderNumber).toLowerCase().includes(value) ||
          String(entry[1].description).toLowerCase().includes(value)
      )
    );
    console.log(this.workPlans);
  }

  clearFilter() {
    this.workPlans = this.workPlansCopy;
  }

  // add or remove selection
  addOrRemove(event, i) {
    if (event.target.checked) this.checkedWorkPlans.push(this.workPlans[i]);
    else {
      let serialNum = this.workPlans[i].serialNumber;
      let j = this.checkedWorkPlans.findIndex(
        (wp) => wp.serialNumber == serialNum
      );
      this.checkedWorkPlans.splice(j, 1);
    }
    console.log(this.checkedWorkPlans);
  }

  showHideCheckBox() {
    if (this.showCheckbox) this.checkedWorkPlans = [];

    this.showCheckbox = !this.showCheckbox;
  }

  setColor(status) {
    switch (status) {
      case 1:
        return "#FFC000";
      case 2:
        return "#68e37d";
      case 3:
        return "#5B9BD5";
      case 4:
        return "#ED7D31";
      case 5:
        return "#C48170";
    }
  }

  filterByRole(status) {
    if (this.authService.loggedInUser.authorization.includes("andrey")) {
      return status > 2;
    } else return true;
  }

  exportAll() {
    let excel = [];
    for (let workPlan of this.workPlans) {
      for (let orderItem of workPlan.orderItems) {
        excel.push({
          "PAKA No.": workPlan.serialNumber,
          "PAKA Status": this.workPlanStatusPipe.transform(workPlan.status),
          "Items Status": this.workPlanStatusPipe.transform(orderItem.status),
          ...orderItem,
        });
      }
    }
    this.excelService.exportAsExcelFile(excel, `תכניות עבודה ${new Date()}`);
  }

  exportExplosion(data, title) {
    let excel = [];
    data.map((i) => {
      excel.push({
        'מק"ט': i.itemNumber,
        "שם החומר": i.itemName,
        "כמות נדרשת": i.kgProduction,
        "כמות במלאי": i.materialArrivals[0].amount,
      });
    });
    this.excelService.exportAsExcelFile(excel, title);
  }

  loadMaterialsForFormule() {
    if (this.checkedWorkPlans.length == 0)
      this.toastr.warning("יש לבחור לפחות תכנית אחת");
    else {
      let orderItemsToExplode = [];
      for (let workPlan of this.checkedWorkPlans) {
        let temp = orderItemsToExplode.concat(workPlan.orderItems);
        orderItemsToExplode = temp;
      }
      this.toastr.info("אנא המתן...", "מחשב כמויות");
      this.loadData = true;
      this.disableCheckBox = true;
      this.inventoryService
        .getMaterialsForFormules(orderItemsToExplode)
        .subscribe((data) => {
          // this.checkedWorkPlans = []
          this.materialsForFormules = data.newArray;
          this.showMaterialsForFormules = true;
          this.loadData = false;
          this.disableCheckBox = false;
        });
    }
  }

  checkAmountsForMaterial(prod, stock) {
    return Number(stock) - Number(prod);
  }
  filterByFamily() {
    let value = String(this.familyFilter.nativeElement.value)
      .toLowerCase()
      .trim();
    if (value == "") {
      this.clearFilter();
    } else {
      this.formuleService.getFormuleByNumber(value).subscribe((data) => {
        console.log(data);
        let parentFormule = data.parentNumber ? data.parentNumber : value;
        console.log(parentFormule);

        this.workPlans = this.workPlansCopy.filter((wp) => {
          let idx = wp.orderItems.findIndex(
            (oi) => oi.parentFormule == parentFormule
          );
          console.log(idx);
          return idx > -1;
        });
        console.log(this.workPlans);
      });
    }
  }
  sortByDate(){
    if(this.sortByDateFlag){
      this.workPlansReportArray.sort((a,b)=>{
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
    }else{
      this.workPlansReportArray.sort((a,b)=>{
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
    }
    this.sortByDateFlag = !this.sortByDateFlag

  }
  reportFilter(){
    if(this.itemNumberReportFilter == "" && this.orderNumberReportFilter == ""){
      return
    }
    try {
    let arr = []
    if(this.itemNumberReportFilter != ""){
      this.workPlansReportArrayCopy.map((wp)=>{
        if(wp && wp.orderItems && wp.orderItems.length > 0){
          wp.orderItems.map((item)=>{
            if(item.itemNumber.includes(this.itemNumberReportFilter) && !arr.includes(wp)){
              arr.push(wp)
            }
          })
        }
      })
    }
    if(this.orderNumberReportFilter != ""){
      this.workPlansReportArrayCopy.map((wp)=>{
        if(wp && wp.orderItems && wp.orderItems.length > 0){
          wp.orderItems.map((item)=>{
            if(item.orderNumber.includes(this.orderNumberReportFilter) && !arr.includes(wp)){
              arr.push(wp)
            }
          })
        }
      })
    }
    this.workPlansReportArray = [...arr]
      
    } catch (error) {
      console.log(error);
      
    }
    
  }

  clearReportFilter(){
    this.itemNumberReportFilter =""
    this.orderNumberReportFilter = ""
    this.workPlansReportArray = this.workPlansReportArrayCopy
  }
}
