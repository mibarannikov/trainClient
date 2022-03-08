import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material-module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {authInterceptorProviders} from "./helper/auth-interceptor.service";
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {IndexComponent} from './layout/index/index.component';
import {BuyTicketComponent} from './layout/ticket/buy-ticket/buy-ticket.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";

import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {ProfileComponent} from './layout/profile/profile.component';
import {AddstationComponent} from './layout/admin/addstation/addstation.component';
import {MatSelectModule} from "@angular/material/select";
import {AddTrainComponent} from './layout/admin/add-train/add-train.component';
import {MatFormFieldControl} from "@angular/material/form-field";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {NgxMatMomentModule} from "@angular-material-components/moment-adapter";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
    IndexComponent,
    BuyTicketComponent,
    ProfileComponent,
    AddstationComponent,
    AddTrainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatOptionModule,
    MatSelectModule,
    MatDatetimepickerModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMatMomentModule




  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
