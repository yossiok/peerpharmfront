import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
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
  currPhase:any;
  // @Output() formulePhase = new EventEmitter();
  @Output() phaseCreated = new EventEmitter();
  @Input() formuleBase :any;

  constructor(private toastSrv: ToastrService, private formuleService: FormulesService, private fb: FormBuilder, ) { 

    this.phaseForm = this.fb.group({
      //set by the user
      phaseNumber: [null, Validators.required],
      phaseName: ['', Validators.required],
      phaseInstructions: ['', Validators.required],
      //set by the formule component
      items: [[], ],
      formuleId: ['', Validators.required],
      formuleNumber: [null, ],
      formuleName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.phaseForm.controls.formuleId.setValue(this.formuleBase._id);
    this.phaseForm.controls.formuleNumber.setValue(this.formuleBase.number);
    this.phaseForm.controls.formuleName.setValue(this.formuleBase.name);
    debugger
    // this.phaseForm = new FormGroup({
    //   phaseNumber: new FormControl('', [Validators.required]),
    //   phaseName: new FormControl('', [Validators.required]),
    //   instractions: new FormControl('', [Validators.required]),
    //   formuleNumber: new FormControl('', [Validators.required]),
    //   formuleName: new FormControl('', [Validators.required]),
    // });
  }

  onSubmit() {
    debugger
    // if form valid
    if(this.phaseForm.valid){
      if(this.phaseForm.value.items.length>0){
        //adjust items arr
      }
      this.formuleService.addNewPhaseToFormule(this.phaseForm.value).subscribe(phase=>{
        this.phaseCreated.emit(phase);
      })
    }else{
      this.toastSrv.error("Please fill all fields");
    }
  }

  emitPhaseAdded(){
    // const newPhaseAdded = this.phaseForm.value;
    // this.formulePhase.emit(newPhaseAdded);
    let newPhase= this.phaseForm.value;
    this.phaseCreated.emit(newPhase);

  }
  deletePhase(){
    
  }
}
