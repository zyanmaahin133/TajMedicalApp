import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatCard = ({ title, value, icon }) => (
    <View style={styles.statCard}>
        <Icon name={icon} size={32} color="#007AFF" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </View>
);

const AdminDashboard = ({ navigation }) => {
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, doctors: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const products = await firestore().collection('medicines').get();
                const orders = await firestore().collection('orders').get();
                const users = await firestore().collection('users').get();
                const doctors = await firestore().collection('doctors').get();

                setStats({
                    products: products.size,
                    orders: orders.size,
                    users: users.size,
                    doctors: doctors.size
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching admin stats: ", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <View style={styles.statsGrid}>
                <StatCard title="Total Products" value={stats.products} icon="inventory-2" />
                <StatCard title="Total Orders" value={stats.orders} icon="receipt-long" />
                <StatCard title="Total Users" value={stats.users} icon="group" />
                <StatCard title="Total Doctors" value={stats.doctors} icon="person" />
            </View>

            <Text style={styles.sectionTitle}>Management</Text>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Products')}>
                <Icon name="inventory-2" size={24} color="#374151" />
                <Text style={styles.navButtonText}>Manage Products</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
             <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Orders')}>
                <Icon name="receipt-long" size={24} color="#374151" />
                <Text style={styles.navButtonText}>Manage Orders</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Doctors')}>
                <Icon name="person" size={24} color="#374151" />
                <Text style={styles.navButtonText}>Manage Doctors</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Users')}>
                <Icon name="group" size={24} color="#374151" />
                <Text style={styles.navButtonText}>Manage Users</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', padding: 20 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10 },
    statCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', width: '45%', marginBottom: 20, elevation: 2, gap: 8 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
    statTitle: { fontSize: 14, color: '#6B7280' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
    navButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20, marginHorizontal: 20, marginBottom: 12, borderRadius: 10, elevation: 1 },
    navButtonText: { flex: 1, marginLeft: 16, fontSize: 16, fontWeight: '600', color: '#374151' },
});

export default AdminDashboard;
