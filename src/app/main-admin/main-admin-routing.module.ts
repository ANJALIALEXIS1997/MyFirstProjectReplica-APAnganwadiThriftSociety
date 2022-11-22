import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentConfirmComponent } from './payment-confirm/payment-confirm.component';
import { DistWiseConfirmComponent } from './dist-wise-confirm/dist-wise-confirm.component';
import { GlGenerationComponent } from './gl-generation/gl-generation.component';
import { DownloadDetailsComponent } from './download-details/download-details.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
// all these path are assigned in header.component.html and assigned in routerLink
const routes: Routes = [{path:'payment_confirm',component:PaymentConfirmComponent},
{path:'dist_wise_confirm',component:DistWiseConfirmComponent},
{path:'gl_generation',component:GlGenerationComponent},
{path:'download_details',component:DownloadDetailsComponent},
{path:'admin_management',component:AdminManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainAdminRoutingModule { }
