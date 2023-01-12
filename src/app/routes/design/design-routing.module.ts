import { DesignComponent } from './design/design.component';
import { UserloggedinGuard } from './../../guards/userloggedin.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    canActivate: [UserloggedinGuard],
    component: DesignComponent,
    data: { protected: true, title: "Design", link: ['design'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignRoutingModule { }
