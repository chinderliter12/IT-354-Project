import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: ` 
  <label for="username">
    Username:<br>
    <input id="username" type="text" [(ngModel)]="userInput" placeholder="JohnSmith123"/>
  </label><br><br>
  <label for="password">
    Password:<br>
  <input id="password" type="text" [(ngModel)]="passInput" placeholder="Password123!"/>
  <br><br><button (click)="login()">Sign In</button>
  `,

imports: [FormsModule, RouterLink],

})

export class Login {
  userInput = '';
  passInput = '';
  private router = inject(Router);

  login() {
    //Call to database to make sure username/email is not taken
    //Then post new account

    this.router.navigate(['/'], {
      queryParams: {
        role: 'student',
        id: '1',
      }
    })
  }
}