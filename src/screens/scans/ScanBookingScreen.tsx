import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { sampleScans, scanCategories } from '../../data/scans';

const ScanBookingScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredScans = sampleScans.filter(scan =>
    selectedCategory === 'all' || scan.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const renderScanCard = ({ item }) => (
    <View style={styles.scanCard}>
        <Image source={{ uri: item.image }} style={styles.scanImage} />
        <View style={styles.scanContent}>
            <Text style={styles.scanName}>{item.name}</Text>
            <Text style={styles.scanPreparation}>{item.preparation}</Text>
            <View style={styles.footer}>
                <Text style={styles.scanPrice}>₹{(item.price * (1 - item.discountPercent / 100)).toFixed(0)}</Text>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
        {item.discountPercent > 0 && (
            <View style={styles.discountBadge}>
                <Text style={styles.badgeText}>{item.discountPercent}% OFF</Text>
            </View>
        )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Browse by Category</Text>
        </View>
        <View style={styles.categoryGridContainer}>
            {scanCategories.map((cat, index) => (
                <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryGridItem, selectedCategory === cat.name.toLowerCase() && styles.activeCategoryGridItem]}
                    onPress={() => setSelectedCategory(cat.name.toLowerCase())}
                >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <View style={styles.header}>
            <Text style={styles.headerTitle}>Available Scans</Text>
        </View>
        <FlatList
            data={filteredScans}
            renderItem={renderScanCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F8F8' },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    categoryGridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 12, marginBottom: 16 },
    categoryGridItem: { width: '22%', aspectRatio: 1, margin: '1.5%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 4, backgroundColor: '#FFFFFF' },
    activeCategoryGridItem: { borderColor: '#007AFF', backgroundColor: '#EAF2FF' },
    categoryIcon: { fontSize: 28 },
    categoryName: { fontSize: 12, textAlign: 'center', marginTop: 8, fontWeight: '500' },
    listContainer: { paddingHorizontal: 16, paddingBottom: 16 },
    scanCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1 },
    scanImage: { width: '100%', height: 150, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    scanContent: { padding: 16 },
    scanName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    scanPreparation: { fontSize: 14, color: '#6B7280', marginVertical: 8 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    scanPrice: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
    bookButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    bookButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    discountBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#EF4444', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
    badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
});

export default ScanBookingScreen;
