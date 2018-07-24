import { AddFormuleComponent } from './add-formule/add-formule.component';
import { Routes } from '@angular/router';

 

export const FormulesRoutes: Routes =[
  {
    path: '',
    data: {
      title: 'Add Formule' 
    },
    component: AddFormuleComponent
  }
];