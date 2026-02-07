import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <View style={styles.inputView}>
        <Icon name="email" size={20} color="#000" />
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          onChangeText={text => setEmail(text)}
        />
      </View>
      <TouchableOpacity style={styles.resetBtn} onPress={handlePasswordReset}>
        <Text style={styles.resetText}>RESET PASSWORD</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    title: { fontWeight: "bold", fontSize: 40, color: "#007AFF", marginBottom: 40 },
    inputView: { width: "80%", backgroundColor: "#F0F8FF", borderRadius: 25, height: 50, marginBottom: 20, justifyContent: "center", padding: 20, flexDirection: 'row', alignItems: 'center' },
    inputText: { height: 50, color: "black", flex: 1 },
    resetBtn: { width: "80%", backgroundColor: "#007AFF", borderRadius: 25, height: 50, alignItems: "center", justifyContent: "center", marginTop: 40, marginBottom: 10 },
    resetText: { color: "white" },
    loginText: { color: "#007AFF", marginTop: 20 }
});

export default ForgotPasswordScreen;
