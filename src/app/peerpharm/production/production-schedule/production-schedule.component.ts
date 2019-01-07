import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../../../services/production.service';

@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.css']
})
export class ProductionScheduleComponent implements OnInit {
  requests: any[];
  constructor(private productionService: ProductionService) {}

  ngOnInit() {
    this.productionService.getAllProductionSchedule().subscribe(res => {
      this.requests = res;
      console.log(res);
    });
  }
}
