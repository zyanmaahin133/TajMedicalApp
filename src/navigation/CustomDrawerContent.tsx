import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ],
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.imgur.com/Gp4V5d8.png' }} // Placeholder logo
          style={styles.logo}
        />
        <Text style={styles.title}>Taj Medical</Text>
        <Text style={styles.subtitle}>Healthcare & Pharmacy</Text>
      </View>

      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.footerButton}>
          <Icon name="logout" size={22} color="#6B7280" />
          <Text style={styles.footerButtonText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#F0F8F8',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Increased gap for better spacing
    paddingVertical: 12,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default CustomDrawerContent;
