import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TodoScreen } from '../TodoScreen';
import { todoApi } from '../../api/client';

jest.mock('../../api/client', () => ({
  todoApi: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert');

describe('TodoScreen', () => {
  const mockTodos = [
    { _id: '1', title: 'Test Todo 1', completed: false },
    { _id: '2', title: 'Test Todo 2', completed: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (todoApi.getTodos as jest.Mock).mockResolvedValue({ data: mockTodos });
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<TodoScreen />);
    expect(getByText('Loading todos...')).toBeTruthy();
  });

  it('loads and displays todos', async () => {
    const { getByText } = render(<TodoScreen />);
    
    await waitFor(() => {
      expect(getByText('Test Todo 1')).toBeTruthy();
      expect(getByText('Test Todo 2')).toBeTruthy();
    });
  });

  it('handles error when loading todos fails', async () => {
    (todoApi.getTodos as jest.Mock).mockRejectedValueOnce(new Error('Failed'));
    
    const { getByText } = render(<TodoScreen />);
    
    await waitFor(() => {
      expect(getByText('Failed to load todos')).toBeTruthy();
      expect(getByText('Retry')).toBeTruthy();
    });
  });

  it('adds a new todo', async () => {
    const newTodo = { _id: '3', title: 'New Todo', completed: false };
    (todoApi.createTodo as jest.Mock).mockResolvedValueOnce({ data: newTodo });
    
    const { getByPlaceholderText, getByText } = render(<TodoScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText('Add a new todo');
      fireEvent.changeText(input, 'New Todo');
      fireEvent.press(getByText('Add'));
    });

    await waitFor(() => {
      expect(todoApi.createTodo).toHaveBeenCalledWith('New Todo');
      expect(getByText('New Todo')).toBeTruthy();
    });
  });

  it('edits a todo', async () => {
    const updatedTodo = { ...mockTodos[0], title: 'Updated Todo' };
    (todoApi.updateTodo as jest.Mock).mockResolvedValueOnce({ data: updatedTodo });
    
    const { getByText, getAllByText, getByDisplayValue } = render(<TodoScreen />);
    
    await waitFor(() => {
      fireEvent.press(getAllByText('Edit')[0]);
    });

    const input = getByDisplayValue('Test Todo 1');
    fireEvent.changeText(input, 'Updated Todo');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(todoApi.updateTodo).toHaveBeenCalledWith('1', { title: 'Updated Todo' });
      expect(getByText('Updated Todo')).toBeTruthy();
    });
  });

  it('deletes a todo', async () => {
    (todoApi.deleteTodo as jest.Mock).mockResolvedValueOnce({});
    
    const { getAllByText, queryByText } = render(<TodoScreen />);
    
    await waitFor(() => {
      fireEvent.press(getAllByText('Delete')[0]);
    });

    await waitFor(() => {
      expect(todoApi.deleteTodo).toHaveBeenCalledWith('1');
      expect(queryByText('Test Todo 1')).toBeNull();
    });
  });

  it('toggles todo completion status', async () => {
    const toggledTodo = { ...mockTodos[0], completed: true };
    (todoApi.updateTodo as jest.Mock).mockResolvedValueOnce({ data: toggledTodo });
    
    const { getByText } = render(<TodoScreen />);
    
    await waitFor(() => {
      fireEvent.press(getByText('Test Todo 1'));
    });

    await waitFor(() => {
      expect(todoApi.updateTodo).toHaveBeenCalledWith('1', { completed: true });
    });
  });

  it('cancels editing a todo', async () => {
    const { getByText, getAllByText, queryByDisplayValue } = render(<TodoScreen />);
    
    await waitFor(() => {
      fireEvent.press(getAllByText('Edit')[0]);
    });

    fireEvent.press(getByText('Cancel'));

    await waitFor(() => {
      expect(queryByDisplayValue('Test Todo 1')).toBeNull();
      expect(getByText('Test Todo 1')).toBeTruthy();
    });
  });

  it('shows error when adding todo fails', async () => {
    (todoApi.createTodo as jest.Mock).mockRejectedValueOnce(new Error('Failed'));
    
    const { getByPlaceholderText, getByText } = render(<TodoScreen />);
    
    await waitFor(() => {
      const input = getByPlaceholderText('Add a new todo');
      fireEvent.changeText(input, 'New Todo');
      fireEvent.press(getByText('Add'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to create todo');
    });
  });

  it('shows empty state when no todos exist', async () => {
    (todoApi.getTodos as jest.Mock).mockResolvedValueOnce({ data: [] });
    
    const { getByText } = render(<TodoScreen />);
    
    await waitFor(() => {
      expect(getByText('No todos found')).toBeTruthy();
    });
  });
});