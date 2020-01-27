import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

// guards
import { LoginGuardGuard } from '../services/guards/login-guard.guard';


const pagesRoutes: Routes = [
    {
        // path: 'pages',
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuardGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard'} },
          { path: 'progress', component: ProgressComponent, data: {titulo: 'Progess'}  },
          { path: 'graficas1', component: Graficas1Component, data: {titulo: 'Gráficas'}  },
          { path: 'promesas', component: PromesasComponent, data: {titulo: 'Ajustes del tema'}  },
          { path: 'account-settings', component: AccountSettingsComponent , data: {titulo: 'RxJs'} },
          { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Dashboard'}  },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
      }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
