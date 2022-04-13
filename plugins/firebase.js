import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';

export default ({}, inject) => {
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

    getPaginator(collection, order, limit, searchIn, operator, searchValue) {
      return {
        collection,
        order: searchIn || order,
        limit,
        firstDocument: null,
        lastDocument: null,
        data: [],
        page: 1,
        searchIn,
        searchValue,
        operator,
      };
    },
    async getPage(paginator, direction) {
      console.log(paginator);
      console.log(direction);
      const collRef = await firebase
        .firestore()
        .collection(paginator.collection);

      let query1;

      if (paginator.searchIn && paginator.searchValue) {
        query1 = collRef.where(
          paginator.searchIn,
          paginator.operator,
          paginator.searchValue
        );
      }

      const query2 = (query1 || collRef).orderBy(paginator.order);
      let query3;
      if (direction) {
        if (direction === 'next') {
          query3 = query2
            .startAfter(paginator.lastDocument)
            .limit(paginator.limit);
        } else {
          query3 = query2
            .endBefore(paginator.firstDocument)
            .limitToLast(paginator.limit);
        }
      } else {
        query3 = query2.limit(paginator.limit);
      }

      const collection = query3.get().then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        if (direction) {
          paginator.page =
            direction === 'next' ? paginator.page + 1 : paginator.page - 1;
        } else {
          paginator.page = 1;
        }

        paginator.data = data;
        paginator.firstDocument = snapshot.docs[0];
        paginator.lastDocument = snapshot.docs[snapshot.docs.length - 1];
        return paginator;
      });
      return collection;
    },

    async getNextPage(paginator) {
      let collection = await firebase
        .firestore()
        .collection(paginator.collection);
      if (paginator.searchIn && paginator.searchValue) {
        collection = collection.where(
          paginator.searchIn,
          paginator.operator,
          paginator.searchValue
        );
      }
      if (paginator.order !== paginator.searchIn) {
        collection = collection
          .orderBy(paginator.order)
          .startAfter(paginator.lastDocument)
          .limit(paginator.limit);
      }

      collection = collection.get().then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        paginator.page++;
        paginator.data = data;
        paginator.lastDocument = snapshot.docs[snapshot.docs.length - 1];
        return paginator;
      });
      return collection;
    },
    async getPreviousPage(paginator) {
      let collection = await firebase
        .firestore()
        .collection(paginator.collection);
      if (paginator.searchIn && paginator.searchValue) {
        collection = collection.where(
          paginator.searchIn,
          paginator.operator,
          paginator.searchValue
        );
        if (paginator.operator === '>=') {
          collection = collection.where(
            paginator.searchIn,
            '<=',
            paginator.searchValue + '\uF8FF'
          );
        }
      }
      if (paginator.order !== paginator.searchIn) {
        collection = collection
          .orderBy(paginator.order)
          .endBefore(paginator.firstDocument)
          .limit(paginator.limit);
      }
      collection = collection.get().then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        paginator.page--;
        paginator.data = data;
        paginator.lastDocument = snapshot.docs[snapshot.docs.length - 1];
        return paginator;
      });
      return collection;
    },
  };

  inject('dal', dal);
};
