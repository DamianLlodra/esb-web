export default {
  setUser(state, user) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
  loadUser(state) {
    state.user = JSON.parse(localStorage.getItem('user'));
  },
};
