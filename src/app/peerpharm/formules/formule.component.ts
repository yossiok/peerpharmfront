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
import { Formule } from './models/formule';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formule',
  templateUrl: './formule.component.html',
  styleUrls: ['./formule.component.css']
})
export class FormuleComponent implements AfterViewInit {

  constructor(private formuleService: FormulesService, private authService: AuthService, private routerService: ActivatedRoute,
    private toastSrv: ToastrService) { }
  newFormuleBasic = null;
  allItemsForm: FormuleItem[] = [];
  allPhasesForm: FormulePhase[] = [];
  userInfo: any;
  @ViewChildren('childItem')
  childItems: QueryList<any>;
  childPhases: QueryList<any>;
  disableAddPhase: Boolean = false;

  // new method -noa
  // we will show only one card of adding/edditing to user (for: formule,phase,item )
  // all formule data would be in formule-form-table.component
  newPhase: Boolean = false;
  newItem: Boolean = false;
  phase: any;
  item: any;


  ngOnInit() {
    this.routerService.params.subscribe(data => {
      debugger;
      if (data.id) {
        debugger;
        //edit mode
        //get Formule Phases By Id....
        this.formuleService.getFormuleDataById(data.id).subscribe(formuleData => {
          debugger
          //this.formule= formuledata 
          this.newFormuleBasic = formuleData;
          this.formuleService.getPhasesByFormuleId(data.id).subscribe(phases => {
            debugger;
            //this.phases= phases
          })
        })
      }
    })

  }
  onNewFormuleAdded(newFormuleCreated) {
    debugger;
    this.onFirstPhaseCreated(newFormuleCreated);
  }

  LoadingFormule(newFormule) {
    debugger;
    if (newFormule != null) {
      this.newFormuleBasic = newFormule;
      this.newPhase = true;
      // this.formuleService.getFormuleDataById(this.newFormuleBasic._d).subscribe(phases=>{
      // });
      this.formuleService.getPhasesByFormuleId(this.newFormuleBasic._id).subscribe(phases => {
        if (phases.length > 0) {
          this.allPhasesForm = [];
          phases.forEach(phs => {
            this.allPhasesForm.push(phs);
          });
          // this.phase={
          //   phaseNumber:this.allPhasesForm.length+1,
          //   phaseName:"",
          //   phaseInstructions:"",
          // }
        } else {
          this.onFirstPhaseCreated(this.newFormuleBasic)
        }
      });
    } else {
      this.toastSrv.error("Can't find formule number")

    }

  }

  onFirstPhaseCreated(newFormuleCreated) {
    debugger;
    this.newFormuleBasic = newFormuleCreated;
    const newPhase = new FormulePhase();
    newPhase.phaseNumber = this.allPhasesForm.length + 1;

    if (this.newFormuleBasic.id)
      newPhase.formuleId = this.newFormuleBasic.id;
    else
      newPhase.formuleId = this.newFormuleBasic._id;

    newPhase.formuleNumber = this.newFormuleBasic.number;
    newPhase.formuleName = this.newFormuleBasic.name;
    this.formuleService.addNewPhaseToFormule(newPhase).subscribe(phase => {
      this.disableAddPhase = false;
      this.phase = newPhase;
      this.newPhase = true;

    })

  }


  onPhaseAdded(phaseToSave) {
    // check if exist in formule
    let exist = false;
    this.allPhasesForm.map(p => {
      if (p.phaseNumber == phaseToSave.phaseNumber) {
        exist = true;
      }
    });
    if (!exist) {
      // ADD PHASE !
      // this.formuleService.addNewPhaseToFormule(phaseToSave).subscribe(phase=>{

      if (phaseToSave._id) {
        this.phase = new FormulePhase();
        this.phase = phaseToSave;
        this.allPhasesForm.push(this.phase);
        this.addItemToScreen();

      } else {
        this.toastSrv.error('phase without id')
      }
      // });

    } else {
      if (confirm('לשמור שינויים בפאזה?')) {

        let index;
        this.allPhasesForm.forEach((p, key) => {
          if (p.phaseNumber == phaseToSave.phaseNumber) {
            index = key;
            if (p.items.length > 0) {
              phaseToSave.items = p.items;
            }
          }
        });
        this.allPhasesForm[index] = phaseToSave;


        this.phase = phaseToSave;
        this.addItemToScreen()
      } else {
        this.toastSrv.error('phase exist in formule\nChanges not saved')
      }
    }
    // this.allPhasesForm.push(phaseToSave);

    // const newItem = new FormuleItem();
    // this.allItemsForm.push(newItem);
  }
  addItemToScreen() {

    this.newItem = true;
    this.item = new FormuleItem();
    this.item.formuleId = this.phase.formuleId;
    this.item.phaseId = this.phase._id;
  }

  onItemAdded(item) {
    item.phaseId;
    this.phase._id;
    let existinfPhase = this.allPhasesForm.filter(p => {
      if (p._id == item.phaseId) {
        return p;
      }
    });
    if (existinfPhase.length > 0) {
      existinfPhase[0].items.push(item);
      // SAVE PHASE CHNAGES
      this.formuleService.updateFormulePhase(existinfPhase[0]).subscribe(updatedPhase => {
        this.allPhasesForm.map(p => {
          if (p._id == item.phaseId) {
            p = updatedPhase;
          }
        });
        this.toastSrv.success("Item added to phase");
        console.log("this.allPhasesForm", this.allPhasesForm);
        this.newItem = false;


      });
    } else {

      this.toastSrv.error("Can't find phase to update")
    }
    const newItem = new FormuleItem();
    this.allItemsForm.push(newItem);
  }

  onPhaseLoad(phaseToLoad) {
    if (phaseToLoad._id) {
      this.phase = new FormulePhase();
      this.phase = phaseToLoad;
    } else {
      this.toastSrv.error("no phase id")
    }
  }


  onFinish() {
    debugger
    var formuleToSave = new Formule();
    formuleToSave = {
      _id: this.newFormuleBasic._id,
      number: this.newFormuleBasic.number,
      name: this.newFormuleBasic.name,
      category: this.newFormuleBasic.category,
      lastUpdate: this.newFormuleBasic.lastUpdate,
      lastUpdateUser: this.newFormuleBasic.lastUpdateUser,
      ph: this.newFormuleBasic.ph,
      client: this.newFormuleBasic.client,
      phases: this.allPhasesForm,
    }
    this.formuleService.updateFormule(formuleToSave).subscribe(data => {
      if (data._id) {
        this.toastSrv.success("Formule Saved")
      } else {
        this.toastSrv.error("Formule NOT Saved!")
        this.toastSrv.error("error: " + data)
      }
    })
  }

  ngAfterViewInit() {
    this.childItems.forEach(childItem => console.log(childItem));
  }
}
