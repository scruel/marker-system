<template>
  <section
    v-show="logging"
    class="dankal-loding"
  >
    <div class="modal"></div>
    <img
      class="loading-animation"
      src="../assets/image/loading.gif"
      alt=""
      srcset=""
    >
  </section>
</template>

<script>
export default {
  data() {
    return {
      logging: false,
    };
  },

  methods: {
    open() {
      this.logging = true;
    },

    hide() {
      this.logging = false;
    },
  },
};
</script>

<style lang="scss" scope>
.dankal-loding {
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(50, 47, 81, 0.9);
  }

  .loading-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 160px;
    height: 160px;
  }
}
</style>
