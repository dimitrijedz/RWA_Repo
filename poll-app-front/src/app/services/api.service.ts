import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, switchMap } from 'rxjs';
import { Poll } from '../models/poll.model';

export interface VoteDto {
  chosenOptionIndex: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/polls';

  getAllPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.baseUrl);
  }

  getPoll(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.baseUrl}/${id}`);
  }

  createPoll(question: string, options: string[], expiresAt?: string): Observable<Poll> {
    return this.http.post<Poll>(this.baseUrl, { question, options, expiresAt });
  }

  vote(pollId: number, chosenOptionIndex: number) {
    return this.http.post(`${this.baseUrl}/${pollId}/vote`, { chosenOptionIndex });
  }

  getResults(pollId: number) {
    return this.http.get(`${this.baseUrl}/${pollId}/results`);
  }

  deletePoll(pollId: number) {
    return this.http.delete(`${this.baseUrl}/${pollId}`);
  }

  updatePoll(id: number, question: string, options: string[], expiresAt?: string) {
    return this.http.patch<Poll>(`${this.baseUrl}/${id}`, { question, options, expiresAt });
  }

  refreshAfterVote(pollId: number) {
    const vote$ = this.vote(pollId, 0);
    const results$ = this.getResults(pollId);
    return merge(vote$, results$).pipe(switchMap(() => this.getPoll(pollId)));
  }
}
