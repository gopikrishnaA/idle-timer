import { fork } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { START_IDLE_TIMER, RESET_IDLE_TIMER, START_COUNTDOWN, DECREMENT_COUNTDOWN, CLOSE_TIMEOUT_POPUP, resetCountdown, timeout } from './actions';
import rootSaga, { startIdleTimer, countdown, watchCountdown, watchIdleTimer } from './sagas';

const IDLE_TIMEOUT = 60000; // 1 minute
const COUNTDOWN_INTERVAL = 1000; // 1 second

describe('sagas tests', () => {
  it('startIdleTimer saga test', () => {
    return expectSaga(startIdleTimer)
      .delay(IDLE_TIMEOUT)
      .put(timeout())
      .put(startCountdown())
      .run();
  });

  it('countdown saga test', () => {
    const state = { idle: { countdown: 3 } }; // Example state with countdown > 0

    return expectSaga(countdown)
      .withState(state)
      .delay(COUNTDOWN_INTERVAL)
      .put({ type: DECREMENT_COUNTDOWN })
      .run();
  });

  it('watchCountdown saga test', () => {
    // const state = { idle: { countdown: 0 } };

    testSaga(watchCountdown)
      .next()
      .take(START_COUNTDOWN)
      .next()
      .fork(countdown)
      .next()
      .take(CLOSE_TIMEOUT_POPUP)
      .next()
      .cancel(expect.anything())
      .next()
      .put(resetCountdown())
      .next()
      .isDone();
  });

  it('watchIdleTimer saga test', () => {
    testSaga(watchIdleTimer)
      .next()
      .take(START_IDLE_TIMER)
      .next()
      .fork(startIdleTimer)
      .next()
      .take(RESET_IDLE_TIMER)
      .next()
      .cancel(expect.anything())
      .next()
      .isDone();
  });

  it('rootSaga test', () => {
    testSaga(rootSaga)
      .next()
      .all([fork(watchIdleTimer), fork(watchCountdown)])
      .next()
      .isDone();
  });
});
