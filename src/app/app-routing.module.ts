import { LoginComponent } from './shared/auth/login.component';
import { PeerPharmModule } from './peerpharm/peerpharmmodule';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { UserloggedinGuard } from './guards/userloggedin.guard';


export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate:[UserloggedinGuard],
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
        path: 'peerpharm',
        loadChildren: './peerpharm/peerpharmmodule#PeerPharmModule'
      },
      {
        path: 'taskboard',
        loadChildren: './peerpharm/taskboard/app.module#TaskModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  },
  {
    path: 'login',
    component:LoginComponent
  }
];
