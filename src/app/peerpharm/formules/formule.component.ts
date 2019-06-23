import {
  Component,
  ViewChildren,
  AfterViewInit,
  QueryList
} from '@angular/core';
import { FormuleItem } from './models/formule-item';
import { FormulePhase } from './models/formule-phase';
import { FormulesService } from '../../services/formules.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-formule',
  templateUrl: './formule.component.html',
  styleUrls: ['./formule.component.css']
})
export class FormuleComponent implements AfterViewInit {

  constructor(private formuleService: FormulesService , private authService: AuthService) {}
  newFormuleBasic = null;
  allItemsForm: FormuleItem[] = [];
  allPhasesForm: FormulePhase[] = [];
  userInfo:any;
  @ViewChildren('childItem')
  childItems: QueryList<any>;
  childPhases: QueryList<any>;
  disableAddPhase: Boolean= false;

  ngOnInit(){
    // debugger
    // this.userInfo= this.authService.loggedInUser.firstName+" "+this.authService.loggedInUser.lastName;
    // console.log("this.userInfo: "+this.userInfo)
  }
  onFormuleAdded(newFormuleCreated) {
    this.newFormuleBasic = newFormuleCreated;
    const newPhase = new FormulePhase();
    // const newItem = new FormuleItem();
    this.allPhasesForm.push(newPhase);
    // this.allItemsForm.push(newItem);
  }
  LoadingFormule(newFormule){
    this.newFormuleBasic = newFormule;
    this.formuleService.getPhasesByFormuleId(this.newFormuleBasic._id).subscribe(phases=>{
      if(phases.length> 0){
        this.allPhasesForm=[]; 
        phases.forEach(phs => {
          this.allPhasesForm.push(phs);
        });
      }else{
        this.onFirstPhaseCreated(this.newFormuleBasic)
      }
      debugger
    });

  }

  onFirstPhaseCreated(newFormuleCreated){
    this.newFormuleBasic = newFormuleCreated;
    this.newFormuleBasic;
    var newPhase = new FormulePhase();
    newPhase.phaseNumber= this.allPhasesForm.length+1
    this.allPhasesForm.push(newPhase);
    this.disableAddPhase=false;
  }

  onPhaseAdded(phaseToSave) {
    this.allPhasesForm.push(phaseToSave);
    debugger
    const newItem = new FormuleItem();
    this.allItemsForm.push(newItem);
  }

  onItemAdded(lastItemAdded) {
    const newItem = new FormuleItem();
    this.allItemsForm.push(newItem);
  }

  onFinish() {
    this.childItems.forEach((childItem, index) => {
      this.allItemsForm[index].number = childItem.itemsForm.value.number;
      this.allItemsForm[index].quantity = childItem.itemsForm.value.quantity;
      this.allItemsForm[index].percentage = childItem.itemsForm.value.Percentage;
      this.allItemsForm[index].instructions = childItem.itemsForm.value.instractions;
    });
    
    this.formuleService
      .addFormule(
        this.newFormuleBasic.number,
        this.newFormuleBasic.name,
        this.newFormuleBasic.category.value,
        this.newFormuleBasic.lastUpdate,
        this.newFormuleBasic.ph,
        this.newFormuleBasic.client,
        this.allItemsForm
      )
     .subscribe(data => console.log('added ' + data));
  }

  ngAfterViewInit() { 
    this.childItems.forEach(childItem => console.log(childItem));
  }
}
