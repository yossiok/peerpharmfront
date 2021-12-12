import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WorkPlanStatusPipe } from 'src/app/pipes/work-plan-status.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ProductionService } from 'src/app/services/production.service';
import { resolve } from 'url';
import { WorkPlan } from '../WorkPlan';

@Component({
  selector: 'app-all-planning',
  templateUrl: './all-planning.component.html',
  styleUrls: ['./all-planning.component.scss']
})
export class AllPlanningComponent implements OnInit {
  workPlans: WorkPlan[];
  workPlansCopy: WorkPlan[];
  checkedWorkPlans: WorkPlan[] = []
  workPlansInterval: any = null
  currentWorkPlan: WorkPlan;
  materialsForFormules: Array<any>
  disableCheckBox: boolean = false
  showMaterialsForFormules: boolean = false
  showWorkPlan: boolean = false
  loadData: boolean = false;
  showCheckbox: boolean = false
  authorized: boolean = false

  constructor(
    private productionService: ProductionService,
    private excelService: ExcelService,
    private workPlanStatusPipe: WorkPlanStatusPipe,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    let bool = await this.getWorkPlans()
    this.authorized = this.authService.loggedInUser.authorization.includes('creamProductionManager')
    this.route.queryParamMap.subscribe(params => {
      if (params["params"].workPlanId && bool) {
        this.openWorkPlan(Number(params["params"].workPlanId))
      }
    })
  }

  getWorkPlans() {
    return new Promise((resolve, reject) => {
      this.productionService.getAllWorkPlans().subscribe(workPlans => {
        this.workPlans = workPlans
        this.workPlansCopy = [...workPlans]
        resolve(true)
      })
    })
  }

  openWorkPlan(serialNum) {
    this.showWorkPlan = true
    this.currentWorkPlan = this.workPlans.find(wp => wp.serialNumber == serialNum)
  }

  closeWorkPlan(i) {
    this.currentWorkPlan = null
    this.showWorkPlan = false
    if (i != -1) {
      this.currentWorkPlan = this.workPlans[i]
      this.showWorkPlan = true
    }
  }

  filterWorkPlans(event) {
    let value = event.target.value.toLowerCase().trim()
    this.workPlans = this.workPlansCopy.filter((o) =>
      Object.entries(o).some((entry) =>
        String(entry[1]).toLowerCase().includes(value)
      )
    );
  }

  filterByStatus(event) {
    let status = event.target.value
    if (status == 0) this.workPlans = this.workPlansCopy
    else this.workPlans = this.workPlansCopy.filter(wp => wp.status == status)
  }

  filterByItemOrOrder(event) {
    let value = event.target.value
    this.workPlans = this.workPlansCopy.filter((o) =>
      Object.entries(o.orderItems).some((entry) =>
        String(entry[1].itemNumber).toLowerCase().includes(value) ||
        String(entry[1].orderNumber).toLowerCase().includes(value) ||
        String(entry[1].description).toLowerCase().includes(value)
      )
    );
  }

  clearFilter() {
    this.workPlans = this.workPlansCopy
  }

  // add or remove selection
  addOrRemove(event, i) {
    if (event.target.checked) this.checkedWorkPlans.push(this.workPlans[i])
    else {
      let serialNum = this.workPlans[i].serialNumber
      let j = this.checkedWorkPlans.findIndex(wp => wp.serialNumber == serialNum)
      this.checkedWorkPlans.splice(j, 1)
    }
    console.log(this.checkedWorkPlans)
  }

  showHideCheckBox() {
    if (this.showCheckbox) this.checkedWorkPlans = []
    this.showCheckbox = !this.showCheckbox
  }

  setColor(status) {
    switch (status) {
      case 1: return '#FFC000'
      case 2: return '#68e37d'
      case 3: return '#5B9BD5'
      case 4: return '#ED7D31'
      case 5: return '#C48170'
    }
  }

  filterByRole(status) {
    if (this.authService.loggedInUser.authorization.includes("andrey")) {
      return status > 2
    }
    else return true
  }

  exportAll() {
    let excel = []
    for (let workPlan of this.workPlans) {
      for (let orderItem of workPlan.orderItems) {
        excel.push({
          "Work Plan": workPlan.serialNumber,
          status: this.workPlanStatusPipe.transform(workPlan.status),
          ...orderItem
        })
      }
    }
    this.excelService.exportAsExcelFile(excel, `תכניות עבודה ${new Date()}`)
  }

  exportExplosion(data, title) {
    let excel = []
    data.map(i => {
      excel.push({
        'מק"ט': i.itemNumber,
        "שם החומר": i.itemName,
        "כמות נדרשת": i.kgProduction,
        "כמות במלאי": i.materialArrivals[0].amount,
      })
    })
    this.excelService.exportAsExcelFile(excel, title)
  }

  loadMaterialsForFormule() {
    if (this.checkedWorkPlans.length == 0) this.toastr.warning('יש לבחור לפחות תכנית אחת')
    else {
      let orderItemsToExplode = []
      for (let workPlan of this.checkedWorkPlans) {
        let temp = orderItemsToExplode.concat(workPlan.orderItems)
        orderItemsToExplode = temp
      }
      this.toastr.info("אנא המתן...", "מחשב כמויות");
      this.loadData = true;
      this.disableCheckBox = true
      this.inventoryService
        .getMaterialsForFormules(orderItemsToExplode)
        .subscribe((data) => {
          // this.checkedWorkPlans = []
          this.materialsForFormules = data.newArray;
          this.showMaterialsForFormules = true;
          this.loadData = false;
          this.disableCheckBox = false
        });
    }

  }

  checkAmountsForMaterial(prod, stock) {
    return Number(stock) - Number(prod)
  }

}
