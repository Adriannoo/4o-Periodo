import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { Layout } from './components/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { FluxoCaixa } from './pages/fluxo-caixa/fluxo-caixa';
import { Relatorios } from './pages/relatorios/relatorios';
import { GestaoAcessos } from './pages/gestao-acessos/gestao-acessos';
import { Conta } from './pages/conta/conta';
import { EmpresaLista } from './pages/empresa/empresa-lista/empresa-lista';
import { EmpresaForm } from './pages/empresa/empresa-form/empresa-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'conta', component: Conta },
      { path: 'fluxo-caixa', component: FluxoCaixa },
      { path: 'relatorios', component: Relatorios },
      { path: 'gestao-acessos', component: GestaoAcessos },
      {
        path: 'empresa',
        children: [
          { path: '', component: EmpresaLista },
          { path: 'nova', component: EmpresaForm },
          { path: ':id/editar', component: EmpresaForm },
        ],
      },
    ]
  }
];