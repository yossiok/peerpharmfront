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
  @Input() phaseInfo :any;
  

  constructor(private toastSrv: ToastrService, private formuleService: FormulesService, private fb: FormBuilder, ) { 

    this.phaseForm = this.fb.group({
      //set by the user
      _id: [null, Validators.required],
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

  ngOnChanges() {
    this.adjustFormData();
  }

  ngOnInit() {
    this.adjustFormData();
  }

  adjustFormData(){
    this.phaseForm.controls.formuleId.setValue(this.formuleBase._id);
    this.phaseForm.controls.formuleNumber.setValue(this.formuleBase.number);
    this.phaseForm.controls.formuleName.setValue(this.formuleBase.name);
    this.phaseForm.controls.phaseNumber.setValue(this.phaseInfo.phaseNumber);
    this.phaseForm.controls.phaseName.setValue(this.phaseInfo.phaseName);
    this.phaseForm.controls.phaseInstructions.setValue(this.phaseInfo.phaseInstructions);
  }
  onSubmit() {
    if(this.phaseForm.value._id){

      // when loding phase from table we get id 
      this.phaseValidation();

    }else if(this.phaseForm.value._id == null || this.phaseForm.value._id == undefined ){
      // add new Phase 
      this.formuleService.getPhaseByNumberAndFormuleId(this.phaseForm.value.formuleId, this.phaseForm.value.phaseNumber)
      .subscribe(existingPhase=>{
        
        console.log('before')
        debugger
        if(existingPhase){
          this.phaseForm.controls._id.setValue(existingPhase._id);
          this.phaseValidation();

        }
      });

    }
    console.log('after')




  }

  phaseValidation(){
    // return new Promise=
    if(this.phaseForm.valid){
      // if(this.phaseForm.value.items.length>0){
      //   //adjust items arr
      // }
      //moved the post call to formule.component
      // this.formuleService.addNewPhaseToFormule(this.phaseForm.value).subscribe(phase=>{
        this.phaseCreated.emit(this.phaseForm.value);
      // })
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
