import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formule-form-table',
  templateUrl: './formule-form-table.component.html',
  styleUrls: ['./formule-form-table.component.css']
})
export class FormuleFormTableComponent implements OnInit {
  formulePhases:Array<any>;
  constructor() { }

  ngOnInit() {
    //get formule derails for doc title
    //with formule Id get formule phases -> sort by phase phaseIndex --> sort 
    //
    this.formulePhases=[
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
