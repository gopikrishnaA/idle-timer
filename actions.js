export const START_IDLE_TIMER = 'START_IDLE_TIMER';
export const RESET_IDLE_TIMER = 'RESET_IDLE_TIMER';
export const TIMEOUT = 'TIMEOUT';
export const CLOSE_TIMEOUT_POPUP = 'CLOSE_TIMEOUT_POPUP';
export const START_COUNTDOWN = 'START_COUNTDOWN';
export const DECREMENT_COUNTDOWN = 'DECREMENT_COUNTDOWN';
export const RESET_COUNTDOWN = 'RESET_COUNTDOWN';

export const startIdleTimer = () => ({ type: START_IDLE_TIMER });
export const resetIdleTimer = () => ({ type: RESET_IDLE_TIMER });
export const timeout = () => ({ type: TIMEOUT });
export const closeTimeoutPopup = () => ({ type: CLOSE_TIMEOUT_POPUP });
export const startCountdown = () => ({ type: START_COUNTDOWN });
export const decrementCountdown = () => ({ type: DECREMENT_COUNTDOWN });
export const resetCountdown = () => ({ type: RESET_COUNTDOWN });
