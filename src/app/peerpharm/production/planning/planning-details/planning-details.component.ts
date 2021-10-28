import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormulesService } from 'src/app/services/formules.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ProductionService } from 'src/app/services/production.service';
import { ProductionFormule, WorkPlan } from '../WorkPlan';

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

  finalFormule: any;
  statuses: number[] = [1, 2, 3]
  materialsForFormules: Array<any>;
  edit: number = -1
  authorized: boolean = false
  loadData: boolean;
  showMaterialsForFormules: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private productionService: ProductionService,
    private excelService: ExcelService,
    private formuleService: FormulesService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.authorized = this.authService.loggedInUser.authorization.includes('creamProductionManager')
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

  setColor(status) {
    switch (status) {
      case 1: return '#3964e6'
      case 2: return '#39e0e6'
      case 3: return '#38e849'
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

  printFormule(formule: ProductionFormule) {
    this.formuleService.getFormuleByNumber(formule.formule).subscribe(data => {
      this.finalFormule = this.formuleCalculate(data, formule.totalKG)
      console.log(this.finalFormule)
      this.finalFormule.weight = formule.totalKG
      setTimeout(() => this.printFormuleBtn.nativeElement.click(), 500)
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
    this.toastr.info("This might take a few seconds...", "Please Wait");
    this.loadData = true;
    this.inventoryService
      .getMaterialsForFormules(this.workPlan.orderItems)
      .subscribe((data) => {
        this.materialsForFormules = data.newArray;
        this.showMaterialsForFormules = true;
        this.loadData = false;
      });
  }

  checkAmountsForMaterial(prod, stock) {
    return Number(stock) - Number(prod)
  }

}
