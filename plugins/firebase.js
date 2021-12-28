import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';

export default ({ env, store }, inject) => {
  const config = {
    apiKey: 'AIzaSyASVQfM8XTnTeJ-XORJIzbFAOe2auVRrKc',
    authDomain: 'esb-web.firebaseapp.com',
    projectId: 'esb-web',
    storageBucket: 'esb-web.appspot.com',
    messagingSenderId: '1091483663831',
    appId: '1:1091483663831:web:002622154e05354ee35f92',
    measurementId: 'G-QC5SXYJQ6B',
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  inject('firebase', firebase);
  inject('storage', firebase.storage());

  inject('firestore', firebase.firestore());

  const dal = {
    async save(collection, data) {
      console.log(data.id);
      return await firebase
        .firestore()
        .collection(collection)
        .doc(data.id)
        .set(data, { merge: true });
    },
    async saveAll(collection, data) {
      await data.forEach(async (item) => {
        await firebase
          .firestore()
          .collection(collection)
          .doc(item.id)
          .set(item, { merge: true });
      });
    },
    async getAll(collection) {
      return await firebase
        .firestore()
        .collection(collection)
        .get()
        .then((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push(doc.data());
          });
          return data;
        });
    },
    async getById(collection, id) {
      return await firebase
        .firestore()
        .collection(collection)
        .doc(id)
        .get()
        .then((doc) => {
          return doc.data();
        });
    },
    async getSubcategoriesByCategory(category) {
      return await firebase
        .firestore()
        .collection('subcategories')
        .where('category', '==', category)
        .get()
        .then((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push(doc.data());
          });
          return data;
        });
    },
    async getProductsByCategory(category) {
      return await firebase
        .firestore()
        .collection('products')
        .where('category', '==', category)
        .get()
        .then((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push(doc.data());
          });
          return data;
        });
    },
    async getLastUpdateProducts(lastDownload) {
      return await firebase
        .firestore()
        .collection('products')
        .where('lastUpdate', '>', lastDownload)
        .get()
        .then((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push(doc.data());
          });
          return data;
        });
    },
  };

  inject('dal', dal);
};
