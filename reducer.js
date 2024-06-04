import { RESET_IDLE_TIMER, TIMEOUT, CLOSE_TIMEOUT_POPUP, DECREMENT_COUNTDOWN, RESET_COUNTDOWN } from './actions';

const initialState = {
  isTimeoutPopupVisible: false,
  countdown: 30, // 30 seconds countdown
  lastActivity: Date.now()
};

const idleReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_IDLE_TIMER:
      return { ...state, lastActivity: Date.now() };
    case TIMEOUT:
      return { ...state, isTimeoutPopupVisible: true, countdown: 30 };
    case CLOSE_TIMEOUT_POPUP:
      return { ...state, isTimeoutPopupVisible: false, lastActivity: Date.now() };
    case DECREMENT_COUNTDOWN:
      return { ...state, countdown: state.countdown - 1 };
    case RESET_COUNTDOWN:
      return { ...state, countdown: 30 };
    default:
      return state;
  }
};

export default idleReducer;
