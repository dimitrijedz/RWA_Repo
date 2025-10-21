import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Poll } from '../../models/poll.model';
import { catchError, of, Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

interface PollResults {
  options: string[];
  results: { [key: number]: number };
}

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css']
})
export class PollDetailComponent implements OnInit {
  api = inject(ApiService);
  route = inject(ActivatedRoute);

  poll = signal<Poll | null>(null);
  results = signal<{ option: string; votes: number }[]>([]);
  votedOptionIndex: number | null = 0;
  error = signal<string | null>(null);
  currentUser = signal<any>(null);

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) this.currentUser.set(JSON.parse(storedUser));

    const pollId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPoll(pollId);
  }

  /*loadPoll(pollId: number) {
    this.api
      .getPoll(pollId)
      .pipe(
        catchError((err) => {
          this.error.set('Failed to load poll');
          return of(null);
        })
      )
      .subscribe((poll) => {
        if (poll) {
          this.poll.set(poll);
          this.loadResults(poll.id);
        }
      });
  }*/

  loadPoll(pollId: number): void {
    const poll$: Observable<Poll | null> = (this.api.getPoll(pollId) as Observable<Poll>).pipe(
      catchError(err => {
        this.error.set('Failed to load poll');
        return of(null);
      })
    );

    const results$: Observable<PollResults> = (this.api.getResults(pollId) as Observable<PollResults>).pipe(
      catchError(err => {
        this.error.set('Failed to load results');
        return of({ options: [], results: {} });
      })
    );

    forkJoin({
      poll: poll$,
      results: results$
    }).subscribe(({ poll, results }) => {
      if (!poll) return;

      this.poll.set(poll);
      const mapped = (results.options ?? []).map((opt: string, i: number) => ({
        option: opt,
        votes: results.results?.[i] ?? 0,
      }));

      this.results.set(mapped);
    });
  }

  loadResults(pollId: number) {
    this.api
      .getResults(pollId)
      .pipe(
        catchError((err) => {
          this.error.set('Failed to load results');
          return of({ options: [], results: {} });
        })
      )
      .subscribe((res: any) => {
        const options: string[] = res.options ?? [];
        const resultsObj: Record<number, number> = res.results ?? {};
        const mapped = options.map((opt, i) => ({
          option: opt,
          votes: resultsObj[i] ?? 0,
        }));
        this.results.set(mapped);
      });
  }

  hasVoted(): boolean {
    const user = this.currentUser();
    const pollData = this.poll();
    if (!user || !pollData) return false;
    return pollData.votes?.some((v) => v.user?.id === user.id) ?? false;
  }

  vote() {
    const currentPoll = this.poll();
    const user = this.currentUser();

    if (!currentPoll || !user) {
      this.error.set('Cannot vote at this time.');
      return;
    }

    if (this.hasVoted()) {
      this.error.set('You have already voted.');
      return;
    }

    if (this.votedOptionIndex === null) {
      this.error.set('Please select an option.');
      return;
    }

    this.api
      .vote(currentPoll.id, this.votedOptionIndex)
      .pipe(
        catchError((err) => {
          this.error.set('Failed to vote');
          return of(null);
        })
      )
      .subscribe((voteResponse) => {
        if (!voteResponse) return;
        this.loadPoll(currentPoll.id);
        this.votedOptionIndex = 0;
      });
    }
}
