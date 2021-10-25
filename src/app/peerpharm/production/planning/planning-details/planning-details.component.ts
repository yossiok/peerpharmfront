import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ProductionService } from 'src/app/services/production.service';
import { WorkPlan } from '../WorkPlan';

@Component({
  selector: 'app-planning-details',
  templateUrl: './planning-details.component.html',
  styleUrls: ['./planning-details.component.scss']
})
export class PlanningDetailsComponent implements OnInit {

  @Input() workPlan: WorkPlan;
  @Output() closeWorkPlanEmitter: EventEmitter<any> = new EventEmitter<any>()
  @Output() updateWorkPlans: EventEmitter<any> = new EventEmitter<any>()

  statuses: number[] = [1, 2, 3]
  authorized: boolean = false
  edit: boolean = false

  constructor(
    private authService:AuthService,
    private toastr:ToastrService,
    private productionService: ProductionService
  ) { }

  ngOnInit(): void {
    this.authorized = this.authService.loggedInUser.authorization.includes('creamProductionManager')
  }

  closeWorkPlan() {
    this.closeWorkPlanEmitter.emit()
  }

  setStatus(event) {
    this.workPlan.status = event.target.value
    this.toastr.info('אחרת הסטטוס לא יישמר...','יש לשמור שינויים!')
  }

  saveChanges() {
    this.productionService.editWorkPlan(this.workPlan).subscribe(data => {
      if(data.status) this.toastr.success('הפרטים נשמרו בהצלחה')
      this.edit = false
      this.updateWorkPlans.emit()
    })
  }

  setColor(status){
    switch(status) {
      case 1: return '#3964e6'
      case 2: return '#39e0e6'
      case 3: return '#38e849'
    }
  }

  toast(title, msg) {
    this.toastr.info(msg, title)
  }

}
