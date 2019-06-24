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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formule',
  templateUrl: './formule.component.html',
  styleUrls: ['./formule.component.css']
})
export class FormuleComponent implements AfterViewInit {

  constructor(private formuleService: FormulesService , private authService: AuthService,
    private toastSrv: ToastrService) {}
  newFormuleBasic = null;
  allItemsForm: FormuleItem[] = [];
  allPhasesForm: FormulePhase[] = [];
  userInfo:any;
  @ViewChildren('childItem')
  childItems: QueryList<any>;
  childPhases: QueryList<any>;
  disableAddPhase: Boolean= false;

  // new method -noa
  // we will show only one card of adding/edditing to user (for: formule,phase,item )
  // all formule data would be in formule-form-table.component
  newPhase: Boolean= false;
  newItem: Boolean= false;
  phase:any;
  item:any;


  ngOnInit(){

  }
  onNewFormuleAdded(newFormuleCreated) {
    this.onFirstPhaseCreated(newFormuleCreated);
  }
  
  updatingFormuleBaseInfo(){}
  updatingPhaseInfo(){}
  updatingItemInfo(){}


  LoadingFormule(newFormule){
    if(newFormule!=null){
      this.newFormuleBasic = newFormule;
      this.newPhase = true;
      // this.formuleService.getFormuleDataById(this.newFormuleBasic._d).subscribe(phases=>{
      // });
        this.formuleService.getPhasesByFormuleId(this.newFormuleBasic._id).subscribe(phases=>{
        if(phases.length> 0){
          this.allPhasesForm=[]; 
          phases.forEach(phs => {
            this.allPhasesForm.push(phs);
          }); 
          // this.phase={
          //   phaseNumber:this.allPhasesForm.length+1,
          //   phaseName:"",
          //   phaseInstructions:"",
          // }
        }else{
          this.onFirstPhaseCreated(this.newFormuleBasic)
        }
      });  
    } else{
      this.toastSrv.error("Can't find formule number")

    }

  }

  onFirstPhaseCreated(newFormuleCreated){
    this.newFormuleBasic = newFormuleCreated;
    const newPhase = new FormulePhase();
    newPhase.phaseNumber= this.allPhasesForm.length+1;
    newPhase.formuleId= this.newFormuleBasic._id;
    newPhase.formuleNumber= this.newFormuleBasic.number;
    newPhase.formuleName= this.newFormuleBasic.name;
    this.disableAddPhase=false;

    this.phase=newPhase;
    this.newPhase=true;

  }

  onPhaseAdded(phaseToSave) {
    // check if exist in formule
    let exist=false;
    this.allPhasesForm.map(p=>{
      if(p.phaseNumber == phaseToSave.phaseNumber) {
        exist= true;
      }
    })
    if(!exist){
      // ADD PHASE !
      // this.formuleService.addNewPhaseToFormule(phaseToSave).subscribe(phase=>{
        
      if(phaseToSave._id){
        this.phase= new FormulePhase();
        this.phase= phaseToSave;
        debugger
        this.allPhasesForm.push(this.phase);
        this.newItem=true;
        this.item = new FormuleItem();
        this.item.formuleId= this.phase.formuleId ;
        this.item.phaseId= this.phase._id ;
      } else{
      this.toastSrv.error('phase without id')
      }
      // });

    }else{
      this.toastSrv.error('phase exist in formule')
    }
    // this.allPhasesForm.push(phaseToSave);
     
    // const newItem = new FormuleItem();
    // this.allItemsForm.push(newItem);
  }

  onItemAdded(item) {
    let existinfPhase= this.allPhasesForm.filter(p=> {
      if(p._id == item.phaseId){
        return p;
      } 
    });
    if(existinfPhase.length>0){
      existinfPhase[0].items.push(item);
      // SAVE PHASE CHNAGES
      this.formuleService.updateFormulePhase(existinfPhase[0]).subscribe(updatedPhase=>{
        this.allPhasesForm.map(p=> {
          if(p._id == item.phaseId){
            p = updatedPhase;
          } 
        });
        console.log("this.allPhasesForm",this.allPhasesForm);
      });
    }else{
      this.toastSrv.error("Can't find phase to update")
    }
    const newItem = new FormuleItem();
    this.allItemsForm.push(newItem);
  }

  onFinish() {
    // this.childItems.forEach((childItem, index) => {
    //   this.allItemsForm[index].number = childItem.itemsForm.value.number;
    //   this.allItemsForm[index].quantity = childItem.itemsForm.value.quantity;
    //   this.allItemsForm[index].percentage = childItem.itemsForm.value.Percentage;
    //   this.allItemsForm[index].instructions = childItem.itemsForm.value.instractions;
    // });
    
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
