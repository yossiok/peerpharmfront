import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-formdetails',
  templateUrl: './formdetails.component.html',
  styleUrls: ['./formdetails.component.css']
})
export class FormdetailsComponent implements OnInit {
  form: any = {};
  disabledValue = true;
  averageNetoWeight = 0;
  loggedInUser: UserInfo;
  netoWeightArr: number[] = new Array();
  tabView: String= "fillingForm";
  fillingTabBtn:String ="#fff";
  pPackingTabBtn:String ="transperent";
  compileTabBtn:String ="transperent";
  allChecks: Array<any>=[];

  constructor(
    private excelService:ExcelService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'he']);
    translate.setDefaultLang('he');
    translate.use('he');
   }

  ngOnInit() {
    this.getFormData();
    // this.UserDisableAuth();
    // this.wrapAllChecks();
  }

  async getFormData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.formsService.getFormData(id).subscribe(res => {
        this.form = res[0];
        this.form.checkNetoWeight.forEach(element => {
          if (element) {
            const netNumber = parseInt(element, 10);
            this.netoWeightArr.push(netNumber);
          }
        });
        this.CalcAvgWeight();
        this.wrapAllChecks();
      });
    }
  }

  

  CalcAvgWeight() {
    const arrlength = this.netoWeightArr.length;
    let sum = 0;
    this.netoWeightArr.forEach((element) => {
      sum += element;
    });
    this.averageNetoWeight = sum / arrlength;
  }

  // UserDisableAuth() {
  //   this.disabledcheckNetoWeightValue = this.authService.loggedInUser.formsdisable;
  //   console.log(this.authService.loggedInUser.formsdisable);
  // }

  wrapAllChecks(){
    for (let index = 0; index < this.form.checkTime.length; index++) {
      debugger
      this.allChecks.push({
        checkTime: this.form.checkTime[index],
        checkBox_clean: this.form.checkBox_clean[index],
        checkNetoWeight: this.form.checkNetoWeight[index],
        checkBox_closedWaterProof: this.form.checkBox_closedWaterProof[index],
        checkBox_stickerPrinting: this.form.checkBox_stickerPrinting[index],
        checkBox_lotNumberPrinting: this.form.checkBox_lotNumberPrinting[index],
        checkBox_correctFinalPacking: this.form.checkBox_correctFinalPacking[index],
      });
    }    
  }

  tabChange(view){

    switch (view) {
      case 'fillingForm': {
        this.tabView = 'fillingForm';
        this.fillingTabBtn="#fff"
        this.pPackingTabBtn="#eef5f9";
        this.compileTabBtn="#eef5f9";
        break;
      }
      case 'personalPackingForm': {
        this.tabView = 'packingForm';
        this.fillingTabBtn="#eef5f9"
        this.pPackingTabBtn="#fff";
        this.compileTabBtn="#eef5f9";

        break;
      }
      case 'compileForm': {
        this.tabView = 'compileForm';
        this.fillingTabBtn="#eef5f9"
        this.pPackingTabBtn="#eef5f9";
        this.compileTabBtn="#fff";

        break;
      }
    }
  }


  


  


}
