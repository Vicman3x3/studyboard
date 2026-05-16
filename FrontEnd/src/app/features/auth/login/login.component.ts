import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginData: LoginRequest = { email: '', password: '' };
  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al iniciar sesión'
        );
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
