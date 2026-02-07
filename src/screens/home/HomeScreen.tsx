import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

// --- UI Components for the Screen ---
const ActionButton = ({ icon, text }) => (
    <TouchableOpacity style={styles.actionButton}>
        <Icon name={icon} size={28} color="#007AFF" />
        <Text style={styles.actionButtonText}>{text}</Text>
    </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const categoriesSnapshot = await firestore().collection('categories').get();
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);

        const productsSnapshot = await firestore().collection('medicines').where('featured', '==', true).limit(10).get();
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching home screen data: ", error);
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  if (loading) {
      return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Medicines & Health Products</Text>
        <Text style={styles.headerSubtitle}>Get up to 25% off on all medicines. Free delivery on orders above ₹500</Text>
      </View>

      {/* --- Search & Actions --- */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icon name="search" size={22} color="#9CA3AF" style={{marginRight: 8}}/>
          <TextInput placeholder="Search medicines, health products..." style={styles.searchInput} />
        </View>
        <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}><Text>Filter</Text></TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}><Icon name="file-upload" size={24} color="#374151" /><Text> Upload</Text></TouchableOpacity>
        </View>
      </View>

      {/* --- Core Services --- */}
      <View style={styles.coreServices}>
        <ActionButton icon="receipt-long" text="Book Lab Test" />
        <ActionButton icon="person" text="Consult Doctor" />
        <ActionButton icon="qr-code-scanner" text="Book Scan" />
      </View>

      {/* --- Shop by Category --- */}
      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <FlatList horizontal data={categories} renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryCard}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryItems}>{item.items} items</Text>
          </TouchableOpacity>)}
        keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listPadding} />

      {/* --- Featured Products --- */}
      <Text style={styles.sectionTitle}>Featured Products</Text>
       <FlatList horizontal data={featuredProducts} renderItem={({ item }) => (
          <View style={styles.productCard}>
             <View style={styles.productImageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                {item.rx && <View style={styles.rxTag}><Text style={styles.rxTagText}>Rx</Text></View>}
                <View style={styles.discountTag}><Text style={styles.discountTagText}>{item.discount}% OFF</Text></View>
             </View>
            <Text style={styles.productBrand}>{item.brand}</Text>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingRow}><Icon name="star" size={16} color="#FFC107" /><Text style={styles.ratingText}>{item.rating} ({item.reviews}+)</Text></View>
            <View style={styles.priceRow}>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <Text style={styles.productOldPrice}>₹{item.oldPrice}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}><Text style={styles.addButtonText}>Add to Cart</Text></TouchableOpacity>
          </View>)}
        keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listPadding} />

      {/* --- Doctors Section --- */}
      <View style={styles.doctorsSection}>
        <Text style={styles.sectionTitle}>Our Visiting Doctors</Text>
        <Text style={styles.doctorsSubtitle}>Renowned specialists from top medical institutions visit Taj Medical Store regularly. Get expert consultations without traveling to Kolkata.</Text>
        <TouchableOpacity style={styles.viewAllButton}><Text style={styles.viewAllText}>Book Appointment</Text></TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listPadding: { paddingLeft: 16, paddingRight: 4 },
  header: { padding: 16, backgroundColor: '#EAF2FF' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 15, color: '#4B5563', marginTop: 4 },
  searchSection: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, height: 48, fontSize: 16 },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F3F4F6', borderRadius: 8 },
  coreServices: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF' },
  serviceCard: { alignItems: 'center', gap: 8 },
  serviceText: { fontSize: 13, fontWeight: '500', color: '#374151' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 16, marginTop: 20, marginBottom: 12, color: '#1F2937' },
  categoryCard: { width: 140, marginRight: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  categoryImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  categoryName: { fontWeight: 'bold', fontSize: 15 },
  categoryItems: { fontSize: 13, color: '#6B7280' },
  productCard: { width: 170, marginRight: 12, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  productImageContainer: { width: '100%', height: 120 },
  productImage: { width: '100%', height: '100%', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  productInfo: { padding: 12 },
  rxTag: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,122,255,0.8)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  rxTagText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  discountTag: { position: 'absolute', top: 8, left: 8, backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  discountTagText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  productBrand: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  productName: { fontWeight: '600', fontSize: 15, color: '#1F2937' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: 12, color: '#6B7280' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  productPrice: { fontWeight: 'bold', fontSize: 18, color: '#1F2937' },
  productOldPrice: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  addButton: { backgroundColor: '#EAF2FF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  addButtonText: { color: '#0059B3', fontWeight: 'bold' },
  doctorsSection: { margin: 16, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12 },
  doctorsSubtitle: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginTop: 8, marginBottom: 16 },
  viewAllButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  viewAllText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
