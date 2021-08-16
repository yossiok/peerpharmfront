import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ProductionService } from 'src/app/services/production.service';

@Component({
  selector: 'app-yields',
  templateUrl: './yields.component.html',
  styleUrls: ['./yields.component.scss']
})
export class YieldsComponent implements OnInit {

  saveYiealdInterval: any = null;
  lines: any = ["1", "2", "3", "4", "5", "6", "7M", "8", "9", "T", "S"]
  currentLine: string = ""
  currentYield: FormGroup = new FormGroup({
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
    waitingCause: new FormControl(null),
    waitingDuration: new FormControl(null),
    totalDuration: new FormControl(null),
    dayProdQty: new FormControl(null, Validators.required),
    hourProdQty: new FormControl(null, Validators.required),
  })

  constructor(
    private productionService: ProductionService
  ) { }

  ngOnInit(): void {
    this.startInterval();
  }


  stopInterval() {
    clearInterval(this.saveYiealdInterval)
  }

  startInterval() {
    // this.saveYiealdInterval = setInterval(() => {
    //   this.saveYield();
    // }, 1000 * 60 * 3);
  }

  switchLine(i) {
    if (confirm('לשנות קו? כל הנתונים שלא נשמרו יאבדו לנצח')) {
      this.currentLine = this.lines[i]
      this.productionService.getLineYieldByDate(this.currentLine, new Date()).subscribe(yieldData => {
        this.currentYield.patchValue(yieldData)
      })
    }
  }

  calculateYield() {

    // let startTime = moment(this.currentYield.value.setupStart, "HH:mm")
    // let endTime = moment(this.currentYield.value.setupEnd, "HH:mm")
    // let setUpDuration = moment.duration(endTime.diff(startTime));
    // console.log(setUpDuration['_data'].minutes)
  }

  calculateCleaningTime() {
    let startTime = this.currentYield.value.cleaningStart
    let endTime = this.currentYield.value.cleaningEnd
    this.currentYield.controls.cleaningDuration.setValue(this.durationCalculate(startTime, endTime))
  }

  calculateSetupTime() {
    let startTime = this.currentYield.value.setupStart
    let endTime = this.currentYield.value.setupEnd
    this.currentYield.controls.setupDuration.setValue(this.durationCalculate(startTime, endTime))
    console.log(this.currentYield.value.cleaningDuration)
  }

  calculateWaitingTime() {
    let startTime = this.currentYield.value.waitingStart
    let endTime = this.currentYield.value.waitingEnd
    this.currentYield.controls.waitingDuration.setValue(this.durationCalculate(startTime, endTime))
  }

  durationCalculate(startTime, endTime) {
    startTime = moment(startTime, "HH:mm")
    endTime = moment(endTime, "HH:mm")
    console.log(moment.duration(endTime.diff(startTime)))
    console.log(this.currentYield.value.cleaningDuration)
    return moment.duration(endTime.diff(startTime))['_data']
  }

  saveYield() {
    console.log(this.currentYield.value)
    this.productionService.addUpdateYield(this.currentLine, this.currentYield.value).subscribe(res => {
      console.log(res)
    })
  }


}
