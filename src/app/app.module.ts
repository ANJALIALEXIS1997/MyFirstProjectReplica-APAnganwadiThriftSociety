import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule}from '@angular/forms';
import { AppComponent } from './app.component';
import { MembershipFormComponent } from './membership-form/membership-form.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginMembFormComponent } from './login-memb-form/login-memb-form.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MembershipFormComponent,
    LoginMembFormComponent,
    HeaderComponent,
    FooterComponent,
    AdminPageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,NgbModule,FormsModule,ReactiveFormsModule,HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
