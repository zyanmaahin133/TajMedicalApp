import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminUsers = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AdminUsers;
