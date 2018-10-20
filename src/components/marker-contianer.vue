<template>
  <section
    class="marker-container"
    :class="{mactive: active}"
    @mouseenter="onSelectShoot"
    @mouseleave="onCancalShoot"
  >
    <span>{{marker.name}}</span>
    <span>{{marker.belong}}</span>
  </section>
</template>

<script>
export default {
  data() {
    return {
      active: false,
    };
  },

  props: {
    marker: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    word: {
      type: Object,
      default: () => ({}),
      require: true,
    },
  },

  methods: {
    onTestEvent() {
      console.log('====================================');
      console.log('dala');
      console.log('====================================');
    },

    onSelectShoot() {
      if (!this.word) {
        return;
      }
      this.active = true;
      this.$emit('select', this.marker);
    },

    onCancalShoot() {
      this.active = false;
      this.$emit('cancal', null);
    },
  },
};
</script>

<style lang="scss" scope>
.marker-container {
  // border: 1px solid #1e1e1e;
  border-radius: 4px;
  padding: 10px 20px;
  background: #ffffff;
  width: 200px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  // line-height: 60px;

  box-shadow: 2px 2px 2px 0 rgba(40, 120, 255, 0.08),
    2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px -2px 2px 0 rgba(40, 120, 255, 0.08),
    -2px 2px 2px 0 rgba(40, 120, 255, 0.08);

  span:nth-of-type(1) {
    // user-select: none;
    font-size: 18px;
  }

  span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #288ed8;
  }

  transition: all 0.1s;
}

.mactive {
  width: 240px;
  color: #ffffff;
  background-color: #c72923;
}
</style>
