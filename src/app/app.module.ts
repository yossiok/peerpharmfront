import { HttpClientModule, HttpClient } from "@angular/common/http";
import { AuthService } from "./services/auth.service";
import { ExcelService } from "./services/excel.service";
import { AlertModalComponent } from "./component/alert-modal/alert-modal.component";
import { SignupComponent } from "./shared/auth/signup.component";
import { LoginComponent } from "./shared/auth/login.component";

import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy,
} from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
//

//

import { FullComponent } from "./layouts/full/full.component";
import { BlankComponent } from "./layouts/blank/blank.component";

import { NavigationComponent } from "./shared/header-navigation/navigation.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { BreadcrumbComponent } from "./shared/breadcrumb/breadcrumb.component";

import { Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";
//import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular'

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OverlayModule } from "@angular/cdk/overlay";
import { ScheduleCardComponent } from "./peerpharm/production/production/schedule-card/schedule-card.component";
import { MyiframeComponent } from "./myiframe/myiframe.component";
import { ToastrModule } from "ngx-toastr";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { NgxBarcodeModule } from "ngx-barcode";
import { TestPipePipe } from "./pipes/test-pipe.pipe";
import { ConfirmModalComponent } from "./services/confirm.modal.service";
import { OrdersService } from "./services/orders.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandlerService } from "./services/error-handler.service";
import { ConfirmModalSMSComponent } from "./services/confirmsms.modal.service";
import { LanguageSelectorComponent } from './shared/language-selector/language-selector.component';
import { LanguageService } from "./services/language.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20,
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    ScheduleCardComponent,
    MyiframeComponent,
    TestPipePipe,
    ConfirmModalComponent,
    AlertModalComponent,
    ConfirmModalSMSComponent,
    LanguageSelectorComponent,
  ],
  entryComponents: [ConfirmModalComponent, ConfirmModalSMSComponent],
  imports: [
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: LanguageService,
        deps: [HttpClient],
      },
    }),
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      titleClass: "h4",
      preventDuplicates: true,
    }),
    HttpClientModule,
    FormsModule,
    NgbModule,
    OverlayModule,
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    PerfectScrollbarModule,
    NgxBarcodeModule.forRoot(),
  ],
  providers: [
    OrdersService,
    MatSnackBar,

    AuthService,
    HttpClientModule,
    ExcelService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private translate: TranslateService,  private language: LanguageService) {
    translate.addLangs(["en", "he"]);
    translate.setDefaultLang(localStorage.getItem('lang') || "en");
    translate.use(localStorage.getItem('lang') || "en");
  }

}


declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}
