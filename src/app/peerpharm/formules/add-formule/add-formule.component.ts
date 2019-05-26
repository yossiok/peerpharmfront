import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';
import { ToastrService } from "ngx-toastr";

// export interface FormuleCategory {
//   value: string;
// }

@Component({
  selector: 'app-add-formule',
  templateUrl: './add-formule.component.html',
  styleUrls: ['./add-formule.component.css']
})
export class AddFormuleComponent implements OnInit {

 public formulesForm: FormGroup;
  phValue: string="7";
  formuleDetailsOk: Boolean= false;
  formuleSaved: Boolean= false;
  currentFormule:any;
  @Output() formuleCreated = new EventEmitter();


  constructor(private fb: FormBuilder, private formuleService: FormulesService , private toastSrv: ToastrService) { 

    this.formulesForm = this.fb.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      lastUpdate: ['', Validators.required],
      ph: [null, ],
      client: ['', Validators.required],
    });
  }

  allFormuleCategory: Array<any> = ['Oil Based Lotion', 'Water Baised Lotion' , 'Hyperallergic'];
  // allFormuleCategory: FormuleCategory[] = ['Oil Based Lotion', 'Water Baised Lotion' , 'Hyperallergic'];
  // allFormuleCategory: FormuleCategory[] = [
  //   { value: 'Oil Based Lotion'},
  //   { value: 'Water Baised Lotion' },
  //   { value: 'Hyperallergic'}
  // ];

  ngOnInit() {

    // this.formulesForm = new FormGroup({
    this.formulesForm.controls.client.setValue('Peerpharm Ltd');
  }


  onSubmit(): void {
    //check if formule form alredy exist
    debugger
    this.formuleService.getFormuleByNumber(this.formulesForm.value.number).subscribe(data=>{
      debugger
      if(data.length!=0){
        this.toastSrv.error("Formule number already exist");
      }else{
        // trim unwanted edges
        this.formulesForm.value.number.trim();
        this.formulesForm.value.name.trim();
        this.formulesForm.value.client.trim();
        this.formulesForm.controls.ph.setValue(this.phValue);

        if(this.formulesForm.valid){
          var newFormuleDetails = this.formulesForm.value;
          this.formuleService.newFormule(newFormuleDetails).subscribe(formule=>{
            debugger
            if(formule._id){
              this.currentFormule=formule;
              this.formuleDetailsOk=true;
              this.formuleSaved=true;

              // this.formuleCreated.emit(newFormuleDetails);
            }
          });
        }else{
          this.toastSrv.error("Please complete Formule fields");
        }
      }
    });

  }

  changePH(ev){
    if(ev.target.value>=0){
      this.phValue=ev.target.value;
    }else{
      this.toastSrv.error("Please enter valid PH number");
    }
    
  }

  addFirstPhase(){
    this.formuleCreated.emit(this.currentFormule);

  }



}
