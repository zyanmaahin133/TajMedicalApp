import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { addItem, updateQuantity, selectCartItems } from '../../store/slices/cartSlice';

const MedicineCard = ({ medicine, onAddToCart, onUpdateQuantity, cartQty }) => {
  const navigation = useNavigation();
  const discountedPrice = medicine.price * (1 - (medicine.discountPercent || 0) / 100);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('MedicineDetails', { medicineId: medicine.id })}>
        <Image source={{ uri: medicine.image }} style={styles.cardImage} />
        {medicine.discountPercent > 0 && (
          <View style={styles.discountBadge}><Text style={styles.badgeText}>{medicine.discountPercent}% OFF</Text></View>
        )}
        {medicine.requiresPrescription && (
          <View style={styles.rxBadge}><Text style={styles.badgeText}>Rx</Text></View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.brandText}>{medicine.brand}</Text>
          <Text style={styles.medicineName} numberOfLines={2}>{medicine.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{discountedPrice.toFixed(0)}</Text>
            {medicine.discountPercent > 0 && <Text style={styles.mrp}>₹{medicine.price.toFixed(0)}</Text>}
          </View>
        </View>
      </TouchableOpacity>

      {cartQty > 0 ? (
        <View style={styles.quantityControl}>
            <TouchableOpacity onPress={() => onUpdateQuantity(medicine.id, cartQty - 1)} style={styles.quantityButton}><Icon name="remove" size={20} color="#007AFF" /></TouchableOpacity>
            <Text style={styles.quantityText}>{cartQty}</Text>
            <TouchableOpacity onPress={() => onUpdateQuantity(medicine.id, cartQty + 1)} style={styles.quantityButton}><Icon name="add" size={20} color="#007AFF" /></TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addToCartButton} onPress={() => onAddToCart(medicine)}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ShopScreen = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicinesSnapshot = await firestore().collection('medicines').get();
        const medicinesData = medicinesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMedicines(medicinesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medicines: ", error);
        setLoading(false);
      }
    }
    fetchMedicines();
  }, []);

  const getCartQuantity = (medicineId) => {
    const item = cartItems.find(i => i.id === medicineId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (medicine) => {
    dispatch(addItem({ item: { ...medicine, type: 'medicine' } }));
  };

  const handleUpdateQuantity = (medicineId, quantity) => {
    dispatch(updateQuantity({ id: medicineId, quantity }));
  };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <MedicineCard
            medicine={item}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            cartQty={getCartQuantity(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gridContainer: { padding: 8 },
  card: { flex: 1, margin: 8, backgroundColor: '#FFFFFF', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 1 } },
  cardImage: { width: '100%', height: 140, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  discountBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#EF4444', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  rxBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  cardContent: { padding: 12 },
  brandText: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  medicineName: { fontSize: 15, fontWeight: '600', color: '#1F2937', height: 40 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  mrp: { fontSize: 13, color: '#9CA3AF', textDecorationLine: 'line-through' },
  addToCartButton: { backgroundColor: '#EAF2FF', margin: 12, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  addToCartText: { color: '#0059B3', fontWeight: 'bold' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 12, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8 },
  quantityButton: { padding: 8 },
  quantityText: { fontSize: 16, fontWeight: 'bold' },
});

export default ShopScreen;
