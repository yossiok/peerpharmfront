import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
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
    this.UserDisableAuth();
  }

  getFormData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formsService.getFormData(id).subscribe(res => {
        this.form = res[0];
        debugger
        this.form.checkNetoWeight.forEach(element => {
          if (element) {
            const netNumber = parseInt(element, 10);
            this.netoWeightArr.push(netNumber);
          }
        });
        this.CalcAvgWeight();
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

  UserDisableAuth() {
    this.disabledValue = this.authService.loggedInUser.formsdisable;
    console.log(this.authService.loggedInUser.formsdisable);
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
