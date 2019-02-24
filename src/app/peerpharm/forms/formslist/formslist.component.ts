import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';

@Component({
  selector: 'app-formslist',
  templateUrl: './formslist.component.html',
  styleUrls: ['./formslist.component.css']
})
export class FormslistComponent implements OnInit {
  forms: any[];
  constructor(private formsService: FormsService) {}

  ngOnInit() {
    this.getForms();
  }

  getForms() {
    this.formsService.getAllForms().subscribe(res => {
      this.forms = res;
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


  FilterForms(enteredText, field) {
    const enteredValue = enteredText.target.value;
    if (enteredValue !== '') {
      switch (field) {
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
