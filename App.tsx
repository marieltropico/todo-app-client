import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { TodoScreen } from './src/screens/TodoScreen';
import { AuthProvider } from './src/context/AuthContext';
import { RootStackParamList } from './src/types';
import { LogoutButton } from './src/components/LogoutButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerLeft: () => null }} 
          />
          <Stack.Screen 
            name="Todos" 
            component={TodoScreen}
            options={{
              headerLeft: () => null,
              headerRight: () => <LogoutButton />
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
