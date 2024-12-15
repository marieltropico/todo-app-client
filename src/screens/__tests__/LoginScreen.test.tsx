import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin, register: mockRegister });
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    const { getAllByText, getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getAllByText('Login')[1]).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Need an account? Register')).toBeTruthy();
  });

  it('switches to register form when register link is clicked', () => {
    const { getByText, getAllByText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('Need an account? Register'));
    
    expect(getAllByText('Register')[1]).toBeTruthy();
    expect(getByText('Have an account? Login')).toBeTruthy();
  });

  it('shows error when submitting empty fields', () => {
    const { getAllByText } = render(<LoginScreen />);
    
    fireEvent.press(getAllByText('Login')[1]);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
  });

  it('handles successful login', async () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    
    mockLogin.mockResolvedValueOnce(undefined);
    
    fireEvent.press(getAllByText('Login')[1]);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Todos');
    });
  });

  it('handles login failure', async () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    
    mockLogin.mockRejectedValueOnce(new Error('Login failed'));
    
    fireEvent.press(getAllByText('Login')[1]);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
    });
  });

  it('handles successful registration', async () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('Need an account? Register'));
    
    fireEvent.changeText(getByPlaceholderText('Username'), 'newuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    
    mockRegister.mockResolvedValueOnce(undefined);
    
    fireEvent.press(getAllByText('Register')[1]);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('newuser', 'password');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Todos');
    });
  });

  it('shows loading state during submission', async () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    fireEvent.press(getAllByText('Login')[1]);
    
    expect(getByText('Please wait...')).toBeTruthy();
  });
});
