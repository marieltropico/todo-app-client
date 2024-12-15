import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LogoutButton } from '../LogoutButton';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

// Mock the navigation and auth hooks
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

describe('LogoutButton', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };
  const mockLogout = jest.fn();

  beforeEach(() => {
    // Setup mocks before each test
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<LogoutButton />);
    expect(getByText('Logout')).toBeTruthy();
  });

  it('handles successful logout', async () => {
    mockLogout.mockResolvedValueOnce(undefined);
    const { getByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('handles logout failure', async () => {
    mockLogout.mockRejectedValueOnce(new Error('Logout failed'));
    const { getByText } = render(<LogoutButton />);

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to logout');
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });
});
