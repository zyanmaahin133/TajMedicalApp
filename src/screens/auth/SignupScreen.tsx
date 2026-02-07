import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Add user to firestore
        firestore().collection('users').doc(userCredential.user.uid).set({
            email: email,
            role: 'user', // default role
        })
        .then(() => {
            console.log('User added to Firestore!');
        });
      })
      .catch(error => {
        Alert.alert('Signup Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <View style={styles.inputView}>
        <Icon name="email" size={20} color="#000" />
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          onChangeText={text => setEmail(text)}
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
      <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
        <Text style={styles.signupText}>SIGNUP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    title: { fontWeight: "bold", fontSize: 50, color: "#007AFF", marginBottom: 40 },
    inputView: { width: "80%", backgroundColor: "#F0F8FF", borderRadius: 25, height: 50, marginBottom: 20, justifyContent: "center", padding: 20, flexDirection: 'row', alignItems: 'center' },
    inputText: { height: 50, color: "black", flex: 1 },
    signupBtn: { width: "80%", backgroundColor: "#007AFF", borderRadius: 25, height: 50, alignItems: "center", justifyContent: "center", marginTop: 40, marginBottom: 10 },
    signupText: { color: "white" },
    loginText: { color: "#007AFF" }
});

export default SignupScreen;
