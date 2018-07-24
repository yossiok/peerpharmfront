import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormulesRoutes } from './formules.routing';
import { AddFormuleComponent } from './add-formule/add-formule.component'; 
import {HttpModule} from '@angular/http';
import { AddFormuleItemComponent } from './add-formule-item/add-formule-item.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FormulesRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule, 
    HttpClientModule,
    NgbModule
  ],
  declarations: [
    AddFormuleComponent,
    AddFormuleItemComponent
  ],
  providers:[HttpClientModule]
})
export class FormulesModule {}
