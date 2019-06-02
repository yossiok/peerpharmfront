import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';
import { ToastrService } from "ngx-toastr";
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';

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
  user: string="";
  userInfo: UserInfo;
  phValue: string="7";
  formuleDetailsOk: Boolean= false;
  formuleSaved: Boolean= false;
  editFormule: Boolean= false;
  currentFormule:any={
    number: null,
    name:"",
    category: "",
    lastUpdate: new Date(),
    lastUpdateUSer: "",
    ph: null,
    client: "",
  };
  @Output() formuleCreated = new EventEmitter();



  constructor(private fb: FormBuilder, private authService: AuthService ,
    private formuleService: FormulesService , private toastSrv: ToastrService) { 

    this.formulesForm = this.fb.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      lastUpdate: ['', Validators.required],
      lastUpdateUser: ['', Validators.required],
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
    
    this.authService.userEventEmitter.subscribe(data => {
      this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
      this.formulesForm.controls.lastUpdateUser.setValue(this.user);
    });
    
    this.formulesForm.controls.client.setValue('Peerpharm Ltd');
  }



  async onSubmit() {
    if(this.formulesForm.value.lastUpdateUser ==""){
      this.authService.userEventEmitter.subscribe(data => {
        this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
        this.formulesForm.controls.lastUpdateUser.setValue(this.user);
      });  
    }
    
    await this.formuleService.getFormuleByNumber(this.formulesForm.value.number).subscribe(data=>{
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
              this.formuleSaved=true;

              // this.formuleCreated.emit(newFormuleDetails);
            } else if(formule == 'formule number exist'){
                this.toastSrv.error("Formule Number already exist");
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

editFormuleDetails(action){
  if(action=="save"){
  this.formuleSaved= true;
  } else if(action == "edit"){
    this.formuleSaved= false;
  }
}

}
