import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminDoctors = ({ navigation }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firestore()
            .collection('doctors')
            .onSnapshot(querySnapshot => {
                const doctors = [];
                querySnapshot.forEach(documentSnapshot => {
                    doctors.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setDoctors(doctors);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    const deleteDoctor = (id) => {
        Alert.alert(
            "Delete Doctor",
            "Are you sure you want to delete this doctor?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => {
                    firestore().collection('doctors').doc(id).delete()
                    .catch(error => Alert.alert("Error", "Could not delete doctor."));
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
                <Text style={styles.title}>Manage Doctors</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => { /* Navigate to Add/Edit Screen */ }}>
                    <Icon name="add" size={24} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={doctors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.doctorItem}>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>{item.name}</Text>
                            <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => { /* Navigate to Add/Edit Screen with item */ }}>
                                <Icon name="edit" size={24} color="#007AFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteDoctor(item.id)}>
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
    doctorItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    doctorInfo: { flex: 1 },
    doctorName: { fontSize: 16, fontWeight: '600' },
    doctorSpecialty: { color: '#6B7280', marginVertical: 2 },
    actions: { flexDirection: 'row', gap: 20 }
});

export default AdminDoctors;
