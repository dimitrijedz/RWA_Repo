import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PollActions from './poll.actions';
import { ApiService } from '../services/api.service';
import { switchMap, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class PollEffects {

  load$ = createEffect(() => this.actions$.pipe(
    ofType(PollActions.loadPolls),
    switchMap(() => this.api.getAllPolls()),
    map(polls => PollActions.loadPollsSuccess({ polls }))
  ));

  loadOne$ = createEffect(() => this.actions$.pipe(
    ofType(PollActions.loadPoll),
    switchMap(({ id }) => this.api.getPoll(id)),
    map(poll => PollActions.loadPollSuccess({ poll }))
  ));

  create$ = createEffect(() => this.actions$.pipe(
    ofType(PollActions.createPoll),
    switchMap(({ payload }) =>
      this.api.createPoll(payload.question, payload.options, payload.expiresAt ?? undefined)
    ),
    map(poll => PollActions.createPollSuccess({ poll }))
  ));

  vote$ = createEffect(() => this.actions$.pipe(
    ofType(PollActions.voteOnPoll),
    mergeMap(({ pollId, chosenOptionIndex }) =>
      this.api.vote(pollId, chosenOptionIndex).pipe(
        map(result => PollActions.voteSuccess({ pollId, result }))
      )
    )
  ));

  constructor(private actions$: Actions, private api: ApiService) {}
}
