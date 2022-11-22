import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipFormComponent } from './membership-form/membership-form.component';
import { LoginMembFormComponent } from './login-memb-form/login-memb-form.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

const routes: Routes = [{path:'register',component:MembershipFormComponent},
{path:'login',component:LoginMembFormComponent},{path:'anganwadi',component:AdminPageComponent},{path:'admin',loadChildren:()=>import('./main-admin/main-admin.module').then(m=>m.MainAdminModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
