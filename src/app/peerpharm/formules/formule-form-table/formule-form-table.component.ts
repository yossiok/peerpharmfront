import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-formule-form-table',
  templateUrl: './formule-form-table.component.html',
  styleUrls: ['./formule-form-table.component.css']
})
export class FormuleFormTableComponent implements OnInit {
  phases:Array<any>;
  constructor() { }
  @Input() formulePhases: Array<any>;

  ngOnInit() {
    this.phases= this.formulePhases;
    // getPhaseItems
    debugger
    this.phases=[
      {
      phase:"A",
      phaseIndex:"1",
      stepsArr: [
          {
            itemIndex: 1,
            materialName: "water",
          },
          {
            itemIndex: 2,
            materialName: "oil",
          },
          {
            itemIndex: 3,
            materialName: "silicon",
          },
       ],
       stepsAmount:3,
       },
      {
      phase:"B",
      phaseIndex:"2",
      stepsArr: [
          {
            itemIndex: 1,
            materialName: "water",
          },
          {
            itemIndex: 2,
            materialName: "oil",
          },
          {
            itemIndex: 3,
            materialName: "silicon",
          },
        ],
        stepsAmount: 3,
       },
    ]
  }

}
