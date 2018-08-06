import { ContentComponent } from './peerpharm/taskboard/core/content/content.component';
import { LoginComponent } from './shared/auth/login.component';
import { PeerPharmModule } from './peerpharm/peerpharmmodule';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { UserloggedinGuard } from './guards/userloggedin.guard';
import { SignupComponent } from './shared/auth/signup.component';


export const Approutes: Routes = [
  {
<<<<<<< HEAD
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
        path: 'peerpharm',
        loadChildren: './peerpharm/peerpharmmodule#PeerPharmModule'
      },
   /*   {
        path: 'taskboard',
        loadChildren: './peerpharm/taskboard/app.module#TaskModule'
      }*/
    ]
=======
    path: 'login',
    component: LoginComponent
>>>>>>> 05d924919c01c27af3d43c578fce7340b3bc3faa
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '',
    component: FullComponent
    ,
 
  canActivate: [UserloggedinGuard],


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
    }
  ]
  },
{
  path: '**',
    redirectTo: '/starter'
}
];
