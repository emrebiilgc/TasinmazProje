import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        this.authService.saveToken(token);
        this.router.navigate(['/property-list']);
      },
      error: () => {
        this.errorMessage = 'E-posta veya şifre hatalı.';
      }
    });
  }
}
