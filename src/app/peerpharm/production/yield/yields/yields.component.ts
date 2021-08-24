import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/services/production.service';

@Component({
  selector: 'app-yields',
  templateUrl: './yields.component.html',
  styleUrls: ['./yields.component.scss']
})
export class YieldsComponent implements OnInit {

  yesterday: boolean;
  lineIndex: number
  currentLine: string = ""
  saveYiealdInterval: any = null;
  yields: any;
  lines: any = ["1", "2", "3", "4", "5", "6", "7M", "8", "9", "T", "S"]
  currentYield: FormGroup = new FormGroup({
    userName: new FormControl(null),
    productionLine: new FormControl(this.currentLine, Validators.required),
    productionDate: new FormControl(null, Validators.required),
    startTime: new FormControl(null, Validators.required),
    endTime: new FormControl(null, Validators.required),
    currentCleaning: new FormGroup({
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      duration: new FormControl(null)
    }),
    allCleanings: new FormControl([]),
    allSetups: new FormControl([]),
    currentSetup: new FormGroup({
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      duration: new FormControl(null)
    }),
    allWaitings: new FormControl([]),
    currentWaiting: new FormGroup({
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      duration: new FormControl(null),
      cause: new FormControl('')
    }),
    totalDuration: new FormControl(null),
    brutoDurationToPresent: new FormControl(''),
    totalDurationToPresent: new FormControl(''),
    dayProdQty: new FormControl(null, Validators.required),
    hourProdQty: new FormControl(null),
  })



  constructor(
    private productionService: ProductionService,
    private toastr: ToastrService,
    private modalService: NgbModal
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

  open(modal, i) {
    this.lineIndex = i
    let lineIsActive
    if (this.yields) lineIsActive = this.yields.find(y => y.productionLine == this.lines[i])
    if (lineIsActive) this.switchLine()
    else {
      this.lineIndex = i
      this.currentLine = this.lines[i]
      this.modalService.open(modal)
    }
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

  switchLine(i?) {
    // let cont = confirm('את/ה עומד/ת לפתוח קו חדש על שמך. האם את/ה בטוח/ה?')
    // if (cont) {
    this.yesterday = false
    this.currentLine = this.lines[this.lineIndex]
    this.productionService.getLineYieldByDate(this.currentLine, new Date()).subscribe(yieldData => {
      // delete yieldData._id

      this.currentYield.reset()
      this.currentYield.patchValue(yieldData)
      this.getOpenYields()
    })
    // }
  }

  openYesterday() {
    this.yesterday = true
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    this.productionService.getLineYieldByDate(this.currentLine, yesterday).subscribe(yieldData => {
      // delete yieldData._id

      this.currentYield.reset()
      this.currentYield.patchValue(yieldData)
    })
  }

  // calculateCleaningTime() {
  //   let startTime = this.currentYield.value.allCleanings.startTime
  //   console.log(startTime)
  //   let endTime = this.currentYield.value.allCleanings.endTime
  //   console.log(endTime)
  //   if (startTime > endTime) this.toastr.error('יש להגדיר זמן סיום לאחר זמן התחלה')
  //   else this.currentYield.controls.allCleanings.setValue({ duration: this.durationCalculate(startTime, endTime) })
  //   console.log(this.currentYield.value.allCleanings.duration)
  // }

  addCleaning() {
    console.log('Line 144 Add Cleaning')
    let startTime = this.currentYield.value.currentCleaning.startTime
    console.log(startTime)
    let endTime = this.currentYield.value.currentCleaning.endTime
    console.log(endTime)
    let allCleaningsArr = this.currentYield.value.allCleanings;

    if (startTime > endTime) this.toastr.error('יש להגדיר זמן סיום לאחר זמן התחלה')
    // else if (allCleaningsArr && allCleaningsArr.length > 0 && startTime < allCleaningsArr[allCleaningsArr.length - 1].endTime) {
    //   this.toastr.error('יש להגדיר זמן התחלה גדול או שווה לזמן הסיום של הניקיון הקודם')
    // }
    else {
      let duration = this.durationCalculate(startTime, endTime)
      console.log(duration);
      let cleaning = {
        "startTime": startTime,
        "endTime": endTime,
        "duration": duration
      }
      this.currentYield.value.allCleanings.push(cleaning)
      this.saveYield()
      this.currentYield.controls.currentCleaning.reset()
    }
  }
  addSetup() {
    console.log('Line 174 Add Cleaning')
    let startTime = this.currentYield.value.currentSetup.startTime
    console.log(startTime)
    let endTime = this.currentYield.value.currentSetup.endTime
    console.log(endTime)
    let allSetupsArr = this.currentYield.value.allSetups;

    if (startTime > endTime) this.toastr.error('יש להגדיר זמן סיום לאחר זמן התחלה')
    // else if (allSetupsArr && allSetupsArr.length > 0 && startTime < allSetupsArr[allSetupsArr.length - 1].endTime) {
    //   this.toastr.error('יש להגדיר זמן התחלה גדול או שווה לזמן הסיום של הניקיון הקודם')
    // }
    else {
      let duration = this.durationCalculate(startTime, endTime)
      console.log(duration);
      let setup = {
        "startTime": startTime,
        "endTime": endTime,
        "duration": duration
      }
      this.currentYield.value.allSetups.push(setup)
      this.saveYield()
      this.currentYield.controls.currentSetup.reset()
    }
  }
  addWaiting() {
    console.log('Line 202 Add Waiting')
    let startTime = this.currentYield.value.currentWaiting.startTime
    console.log(startTime)
    let endTime = this.currentYield.value.currentWaiting.endTime
    console.log(endTime)
    let cause = this.currentYield.value.currentWaiting.cause as String;
    console.log(cause)
    let allWaitingsArr = this.currentYield.value.allWaitings;

    if (startTime > endTime) this.toastr.error('יש להגדיר זמן סיום לאחר זמן התחלה')
    // else if (
    //   allWaitingsArr
    //   && allWaitingsArr.length > 0
    //   && startTime < allWaitingsArr[allWaitingsArr.length - 1].endTime
    // ) {
    //   this.toastr.error('יש להגדיר זמן התחלה גדול או שווה לזמן הסיום הקודם  של ההמתנה ')
    // }
    else {
      let duration = this.durationCalculate(startTime, endTime)
      console.log(duration);
      let waiting = {
        "startTime": startTime,
        "endTime": endTime,
        "duration": duration,
        "cause": cause
      }
      console.log("Line 223, waiting is: ")
      console.log(waiting)
      if (!this.currentYield.value.allWaitings) this.currentYield.value.allWaitings = [];
      this.currentYield.value.allWaitings.push(waiting)
      console.log(this.currentYield.value.allWaitings)
      this.saveYield()
      this.currentYield.controls.currentWaiting.reset()
    }
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
    let maxEndTime = "00:00";
    let minStartTime = "24:00";
    let allWaitingsArr = this.currentYield.value.allWaitings;
    let allSetupsArr = this.currentYield.value.allSetups;
    let allCleaningsArr = this.currentYield.value.allCleanings;
    let accumulatedWaiting = 0;

    //Check that the waiting periods start after the daily start time and end before the daily end time

    for (let period of allWaitingsArr) {
      // period.startTime = period.startTime ? period.startTime : "24:00"
      minStartTime = minStartTime < period.startTime ? minStartTime : period.startTime;
      // period.endTime = period.endTime ? period.endTime : "00:00"
      maxEndTime = maxEndTime > period.endTime ? maxEndTime : period.endTime;
    }
    for (let period of allSetupsArr) {
      minStartTime = minStartTime < period.startTime ? minStartTime : period.startTime;
      maxEndTime = maxEndTime > period.endTime ? maxEndTime : period.endTime;
    }
    for (let period of allCleaningsArr) {
      // period.startTime = period.startTime ? period.startTime : "24:00"
      minStartTime = minStartTime < period.startTime ? minStartTime : period.startTime;
      // period.endTime = period.endTime ? period.endTime : "00:00"
      maxEndTime = maxEndTime > period.endTime ? maxEndTime : period.endTime;
    }
    if (maxEndTime > this.currentYield.value.endTime) {

      this.toastr.error('אחד מזמני ההמתנה מוגדר אחרי זמן סיום.', 'חישוב הופסק')
    }

    else if (minStartTime < this.currentYield.value.startTime) {

      this.toastr.error('אחד מזמני ההמתנה מוגדר לפני זמן ההתחלה.', 'חישוב הופסק')
    }
    else {

      // build one array with all the waiting periods arrays
      let allPeriodsArray = allCleaningsArr.concat(allSetupsArr, allWaitingsArr);
      // sort the objects in the array by the start time
      allPeriodsArray = this.sortArray(allPeriodsArray)

      console.log(allPeriodsArray);
      // reset all the skip properties in the array to false before we start the calculation
      for (let period of allPeriodsArray) {
        period.skip = false;
      }

      let endTime = "00:00";
      // calculation of the overall waiting period in minutes
      for (let i = 0; i < allPeriodsArray.length - 1; i++) {
        if (!allPeriodsArray[i].skip) {
          endTime = allPeriodsArray[i].endTime;
          console.log("Line 312, " + i + ": " + endTime)
          allPeriodsArray[i].skip = true;
          // check if there is overlaping between this period and the rest, if yes, change the end time to the latest one
          for (let j = i + 1; j < allPeriodsArray.length; j++) {
            if (allPeriodsArray[j].startTime < endTime && allPeriodsArray[j].endTime > endTime) {
              endTime = allPeriodsArray[j].endTime
              allPeriodsArray[j].skip = true;
            } else if (allPeriodsArray[j].startTime < endTime) {
              allPeriodsArray[j].skip = true;
            }
          }
          console.log("end time: " + i + ": " + endTime);
          console.log("start time: " + i + ": " + allPeriodsArray[i].startTime)
          // add the waiting duration in minutes to the accumulatedWaiting duration
          accumulatedWaiting += (this.durationCalculate(allPeriodsArray[i].startTime, endTime)).minutes + (this.durationCalculate(allPeriodsArray[i].startTime, endTime)).hours * 60;
          console.log(this.durationCalculate(allPeriodsArray[i].startTime, endTime).minutes)
          console.log(accumulatedWaiting)
        }
      }
      // calculate the daily duration 
      let brutoDuration = this.durationCalculate(this.currentYield.value.startTime, this.currentYield.value.endTime)
      console.log(brutoDuration);
      let brutoDurationMinutes = brutoDuration.hours * 60 + brutoDuration.minutes

      // calculate the neto daily duration
      let totalDurationMinutes = brutoDurationMinutes - accumulatedWaiting;
      let totalDuration = totalDurationMinutes / 60
      console.log(totalDuration)
      this.currentYield.controls.totalDuration.setValue(totalDuration)
      this.currentYield.controls.hourProdQty.setValue(Math.round(this.currentYield.value.dayProdQty / totalDuration))

      // Presentation of bruto and netto time
      this.currentYield.controls.totalDurationToPresent.setValue(this.durationToPresent(totalDuration))
      console.log(brutoDurationMinutes)
      brutoDuration = brutoDurationMinutes / 60;
      console.log(brutoDuration)
      this.currentYield.controls.brutoDurationToPresent.setValue(this.durationToPresent(brutoDuration))
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
    // console.log(moment.duration(endTime.diff(startTime)))
    // console.log(this.currentYield.value.cleaningDuration)
    console.log("Line 384")
    console.log(moment.duration(endTime.diff(startTime))['_data'])
    return moment.duration(endTime.diff(startTime))['_data']
  }

  durationToPresent(duration) {
    let number = duration.toString().split('.')
    let hour = number[0]
    let decimal = number[1].slice(0, 2)
    console.log("decimal: " + decimal)
    decimal = "0." + decimal;
    console.log("string decimal: ", decimal)
    let minutes = Math.round(decimal * 60)
    console.log("minutes: ", minutes)
    if (minutes < 10) return `${hour}:0${minutes}`
    else return `${hour}:${minutes}`
  }
  sortArray(objArray) {

    function compare(a, b) {
      if (a.startTime < b.startTime) {
        return -1;
      }
      if (a.startTime > b.startTime) {
        return 1;
      }
      return 0;
    }
    return objArray.sort(compare);
  }


}
