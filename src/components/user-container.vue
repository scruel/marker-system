<template>
  <section
    class="user-container"
    @click="onHandleExit"
  >
    <!-- <span>{{UsernameProxy}}</span> -->
    <span>登出</span>
    <img
      src="../assets/image/logout.png"
      alt=""
    >
  </section>
</template>

<script>
import Cookies from '../lib/cookies';

export default {
  data() {
    return {};
  },

  //   props: {
  //     username: {
  //         type: String,
  //         default: '',
  //     }
  //   },

  //   computed: {
  //       UsernameProxy() {
  //          return String.prototype.toUpperCase.apply(this.username);
  //       }
  //   },

  methods: {
    onHandleExit() {
      Cookies.setCookie('token', '');
      window.location.reload();
      window.sessionStorage.setItem('count', 0);
      window.sessionStorage.setItem('task', 0);
    },
  },
};
</script>

<style lang="scss" scope>
.user-container {
  cursor: pointer;
  //   position: fixed;
  height: 36px;
  //   top: 5px;
  //   right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #c72923;
  border-radius: 2px;
  padding: 0px 20px;

  //   box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
  //     2px -2px 2px 0 rgba(40, 120, 255, 0.08),
  //     -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
  //     -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  span {
    display: inline-block;
    color: #ffffff;
    margin-right: 5px;
  }

  img {
    width: 24px;
    height: 24px;
  }
}
</style>
