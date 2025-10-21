import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Poll } from '../models/poll.model';
import * as PollActions from './poll.actions';


export interface PollState extends EntityState<Poll> {
    selectedPollId: number | null;
}


export const adapter = createEntityAdapter<Poll>();
export const initialState: PollState = adapter.getInitialState({ selectedPollId: null });


export const pollReducer = createReducer(
    initialState,
    on(PollActions.loadPollsSuccess, (state, { polls }) => adapter.setAll(polls, state)),
    on(PollActions.loadPollSuccess, (state, { poll }) => adapter.upsertOne(poll, { ...state, selectedPollId: poll.id })),
    on(PollActions.createPollSuccess, (state, { poll }) => adapter.addOne(poll, state))
);


export const { selectAll } = adapter.getSelectors();