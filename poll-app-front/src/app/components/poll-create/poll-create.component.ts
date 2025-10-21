import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-poll-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll-create.component.html',
  styleUrls: ['./poll-create.component.css']
})

export class PollCreateComponent {
  api = inject(ApiService);
  router = inject(Router);

  question = '';
  options: { text: string }[] = [{ text: '' }];
  expiresAt: string | null = null;
  error = signal<string | null>(null);

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

    this.api.createPoll(this.question, validOptions, this.expiresAt ?? undefined)
      .pipe(
        catchError(err => {
          this.error.set('Failed to create poll');
          return of(null);
        })
      )
      .subscribe(poll => {
        if (poll) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
