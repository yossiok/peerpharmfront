import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';

export interface FormuleCategory {
  value: string;
}

@Component({
  selector: 'app-add-formule',
  templateUrl: './add-formule.component.html',
  styleUrls: ['./add-formule.component.css']
})
export class AddFormuleComponent implements OnInit {

 public formulesForm: FormGroup;
  phValue: string;
  @Output() formuleCreated = new EventEmitter();


  constructor(private formuleService: FormulesService) { }

  allFormuleCategory: FormuleCategory[] = [
    { value: 'Oil Based Lotion'},
    { value: 'Water Baised Lotion' },
    { value: 'Hyperallergic'}
  ];

  ngOnInit() {

    this.formulesForm = new FormGroup({
      number: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      lastUpdate: new FormControl('', [Validators.required]),
      ph: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required])
    });
  }


  onSubmit(): void {
   const newFormuleAdded = this.formulesForm.value;
   this.formuleCreated.emit(newFormuleAdded);
  }

}
