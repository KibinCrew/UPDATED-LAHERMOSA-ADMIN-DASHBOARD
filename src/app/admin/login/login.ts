import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginData = { username: '', password: '' };

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/admin/dashboard']); 
      },
      error: (err) => {
        alert('Login failed: ' + (err.error?.message || 'Server error'));
      }
    });
  }
}