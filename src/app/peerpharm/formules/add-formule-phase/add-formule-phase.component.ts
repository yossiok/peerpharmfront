import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormulesService } from 'src/app/services/formules.service';


@Component({
  selector: 'app-add-formule-phase',
  templateUrl: './add-formule-phase.component.html',
  styleUrls: ['./add-formule-phase.component.css']
})
export class AddFormulePhaseComponent implements OnInit {
  phaseForm: FormGroup;
  phValue: any;
  @Output() formulePhase = new EventEmitter();
  @Output() phaseCreated = new EventEmitter();

  constructor(private toastSrv: ToastrService, private formuleService: FormulesService, ) { }

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
    debugger
    // if form valid
    if(this.phaseForm.valid){
      
    }else{
      this.toastSrv.error("Please fill all fields");
    }
  }

  emitPhaseAdded(){
    const newPhaseAdded = this.phaseForm.value;
    this.formulePhase.emit(newPhaseAdded);
    let newPhase= this.phaseForm.value;
    this.phaseCreated.emit(newPhase);

  }
  deletePhase(){
    
  }
}
