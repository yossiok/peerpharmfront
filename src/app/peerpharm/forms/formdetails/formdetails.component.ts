import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Costumer } from '../../classes/costumer.class';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-formdetails',
  templateUrl: './formdetails.component.html',
  styleUrls: ['./formdetails.component.scss']
})
export class FormdetailsComponent implements OnInit {
  form: any = {};
  disabledValue = true;
  formQAPalletsData: any[]
  user: any;
  currentScheduleId: any;
  averageNetoWeight = 0;
  loggedInUser: UserInfo;
  newForm: boolean = false;
  netoWeightArr: number[] = new Array();
  tabView: String = "fillingForm";
  fillingTabBtn: String = "#fff";
  pPackingTabBtn: String = "transperent";
  compileTabBtn: String = "transperent";
  itemTreeTabBtn: String = "transperent";
  allChecks: Array<any> = [];
  formid = "";
  formDetailsItemNum: any;
  showQAPalletsModal: boolean = false;
  allowUpdateForm: boolean = false;

  newQAPallet = {
    floorNumber: 0,
    kartonQuantity: 0,
    unitsInKarton: 0,
    lastFloorQuantity: 0,
    unitsQuantityPartKarton: 0,
    qaStatus: '',
    batchNumber: '',
    customerName: '',
    formDetailsId: '',
    orderNumber: '',
    itemNumber: '',
    isPersonalPackage: false
  }

  newTest = {
    checkTime: '',
    checkBox_clean: '',
    checkNetoWeight: '',
    checkBox_closedWaterProof: '',
    checkBox_stickerPrinting: '',
    checkBox_lotNumberPrinting: '',
    checkBox_correctFinalPacking: '',

  }

  constructor(
    private excelService: ExcelService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public translate: TranslateService,
    private toastService: ToastrService,
    private scheduleService: ScheduleService
  ) {

  }

  ngOnInit() {

    let formID = this.route.snapshot.paramMap.get('id');
    let scheduleID = this.route.snapshot.paramMap.get('id2');
    // if (tempId.includes('scheduleId')) {
    //   this.currentScheduleId = tempId.split('scheduleId').join('')
    //   this.checkIfFormExist(this.currentScheduleId)
    // } else {
    //   this.getFormData(true);
    // }
    this.getUserInfo();
    if(scheduleID && scheduleID != '0') {
      this.checkIfFormExist(scheduleID)
      .then(formID => {
        this.getFormData(true, formID)
      }).catch(scheduleID => {
        this.getScheduleDetails(scheduleID)
      })
    } 
    else this.getFormData(true, formID)
    // this.UserDisableAuth();
    // this.wrapAllChecks();
  }

  async checkIfFormExist(scheduleId) {
    return new Promise((resolve, reject) => {
      this.formsService.getFormIdByScheduleId(scheduleId).subscribe(data => {
        if (data.formId != 'noform') {
          resolve(data.formId)
          // this.formid = data.formId
          // this.getFormData(true)
        } else {
          reject(scheduleId)
        }
      })
    })


  }

  async getScheduleDetails(scheduleId) {
    this.scheduleService.getScheduleById(scheduleId).subscribe(data => {
      if (data) {
        let tempObj = {
          batchN: data.batch,
          itemN: data.item,
          costumerName: data.costumer,
          productName: data.productName,
          orderNumber: data.orderN,
          orderQuantity: data.qty,
        }
        this.formDetailsItemNum = data.item
        this.form = tempObj
        this.form.scheduleId = scheduleId
        this.newForm = true;
      }
    })
  }

  async getFormData(allChecks, formID) {
    this.formid = formID
    await this.formsService.getFormData(this.formid).subscribe(res => {
      this.form = res[0];
      this.formDetailsItemNum = this.form.itemN
      if (this.form.productionEndDate) {
        let days = this.form.productionEndDate.slice(8, 10)
        let monthes = this.form.productionEndDate.slice(5, 7)
        this.form.productionEndDate = this.form.productionEndDate.slice(0, 5);
        this.form.productionEndDate = this.form.productionEndDate + days + '-' + monthes
      }
      this.form.checkNetoWeight.forEach(element => {
        if (element) {
          const netNumber = parseInt(element, 10);
          this.netoWeightArr.push(netNumber);
        }
      });
      this.CalcAvgWeight();
      if (allChecks) this.wrapAllChecks();
    });
  }

  async addNewTest(newTest) {
    this.form.checkTime.push(newTest.checkTime);
    this.form.checkBox_clean.push(newTest.checkBox_clean);
    this.form.checkNetoWeight.push(newTest.checkNetoWeight);
    this.form.checkBox_closedWaterProof.push(newTest.checkBox_closedWaterProof);
    this.form.checkBox_stickerPrinting.push(newTest.checkBox_stickerPrinting);
    this.form.checkBox_lotNumberPrinting.push(newTest.checkBox_lotNumberPrinting);
    this.form.checkBox_correctFinalPacking.push(newTest.checkBox_correctFinalPacking);
    this.updateFormDetails();
    this.allChecks.push(newTest)
  }

  deleteQAPallet(QAPallet) {

    this.formsService.deleteQAPallet(QAPallet).subscribe(data => {

      if (data) {
        this.toastService.success('משטח נמחק בהצלחה')
      } else {
        this.toastService.success('אירעה שגיאה , אנא פנה למנהל מערכת')
      }
      this.loadQAPallets(this.form._id);
    })

  }

  addNewQAPallet() {

    this.form
    this.newQAPallet.batchNumber = this.form.batchN;
    this.newQAPallet.itemNumber = this.form.itemN;
    this.newQAPallet.orderNumber = this.form.orderNumber;
    this.newQAPallet.formDetailsId = this.form._id;
    this.newQAPallet.batchNumber = this.form.batchN;
    this.newQAPallet.customerName = this.form.costumerName


    if (this.newQAPallet.qaStatus == 'עובר לאריזה אישית') this.newQAPallet.isPersonalPackage = true

    this.formsService.createNewQaPallet(this.newQAPallet).subscribe(result => {

      if (result) {

        result = this.calculateSumAmount(result)
        let tempObj = { ...this.newQAPallet }

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


  updateFormDetails() {

    try {

      this.formsService.updateFormDetails(this.form).subscribe(result => {

        if (result.ok == 1) {

          this.getFormData(this.formid, false)
          this.toastService.success('טופס עודכן בהצלחה !');
          this.showQAPalletsModal = false;

        } else {

          this.toastService.error('טופס לא עודכן , אנא נסה שנית או פנה למנהל מערכת')

        }

      })

    } catch (error) {

      this.toastService.error('אירעה שגיאה בעדכון , אנא נסה שנית')

    }


  }

  goBack() {
    window.history.back();
  }

  createFormDetails() {
    this.form.quantity_Produced = 0;
    this.formsService.createFormDetails(this.form).subscribe(data => {
      if (data) {
        this.toastService.success('טופס נוצר בהצלחה')!
        this.newForm = false;
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
    this.formsService.getQAPalletsByFormId(formId).subscribe(QAPallets => {

      if (QAPallets) {

        this.showQAPalletsModal = true;

        QAPallets = this.calculateSumAmount(QAPallets);

        this.formQAPalletsData = QAPallets;
      }
    })


  }

  calculateSumAmount(QAPallets) {

    for (let i = 0; i < QAPallets.length; i++) {

      let count = 0;

      if (QAPallets[i].palletStatus == 'done') QAPallets[i].palletStatus = 'הועלה על משטח'
      if (QAPallets[i].palletStatus == 'open') QAPallets[i].palletStatus = 'ממתין למשטח'

      count = QAPallets[i].floorNumber * QAPallets[i].kartonQuantity * QAPallets[i].unitsInKarton

      if (QAPallets[i].lastFloorQuantity > 0) count += QAPallets[i].lastFloorQuantity * QAPallets[i].unitsInKarton

      if (QAPallets[i].unitsQuantityPartKarton > 0) count += QAPallets[i].unitsQuantityPartKarton

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

  wrapAllChecks() {
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

  tabChange(view) {

    switch (view) {
      case 'fillingForm': {
        this.tabView = 'fillingForm';
        this.fillingTabBtn = "#fff"
        this.pPackingTabBtn = "#eef5f9";
        this.compileTabBtn = "#eef5f9";
        this.itemTreeTabBtn = "#eef5f9"
        break;
      }
      case 'personalPackingForm': {
        this.tabView = 'packingForm';
        this.fillingTabBtn = "#eef5f9"
        this.pPackingTabBtn = "#fff";
        this.compileTabBtn = "#eef5f9";
        this.itemTreeTabBtn = "#eef5f9"

        break;
      }
      case 'compileForm': {
        this.tabView = 'compileForm';
        this.fillingTabBtn = "#eef5f9"
        this.pPackingTabBtn = "#eef5f9";
        this.compileTabBtn = "#fff";
        this.itemTreeTabBtn = "#eef5f9"

        break;
      }
      case 'itemTree': {
        this.tabView = 'itemTree';
        this.fillingTabBtn = "#eef5f9"
        this.pPackingTabBtn = "#eef5f9";
        this.compileTabBtn = "#eef5f9";
        this.itemTreeTabBtn = "#fff"

        break;
      }
    }
  }








}
