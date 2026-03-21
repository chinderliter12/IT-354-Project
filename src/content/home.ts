import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: ` <div>Home Page</div><br>
    <input id="searchBox" type="text" [(ngModel)]="searched" placeholder="Search a course..."/> / 
    <button (click) = "searchCourse()">Search</button>

    @if (searched!='') {
      <p>Searching... {{ searched }} </p>
    }
  `,
  imports: [FormsModule, RouterLink],
})

export class Home {
  searched = '';
  private router = inject(Router);

  searchCourse() {
    this.router.navigate(['/appointments'], {
      queryParams: {
        id: '1',
        searchId: 'searchin it',
      }
    })
  }
}

//route parameters for search items