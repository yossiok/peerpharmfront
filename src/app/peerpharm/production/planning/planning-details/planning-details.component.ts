import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormulesService } from 'src/app/services/formules.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ProductionService } from 'src/app/services/production.service';
import { ProductionFormule, WorkPlan } from '../WorkPlan';
import { ConfirmService } from '../../../../services/confirm.modal.service';

@Component({
  selector: 'app-planning-details',
  templateUrl: './planning-details.component.html',
  styleUrls: ['./planning-details.component.scss']
})
export class PlanningDetailsComponent implements OnInit {

  @Input() workPlan: WorkPlan;
  @Output() closeWorkPlanEmitter: EventEmitter<number> = new EventEmitter<number>()
  @Output() updateWorkPlans: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('editWeight') editWeightDiv: ElementRef
  @ViewChild('printFormuleBtn') printFormuleBtn: ElementRef
  @ViewChild('formuleSection') formuleSection: ElementRef
  @ViewChild('printAmounts') printAmounts: ElementRef

  // finalFormule: any;
  statuses: number[] = [1, 2, 3]
  materialsForFormules: Array<any>;
  edit: number = -1
  authorized: boolean = false
  loadData: boolean;
  showMaterialsForFormules: boolean = false;
  printingFormules: boolean = false

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private productionService: ProductionService,
    private excelService: ExcelService,
    private formuleService: FormulesService,
    private inventoryService: InventoryService,
    private modalService: ConfirmService
  ) { }

  ngOnInit(): void {
    this.authorized = this.authService.loggedInUser.authorization.includes('creamProductionManager')
  }

  authenticate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.modalService.userAnserEventEmitter.subscribe(userChoice => {
        resolve(userChoice);
      });
      this.modalService.confirm({ title: 'title', message: 'message' });
    })
  }

  closeWorkPlan(i: number) {
    this.closeWorkPlanEmitter.emit(i)
  }

  setStatus(event) {
    if (confirm('האם אתה בטוח שברצונך לשנות סטטוס?')) {
      this.workPlan.status = event.target.value
      this.saveChanges()
    }
  }

  saveChanges() {
    this.productionService.editWorkPlan(this.workPlan).subscribe(data => {
      if (data.status) this.toastr.success('הפרטים נשמרו בהצלחה')
      this.edit = -1
      this.workPlan = data
      this.updateWorkPlans.emit()
    })
  }

  deleteLine(i: number) {
    if (confirm('השורה תימחק והכמויות יחושבו מחדש. האם אתה בטוח?')) {
      this.workPlan.orderItems.splice(i, 1)
      this.saveChanges()
    } else this.toastr.warning('לא בוצעו שינויים')
  }

  deleteWorkPlan() {
    if(confirm('למחוק פק"ע???')) {
      this.productionService.deleteWorkPlan(this.workPlan.serialNumber).subscribe(data => {
        this.updateWorkPlans.emit()
        this.closeWorkPlanEmitter.emit(-1)
        console.log(data)
      })
    }
  }

  setColor(status) {
    switch (status) {
      case 1: return '#e5e831'
      case 2: return '#15eb20'
      case 3: return '#595850'
    }
  }

  export(data, title) {
    this.excelService.exportAsExcelFile(data, title)
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

  toast(title, msg) {
    this.toastr.info(msg, title)
  }

  async moveToProduction() {
    if (confirm('להעביר פק"ע לייצור?')) {
      this.workPlan.status = 2
      this.saveChanges()
      let formulesPrinted = await this.printFormules()
      let amountsLoaded = await this.loadMaterialsForFormule()
      setTimeout(()=> {
        this.printAmounts.nativeElement.click()
        setTimeout(()=> {
          this.showMaterialsForFormules = false
        })
      }, 500)
    } else this.toastr.error('בוטל')

  }

  printFormules() {
    return new Promise((resolve, reject) => {
      // this.authenticate().then((approved) => {
      // if (approved) {
      this.printingFormules = true
      // this.toastr.success('אתה תותח')
      setTimeout(() => {
        this.printFormuleBtn.nativeElement.click()
        setTimeout(() => {
          this.printingFormules = false
          resolve(true)
        }, 1000)
      }, 500)
      // }
      // else this.toastr.error('אימות נכשל')
      // })
    })
  }

  formuleCalculate(data, formuleWeight) {
    data.phases.forEach((phase) => {
      phase.items.forEach((item) => {
        item.kgProd = Number(formuleWeight) * (Number(item.percentage) / 100);
      });
    });
    return data;
  }

  loadMaterialsForFormule() {
    return new Promise((resolve, reject) => {

      this.toastr.info("אנא המתן...", "מחשב כמויות");
      this.loadData = true;
      this.inventoryService
        .getMaterialsForFormules(this.workPlan.orderItems)
        .subscribe((data) => {
          this.materialsForFormules = data.newArray;
          this.showMaterialsForFormules = true;
          this.loadData = false;
          resolve(true)
        });
    })
  }

  checkAmountsForMaterial(prod, stock) {
    return Number(stock) - Number(prod)
  }

}
