import '@testing-library/jest-native/extend-expect';
import { Alert } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn()
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn()
  }),
  useRoute: () => ({
    params: {}
  })
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock auth API
jest.mock('../api/client', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  },
  todoApi: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn()
  }
}));
