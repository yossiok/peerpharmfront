import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkingforms',
  templateUrl: './checkingforms.component.html',
  styleUrls: ['./checkingforms.component.css']
})
export class CheckingformsComponent implements OnInit {

  libraList:any[];
  clearLibra:any;
  saveBtn:boolean = true;
  editBtn:boolean = false;
  libraCalibrationTests:any[]
  allLibraList:any[]
  calibrationWeekTests:any[]
  allWaterTests:any[]
  allTempTests:any[]
  allCalibrationDayTests:any[];
  allSewerPHTests:any[];
  oldSystemWater:any[];
  newSystemWater:any[];
  EditRowId:any = "";
  calibrationTestRemarks:any;
  waterTestRemarks:any;
  tempTestRemarks:any;
  calibDayRemarks:any;
  currBalanceSerialNum:any;
  sewerTestRemarks:any;
  
  sewerPhTest = {
    year:'',
    date:'',
    pH:'',
    signature:'',
  }

  calibrationDayTest = { 

    date:'',
    hour:'',
    calibrationResult:'',
    normalcy:'',
    signature:'',
    year:'',
    month:'',
    deviceLocation:'',
    deviceModel:'',
    phNumber:'',
  }

  temperatureTest = {
    
    fillingDepartTemp:'',
    packingDepartTemp:'',
    materialStorageTemp:'',
    minWeekProduction:'',
    maxWeekProduction:'',
    date:'',
    signature:'',
    year:'',
    month:'',
    requiredLimits:'15°-30°',
  }


  waterTest = {

    tdsCheck:'',
    phCheck:'',
    saltInTank:'',
    clearAndColor:'',
    hardness:'',
    date:'',
    pressureTest:'',
    pressureBetweenFilters:'',
    signature:'',
    system:''

  }

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
    phFour:'',
    phSeven:'',
    phTen:'',
    normalcy:false,
    signature:'',

  }

  @ViewChild('libra') libra: ElementRef;
  @ViewChild('libraYear') libraYear: ElementRef;
  @ViewChild('libraModel') libraModel: ElementRef;
  @ViewChild('libraManuName') libraManuName: ElementRef;
  @ViewChild('libraMinCarryCap') libraMinCarryCap: ElementRef;
  @ViewChild('libraWeightOne') libraWeightOne: ElementRef;
  @ViewChild('libraLimitsOne') libraLimitsOne: ElementRef;
  @ViewChild('libraLastCalibDate') libraLastCalibDate: ElementRef;
  @ViewChild('libraWeightTwo') libraWeightTwo: ElementRef;
  @ViewChild('libraLimitsTwo') libraLimitsTwo: ElementRef;
  @ViewChild('libraExterOrInter') libraExterOrInter: ElementRef;
  @ViewChild('libraLocation') libraLocation: ElementRef;
  @ViewChild('libraUseFor') libraUseFor: ElementRef;
  @ViewChild('libraAccuracy') libraAccuracy: ElementRef;


  @ViewChild('calWeekPH') calWeekPH: ElementRef;
  @ViewChild('calWeekYear') calWeekYear: ElementRef;
  @ViewChild('calWeekToolModel') calWeekToolModel: ElementRef;
  @ViewChild('calWeektToolPlace') calWeektToolPlace: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  constructor(private toastSrv:ToastrService,private formsService: FormsService) { }

  ngOnInit() {
  this.getAllWaterTests();
  this.getAllTempTests();
  this.getAllSewerPHTests();
  this.getAllLibraList();
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

    this.getAllCalibrationWeekTests(phNumber)
  }

  edit(id) {
 
    if(id!=''){
      this.EditRowId = id;
    } else{
      this.EditRowId = '';
    }
  }

  AddOrSaveCalWeekPH(){
    var obj = {
      phNumber:this.calWeekPH.nativeElement.value,
      year:this.calWeekYear.nativeElement.value,
      toolModel:this.calWeekToolModel.nativeElement.value,
      toolPlace:this.calWeektToolPlace.nativeElement.value,
    }

    this.formsService.addNewPHToCalWeek(obj).subscribe(data=>{
      debugger;
      data;
    })
  }

  
  getAllCalibrationWeekTests(phNumber){
    this.formsService.getAllCalibWeekTests().subscribe(data=>{
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = 'No'
          }

      }
        
      })
      this.calibrationWeekTests = data.filter(c=>c.phNumber == phNumber)
    })
  }

  getAllLibraList(){
    this.formsService.getAllLibraList().subscribe(data=>{
      this.allLibraList = data;
    })
  }

  addNewLibra(){
    debugger;

    
  var libraCalibration = {

    balanceSerialNum:Number(this.libra.nativeElement.value),
    libraModel:this.libraModel.nativeElement.value,
    manufacturerName:this.libraManuName.nativeElement.value,
    minCarryCapacity:this.libraMinCarryCap.nativeElement.value,
    maxCarryCapacity:'',
    weightNumOne:this.libraWeightOne.nativeElement.value,
    weightNumTwo:this.libraWeightTwo.nativeElement.value,
    limitsWeightOne:this.libraLimitsOne.nativeElement.value,
    libraLocation:this.libraLocation.nativeElement.value,
    useFor:this.libraUseFor.nativeElement.value,
    futureCalibDate:'',
    externalOrInternalCalib:this.libraExterOrInter.nativeElement.value,
    accuracy:this.libraAccuracy.nativeElement.value,
    lastCalibDate:this.libraLastCalibDate.nativeElement.value,
    year:this.libraYear.nativeElement.value
  }
    this.formsService.addNewLibra(libraCalibration).subscribe(data=>{
    debugger;
   if(data.msg == 'exist'){
     this.toastSrv.error('Libra Number Exist');
   } else {
     this.toastSrv.success('New Libra Added')
     this.allLibraList = data;
   }
    })
  }

  saveLibra(){
    var libraCalibration = {

      balanceSerialNum:Number(this.libra.nativeElement.value),
      libraModel:this.libraModel.nativeElement.value,
      manufacturerName:this.libraManuName.nativeElement.value,
      minCarryCapacity:this.libraMinCarryCap.nativeElement.value,
      maxCarryCapacity:'',
      weightNumOne:this.libraWeightOne.nativeElement.value,
      weightNumTwo:this.libraWeightTwo.nativeElement.value,
      limitsWeightOne:this.libraLimitsOne.nativeElement.value,
      libraLocation:this.libraLocation.nativeElement.value,
      useFor:this.libraUseFor.nativeElement.value,
      futureCalibDate:'',
      externalOrInternalCalib:this.libraExterOrInter.nativeElement.value,
      accuracy:this.libraAccuracy.nativeElement.value,
      lastCalibDate:this.libraLastCalibDate.nativeElement.value,
      year:this.libraYear.nativeElement.value
    }

    this.formsService.updateLibra(libraCalibration).subscribe(data=>{
      if(data){
        this.allLibraList = data;
        this.toastSrv.success('Libra updated successfuly')
      }
   
    })
  }


  clearLibraFields(){
    this.clearLibra = ''
    this.libraCalibration = {

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
    this.libraCalibrationTests = [];
  }
  saveTest(){
  debugger;
    this.calibrationWeek;


    this.formsService.saveCalibrationWeek(this.calibrationWeek).subscribe(data=>{
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = 'No'
          }

      }
        
      })
      this.getAllCalibrationWeekTests(this.calibrationWeek.phNumber)
    
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
    
      } else {
        this.calibrationWeek = undefined
      }
      
    })
  }

  fillCalibDayDetails(ev){
    var phNumber = ev.target.value;

    var date = new Date();
    this.calibrationDayTest.year = JSON.stringify(date.getFullYear());
    


    if(phNumber == 'PH01') {
      this.calibrationDayTest.deviceLocation = 'מעבדה'
      this.calibrationDayTest.deviceModel = 'HI 2211 HANNA'
    }
    if(phNumber == 'PH02') {
      this.calibrationDayTest.deviceLocation = 'הושבת 10.2018'
      this.calibrationDayTest.deviceModel = 'HANNA HI 8424 NEW ידני'
    }
    if(phNumber == 'PH03') {
      this.calibrationDayTest.deviceLocation = 'מחלקת ייצור נוזלים/קרמים'
      this.calibrationDayTest.deviceModel = 'PHB-4 מכשיר נייד'
    }
    if(phNumber == 'PH04') {
      this.calibrationDayTest.deviceLocation = 'SPEAR'
      this.calibrationDayTest.deviceModel = 'PHB-4 מכשיר נייד'
    }
    if(phNumber == 'PH05') {
      this.calibrationDayTest.deviceLocation = 'אולם בישול'
      this.calibrationDayTest.deviceModel = 'HANNA HI 8424'
    }
    this.getAllCalibDayTests(phNumber)
  }

  

  editTest(){
    this.formsService.editCalibrationWeek(this.calibrationWeek).subscribe(data=>{
      debugger;
      data;
    })
  }

  getLibraByNumber(ev){
    debugger
    var balanceSerialNum = ev.target.value
    this.currBalanceSerialNum = balanceSerialNum
    this.formsService.getLibraByNumber(balanceSerialNum).subscribe(data=>{
      debugger;
      if(data){
        this.libraCalibration = data[0]
      }
      
    })

    this.formsService.getLibraTestsByNumber(balanceSerialNum).subscribe(data=>{
      debugger;
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = 'No'
          }

      }
        
      })
      this.libraCalibrationTests = data.reverse();
    })
  }

  getAllLibraCalibTests() {
    this.formsService.getAllLibraCalibTests().subscribe(data=>{

      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === 'true') {
            obj[i] = 'Yes'
          }
          if (obj[i] === 'false') {
            obj[i] = 'No'
          }

      }
        
      })
    this.libraCalibrationTests = data;

    })
  }

  getAllWaterTests() {
    this.formsService.getAllWaterTests().subscribe(data=>{

    this.allWaterTests = data;

    this.oldSystemWater = this.allWaterTests.filter(w=>w.system == 'old')

    this.newSystemWater = this.allWaterTests.filter(w=>w.system == 'new')

    })
  }
  getAllTempTests() {
    this.formsService.getAllTempTests().subscribe(data=>{

    this.allTempTests = data;

    })
  }
  getAllCalibDayTests(phNumber) {
    this.formsService.getAllCalibDayTests().subscribe(data=>{
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = 'No'
          }

      }
        
      })
    this.allCalibrationDayTests = data.filter(c=>c.phNumber == phNumber).reverse();

    })
  }
  getAllSewerPHTests() {
    this.formsService.getAllSewerPHTests().subscribe(data=>{

    this.allSewerPHTests = data;

    })
  }


  addNewLibraCalibrationTest() {
    this.libraCalibrationDetails.libraCalibration = this.libraCalibration
    this.formsService.addNewLibraTest(this.libraCalibrationDetails).subscribe(data=>{
      debugger;
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = 'No'
          }

      }
        
      })
      this.formsService.getLibraTestsByNumber(this.currBalanceSerialNum).subscribe(data=>{
        debugger;
        data.forEach(obj => {
          for (let i in obj) {
            if (obj[i] === true) {
              obj[i] = 'Yes'
            }
            if (obj[i] === false) {
              obj[i] = 'No'
            }
  
        }
          
        })
        this.libraCalibrationTests = data.reverse();
      })

    })
  }

  addNewWaterTest() {
    this.waterTest.system = 'new'
    this.formsService.addNewWaterTest(this.waterTest).subscribe(data=>{
      debugger;
      this.newSystemWater = data.filter(w=>w.system == 'new');
      this.toastSrv.success('New test added')
      this.waterTest.clearAndColor = ''
      this.waterTest.date = ''
      this.waterTest.hardness = ''
      this.waterTest.phCheck = ''
      this.waterTest.pressureBetweenFilters = ''
      this.waterTest.pressureTest = ''
      this.waterTest.saltInTank = ''
      this.waterTest.signature = ''
      this.waterTest.system = ''
      this.waterTest.tdsCheck = ''

      

    })

  }
  addOldWaterTest() {
    this.waterTest.system = 'old'
    this.formsService.addOldWaterTest(this.waterTest).subscribe(data=>{
      debugger;
      this.oldSystemWater = data.filter(w=>w.system == 'old');
      this.toastSrv.success('New test added')
      this.waterTest.clearAndColor = ''
      this.waterTest.date = ''
      this.waterTest.hardness = ''
      this.waterTest.phCheck = ''
      this.waterTest.pressureBetweenFilters = ''
      this.waterTest.pressureTest = ''
      this.waterTest.saltInTank = ''
      this.waterTest.signature = ''
      this.waterTest.system = ''
      this.waterTest.tdsCheck = ''


    })

  }
  
  addNewTempTest() {
    this.formsService.addNewTempTest(this.temperatureTest).subscribe(data=>{
      debugger;
      this.allTempTests = data;

    })

  }
  addNewCalibDayTest() {
    this.formsService.addNewCalibDayTest(this.calibrationDayTest).subscribe(data=>{
      debugger;
      if(data){
        this.getAllCalibDayTests(this.calibrationDayTest.phNumber)
      }

    })

  }
  addNewSewerPHTest() {
    this.formsService.addNewSewerPHTest(this.sewerPhTest).subscribe(data=>{
      debugger;
      this.allSewerPHTests = data;

    })

  }

  updateCalibTest(id){
    debugger;
    this.calibrationTestRemarks

    var obj = {
      _id:id,
      remarks:this.calibrationTestRemarks
    }

    this.formsService.updateCalibTestRemarks(obj).subscribe(data=>{
      debugger;
      if(data.length > 0) {
        this.libraCalibrationTests = data;
        this.EditRowId = '';
        this.toastSrv.success("עודכן בהצלחה!")
      }
    })
  }

  updateWaterTest(id){
    debugger;
    this.waterTestRemarks

    var obj = {
      _id:id,
      remarks:this.waterTestRemarks
    }

    this.formsService.updateWaterTestRemarks(obj).subscribe(data=>{
      debugger;
      if(data.length > 0) {
        this.allWaterTests = data;
        this.EditRowId = '';
        this.toastSrv.success("עודכן בהצלחה!")
      }
    })
  }

  updateTempTest(id){
    debugger;

    var obj = {
      _id:id,
      remarks:this.tempTestRemarks
    }

    this.formsService.updateTempTestRemarks(obj).subscribe(data=>{
      debugger;
      if(data.length > 0) {
        this.allTempTests = data;
        this.EditRowId = '';
        this.toastSrv.success("עודכן בהצלחה!")
      }
    })
  }

  updateCalibDayTest(id){
    debugger;

    var obj = {
      _id:id,
      remarks:this.calibDayRemarks
    }

    this.formsService.updateCalibDayRemarks(obj).subscribe(data=>{
      debugger;
      if(data.length > 0) {
        this.allCalibrationDayTests = data;
        this.EditRowId = '';
        this.toastSrv.success("עודכן בהצלחה!")
      }
    })
  }

  updateSewerTest(id){
    debugger;

    var obj = {
      _id:id,
      remarks:this.sewerTestRemarks
    }

    this.formsService.updateSewerTestRemarks(obj).subscribe(data=>{
      debugger;
      if(data.length > 0) {
        this.allSewerPHTests = data;
        this.EditRowId = '';
        this.toastSrv.success("עודכן בהצלחה!")
      }
    })
  }
}
