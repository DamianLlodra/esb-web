export default {
  loadFromLocalStorage: (state) => {
    state.products = JSON.parse(localStorage.getItem('products'));
    state.categories = JSON.parse(localStorage.getItem('categories'));
    state.subcategories = JSON.parse(localStorage.getItem('subcategories'));
  },
};
