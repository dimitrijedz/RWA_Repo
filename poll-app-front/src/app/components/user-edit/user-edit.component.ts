import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, of, take } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);

  username = '';
  email = '';
  error = signal<string | null>(null);

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.username = user.username || '';
        this.email = user.email || '';
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          this.username = userObj.username || '';
          this.email = userObj.email || '';
        }
      }
    });
  }

  submit() {
    if (!this.username.trim() || !this.email.trim()) {
      this.error.set('Username and email are required');
      return;
    }

    this.auth.updateProfile({ username: this.username, email: this.email })
      .pipe(
        catchError(err => {
          this.error.set('Failed to update profile');
          return of(null);
        }),
        take(1)
      )
      .subscribe(updated => {
        if (updated) {
          localStorage.setItem('user', JSON.stringify(updated));
          this.auth.setUser(updated);
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
