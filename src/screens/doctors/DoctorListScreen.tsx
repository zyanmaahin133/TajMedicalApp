import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DoctorListScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsSnapshot = await firestore().collection('doctors').orderBy('name').get();
        const doctorsData = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(doctorsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Visiting Doctors</Text>
        <Text style={styles.headerSubtitle}>Renowned specialists from top medical institutions visit Taj Medical Store regularly. Get expert consultations without traveling to Kolkata.</Text>
      </View>

      <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>

      <Text style={styles.contactInfo}>For doctor appointment and schedule updates: Call +91 74279 15869 or +91 98360 16644</Text>

      <FlatList
        data={doctors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <View style={styles.doctorCard}>
                <View style={[styles.avatar, {backgroundColor: '#007AFF'}]}>
                    <Text style={styles.avatarText}>{item.avatar || item.name.charAt(0)}</Text>
                </View>
                <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{item.name}</Text>
                    <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                    <Text style={styles.doctorQualifications}>{item.qualifications}</Text>
                    {item.hospital && <Text style={styles.doctorHospital}>{item.hospital}</Text>}
                    <Text style={styles.doctorSchedule}>{item.schedule}</Text>
                </View>
            </View>
        )}
        scrollEnabled={false}
        contentContainerStyle={{paddingTop: 16}}
      />

      <View style={styles.specialNote}>
        <Text style={styles.specialNoteTitle}>Special: Chennai Specialist Doctors</Text>
        <Text style={styles.noteText}>Doctors from Sri Ramachandra Medical College, Chennai visit regularly for specialized treatments.</Text>
        <Text style={styles.contactInfo}>For Chennai doctors' schedule: Call +91 74279 15869 or +91 98360 16644</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    headerSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginTop: 8 },
    bookButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, margin: 20, alignItems: 'center', elevation: 2 },
    bookButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    contactInfo: { marginHorizontal: 20, marginBottom: 20, textAlign: 'center', color: '#4B5563', fontSize: 13 },
    doctorCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 20, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    avatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    avatarText: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' },
    doctorInfo: { flex: 1 },
    doctorName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    doctorSpecialty: { color: '#007AFF', fontWeight: '600', marginVertical: 4, fontSize: 15 },
    doctorQualifications: { color: '#6B7280', fontSize: 13, lineHeight: 18 },
    doctorHospital: { fontStyle: 'italic', color: '#6B7280', fontSize: 13, marginTop: 4 },
    doctorSchedule: { fontWeight: 'bold', marginTop: 8, fontSize: 14, color: '#1F2937' },
    specialNote: { padding: 20, margin: 20, marginTop: 10, backgroundColor: '#FFFBEB', borderRadius: 12, borderWidth: 1, borderColor: '#FBBF24' },
    specialNoteTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#92400E' },
    noteText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
});

export default DoctorListScreen;
