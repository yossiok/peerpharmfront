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
        }
  
      })
    
  }
  saveDailyCleanForm(){
    debugger;
    

      this.formsService.saveNewDailyClean(this.dailyCleanForm).subscribe(data=>{
        if(data.length > 0) {
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyCleanForms = data;
        }
  
      })
   
  }

  saveDailyCleanFormSecond(){
    debugger;
    
    
      this.formsService.saveNewDailyCleanSecond(this.dailyCleanFormSecond).subscribe(data=>{
        if(data.length > 0) {
        this.toastr.success('Successfuly Saved - נשמר בהצלחה')
        this.allDailyCleanSecondForms = data;
        }
  
      })
    
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
