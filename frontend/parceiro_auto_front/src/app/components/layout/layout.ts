import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = computed(() => this.authService.getUsuarioLogado());

  initialsUsuario = computed(() => {
    const u = this.usuario();
    if (!u) return '';
    const partes = u.nome.split(' ');
    const firstLetter = partes[0]?.[0] ?? '';
    const secondLetter = partes[1]?.[0] ?? '';
    return (firstLetter + secondLetter).toUpperCase();
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}