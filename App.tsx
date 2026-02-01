import 'react-native-gesture-handler';
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider, useSelector} from 'react-redux';
import {ToastProvider} from 'react-native-toast-notifications';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor, RootState} from './src/store/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createStackNavigator();

const SplashScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
  </View>
);

// This component now contains just the navigator logic
const AppContent = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <ToastProvider
          placement="top"
          duration={3000}
          animationType="slide-in"
          offsetTop={50}>
          {/* The NavigationContainer now wraps the content, creating a single navigation world */}
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
  },
});

export default App;
