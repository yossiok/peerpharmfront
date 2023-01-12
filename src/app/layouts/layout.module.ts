import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { AvatarComponent } from './layout/header/avatar/avatar.component';
import { CompanyAvatarComponent } from './layout/sidebar/company-avatar/company-avatar.component';
import { TitleComponent } from './layout/header/title/title.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoaderComponent,
    AvatarComponent,
    CompanyAvatarComponent,
    TitleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    LayoutComponent,
  ]
})
export class LayoutModule { }
