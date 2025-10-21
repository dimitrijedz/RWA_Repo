import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  auth = inject(AuthService);

  email = '';
  username = '';
  password = '';
  error = signal<string | null>(null);

  submit() {
    this.auth.register({ email: this.email, username: this.username, password: this.password })
      .pipe(
        catchError(err => {
          this.error.set('Registration failed');
          return of(null);
        })
      )
      .subscribe();
  }
}
