import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormulesService } from 'src/app/services/formules.service';
import { ProductionService } from 'src/app/services/production.service';
import { ProductionFormule, WorkPlan } from '../WorkPlan';

@Component({
  selector: 'app-planning-details',
  templateUrl: './planning-details.component.html',
  styleUrls: ['./planning-details.component.scss']
})
export class PlanningDetailsComponent implements OnInit {

  @Input() workPlan: WorkPlan;
  @Output() closeWorkPlanEmitter: EventEmitter<any> = new EventEmitter<any>()
  @Output() updateWorkPlans: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('editWeight') editWeightDiv: ElementRef 
  @ViewChild('printFormuleBtn') printFormuleBtn: ElementRef 

  finalFormule: any;
  statuses: number[] = [1, 2, 3]
  authorized: boolean = false
  edit: number = -1

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private productionService: ProductionService,
    private excelService: ExcelService,
    private formuleService: FormulesService
  ) { }

  ngOnInit(): void {
    this.authorized = this.authService.loggedInUser.authorization.includes('creamProductionManager')
  }

  closeWorkPlan() {
    this.closeWorkPlanEmitter.emit()
  }

  setStatus(event) {
    this.workPlan.status = event.target.value
    this.toastr.info('אחרת הסטטוס לא יישמר...', 'יש לשמור שינויים!')
  }

  saveChanges(i: number) {
    this.productionService.editWorkPlan(this.workPlan).subscribe(data => {
      if (data.status) this.toastr.success('הפרטים נשמרו בהצלחה')
      this.edit = i
      this.updateWorkPlans.emit()
      this.closeWorkPlanEmitter.emit()
    })
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

  toast(title, msg) {
    this.toastr.info(msg, title)
  }

  printFormule(formule: ProductionFormule) {
    this.formuleService.getFormuleByNumber(formule.formule).subscribe(data => {
      this.finalFormule = this.formuleCalculate(data, formule.totalKG)
      console.log(this.finalFormule)
      this.finalFormule.weight = formule.totalKG
      setTimeout(()=> this.printFormuleBtn.nativeElement.click(), 500)
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

}
