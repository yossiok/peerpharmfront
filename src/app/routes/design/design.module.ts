import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignRoutingModule } from './design-routing.module';
import { DesignComponent } from './design/design.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DesignComponent
  ],
  imports: [
    CommonModule,
    DesignRoutingModule,
    SharedModule,
  ]
})
export class DesignModule { }
