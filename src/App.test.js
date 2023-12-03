import React from 'react';
import { render, screen } from '@testing-library/react';
import WelcomeScreen from './WelcomeScreen';

test('renders welcome message', () => {
  render(<WelcomeScreen />);
  expect(screen.getByText(/welcome to our messenger app/i)).toBeInTheDocument();
});
