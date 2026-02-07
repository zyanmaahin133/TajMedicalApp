import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { addItem, updateQuantity, selectCartItems } from '../../store/slices/cartSlice';

const MedicineDetailsScreen = ({ route, navigation }) => {
  const { medicineId } = route.params;
  const [medicine, setMedicine] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        const doc = await firestore().collection('medicines').doc(medicineId).get();
        if (doc.exists) {
          const medData = { id: doc.id, ...doc.data() };
          setMedicine(medData);

          // Fetch related products
          const relatedSnapshot = await firestore()
            .collection('medicines')
            .where('categoryId', '==', medData.categoryId)
            .limit(5)
            .get();
          const relatedData = relatedSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(item => item.id !== medicineId); // Exclude the current item
          setRelatedProducts(relatedData);

        } else {
          console.log('No such document!');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medicine details: ", error);
        setLoading(false);
      }
    }
    fetchMedicineDetails();
  }, [medicineId]);

  const cartQty = cartItems.find(i => i.id === medicineId)?.quantity || 0;

  const handleAddToCart = () => dispatch(addItem({ item: { ...medicine, type: 'medicine' } }));
  const handleUpdateQuantity = (quantity) => dispatch(updateQuantity({ id: medicineId, quantity }));

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
  }

  if (!medicine) {
    return <View style={styles.container}><Text>Medicine not found.</Text></View>
  }

  const discountedPrice = medicine.price * (1 - (medicine.discountPercent || 0) / 100);

  return (
    <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
            <Image source={{ uri: medicine.image }} style={styles.image} />
            <View style={styles.contentContainer}>
                {medicine.discountPercent > 0 && (
                    <View style={styles.discountBadge}><Text style={styles.badgeText}>{medicine.discountPercent}% OFF</Text></View>
                )}
                <Text style={styles.brand}>{medicine.brand}</Text>
                <Text style={styles.name}>{medicine.name}</Text>
                <Text style={styles.packSize}>{`${medicine.form} • ${medicine.packSize}`}</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₹{discountedPrice.toFixed(0)}</Text>
                    {medicine.discountPercent > 0 && <Text style={styles.mrp}>M.R.P: ₹{medicine.price.toFixed(0)}</Text>}
                </View>

                {medicine.requiresPrescription && (
                    <View style={styles.rxWarning}><Icon name="warning" size={18} color="#D97706" /><Text style={styles.rxWarningText}>Prescription required</Text></View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.sectionContent}>Detailed description for {medicine.name} will be displayed here.</Text>
                </View>

                {relatedProducts.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Related Products</Text>
                        <FlatList horizontal data={relatedProducts} keyExtractor={item => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingVertical: 10}} renderItem={({item}) => (
                            <TouchableOpacity style={styles.relatedCard} onPress={() => navigation.push('MedicineDetails', { medicineId: item.id })}>
                                <Image source={{ uri: item.image }} style={styles.relatedImage} />
                                <View style={styles.relatedContent}>
                                    <Text style={styles.relatedName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.relatedPrice}>₹{(item.price * (1 - (item.discountPercent || 0) / 100)).toFixed(0)}</Text>
                                </View>
                            </TouchableOpacity>
                        )} />
                    </View>
                )}
            </View>
        </ScrollView>

        <View style={styles.footer}>
            {cartQty > 0 ? (
                <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(cartQty - 1)} style={styles.quantityButton}><Icon name="remove" size={24} color="#007AFF" /></TouchableOpacity>
                    <Text style={styles.quantityText}>{cartQty}</Text>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(cartQty + 1)} style={styles.quantityButton}><Icon name="add" size={24} color="#007AFF" /></TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Icon name="add-shopping-cart" size={22} color="#FFFFFF" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: 300 },
    contentContainer: { paddingVertical: 20 },
    discountBadge: { backgroundColor: '#EF4444', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12, marginLeft: 20 },
    badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
    brand: { fontSize: 16, color: '#6B7280', marginBottom: 4, paddingHorizontal: 20 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8, paddingHorizontal: 20 },
    packSize: { fontSize: 16, color: '#6B7280', marginBottom: 16, paddingHorizontal: 20 },
    priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 16, paddingHorizontal: 20 },
    price: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
    mrp: { fontSize: 16, color: '#9CA3AF', textDecorationLine: 'line-through' },
    rxWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginHorizontal: 20, marginBottom: 20, gap: 10 },
    rxWarningText: { color: '#92400E', fontWeight: '500' },
    footer: { padding: 16, paddingTop: 10, paddingBottom: 24, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', elevation: 10 },
    addToCartButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 12, gap: 12 },
    addToCartText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    quantityControl: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#007AFF', borderRadius: 12, paddingVertical: 4 },
    quantityButton: { padding: 12 },
    quantityText: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
    section: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 20, marginTop: 20, paddingBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, paddingHorizontal: 20 },
    sectionContent: { fontSize: 16, color: '#4B5563', lineHeight: 24, paddingHorizontal: 20 },
    relatedCard: { backgroundColor: '#FFFFFF', borderRadius: 12, width: 150, marginRight: 12, borderWidth: 1, borderColor: '#F3F4F6' },
    relatedImage: { width: '100%', height: 100, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    relatedContent: { padding: 10 },
    relatedName: { fontSize: 13, fontWeight: '600' },
    relatedPrice: { fontSize: 14, fontWeight: 'bold', color: '#007AFF', marginTop: 4 },
});

export default MedicineDetailsScreen;
