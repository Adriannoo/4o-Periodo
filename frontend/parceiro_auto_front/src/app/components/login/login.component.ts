import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  senha = signal('');
  carregando = signal(false);
  erro = signal<string | null>(null);

  login(): void {
    this.erro.set(null);
    this.carregando.set(true);

    const emailValue = this.email().trim();
    const senhaValue = this.senha().trim();

    if (!emailValue || !senhaValue) {
      this.erro.set('Email e senha são obrigatórios');
      this.carregando.set(false);
      return;
    }

    this.authService.login(emailValue, senhaValue).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.carregando.set(false);
        this.erro.set(err.message);
      },
    });
  }

  limparErro(): void {
    this.erro.set(null);
  }
}
