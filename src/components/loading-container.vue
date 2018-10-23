<template>
  <section
    v-show="active"
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
      active: false,
    };
  },

  methods: {
    open() {
      this.active = true;
    },

    hide() {
      this.active = false;
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
