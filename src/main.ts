<<<<<<< HEAD
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
=======
import { Component} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { RouterOutlet, RouterLink } from '@angular/router';

import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `

    <nav>
      <a routerLink="/">Home</a>
      | <a routerLink="/user">User</a>
      | <a routerLink="/hours">Hours</a>
      | <a routerLink="/session">Session</a>
      | <a routerLink="/login">Log In</a>
      | <a routerLink="/register">Sign Up</a>
    </nav>
    <br>
    <router-outlet />
  `,
  imports: [RouterOutlet, RouterLink],
})
export class App {}

bootstrapApplication(App, {
  providers: [provideRouter(routes)],
});
>>>>>>> 4f355a49104eb8d5e0539b81c97eb8c8f9cd6d9c
