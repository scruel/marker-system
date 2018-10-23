export default {
  /* eslint-disable */
  getCookie(cname) {
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return '';
  },

  setCookie(cname, cvalue, exdays, cpath = '/') {
    // const d = new Date();
    // d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    // const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${cname}=${cvalue};`;
  },
  /* eslint-disable */
};
