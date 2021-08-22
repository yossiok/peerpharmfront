import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';
import { ProductionService } from 'src/app/services/production.service';

@Component({
  selector: 'app-yield-history',
  templateUrl: './yield-history.component.html',
  styleUrls: ['./yield-history.component.scss']
})
export class YieldHistoryComponent implements OnInit {
  line: any;
  lines: any = ["1", "2", "3", "4", "5", "6", "7M", "8", "9", "T", "S"]
  yields: any;

  constructor(
    private productionService: ProductionService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
  }

  isChosen(i) {
    if (this.lines[i] == this.line) return 'btn-primary'
    else return 'btn-outline-primary'
  }

  getAllYieldsByLine() {
    this.productionService.getAllYieldsByLine(this.line).subscribe(res => {
      if (res.length > 0) {
        this.yields = res
      }
    })
  }

  getLineYields(i) {
    this.line = this.lines[i]
    this.getAllYieldsByLine()
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(this.yields, `ניצולת קו ${this.line}`)
  }

}
