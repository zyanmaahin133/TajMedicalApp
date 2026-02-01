import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sampleMedicines } from '../data/medicines';

const WholesaleScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderList, setOrderList] = useState([]);

  const filteredMedicines = searchQuery
    ? sampleMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const addToOrder = (medicine) => {
    setOrderList(prevList => {
      const existingItem = prevList.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevList.map(item =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevList, { ...medicine, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity > 0) {
      setOrderList(prevList =>
        prevList.map(item => (item.id === medicineId ? { ...item, quantity } : item))
      );
    } else {
      setOrderList(prevList => prevList.filter(item => item.id !== medicineId));
    }
  };

  const generatePdf = () => {
    // PDF generation logic will be added here
    Alert.alert('PDF Generated', 'Your order has been saved as a PDF.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Wholesale Order</Text>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#6B7280" />
        <TextInput
          placeholder="Search & Add Medicines"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {searchQuery.length > 0 && (
        <FlatList
          style={styles.resultsList}
          data={filteredMedicines}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => addToOrder(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Order List</Text>
        <FlatList
          data={orderList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Icon name="remove-circle-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Icon name="add-circle-outline" size={24} color="#10B981" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyListText}>Your order list is empty.</Text>}
        />
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generatePdf} disabled={orderList.length === 0}>
        <Icon name="picture-as-pdf" size={24} color="#FFFFFF" />
        <Text style={styles.generateButtonText}>Generate PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 2,
    marginBottom: 8,
  },
  searchInput: { flex: 1, height: 50, fontSize: 16, marginLeft: 8 },
  resultsList: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
  },
  resultItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  listContainer: { flex: 1, marginTop: 16 },
  listTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#1F2937' },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: { flex: 1, fontSize: 16 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityText: { fontSize: 16, fontWeight: '600' },
  emptyListText: { textAlign: 'center', marginTop: 32, color: '#6B7280' },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
    gap: 12,
  },
  generateButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default WholesaleScreen;
