import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormulesService } from 'src/app/services/formules.service';


@Component({
  selector: 'app-add-formule-phase',
  templateUrl: './add-formule-phase.component.html',
  styleUrls: ['./add-formule-phase.component.scss']
})
export class AddFormulePhaseComponent implements OnInit {
  phaseForm: FormGroup;
  phValue: any;
  currPhase: any;
  // @Output() formulePhase = new EventEmitter();
  @Output() phaseCreated = new EventEmitter();
  @Input() formuleBase: any;
  @Input() phaseInfo: any;


  constructor(private toastSrv: ToastrService, private formuleService: FormulesService, private fb: FormBuilder, ) {

    this.phaseForm = this.fb.group({
      //set by the user
      _id: [null, Validators.required],
      phaseNumber: [null, Validators.required],
      phaseName: ['', Validators.required],
      phaseInstructions: ['', Validators.required],
      //set by the formule component
      items: [[],],
      formuleId: ['', Validators.required],
      formuleNumber: [null,],
      formuleName: ['', Validators.required],
    });
  }

  ngOnChanges() {
    this.adjustFormData();
  }

  ngOnInit() {
    this.adjustFormData();
  }

  adjustFormData() {
    
    if (this.formuleBase.id) this.phaseForm.controls.formuleId.setValue(this.formuleBase.id);
    if (this.formuleBase._id) this.phaseForm.controls.formuleId.setValue(this.formuleBase._id)
    this.phaseForm.controls.formuleNumber.setValue(this.formuleBase.number);
    this.phaseForm.controls.formuleName.setValue(this.formuleBase.name);
    if (this.phaseInfo) {
      this.phaseForm.controls.phaseNumber.setValue(this.phaseInfo.phaseNumber);
      this.phaseForm.controls.phaseName.setValue(this.phaseInfo.phaseName);
      this.phaseForm.controls.phaseInstructions.setValue(this.phaseInfo.phaseInstructions);
      if (this.phaseInfo._id != undefined && this.phaseInfo._id != null) {
        this.phaseForm.controls._id.setValue(this.phaseInfo._id);
      }
    }
  }
  onSubmit() {


    if (this.phaseForm.value.phaseNumber) {
      this.phaseForm.value.formuleId = this.formuleBase.id
      this.phaseForm.value.formuleName = this.formuleBase.name
      this.phaseForm.value.formuleNumber = this.formuleBase.number

  
     
      this.phaseForm.value.items=[];
      this.formuleService.updateFormulePhase(this.phaseForm.value).subscribe(newPhase => {
        
        if(newPhase.msg=="cant update- not same number")
        {
         // this.phaseValidation(); 
        }
        if (typeof (newPhase) != 'string' && newPhase != null) {
          this.phaseForm.value._id = newPhase._id;
          this.phaseValidation(); 

        } else {
          // newPhase returns "phase exist in formule"
          this.phaseValidation(); 
         // this.toastSrv.error(newPhase);
        }
      })
      //NEW PHASE 
    } else {
      //SAME PHASE
      if (this.phaseForm.value._id) {
        // when loding phase from table we get id 
        this.phaseValidation();
      } else if (this.phaseForm.value._id == null || this.phaseForm.value._id == undefined) {
        // add new Phase 
        this.formuleService.getPhaseByNumberAndFormuleId(this.phaseForm.value.formuleId, this.phaseForm.value.phaseNumber)
          .subscribe(existingPhase => {
            console.log('before')
            
            if (existingPhase) {
              this.phaseForm.controls._id.setValue(existingPhase._id);
              this.phaseValidation();


            }
          });
      }
    }

   
    




  }

  clearFields() { 

    
    this.phaseForm.value.phaseNumber = "";
    this.phaseForm.value.phaseName = "";
    this.phaseForm.value.phaseInstructions = "";
  }

  phaseValidation() {
    
    this.phaseCreated.emit(this.phaseForm.value);
    // if (this.phaseForm.valid) {
    //   this.phaseCreated.emit(this.phaseForm.value);
    // } else {
    //   this.toastSrv.error("Please fill all fields");
    // }
  }

  emitPhaseAdded() {
    // const newPhaseAdded = this.phaseForm.value;
    // this.formulePhase.emit(newPhaseAdded);
    let newPhase = this.phaseForm.value;
    this.phaseCreated.emit(newPhase);

  }
  deletePhase() {

  }
}
