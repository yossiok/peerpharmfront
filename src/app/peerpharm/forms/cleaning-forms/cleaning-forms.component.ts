import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cleaning-forms',
  templateUrl: './cleaning-forms.component.html',
  styleUrls: ['./cleaning-forms.component.scss']
})
export class CleaningFormsComponent implements OnInit {

  allDailyCleanForms:any[];
  allDailyCleanSecondForms:any[];
  allDailyProdCleanForms:any[];

  dailyCleanForm = {

    date:'',
    year:'',
    month:'',
    bathroom:false,
    offices:false,
    entrance:false,
    employeesKitchen:false,
    worker:'',
  }

  dailyCleanFormSecond = {
    date:'',
    year:'',
    month:'',
    bathroom:false,
    offices:false,
    worker:'',
  }

  productionDailyClean = {

    date:'',
    year:'',
    month:'',
    bathroom:false,
    womenBathroom:false,
    productionArea:false,
    fillingArea:false,
    worker:'',

  }

  constructor(private formsService: FormsService,private toastr: ToastrService) { }

  ngOnInit() {
    var date = new Date();
    this.dailyCleanForm.year = JSON.stringify(date.getFullYear());
    this.dailyCleanFormSecond.year = JSON.stringify(date.getFullYear());
    this.productionDailyClean.year = JSON.stringify(date.getFullYear());

    this.getAllDailyCleanForms();
    this.getAllDailyCleanSecondForms();
    this.getAllProdDailyClean();
   
  }
    

  
  saveProdDailyClean(){
    debugger;
    
    
   
      this.formsService.saveProdDailyClean(this.productionDailyClean).subscribe(data=>{
        if(data.length > 0) {
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyProdCleanForms = data;
        }  else if (data._id){
          var cleanForm = this.allDailyProdCleanForms.find(f=>f._id == data._id);
          cleanForm.bathroom = data.bathroom
          cleanForm.womenBathroom = data.womenBathroom
          cleanForm.productionArea = data.productionArea
          cleanForm.fillingArea = data.fillingArea
          cleanForm.worker = data.worker
          this.toastr.success('Date updated - תאריך עודכן')
          this.getAllProdDailyClean();
        
        }

  
      })
    
  }
  saveDailyCleanForm(){
    debugger;
    

      this.formsService.saveNewDailyClean(this.dailyCleanForm).subscribe(data=>{
        if(data.length > 0) {
          debugger;
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyCleanForms = data;
        } else if (data._id){
          var cleanForm = this.allDailyCleanForms.find(f=>f._id == data._id);
          cleanForm.bathroom = data.bathroom
          cleanForm.entrance = data.entrance
          cleanForm.employeesKitchen = data.employeesKitchen
          cleanForm.offices = data.offices
          cleanForm.worker = data.worker
          this.toastr.success('Date updated - תאריך עודכן')
          this.getAllDailyCleanForms();
        }
  
      })
   
  }

  saveDailyCleanFormSecond(){
    debugger;
    
    
      this.formsService.saveNewDailyCleanSecond(this.dailyCleanFormSecond).subscribe(data=>{
        debugger;
        if(data.length > 0) {
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyCleanSecondForms = data;
        } else if (data._id){
          var cleanForm = this.allDailyCleanSecondForms.find(f=>f._id == data._id);
          cleanForm.bathroom = data.bathroom
          cleanForm.offices = data.offices
          cleanForm.worker = data.worker
          this.toastr.success('Date updated - תאריך עודכן')
          this.getAllDailyCleanSecondForms();
        }
  
  
      })
    
  }

  
  getAllDailyCleanForms(){
    debugger;
    this.formsService.getAllDailyCleanForms().subscribe(data=>{
      debugger
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = ''
          }

      }
        
      });
      this.allDailyCleanForms = data;
    })
  }

  getAllDailyCleanSecondForms(){
    this.formsService.getAllDailyCleanSecondForms().subscribe(data=>{
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = ''
          }

      }
        
      })
      this.allDailyCleanSecondForms = data;
    })
  }

  getAllProdDailyClean(){
    this.formsService.getAllProdDailyClean().subscribe(data=>{
      data.forEach(obj => {
        for (let i in obj) {
          if (obj[i] === true) {
            obj[i] = 'Yes'
          }
          if (obj[i] === false) {
            obj[i] = ''
          }

      }
        
      })
      this.allDailyProdCleanForms = data;
    })
  }
}
