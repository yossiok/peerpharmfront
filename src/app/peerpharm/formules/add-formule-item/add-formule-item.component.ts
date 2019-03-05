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
      quantity: new FormControl('', [Validators.required]),
      Percentage: new FormControl('', [Validators.required]),
      instractions: new FormControl('', [Validators.required]),
      temp: new FormControl('', [Validators.required]),
      ph: new FormControl('', [Validators.required]),
      // lastUpdate: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]) 
    });
  }

  onSubmit() {
    const newItemAdded = this.itemsForm.value;
    this.formuleItem.emit(newItemAdded);
  }
}
