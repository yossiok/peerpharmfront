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
      if (res.msg == "No results are found") this.yields = []
      else if (res.length > 0) {
        res.sort((a, b) => {
          let aDate = new Date(a.productionDate).getTime()
          let bDate = new Date(b.productionDate).getTime()
          return bDate - aDate;

        });
        this.yields = res
      }
    })
  }

  getLineYields(i) {
    this.line = this.lines[i]
    this.getAllYieldsByLine()
  }

  exportToExcel() {
    let exports = []
    for (let y of this.yields) {

      let excelRow = {
        "Production Line": y.productionLine,
        "Production Date": y.productionDate.substr(0, 10),
        "User Name": y.userName,
        "Day start time": y.startTime,
        "Day end time": y.endTime,
        "Total day duration": y.brutoDurationToPresent,
        "Net prod. duration(decimal)": parseFloat(y.totalDuration).toFixed(2),
        "Net prod. duration(HH:mm)": y.totalDurationToPresent,
        "Total QTY produced": y.dayProdQty,
        "Products per hour": y.hourProdQty
      }
      exports.push(excelRow)
    }

    this.excelService.exportAsExcelFile(exports, `ניצולת קו ${this.line}`)
  }

}
