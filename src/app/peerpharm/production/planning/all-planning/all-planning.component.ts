import { Component, OnInit } from '@angular/core';
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
    private productionService: ProductionService
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

}
