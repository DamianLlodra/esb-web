export default (context) => {
  const { store, auth } = context;

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        return resolve(store.commit('setUser', user));
      }
      return resolve();
    });
  });
};
