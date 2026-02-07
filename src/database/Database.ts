import firestore from '@react-native-firebase/firestore';
import { sampleMedicines } from '../data/medicines'; // Assuming you still want to use this for initial data

// A function to initialize the database with collections and initial data.
export const initDatabase = async () => {
  console.log('Initializing database...');

  // Create a default 'admin' and 'user' upon first launch if they don't exist
  const adminUser = await firestore().collection('users').doc('admin').get();
  if (!adminUser.exists) {
    await firestore().collection('users').doc('admin').set({
      email: 'admin@tajmedical.com',
      role: 'admin',
    });
    console.log('Admin user created');
  }

  // Check if medicines collection is empty, then populate it
  const medicinesSnapshot = await firestore().collection('medicines').limit(1).get();
  if (medicinesSnapshot.empty) {
    console.log('Populating medicines...');
    const batch = firestore().batch();
    sampleMedicines.forEach(med => {
      const docRef = firestore().collection('medicines').doc(med.id);
      batch.set(docRef, med);
    });
    await batch.commit();
    console.log('Medicines populated.');
  }

  console.log('Database initialization complete.');
};
