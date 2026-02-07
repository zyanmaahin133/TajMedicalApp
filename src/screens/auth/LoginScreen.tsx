import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        firestore()
          .collection('users')
          .doc(userCredential.user.uid)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              const userData = documentSnapshot.data();
              dispatch(loginSuccess({ uid: userCredential.user.uid, ...userData }));
              if (userData.role === 'admin') {
                navigation.navigate('Admin');
              } else {
                // The onAuthStateChanged in App.tsx will handle navigating to the main app
              }
            } else {
                // This case should ideally not happen if signup is done correctly
                dispatch(loginSuccess({ uid: userCredential.user.uid, email: userCredential.user.email, role: 'user' }));
            }
          });
      })
      .catch(error => {
        Alert.alert('Login Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <View style={styles.inputView}>
        <Icon name="email" size={20} color="#000" />
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputView}>
        <Icon name="lock" size={20} color="#000" />
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    title: { fontWeight: "bold", fontSize: 50, color: "#007AFF", marginBottom: 40 },
    inputView: { width: "80%", backgroundColor: "#F0F8FF", borderRadius: 25, height: 50, marginBottom: 20, justifyContent: "center", padding: 20, flexDirection: 'row', alignItems: 'center' },
    inputText: { height: 50, color: "black", flex: 1 },
    forgot: { color: "#007AFF", fontSize: 11 },
    loginBtn: { width: "80%", backgroundColor: "#007AFF", borderRadius: 25, height: 50, alignItems: "center", justifyContent: "center", marginTop: 40, marginBottom: 10 },
    loginText: { color: "white" },
    signupText: { color: "#007AFF" }
});

export default LoginScreen;
