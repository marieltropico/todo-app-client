export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Login: undefined;
  Todos: undefined;
};