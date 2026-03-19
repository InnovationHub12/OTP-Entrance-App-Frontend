import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
 currentRoute: string = '';

  constructor(private router: Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  isAdminView(): boolean {
    return this.currentRoute.includes('/admin')||
      this.currentRoute.includes('/add-admin') ||
      this.currentRoute.includes('/state-vehicle');
  }

  isSecurityView(): boolean {
    return (
      this.currentRoute.includes('/state-entry')
    );
  }

}
