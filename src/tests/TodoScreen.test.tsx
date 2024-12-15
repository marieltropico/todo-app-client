import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TodoScreen } from '../screens/TodoScreen';
import { AuthProvider } from '../context/AuthContext';
import { todoApi } from '../api/client';

jest.mock('../api/client', () => ({
  todoApi: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn()
  }
}));

describe('TodoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (todoApi.getTodos as jest.Mock).mockResolvedValue({
      data: [{ _id: '1', title: 'Test Todo', completed: false }]
    });
  });

  it('renders todo list and input field', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <TodoScreen />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('Test Todo')).toBeTruthy();
    });
    expect(getByPlaceholderText('Add a new todo')).toBeTruthy();
  });

  it('adds new todo', async () => {
    const newTodo = { _id: '2', title: 'New Todo', completed: false };
    (todoApi.createTodo as jest.Mock).mockResolvedValue({ data: newTodo });

    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <TodoScreen />
      </AuthProvider>
    );

    const input = getByPlaceholderText('Add a new todo');
    fireEvent.changeText(input, 'New Todo');
    fireEvent.press(getByText('Add'));

    await waitFor(() => {
      expect(todoApi.createTodo).toHaveBeenCalledWith('New Todo');
    });
  });

  it('handles errors when loading todos', async () => {
    (todoApi.getTodos as jest.Mock).mockRejectedValue(new Error('Failed to load'));

    const { getByText } = render(
      <AuthProvider>
        <TodoScreen />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('Failed to load todos')).toBeTruthy();
      expect(getByText('Retry')).toBeTruthy();
    });
  });
});
