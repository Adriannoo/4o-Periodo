import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import {FluxoCaixa} from './pages/fluxo-caixa/fluxo-caixa';
import {Relatorios} from './pages/relatorios/relatorios';
import {GestaoAcessos} from './pages/gestao-acessos/gestao-acessos';
import {Conta} from './pages/conta/conta';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'conta', component: Conta },
      { path: 'fluxo-caixa', component: FluxoCaixa },
      { path: 'relatorios', component: Relatorios },
      { path: 'gestao-acessos', component: GestaoAcessos },
    ]
  }
];
