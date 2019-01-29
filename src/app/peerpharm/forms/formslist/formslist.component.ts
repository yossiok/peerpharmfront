import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-formslist',
  templateUrl: './formslist.component.html',
  styleUrls: ['./formslist.component.css']
})
export class FormslistComponent implements OnInit {
  forms: any[];
  formsCopy: any[];
  constructor(private formsService: FormsService,  private excelService:ExcelService) {}

  ngOnInit() {
    this.getForms();
  }

  getForms() {
    this.formsService.getAllForms().subscribe(res => {
      this.forms = res;
      this.formsCopy = res;
    });
  }

  SortBy() {
    this.forms.sort(function(a, b) {
      if (Date.parse(b.fillingDate) - Date.parse(a.fillingDate)) {
        return -1;
      } else if (Date.parse(a.fillingDate) - Date.parse(b.fillingDate)) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  exportAsXLSX() {
    let arrToExcel=this.forms.map(f=>f);

    this.forms.forEach(x=>{
      let newObj= Object.assign({},x);

      for(var i=0 ; i < x.checkTime.length ; i++){
        let checkTime_filedName= "checkTime"+i;
        let checkBox_clean_filedName= "checkBox_clean"+i;
        let checkBox_closedWaterProof_filedName= "checkBox_closedWaterProof"+i;
        let checkBox_correctFinalPacking_filedName= "checkBox_correctFinalPacking"+i;
        let checkBox_lotNumberPrinting_filedName= "checkBox_lotNumberPrinting"+i;
        let checkNetoWeight_filedName= "checkNetoWeight"+i;
        let checkBox_stickerPrinting_filedName= "checkBox_stickerPrinting"+i;
        newObj=Object.assign(newObj,{
          [checkTime_filedName]:x.checkTime[i],
          [checkBox_clean_filedName]:x.checkBox_clean[i],
          [checkBox_closedWaterProof_filedName]:x.checkBox_closedWaterProof[i],
          [checkBox_correctFinalPacking_filedName]:x.checkBox_correctFinalPacking[i],
          [checkBox_lotNumberPrinting_filedName]:x.checkBox_lotNumberPrinting[i],
          [checkNetoWeight_filedName]:x.checkNetoWeight[i],
          [checkBox_stickerPrinting_filedName]:x.checkBox_stickerPrinting[i],
        });
        debugger
      }
      arrToExcel.push(newObj);
    });
    this.excelService.exportAsExcelFile(arrToExcel, 'forms');
 }


  FilterForms(enteredText, field) {
    const enteredValue = enteredText.target.value;
    if (enteredValue !== '') {
      switch (field) {
        case 'costumer': {
          this.forms = this.forms.filter(x => x.costumerName.includes(enteredValue));
          break;
        }
        case 'batch': {
          this.forms = this.forms.filter(x => x.batchN.includes(enteredValue));
          break;
        }
        case 'item': {
          this.forms = this.forms.filter(x => x.itemN.includes(enteredValue));
          break;
        }
        case 'fill': {
          this.forms = this.forms.filter(x =>
            x.fillingDate.includes(enteredValue)
          );
          break;
        }
      }
    }
  }
}
