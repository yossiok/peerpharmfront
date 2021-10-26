import { Component, OnInit } from '@angular/core';
import { WorkPlanStatusPipe } from 'src/app/pipes/work-plan-status.pipe';
import { ExcelService } from 'src/app/services/excel.service';
import { ProductionService } from 'src/app/services/production.service';
import { WorkPlan } from '../WorkPlan';

@Component({
  selector: 'app-all-planning',
  templateUrl: './all-planning.component.html',
  styleUrls: ['./all-planning.component.scss']
})
export class AllPlanningComponent implements OnInit {
  workPlans: WorkPlan[];
  workPlansInterval: any = null
  currentWorkPlan: WorkPlan;
  showWorkPlan: boolean = false

  constructor(
    private productionService: ProductionService,
    private excelService: ExcelService,
    private workPlanStatusPipe: WorkPlanStatusPipe
  ) { }

  ngOnInit(): void {
   this.getWorkPlans()
  }

  getWorkPlans() {
    this.productionService.getAllWorkPlans().subscribe(workPlans => {
      this.workPlans = workPlans
    })
  }

  openWorkPlan(serialNum) {
    this.showWorkPlan = true
    this.currentWorkPlan = this.workPlans.find(wp=> wp.serialNumber == serialNum)
  }

  closeWorkPlan() {
    this.currentWorkPlan = null
    this.showWorkPlan = false
  }

  exportAll() {
    let excel = []
    for(let workPlan of this.workPlans) {
      for(let orderItem of workPlan.orderItems) {
        excel.push({
          "Work Plan": workPlan.serialNumber,
          status: this.workPlanStatusPipe.transform(workPlan.status),
          ...orderItem
        })
      }
    }
    this.excelService.exportAsExcelFile(excel, `תכניות עבודה ${new Date()}`)
  }

}
