import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-formule-form-table',
  templateUrl: './formule-form-table.component.html',
  styleUrls: ['./formule-form-table.component.css']
})
export class FormuleFormTableComponent implements OnInit {
  phases:Array<any>;
  constructor() { }
  @Input() formulePhases: Array<any>;
  @Output() loadPhase = new EventEmitter();

  

  ngOnChanges() { 
    this.phases= this.formulePhases;
     
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

}

  ngOnInit() {
    this.phases= this.formulePhases;
    // getPhaseItems
  }
  loadPhaseToForm(phase){
    this.loadPhase.emit(phase);
  }

}
