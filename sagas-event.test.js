import { runSaga } from 'redux-saga';
import { put, delay, take, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { createEventChannel, watchIdleTimer, startIdleTimer, watchCountdown, countdown, watchUserActivity } from './sagas';
import * as actions from './actions';

describe('sagas', () => {
  describe('startIdleTimer saga', () => {
    it('should wait for IDLE_TIMEOUT and dispatch timeout actions', async () => {
      const dispatched = [];
      const saga = startIdleTimer();

      const delayEffect = saga.next().value;
      expect(delayEffect).toEqual(delay(60000));

      const timeoutEffect = saga.next().value;
      expect(timeoutEffect).toEqual(put(actions.timeout()));

      const startCountdownEffect = saga.next().value;
      expect(startCountdownEffect).toEqual(put(actions.startCountdown()));
    });
  });

  describe('countdown saga', () => {
    it('should decrement countdown every second and stop when countdown is 0', async () => {
      const initialState = { idle: { countdown: 3 } };
      const dispatched = [];

      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => initialState,
        },
        countdown
      ).toPromise();

      expect(dispatched).toEqual([
        { type: actions.DECREMENT_COUNTDOWN },
        { type: actions.DECREMENT_COUNTDOWN },
        { type: actions.DECREMENT_COUNTDOWN },
      ]);
    });
  });

  describe('watchIdleTimer saga', () => {
    it('should start and reset idle timer on corresponding actions', async () => {
      const saga = watchIdleTimer();
      const startIdleTask = saga.next().value;

      expect(startIdleTask).toEqual(take(actions.START_IDLE_TIMER));
    });
  });

  describe('watchUserActivity saga', () => {
    it('should create an event channel and handle user activity events', async () => {
      const channel = createEventChannel();
      const saga = watchUserActivity();

      const channelEffect = saga.next().value;
      expect(channelEffect).toEqual(call(createEventChannel));

      const takeEffect = saga.next(channel).value;
      expect(takeEffect).toEqual(take(channel));
    });
  });
});
