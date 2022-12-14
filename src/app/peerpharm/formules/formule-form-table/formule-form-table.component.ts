import { Component, OnInit, Input, EventEmitter, Output, OnChanges, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-formule-form-table',
  templateUrl: './formule-form-table.component.html',
  styleUrls: ['./formule-form-table.component.scss']
})
export class FormuleFormTableComponent implements OnInit, OnChanges {
 
  phases:Array<any>;
  calcultatedPercentages:any
  formuleName:'bar';
  constructor() { }
  @Input() formulePhases: Array<any>;
  @Output() loadPhase = new EventEmitter();

  

  ngOnChanges(data) {
    
    this.phases= this.formulePhases;
     
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

}



  ngOnInit() {
    ;
    this.phases= this.formulePhases;

    this.formuleName = this.phases[0].name

    // getPhaseItems
  }
  loadPhaseToForm(phase){
    
    this.loadPhase.emit(phase);
  }

 

}
