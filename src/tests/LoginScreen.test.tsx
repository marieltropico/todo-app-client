import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { AuthProvider } from '../context/AuthContext';
import { Alert } from 'react-native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    expect(getAllByText('Login')[0]).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Need an account? Register')).toBeTruthy();
  });

  it('shows validation error for empty fields', async () => {
    const { getAllByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.press(getAllByText('Login')[1]);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
  });
});
