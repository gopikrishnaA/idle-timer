import idleReducer from './reducers';
import * as actions from './actions';

describe('idleReducer', () => {
  const initialState = {
    isTimeoutPopupVisible: false,
    countdown: 30,
    lastActivity: expect.any(Number),
  };

  it('should return the initial state', () => {
    expect(idleReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_IDLE_TIMER', () => {
    expect(idleReducer(initialState, actions.resetIdleTimer())).toEqual({
      ...initialState,
      lastActivity: expect.any(Number),
    });
  });

  it('should handle TIMEOUT', () => {
    expect(idleReducer(initialState, actions.timeout())).toEqual({
      ...initialState,
      isTimeoutPopupVisible: true,
      countdown: 30,
    });
  });

  it('should handle CLOSE_TIMEOUT_POPUP', () => {
    const state = {
      ...initialState,
      isTimeoutPopupVisible: true,
    };
    expect(idleReducer(state, actions.closeTimeoutPopup())).toEqual({
      ...initialState,
      isTimeoutPopupVisible: false,
      lastActivity: expect.any(Number),
    });
  });

  it('should handle DECREMENT_COUNTDOWN', () => {
    const state = {
      ...initialState,
      countdown: 30,
    };
    expect(idleReducer(state, actions.decrementCountdown())).toEqual({
      ...state,
      countdown: 29,
    });
  });

  it('should handle RESET_COUNTDOWN', () => {
    const state = {
      ...initialState,
      countdown: 10,
    };
    expect(idleReducer(state, actions.resetCountdown())).toEqual({
      ...state,
      countdown: 30,
    });
  });
});
