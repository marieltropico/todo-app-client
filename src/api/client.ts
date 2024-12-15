import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

export const authApi = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (username: string, password: string) => 
    api.post('/auth/register', { username, password }),
  logout: () => api.post('/auth/logout'),
};

export const todoApi = {
  getTodos: () => api.get('/todos'),
  createTodo: (title: string) => api.post('/todos', { title }),
  updateTodo: (id: string, data: { title?: string; completed?: boolean }) => 
    api.put(`/todos/${id}`, data),
  deleteTodo: (id: string) => api.delete(`/todos/${id}`),
};