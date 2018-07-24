import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'; 

import {MatSelectModule} from '@angular/material/select';
import {
  MatDialogModule,
  MatGridListModule,
  MatMenuModule,
  MatButtonModule,
  MatTooltipModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatTabsModule,
  MatInputModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DndModule } from 'ng2-dnd';
import { DatepickerModule } from 'angular2-material-datepicker';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './core/nav/nav.component';
import { BoardComponent } from './board/board.component';
import { TaskCardComponent } from './board/shared/task-card/task-card.component';
import { ContentComponent } from './core/content/content.component';
import { CreateBoardComponent } from './board/create-board/create-board.component';
import { SubtaskComponent } from './subtask/subtask.component';
import { SubTaskCardComponent } from './board/shared//sub-task-card/sub-task-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BoardComponent,
    TaskCardComponent,
    ContentComponent,
    CreateBoardComponent,
    SubtaskComponent,
    SubTaskCardComponent,
  ],
  imports: [
    RouterModule.forRoot([
      {path:"" , component:ContentComponent },
      {path:"subcard" , component:SubTaskCardComponent }
    ]), 
    BrowserModule,
    FormsModule,
    HttpModule,
    MatDialogModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    DndModule.forRoot(),
    DatepickerModule,
    Ng2FilterPipeModule,
    MatSelectModule
  ],
  exports: [DndModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class TaskModule {}
