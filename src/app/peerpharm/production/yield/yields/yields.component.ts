import { Component, OnInit } from '@angular/core';
import { ProductionService } from 'src/app/services/production.service';

@Component({
  selector: 'app-yields',
  templateUrl: './yields.component.html',
  styleUrls: ['./yields.component.scss']
})
export class YieldsComponent implements OnInit {

  lines: any = ["1", "2", "3", "4", "5", "6", "7M", "8", "9", "T", "S"]
  currenTLine: any
  yields: any[]

  constructor(
    private productionService: ProductionService
  ) { }

  ngOnInit(): void {
    this.getTodayYields()
  }

  getTodayYields() {
    this.productionService.getTodayYields().subscribe(yields => {
      this.yields = yields
    })
  }

  changeLine(i) {
    if (confirm('לשנות קו? כל הנתונים שלא נשמרו יאבדו לנצחץ')) {
      this.currentLine
    }
  }

}
