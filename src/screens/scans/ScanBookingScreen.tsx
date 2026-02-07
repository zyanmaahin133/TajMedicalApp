import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const ScanBookingScreen = () => {
  const [scanTypes, setScanTypes] = useState([]);
  const [popularScans, setPopularScans] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scanTypesSnapshot = await firestore().collection('scan_types').get();
        const scanTypesData = scanTypesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setScanTypes(scanTypesData);

        const popularScansSnapshot = await firestore().collection('scan_tests').where('popular', '==', true).get();
        const popularScansData = popularScansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPopularScans(popularScansData);

        const centersSnapshot = await firestore().collection('scan_centers').get();
        const centersData = centersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCenters(centersData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching scans data: ", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Premium Diagnostic Centers</Text>
        <Text style={styles.headerSubtitle}>Book Scans & Imaging Tests at discounted prices. Easy slot booking with quick reports.</Text>
      </View>

      <View style={styles.searchBar}>
          <Icon name="search" size={24} color="#9CA3AF" />
          <TextInput placeholder="Search for scans..." style={styles.searchInput} />
      </View>

      <Text style={styles.sectionTitle}>Select Scan Type</Text>
       <FlatList horizontal data={scanTypes} renderItem={({ item }) => (
          <TouchableOpacity style={styles.scanTypeCard}>
            <Text style={styles.scanTypeName}>{item.name}</Text>
            <Text style={styles.scanTypeSubtitle}>{item.subtitle}</Text>
            <Text style={styles.scanTypePrice}>From ₹{item.price}</Text>
          </TouchableOpacity>)}
        keyExtractor={(item) => item.name} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }} />

      <Text style={styles.sectionTitle}>Popular Scans</Text>
      <FlatList data={popularScans} keyExtractor={item => item.id} renderItem={({ item }) => (
            <View style={styles.scanCard}>
                <View style={styles.scanInfo}>
                    <Text style={styles.scanCardType}>{item.type}</Text>
                    {item.rx && <Text style={styles.rxTag}>Rx Required</Text>}
                    <Text style={styles.scanName}>{item.name}</Text>
                    <Text style={styles.scanReportTime}>Report: {item.reportTime}</Text>
                </View>
                <View style={styles.priceSection}>
                    <Text style={styles.scanPrice}>₹{item.price}</Text>
                    <Text style={styles.scanOldPrice}>₹{item.oldPrice}</Text>
                    <Text style={styles.scanDiscount}>{item.discount}% OFF</Text>
                </View>
                <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>Book Slot</Text></TouchableOpacity>
            </View>)}
        scrollEnabled={false} contentContainerStyle={{ marginHorizontal: 16, paddingTop: 16 }} />

        <Text style={styles.sectionTitle}>Our Diagnostic Centers</Text>
        <FlatList horizontal data={centers} renderItem={({item}) => (
            <View style={styles.centerCard}>
                <Text style={styles.centerName}>{item.name}</Text>
                <Text style={styles.centerLocation}>{item.location}</Text>
                <View style={styles.ratingRow}><Icon name="star" size={16} color="#FFC107" /><Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text></View>
                <View style={styles.serviceRow}>{item.services.map(s => <Text key={s} style={styles.serviceTag}>{s}</Text>)}</View>
                <TouchableOpacity style={styles.viewCenterButton}><Text style={styles.viewCenterText}>View Center</Text></TouchableOpacity>
            </View>)}
            keyExtractor={item => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }} />

        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.howItWorksContainer}>
            <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text>Select Scan</Text></View>
            <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text>Pick Center</Text></View>
            <View style={styles.step}><Text style={styles.stepNumber}>3</Text><Text>Book Slot</Text></View>
            <View style={styles.step}><Text style={styles.stepNumber}>4</Text><Text>Get Report</Text></View>
        </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: '#1F2937' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
    headerSubtitle: { color: '#E5E7EB', marginTop: 4, fontSize: 15 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 16, margin: 16, elevation: 3 },
    searchInput: { flex: 1, marginLeft: 12, height: 50, fontSize: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 16, marginTop: 10, marginBottom: 12, color: '#1F2937' },
    scanTypeCard: { width: 160, marginRight: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    scanTypeName: { fontWeight: 'bold', fontSize: 17, marginBottom: 6 },
    scanTypeSubtitle: { color: '#6B7280', marginBottom: 16, fontSize: 13 },
    scanTypePrice: { fontWeight: 'bold', color: '#007AFF', fontSize: 15 },
    scanCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    scanInfo: { flex: 1 },
    scanCardType: { fontWeight: '600', color: '#007AFF', marginBottom: 4 },
    rxTag: { color: '#D97706', fontSize: 12, fontWeight: '500', marginTop: 4 },
    scanName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginTop: 4 },
    scanReportTime: { color: '#6B7280', fontSize: 13, marginTop: 4 },
    priceSection: { alignItems: 'flex-end', marginHorizontal: 16 },
    scanPrice: { fontSize: 20, fontWeight: 'bold' },
    scanOldPrice: { textDecorationLine: 'line-through', fontSize: 13, color: '#9CA3AF' },
    scanDiscount: { color: '#10B981', fontWeight: 'bold', fontSize: 13 },
    bookButton: { backgroundColor: '#EAF2FF', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
    bookButtonText: { color: '#0059B3', fontWeight: 'bold' },
    centerCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', width: 280, marginRight: 12 },
    centerName: { fontSize: 16, fontWeight: 'bold' },
    centerLocation: { color: '#6B7280', marginVertical: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 8 },
    ratingText: { fontSize: 12 },
    serviceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
    serviceTag: { backgroundColor: '#E5E7EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, overflow: 'hidden' },
    viewCenterButton: { borderColor: '#007AFF', borderWidth: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 12 },
    viewCenterText: { color: '#007AFF', fontWeight: 'bold' },
    howItWorksContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
    step: { alignItems: 'center', gap: 8 },
    stepNumber: { backgroundColor: '#007AFF', color: 'white', width: 24, height: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24, fontWeight: 'bold' },
});

export default ScanBookingScreen;
