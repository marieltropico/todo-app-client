
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import type { LoginScreenNavigationProp } from '../screens/LoginScreen';

export function LogoutButton() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});