import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import {ExcelService} from './services/excel.service';

import { SignupComponent } from './shared/auth/signup.component';
import { LoginComponent } from './shared/auth/login.component';
import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
//
import {NeworderComponent} from './peerpharm/allorders/neworder/neworder.component'
import {OrderdetailsComponent} from './peerpharm/allorders/orderdetails/orderdetails.component'
import {OrdersComponent} from './peerpharm/allorders/orders/orders.component'
import { AllordersComponent } from './peerpharm/allorders/allorders/allorders.component';

//
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
//import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular'

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'; 
import { ContentComponent } from './peerpharm/taskboard/core/content/content.component';
import { MatSnackBar } from '@angular/material';
import { OVERLAY_PROVIDERS } from '../../node_modules/@angular/cdk/overlay';
import { ScheduleCardComponent } from './peerpharm/production/production/schedule-card/schedule-card.component';
import { MyiframeComponent } from './myiframe/myiframe.component';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TestPipePipe } from './pipes/test-pipe.pipe';
import { PackingComponent } from './peerpharm/schedule/packing/packing.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent, 
    NavigationComponent,
    BreadcrumbComponent,  
    SidebarComponent , 
    LoginComponent, 
    
    SignupComponent, ScheduleCardComponent, MyiframeComponent, TestPipePipe, 
   
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    HttpClientModule,
    FormsModule,    
   // AmplifyAngularModule   ,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(Approutes, { useHash: false }),
    PerfectScrollbarModule,
  ],
  providers: [
    MatSnackBar,
    OVERLAY_PROVIDERS,
   // AmplifyService,
   OVERLAY_PROVIDERS,

    AuthService,HttpClientModule,ExcelService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
