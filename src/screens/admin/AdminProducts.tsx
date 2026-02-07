import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminProducts = ({ navigation }) => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firestore()
            .collection('medicines')
            .onSnapshot(querySnapshot => {
                const medicines = [];
                querySnapshot.forEach(documentSnapshot => {
                    medicines.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setMedicines(medicines);
                setLoading(false);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const deleteProduct = (id) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => {
                    firestore().collection('medicines').doc(id).delete()
                    .catch(error => Alert.alert("Error", "Could not delete product."));
                }}
            ]
        );
    }

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Manage Products</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => { /* Navigate to Add/Edit Screen */ }}>
                    <Icon name="add" size={24} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={medicines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productBrand}>{item.brand}</Text>
                            <Text style={styles.productPrice}>₹{item.price}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => { /* Navigate to Add/Edit Screen with item */ }}>
                                <Icon name="edit" size={24} color="#007AFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                                <Icon name="delete" size={24} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    title: { fontSize: 24, fontWeight: 'bold' },
    addButton: { flexDirection: 'row', backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', gap: 6 },
    addButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    productItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    productInfo: { flex: 1 },
    productName: { fontSize: 16, fontWeight: '600' },
    productBrand: { color: '#6B7280', marginVertical: 2 },
    productPrice: { fontWeight: 'bold', color: '#1F2937' },
    actions: { flexDirection: 'row', gap: 20 }
});

export default AdminProducts;
