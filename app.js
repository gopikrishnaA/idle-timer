import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startIdleTimer, resetIdleTimer, closeTimeoutPopup } from './actions';

const App = () => {
  const dispatch = useDispatch();
  const isTimeoutPopupVisible = useSelector(state => state.idle.isTimeoutPopupVisible);
  const countdown = useSelector(state => state.idle.countdown);

  useEffect(() => {
    dispatch(startIdleTimer());

    const resetTimer = () => dispatch(resetIdleTimer());

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [dispatch]);

  const handleClosePopup = () => {
    dispatch(closeTimeoutPopup());
  };

  useEffect(() => {
    const handleStorageEvent = (event) => {
      if (event.key === 'idleState') {
        const action = JSON.parse(event.newValue);
        dispatch(action);
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [dispatch]);

  return (
    <div>
      {isTimeoutPopupVisible && (
        <div className="timeout-popup">
          <p>Your session is about to expire due to inactivity.</p>
          <p>Time remaining: {countdown} seconds</p>
          <button onClick={handleClosePopup}>Stay Logged In</button>
        </div>
      )}
      {/* Your app content */}
    </div>
  );
};

export default App;
