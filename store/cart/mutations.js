export default {
  addChangeItemCart(state, { amount, item }) {
    const itemCart = state.cart.find((itemCart) => itemCart.id === item.id);
    if (itemCart) {
      if (amount === 0) {
        const index = state.cart.indexOf(itemCart);
        state.cart.splice(index, 1);
      } else {
        itemCart.amount = amount;
      }
    } else {
      item.amount = amount;
      state.cart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(state.cart));
  },
  removeItemCart(state, item) {
    state.cart.splice(state.cart.indexOf(item), 1);
    localStorage.setItem('cart', JSON.stringify(state.cart));
  },
  load(state, cartLocal) {
    state.cart = cartLocal;
    localStorage.setItem('cart', JSON.stringify(state.cart));
  },
  removeAll(state) {
    state.cart = [];
    localStorage.setItem('cart', JSON.stringify(state.cart));
  },
};
