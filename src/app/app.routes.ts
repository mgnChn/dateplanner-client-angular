import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { AboutComponent } from './components/pages/about/about.component';
import { CalendarComponent } from './components/user/calendar/calendar.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { PlanComponent } from './components/user/plan/plan.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'about', component: AboutComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'plan', component: PlanComponent },
    { path: '**', component: NotFoundComponent },
];
