import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';
import { ToastrService } from "ngx-toastr";
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { log } from 'util';
import { Router } from '@angular/router';

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
  user: string = "";
  userInfo: UserInfo;
  phValue: string = "7";
  phValueTo: String;
  formuleDetailsOk: Boolean = false;
  formuleSaved: Boolean = false;
  editSavedFormule: Boolean = false;
  allTrueArr: any[];
  currTrue: any[];
  currentFormule: any = {
    number: null,
    name: "",
    formuleParentId: '',
    category: "",
    lastUpdate: new Date(),
    lastUpdateUser: "",
    ph: null,
    phTo: null,
    client: "",
    id: null,
    parent: "",
  };

  @Output() formuleCreated = new EventEmitter();
  @Output() formuleLoaded = new EventEmitter();
  @Output() firstPhaseCreated = new EventEmitter();
  @Input() disableAdding: Boolean;


  constructor(private fb: FormBuilder, private authService: AuthService, private routerService:Router,
    private formuleService: FormulesService, private toastSrv: ToastrService) {

    this.formulesForm = this.fb.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      lastUpdate: ['', Validators.required],
      lastUpdateUser: ['', Validators.required],
      ph: [null,],
      phTo: [null,],
      client: ['', Validators.required],
      id: [null,],
      formuleParentId: ['',],
      parent: ['',],

    });
  }

  allFormuleCategory: Array<any> = ['Oil Based Lotion', 'Water Baised Lotion', 'Hyperallergic'];
  // allFormuleCategory: FormuleCategory[] = ['Oil Based Lotion', 'Water Baised Lotion' , 'Hyperallergic'];
  // allFormuleCategory: FormuleCategory[] = [
  //   { value: 'Oil Based Lotion'},
  //   { value: 'Water Baised Lotion' },
  //   { value: 'Hyperallergic'}
  // ];

  async ngOnInit() {
    await this.authService.userEventEmitter.subscribe(user => {
      this.user = user.firstName + " " + user.lastName;
      this.formulesForm.controls.lastUpdateUser.setValue(this.user);
      this.getTrueParents();
    });

    // await this.authService.getLoggedInUser().subscribe(data=>{
    //   data;
    //    
    // })
    // this.authService.userEventEmitter.subscribe(data => {
    //   this.user = this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
    //   this.formulesForm.controls.lastUpdateUser.setValue(this.user);
    // });
    // await this.getUserInfo().then(msg=>{
    //   console.log('got user info')
    // }).catch(errMsg=>{
    //   console.log("user info errMsg: "+errMsg)
    // });
    console.log('welcome ' + this.user);
    this.formulesForm.controls.client.setValue('Peerpharm Ltd');
  }


  getTrueParents() {

    this.formuleService.getTrueArray().subscribe(data => {
      this.allTrueArr = data

      console.log(this.allTrueArr)
    })
  }

  async updateCurrFormule() {

    // this.currentFormule=
  }
  isChecked(ev) {
    ;
    if (ev.target.checked == true) {

      this.currentFormule.parent = ev.target.checked;
      ;
    }

    if (ev.target.checked == false) {
      ;
      this.currentFormule.parent = ev.target.checked;
    }
    console.log(this.currentFormule.parent)
  }

  async onSubmit(actionType) {
    

    //get user info
    if (this.formulesForm.value.lastUpdateUser == "") {
      this.authService.userEventEmitter.subscribe(data => {
        this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
        this.formulesForm.controls.lastUpdateUser.setValue(this.user);
      });
    }

    // check if formule number free to use
    await this.formuleService.getFormuleByNumber(this.formulesForm.value.number).subscribe(data => {
      if (data != null) {
        this.toastSrv.error("Formule number already exist");
      } else {
        // trim unwanted tails
        this.formulesForm.value.number.trim();
        this.formulesForm.value.name.trim();
        this.formulesForm.value.client.trim();
        this.formulesForm.controls.ph.setValue(this.phValue);
        this.formulesForm.controls.phTo.setValue(this.phValueTo);
        this.user = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
        this.formulesForm.controls.lastUpdateUser.setValue(this.user);

        //check that all fields filled
        if (this.formulesForm.valid) {
          var newFormuleDetails = this.formulesForm.value;
        
          //save new formule
          this.formuleService.newFormule(newFormuleDetails).subscribe(formule => {
            if (formule) {
              
        //if new formule that was copied from old formule (has parentID)
          //we change the url to edit mode so we reload thecopied formule phases
          //else we continue with old code to start filling the new formule 
          if(formule.formuleParentId!='')
          {
            
            this.routerService.navigate(['/peerpharm/formule/addnewformule/'+formule._id]);
            
          }
          else{
            this.currentFormule = formule;
            this.formulesForm.controls.id.setValue(formule._id);
            this.formuleSaved = true;
            this.editSavedFormule = false;
            this.formuleCreated.emit(this.formulesForm.value);
          }
            } else if (formule == 'formule number exist') {
              this.toastSrv.error("Formule Number already exist");
            }
          });
        } else {
          this.toastSrv.error("Please complete Formule fields");
        }
      }
    });

  }

  fillTheFields(parnetFormuleID) {
    let parnetFormule = this.allTrueArr.find(x => x._id == parnetFormuleID);
    this.formulesForm = this.fb.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      category: [parnetFormule.category, Validators.required],
      lastUpdate: ['', Validators.required],
      lastUpdateUser: [parnetFormule.lastUpdateUser, Validators.required],
      ph: [parnetFormule.ph,],
      phTo: [parnetFormule.phTo,],
      client: [parnetFormule.client, Validators.required],
      formuleParentId: [parnetFormule._id,],
      parent: [false,]
    });


  }


  changePH(ev) {
    if (ev.target.value >= 0) {
      this.phValue = ev.target.value;
    } else {
      this.toastSrv.error("Please enter valid PH number");
    }

  }

  addFirstPhase() {
    
    this.firstPhaseCreated.emit(this.currentFormule);
  }

  findFormuleByNumber() {
    if (this.formulesForm.value.number != "") {
      this.formuleService.getFormuleByNumber(this.formulesForm.value.number).subscribe(formule => {
        if (formule) {
          this.currentFormule = formule
          this.formuleSaved = true;
          this.disableAdding = true;
          // this.addFirstPhase();
          this.formuleLoaded.emit(this.currentFormule);
        } else {
          this.toastSrv.error("Can't find formule number")
          // this.formuleLoaded.emit(null);
        }

      });
    }
  }

  editFormuleDetails(action) {
    if (action == "save") {
      this.formuleSaved = true;
      this.editSavedFormule = false;
      this.saveFormuleDetails();
    }
    else if (action == "edit") {
      this.formuleSaved = false;
      this.editSavedFormule = true;

    }
  }

  saveFormuleDetails() {
    //
    this.formulesForm.value.number.trim();
    this.formulesForm.value.name.trim();
    this.formulesForm.value.client.trim();
    this.formulesForm.controls.ph.setValue(this.phValue);
    this.formulesForm.controls.phTo.setValue(this.phValueTo);

    //check that all fields filled
    if (this.formulesForm.valid) {
      var udateFormuleDetails = this.formulesForm.value;
      // 
      udateFormuleDetails._id = this.currentFormule._id
      // udateFormuleDetails.phases=this.currentFormule.phases;
      //save updated formule
      this.formuleService.updateFormule(udateFormuleDetails).subscribe(formule => {
        if (formule._id) {
          this.currentFormule = formule;
          this.formuleSaved = true;
          this.editSavedFormule = false;
          this.toastSrv.success("Details Saved");

          // this.formuleCreated.emit(newFormuleDetails);
        } else if (formule == 'formule number exist') {
          this.toastSrv.error("Formule Number already exist");
        } else if (formule == "cant find formule id") {
          this.toastSrv.error("Can't update Formule by id");
        }
      });
    } else {
      this.toastSrv.error("Please complete Formule fields");
    }
  }

  getUserInfo() {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.authService.userEventEmitter.subscribe(data => {
        that.user = that.authService.loggedInUser.firstName + " " + that.authService.loggedInUser.lastName;
        that.formulesForm.controls.lastUpdateUser.setValue(that.user);
        if (that.user != "" && that.formulesForm.value.lastUpdateUser) {
          resolve("continue");
        } else {
          reject("No user name");
        }
      });

    });
  }

}
