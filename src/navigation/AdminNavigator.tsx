import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminProducts from '../screens/admin/AdminProducts';
import AdminOrders from '../screens/admin/AdminOrders';
import AdminDoctors from '../screens/admin/AdminDoctors';
import AdminUsers from '../screens/admin/AdminUsers';

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'Products') iconName = 'inventory-2';
          else if (route.name === 'Orders') iconName = 'receipt-long';
          else if (route.name === 'Doctors') iconName = 'person';
          else if (route.name === 'Users') iconName = 'group';
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Products" component={AdminProducts} />
      <Tab.Screen name="Orders" component={AdminOrders} />
      <Tab.Screen name="Doctors" component={AdminDoctors} />
      <Tab.Screen name="Users" component={AdminUsers} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
