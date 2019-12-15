import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cleaning-forms',
  templateUrl: './cleaning-forms.component.html',
  styleUrls: ['./cleaning-forms.component.css']
})
export class CleaningFormsComponent implements OnInit {

  allDailyCleanForms:any[];
  allDailyCleanSecondForms:any[];
  allDailyProdCleanForms:any[];

  dailyCleanForm = {

    date:'',
    year:'',
    month:'',
    bathroom:'',
    offices:'',
    entrance:'',
    employeesKitchen:'',
  }

  dailyCleanFormSecond = {
    date:'',
    year:'',
    month:'',
    bathroom:'',
    offices:'',
  }

  productionDailyClean = {

    date:'',
    year:'',
    month:'',
    bathroom:'',
    womenBathroom:'',
    productionArea:'',
    fillingArea:'',

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
    
    if(this.productionDailyClean.date != '' && this.productionDailyClean.month != '') {
      this.formsService.saveProdDailyClean(this.productionDailyClean).subscribe(data=>{
        if(data.length > 0) {
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyProdCleanForms = data;
        }
  
      })
    } else {
      this.toastr.error('Please Fill Date & Month - אנא תמלא תאריך וחודש')
    }
  }
  saveDailyCleanForm(){
    debugger;
    
    if(this.dailyCleanForm.date != '' && this.dailyCleanForm.month != '') {
      this.formsService.saveNewDailyClean(this.dailyCleanForm).subscribe(data=>{
        if(data.length > 0) {
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyCleanForms = data;
        }
  
      })
    } else {
      this.toastr.error('Please Fill Date & Month - אנא תמלא תאריך וחודש')
    }
  }

  saveDailyCleanFormSecond(){
    debugger;
    
    if(this.dailyCleanFormSecond.date != '' && this.dailyCleanFormSecond.month != '') {
      this.formsService.saveNewDailyCleanSecond(this.dailyCleanFormSecond).subscribe(data=>{
        if(data.length > 0) {
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyCleanSecondForms = data;
        }
  
      })
    } else {
      this.toastr.error('Please Fill Date & Month - אנא תמלא תאריך וחודש')
    }
  }

  
  getAllDailyCleanForms(){
    debugger;
    this.formsService.getAllDailyCleanForms().subscribe(data=>{
      this.allDailyCleanForms = data;
    })
  }

  getAllDailyCleanSecondForms(){
    this.formsService.getAllDailyCleanSecondForms().subscribe(data=>{
      this.allDailyCleanSecondForms = data;
    })
  }
  getAllProdDailyClean(){
    this.formsService.getAllProdDailyClean().subscribe(data=>{
      this.allDailyProdCleanForms = data;
    })
  }
}
