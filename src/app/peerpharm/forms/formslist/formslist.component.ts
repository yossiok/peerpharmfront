import { Component, OnInit } from "@angular/core";
import { FormsService } from "../../../services/forms.service";
import { ExcelService } from "src/app/services/excel.service";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: "app-formslist",
  templateUrl: "./formslist.component.html",
  styleUrls: ["./formslist.component.scss"],
})
export class FormslistComponent implements OnInit {

  myRefresh: any = null;
  forms: any[] = [];
  formsCopy: any[];
  sortByFillingDate: Boolean = false;
  showLoader: Boolean = true;
  year: string = new Date().getFullYear().toString();
  
  searchType:string="";
  searchInput:string="";
  statusSearch:string="";

  constructor(
    private formsService: FormsService,
    private excelService: ExcelService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastrService,
  ) {}

  ngOnInit() {
    this.getForms();
    // this.startInterval();
  }




  searchByStatus(){
    this.forms = []
    this.formsCopy = []
    this.showLoader = true;
    switch (this.statusSearch) {
      case "done":
        this.formsService.getFormDetailsByStatus(this.statusSearch).subscribe((forms)=>{
          this.forms = forms
          this.formsCopy = forms
          this.searchInput = "";
          this.statusSearch="";
          this.showLoader = false;


        })
        break;
      case "package":
        this.formsService.getFormDetailsByStatus(this.statusSearch).subscribe((forms)=>{
          this.forms = forms
          this.formsCopy = forms
          this.searchInput = "";
          this.statusSearch="";
          this.showLoader = false;
          
        })
        break;
      case "filling":
        this.formsService.getFormDetailsByStatus(this.statusSearch).subscribe((forms)=>{
          this.forms = forms
          this.formsCopy = forms
          this.searchInput = "";
          this.statusSearch="";
          this.showLoader = false;


        })
        break;
      case "fillingPackage":
        this.formsService.getFormDetailsByStatus(this.statusSearch).subscribe((forms)=>{
          this.forms = forms
          this.formsCopy = forms
          this.searchInput = "";
          this.statusSearch="";
          this.showLoader = false;

        })
        break;
    
      default:
        this.searchInput = "";
        this.statusSearch="";
        this.showLoader = false;

        break;
    }
    this.searchInput = "";
    this.statusSearch="";

    

  }

  search(){
    this.forms = []
    this.formsCopy = []
    this.showLoader = true;
    switch (this.searchType) {
      case "itemN":
        this.formsService.getFormDetailsByItem(this.searchInput).subscribe((forms)=>{
          this.forms = forms
          this.formsCopy = forms
          this.searchInput = "";
          this.showLoader = false;


        })
        
        break;
      case "orderNumber":

        this.formsService.getFormDetailsByOrder(this.searchInput).subscribe((forms)=>{
          this.forms = forms
          this.formsCopy = forms
          this.searchInput = "";
          this.showLoader = false;


        })
        
        break;
      case "batchN":
        this.formsService.getFormDetailsByBatchNumber(this.searchInput).subscribe((forms)=>{
          this.forms = forms
          this.formsCopy = forms
          this.searchInput = "";
          this.showLoader = false;


        })
        
        break;
    
      default:
        this.searchInput = "";
        this.showLoader = false;
        break;
    }
    this.searchInput = "";

  }



  checkPermission() {
    return this.authService.loggedInUser.screenPermission == "5";
  }
  getForms() {
    this.showLoader = true;

    if (this.year == "2021" || this.year == "2022" || this.year == "2020") {
      this.formsService.getAllForms(this.year).subscribe((forms) => {
        console.log(forms);
        if (forms) {
          forms.map((form) => {
            let dateStr = this.year + "/01/01";
            try {
              let dateSAsArrray = form.fillingDate.split("/");
              dateStr =
                dateSAsArrray[2] +
                "/" +
                dateSAsArrray[1] +
                "/" +
                dateSAsArrray[0];
            } catch (e) {
              console.log(e);
            }
            form.formatedDate = new Date(dateStr);
            return form;
          });
          forms.sort((a, b) => b.formatedDate - a.formatedDate);
          this.showLoader = false;
          this.forms = forms;
          this.formsCopy = forms;
        }
      });
    } else if (this.year == "2019" || this.year == "2018") {
      this.formsService.getFormsFromArchive(this.year).subscribe((forms) => {
        if (forms) {
          forms.map((form) => {
            let dateStr = this.year + "/01/01";
            try {
              let dateSAsArrray = form.fillingDate.split("/");
              dateStr =
                dateSAsArrray[2] +
                "/" +
                dateSAsArrray[1] +
                "/" +
                dateSAsArrray[0];
            } catch (e) {
              console.log(e);
            }
            form.formatedDate = new Date(dateStr);
            return form;
          });
          forms.sort((a, b) => b.formatedDate - a.formatedDate);
          this.showLoader = false;
          this.forms = forms;
          this.formsCopy = forms;
        }
      });
    }
  }
  sortFormsByFormNumber() {
    this.forms.reverse();
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.forms, "form");
  }


  sortFormsByFillingDate() {
    // NOT WOTKING WELL !! NEED TO DIVIDE YEAR/MONTH/DAY
    this.sortByFillingDate = this.sortByFillingDate ? false : true;
    let sortDir = this.sortByFillingDate;
    this.forms.sort(function (a, b) {
      let aFillingDate = new Date(a.fillingDate);
      let bFillingDate = new Date(b.fillingDate);
      if (sortDir) {
        return aFillingDate.getTime() - bFillingDate.getTime();
      } else {
        return bFillingDate.getTime() - aFillingDate.getTime();
      }
    });
  }

  // stopInterval() {
  //   clearInterval(this.myRefresh);
  // }

  // startInterval() {
  //   this.myRefresh = setInterval(() => {
  //     this.getForms();
  //   }, 1000 * 60 * 3);
  // }

  // exportAsXLSX() {
  //   let arrToExcel=this.forms.map(f=>f);

  //   this.forms.forEach(x=>{
  //     let newObj= Object.assign({},x);

  //     for(var i=0 ; i < x.checkTime.length ; i++){
  //       let checkTime_filedName= "checkTime"+i;
  //       let checkBox_clean_filedName= "checkBox_clean"+i;
  //       let checkBox_closedWaterProof_filedName= "checkBox_closedWaterProof"+i;
  //       let checkBox_correctFinalPacking_filedName= "checkBox_correctFinalPacking"+i;
  //       let checkBox_lotNumberPrinting_filedName= "checkBox_lotNumberPrinting"+i;
  //       let checkNetoWeight_filedName= "checkNetoWeight"+i;
  //       let checkBox_stickerPrinting_filedName= "checkBox_stickerPrinting"+i;
  //       newObj=Object.assign(newObj,{
  //         [checkTime_filedName]:x.checkTime[i],
  //         [checkBox_clean_filedName]:x.checkBox_clean[i],
  //         [checkBox_closedWaterProof_filedName]:x.checkBox_closedWaterProof[i],
  //         [checkBox_correctFinalPacking_filedName]:x.checkBox_correctFinalPacking[i],
  //         [checkBox_lotNumberPrinting_filedName]:x.checkBox_lotNumberPrinting[i],
  //         [checkNetoWeight_filedName]:x.checkNetoWeight[i],
  //         [checkBox_stickerPrinting_filedName]:x.checkBox_stickerPrinting[i],
  //       });
  
  //     }
  //     arrToExcel.push(newObj);
  //   });
  //   this.excelService.exportAsExcelFile(arrToExcel, 'forms');
  // var data=[];
  // this.excelService.exportAsExcelFile(data, 'fault_forms');
  // }

  // openFormDetails(formId) {
  //   let url = this.router.serializeUrl(
  //     this.router.createUrlTree([`/peerpharm/forms/formDetails/${formId}/0`])
  //   );
  //   window.open(url, '_blank');
  // }

  FilterForms(enteredText, field) {
    const enteredValue = enteredText.target.value;
    if (enteredValue !== "") {
      switch (field) {
        case "costumer": {
          this.forms = this.formsCopy.filter((x) =>
            x.costumerName.includes(enteredValue)
          );
          break;
        }
        case "batch": {
          this.forms = this.formsCopy.filter((x) =>
            x.batchN.includes(enteredValue)
          );
          break;
        }
        case "item": {
          this.forms = this.formsCopy.filter((x) => x.itemN.includes(enteredValue));
          break;
        }
        case "fill": {
          this.forms = this.formsCopy.filter((x) =>
            x.fillingDate.includes(enteredValue)
          );
          break;
        }
        case "order": {
          this.forms = this.formsCopy.filter((x) =>
            x.orderNumber.includes(enteredValue)
          );
          break;
        }
        case "productionLine": {
          this.forms = this.formsCopy.filter(
            (x) => x.productionLine == enteredValue
          );
          break;
        }
        case "status": {
          if (enteredValue == "all") this.forms = this.formsCopy;
          else
            this.forms = this.formsCopy.filter((x) => x.status == enteredValue);
          break;
        }
      }
    } else {
      this.forms = this.formsCopy;
    }
  }
}
