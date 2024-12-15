import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!username.trim() || !password.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (isLogin) {
        await login(username, password);
        navigation.navigate('Todos');
      } else {
        await register(username, password);
        navigation.navigate('Todos');
      }
    } catch (error) {
      Alert.alert(
        'Error', 
        isLogin ? 'Invalid credentials' : 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>
        {isLogin ? 'Login' : 'Register'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchButton}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.switchText}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
