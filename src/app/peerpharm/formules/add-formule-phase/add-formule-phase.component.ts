import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-add-formule-phase',
  templateUrl: './add-formule-phase.component.html',
  styleUrls: ['./add-formule-phase.component.css']
})
export class AddFormulePhaseComponent implements OnInit {
  phaseForm: FormGroup;
  phValue: any;
  @Output() formulePhase = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.phaseForm = new FormGroup({
      phaseNumber: new FormControl('', [Validators.required]),
      phaseName: new FormControl('', [Validators.required]),
      instractions: new FormControl('', [Validators.required]),
      formuleNumber: new FormControl('', [Validators.required]),
      formuleName: new FormControl('', [Validators.required]),
    });

    
  }

  onSubmit() {
    const newPhaseAdded = this.phaseForm.value;
    this.formulePhase.emit(newPhaseAdded);
  }

}
