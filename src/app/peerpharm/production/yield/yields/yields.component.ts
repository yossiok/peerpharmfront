import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/services/production.service';

@Component({
  selector: 'app-yields',
  templateUrl: './yields.component.html',
  styleUrls: ['./yields.component.scss']
})
export class YieldsComponent implements OnInit {

  saveYiealdInterval: any = null;
  lines: any = ["1", "2", "3", "4", "5", "6", "7M", "8", "9", "T", "S"]
  yields: any;
  currentLine: string = ""
  currentYield: FormGroup = new FormGroup({
    userName: new FormControl(null),
    productionLine: new FormControl(this.currentLine, Validators.required),
    productionDate: new FormControl(null, Validators.required),
    startTime: new FormControl(null, Validators.required),
    endTime: new FormControl(null, Validators.required),
    cleaningStart: new FormControl(null),
    cleaningEnd: new FormControl(null),
    cleaningDuration: new FormControl(null),
    setupStart: new FormControl(null),
    setupEnd: new FormControl(null),
    setupDuration: new FormControl(null),
    waitingStart: new FormControl(null),
    waitingEnd: new FormControl(null),
    waitingCause: new FormControl(''),
    waitingDuration: new FormControl(null),
    totalDuration: new FormControl(null),
    brutoDurationToPresent: new FormControl(null),
    totalDurationToPresent: new FormControl(''),
    dayProdQty: new FormControl(null, Validators.required),
    hourProdQty: new FormControl(null),
  })

  constructor(
    private productionService: ProductionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.startInterval();
    this.getOpenYields()
  }

  stopInterval() {
    clearInterval(this.saveYiealdInterval)
  }

  startInterval() {
    this.saveYiealdInterval = setInterval(() => {
      this.saveYield();
    }, 1000 * 60 * 3);
  }

  getOpenYields() {
    this.productionService.getAllYieldsByDate(new Date()).subscribe(res => {
      if (!res.msg) this.yields = res
    })
  }

  checkActiveLines(line) {
    if (this.yields) {
      let activeLine = this.yields.find(y => y.productionLine == line)
      if (activeLine) return 'btn-primary'
      else return 'btn-outline-primary'
    }
    else return 'btn-outline-primary'
  }

  // startNewLine() {
  //   this.productionService.getLineYieldByDate(this.currentLine, new Date()).subscribe(yieldData => {
  //     this.currentYield.patchValue(yieldData)
  //   })
  // }

  switchLine(i) {
    let lineIsActive
    if (this.yields) lineIsActive = this.yields.find(y => y.productionLine == this.lines[i])
    let cont = true
    if (!lineIsActive) cont = confirm('את/ה עומד/ת לפתוח קו חדש על שמך. האם את/ה בטוח/ה?')
    if (cont) {
      this.currentLine = this.lines[i]
      this.productionService.getLineYieldByDate(this.currentLine, new Date()).subscribe(yieldData => {
        // delete yieldData._id
        this.currentYield.reset()
        this.currentYield.patchValue(yieldData)
        this.getOpenYields()
      })
    }
  }

  calculateCleaningTime() {
    let startTime = this.currentYield.value.cleaningStart
    let endTime = this.currentYield.value.cleaningEnd
    if (startTime > endTime) this.toastr.error('יש להגדיר זמן סיום לאחר זמן התחלה')
    else this.currentYield.controls.cleaningDuration.setValue(this.durationCalculate(startTime, endTime))
  }

  calculateSetupTime() {
    let startTime = this.currentYield.value.setupStart
    let endTime = this.currentYield.value.setupEnd
    if (startTime > endTime) this.toastr.error('יש להגדיר זמן סיום לאחר זמן התחלה')
    else this.currentYield.controls.setupDuration.setValue(this.durationCalculate(startTime, endTime))
  }

  calculateWaitingTime() {
    let startTime = this.currentYield.value.waitingStart
    let endTime = this.currentYield.value.waitingEnd
    if (startTime > endTime) this.toastr.error('יש להגדיר זמן סיום לאחר זמן התחלה')
    else this.currentYield.controls.waitingDuration.setValue(this.durationCalculate(startTime, endTime))
  }

  calculateTotalDuration() {
    if (this.currentYield.value.waitingEnd > this.currentYield.value.endTime || this.currentYield.value.cleaningEnd > this.currentYield.value.endTime || this.currentYield.value.setupEnd > this.currentYield.value.endTime) {
      this.toastr.error('אחד מזמני ההמתנה מוגדר אחרי זמן סיום.', 'חישוב הופסק')
    }
    else {
      let brutoDuration = this.durationCalculate(this.currentYield.value.startTime, this.currentYield.value.endTime)
      let brutoDurationMinutes = brutoDuration.hours * 60 + brutoDuration.minutes

      let onHoldDurationMinutes
      let cleaning = this.currentYield.value.cleaningDuration ? this.currentYield.value.cleaningDuration.hours * 60 + this.currentYield.value.cleaningDuration.minutes : 0
      let setup = this.currentYield.value.setupDuration ? this.currentYield.value.setupDuration.hours * 60 + this.currentYield.value.setupDuration.minutes : 0
      let waiting = this.currentYield.value.waitingDuration ? this.currentYield.value.waitingDuration.hours * 60 + this.currentYield.value.waitingDuration.minutes : 0
      onHoldDurationMinutes = cleaning + setup + waiting

      let totalDurationMinutes = brutoDurationMinutes - onHoldDurationMinutes
      let totalDuration = totalDurationMinutes / 60
      this.currentYield.controls.totalDuration.setValue(totalDuration)
      this.currentYield.controls.hourProdQty.setValue(Math.round(this.currentYield.value.dayProdQty / totalDuration))

      // Presentation of bruto and netto time
      this.currentYield.controls.totalDurationToPresent.setValue(this.durationToPresent(totalDuration))
      this.currentYield.controls.brutoDurationToPresent.setValue(this.durationToPresent((brutoDuration.hours * 60 + brutoDuration.minutes) / 60))
      this.saveYield()
    }
  }

  saveYield() {
    console.log(this.currentYield.value)
    this.productionService.addUpdateYield(this.currentLine, this.currentYield.value).subscribe(res => {
      if (!res.msg) this.toastr.success('הפרטים נשמרו בהצלחה')
    })
  }

  checkTimes() {
    if (this.currentYield.value.startTime > this.currentYield.value.endTime) {
      this.toastr.error('זמן התחלה צריך ליהיות לפני זמן סיום..')
      this.currentYield.controls.startTime.reset()
      this.currentYield.controls.endTime.reset()
    }
  }

  // פונקציות עזר
  durationCalculate(startTime, endTime) {
    startTime = moment(startTime, "HH:mm")
    endTime = moment(endTime, "HH:mm")
    console.log(moment.duration(endTime.diff(startTime)))
    console.log(this.currentYield.value.cleaningDuration)
    return moment.duration(endTime.diff(startTime))['_data']
  }

  durationToPresent(duration) {
    let number = duration.toString().split('.')
    let hour = number[0]
    let decimal = number[1].slice(0, 2)
    let minutes = Math.round(decimal / 100 * 60)
    return `${hour}:${minutes}`
  }


}
