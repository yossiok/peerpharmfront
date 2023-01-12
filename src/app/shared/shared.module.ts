import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';
import { ProcessBoxComponent } from './components/process-box/process-box.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    ProcessBoxComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ProcessBoxComponent,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    };
  }
}

