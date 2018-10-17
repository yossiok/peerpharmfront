import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';


@Component({
  selector: 'app-add-formule',
  templateUrl: './add-formule.component.html',
  styleUrls: ['./add-formule.component.css']
})
export class AddFormuleComponent implements OnInit {

  formulesForm: FormGroup;
  phValue:string;


  constructor(private formuleService:FormulesService) { }

  ngOnInit() {

    this.formulesForm = new FormGroup({
      number: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      lastUpdate: new FormControl('', [Validators.required]),
      ph: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required])
    });
  }


  onSubmit(): void {
    this.formuleService.addFormule(this.formulesForm.value).subscribe(data=>console.log("added "+data));
  
  }

}
