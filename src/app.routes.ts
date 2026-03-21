import {Routes} from '@angular/router';

import {Home} from './content/home';
import {User} from './content/user';
import {Hours} from './content/hours';
import {Session} from './content/session';
import {Appointments} from './content/appointments';
import {Login} from './login/login';
import {Register} from './login/register';

export const routes: Routes = [
  {
    path: '',
    title: 'Home Page',
    component: Home,
  },
  {
    path: 'user',
    title: 'Account Page',
    component: User,
  },
  {
    path: 'hours',
    title: 'Hours Page',
    component: Hours,
  },
  {
    path: 'session',
    title: 'Session Page',
    component: Session,
  },
  {
    path: 'appointments',
    title: 'Appointments Page',
    component: Appointments,
  },
  {
    path: 'login',
    title: 'Login Page',
    component: Login,
  }, 
  {
    path: 'register',
    title: 'Register Page',
    component: Register,
  }
];