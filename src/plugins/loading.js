import LoginContainer from '../components/loading-container';

export default {
  install(Vue, pluginOptions = {}) {
    const Instance = Vue.extend(LoginContainer);

    let loading = null;

    function $loading() {
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
      new Promise((resolve, reject) => {
        if (!loading || !loading.active) {
          resolve();
        }

        loading.hide();
      });

    Vue.prototype.$loading = $loading;
  },
};
