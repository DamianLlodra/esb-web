export default {
  totalComprado: ({ cart }) => {
    if (cart)
      return cart.reduce((total, item) => total + item.price * item.amount, 0);
    else return 0;
  },
};
