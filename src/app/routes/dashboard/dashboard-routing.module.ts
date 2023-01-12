import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserloggedinGuard } from 'src/app/guards/userloggedin.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [UserloggedinGuard],
    component: DashboardComponent,
    data: { protected: true, title: "Dashboard", link: ['dashboard'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
