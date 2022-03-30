import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {IndexComponent} from "./layout/index/index.component";
import {AuthGuardService} from "./helper/auth-guard.service";
import {BuyTicketComponent} from "./layout/ticket/buy-ticket/buy-ticket.component";
import {ProfileComponent} from "./layout/profile/profile.component";
import {AddstationComponent} from "./layout/admin/addstation/addstation.component";
import {AuthAdminGuardService} from "./helper/auth-admin-guard.service";
import {AddTrainComponent} from "./layout/admin/add-train/add-train.component";
import {ShowTrainsComponent} from "./layout/admin/show-trains/show-trains.component";
import {ShowPassengersComponent} from "./layout/admin/show-passengers/show-passengers.component";
import {WagonSelectionComponent} from "./layout/ticket/wagon-selection/wagon-selection.component";
import {EditTrainComponent} from "./layout/admin/show-trains/edit-train/edit-train.component";


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'main', component:IndexComponent },
  {path: 'wagons',component:WagonSelectionComponent},
  {path:'ticket', component: BuyTicketComponent,canActivate:[AuthGuardService]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuardService]},
  {path: 'addstation', component: AddstationComponent, canActivate:[AuthAdminGuardService]},
  {path: 'addtrain', component: AddTrainComponent, canActivate:[AuthAdminGuardService]},
  {path:'trains', component:ShowTrainsComponent, canActivate:[AuthAdminGuardService]},
  {path:'edittrain', component:EditTrainComponent, canActivate:[AuthAdminGuardService]},
  {path:'passengers', component:ShowPassengersComponent, canActivate:[AuthAdminGuardService]},
  {path:'',redirectTo: 'main', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
