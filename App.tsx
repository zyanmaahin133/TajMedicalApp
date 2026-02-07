import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider, useSelector, useDispatch} from 'react-redux';
import {ToastProvider} from 'react-native-toast-notifications';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor, RootState} from './src/store/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { loginSuccess, logout } from './src/store/authSlice';
import { initDatabase } from './src/database/Database';

const Stack = createStackNavigator();

const SplashScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are now handling the auth state change in the main App component
    // This component will just react to the state changes
    setLoading(false);
  }, [isAuthenticated, user]);

  if (loading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Check the user's role and render the appropriate navigator
  if (user && user.role === 'admin') {
    return <AdminNavigator />;
  }

  return <AppNavigator />;
};

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        initDatabase();

        const subscriber = auth().onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = await firestore().collection('users').doc(user.uid).get();
                const userData = userDoc.exists ? { uid: user.uid, ...userDoc.data() } : { uid: user.uid, role: 'user' }; // Default to user role if not found
                dispatch(loginSuccess(userData));
            } else {
                dispatch(logout());
            }
        });
        return subscriber;
    }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <ToastProvider placement="top">
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
});

export default App;
