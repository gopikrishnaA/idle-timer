import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from './app';
import { startIdleTimer, resetIdleTimer, closeTimeoutPopup } from './actions';

const mockStore = configureStore([]);
jest.useFakeTimers();

describe('App', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      idle: {
        isTimeoutPopupVisible: false,
        countdown: 30,
        lastActivity: Date.now(),
      },
    });

    store.dispatch = jest.fn();
  });

  test('renders app and handles idle timer', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(startIdleTimer());

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function)); // timeout action
  });

  test('handles user activity and resets idle timer', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.mouseMove(document);
    expect(store.dispatch).toHaveBeenCalledWith(resetIdleTimer());

    fireEvent.keyPress(document);
    expect(store.dispatch).toHaveBeenCalledWith(resetIdleTimer());

    fireEvent.click(document);
    expect(store.dispatch).toHaveBeenCalledWith(resetIdleTimer());

    fireEvent.scroll(document);
    expect(store.dispatch).toHaveBeenCalledWith(resetIdleTimer());
  });

  test('shows and hides timeout popup', () => {
    store = mockStore({
      idle: {
        isTimeoutPopupVisible: true,
        countdown: 30,
        lastActivity: Date.now(),
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/Your session is about to expire/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Stay Logged In/i));
    expect(store.dispatch).toHaveBeenCalledWith(closeTimeoutPopup());
  });
});
