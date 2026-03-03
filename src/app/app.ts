import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router'; // Added NavigationEnd
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { filter } from 'rxjs/operators'; // Added filter

// Declare gtag as a global function so TypeScript doesn't throw an error
declare let gtag: Function;

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, Header, RouterLinkActive, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('la-hermosa');
  
  private router = inject(Router);

  ngOnInit() {
    // 1. Existing security check for direct URL entry
    const currentPath = window.location.pathname;
    const token = localStorage.getItem('token');

    if (currentPath.includes('/admin/dashboard') && !token) {
      this.router.navigate(['/admin/login']);
    }

    // 2. Added Google Analytics Page Tracking Logic
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (typeof gtag !== 'undefined') {
        gtag('config', 'G-XXXXXXXXXX', { // <--- REPLACE WITH YOUR ACTUAL G-ID
          'page_path': event.urlAfterRedirects
        });
      }
    });
  }
}