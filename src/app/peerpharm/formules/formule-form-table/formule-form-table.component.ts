import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-formule-form-table',
  templateUrl: './formule-form-table.component.html',
  styleUrls: ['./formule-form-table.component.css']
})
export class FormuleFormTableComponent implements OnInit {
  phases:Array<any>;
  calcultatedPercentages:any
  constructor() { }
  @Input() formulePhases: Array<any>;
  @Output() loadPhase = new EventEmitter();

  

  ngOnChanges() {
    debugger
    this.phases= this.formulePhases;
     
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

}

  ngOnInit() {
    debugger;
    this.phases= this.formulePhases;

    // getPhaseItems
  }
  loadPhaseToForm(phase){
    debugger
    this.loadPhase.emit(phase);
  }

}
