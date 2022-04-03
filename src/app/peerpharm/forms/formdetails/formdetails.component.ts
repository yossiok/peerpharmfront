import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsService } from "../../../services/forms.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { UserInfo } from "../../taskboard/models/UserInfo";
import { TranslateService } from "@ngx-translate/core";
import { ExcelService } from "src/app/services/excel.service";
import { ToastrService } from "ngx-toastr";
import { ScheduleService } from "src/app/services/schedule.service";
import { Costumer } from "../../classes/costumer.class";
import { Observable } from "rxjs";
import { BatchesService } from "src/app/services/batches.service";
import { ItemsService } from "src/app/services/items.service";
import { CreamBarrelService } from "src/app/services/cream-barrel.service";
import { data } from "jquery";

@Component({
  selector: "app-formdetails",
  templateUrl: "./formdetails.component.html",
  styleUrls: ["./formdetails.component.scss"],
})
export class FormdetailsComponent implements OnInit {
  form: any = {};
  disabledValue = true;
  formQAPalletsData: any[] = [];
  formQAPersonalPalletsData: any[] = [];
  user: any;
  currentScheduleId: any;
  averageNetoWeight = 0;
  loggedInUser: UserInfo;
  newForm: boolean = false;
  numberOfFormsWithSameBatch: number = 0;
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
  showQAPersonalPalletsModal: boolean = false;
  allowUpdateForm: boolean = false;
  disableRemarkEditAfterSave: boolean = true;
  today = new Date().getDate();
  // edit bool value
  enableEdit = false;
  // edit bool index
  enableEditIndex = null;
  // update fields for qaPallet update
  floorNumberUpdate = null;
  kartonQuantityUpdate = null;
  unitsInKartonUpdate = null;
  lastFloorQuantityUpdate = null;
  unitsQuantityPartKartonUpdate = null;
  kindOfPalletUpdate = null;
  qaStatusUpdate = null;
  isTube = false;
  barrelsList: any[] = [];

  usedBarrels: any[] = [];
  currentBatchNumber: string = "";
  currentBarrelNumber: string = "";

  barrelToFill = {};
  barrelDisabled: boolean = false;
  batchDisabled: boolean = false;

  newQAPallet = {
    floorNumber: null,
    kartonQuantity: null,
    unitsInKarton: null,
    lastFloorQuantity: null,
    unitsQuantityPartKarton: null,
    qaStatus: "",
    batchNumber: "",
    customerName: "",
    formDetailsId: "",
    orderNumber: "",
    itemNumber: "",
    isPersonalPackage: false,
    kindOfPallet: "",
  };

  newQAPersonalPallet = {
    floorNumber: null,
    kartonQuantity: null,
    unitsInKarton: null,
    lastFloorQuantity: null,
    unitsQuantityPartKarton: null,
    qaStatus: "",
    batchNumber: "",
    customerName: "",
    formDetailsId: "",
    orderNumber: "",
    itemNumber: "",
    isPersonalPackage: true,
    kindOfPallet: "",
  };

  newTest = {
    checkTime: "",
    checkBox_clean: false,
    checkNetoWeight: "",
    checkBox_closedWaterProof: false,
    checkBox_stickerPrinting: false,
    checkBox_lotNumberPrinting: false,
    checkBox_correctFinalPacking: false,
  };

  constructor(
    private excelService: ExcelService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public translate: TranslateService,
    private toastService: ToastrService,
    private scheduleService: ScheduleService,
    private batchService: BatchesService,
    private itemService: ItemsService,
    private router: Router,
    private creamBarrelService: CreamBarrelService
  ) {}

  ngOnInit() {
    let formID1 = this.route.snapshot.paramMap.get("id");
    let scheduleID = this.route.snapshot.paramMap.get("id2");

    this.getUserInfo();

    // הגענו מלו"ז עבודה
    if (scheduleID && scheduleID != "0") {
      this.checkIfFormExist(scheduleID)
        .then((formID2) => {
          this.getFormData(true, formID2);
        })
        .catch((scheduleID) => {
          this.getScheduleDetails(scheduleID);
        });
    }

    // הגענו מהטאבלט (עמוד ראשי) או ממסך טפסים
    else this.getFormData(true, formID1);
  }

  getIsTubeState(itemNumber) {
    this.itemService.getItemData(itemNumber).subscribe((data) => {
      this.isTube = data[0].isTube;
    });
  }

  getBarrelsList() {
    let batchNumber = this.currentBatchNumber;
    if (batchNumber.length < 5) {
      alert("מספר אצווה קצר מידי");
    }
    this.creamBarrelService
      .getBarrelsByBatchNumber(batchNumber)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          console.log(data.msg);
          this.toastService.error(data.msg);
          this.return;
        } else if (data.length > 0) {
          console.log(this.form.barrelsList);
          // check if the barrels alrady exist in the form and push only those that are not
          if (this.form.barrelsList && this.form.barrelsList.length > 0) {
            for (let barrel of data) {
              let isInList = this.form.barrelsList.find(
                (b) => b.barrelNumber == barrel.barrelNumber
              );
              if (!isInList) this.barrelsList.push(barrel);
            }
          } else {
            // no arrels are in the form, no need to check the form
            this.barrelsList = data;
          }
        } else {
          this.toastService.error("barrels were not found");
        }
      });
  }

  updateBarrelsList() {
    // let barrelNumber = e[e.selectedIndex].innerHTML.trim();

    // console.log(barrelNumber);
    this.batchDisabled = true;
    console.log(this.currentBarrelNumber);
    console.log(this.barrelsList);
    let barrelToFill = this.barrelsList.find(
      (b) => b.barrelNumber == this.currentBarrelNumber
    );
    console.log(barrelToFill);
    barrelToFill.leftWeight = 0;
    this.form.barrelsList = this.form.barrelsList ? this.form.barrelsList : [];
    this.form.barrelsList.push(barrelToFill);
    this.usedBarrels.push(barrelToFill);
    this.barrelsList = this.barrelsList.filter(
      (b) => b.barrelNumber != this.currentBarrelNumber
    );
    console.log(this.usedBarrels);
    console.log(this.barrelsList);
    this.barrelDisabled = false;
  }

  updateUsedBarrels(barrel, i) {
    console.log(barrel);
    if (!barrel.startTime || !barrel.endTime) {
      alert("יש למלא את כל הפרטים בשורה לפני עדכון");
      return;
    } else if (
      barrel.leftWeight < 0 ||
      barrel.leftWeight > barrel.barrelWeight
    ) {
      alert("המשקל הנותר בחבית מעל משקל החבית או מתחת לאפס");
      return;
    }
    barrel.userName = this.user.firstName + " " + this.user.lastName;
    console.log(barrel);

    console.log(this.form);
    // this.form.barrelsList = this.form.barrelsList ? this.form.barrelsList : [];
    // this.form.barrelsList.push(barrel);
    barrel.saved = true;
    this.form.barrelsList[i] = barrel;
    this.barrelDisabled = true;
    this.batchDisabled = false;
    console.log(this.barrelDisabled);
    console.log(this.batchDisabled);
    this.currentBarrelNumber = "";
  }

  deleteUsedBarrel(barrel) {
    console.log(barrel);
    this.usedBarrels = this.usedBarrels.filter(
      (b) => b.barrelNumber != barrel.barrelNumber
    );
    this.form.barrelsList = this.form.barrelsList.filter(
      (b) => b.barrelNumber != barrel.barrelNumber
    );
    barrel.userName = "";
    barrel.startTime = null;
    barrel.endTime = null;
    barrel.leftWeight = 0;
    barrel.saved = false;
    this.barrelsList.push(barrel);
  }

  async checkIfFormExist(scheduleId) {
    return new Promise((resolve, reject) => {
      this.formsService.getFormIdByScheduleId(scheduleId).subscribe((data) => {
        if (data.formId != "noform") {
          resolve(data.formId);
          // this.formid = data.formId
          // this.getFormData(true)
        } else {
          reject(scheduleId);
        }
      });
    });
  }

  async getFormData(allChecks, formID) {
    this.formid = formID;
    await this.formsService.getFormData(this.formid).subscribe((res) => {
      this.form = res[0];
      //Get the list of barrels to be used with this batch
      // this.getBarrelsList(this.form.batchN);
      this.loadQAPallets(this.form._id);
      this.loadQAPersonalPallets(this.form._id);
      this.formDetailsItemNum = this.form.itemN;
      this.getIsTubeState(this.form.itemN);
      this.batchService.getBatchData(this.form.batchN).subscribe((data) => {
        console.log("batchData: ", data);
        this.form.productaionDate = data[0].produced;
        this.form.expirationDate = data[0].expration;
      });
      if (this.form.productionEndDate) {
        let days = this.form.productionEndDate.slice(8, 10);
        let monthes = this.form.productionEndDate.slice(5, 7);
        this.form.productionEndDate = this.form.productionEndDate.slice(0, 5);
        this.form.productionEndDate =
          this.form.productionEndDate + days + "-" + monthes;
      }
      this.form.checkNetoWeight.forEach((element) => {
        if (element) {
          const netNumber = parseInt(element, 10);
          this.netoWeightArr.push(netNumber);
        }
      });
      this.CalcAvgWeight();
      this.checkFormStatus();

      if (allChecks) this.wrapAllChecks();
    });
  }

  consoleLogLeftOvers() {
    console.log(this.form.leftOvers);
  }

  async getScheduleDetails(scheduleId) {
    // new FORM! comes from schedule

    // get schedule data
    this.scheduleService.getScheduleById(scheduleId).subscribe((data) => {
      if (data) {
        // get neto weight
        this.itemService.getItemData(data.item).subscribe((itemData) => {
          console.log(itemData);
          this.isTube = itemData.isTube;
          let netWeight = itemData[0].netWeightK;

          // check batch QA status
          let batches = data.batch.split("+");

          // multiple batches:
          if (batches.length > 1) {
            let notApprovedBatches = [];
            this.batchService
              .getSpecvalueMulti(batches)
              .subscribe((response) => {
                for (let batch of response.batches) {
                  if (batch.specStatus.status != 1)
                    notApprovedBatches.push(batch);
                }
                if (notApprovedBatches.length > 0) {
                  for (let batch of notApprovedBatches)
                    this.toastService.error(
                      ``,
                      `באטצ' ${batch.batchNumber} לא מאושר ע"י QA`
                    );
                  this.toastService.error("", "לא ניתן לפתוח טופס ייצור");
                } else {
                  let tempObj = {
                    batchN: batches.join("+"),
                    itemN: data.item,
                    costumerName: data.costumer,
                    productName: data.productName,
                    orderNumber: data.orderN,
                    orderQuantity: data.qty,
                    netWeight,
                  };
                  this.formDetailsItemNum = data.item;
                  this.form = tempObj;
                  this.form.scheduleId = scheduleId;
                  this.newForm = true;
                }
              });
          }

          // only one batch:
          else {
            let tempObj = {
              batchN: data.batch,
              itemN: data.item,
              costumerName: data.costumer,
              productName: data.productName,
              orderNumber: data.orderN,
              orderQuantity: data.qty,
              netWeight,
            };
            this.formDetailsItemNum = data.item;
            this.form = tempObj;
            this.form.scheduleId = scheduleId;
            this.newForm = true;
            this.batchService
              .getBatchData(this.form.batchN)
              .subscribe((data) => {
                console.log("batchData: ", data);
                this.form.productaionDate = data[0].produced;
                this.form.expirationDate = data[0].expration;
              });
          }

          // check if there is another form with that batch
          this.numberOfFormsWithSameBatch = 0;
          for (let batch of batches) {
            this.formsService
              .getFormDetailsByBatch(batch)
              .subscribe((forms) => {
                if (forms.length > 0) {
                  for (let form of forms) {
                    if (form.batchN && form.batchN != "") {
                      this.numberOfFormsWithSameBatch++;
                    }
                  }
                }
              });
          }
        });
      }
    });

    // have fun.
  }

  enlarge(event) {
    event.currentTarget.style.width = "300px";
  }

  return(event) {
    event.currentTarget.style.width = "";
  }

  async addNewTest(test) {
    let newTest = { ...test };
    this.form.checkTime
      ? this.form.checkTime.push(newTest.checkTime)
      : (this.form.checkTime = [newTest.checkTime]);
    this.form.checkBox_clean
      ? this.form.checkBox_clean.push(newTest.checkBox_clean)
      : (this.form.checkBox_clean = [newTest.checkBox_clean]);
    this.form.checkNetoWeight
      ? this.form.checkNetoWeight.push(newTest.checkNetoWeight)
      : (this.form.checkNetoWeight = [newTest.checkNetoWeight]);
    this.form.checkBox_closedWaterProof
      ? this.form.checkBox_closedWaterProof.push(
          newTest.checkBox_closedWaterProof
        )
      : (this.form.checkBox_closedWaterProof = [
          newTest.checkBox_closedWaterProof,
        ]);
    this.form.checkBox_stickerPrinting
      ? this.form.checkBox_stickerPrinting.push(
          newTest.checkBox_stickerPrinting
        )
      : (this.form.checkBox_stickerPrinting = [
          newTest.checkBox_stickerPrinting,
        ]);
    this.form.checkBox_lotNumberPrinting
      ? this.form.checkBox_lotNumberPrinting.push(
          newTest.checkBox_lotNumberPrinting
        )
      : (this.form.checkBox_lotNumberPrinting = [
          newTest.checkBox_lotNumberPrinting,
        ]);
    this.form.checkBox_correctFinalPacking
      ? this.form.checkBox_correctFinalPacking.push(
          newTest.checkBox_correctFinalPacking
        )
      : (this.form.checkBox_correctFinalPacking = [
          newTest.checkBox_correctFinalPacking,
        ]);
    this.allChecks.push(newTest);
  }

  deleteQAPallet(QAPallet) {
    this.formsService.deleteQAPallet(QAPallet).subscribe((data) => {
      if (data) {
        this.toastService.success("משטח נמחק בהצלחה");
      } else {
        this.toastService.success("אירעה שגיאה , אנא פנה למנהל מערכת");
      }
      this.loadQAPallets(this.form._id);
      this.loadQAPersonalPallets(this.form._id);
    });
  }

  addNewQAPallet() {
    // Validation
    let errors = [];
    if (
      this.newQAPallet.floorNumber == null ||
      this.newQAPallet.floorNumber == ""
    ) {
      errors.push({ msg: "חייב לציין את מספר הקומות" });
    }
    if (
      this.newQAPallet.kartonQuantity == null ||
      this.newQAPallet.kartonQuantity == ""
    ) {
      errors.push({ msg: "חייב לציין את כמות הקרטונים בכל קומה" });
    }
    if (
      this.newQAPallet.unitsInKarton == null ||
      this.newQAPallet.unitsInKarton == ""
    ) {
      errors.push({ msg: "חייב לציין את כמות היחידות בכל קרטון" });
    }
    // if(this.newQAPallet.lastFloorQuantity == null || this.newQAPallet.lastFloorQuantity == ""){
    //   errors.push({msg:"חייב לציין את כמות הקרטונים בקומה האחרונה"});

    // }
    // if(this.newQAPallet.unitsQuantityPartKarton == ""){
    //   errors.push({msg:"חייב לציין את כמות היחידות בקרטון החלקי"});

    // }
    if (
      this.newQAPallet.kindOfPallet == null ||
      this.newQAPallet.kindOfPallet == ""
    ) {
      errors.push({ msg: "חייב לציין את סוג המשטח" });
    }
    if (this.newQAPallet.qaStatus == null || this.newQAPallet.qaStatus == "") {
      errors.push({ msg: "חייב לציין את הסטטוס" });
    }
    if (errors.length > 0) {
      errors.map((err) => this.toastService.warning(err.msg));
      return;
    }
    // Init object
    this.newQAPallet.batchNumber = this.form.batchN;
    this.newQAPallet.itemNumber = this.form.itemN;
    this.newQAPallet.orderNumber = this.form.orderNumber;
    this.newQAPallet.formDetailsId = this.form._id;
    this.newQAPallet.customerName = this.form.costumerName;

    // if (this.newQAPallet.qaStatus == "עובר לאריזה אישית")
    //   this.newQAPallet.isPersonalPackage = true;

    // Add new pallet to database
    this.formsService
      .createNewQaPallet(this.newQAPallet)
      .subscribe((result) => {
        if (result) {
          this.formQAPalletsData.push(result);
          this.calculateSumAmount(this.formQAPalletsData, false);
          this.toastService.success("משטח חדש נוסף בהצלחה");
          this.newQAPallet.floorNumber = null;
          this.newQAPallet.kartonQuantity = null;
          this.newQAPallet.lastFloorQuantity = null;
          this.newQAPallet.unitsInKarton = null;
          this.newQAPallet.unitsQuantityPartKarton = null;
        } else {
          this.toastService.success("אירעה שגיאה , אנא פנה למנהל מערכת");
        }
      });
  }

  addNewQAPersonalPallet() {
    // Validation
    let errors = [];
    if (
      this.newQAPersonalPallet.floorNumber == null ||
      this.newQAPersonalPallet.floorNumber == ""
    ) {
      errors.push({ msg: "חייב לציין את מספר הקומות" });
    }
    if (
      this.newQAPersonalPallet.kartonQuantity == null ||
      this.newQAPersonalPallet.kartonQuantity == ""
    ) {
      errors.push({ msg: "חייב לציין את כמות הקרטונים בכל קומה" });
    }
    if (
      this.newQAPersonalPallet.unitsInKarton == null ||
      this.newQAPersonalPallet.unitsInKarton == ""
    ) {
      errors.push({ msg: "חייב לציין את כמות היחידות בכל קרטון" });
    }
    // if(this.newQAPallet.lastFloorQuantity == null || this.newQAPallet.lastFloorQuantity == ""){
    //   errors.push({msg:"חייב לציין את כמות הקרטונים בקומה האחרונה"});

    // }
    // if(this.newQAPallet.unitsQuantityPartKarton == ""){
    //   errors.push({msg:"חייב לציין את כמות היחידות בקרטון החלקי"});

    // }
    if (
      this.newQAPersonalPallet.kindOfPallet == null ||
      this.newQAPersonalPallet.kindOfPallet == ""
    ) {
      errors.push({ msg: "חייב לציין את סוג המשטח" });
    }
    if (
      this.newQAPersonalPallet.qaStatus == null ||
      this.newQAPersonalPallet.qaStatus == ""
    ) {
      errors.push({ msg: "חייב לציין את הסטטוס" });
    }
    if (errors.length > 0) {
      errors.map((err) => this.toastService.warning(err.msg));
      return;
    }
    this.newQAPersonalPallet.batchNumber = this.form.batchN;
    this.newQAPersonalPallet.itemNumber = this.form.itemN;
    this.newQAPersonalPallet.orderNumber = this.form.orderNumber;
    this.newQAPersonalPallet.formDetailsId = this.form._id;
    this.newQAPersonalPallet.customerName = this.form.costumerName;

    this.formsService
      .createNewQaPallet(this.newQAPersonalPallet)
      .subscribe((result) => {
        if (result) {
          this.formQAPersonalPalletsData.push(result);
          this.calculateSumAmount(this.formQAPalletsData, true);
          this.toastService.success("משטח אריזות אישיות חדש נוסף בהצלחה");
          this.newQAPersonalPallet.floorNumber = null;
          this.newQAPersonalPallet.kartonQuantity = null;
          this.newQAPersonalPallet.lastFloorQuantity = null;
          this.newQAPersonalPallet.unitsInKarton = null;
          this.newQAPersonalPallet.unitsQuantityPartKarton = null;
        } else {
          this.toastService.success("אירעה שגיאה , אנא פנה למנהל מערכת");
        }
      });
  }

  updateFormDetails() {
    // let reason = prompt("אנא הכנס/י את סיבה העדכון", "");
    // reason = reason.trim();
    // if (reason != null && reason != "") {
    //   document.getElementById("reason").innerHTML = reason;
    try {
      this.form.weightQtyleft = this.form.leftBatchWeight;
      this.formsService.updateFormDetails(this.form).subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastService.error(data.msg);
          return;
        } else if (data.errors.length > 0) {
          for (let error of data.errors) {
            this.toastService.error(error.msg);
          }
        } else if (data) {
          this.getFormData(this.formid, false);
          this.getFormData(this.formid, false);
          this.toastService.success("טופס עודכן בהצלחה !");
          this.showQAPalletsModal = false;
          if (this.form.checkSignature && this.form.directorBackSignature) {
            this.disabledValue = true;
          }
          console.log("Returned data: ", data);
        }
      });
    } catch (error) {
      this.toastService.error("אירעה שגיאה בעדכון , אנא נסה שנית");
      this.toastService.error(error.message);
    }
    // } else {
    //   this.toastService.error("חובה לציין את סיבת העדכון");
    // }
  }

  async updateTest(indexOfTest, test) {
    this.form.checkBox_clean.splice(indexOfTest, 1);
    this.form.checkBox_closedWaterProof.splice(indexOfTest, 1);
    this.form.checkBox_correctFinalPacking.splice(indexOfTest, 1);
    this.form.checkBox_lotNumberPrinting.splice(indexOfTest, 1);
    this.form.checkBox_stickerPrinting.splice(indexOfTest, 1);
    this.form.checkNetoWeight.splice(indexOfTest, 1);
    this.form.checkTime.splice(indexOfTest, 1);
    this.allChecks.splice(indexOfTest, 1);
    this.addNewTest(test);
  }

  goBack() {
    // window.history.back();
    this.router.navigate([`/peerpharm/schedule/fillschedule`]);
  }

  createFormDetails() {
    // Get date from server

    this.form.quantity_Produced = 0;
    this.form.weightQtyleft = 0;
    this.form.leftBatchWeight = 0;
    this.formsService.createFormDetails(this.form).subscribe((data) => {
      if (data) {
        console.log(data);
        //this.getBarrelsList(data.batchN);
        this.toastService.success("טופס נוצר בהצלחה")!;
        this.newForm = false;
        this.formid = data._id;
        this.form.fillingDate = data.fillingDate;
      }
    });
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
    this.formsService.getQAPalletsByFormId(formId).subscribe((QAPallets) => {
      if (QAPallets) {
        this.formQAPalletsData = this.calculateSumAmount(QAPallets, false);
      } else this.formQAPalletsData = [];
    });
  }

  async loadQAPersonalPallets(formId) {
    this.formsService
      .getQAPersonalPalletsByFormId(formId)
      .subscribe((QAPallets) => {
        if (QAPallets) {
          this.formQAPersonalPalletsData = this.calculateSumAmount(
            QAPallets,
            true
          );
        } else this.formQAPersonalPalletsData = [];
      });
  }

  calculateSumAmount(QAPallets, isPersonalPackage: boolean) {
    for (let QAPallet of QAPallets) {
      let count = 0;

      if (QAPallet.palletStatus == "done")
        QAPallet.palletStatus = "הועלה על משטח";
      if (QAPallet.palletStatus == "open")
        QAPallet.palletStatus = "ממתין למשטח";

      count =
        QAPallet.floorNumber * QAPallet.kartonQuantity * QAPallet.unitsInKarton;

      if (QAPallet.lastFloorQuantity > 0)
        count += QAPallet.lastFloorQuantity * QAPallet.unitsInKarton;

      if (QAPallet.unitsQuantityPartKarton > 0)
        count += QAPallet.unitsQuantityPartKarton;

      QAPallet.sumAmount = count;
    }

    if (isPersonalPackage) {
      this.form.totalUnits = 0;
      for (let pallet of QAPallets) this.form.totalUnits += pallet.sumAmount;
    } else {
      this.form.quantity_Produced = 0;
      for (let pallet of QAPallets)
        this.form.quantity_Produced += pallet.sumAmount;
    }

    return QAPallets;
  }

  checkFormStatus() {
    if (this.form.checkSignature && this.form.directorBackSignature) {
      this.disabledValue = true;
    }
  }
  // make edit available function
  enableEditMethod(e, i) {
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
  }
  // Eran
  savePalltesChances(QAPallet) {
    let floorNumber = this.floorNumberUpdate || QAPallet.floorNumber;
    let kartonQuantity = this.kartonQuantityUpdate || QAPallet.kartonQuantity;
    let unitsInKarton = this.unitsInKartonUpdate || QAPallet.unitsInKarton;
    let lastFloorQuantity =
      this.lastFloorQuantityUpdate || QAPallet.lastFloorQuantity;
    let unitsQuantityPartKarton =
      this.unitsQuantityPartKartonUpdate || QAPallet.unitsQuantityPartKarton;
    let kindOfPallet = this.kindOfPalletUpdate || QAPallet.kindOfPallet;
    let qaStatus = this.qaStatusUpdate || QAPallet.qaStatus;
    let obj = {};
    Object.keys(QAPallet).map((key, index) => {
      obj = {
        ...QAPallet,
        floorNumber,
        kartonQuantity,
        unitsInKarton,
        lastFloorQuantity,
        unitsQuantityPartKarton,
        kindOfPallet,
        qaStatus,
      };
      return "";
    });
    this.formsService.editQAPallet(obj).subscribe((res) => {
      console.log(res);
      this.floorNumberUpdate = null;
      this.kartonQuantityUpdate = null;
      this.unitsInKartonUpdate = null;
      this.lastFloorQuantityUpdate = null;
      this.unitsQuantityPartKartonUpdate = null;
      this.kindOfPalletUpdate = null;
      this.qaStatusUpdate = null;
    });
  }
  getUserInfo() {
    // Need to check user Au
    if (this.authService.loggedInUser) {
      this.user = this.authService.loggedInUser;
      if (this.user.authorization) {
        if (
          this.authService.loggedInUser.authorization.includes(
            "updateFormDetails"
          )
        ) {
          this.allowUpdateForm = true;
          this.disabledValue = false;
        }
        if (this.authService.loggedInUser.authorization.includes("QAAdmin")) {
          this.disableRemarkEditAfterSave = false;
        }
      }
    }
    // else {
    //   this.authService.userEventEmitter.subscribe((user) => {
    //     this.user = user;
    //     if (this.user.authorization) {
    //       if (
    //         this.authService.loggedInUser.authorization.includes(
    //           "updateFormDetails"
    //         )
    //       ) {
    //         this.allowUpdateForm = true;
    //         this.disabledValue = false;
    //       }
    // if(this.authService.loggedInUser.authorization.includes("QAAdmin")) {
    //   this.allowEditAfterSave = true
    // }
    //     }
    //   });
    // }
  }

  wrapAllChecks() {
    for (let index = 0; index < this.form.checkTime.length; index++) {
      this.allChecks.push({
        checkTime: this.form.checkTime[index],
        checkBox_clean: this.form.checkBox_clean[index],
        checkNetoWeight: this.form.checkNetoWeight[index],
        checkBox_closedWaterProof: this.form.checkBox_closedWaterProof[index],
        checkBox_stickerPrinting: this.form.checkBox_stickerPrinting[index],
        checkBox_lotNumberPrinting: this.form.checkBox_lotNumberPrinting[index],
        checkBox_correctFinalPacking:
          this.form.checkBox_correctFinalPacking[index],
      });
    }
  }

  tabChange(view) {
    switch (view) {
      case "fillingForm": {
        this.tabView = "fillingForm";
        this.fillingTabBtn = "#fff";
        this.pPackingTabBtn = "#eef5f9";
        this.compileTabBtn = "#eef5f9";
        this.itemTreeTabBtn = "#eef5f9";
        break;
      }
      case "personalPackingForm": {
        this.tabView = "packingForm";
        this.fillingTabBtn = "#eef5f9";
        this.pPackingTabBtn = "#fff";
        this.compileTabBtn = "#eef5f9";
        this.itemTreeTabBtn = "#eef5f9";

        break;
      }
      case "compileForm": {
        this.tabView = "compileForm";
        this.fillingTabBtn = "#eef5f9";
        this.pPackingTabBtn = "#eef5f9";
        this.compileTabBtn = "#fff";
        this.itemTreeTabBtn = "#eef5f9";

        break;
      }
      case "itemTree": {
        this.tabView = "itemTree";
        this.fillingTabBtn = "#eef5f9";
        this.pPackingTabBtn = "#eef5f9";
        this.compileTabBtn = "#eef5f9";
        this.itemTreeTabBtn = "#fff";

        break;
      }
    }
  }
}
