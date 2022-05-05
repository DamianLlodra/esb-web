import util from '../../functions/util.js';

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
        totalLista: util.roundToTwo(totalLista),
        totalPrecio1: util.roundToTwo(totalPrecio1),
        totalPrecio2: util.roundToTwo(totalPrecio2),
        current: 'totalLista',
        points: 0,
      };
      if (totalLista < param.minimoPrecio1) total.current = 'totalLista';
      else if (
        totalPrecio1 >= param.minimoPrecio1 &&
        totalPrecio1 < param.minimoPrecio2
      )
        total.current = 'totalPrecio1';
      else if (totalPrecio2 >= param.minimoPrecio2)
        total.current = 'totalPrecio2';

      const currentTotal = total[total.current];
      if (param && param.puntos) {
        const puntos = param.puntos.find(
          (p) =>
            p.importeDesde <= currentTotal && p.importeHasta >= currentTotal
        );

        total.points = puntos ? puntos.puntos : 0;
      }
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
  getPoints: ({ param }, total) => {},
};
