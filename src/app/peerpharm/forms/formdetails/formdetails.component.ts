import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/services/excel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formdetails',
  templateUrl: './formdetails.component.html',
  styleUrls: ['./formdetails.component.scss']
})
export class FormdetailsComponent implements OnInit {
  form: any = {};
  disabledValue = true;
  formQAPalletsData:any[]
  user:any;
  averageNetoWeight = 0;
  loggedInUser: UserInfo;
  netoWeightArr: number[] = new Array();
  tabView: String= "fillingForm";
  fillingTabBtn:String ="#fff";
  pPackingTabBtn:String ="transperent";
  compileTabBtn:String ="transperent";
  allChecks: Array<any>=[];
  formid="";
  showQAPalletsModal:boolean = false;
  allowUpdateForm:boolean = false;

  newQAPallet = {
    floorNumber:0,
    kartonQuantity:0,
    unitsInKarton:0,
    lastFloorQuantity:0,
    unitsQuantityPartKarton:0,
    qaStatus:'',
    batchNumber:'',
    customerName:'',
    formDetailsId:'',
    orderNumber:'',
    itemNumber:'',
    isPersonalPackage:false
  }

  newTest = {
    checkTime:'',
    checkBox_clean:'',
    checkNetoWeight:'',
    checkBox_closedWaterProof:'',
    checkBox_stickerPrinting:'',
    checkBox_lotNumberPrinting:'',
    checkBox_correctFinalPacking:'',

  }

  constructor(
    private excelService:ExcelService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public translate: TranslateService,
    private toastService: ToastrService
  ) {

   }

  ngOnInit() {
    this.getFormData(true);
    this.getUserInfo();
    // this.UserDisableAuth();
    // this.wrapAllChecks();
  }

  async getFormData(allChecks) {
    ;
    const id = this.route.snapshot.paramMap.get('id');
    this.formid=id;
    if (id) {
      await this.formsService.getFormData(id).subscribe(res => {
        this.form = res[0];
        if(this.form.productionEndDate){
          let days = this.form.productionEndDate.slice(8,10)
          let monthes = this.form.productionEndDate.slice(5,7)
          this.form.productionEndDate = this.form.productionEndDate.slice(0,5);
          this.form.productionEndDate = this.form.productionEndDate+days+'-'+monthes

        }
       
        this.form.produc
        ;
        this.form.checkNetoWeight.forEach(element => {
          if (element) {
            const netNumber = parseInt(element, 10);
            this.netoWeightArr.push(netNumber);
          }
        });
        this.CalcAvgWeight();
        if(allChecks) this.wrapAllChecks();
      });
    }
  }

  async addNewTest(newTest){
    
    this.form.checkTime.push(newTest.checkTime);
    this.form.checkBox_clean.push(newTest.checkBox_clean);
    this.form.checkNetoWeight.push(newTest.checkNetoWeight);
    this.form.checkBox_closedWaterProof.push(newTest.checkBox_closedWaterProof);
    this.form.checkBox_stickerPrinting.push(newTest.checkBox_stickerPrinting);
    this.form.checkBox_lotNumberPrinting.push(newTest.checkBox_lotNumberPrinting);
    this.form.checkBox_correctFinalPacking.push(newTest.checkBox_correctFinalPacking);
    
    debugger;
    this.updateFormDetails();
    this.allChecks.push(newTest)


  }

  deleteQAPallet(QAPallet) {

  this.formsService.deleteQAPallet(QAPallet).subscribe(data=>{

    if(data){
      this.toastService.success('משטח נמחק בהצלחה')
    } else {
      this.toastService.success('אירעה שגיאה , אנא פנה למנהל מערכת')
    }
    this.loadQAPallets(this.form._id);
  })    

  }

  addNewQAPallet() {

    debugger;
    this.form
    this.newQAPallet.batchNumber = this.form.batchN;
    this.newQAPallet.itemNumber = this.form.itemN;
    this.newQAPallet.orderNumber = this.form.orderNumber;
    this.newQAPallet.formDetailsId = this.form._id;
    this.newQAPallet.batchNumber = this.form.batchN;
    this.newQAPallet.customerName = this.form.costumerName
    if(this.newQAPallet.qaStatus == 'עובר לאריזה אישית') this.newQAPallet.isPersonalPackage = true

    this.formsService.createNewQaPallet(this.newQAPallet).subscribe(result=>{

      if(result){

        result = this.calculateSumAmount(result)
        let tempObj = {...this.newQAPallet}

        this.formQAPalletsData.push(tempObj)
        this.toastService.success('משטח חדש נוסף בהצלחה')
        this.newQAPallet.floorNumber = 0
        this.newQAPallet.kartonQuantity = 0
        this.newQAPallet.lastFloorQuantity = 0
        this.newQAPallet.unitsInKarton = 0
        this.newQAPallet.unitsQuantityPartKarton = 0
      } else {
        this.toastService.success('אירעה שגיאה , אנא פנה למנהל מערכת')
      }

    })

  }

  updateFormDetails(){
    debugger;
    this.formsService.updateFormDetails(this.form).subscribe(result=>{

      if(result.ok == 1){

        this.getFormData(false)
        this.toastService.success('טופס עודכן בהצלחה !');
        this.showQAPalletsModal = false;
        
      } else {

        this.toastService.error('טופס לא עודכן , אנא נסה שנית או פנה למנהל מערכת')

      }

    })

  }

  

  CalcAvgWeight() {
    const arrlength = this.netoWeightArr.length;
    let sum = 0;
    this.netoWeightArr.forEach((element) => {
      sum += element;
    });
    this.averageNetoWeight = sum / arrlength;
  }

  async loadQAPallets(formId) {
    debugger;
    this.formsService.getQAPalletsByFormId(formId).subscribe(QAPallets =>{
        
      if(QAPallets){
        
        this.showQAPalletsModal = true;

        QAPallets = this.calculateSumAmount(QAPallets);

        this.formQAPalletsData = QAPallets;
      }
    })


  }

  calculateSumAmount(QAPallets){

    for (let i = 0; i < QAPallets.length; i++) {
  
      let count = 0;

      if(QAPallets[i].palletStatus == 'done') QAPallets[i].palletStatus = 'הועלה על משטח'
      if(QAPallets[i].palletStatus == 'open') QAPallets[i].palletStatus = 'ממתין למשטח'

      count = QAPallets[i].floorNumber*QAPallets[i].kartonQuantity*QAPallets[i].unitsInKarton

      if(QAPallets[i].lastFloorQuantity > 0) count += QAPallets[i].lastFloorQuantity*QAPallets[i].unitsInKarton

      if(QAPallets[i].unitsQuantityPartKarton > 0) count += QAPallets[i].unitsQuantityPartKarton

      QAPallets[i].sumAmount = count;
    }

    return QAPallets
    
  }

  getUserInfo() {


    if (this.authService.loggedInUser) {
      this.user = this.authService.loggedInUser
      if (this.user.authorization) {
        if (this.authService.loggedInUser.authorization.includes("updateFormDetails")) {
          this.allowUpdateForm = true;
          this.disabledValue = false

        }



      }

    } else {
      this.authService.userEventEmitter.subscribe(user => {
        this.user = user;
        if (this.user.authorization) {
          if (this.authService.loggedInUser.authorization.includes("updateFormDetails")) {
            this.allowUpdateForm = true;
            this.disabledValue = false
          }
        }
      });

    }

  }

  // UserDisableAuth() {
  //   this.disabledcheckNetoWeightValue = this.authService.loggedInUser.formsdisable;
  //   console.log(this.authService.loggedInUser.formsdisable);
  // }

  wrapAllChecks(){
    debugger;
    for (let index = 0; index < this.form.checkTime.length; index++) { 
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
