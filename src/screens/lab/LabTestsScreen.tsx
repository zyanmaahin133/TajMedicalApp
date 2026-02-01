import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { sampleLabTests, sampleHealthPackages } from '../../data/labTests';
import { diagnosticCategories } from '../../data/categories';
import { addItem } from '../../store/slices/cartSlice';

// --- Main Lab Tests Screen Component ---

const LabTestsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' or 'tests'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingItem, setBookingItem] = useState(null);

  const dispatch = useDispatch();

  const handleBookItem = (item) => {
    const itemToBook = {
        ...item,
        type: activeTab === 'packages' ? 'health_package' : 'lab_test',
        // Add date/time selection logic here if needed
    };
    dispatch(addItem({ item: itemToBook }));
    setBookingModalVisible(false);
    setBookingItem(null);
  };

  const filteredTests = sampleLabTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || test.category.toLowerCase() === selectedCategory.toLowerCase())
  );

  const renderCategoryGrid = () => (
      <View style={styles.categoryGridContainer}>
          {diagnosticCategories.map((cat, index) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryGridItem, selectedCategory === cat.name.toLowerCase() && styles.activeCategoryGridItem]}
                onPress={() => setSelectedCategory(cat.name.toLowerCase())}
              >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
              </TouchableOpacity>
          ))}
      </View>
  )

  return (
    <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Book Lab Tests & Health Checkups</Text>
            <Text style={styles.heroSubtitle}>NABL accredited labs. Free home sample collection.</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#6B7280" style={{marginLeft: 12}} />
            <TextInput
                placeholder="Search for tests, packages..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
            />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Browse by Condition</Text>
        {renderCategoryGrid()}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'packages' && styles.activeTab]}
                onPress={() => setActiveTab('packages')}
            >
                <Text style={[styles.tabText, activeTab === 'packages' && styles.activeTabText]}>Health Packages</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'tests' && styles.activeTab]}
                onPress={() => setActiveTab('tests')}
            >
                <Text style={[styles.tabText, activeTab === 'tests' && styles.activeTabText]}>Individual Tests</Text>
            </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'packages' ? (
            <FlatList
                data={sampleHealthPackages}
                keyExtractor={item => item.id}
                renderItem={({item}) => <HealthPackageCard item={item} onBook={() => handleBookItem(item)} />}
                scrollEnabled={false} // Since it's inside a ScrollView
            />
        ) : (
            <FlatList
                data={filteredTests}
                keyExtractor={item => item.id}
                renderItem={({item}) => <LabTestCard item={item} onBook={() => handleBookItem(item)} />}
                scrollEnabled={false}
            />
        )}

    </ScrollView>
  );
};

// --- Cards for Packages and Tests ---

const HealthPackageCard = ({ item, onBook }) => {
    const discount = Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100);
    return (
        <Animated.View entering={FadeInUp} style={styles.packageCard}>
            <Image source={{ uri: item.image }} style={styles.packageImage} />
            <View style={styles.packageContent}>
                <Text style={styles.packageName}>{item.name}</Text>
                <Text style={styles.packageDescription}>{item.description}</Text>
                <View style={styles.packageInfoRow}>
                    <Icon name="science" size={16} color="#007AFF" />
                    <Text style={styles.packageInfoText}>{item.totalTests} Tests Included</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.packagePrice}>₹{item.discountedPrice}</Text>
                    <Text style={styles.packageMrp}>₹{item.originalPrice}</Text>
                    <View style={styles.discountBadge}><Text style={styles.badgeText}>{discount}% OFF</Text></View>
                </View>
                <TouchableOpacity style={styles.bookButton} onPress={onBook}>
                    <Text style={styles.bookButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const LabTestCard = ({ item, onBook }) => (
    <Animated.View entering={FadeInUp} style={styles.testCard}>
        <View style={{flex: 1}}>
            <Text style={styles.testName}>{item.name}</Text>
            <Text style={styles.testCategory}>{item.category}</Text>
            {item.homeCollectionAvailable &&
                <Text style={styles.homeCollectionText}>✓ Home Collection</Text>}
        </View>
        <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.testPrice}>₹{(item.price * (1 - item.discountPercent / 100)).toFixed(0)}</Text>
            <TouchableOpacity style={styles.bookButtonSmall} onPress={onBook}>
                <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
        </View>
    </Animated.View>
);


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    heroSection: { padding: 24, backgroundColor: '#10B981' },
    heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, margin: 16, elevation: 2, shadowColor: '#000' },
    searchInput: { flex: 1, height: 50, fontSize: 16, paddingLeft: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginBottom: 12 },
    categoryGridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 12 },
    categoryGridItem: { width: '22%', aspectRatio: 1, margin: '1.5%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 4 },
    activeCategoryGridItem: { borderColor: '#007AFF', backgroundColor: '#EAF2FF' },
    categoryIcon: { fontSize: 24 },
    categoryName: { fontSize: 11, textAlign: 'center', marginTop: 4, fontWeight: '500' },
    tabsContainer: { flexDirection: 'row', margin: 16, backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 8 },
    activeTab: { backgroundColor: '#FFFFFF' },
    tabText: { textAlign: 'center', fontWeight: '600', color: '#6B7280' },
    activeTabText: { color: '#007AFF' },
    packageCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 12, elevation: 1, shadowColor: '#000' },
    packageImage: { width: '100%', height: 150, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    packageContent: { padding: 16 },
    packageName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    packageDescription: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
    packageInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    packageInfoText: { fontWeight: '500' },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 16 },
    packagePrice: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
    packageMrp: { textDecorationLine: 'line-through', color: '#9CA3AF' },
    discountBadge: { backgroundColor: '#EF4444', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
    badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
    bookButton: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    bookButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
    testCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 12, elevation: 1 },
    testName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    testCategory: { color: '#6B7280', marginBottom: 8 },
    homeCollectionText: { color: '#10B981', fontWeight: '500' },
    testPrice: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#007AFF' },
    bookButtonSmall: { backgroundColor: '#EAF2FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
});

export default LabTestsScreen;
