export const sampleScans = [
  {
    id: 'scan1',
    name: 'X-Ray (Chest)',
    category: 'X-Ray',
    price: 500,
    discountPercent: 10,
    preparation: 'No special preparation required.',
    image: 'https://i.imgur.com/example_xray.jpg'
  },
  {
    id: 'scan2',
    name: 'MRI (Brain)',
    category: 'MRI',
    price: 7000,
    discountPercent: 15,
    preparation: 'Fasting for 4-6 hours may be required.',
    image: 'https://i.imgur.com/example_mri.jpg'
  },
  {
    id: 'scan3',
    name: 'CT Scan (Abdomen)',
    category: 'CT Scan',
    price: 4500,
    discountPercent: 10,
    preparation: 'Oral contrast may be required. Do not eat for 3 hours prior.',
    image: 'https://i.imgur.com/example_ct.jpg'
  },
  {
    id: 'scan4',
    name: 'Ultrasound (Abdomen)',
    category: 'Ultrasound',
    price: 1200,
    discountPercent: 20,
    preparation: 'Fasting for 6-8 hours is required.',
    image: 'https://i.imgur.com/example_usg.jpg'
  },
    {
    id: 'scan5',
    name: 'ECG',
    category: 'ECG',
    price: 300,
    discountPercent: 0,
    preparation: 'No special preparation required.',
    image: 'https://i.imgur.com/example_ecg.jpg'
  }
];

export const scanCategories = [
    { id: 'scancat1', name: 'X-Ray', icon: '🦴' },
    { id: 'scancat2', name: 'MRI', icon: '🧠' },
    { id: 'scancat3', name: 'CT Scan', icon: '🌀' },
    { id: 'scancat4', name: 'Ultrasound', icon: '🤰' },
    { id: 'scancat5', name: '2D Echo', icon: '❤️' },
    { id: 'scancat6', name: 'Mammography', icon: '🎀' },
    { id: 'scancat7', name: 'ECG', icon: '⚡' },
    { id: 'scancat8', name: 'EEG', icon: '📈' },
];
