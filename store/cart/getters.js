export default {
  totalComprado: ({ cart }) => {
    if (cart)
      return cart.reduce(
        (total, item) => (total + item.price) * item.amount,
        0
      );
    else return 0;
  },
  itemInCart: ({ cart }, item) => {
    if (cart) return cart.find((itemCart) => itemCart.id === item.id);
    else return false;
  },
};
