import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAdminRoutingModule } from './main-admin-routing.module';
import { PaymentConfirmComponent } from './payment-confirm/payment-confirm.component';
import { DistWiseConfirmComponent } from './dist-wise-confirm/dist-wise-confirm.component';
import { GlGenerationComponent } from './gl-generation/gl-generation.component';
import { DownloadDetailsComponent } from './download-details/download-details.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PaymentConfirmComponent,
    DistWiseConfirmComponent,
    GlGenerationComponent,
    DownloadDetailsComponent,
    AdminManagementComponent
  ],
  imports: [
    CommonModule,
    MainAdminRoutingModule,FormsModule
  ]
})
export class MainAdminModule { }
