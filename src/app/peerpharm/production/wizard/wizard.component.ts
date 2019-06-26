import { Component, OnInit, Input } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  constructor(private formuleService: FormulesService,private route: ActivatedRoute, private router: Router) { }
  scheduleId: String;
  formuleFrom: any=null;
  step: Number=1;
  inputValue: String;
  sugestedItem: String=null;
  wrongItem: String=null;
  currPhase: String;
  currItem: String;
  
  ngOnInit() {
    this.scheduleId = this.route.snapshot.queryParamMap.get('schedule');
    this.formuleService.getFormBySchedleId(this.scheduleId).subscribe(form=>{
      if(form!=null){
        this.formuleFrom= form;
        if(this.formuleFrom.phases[0].status=="new"){

          this.formuleFrom.phases[0].items.map(i=>{
            if(i.app){}
          })
        }
      }  
    })
  }

  searchMaterial(ev){
    
  }


}
