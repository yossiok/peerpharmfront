import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';
import { ToastrService } from "ngx-toastr";

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
  phValue: string="7";
  @Output() formuleCreated = new EventEmitter();


  constructor(private formuleService: FormulesService , private toastSrv: ToastrService) { }

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
    if(this.formulesForm){
      const newFormuleAdded = this.formulesForm.value;
      this.formuleCreated.emit(newFormuleAdded);
    }else{
      this.toastSrv.error("Please complete Formule fields");
    }
  }

  changePH(ev){
    if(ev.target.value>=0){
      this.phValue=ev.target.value;
    }else{
      this.toastSrv.error("Please enter valid PH number");
    }
  }
}
