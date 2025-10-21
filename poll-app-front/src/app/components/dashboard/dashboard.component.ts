import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Poll } from '../../models/poll.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  api = inject(ApiService);
  authService = inject(AuthService);

  userPolls = signal<Poll[]>([]);
  expiredUserPolls = signal<Poll[]>([]);
  allPolls = signal<Poll[]>([]);
  error = signal<string | null>(null);
  currentUser = signal<any>(null);

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }

    this.loadUserPolls();
    this.loadAllPolls();
  }

  loadUserPolls() {
    this.api.getAllPolls()
      .pipe(
        catchError(err => {
          this.error.set('Failed to load your polls');
          return of([]);
        })
      )
      .subscribe(polls => {
        const userId = this.currentUser()?.id;
        const now = new Date();

        const myActivePolls = polls
          .filter(poll => poll.user?.id === userId)
          .filter(poll => !poll.expiresAt || new Date(poll.expiresAt) > now);

        const myExpiredPolls = polls
          .filter(poll => poll.user?.id === userId)
          .filter(poll => poll.expiresAt && new Date(poll.expiresAt) <= now);

        this.userPolls.set(myActivePolls);
        this.expiredUserPolls.set(myExpiredPolls);
      });
  }

  loadAllPolls() {
    this.api.getAllPolls()
      .pipe(
        catchError(err => {
          this.error.set('Failed to load all polls');
          return of([]);
        })
      )
      .subscribe(polls => {
        const now = new Date();
        const activePolls = polls.filter(poll => !poll.expiresAt || new Date(poll.expiresAt) > now);
        this.allPolls.set(activePolls);
      });
  }

  deletePoll(pollId: number) {
    if (!confirm('Are you sure you want to delete this poll?')) return;

    this.api.deletePoll(pollId).subscribe({
      next: () => {
        const updatedPolls = this.userPolls().filter(p => p.id !== pollId);
        this.userPolls.set(updatedPolls);
      },
      error: (err) => {
        console.error('Failed to delete poll', err);
        this.error.set('Failed to delete poll');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
