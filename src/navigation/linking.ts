const config = {
  screens: {
    App: {
      screens: {
        Home: 'home',
        Pharmacy: {
          screens: {
            ShopStack: 'shop',
            MedicineDetails: 'medicine/:medicineId',
          },
        },
        // ... other screens
      },
    },
    Auth: {
      screens: {
        Login: 'login',
        Signup: 'signup',
      },
    },
    NotFound: '*',
  },
};

const linking = {
  prefixes: ['tajmedical://'],
  config,
};

export default linking;
