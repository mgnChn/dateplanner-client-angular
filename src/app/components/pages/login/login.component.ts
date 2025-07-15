import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';
  hasError = false;

  constructor(private authService: AuthService) {
  }
  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          console.log('Login successful - login component.ts');
          this.hasError = false;

        } else {
          this.showError();
          alert('Login failed. Please check your credentials.');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.showError();
        alert('Login failed. Please try again.');
      }
    });
  }

  private showError(): void {
    this.hasError = true;
  }

  // Clear error state when user starts typing
  onInputChange(): void {
    this.hasError = false;
  }
}
