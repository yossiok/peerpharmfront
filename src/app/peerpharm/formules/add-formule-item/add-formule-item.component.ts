import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-formule-item',
  templateUrl: './add-formule-item.component.html',
  styleUrls: ['./add-formule-item.component.css']
})
export class AddFormuleItemComponent implements OnInit {
  itemsForm: FormGroup;
  phValue: any;
  @Output() formuleItem = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.itemsForm = new FormGroup({
      number: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      supplierNumber: new FormControl('', [Validators.required]),
      supplierName: new FormControl('', [Validators.required]),
      supplierItemNumber: new FormControl('', [Validators.required]),
      procurementItemNumber: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      Percentage: new FormControl('', [Validators.required]),
      instructions: new FormControl('', [Validators.required]),
      temp: new FormControl('', [Validators.required]),
      itemPH: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    debugger
    const newItemAdded = this.itemsForm.value;
    this.formuleItem.emit(newItemAdded);
  }
}
