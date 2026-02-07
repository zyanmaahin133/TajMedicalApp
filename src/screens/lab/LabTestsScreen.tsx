import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const LabTestsScreen = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [healthPackages, setHealthPackages] = useState([]);
  const [departmentWiseTests, setDepartmentWiseTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packagesSnapshot = await firestore().collection('health_packages').get();
        const packagesData = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHealthPackages(packagesData);

        const testsSnapshot = await firestore().collection('department_tests').get();
        const testsData = testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDepartmentWiseTests(testsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching lab tests data: ", error);
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
        <Text style={styles.headerTitle}>Trusted by 50,000+ customers</Text>
        <Text style={styles.headerSubtitle}>Book Lab Tests at Home</Text>
        <Text style={styles.headerDiscount}>Get up to 60% off on all lab tests. Free home sample collection. Reports in 6-24 hours.</Text>
      </View>

      <View style={styles.searchBar}>
          <Icon name="search" size={24} color="#9CA3AF" />
          <TextInput placeholder="Search for tests, health packages..." style={styles.searchInput} />
      </View>

      <View style={styles.infoRow}>
          <View style={styles.infoItem}><Icon name="home" size={28} color="#007AFF" /><Text style={styles.infoText}>Home Collection</Text></View>
          <View style={styles.infoItem}><Icon name="timer" size={28} color="#007AFF" /><Text style={styles.infoText}>Quick Reports</Text></View>
          <View style={styles.infoItem}><Icon name="verified-user" size={28} color="#007AFF" /><Text style={styles.infoText}>NABL Certified</Text></View>
          <View style={styles.infoItem}><Icon name="picture-as-pdf" size={28} color="#007AFF" /><Text style={styles.infoText}>Digital Reports</Text></View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'packages' && styles.activeTab]} onPress={() => setActiveTab('packages')}>
          <Text style={[styles.tabText, activeTab === 'packages' && styles.activeTabText]}>Health Packages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'tests' && styles.activeTab]} onPress={() => setActiveTab('tests')}>
          <Text style={[styles.tabText, activeTab === 'tests' && styles.activeTabText]}>All Tests</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'packages' ? (
        <FlatList
            data={healthPackages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.packageCard}>
                    <View style={styles.packageHeader}>
                        {item.popular && <View style={styles.popularTag}><Text style={styles.popularTagText}>Popular</Text></View>}
                        <Text style={styles.packageDiscount}>{item.discount}% OFF</Text>
                    </View>
                    <Text style={styles.packageName}>{item.name}</Text>
                    <Text style={styles.packageTests}>Includes {item.tests} tests</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.packagePrice}>₹{item.price}</Text>
                        <Text style={styles.packageOldPrice}>₹{item.oldPrice}</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>Book Now</Text></TouchableOpacity>
                </View>
            )}
            scrollEnabled={false}
        />
      ) : (
        <View>
            <Text style={styles.sectionTitle}>Department Wise Diagnostic Tests</Text>
            <FlatList
                data={departmentWiseTests}
                numColumns={3}
                keyExtractor={item => item.name}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.departmentCard}>
                        <Icon name={item.icon} size={32} color="#007AFF" />
                        <Text style={styles.departmentName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                scrollEnabled={false}
            />
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { backgroundColor: '#EAF2FF', padding: 20, paddingTop: 30 },
    headerTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#0059B3' },
    headerSubtitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1F2937', marginTop: 4 },
    headerDiscount: { textAlign: 'center', color: '#4B5563', marginTop: 8, fontSize: 14 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 16, margin: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 1} },
    searchInput: { flex: 1, marginLeft: 12, height: 50, fontSize: 16 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 20, paddingHorizontal: 10, backgroundColor: '#FFFFFF' },
    infoItem: { alignItems: 'center', gap: 8 },
    infoText: { fontSize: 12, color: '#4B5563' },
    tabsContainer: { flexDirection: 'row', marginHorizontal: 16, marginTop: 20, backgroundColor: '#E5E7EB', borderRadius: 10, padding: 4 },
    tab: { flex: 1, paddingVertical: 12, borderRadius: 8 },
    activeTab: { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 1} },
    tabText: { textAlign: 'center', fontWeight: '600', color: '#4B5563', fontSize: 15 },
    activeTabText: { color: '#007AFF' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 16, marginTop: 10, marginBottom: 12, color: '#1F2937' },
    departmentCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, margin: 6, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', gap: 8 },
    departmentName: { textAlign: 'center', fontWeight: '500' },
    packageCard: { backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 16, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    popularTag: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    popularTagText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
    packageDiscount: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },
    packageName: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
    packageTests: { color: '#6B7280', marginVertical: 8, fontSize: 15 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 16 },
    packagePrice: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    packageOldPrice: { textDecorationLine: 'line-through', fontSize: 16, color: '#9CA3AF' },
    bookButton: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center' },
    bookButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});

export default LabTestsScreen;
