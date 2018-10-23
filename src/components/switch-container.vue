<template>
  <section
    class="switch-container"
  >
    <img
      v-if="!direction"
      src="../assets/image/left-circle.png"
      alt="prev"
      @click="handlerClick"
    >
    <!-- <span>忽略当前词语</span> -->
    <img
      v-if="direction"
      src="../assets/image/right-circle.png"
      alt="next"
      @click="handlerClick"
    >
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    direction: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handlerClick() {
      if (this.direction) {
        this.$emit('next');
      }

      this.$emit('prev');
    },
  },
};
</script>

<style lang="scss" scope>
.switch-container {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #ffffff;
  padding: 3px;

  span {
    display: inline-block;
    margin-right: 5px;
  }

  img {
    user-select: none;
    width: 42px;
    height: 42px;
    transition: all 0.3s;
  }

  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);
}

// .switch-container:hover {
//   img {
//     width: 60px;
//     height: 60px;
//   }
// }
</style>
