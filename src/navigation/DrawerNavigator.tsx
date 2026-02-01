import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import all the screens
import HomeScreen from '../screens/home/HomeScreen';
import CustomDrawerContent from './CustomDrawerContent';
import ShopScreen from '../screens/pharmacy/ShopScreen';
import DoctorListScreen from '../screens/doctors/DoctorListScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import LabTestsScreen from '../screens/lab/LabTestsScreen';
import ScanBookingScreen from '../screens/scans/ScanBookingScreen';
import ContactUsScreen from '../screens/contact/ContactUsScreen';
import AboutUsScreen from '../screens/about/AboutUsScreen';
import MedicineDetailsScreen from '../screens/pharmacy/MedicineDetailsScreen';
import CartScreen from '../screens/pharmacy/CartScreen';
import CheckoutScreen from '../screens/pharmacy/CheckoutScreen';
import OrderSuccessScreen from '../screens/pharmacy/OrderSuccessScreen';
import WholesaleScreen from '../screens/WholesaleScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// --- HEADER COMPONENTS ---

const HeaderLeft = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
      <Icon name="menu" size={28} color="#1F2937" />
    </TouchableOpacity>
  );
};

const HeaderRight = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Pharmacy', { screen: 'Cart' })} style={{ marginRight: 16 }}>
      <Icon name="shopping-cart" size={28} color="#1F2937" />
    </TouchableOpacity>
  );
};

// --- COMMON SCREEN OPTIONS FOR ALL STACKS ---

const stackScreenOptions = {
  headerLeft: () => <HeaderLeft />,
  headerRight: () => <HeaderRight />,
  headerTitleAlign: 'center',
};

// --- STACK NAVIGATORS ---

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="HomeStack" component={HomeScreen} options={{ title: 'Home' }} />
  </Stack.Navigator>
);

const PharmacyNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="ShopStack" component={ShopScreen} options={{ title: 'Pharmacy' }} />
    <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} options={{ title: 'Medicine Details' }} />
    <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
    <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const DoctorsNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="DoctorsStack" component={DoctorListScreen} options={{ title: 'Doctor Booking' }} />
  </Stack.Navigator>
);

const OrdersNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="OrdersStack" component={OrdersScreen} options={{ title: 'My Orders' }} />
  </Stack.Navigator>
);

const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="ProfileStack" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Stack.Navigator>
);

const LabTestsNavigator = () => (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="LabTestsStack" component={LabTestsScreen} options={{ title: 'Lab Tests' }} />
    </Stack.Navigator>
);

const ScansNavigator = () => (
    <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="ScanBookingStack" component={ScanBookingScreen} options={{ title: 'Scans' }} />
    </Stack.Navigator>
);

const ContactUsNavigator = () => (
    <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="ContactUsStack" component={ContactUsScreen} options={{ title: 'Contact Us' }} />
    </Stack.Navigator>
);

const AboutUsNavigator = () => (
    <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="AboutUsStack" component={AboutUsScreen} options={{ title: 'About Us' }} />
    </Stack.Navigator>
);

const WholesaleNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="WholesaleStack" component={WholesaleScreen} options={{ title: 'Wholesale' }} />
  </Stack.Navigator>
);


// --- MAIN DRAWER NAVIGATOR ---

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: 280 } }}
    >
      <Drawer.Screen name="Home" component={HomeNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="home" color={color} size={size} /> }} />
      <Drawer.Screen name="Pharmacy" component={PharmacyNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="local-pharmacy" color={color} size={size} /> }}/>
      <Drawer.Screen name="Lab Tests" component={LabTestsNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="science" color={color} size={size} /> }} />
      <Drawer.Screen name="Scans" component={ScansNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="qr-code-scanner" color={color} size={size} /> }} />
      <Drawer.Screen name="Doctor Booking" component={DoctorsNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="event" color={color} size={size} /> }} />
      <Drawer.Screen name="My Orders" component={OrdersNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="inventory" color={color} size={size} /> }} />
      <Drawer.Screen name="Wholesale" component={WholesaleNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="store" color={color} size={size} /> }} />
      <Drawer.Screen name="Profile" component={ProfileNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="person" color={color} size={size} /> }} />
      <Drawer.Screen name="Contact Us" component={ContactUsNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="chat" color={color} size={size} /> }} />
      <Drawer.Screen name="About Us" component={AboutUsNavigator} options={{ drawerIcon: ({color, size}) => <Icon name="info" color={color} size={size} /> }} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
