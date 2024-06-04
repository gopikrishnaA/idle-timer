import * as actions from './actions';

describe('idle timer actions', () => {
  it('should create an action to start the idle timer', () => {
    const expectedAction = { type: actions.START_IDLE_TIMER };
    expect(actions.startIdleTimer()).toEqual(expectedAction);
  });

  it('should create an action to reset the idle timer', () => {
    const expectedAction = { type: actions.RESET_IDLE_TIMER };
    expect(actions.resetIdleTimer()).toEqual(expectedAction);
  });

  it('should create an action for timeout', () => {
    const expectedAction = { type: actions.TIMEOUT };
    expect(actions.timeout()).toEqual(expectedAction);
  });

  it('should create an action to close the timeout popup', () => {
    const expectedAction = { type: actions.CLOSE_TIMEOUT_POPUP };
    expect(actions.closeTimeoutPopup()).toEqual(expectedAction);
  });

  it('should create an action to start countdown', () => {
    const expectedAction = { type: actions.START_COUNTDOWN };
    expect(actions.startCountdown()).toEqual(expectedAction);
  });

  it('should create an action to decrement countdown', () => {
    const expectedAction = { type: actions.DECREMENT_COUNTDOWN };
    expect(actions.decrementCountdown()).toEqual(expectedAction);
  });

  it('should create an action to reset countdown', () => {
    const expectedAction = { type: actions.RESET_COUNTDOWN };
    expect(actions.resetCountdown()).toEqual(expectedAction);
  });
});
