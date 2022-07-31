import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormsService } from "src/app/services/forms.service";
import { ToastrService } from "ngx-toastr";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-checkingforms",
  templateUrl: "./checkingforms.component.html",
  styleUrls: ["./checkingforms.component.scss"],
})
export class CheckingformsComponent implements OnInit {
  libraList: any[];
  clearLibra: any;
  saveBtn: boolean = true;
  editBtn: boolean = false;
  libraCalibrationTests: any[];
  allLibraList: any[];
  calibrationWeekTests: any[];
  allWaterTests: any[];
  allTempTests: any[];
  allCalibrationDayTests: any[];
  allSewerPHTests: any[];
  oldSystemWater: any[];
  newSystemWater: any[];
  EditRowId: any = "";
  calibrationTestRemarks: any;
  waterTestRemarks: any;
  tempTestRemarks: any;
  calibDayRemarks: any;
  calibWeekRemarks: any;
  currBalanceSerialNum: any;
  sewerTestRemarks: any;

  sewerPhTest = {
    year: "",
    date: "",
    pH: "",
    signature: "",
  };

  calibrationDayTest = {
    date: "",
    hour: "",
    calibrationResult: "",
    normalcy: "",
    signature: "",
    year: "",
    month: "",
    deviceLocation: "",
    deviceModel: "",
    phNumber: "",
  };

  temperatureTest = {
    fillingDepartTemp: "",
    packingDepartTemp: "",
    materialStorageTemp: "",
    minWeekProduction: "",
    maxWeekProduction: "",
    date: "",
    signature: "",
    year: "",
    month: "",
    requiredLimits: "15°-30°",
  };

  waterTest = {
    tdsCheck: "",
    phCheck: "",
    saltInTank: "",
    clearAndColor: "",
    hardness: "",
    date: "",
    pressureTest: "",
    pressureBetweenFilters: "",
    signature: "",
    system: "",
  };

  libraCalibration = {
    balanceSerialNum: "",
    libraModel: "",
    manufacturerName: "",
    minCarryCapacity: "",
    maxCarryCapacity: "",
    weightNumOne: "",
    weightNumTwo: "",
    limitsWeightOne: "",
    limitsWeightTwo: "",
    libraLocation: "",
    useFor: "",
    futureCalibDate: "",
    calibCompany: "",
    accuracy: "",
    lastCalibDate: "",
    nextCalibDate: "",
    year: "",
    remarks: "",
  };

  libraCalibrationDetails = {
    month: "",
    date: "",
    hour: "",
    resultWeightOne: "",
    resultWeightTwo: "",
    normalcy: "",
    signature: "",
    libraCalibration: this.libraCalibration,
  };

  calibrationWeek = {
    phNumber: "",
    year: "",
    toolModel: "",
    toolPlace: "",
    phFour: "",
    phSeven: "",
    phTen: "",
    normalcy: false,
    signature: "",
  };

  @ViewChild("libra") libra: ElementRef;
  @ViewChild("libraYear") libraYear: ElementRef;
  @ViewChild("libraModel") libraModel: ElementRef;
  @ViewChild("libraManuName") libraManuName: ElementRef;
  @ViewChild("libraMinCarryCap") libraMinCarryCap: ElementRef;
  @ViewChild("libraWeightOne") libraWeightOne: ElementRef;
  @ViewChild("libraLimitsOne") libraLimitsOne: ElementRef;
  @ViewChild("libraLastCalibDate") libraLastCalibDate: ElementRef;
  @ViewChild("libraFutureCalibDate") libraFutureCalibDate: ElementRef;
  @ViewChild("libraNextCalibDate") libraNextCalibDate: ElementRef;
  @ViewChild("libraWeightTwo") libraWeightTwo: ElementRef;
  @ViewChild("libraLimitsTwo") libraLimitsTwo: ElementRef;
  @ViewChild("libraCalibCompany") libraCalibCompany: ElementRef;
  @ViewChild("libraLocation") libraLocation: ElementRef;
  @ViewChild("libraAccuracy") libraAccuracy: ElementRef;
  @ViewChild("libraRemarks") libraRemarks: ElementRef;

  @ViewChild("calWeekPH") calWeekPH: ElementRef;
  @ViewChild("calWeekYear") calWeekYear: ElementRef;
  @ViewChild("calWeekToolModel") calWeekToolModel: ElementRef;
  @ViewChild("calWeektToolPlace") calWeektToolPlace: ElementRef;

  @ViewChild("toDate") toDate: ElementRef;
  @ViewChild("fromDate") fromDate: ElementRef;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.edit("");
  }

  constructor(
    private excelService: ExcelService,
    private toastSrv: ToastrService,
    private formsService: FormsService
  ) {}

  ngOnInit() {
    this.getAllWaterTests();
    this.getAllTempTests();
    this.getAllSewerPHTests();
    this.getAllLibraList();
  }

  fillFormFields(ev) {
    var phNumber = ev.target.value;
    var date = new Date();
    this.calibrationWeek.year = JSON.stringify(date.getFullYear());
    this.calibrationWeek;

    if (phNumber == "PH01") {
      this.calibrationWeek.toolModel = "HI 2211 HANNA";
      this.calibrationWeek.toolPlace = "מעבדה";
    }
    if (phNumber == "PH02") {
      this.calibrationWeek.toolModel = "HANNA HI 8424 NEW ידני";
      this.calibrationWeek.toolPlace = "חדר בקרת איכות";
    }
    if (phNumber == "PH03") {
      this.calibrationWeek.toolModel = "מכשיר נייד PHB-4";
      this.calibrationWeek.toolPlace = "מחלקת ייצור נוזלים/קרמים";
    }
    if (phNumber == "PH04") {
      this.calibrationWeek.toolModel = "מכשיר נייד PHB-4";
      this.calibrationWeek.toolPlace = "מעבדה חדשה";
    }
    if (phNumber == "PH05") {
      this.calibrationWeek.toolModel = "HI 8424 מכשיר נייד";
      this.calibrationWeek.toolPlace = "מחלקת ייצור נוזלים/קרמים";
    }

    this.getAllCalibrationWeekTests(phNumber);
  }

  edit(id) {
    if (id != "") {
      this.EditRowId = id;
    } else {
      this.EditRowId = "";
    }
  }

  AddOrSaveCalWeekPH() {
    var obj = {
      phNumber: this.calWeekPH.nativeElement.value,
      year: this.calWeekYear.nativeElement.value,
      toolModel: this.calWeekToolModel.nativeElement.value,
      toolPlace: this.calWeektToolPlace.nativeElement.value,
    };

    this.formsService.addNewPHToCalWeek(obj).subscribe((data) => {
      data;
    });
  }

  filterByDate(type) {
    switch (type) {
      case "calibrationWeek":
        this.formsService
          .filterByDate(
            this.calibrationWeek.phNumber,
            this.fromDate.nativeElement.value,
            this.toDate.nativeElement.value
          )
          .subscribe((data) => {
            if (data) {
              data.forEach((obj) => {
                for (let i in obj) {
                  if (obj[i] === true || obj[i] === "true") {
                    obj[i] = "תקין";
                  }
                  if (obj[i] === false || obj[i] === "false") {
                    obj[i] = "לא תקין";
                  }
                }
              });
              this.calibrationWeekTests = data;
            }
          });
        break;
      case "libraCalibration":
        this.formsService
          .filterLibraByDate(
            this.libraCalibration.balanceSerialNum,
            this.fromDate.nativeElement.value,
            this.toDate.nativeElement.value
          )
          .subscribe((data) => {
            if (data) {
              this.libraCalibrationTests = data;
            }
          });
        break;
      case "oldSystemWater":
        this.waterTest.system = "old";
        this.formsService
          .filterOldWaterByDate(
            this.waterTest.system,
            this.fromDate.nativeElement.value,
            this.toDate.nativeElement.value
          )
          .subscribe((data) => {
            if (data) {
              this.oldSystemWater = data;
            }
          });
        break;
      case "newSystemWater":
        this.waterTest.system = "new";
        this.formsService
          .filterNewWaterByDate(
            this.waterTest.system,
            this.fromDate.nativeElement.value,
            this.toDate.nativeElement.value
          )
          .subscribe((data) => {
            if (data) {
              this.newSystemWater = data;
            }
          });
        break;
      case "temperatureTest":
        this.formsService
          .filterTempTestbyDate(
            this.fromDate.nativeElement.value,
            this.toDate.nativeElement.value
          )
          .subscribe((data) => {
            if (data) {
              this.allTempTests = data;
            }
          });
        break;
      case "calibrationDayTest":
        this.formsService
          .filterCalibDayTestByDate(
            this.calibrationDayTest.phNumber,
            this.fromDate.nativeElement.value,
            this.toDate.nativeElement.value
          )
          .subscribe((data) => {
            if (data) {
              data.forEach((obj) => {
                for (let i in obj) {
                  if (obj[i] === true || obj[i] === "true") {
                    obj[i] = "תקין";
                  }
                  if (obj[i] === false || obj[i] === "false") {
                    obj[i] = "לא תקין";
                  }
                }
              });
              this.allCalibrationDayTests = data;
            }
          });
        break;
      case "sewerPhTest":
        this.formsService
          .filterSewerTestByDate(
            this.fromDate.nativeElement.value,
            this.toDate.nativeElement.value
          )
          .subscribe((data) => {
            if (data) {
              this.allSewerPHTests = data;
            }
          });
        break;
      default:
      // code block
    }
  }

  getAllCalibrationWeekTests(phNumber) {
    this.formsService.getAllCalibWeekTests().subscribe((data) => {
      data.forEach((obj) => {
        for (let i in obj) {
          if (obj[i] === true || obj[i] === "true") {
            obj[i] = "תקין";
          }
          if (obj[i] === false || obj[i] === "false") {
            obj[i] = "לא תקין";
          }
        }
      });
      this.calibrationWeekTests = data.filter((c) => c.phNumber == phNumber);
    });
  }

  getAllLibraList() {
    this.formsService.getAllLibraList().subscribe((data) => {
      this.allLibraList = data;
    });
  }

  addNewLibra() {
    var libraCalibration = {
      balanceSerialNum: Number(this.libra.nativeElement.value),
      libraModel: this.libraModel.nativeElement.value,
      manufacturerName: this.libraManuName.nativeElement.value,
      minCarryCapacity: this.libraMinCarryCap.nativeElement.value,
      maxCarryCapacity: "",
      weightNumOne: this.libraWeightOne.nativeElement.value,
      weightNumTwo: this.libraWeightTwo.nativeElement.value,
      limitsWeightOne: this.libraLimitsOne.nativeElement.value,
      limitsWeightTwo: this.libraLimitsTwo.nativeElement.value,
      libraLocation: this.libraLocation.nativeElement.value,
      nextCalibDate: this.libraFutureCalibDate.nativeElement.value,
      calibCompany: this.libraCalibCompany.nativeElement.value,
      lastCalibDate: this.libraLastCalibDate.nativeElement.value,
      remarks: this.libraRemarks.nativeElement.value,
    };
    this.formsService.addNewLibra(libraCalibration).subscribe((data) => {
      if (data.msg == "exist") {
        this.toastSrv.error("Libra Number Exist");
      } else {
        this.toastSrv.success("New Libra Added");
        this.allLibraList = data;
      }
    });
  }

  exportAsXLSX(type): void {
    switch (type) {
      case "calibrationWeek":
        this.excelService.exportAsExcelFile(this.calibrationWeekTests, "data");
        break;
      case "libraCalibration":
        this.excelService.exportAsExcelFile(this.libraCalibrationTests, "data");
        break;
      case "oldWaterSystem":
        this.excelService.exportAsExcelFile(this.oldSystemWater, "data");
        break;
      case "newWaterSystem":
        this.excelService.exportAsExcelFile(this.newSystemWater, "data");
        break;
      case "temperatureTest":
        this.excelService.exportAsExcelFile(this.allTempTests, "data");
        break;
      case "calibrationDayTest":
        this.excelService.exportAsExcelFile(
          this.allCalibrationDayTests,
          "data"
        );
        break;
      case "sewerPhTest":
        this.excelService.exportAsExcelFile(this.allSewerPHTests, "data");
        break;
      default:
    }
  }

  saveLibra() {
    var libraCalibration = {
      balanceSerialNum: Number(this.libra.nativeElement.value),
      libraModel: this.libraModel.nativeElement.value,
      manufacturerName: this.libraManuName.nativeElement.value,
      minCarryCapacity: this.libraMinCarryCap.nativeElement.value,
      weightNumOne: this.libraWeightOne.nativeElement.value,
      weightNumTwo: this.libraWeightTwo.nativeElement.value,
      limitsWeightOne: this.libraLimitsOne.nativeElement.value,
      limitsWeightTwo: this.libraLimitsTwo.nativeElement.value,
      libraLocation: this.libraLocation.nativeElement.value,
      nextCalibDate: this.libraFutureCalibDate.nativeElement.value,
      calibCompany: this.libraCalibCompany.nativeElement.value,
      lastCalibDate: this.libraLastCalibDate.nativeElement.value,
      remarks: this.libraRemarks.nativeElement.value,
    };

    this.formsService.updateLibra(libraCalibration).subscribe((data) => {
      if (data) {
        this.allLibraList = data;
        this.toastSrv.success("Libra updated successfuly");
      }
    });
  }

  clearLibraFields() {
    this.clearLibra = "";
    this.libraCalibration.balanceSerialNum = "";
    this.libraCalibration.libraModel = "";
    this.libraCalibration.manufacturerName = "";
    this.libraCalibration.minCarryCapacity = "";
    this.libraCalibration.maxCarryCapacity = "";
    this.libraCalibration.weightNumOne = "";
    this.libraCalibration.weightNumTwo = "";
    this.libraCalibration.limitsWeightOne = "";
    this.libraCalibration.limitsWeightTwo = "";
    this.libraCalibration.libraLocation = "";
    this.libraCalibration.useFor = "";
    this.libraCalibration.futureCalibDate = "";
    this.libraCalibration.calibCompany = "";
    this.libraCalibration.accuracy = "";
    this.libraCalibration.nextCalibDate = "";
    this.libraCalibration.lastCalibDate = "";
    this.libraCalibration.year = "";
    this.libraCalibration.remarks = "";
    this.libraCalibrationTests = [];
  }
  saveTest() {
    this.calibrationWeek;

    this.formsService
      .saveCalibrationWeek(this.calibrationWeek)
      .subscribe((data) => {
        data.forEach((obj) => {
          for (let i in obj) {
            if (obj[i] === true || obj[i] === "true") {
              obj[i] = "תקין";
            }
            if (obj[i] === false || obj[i] === "false") {
              obj[i] = "לא תקין";
            }
          }
        });
        this.getAllCalibrationWeekTests(this.calibrationWeek.phNumber);
      });
  }

  chooseCalibrationForm(ev) {
    var calibrationForm = ev.target.value;

    this.formsService
      .getCalibrationFormByYear(calibrationForm)
      .subscribe((data) => {
        if (data.length > 0) {
          this.saveBtn = false;
          this.editBtn = true;
          this.calibrationWeek = data[0];
        } else {
          this.calibrationWeek = undefined;
        }
      });
  }

  fillCalibDayDetails(ev) {
    var phNumber = ev.target.value;

    var date = new Date();
    this.calibrationDayTest.year = JSON.stringify(date.getFullYear());

    if (phNumber == "PH01") {
      this.calibrationDayTest.deviceLocation = "מעבדה";
      this.calibrationDayTest.deviceModel = "HI 2211 HANNA";
    }
    if (phNumber == "PH02") {
      this.calibrationDayTest.deviceLocation = "חדר בקרת איכות";
      this.calibrationDayTest.deviceModel = "HANNA HI 8424 NEW ידני";
    }
    if (phNumber == "PH03") {
      this.calibrationDayTest.deviceLocation = "מחלקת ייצור נוזלים/קרמים";
      this.calibrationDayTest.deviceModel = "PHB-4 מכשיר נייד";
    }
    if (phNumber == "PH04") {
      this.calibrationDayTest.deviceLocation = "מעבדה חדשה";
      this.calibrationDayTest.deviceModel = "PHB-4 מכשיר נייד";
    }
    if (phNumber == "PH05") {
      this.calibrationDayTest.deviceLocation = "אולם בישול";
      this.calibrationDayTest.deviceModel = "HANNA HI 8424";
    }
    this.getAllCalibDayTests(phNumber);
  }

  editTest() {
    this.formsService
      .editCalibrationWeek(this.calibrationWeek)
      .subscribe((data) => {
        data;
      });
  }

  getLibraByNumber(ev) {
    var balanceSerialNum = ev.target.value;
    this.currBalanceSerialNum = balanceSerialNum;
    this.formsService.getLibraByNumber(balanceSerialNum).subscribe((data) => {
      if (data) {
        this.libraCalibration = data[0];
      }
    });

    this.formsService
      .getLibraTestsByNumber(balanceSerialNum)
      .subscribe((data) => {
        data.forEach((obj) => {
          for (let i in obj) {
            if (obj[i] === true || obj[i] === "true") {
              obj[i] = "תקין";
            }
            if (obj[i] === false || obj[i] === "false") {
              obj[i] = "לא תקין";
            }
          }
        });
        this.libraCalibrationTests = data.reverse();
      });
  }

  getAllLibraCalibTests() {
    this.formsService.getAllLibraCalibTests().subscribe((data) => {
      data.forEach((obj) => {
        for (let i in obj) {
          if (obj[i] === true || obj[i] === "true") {
            obj[i] = "תקין";
          }
          if (obj[i] === false || obj[i] === "false") {
            obj[i] = "לא תקין";
          }
        }
      });
      this.libraCalibrationTests = data;
    });
  }

  getAllWaterTests() {
    this.formsService.getAllWaterTests().subscribe((data) => {
      data.forEach((obj) => {
        for (let i in obj) {
          if (obj[i] === "exist") {
            obj[i] = "קיים";
          }
          if (obj[i] === "notExist") {
            obj[i] = "לא קיים";
          }
          if (obj[i] === "ok") {
            obj[i] = "תקין";
          }
          if (obj[i] === "notOk") {
            obj[i] = "לא תקין";
          }
        }
      });

      this.allWaterTests = data;

      this.oldSystemWater = this.allWaterTests.filter((w) => w.system == "old");

      this.newSystemWater = this.allWaterTests.filter((w) => w.system == "new");
    });
  }
  getAllTempTests() {
    this.formsService.getAllTempTests().subscribe((data) => {
      this.allTempTests = data;
    });
  }
  getAllCalibDayTests(phNumber) {
    this.formsService.getAllCalibDayTests().subscribe((data) => {
      data.forEach((obj) => {
        for (let i in obj) {
          if (obj[i] === true || obj[i] === "true") {
            obj[i] = "תקין";
          }
          if (obj[i] === false || obj[i] === "false") {
            obj[i] = "לא תקין";
          }
        }
      });
      this.allCalibrationDayTests = data
        .filter((c) => c.phNumber == phNumber)
        .reverse();
    });
  }
  getAllSewerPHTests() {
    this.formsService.getAllSewerPHTests().subscribe((data) => {
      this.allSewerPHTests = data;
    });
  }

  addNewLibraCalibrationTest() {
    this.libraCalibrationDetails.libraCalibration = this.libraCalibration;
    this.formsService
      .addNewLibraTest(this.libraCalibrationDetails)
      .subscribe((data) => {
        data.forEach((obj) => {
          for (let i in obj) {
            if (obj[i] === true || obj[i] === "true") {
              obj[i] = "תקין";
            }
            if (obj[i] === false || obj[i] === "false") {
              obj[i] = "לא תקין";
            }
          }
        });
        this.formsService
          .getLibraTestsByNumber(this.currBalanceSerialNum)
          .subscribe((data) => {
            data.forEach((obj) => {
              for (let i in obj) {
                if (obj[i] === true || obj[i] === "true") {
                  obj[i] = "תקין";
                }
                if (obj[i] === false || obj[i] === "false") {
                  obj[i] = "לא תקין";
                }
              }
            });
            this.libraCalibrationTests = data.reverse();
          });
      });
  }

  addNewWaterTest() {
    this.waterTest.system = "new";
    this.formsService.addNewWaterTest(this.waterTest).subscribe((data) => {
      data.forEach((obj) => {
        for (let i in obj) {
          if (obj[i] === "exist") {
            obj[i] = "קיים";
          }
          if (obj[i] === "notExist") {
            obj[i] = "לא קיים";
          }
          if (obj[i] === "ok") {
            obj[i] = "תקין";
          }
          if (obj[i] === "notOk") {
            obj[i] = "לא תקין";
          }
        }
      });
      this.newSystemWater = data.filter((w) => w.system == "new");
      this.toastSrv.success("New test added");
      this.waterTest.clearAndColor = "";
      this.waterTest.date = "";
      this.waterTest.hardness = "";
      this.waterTest.phCheck = "";
      this.waterTest.pressureBetweenFilters = "";
      this.waterTest.pressureTest = "";
      this.waterTest.saltInTank = "";
      this.waterTest.signature = "";
      this.waterTest.system = "";
      this.waterTest.tdsCheck = "";
    });
  }
  addOldWaterTest() {
    this.waterTest.system = "old";
    this.formsService.addOldWaterTest(this.waterTest).subscribe((data) => {
      data.forEach((obj) => {
        for (let i in obj) {
          if (obj[i] === "exist") {
            obj[i] = "קיים";
          }
          if (obj[i] === "notExist") {
            obj[i] = "לא קיים";
          }
          if (obj[i] === "ok") {
            obj[i] = "תקין";
          }
          if (obj[i] === "notOk") {
            obj[i] = "לא תקין";
          }
        }
      });
      this.oldSystemWater = data.filter((w) => w.system == "old");
      this.toastSrv.success("New test added");
      this.waterTest.clearAndColor = "";
      this.waterTest.date = "";
      this.waterTest.hardness = "";
      this.waterTest.phCheck = "";
      this.waterTest.pressureBetweenFilters = "";
      this.waterTest.pressureTest = "";
      this.waterTest.saltInTank = "";
      this.waterTest.signature = "";
      this.waterTest.system = "";
      this.waterTest.tdsCheck = "";
    });
  }

  addNewTempTest() {
    this.formsService.addNewTempTest(this.temperatureTest).subscribe((data) => {
      if (data) {
        this.allTempTests = data;

        this.toastSrv.success("בדיקה נוספה בהצלחה !");
      }
    });
  }
  addNewCalibDayTest() {
    this.formsService
      .addNewCalibDayTest(this.calibrationDayTest)
      .subscribe((data) => {
        if (data) {
          this.getAllCalibDayTests(this.calibrationDayTest.phNumber);
        }
      });
  }
  addNewSewerPHTest() {
    this.formsService.addNewSewerPHTest(this.sewerPhTest).subscribe((data) => {
      this.allSewerPHTests = data;
    });
  }

  updateCalibTest(id) {
    this.calibrationTestRemarks;

    var obj = {
      _id: id,
      remarks: this.calibrationTestRemarks,
    };

    this.formsService.updateCalibTestRemarks(obj).subscribe((data) => {
      if (data.length > 0) {
        this.libraCalibrationTests = data;
        this.EditRowId = "";
        this.toastSrv.success("עודכן בהצלחה!");
      }
    });
  }

  updateCalibWeekTest(id) {
    var obj = {
      _id: id,
      remarks: this.calibWeekRemarks,
    };

    this.formsService.updateCalibWeekRemarks(obj).subscribe((data) => {
      if (data.length > 0) {
        this.calibrationWeekTests = data;
        this.EditRowId = "";
        this.toastSrv.success("עודכן בהצלחה!");
      }
    });
  }

  updateWaterTest(id) {
    this.waterTestRemarks;

    var obj = {
      _id: id,
      remarks: this.waterTestRemarks,
    };

    this.formsService.updateWaterTestRemarks(obj).subscribe((data) => {
      if (data.length > 0) {
        this.allWaterTests = data;
        this.EditRowId = "";
        this.toastSrv.success("עודכן בהצלחה!");
      }
    });
  }

  updateTempTest(id) {
    var obj = {
      _id: id,
      remarks: this.tempTestRemarks,
    };

    this.formsService.updateTempTestRemarks(obj).subscribe((data) => {
      if (data.length > 0) {
        this.allTempTests = data;
        this.EditRowId = "";
        this.toastSrv.success("עודכן בהצלחה!");
      }
    });
  }

  updateCalibDayTest(id) {
    var obj = {
      _id: id,
      remarks: this.calibDayRemarks,
    };

    this.formsService.updateCalibDayRemarks(obj).subscribe((data) => {
      if (data.length > 0) {
        this.allCalibrationDayTests = data;
        this.EditRowId = "";
        this.toastSrv.success("עודכן בהצלחה!");
      }
    });
  }

  updateSewerTest(id) {
    var obj = {
      _id: id,
      remarks: this.sewerTestRemarks,
    };

    this.formsService.updateSewerTestRemarks(obj).subscribe((data) => {
      if (data.length > 0) {
        this.allSewerPHTests = data;
        this.EditRowId = "";
        this.toastSrv.success("עודכן בהצלחה!");
      }
    });
  }
}
