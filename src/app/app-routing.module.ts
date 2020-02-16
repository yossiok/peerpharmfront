import { ContentComponent } from './peerpharm/taskboard/core/content/content.component';
import { LoginComponent } from './shared/auth/login.component';
import { PeerPharmModule } from './peerpharm/peerpharmmodule';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { UserloggedinGuard } from './guards/userloggedin.guard';
import { SignupComponent } from './shared/auth/signup.component';
import { ItemdetaisComponent } from './peerpharm/items/itemdetais/itemdetais.component';
import { MyiframeComponent } from './myiframe/myiframe.component';


export const Approutes: Routes = [
  {
    path: 'items/itemDetails',
    component: ItemdetaisComponent
  },
  {
    path: 'items/itemDetails/:itemNumber',
    component: ItemdetaisComponent
  },
  {
    path: 'login',
    component: LoginComponent
    },
  {
    path: 'signup',
    component: SignupComponent
  },

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
   /*   {
        path: 'taskboard',
        loadChildren: './peerpharm/taskboard/app.module#TaskModule'
      }*/
      
      {
        path: 'batch',
        component: MyiframeComponent
      },
    ]
  
  },
 
{
  path: '**',
    redirectTo: '/starter'
}
];
