export default {
  roundToTwo(num) {
    return +(Math.round(num + 'e+2') + 'e-2');
  },
  puedeComprar(rules) {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const time = hours * 100 + minutes;
    const desde = +rules.horaDesde.replaceAll(':', '');
    const hasta = +rules.horaHasta.replaceAll(':', '');
    return !(time >= desde && time <= hasta);
  },
};
