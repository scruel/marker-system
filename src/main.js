// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';

import Loading from './plugins/loading';

Vue.config.productionTip = false;

Vue.use(Loading);

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
/* eslint-disable no-new */
