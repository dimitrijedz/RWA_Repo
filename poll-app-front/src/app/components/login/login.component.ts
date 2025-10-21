import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  auth = inject(AuthService);

  email = '';
  password = '';
  error = signal<string | null>(null);

  submit() {
    this.auth.login(this.email, this.password)
      .pipe(
        catchError(err => {
          this.error.set('Invalid email or password');
          return of(null);
        })
      )
      .subscribe();
  }
}
