import { createAction, props } from '@ngrx/store';
import { Poll } from '../models/poll.model';


export const loadPolls = createAction('[Poll] Load Polls');
export const loadPollsSuccess = createAction('[Poll] Load Polls Success', props<{ polls: Poll[] }>());


export const loadPoll = createAction('[Poll] Load Poll', props<{ id: number }>());
export const loadPollSuccess = createAction('[Poll] Load Poll Success', props<{ poll: Poll }>());


export const createPoll = createAction('[Poll] Create Poll', props<{ payload: { question: string; options: string[]; expiresAt?: string | null } }>());
export const createPollSuccess = createAction('[Poll] Create Poll Success', props<{ poll: Poll }>());


export const voteOnPoll = createAction('[Poll] Vote', props<{ pollId: number; chosenOptionIndex: number }>());
export const voteSuccess = createAction('[Poll] Vote Success', props<{ pollId: number; result: any }>());