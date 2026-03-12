import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // Add this
import { provideHttpClient } from '@angular/common/http'; // Add this
import { routes } from './app/app.routes'; // Import your routes
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes), // This is the engine that runs the AuthGuard
    provideHttpClient()
  ]
}).catch((err) => console.error(err));