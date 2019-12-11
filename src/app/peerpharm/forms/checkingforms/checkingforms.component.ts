import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-checkingforms',
  templateUrl: './checkingforms.component.html',
  styleUrls: ['./checkingforms.component.css']
})
export class CheckingformsComponent implements OnInit {

  libraList:any[];
  saveBtn:boolean = true;
  editBtn:boolean = false;
  libraCalibrationTests:any[]

  libraCalibration = {

    balanceSerialNum:'',
    libraModel:'',
    manufacturerName:'',
    minCarryCapacity:'',
    maxCarryCapacity:'',
    weightNumOne:'',
    weightNumTwo:'',
    limitsWeightOne:'',
    libraLocation:'',
    useFor:'',
    futureCalibDate:'',
    externalOrInternalCalib:'',
    accuracy:'',
    lastCalibDate:'',
    year:''
  }

  libraCalibrationDetails = {

    month:'',
    date:'',
    hour:'',
    resultWeightOne:'',
    resultWeightTwo:'',
    normalcy:'',
    signature:'',
    libraCalibration:this.libraCalibration
    

  }

  calibrationWeek = {
    phNumber:'',
    year:'',
    toolModel:'',
    toolPlace:'',

    JanuaryWeekOneDate:'',
    JanuaryWeekOneHour:'',
    JanuaryWeekOnePHSeven:'',
    JanuaryWeekOnePHFour:'',
    JanuaryWeekOneNormalcy:'',
    JanuaryWeekOneSignature:'',

    JanuaryWeekTwoDate:'',
    JanuaryWeekTwoHour:'',
    JanuaryWeekTwoPHSeven:'',
    JanuaryWeekTwoPHFour:'',
    JanuaryWeekTwoNormalcy:'',
    JanuaryWeekTwoSignature:'',

    JanuaryWeekThreeDate:'',
    JanuaryWeekThreeHour:'',
    JanuaryWeekThreePHSeven:'',
    JanuaryWeekThreePHFour:'',
    JanuaryWeekThreeNormalcy:'',
    JanuaryWeekThreeSignature:'',

    JanuaryWeekFourDate:'',
    JanuaryWeekFourHour:'',
    JanuaryWeekFourPHSeven:'',
    JanuaryWeekFourPHFour:'',
    JanuaryWeekFourNormalcy:'',
    JanuaryWeekFourSignature:'',

    FebruaryWeekOneDate:'',
    FebruaryWeekOneHour:'',
    FebruaryWeekOnePHSeven:'',
    FebruaryWeekOnePHFour:'',
    FebruaryWeekOneNormalcy:'',
    FebruaryWeekOneSignature:'',

    FebruaryWeekTwoDate:'',
    FebruaryWeekTwoHour:'',
    FebruaryWeekTwoPHSeven:'',
    FebruaryWeekTwoPHFour:'',
    FebruaryWeekTwoNormalcy:'',
    FebruaryWeekTwoSignature:'',

    FebruaryWeekThreeDate:'',
    FebruaryWeekThreeHour:'',
    FebruaryWeekThreePHSeven:'',
    FebruaryWeekThreePHFour:'',
    FebruaryWeekThreeNormalcy:'',
    FebruaryWeekThreeSignature:'',

    FebruaryWeekFourDate:'',
    FebruaryWeekFourHour:'',
    FebruaryWeekFourPHSeven:'',
    FebruaryWeekFourPHFour:'',
    FebruaryWeekFourNormalcy:'',
    FebruaryWeekFourSignature:'',

    MarchWeekOneDate:'',
    MarchWeekOneHour:'',
    MarchWeekOnePHSeven:'',
    MarchWeekOnePHFour:'',
    MarchWeekOneNormalcy:'',
    MarchWeekOneSignature:'',

    MarchWeekTwoDate:'',
    MarchWeekTwoHour:'',
    MarchWeekTwoPHSeven:'',
    MarchWeekTwoPHFour:'',
    MarchWeekTwoNormalcy:'',
    MarchWeekTwoSignature:'',

    MarchWeekThreeDate:'',
    MarchWeekThreeHour:'',
    MarchWeekThreePHSeven:'',
    MarchWeekThreePHFour:'',
    MarchWeekThreeNormalcy:'',
    MarchWeekThreeSignature:'',

    MarchWeekFourDate:'',
    MarchWeekFourHour:'',
    MarchWeekFourPHSeven:'',
    MarchWeekFourPHFour:'',
    MarchWeekFourNormalcy:'',
    MarchWeekFourSignature:'',

    AprilWeekOneDate:'',
    AprilWeekOneHour:'',
    AprilWeekOnePHSeven:'',
    AprilWeekOnePHFour:'',
    AprilWeekOneNormalcy:'',
    AprilWeekOneSignature:'',

    AprilWeekTwoDate:'',
    AprilWeekTwoHour:'',
    AprilWeekTwoPHSeven:'',
    AprilWeekTwoPHFour:'',
    AprilWeekTwoNormalcy:'',
    AprilWeekTwoSignature:'',

    AprilWeekThreeDate:'',
    AprilWeekThreeHour:'',
    AprilWeekThreePHSeven:'',
    AprilWeekThreePHFour:'',
    AprilWeekThreeNormalcy:'',
    AprilWeekThreeSignature:'',

    AprilWeekFourDate:'',
    AprilWeekFourHour:'',
    AprilWeekFourPHSeven:'',
    AprilWeekFourPHFour:'',
    AprilWeekFourNormalcy:'',
    AprilWeekFourSignature:'',

    MayWeekOneDate:'',
    MayWeekOneHour:'',
    MayWeekOnePHSeven:'',
    MayWeekOnePHFour:'',
    MayWeekOneNormalcy:'',
    MayWeekOneSignature:'',

    MayWeekTwoDate:'',
    MayWeekTwoHour:'',
    MayWeekTwoPHSeven:'',
    MayWeekTwoPHFour:'',
    MayWeekTwoNormalcy:'',
    MayWeekTwoSignature:'',

    MayWeekThreeDate:'',
    MayWeekThreeHour:'',
    MayWeekThreePHSeven:'',
    MayWeekThreePHFour:'',
    MayWeekThreeNormalcy:'',
    MayWeekThreeSignature:'',

    MayWeekFourDate:'',
    MayWeekFourHour:'',
    MayWeekFourPHSeven:'',
    MayWeekFourPHFour:'',
    MayWeekFourNormalcy:'',
    MayWeekFourSignature:'',

    JuneWeekOneDate:'',
    JuneWeekOneHour:'',
    JuneWeekOnePHSeven:'',
    JuneWeekOnePHFour:'',
    JuneWeekOneNormalcy:'',
    JuneWeekOneSignature:'',

    JuneWeekTwoDate:'',
    JuneWeekTwoHour:'',
    JuneWeekTwoPHSeven:'',
    JuneWeekTwoPHFour:'',
    JuneWeekTwoNormalcy:'',
    JuneWeekTwoSignature:'',

    JuneWeekThreeDate:'',
    JuneWeekThreeHour:'',
    JuneWeekThreePHSeven:'',
    JuneWeekThreePHFour:'',
    JuneWeekThreeNormalcy:'',
    JuneWeekThreeSignature:'',

    JuneWeekFourDate:'',
    JuneWeekFourHour:'',
    JuneWeekFourPHSeven:'',
    JuneWeekFourPHFour:'',
    JuneWeekFourNormalcy:'',
    JuneWeekFourSignature:'',

    JulyWeekOneDate:'',
    JulyWeekOneHour:'',
    JulyWeekOnePHSeven:'',
    JulyWeekOnePHFour:'',
    JulyWeekOneNormalcy:'',
    JulyWeekOneSignature:'',

    JulyWeekTwoDate:'',
    JulyWeekTwoHour:'',
    JulyWeekTwoPHSeven:'',
    JulyWeekTwoPHFour:'',
    JulyWeekTwoNormalcy:'',
    JulyWeekTwoSignature:'',

    JulyWeekThreeDate:'',
    JulyWeekThreeHour:'',
    JulyWeekThreePHSeven:'',
    JulyWeekThreePHFour:'',
    JulyWeekThreeNormalcy:'',
    JulyWeekThreeSignature:'',

    JulyWeekFourDate:'',
    JulyWeekFourHour:'',
    JulyWeekFourPHSeven:'',
    JulyWeekFourPHFour:'',
    JulyWeekFourNormalcy:'',
    JulyWeekFourSignature:'',

    AugustWeekOneDate:'',
    AugustWeekOneHour:'',
    AugustWeekOnePHSeven:'',
    AugustWeekOnePHFour:'',
    AugustWeekOneNormalcy:'',
    AugustWeekOneSignature:'',

    AugustWeekTwoDate:'',
    AugustWeekTwoHour:'',
    AugustWeekTwoPHSeven:'',
    AugustWeekTwoPHFour:'',
    AugustWeekTwoNormalcy:'',
    AugustWeekTwoSignature:'',

    AugustWeekThreeDate:'',
    AugustWeekThreeHour:'',
    AugustWeekThreePHSeven:'',
    AugustWeekThreePHFour:'',
    AugustWeekThreeNormalcy:'',
    AugustWeekThreeSignature:'',

    AugustWeekFourDate:'',
    AugustWeekFourHour:'',
    AugustWeekFourPHSeven:'',
    AugustWeekFourPHFour:'',
    AugustWeekFourNormalcy:'',
    AugustWeekFourSignature:'',

    SeptemberWeekOneDate:'',
    SeptemberWeekOneHour:'',
    SeptemberWeekOnePHSeven:'',
    SeptemberWeekOnePHFour:'',
    SeptemberWeekOneNormalcy:'',
    SeptemberWeekOneSignature:'',

    SeptemberWeekTwoDate:'',
    SeptemberWeekTwoHour:'',
    SeptemberWeekTwoPHSeven:'',
    SeptemberWeekTwoPHFour:'',
    SeptemberWeekTwoNormalcy:'',
    SeptemberWeekTwoSignature:'',

    SeptemberWeekThreeDate:'',
    SeptemberWeekThreeHour:'',
    SeptemberWeekThreePHSeven:'',
    SeptemberWeekThreePHFour:'',
    SeptemberWeekThreeNormalcy:'',
    SeptemberWeekThreeSignature:'',

    SeptemberWeekFourDate:'',
    SeptemberWeekFourHour:'',
    SeptemberWeekFourPHSeven:'',
    SeptemberWeekFourPHFour:'',
    SeptemberWeekFourNormalcy:'',
    SeptemberWeekFourSignature:'',

    OctoberWeekOneDate:'',
    OctoberWeekOneHour:'',
    OctoberWeekOnePHSeven:'',
    OctoberWeekOnePHFour:'',
    OctoberWeekOneNormalcy:'',
    OctoberWeekOneSignature:'',

    OctoberWeekTwoDate:'',
    OctoberWeekTwoHour:'',
    OctoberWeekTwoPHSeven:'',
    OctoberWeekTwoPHFour:'',
    OctoberWeekTwoNormalcy:'',
    OctoberWeekTwoSignature:'',

    OctoberWeekThreeDate:'',
    OctoberWeekThreeHour:'',
    OctoberWeekThreePHSeven:'',
    OctoberWeekThreePHFour:'',
    OctoberWeekThreeNormalcy:'',
    OctoberWeekThreeSignature:'',

    OctoberWeekFourDate:'',
    OctoberWeekFourHour:'',
    OctoberWeekFourPHSeven:'',
    OctoberWeekFourPHFour:'',
    OctoberWeekFourNormalcy:'',
    OctoberWeekFourSignature:'',

    NovemberWeekOneDate:'',
    NovemberWeekOneHour:'',
    NovemberWeekOnePHSeven:'',
    NovemberWeekOnePHFour:'',
    NovemberWeekOneNormalcy:'',
    NovemberWeekOneSignature:'',

    NovemberWeekTwoDate:'',
    NovemberWeekTwoHour:'',
    NovemberWeekTwoPHSeven:'',
    NovemberWeekTwoPHFour:'',
    NovemberWeekTwoNormalcy:'',
    NovemberWeekTwoSignature:'',

    NovemberWeekThreeDate:'',
    NovemberWeekThreeHour:'',
    NovemberWeekThreePHSeven:'',
    NovemberWeekThreePHFour:'',
    NovemberWeekThreeNormalcy:'',
    NovemberWeekThreeSignature:'',

    NovemberWeekFourDate:'',
    NovemberWeekFourHour:'',
    NovemberWeekFourPHSeven:'',
    NovemberWeekFourPHFour:'',
    NovemberWeekFourNormalcy:'',
    NovemberWeekFourSignature:'',

    DecemberWeekOneDate:'',
    DecemberWeekOneHour:'',
    DecemberWeekOnePHSeven:'',
    DecemberWeekOnePHFour:'',
    DecemberWeekOneNormalcy:'',
    DecemberWeekOneSignature:'',

    DecemberWeekTwoDate:'',
    DecemberWeekTwoHour:'',
    DecemberWeekTwoPHSeven:'',
    DecemberWeekTwoPHFour:'',
    DecemberWeekTwoNormalcy:'',
    DecemberWeekTwoSignature:'',

    DecemberWeekThreeDate:'',
    DecemberWeekThreeHour:'',
    DecemberWeekThreePHSeven:'',
    DecemberWeekThreePHFour:'',
    DecemberWeekThreeNormalcy:'',
    DecemberWeekThreeSignature:'',

    DecemberWeekFourDate:'',
    DecemberWeekFourHour:'',
    DecemberWeekFourPHSeven:'',
    DecemberWeekFourPHFour:'',
    DecemberWeekFourNormalcy:'',
    DecemberWeekFourSignature:'',


  }

  constructor(private formsService: FormsService) { }

  ngOnInit() {
  this.getAllLibraCalibTests();
  }


  fillFormFields(ev) {
    debugger;
    var phNumber = ev.target.value;
    var date = new Date();
    this.calibrationWeek.year = JSON.stringify(date.getFullYear());
    this.calibrationWeek

    if(phNumber == 'PH01'){
      this.calibrationWeek.toolModel = 'HI 2211 HANNA'
      this.calibrationWeek.toolPlace = 'מעבדה'
    }
    if(phNumber == 'PH02'){
      this.calibrationWeek.toolModel = 'HANNA HI 8424 NEW ידני'
      this.calibrationWeek.toolPlace = 'הושבת 10/2018'
    }
    if(phNumber == 'PH03'){
      this.calibrationWeek.toolModel = 'מכשיר נייד PHB-4'
      this.calibrationWeek.toolPlace = 'מחלקת ייצור נוזלים/קרמים לא תקין'
    }
    if(phNumber == 'PH04'){
      this.calibrationWeek.toolModel = 'מכשיר נייד PHB-4'
      this.calibrationWeek.toolPlace = 'מחלקת ייצור נוזלים/קרמים לא תקין'
    }
    if(phNumber == 'PH05'){
      this.calibrationWeek.toolModel = 'HI 8424 מכשיר נייד'
      this.calibrationWeek.toolPlace = 'מחלקת ייצור נוזלים/קרמים'
    }
  }

  saveTest(){

    this.calibrationWeek;

    this.formsService.saveCalibrationWeek(this.calibrationWeek).subscribe(data=>{
    debugger;
    data
    })
  }

  chooseCalibrationForm(ev){
    debugger;
    var calibrationForm = ev.target.value;

    this.formsService.getCalibrationFormByYear(calibrationForm).subscribe(data=>{
      debugger;
      if(data.length > 0 ) {
        this.saveBtn = false;
        this.editBtn = true;
       this.calibrationWeek = data[0] 
       this.calibrationWeek.JanuaryWeekFourDate = data[0].JanuaryWeekOneDate.Date
      } else {
        this.calibrationWeek = undefined
      }
      
    })
  }

  editTest(){
    this.formsService.editCalibrationWeek(this.calibrationWeek).subscribe(data=>{
      debugger;
      data;
    })
  }

  getAllLibraList(ev){
    debugger
    var balanceSerialNum = ev.target.value
    this.formsService.getAllLibraList(balanceSerialNum).subscribe(data=>{
      debugger;
      this.libraCalibration = data[0]
    })
  }

  getAllLibraCalibTests() {
    this.formsService.getAllLibraCalibTests().subscribe(data=>{

    this.libraCalibrationTests = data;

    })
  }


  addNewLibraCalibrationTest() {
    this.libraCalibrationDetails.libraCalibration = this.libraCalibration
    this.formsService.addNewLibraTest(this.libraCalibrationDetails).subscribe(data=>{
      debugger;
      this.libraCalibrationTests = data;

    })
  }
}
