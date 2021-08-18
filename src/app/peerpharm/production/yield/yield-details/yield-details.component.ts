import { Component, Input, OnInit } from '@angular/core';
import { ProductionService } from 'src/app/services/production.service';

@Component({
  selector: 'app-yield-details',
  templateUrl: './yield-details.component.html',
  styleUrls: ['./yield-details.component.scss']
})
export class YieldDetailsComponent implements OnInit {

  @Input() line: string
  @Input() yield: any

  constructor(
    private productionService: ProductionService
  ) { }

  ngOnInit(): void {

  }

}
