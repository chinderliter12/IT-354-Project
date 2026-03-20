import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  template: ` 
  <label for="username">
    Username:<br>
    <input id="username" type="text" [(ngModel)]="userInput" placeholder="JohnSmith123"/>
  </label><br><br>
  <label for="email">
    Email:<br>
    <input id="email" type="text" [(ngModel)]="userEmail" placeholder="smithj@ilstu.edu"/>
  </label><br><br>
  <label for="password">
    Password:<br>
  <input id="password" type="text" [(ngModel)]="passInput" placeholder="Password123!"/>
  <br><br><label for="confPassword">
    Confirm Password:<br>
  <input id="confPassword" type="text" [(ngModel)]="passConfirm" placeholder="Password123!"/>
  <br><br><button (click)="register()">Register Account</button>
  `,

  imports: [FormsModule, RouterLink],

})

export class Register {
  userInput = '';
  userEmail = '';
  passInput = '';
  passConfirm = '';
  private router = inject(Router);

  register() {
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