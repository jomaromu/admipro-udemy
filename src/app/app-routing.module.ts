import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// modulo de rutas
import { PagesModule } from './pages/pages.module';

// componentes
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), PagesModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
