import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminOrders = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firestore()
            .collection('orders')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const orders = [];
                querySnapshot.forEach(documentSnapshot => {
                    orders.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setOrders(orders);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
    }

    const renderStatus = (status) => {
        let color = '#6B7280';
        if (status === 'Processing') color = '#F59E0B';
        if (status === 'Shipped') color = '#007AFF';
        if (status === 'Delivered') color = '#10B981';
        if (status === 'Cancelled') color = '#EF4444';
        return (
            <View style={[styles.statusBadge, {backgroundColor: color}]}>
                <Text style={styles.statusText}>{status}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Manage Orders</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.orderItem}>
                        <View style={styles.orderInfo}>
                            <Text style={styles.orderId}>Order #{item.id.substring(0, 7)}</Text>
                            <Text style={styles.customerName}>{item.customerName || 'N/A'}</Text>
                            <Text style={styles.orderDate}>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.orderDetails}>
                            <Text style={styles.orderTotal}>₹{item.totalAmount}</Text>
                            {renderStatus(item.status)}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    title: { fontSize: 24, fontWeight: 'bold' },
    orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    orderInfo: { flex: 1 },
    orderId: { fontSize: 16, fontWeight: '600' },
    customerName: { color: '#6B7280', marginVertical: 2 },
    orderDate: { fontSize: 12, color: '#9CA3AF' },
    orderDetails: { alignItems: 'flex-end' },
    orderTotal: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    statusBadge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10 },
    statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
});

export default AdminOrders;
