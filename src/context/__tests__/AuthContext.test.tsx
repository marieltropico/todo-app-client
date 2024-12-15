import React from 'react';
import { render, act, cleanup, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { authApi } from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('../../api/client', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Test component to access context
const TestComponent = () => {
  const auth = useAuth();
  return null;
};

describe('AuthContext', () => {
  afterEach(cleanup);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuth = () => {
    let authContext: ReturnType<typeof useAuth>;
    
    function TestComponent() {
      authContext = useAuth();
      return null;
    }

    const rendered = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    return { authContext: authContext!, ...rendered };
  };

  it('should check auth status on mount', async () => {
    renderWithAuth();
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userId');
    });
  });

  it('should handle login successfully', async () => {
    const mockUserId = '123';
    (authApi.login as jest.Mock).mockResolvedValueOnce({ data: { userId: mockUserId } });
    
    let authContext: ReturnType<typeof useAuth>;
    function TestComponent() {
      authContext = useAuth();
      return null;
    }
  
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  
    // Wait for initial auth check to complete
    await waitFor(() => {
      expect(authContext!.isLoading).toBe(false);
    });
  
    // Perform login
    await act(async () => {
      await authContext!.login('testuser', 'password');
    });
  
    // Verify the results
    expect(authApi.login).toHaveBeenCalledWith('testuser', 'password');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('userId', mockUserId);
    expect(authContext!.isAuthenticated).toBe(true);
  });

  it('should handle logout successfully', async () => {
    const { authContext } = renderWithAuth();
    
    await act(async () => {
      await authContext.logout();
    });

    await waitFor(() => {
      expect(authApi.logout).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userId');
      expect(authContext.isAuthenticated).toBe(false);
    });
  });
});
