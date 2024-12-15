import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Alert 
} from 'react-native';
import { todoApi } from '../api/client';
import type { Todo } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

export type TodoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Todos'>;

export function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await todoApi.getTodos();
      setTodos(response.data);
    } catch (error) {
      setError('Failed to load todos');
      Alert.alert('Error', 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await todoApi.createTodo(newTodo.trim());
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.title);
  };

  const handleUpdate = async () => {
    if (!editingTodo || !editText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await todoApi.updateTodo(editingTodo._id, {
        title: editText.trim()
      });
      setTodos(todos.map(t => 
        t._id === editingTodo._id ? response.data : t
      ));
      setEditingTodo(null);
      setEditText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (todo: Todo) => {
    try {
      await todoApi.deleteTodo(todo._id);
      setTodos(todos.filter(t => t._id !== todo._id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await todoApi.updateTodo(todo._id, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => 
        t._id === todo._id ? response.data : t
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading todos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTodos}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            {editingTodo?._id === item._id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={editText}
                  onChangeText={setEditText}
                  autoFocus
                />
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleUpdate}
                  disabled={isSubmitting}
                >
                  <Text style={styles.editButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setEditingTodo(null)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.todoRow}>
                <TouchableOpacity 
                  style={styles.todoTextContainer}
                  onPress={() => toggleTodo(item)}
                >
                  <Text style={[styles.todoText, item.completed && styles.completed]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={isLoading ? null : <Text>No todos found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTextContainer: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#8e8e93',
    padding: 8,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
