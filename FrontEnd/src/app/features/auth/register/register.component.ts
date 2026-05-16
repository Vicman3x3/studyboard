import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
  };
  readonly errorMessage = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al registrar usuario'
        );
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
