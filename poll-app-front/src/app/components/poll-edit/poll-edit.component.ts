import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-poll-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './poll-edit.component.html',
  styleUrls: ['./poll-edit.component.css']
})
export class PollEditComponent implements OnInit {
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  poll = signal<any>(null);
  question = '';
  options: { text: string }[] = [{ text: '' }];
  expiresAt: string | null = null;
  error = signal<string | null>(null);

  ngOnInit() {
    const pollId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getPoll(pollId)
      .pipe(
        catchError(err => {
          this.error.set('Failed to load poll');
          return of(null);
        })
      )
      .subscribe(poll => {
        if (poll) {
          this.poll.set(poll);
          this.question = poll.question;
          this.options = poll.options.map((opt: string) => ({ text: opt }));
          if (poll.expiresAt) {
            const d = new Date(poll.expiresAt);
            this.expiresAt = d.toISOString().slice(0, 16);
          } else {
            this.expiresAt = null;
          }
        }
      });
  }

  addOption() {
    this.options.push({ text: '' });
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  submit() {
    const validOptions = this.options.map(o => o.text).filter(o => o.trim() !== '');
    if (!this.question.trim() || validOptions.length === 0) {
      this.error.set('Question and at least one option are required');
      return;
    }

    this.api.updatePoll(
      this.poll().id,
      this.question,
      validOptions,
      this.expiresAt ?? undefined
    )
      .pipe(
        catchError(err => {
          this.error.set('Failed to update poll');
          return of(null);
        })
      )
      .subscribe(updated => {
        if (updated) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
