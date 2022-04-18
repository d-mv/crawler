import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { append } from 'ramda';

import { Results } from 'src/models';
import { INITIAL_APP_STATE } from './app.model';
import { RootState } from '..';

export const slice = createSlice({
  name: 'app',
  initialState: INITIAL_APP_STATE,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    addMessage: (state, action: PayloadAction<string>) => {
      state.messages = append(action.payload, state.messages);
    },
    setMessages: (state, action: PayloadAction<string[]>) => {
      state.messages = action.payload;
    },
    setResults: (state, action: PayloadAction<Results | undefined>) => {
      state.results = action.payload;
    },
  },
});

export const getMessages = (state: RootState) => state.app.messages;

export const getResults = (state: RootState) => state.app.results;

export const { setIsReady, addMessage, setMessages, setResults } = slice.actions;

export default slice.reducer;
