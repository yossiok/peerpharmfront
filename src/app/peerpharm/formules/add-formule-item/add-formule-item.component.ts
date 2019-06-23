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
  @Output() itemAdded = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.itemsForm = new FormGroup({
      number: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      quantityUnits: new FormControl('', [Validators.required]),
      percentage: new FormControl('', [Validators.required]),
      instructions: new FormControl('', [Validators.required]),
      temp: new FormControl('', [Validators.required]),
      itemPH: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    debugger
    if(this.itemsForm.valid){
      const newItemAdded = this.itemsForm.value;
      this.itemAdded.emit(newItemAdded);  
    }else{
      // toaster
    }
  }
  deletePhaseItem(){
    
  }
}
