import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// src/styles.css - add PrimeNG themes and your custom styles
