import SQLite from 'react-native-sqlite-storage';
import { sampleMedicines } from '../data/medicines';

const db = SQLite.openDatabase(
  {
    name: 'TajMedical.db',
    location: 'default',
  },
  () => { console.log('Database opened'); },
  error => { console.error('Error opening database', error); }
);

export const initDatabase = () => {
  db.transaction(tx => {
    // Create tables
    tx.executeSql('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Medicines (id TEXT PRIMARY KEY, name TEXT, genericName TEXT, brand TEXT, price REAL, discountPercent INTEGER, image TEXT, categoryId TEXT, form TEXT, packSize TEXT, requiresPrescription INTEGER)');

    // Check if tables are empty before populating
    tx.executeSql('SELECT COUNT(*) FROM Users', [], (_, { rows }) => {
      if (rows.item(0)['COUNT(*)'] === 0) {
        // Populate Users table
        tx.executeSql('INSERT INTO Users (username, password, role) VALUES (?, ?, ?), (?, ?, ?)', ['admin', 'admin123', 'admin', 'user', 'user123', 'user']);
      }
    });

    tx.executeSql('SELECT COUNT(*) FROM Medicines', [], (_, { rows }) => {
      if (rows.item(0)['COUNT(*)'] === 0) {
        // Populate Medicines table
        sampleMedicines.forEach(med => {
          tx.executeSql('INSERT INTO Medicines (id, name, genericName, brand, price, discountPercent, image, categoryId, form, packSize, requiresPrescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [med.id, med.name, med.genericName, med.brand, med.price, med.discountPercent, med.image, med.categoryId, med.form, med.packSize, med.requiresPrescription ? 1 : 0]);
        });
      }
    });
  });
};

export default db;
