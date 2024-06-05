import { takeLatest, put, call, delay, fork, take, cancel, all, select } from 'redux-saga/effects';
import { START_IDLE_TIMER, RESET_IDLE_TIMER, TIMEOUT, START_COUNTDOWN, DECREMENT_COUNTDOWN, CLOSE_TIMEOUT_POPUP, resetCountdown, timeout } from './actions';
import { eventChannel } from 'redux-saga';

const IDLE_TIMEOUT = 60000; // 1 minute
const COUNTDOWN_INTERVAL = 1000; // 1 second

function* startIdleTimer() {
  yield delay(IDLE_TIMEOUT);
  yield put(timeout());
  yield put(startCountdown());
  localStorage.setItem('idleState', JSON.stringify({ type: 'TIMEOUT' }));
}

function* countdown() {
  while (true) {
    yield delay(COUNTDOWN_INTERVAL);
    yield put({ type: DECREMENT_COUNTDOWN });

    const state = yield select();
    if (state.idle.countdown <= 0) {
      // Handle logout or session expiration here
      break;
    }
    localStorage.setItem('idleState', JSON.stringify({ type: 'DECREMENT_COUNTDOWN' }));
  }
}

function* watchCountdown() {
  while (true) {
    yield take(START_COUNTDOWN);
    const countdownTask = yield fork(countdown);

    yield take(CLOSE_TIMEOUT_POPUP);
    yield cancel(countdownTask);
    yield put(resetCountdown());
    localStorage.setItem('idleState', JSON.stringify({ type: 'CLOSE_TIMEOUT_POPUP' }));
  }
}

function* watchIdleTimer() {
  while (true) {
    yield take(START_IDLE_TIMER);
    const idleTask = yield fork(startIdleTimer);

    yield take(RESET_IDLE_TIMER);
    yield cancel(idleTask);
    localStorage.setItem('idleState', JSON.stringify({ type: 'RESET_IDLE_TIMER' }));
  }
}

function createStorageEventChannel() {
  return eventChannel(emitter => {
    const storageEventHandler = event => {
      if (event.key === 'idleState') {
        const action = JSON.parse(event.newValue);
        emitter(action);
      }
    };

    window.addEventListener('storage', storageEventHandler);

    return () => {
      window.removeEventListener('storage', storageEventHandler);
    };
  });
}

function* watchStorageEvents() {
  const storageChannel = createStorageEventChannel();

  while (true) {
    const action = yield take(storageChannel);
    yield put(action);
  }
}

export default function* rootSaga() {
  yield all([
    watchIdleTimer(),
    watchCountdown(),
    watchStorageEvents(),
  ]);
}
