import { LoginComponent } from "./shared/auth/login.component";
import { Routes } from "@angular/router";
import { FullComponent } from "./layouts/full/full.component";
import { UserloggedinGuard } from "./guards/userloggedin.guard";
import { SignupComponent } from "./shared/auth/signup.component";
import { MyiframeComponent } from "./myiframe/myiframe.component";
import { LayoutComponent } from "./layouts/layout/layout.component";

export const Approutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "",
    component: FullComponent,
    canActivate: [UserloggedinGuard],
    children: [
      { path: "", redirectTo: "/starter", pathMatch: "full" },
      {
        path: "starter",
        loadChildren: "./starter/starter.module#StarterModule",
      },
      {
        path: "component",
        loadChildren: "./component/component.module#ComponentsModule",
      },
      {
        path: "peerpharm",
        loadChildren: "./peerpharm/peerpharmmodule#PeerPharmModule",
      },
      /*   {
        path: 'taskboard',
        loadChildren: './peerpharm/taskboard/app.module#TaskModule'
      }*/
      {
        path: "batch",
        component: MyiframeComponent,
      }
    ],
  },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [UserloggedinGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: "./routes/dashboard/dashboard.module#DashboardModule",
      },
      {
        path: "design",
        loadChildren: "./routes/design/design.module#DesignModule",
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/starter",
  },
];
