import Vue from 'vue';
import VueAlertify from 'vue-alertify';
Vue.use(VueAlertify);
export default (ctx, inject) => {
  inject('alertify', VueAlertify);
};
