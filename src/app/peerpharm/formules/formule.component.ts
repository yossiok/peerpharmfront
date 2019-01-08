import {
  Component,
  ViewChildren,
  AfterViewInit,
  QueryList
} from '@angular/core';
import { FormuleItem } from './models/formule-item';
import { FormulesService } from '../../services/formules.service';

@Component({
  selector: 'app-formule',
  templateUrl: './formule.component.html',
  styleUrls: ['./formule.component.css']
})
export class FormuleComponent implements AfterViewInit {

  constructor(private formuleService: FormulesService) {}
  newFormuleBasic = null;
  allItemsForm: FormuleItem[] = [];

  @ViewChildren('childItem')
  childItems: QueryList<any>;

  onFormuleAdded(newFormuleCreated) {
    this.newFormuleBasic = newFormuleCreated;
    const newItem = new FormuleItem();
    this.allItemsForm.push(newItem);
  }

  onItemAdded(lastItemAdded) {
    const newItem = new FormuleItem();
    this.allItemsForm.push(newItem);
  }

  onFinish() {
    this.childItems.forEach((childItem, index) => {
      this.allItemsForm[index].number = childItem.itemsForm.value.number;
      this.allItemsForm[index].quantity = childItem.itemsForm.value.quantity;
      this.allItemsForm[index].percentage = childItem.itemsForm.value.Percentage;
      this.allItemsForm[index].phaseInstructions = childItem.itemsForm.value.instractions;
    });
    this.formuleService
      .addFormule(
        this.newFormuleBasic.number,
        this.newFormuleBasic.name,
        this.newFormuleBasic.category.value,
        this.newFormuleBasic.lastUpdate,
        this.newFormuleBasic.ph,
        this.newFormuleBasic.client,
        this.allItemsForm
      )
     .subscribe(data => console.log('added ' + data));
  }

  ngAfterViewInit() {
    this.childItems.forEach(childItem => console.log(childItem));
  }
}