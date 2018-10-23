import LoginContainer from '../components/loading-container';

export default {
  /* eslint-disable */
  install(Vue, pluginOptions = {}) {
    const Instance = Vue.extend(LoginContainer);

    let loading = null;

    function $loading() {
      /* eslint-disable */
      return new Promise((resolve, reject) => {
        if (!loading) {
          loading = new Instance();

          loading.$mount();

          document.querySelector('body').appendChild(loading.$el);
        }

        loading.open();
        resolve();
      });
    }

    $loading.close = () =>
      /* eslint-disable */
      new Promise((resolve, reject) => {
        if (!loading || !loading.active) {
          resolve();
        }

        loading.hide();
      });

    /* eslint-disable */
    Vue.prototype.$loading = $loading;
  },
};
