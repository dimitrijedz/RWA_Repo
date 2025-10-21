import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PollDetailComponent } from './components/poll-detail/poll-detail.component';
import { PollCreateComponent } from './components/poll-create/poll-create.component';
import { PollEditComponent } from './components/poll-edit/poll-edit.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'polls/:id', component: PollDetailComponent },
  { path: 'create', component: PollCreateComponent },
  { path: 'polls/:id/edit', component: PollEditComponent },
  { path: 'user/edit', component: UserEditComponent },
];
