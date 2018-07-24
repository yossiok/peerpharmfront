import { FormulesModule } from './peerpharm/formules/formules.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AddFormuleComponent } from './peerpharm/formules/add-formule/add-formule.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/starter', pathMatch: 'full' },
      {
        path: 'starter',
        loadChildren: './starter/starter.module#StarterModule'
      },
      {
        path: 'component',
        loadChildren: './component/component.module#ComponentsModule'
      },
      {
        path: 'formules',
        loadChildren: './peerpharm/formules/formules.module#FormulesModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
