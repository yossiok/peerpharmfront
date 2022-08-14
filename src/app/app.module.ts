import { HttpClientModule, HttpClient } from "@angular/common/http";
import { AuthService } from "./services/auth.service";
import { ExcelService } from "./services/excel.service";
import { AlertModalComponent } from "./component/alert-modal/alert-modal.component";
import { SignupComponent } from "./shared/auth/signup.component";
import { LoginComponent } from "./shared/auth/login.component";
import * as $ from "jquery";

import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy,
} from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Routes, RouterModule } from "@angular/router";
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
import { ContentComponent } from "./peerpharm/taskboard/core/content/content.component";
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
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgxBarcodeModule } from "ngx-barcode";
import { TestPipePipe } from "./pipes/test-pipe.pipe";
import { ConfirmModalComponent } from "./services/confirm.modal.service";
import { OrdersService } from "./services/orders.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandlerService } from "./services/error-handler.service";
import { ConfirmModalSMSComponent } from "./services/confirmsms.modal.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20,
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
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    ScheduleCardComponent,
    MyiframeComponent,
    TestPipePipe,
    ConfirmModalComponent,
    AlertModalComponent,
    ConfirmModalSMSComponent,
  ],
  entryComponents: [ConfirmModalComponent, ConfirmModalSMSComponent],
  imports: [
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
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
  constructor(private translate: TranslateService) {
    translate.setTranslation("he", {
      test: "בדיקה",
      Item: "פריט",
      Barcode: "ברקוד",
      Sticker: "מדבקה",
      Box: "קופסה",
      Product: "מוצר",
      Sub: "חלופי",
      Description: "תיאור",
      Jumping: "קופצת",
      Remarks: "הערה",
      Tree: "עץ",
      Main: "ראשית",
      Picture: "תמונה",
      Production: "ייצור",
      General: "מרכזי",
      Components: "קומפוננטות",
      Pictures: "תמונות",
      Specifications: "ספסיפיקציות",
      Language: "שפה",
      Department: "מחלקה",
      Volume: "נֶפַח",
      ml: "(מל)",
      Net: "נטו",
      Weight: "משקל",
      gr: "(גר)",
      Gross: "ברוטו",
      Unit: "יחידה",
      Units: "יחידות",
      Status: "סטטוס",
      Carton: "קרטונים",
      Pallet: "משטח",
      License: "רישיון",
      Pump: "משאבה",
      Direction: "כיוונים",
      Number: "מספר",
      Pcs: "חתיכות",
      Type: "סוגים",
      Right: "ימין",
      Left: "שמאל",
      Exp: "תפוגה",
      Date: "תאריך",
      Shades: "צללים",
      Used: "משומש",
      Years: "שנים",
      Untill: "עד",
      Plates: "גלופות",
      Total: "סך הכל",
      Plate: "גלופה",
      Other: "אחר",
      Layer: "שכבה",
      First: "ראשונה",
      Peerpharm: "פאר פארם",
      Tone: "גוון",
      Mother: "אם(אמא)",
      Schedule: 'לו"ז',
      Component: "קומפוננטה",
      File: "קובץ",
      Upload: "העלאת",
      Wgt: "משקל",
      Title: "כותרת",
      PAO: "חודשים לשימוש לאחר פתיחה",
      Single: "בודדה",
      Set: "סט",
      In: "ב",
      Of: "של",
      Multiply:"הכפלה"
    });

    translate.setTranslation("en", {
      Item: "Item",
      Barcode: "Barcode",
      Sticker: "Sticker",
      Box: "Box",
      Product: "Product",
      Sub: "Sub",
      Description: "Description",
      Jumping: "Jumping",
      Remarks: "Remarks",
      Tree: "Tree",
      Main: "Main",
      Picture: "Picture",
      Production: "Production",
      General: "General",
      Components: "Components",
      Pictures: "Pictures",
      Specifications: "Specifications",
      Language: "Language",
      Department: "Department",
      Volume: "Volume",
      ml: "ml",
      Net: "Net",
      Weight: "Weight",
      gr: "gr",
      Gross: "Gross",
      Unit: "Unit",
      Units: "Units",
      Status: "Status",
      Carton: "Carton",
      Pallet: "Pallet",
      License: "License",
      Pump: "Pump",
      Direction: "Direction",
      Number: "Number",
      Pcs: "Pcs",
      Type: "Type",
      Right: "Right",
      Left: "Left",
      Exp: "Exp",
      Date: "Date",
      Shades: "Shades",
      Used: "Used",
      Years: "Years",
      Untill: "Untill",
      Plates: "Plates",
      Total: "Total",
      Plate: "Plate",
      Other: "Other",
      Layer: "Layer",
      First: "First",
      Peerpharm: "Peerpharm",
      Tone: "Tone",
      Mother: "Mother",
      Schedule: "Schedule",
      Component: "Component",
      File: "File",
      Upload: "Upload",
      Wgt: "Wgt",
      Title: "Title",
      PAO: "PAO",
      Single: "Single",
      Set: "Set",
      In: "In",
      Of: "Of",
      Multiply:"Multiply"
    });

    translate.addLangs(["en", "he"]);
    translate.setDefaultLang("he");
    translate.use("en");
  }
}

declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}
