export default {
  totalComprado: ({ cart, param }) => {
    if (cart) {
      const totalLista = cart.reduce(
        (total, item) => total + item.price * item.amount,
        0
      );
      const totalPrecio1 = cart.reduce(
        (total, item) => total + (item.price1 || item.price) * item.amount,
        0
      );
      const totalPrecio2 = cart.reduce(
        (total, item) => total + (item.price2 || item.price) * item.amount,
        0
      );
      const total = {
        totalLista,
        totalPrecio1,
        totalPrecio2,
        current: 'totalLista',
      };
      if (totalLista < param.minimoPrecio1) total.current = 'totalLista';
      else if (
        totalPrecio1 >= param.minimoPrecio1 &&
        totalPrecio1 < param.minimoPrecio2
      )
        total.current = 'totalPrecio1';
      else total.current = 'totalPrecio2';
      return total;
    }
  },
  itemInCart: ({ cart }, item) => {
    if (cart) return cart.find((itemCart) => itemCart.id === item.id);
    else return false;
  },
  getParam: ({ param }) => {
    if (param) return param;
    else return false;
  },
};
