<template>
  <transition name="fade">
    <section
      v-if="display"
      class="tip-container"
    >
      <span>{{message}}</span>
    </section>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      display: false,
    };
  },

  props: {
    message: {
      type: String,
      default: 'Tip In System',
    },
  },

  methods: {
    handlerError() {
      this.display = true;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.display = false;
      }, 1500);
    },
  },
};
</script>

<style lang="scss" scope>
.tip-container {
  position: absolute;
  z-index: 10001;
  background-color: #c72923;

  top: 10px;
  right: 10px;

  font-size: 18px;
  color: #ffffff;
  padding: 20px 20px;
  border-radius: 4px;

  box-shadow: 4px 4px 4px 0 rgba(40, 120, 255, 0.08),
    4px -4px 4px 0 rgba(40, 120, 255, 0.08),
    -4px -4px 4px 0 rgba(40, 120, 255, 0.08),
    -4px 4px 4px 0 rgba(40, 120, 255, 0.08);
}

.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.5s;
}
.tip-enter,
.tip-leave-to {
  opacity: 0;
}
</style>
