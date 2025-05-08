import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';




bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),provideAnimations(), provideCharts(withDefaultRegisterables()),
    provideHttpClient(withFetch()) ]  
}).catch((err) => console.error(err));


